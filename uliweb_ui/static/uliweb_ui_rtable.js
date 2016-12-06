/**
 * DataSet
 *
 * Usage:
 *     var dataSet = new DataSet({
 *         idField: '_id',
 *         type: {
 *             // ...
 *         }
 *     });
 *
 *     dataSet.add(item);
 *     dataSet.add(data); //array data
 *     dataSet.update(item);
 *     dataSet.update(data); //array data
 *     dataSet.remove(id);
 *     dataSet.remove(ids); //array data
 *     var data = dataSet.get();
 *     var data = dataSet.get(id);
 *     var data = dataSet.get(ids);
 *     var data = dataSet.get(ids, options, data);
 *     dataSet.clear();
 *
 * A data set can:
 * - add/remove/update data
 * - gives triggers upon changes in the data
 * - can  import/export data in various data formats
 *
 * @param {Array} [data]    Optional array with initial data
 * @param {Object} [options]   Available options:
 *                             {String} idField Field name of the id in the
 *                                              items, 'id' by default.
 *                             {Object.<String, String} type
 *                                              A map with field names as key,
 *                                              and the field type as value.
 *                             {Object} queue   Queue changes to the DataSet,
 *                                              flush them all at once.
 *                                              Queue options:
 *                                              - {number} delay  Delay in ms, null by default
 *                                              - {number} max    Maximum number of entries in the queue, Infinity by default
 * @constructor DataSet
 */
function DataSet(data, options) {
  // correctly read optional arguments
  if (data && !Array.isArray(data)) {
    options = data;
    data = null;
  }

  this._data = []; // map with data indexed by id
  this._ids = {};
  this.setOption(options);
  this.length = 0; // number of items in the DataSet
  this._type = {}; // internal field types (NOTE: this can differ from this._options.type)
  this._mute = false; //used to toggle event trigger status
  this._saved = [];   //saved data

  // all variants of a Date are internally stored as Date, so we can convert
  // from everything to everything (also from ISODate to Number for example)
  if (this._options.type) {
    for (var field in this._options.type) {
      if (this._options.type.hasOwnProperty(field)) {
        var value = this._options.type[field];
        if (value == 'Date' || value == 'ISODate' || value == 'ASPDate') {
          this._type[field] = 'Date';
        } else {
          this._type[field] = value;
        }
      }
    }
  }

  this._subscribers = {}; // event subscribers

  //init async function
  this.remove = this.async_call(remove);

  // add initial data when provided
  if (data) {
    this.add(data);
  }
}

DataSet.prototype.setOption = function(options) {
  this._options = options || {}
  this._idField = this._options.idField || 'id'; // name of the field containing id
  this._parentField = this._options.parentField || 'parent'; //name of the parent field containing id
  this._childField = this._options.childField || 'nodes';
  this._orderField = this._options.orderField || 'order';
  this._levelField = this._options.levelField || 'level';
  this._hasChildrenField = this._options.hasChildrenField || 'has_children';
  this._isTree = this._options.tree || false;
}

/**
 * Subscribe to an event, add an event listener
 * @param {String} event        Event name. Available events: 'put', 'update',
 *                              'remove'
 * @param {function} callback   Callback method. Called with three parameters:
 *                                  {String} event
 *                                  {Object | null} params
 *                                  {String | Number} senderId
 */
DataSet.prototype.on = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (!subscribers) {
    subscribers = [];
    this._subscribers[event] = subscribers;
  }

  subscribers.push({
    callback: callback
  });
};

/**
 * Unsubscribe from an event, remove an event listener
 * @param {String} event
 * @param {function} callback
 */
DataSet.prototype.off = function (event, callback) {
  var subscribers = this._subscribers[event];
  if (subscribers) {
    this._subscribers[event] = subscribers.filter(function (listener) {
      return listener.callback != callback;
    });
  }
};

DataSet.prototype.mute = function (flag) {
  this._mute = flag === undefined ? true : flag
}

/**
 * Trigger an event
 * @param {String} event
 * @param {Object | null} params
 * @param {String} [senderId]       Optional id of the sender.
 * @private
 */
DataSet.prototype._trigger = function (event, params, senderId) {
  if (this._mute) return
  if (event == '*') {
    throw new Error('Cannot trigger event *');
  }

  var subscribers = [];
  if (event in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers[event]);
  }
  if ('*' in this._subscribers) {
    subscribers = subscribers.concat(this._subscribers['*']);
  }

  for (var i = 0; i < subscribers.length; i++) {
    var subscriber = subscribers[i];
    if (subscriber.callback) {
      subscriber.callback(event, params, senderId || null);
    }
  }
};

/**
 * Get an item id
 * @param {Object | Number | String} item
 * @private
 */
DataSet.prototype.getId = function (item) {
    if (item instanceof Object)
      return item[this._idField]
    else {
      return item
    }
};

DataSet.prototype.async_call = function (f) {
  var me = this
  var _f = function (id, url) {
    var func

    if (url) {
      if (typeof url === 'string') {
        func = function(){
          return $.post(url)
        }
      } else if (typeof url === 'function') {
        func = url
      } else {
        throw new Error("url should be string or function type")
      }
      return $.when(func()).done(function(data){
        ret = f.call(me, data.data)
        return ret
      })
    } else {
      return f.call(me, id)
    }
  }
  return _f
};

DataSet.prototype.add = function (data, parent) {
  return this._add(data, parent, 'after')
}

DataSet.prototype.addFirstChild = function (data, parent) {
  return this._add(data, parent, 'first')
}

/**
 * Add data.
 * Adding an item will fail when there already is an item with the same id.
 * @param {Object | Array} data
 * @param {String} [parentId] Optional parent id
 * @return {Array} addedIds      Array with the ids of the added items
 */
DataSet.prototype._add = function (data, parent, position) {
  var addedIds = [],
      id,
      me = this, level, item, p;

  if (Array.isArray(data)) {
    // Array
    for (var i = 0, len = data.length; i < len; i++) {
      item = data[i]
      if (me._isTree && i>0 && item[me._parentField]) {
        p = me.get(item[me._parentField])
        if (!p)
            p = parent
        id = me._addItem(item, p, position)
      } else
        id = me._addItem(item, parent, position);
      addedIds.push(id);
      if (item[me._childField] && item[me._childField].length > 0) {
        addedIds.concat(me.add(item[me._childField], item[me._idField]))
      }
    }
  } else if (data instanceof Object) {
    // Single item
    id = me._addItem(data, parent, position);
    addedIds.push(id);
    if (data[me._childField] && data[me._childField].length > 0) {
      addedIds.concat(me.add(data[me._childField], data[me._idField]))
    }
  } else {
    throw new Error('Unknown dataType');
  }

  if (addedIds.length) {
    this._trigger('add', { items: addedIds });
  }

  return addedIds;
};

DataSet.prototype.insertBefore = function (data, index) {
  return this._insert(data, index, 'before')
}

DataSet.prototype.insertAfter = function (data, index) {
  return this._insert(data, index, 'after')
}

/**
 * Insert data.
 * Inserting an item will fail when there already is an item with the same id.
 * @param {Object | Array} data
 * @param {String} [parentId] Optional parent id
 * @return {Array} addedIds      Array with the ids of the added items
 */
DataSet.prototype._insert = function (data, target, position) {
  var addedIds = [],
      id,
      me = this, delta, parent;

  index = this.index(target);

  if (Array.isArray(data)) {
    // Array
    for (var i = 0, len = data.length; i < len; i++) {
      if (i==0) {
        if (me._isTree)
          delta = data[0][me._levelField] - target[me._levelField]
        else {
          delta = 0
        }
      } else {
        if (addedIds.indexOf(data[i][me._parentField])>=0)
          parent = data[i][me._parentField]
      }
      if (position == 'before')
        id = me._insertItem(data[i], index+i, 'before', delta, parent);
      else {
        id = me._insertItem(data[i], index, 'after', delta, parent);
        index = id.index
      }
      addedIds.push(id.id);
    }
  } else if (data instanceof Object) {
    // Single item
    if (position == 'before')
      id = me._insertItem(data, index, 'before');
    else {
      id = me._insertItem(data, index, 'after');
    }
    addedIds.push(id.id);
  } else {
    throw new Error('Unknown dataType');
  }
  this._resetIds(index)

  if (addedIds.length) {
    this._trigger('add', { items: addedIds });
  }

  return addedIds;
};

DataSet.prototype._findLastFirstLevelNode = function () {
  var i, len, node

  for(len=this._data.length, i=len-1; i>-1; i--) {
    node = this._data[i]
    if (!node[this._parentField] || node[this._parentField] == 0) {
      return node
    }
  }
}
/**
 * Insert a single item before index. Will fail when an item with the same id already exists.
 * @param {Object} item
 * @param {Number} index
 * @param {Number | String | Object} Parent id
 * @return {String} id
 * @private
 */
DataSet.prototype._insertItem = function (item, index, position, delta, parent) {
  var id = item[this._idField], node = this._data[index];
  delta = delta == undefined ? 0 : delta

  if (id != undefined) {
    // check whether this id is already taken
    if (this._ids.hasOwnProperty(id)) {
      // item already exists
      throw new Error('Cannot add item: item with id ' + id + ' already exists');
    }
  } else {
    // generate an id
    id = util.uuid.v4();
    item[this._idField] = id;
  }

  var d = {};
  for (var field in item) {
    if (item.hasOwnProperty(field)) {
      var fieldType = this._type[field]; // type may be undefined
      d[field] = util.convert(item[field], fieldType);
    }
  }

  if (position == 'before')
    this._data.splice(index, 0, d);
  else {
    index = this._findNext(index)
    if (index == -1) {
      this._data.push(d)
      index = this.length
    }
    else {
      this._data.splice(index, 0, d)
    }
  }
  this.length++;
  var last_order, level, x
  if (this._isTree) {
    if (node) {
      d[this._parentField] = parent || node[this._parentField]
      if (!d[this._levelField])
        d[this._levelField] = node[this._levelField]
      if (!d[this._orderField] || index + 1 == this.length) {
        if (position == 'after')
          d[this._orderField] = node[this._orderField] + 1
        else
          d[this._orderField] = node[this._orderField]
      }

      level = node[this._levelField]
      last_order = d[this._orderField]

      this._reOrder(index+1, level, last_order)

    } else {
      d[this._parentField] = 0
      if (!d[this._levelField])
        d[this._levelField] = 0
      if (!d[this._orderField]) {
        if (position == 'after') {
          node = this._findLastFirstLevelNode()
          if (node) {
            d[this._orderField] = node.order
          } else {
            d[this._orderField] = 1
          }
        } else
          d[this._orderField] = 1
      }
    }

  }

  return {id:id, index:index};
};

DataSet.prototype._reOrder = function (index, level, last_order) {
  var i, len, item, _l;
  for(i=index, len=this._data.length; i<len; i++) {
    item = this._data[i]
    _l = item[this._levelField]
    if (_l>level) continue
    else if (_l==level) {
      if(item[this._orderField]<=last_order) {
        last_order ++
        item[this._orderField] = last_order
      }
    } else {
      break
    }
  }
}

DataSet.prototype.move = function (item, target, position) {
  return this._move(item, target, position)
}

DataSet.prototype._resetLevel = function (items, level) {
  var delta, me=this

  for(var i=0, _len=items.length; i<_len; i++) {
    if (i== 0) {
      delta = items[i][me._levelField] - level
    }
    items[i][me._levelField] -= delta
  }
}

DataSet.prototype._move = function (item, target, position) {
  var me = this, updatedIds = [], addedIds = [], order, index, next, items, len,
    ids, level

  if (me.isChild(target, item))
    throw new Error('Target nodes could not be child')

  if (me.getId(item) == me.getId(target)) return
  me.mute(true)

  index = me.index(item)
  next = me._findNext(index)
  if (next == -1) {
    len = me.length - index
  } else {
    len = next - index
  }
  items = me._data.splice(index, len)
  me.length -= items.length
  me._resetParent(index)
  me._resetIds()
  //save level
  if (position == 'before') {
    level = target[me._levelField]
    me._resetLevel(items, level)
    ids = me.insertBefore(items, target)
  } else if (position == 'after') {
    level = target[me._levelField]
    me._resetLevel(items, level)
    ids = me.insertAfter(items, target)
  } else if (position == 'child') {
    level = target[me._levelField] + 1
    me._resetLevel(items, level)
    ids = me.add(items, target)
  }
  for(var i=0, _len=ids.length; i<_len; i++) {
    updatedIds.push(ids[i])
  }

  me.mute(false)

  if (updatedIds.length) {
    me._trigger('update', { items: updatedIds });
  }

  return updatedIds
}
/**
 * Find next element for tree
 * @param {Number} Index for element
 */
DataSet.prototype._findNext = function (index) {
  if (index === undefined) return -1
  var n = index + 1

  if (n >= this.length) return -1
  if (this._isTree) {
    var level, v, parent = this._data[index], i, len

    level = parent[this._levelField]
    for (i=n, len=this.length; i<len; i++) {
      v = this._data[i][this._levelField]
      if (v>level) continue
      else break
    }
    if (i >= this.length) return -1
    return i
  } else return n
}

/*
 * Test is a row has child node
 */
DataSet.prototype.has_child = function (row) {
  var me = this
  if (me._isTree) {
    var index = me.index(row)
    if (index+1 >= me.length) return false

    return (me._data[index+1][me._parentField] == me._data[index][me._idField])
  }
  return false
}

/**
 * Update existing items via ajax request or just plain data
 * @param {String} url if no url then it'll use options.url
 *                 require jquery
 * examples:
 *   load('abc/def')
 *   load('abc/def', {parent:1})
 *   load('abc/def', {parent:1}, function(){})
 *   load('abc/def', function(){})
 *   load(function(){})
 */
DataSet.prototype.load = function (url, param, callback) {
  var me = this
  this.url = url;
  if (typeof url === 'string') {
    if (typeof param === 'function') {
      callback = param
      param = {}
    }
    me._trigger('loading')
    return $.getJSON(url || this._options.url, param).done(function(r) {
        me.mute()
        me._data = [];
        me._ids = {};
        me.length = 0;
        if (callback) me.add(callback(r))
        else me.add(r)
        me.mute(false)
        me._trigger('load')
      })
  } else {
    me._trigger('loading')
    me.mute()
    me._data = [];
    me._ids = {};
    me.length = 0;
    if (callback) me.add(callback(url))
    else me.add(url)
    me.mute(false)
    me._trigger('load')
  }
}

DataSet.prototype.load_tree = function (url, param, callback) {
  var me = this, opts = {}
  var f
  this._data = [];
  this._ids = {};
  this.length = 0;
  this.url = url;

  var _post = function(){
    if (typeof callback != 'function' && callback instanceof Object) {
      opts = callback
    }
    opts.plain = true

    var d = me.tree(opts)
    me._data = [];
    me._ids = {};
    me.length = 0;
    me.mute()
    me.add(d);
    me.mute(false)
    me._trigger('load')
  }

  if (typeof url === 'string') {
    if (typeof param === 'function') {
      callback = param
      param = {}
    }

    me._trigger('loading')
    return $.getJSON(url || this._options.url, param).done(function(r) {
        me._isTree = false
        me.mute()
        if (callback) me.add(callback(r))
        else me.add(r)
        me.mute(false)
        me._isTree = true
        _post()
      })
  } else {
    me._trigger('loading')
    me._isTree = false
    me.mute()
    if (typeof callback == 'function')
      me.add(callback(url))
    else me.add(url)
    me.mute(false)
    me._isTree = true
    _post()
  }
}

/**
 * Test if a node is a child of parent
 * @param {Object} Node will be testing
 * @param {Object} Parent node
 */
DataSet.prototype.isChild = function(item, parent) {
  var me = this, p
  if (me._isTree) {
    p = item[me._parentField]
    while (p) {
      if (me.getId(p) == me.getId(parent)) return true
      p = p[me._parentField]
    }
  }
}
/**
 * Update existing items. When an item does not exist, it will be created
 * @param {Object | Array} data
 * @param {String} [senderId] Optional sender id
 * @return {Array} updatedIds     The ids of the added or updated items
 */
DataSet.prototype.update = function (data, senderId) {
  var addedIds = [];
  var updatedIds = [];
  var updatedData = [];
  var me = this;
  var idField = me._idField;

  var addOrUpdate = function addOrUpdate(item) {
    var id = item[idField];
    if (me._ids.hasOwnProperty(id)) {
      // update item
      id = me._updateItem(item);
      updatedIds.push(id);
      updatedData.push(item);
    } else {
      // add new item
      id = me._addItem(item);
      addedIds.push(id);
    }
  };

  if (Array.isArray(data)) {
    // Array
    for (var i = 0, len = data.length; i < len; i++) {
      addOrUpdate(data[i]);
    }
  } else if (data instanceof Object) {
    // Single item
    addOrUpdate(data);
  } else {
    throw new Error('Unknown dataType');
  }

  if (addedIds.length) {
    this._trigger('add', { items: addedIds }, senderId);
  }
  if (updatedIds.length) {
    this._trigger('update', { items: updatedIds, data: updatedData }, senderId);
  }

  return addedIds.concat(updatedIds);
};

/**
 * Get a data item or multiple items.
 *
 * Usage:
 *
 *     get()
 *     get(options: Object)
 *
 *     get(id: Number | String)
 *     get(id: Number | String, options: Object)
 *
 *     get(ids: Number[] | String[])
 *     get(ids: Number[] | String[], options: Object)
 *
 * Where:
 *
 * {Number | String} id         The id of an item
 * {Number[] | String{}} ids    An array with ids of items
 * {Object} options             An Object with options. Available options:
 * {String} [returnType]        Type of data to be returned.
 *                              Can be 'Array' (default) or 'Object'.
 * {Object.<String, String>} [type]
 * {String[]} [fields]          field names to be returned
 * {function} [filter]          filter items
 * {String | function} [order]  Order the items by a field name or custom sort function.
 * @throws Error
 */
DataSet.prototype.get = function (args) {
  var me = this;

  if (!args)
    return me._data

  // parse the arguments
  var id, ids, options;
  var firstType = util.getType(arguments[0]);
  if (firstType == 'String' || firstType == 'Number') {
    // get(id [, options])
    id = arguments[0];
    options = arguments[1];
  } else if (firstType == 'Array') {
    // get(ids [, options])
    ids = arguments[0];
    options = arguments[1];
  } else {
    // get([, options])
    options = arguments[0];
  }

  // determine the return type
  var returnType;
  if (options && options.returnType) {
    var allowedValues = ['Array', 'Object'];
    returnType = allowedValues.indexOf(options.returnType) == -1 ? 'Array' : options.returnType;
  } else {
    returnType = 'Array';
  }

  // build options
  var type = options && options.type || this._options.type;
  var filter = options && options.filter;
  var items = [],
      item,
      itemId,
      i,
      len;

  // convert items
  if (id != undefined) {
    // return a single item
    item = me._getItem(id, type);
    if (filter && !filter(item)) {
      item = null;
    }
  } else if (ids != undefined) {
    // return a subset of items
    for (i = 0, len = ids.length; i < len; i++) {
      item = me._getItem(ids[i], type);
      if (!filter || filter(item)) {
        items.push(item);
      }
    }
  } else {
    // return all items
    if (!filter)
      items = this._data.slice()
    else {
      for (itemId in this._ids) {
        item = me._getItem(itemId, type);
        if (!filter || filter(item)) {
          items.push(item);
        }
      }
    }
  }

  // order the results
  if (options && options.order && id == undefined) {
    this._sort(items, options.order);
  }

  // filter fields of the items
  if (options && options.fields) {
    var fields = options.fields;
    if (id != undefined) {
      item = this._filterFields(item, fields);
    } else {
      for (i = 0, len = items.length; i < len; i++) {
        items[i] = this._filterFields(items[i], fields);
      }
    }
  }

  // return the results
  if (returnType == 'Object') {
    var result = {};
    for (i = 0; i < items.length; i++) {
      result[items[i].id] = items[i];
    }
    return result;
  } else {
    if (id != undefined) {
      // a single item
      return item;
    } else {
      // just return our array
      return items;
    }
  }
};

DataSet.prototype._get = function (id) {
  var index = this._ids[id];
  var raw = this._data[index];
  if (!raw) {
    return null;
  }
  return raw
}

DataSet.prototype.tree = function (options) {
  var me = this;

  // parse the arguments
  var id, item, itemx, ids={}, data=[], parentField, childrenField,
    parent, order = [], options = options || {};

  parentField = options.parentField || me._parentField
  childrenField = options.childrenField || me._childField
  idField = options.idField || me._idField
  orderField = options.orderField || me._orderField

  order.push(options.levelField || me._levelField)
  order.push(orderField)

  var items = this.get({order:order})
  for (var i=0, len=items.length; i<len; i++) {
    item = {}
    itemx = items[i]
    for (k in itemx) {
      item[k] = itemx[k]
    }
    id = item[idField]
    parentId = item[parentField] || 0
    if (parentId) {
      parent = ids[parentId]
      if (!parent){
        console.log(item)
        throw new Error(id + ' parent ' + parentId + ' is not existed')
      }
      if (parent.hasOwnProperty(childrenField)) {
        parent[childrenField].push(item)
      } else {
        parent[childrenField] = [item]
      }
    } else {
      data.push(item)
    }
    ids[id] = item
  }
  if (options.plain) {
    var s = [], has_children,
      levelField = options.levelField || me._levelField,
      hasChildrenField = options.hasChildrenField || me._hasChildrenField,
      order = options.order

    function iter(d, level) {
      var x, b, _o, last_order=1
      for(var i=0, len=d.length; i<len; i++) {
        x = d[i]
        x[levelField] = x[levelField] || level
        //是否重新排序
        if (options.reorder) {
          if (x[orderField]){
            if (last_order < x[orderField])
              last_order = x[orderField]
            else if (last_order == x[orderField])
              x[orderField]++
            else {
              x[orderField] = last_order
            }
          } else {
            x[orderField] = last_order
          }
          last_order ++
        }
        s.push(x)
        b = x[childrenField]
        if (b && b.length > 0) {
          x[hasChildrenField] = true
          delete x[childrenField]
          iter(b, level+1)
        }
      }
    }
    iter(data, 0, 1)
    return s
  } else
    return data
}

/**
 * Get ids of all items or from a filtered set of items.
 * @param {Object} [options]    An Object with options. Available options:
 *                              {function} [filter] filter items
 *                              {String | function} [order] Order the items by
 *                                  a field name or custom sort function.
 * @return {Array} ids
 */
DataSet.prototype.getIds = function (options) {
  var data = this._data,
      filter = options && options.filter,
      order = options && options.order,
      type = options && options.type || this._options.type,
      i,
      len,
      id,
      item,
      items,
      ids = [];

  if (filter) {
    // get filtered items
    if (order) {
      // create ordered list
      items = [];
      for (id in data) {
        if (data.hasOwnProperty(id)) {
          item = this._getItem(id, type);
          if (filter(item)) {
            items.push(item);
          }
        }
      }

      this._sort(items, order);

      for (i = 0, len = items.length; i < len; i++) {
        ids[i] = items[i][this._idField];
      }
    } else {
      // create unordered list
      for (id in data) {
        if (data.hasOwnProperty(id)) {
          item = this._getItem(id, type);
          if (filter(item)) {
            ids.push(item[this._idField]);
          }
        }
      }
    }
  } else {
    // get all items
    if (order) {
      // create an ordered list
      items = [];
      for (id in data) {
        if (data.hasOwnProperty(id)) {
          items.push(data[id]);
        }
      }

      this._sort(items, order);

      for (i = 0, len = items.length; i < len; i++) {
        ids[i] = items[i][this._idField];
      }
    } else {
      // create unordered list
      for (id in data) {
        if (data.hasOwnProperty(id)) {
          item = data[id];
          ids.push(item[this._idField]);
        }
      }
    }
  }

  return ids;
};

/**
 * Returns the DataSet itself. Is overwritten for example by the DataView,
 * which returns the DataSet it is connected to instead.
 */
DataSet.prototype.getDataSet = function () {
  return this;
};

/**
 * Execute a callback function for every item in the dataset.
 * @param {function} callback
 * @param {Object} [options]    Available options:
 *                              {Object.<String, String>} [type]
 *                              {String[]} [fields] filter fields
 *                              {function} [filter] filter items
 *                              {String | function} [order] Order the items by
 *                                  a field name or custom sort function.
 */
DataSet.prototype.forEach = function (callback, options) {
  var filter = options && options.filter,
      type = options && options.type || this._options.type,
      data = this._data,
      ids = this._ids,
      item,
      id;

  if (options && options.order) {
    // execute forEach on ordered list
    var items = this.get(options);

    for (var i = 0, len = items.length; i < len; i++) {
      item = items[i];
      callback(item, i);
    }
  } else {
    // unordered
    for (var i=0, len = data.length; i < len; i++) {
      item = data[i]
      if (!filter || filter(item)) {
        callback(item, i);
      }
    }
  }
};

/**
 * Map every item in the dataset.
 * @param {function} callback
 * @param {Object} [options]    Available options:
 *                              {Object.<String, String>} [type]
 *                              {String[]} [fields] filter fields
 *                              {function} [filter] filter items
 *                              {String | function} [order] Order the items by
 *                                  a field name or custom sort function.
 * @return {Object[]} mappedItems
 */
DataSet.prototype.map = function (callback, options) {
  var filter = options && options.filter,
      type = options && options.type || this._options.type,
      mappedItems = [],
      data = this._data,
      item;

  // convert and filter items
  for (var i, len=data.length; i<len; i++) {
    item = data[i];
    if (!filter || filter(item)) {
      mappedItems.push(callback(item, id));
    }
  }

  // order items
  if (options && options.order) {
    this._sort(mappedItems, options.order);
  }

  return mappedItems;
};

/**
 * Filter the fields of an item
 * @param {Object | null} item
 * @param {String[]} fields     Field names
 * @return {Object | null} filteredItem or null if no item is provided
 * @private
 */
DataSet.prototype._filterFields = function (item, fields) {
  if (!item) {
    // item is null
    return item;
  }

  var filteredItem = {};

  if (Array.isArray(fields)) {
    for (var field in item) {
      if (item.hasOwnProperty(field) && fields.indexOf(field) != -1) {
        filteredItem[field] = item[field];
      }
    }
  } else {
    for (var field in item) {
      if (item.hasOwnProperty(field) && fields.hasOwnProperty(field)) {
        filteredItem[fields[field]] = item[field];
      }
    }
  }

  return filteredItem;
};

DataSet.prototype._by = function (name, desc, minor) {
  desc = desc || false;
  return function(o, p){
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
          a = o[name];
          b = p[name];
          if (a === b) {
              return typeof minor === 'function' ? minor(o,p):0;
          }
          if (typeof a === typeof b) {
              if (desc)
                  return a < b ? 1 : -1;
              else
                  return a < b ? -1 : 1;
          }
          // different type then return 0
          return 0
          // if (desc)
          //     return typeof a < typeof b ? 1 : -1;
          // else
          //     return typeof a < typeof b ? -1 : 1;
      }
      else {
          throw ("error");
      }
  }
}

var mergesort = function (array, /* optional */ cmp) {
    /*
        Merge sort.
        On average, two orders of magnitude faster than Array.prototype.sort() for
        large arrays, with potentially many equal elements.
        Note that the default comparison function does not coerce its arguments to strings.
    */

    if (cmp === undefined) {
        // Note: This is not the same as the default behavior for Array.prototype.sort(),
        // which coerces elements to strings before comparing them.
        cmp = function (a, b) {
            'use asm';
            return a < b ? -1 : a === b ? 0 : 1;
        };
    }

    function merge (begin, begin_right, end) {
        'use asm';
        // Create a copy of the left and right halves.
        var left_size = begin_right - begin, right_size = end - begin_right;
        var left = array.slice(begin, begin_right), right = array.slice(begin_right, end);
        // Merge left and right halves back into original array.
        var i = begin, j = 0, k = 0;
        while (j < left_size && k < right_size)
            if (cmp(left[j], right[k]) <= 0)
                array[i++] = left[j++];
            else
                array[i++] = right[k++];
        // At this point, at least one of the two halves is finished.
        // Copy any remaining elements from left array back to original array.
        while (j < left_size) array[i++] = left[j++];
        // Copy any remaining elements from right array back to original array.
        while (k < right_size) array[i++] = right[k++];
        return;
    }

    function msort (begin, end) {
        'use asm';
        var size = end - begin;
        if (size <= 8) {
            // By experimentation, the sort is fastest when using native sort for
            // arrays with a maximum size somewhere between 4 and 16.
            // This decreases the depth of the recursion for an array size where
            // O(n^2) sorting algorithms are acceptable.
            var sub_array = array.slice(begin, end);
            sub_array.sort(cmp);
            // Copy the sorted array back to the original array.
            for (var i = 0; i < size; ++i)
                array[begin + i] = sub_array[i];
            return;
        }

        var begin_right = begin + Math.floor(size/2);

        msort(begin, begin_right);
        msort(begin_right, end);
        merge(begin, begin_right, end);
    }

    msort(0, array.length);

    return array;
};

/**
 * Sort the provided array with items
 * @param {Object[]} items
 * @param {String | function} order      A field name or custom sort function.
 * @private
 */
DataSet.prototype._sort = function (items, order) {
  if (util.isString(order) || Array.isArray(order)) {
    var arr;
    var key;
    var f, desc, last=null;
    var me =  this
    if (util.isString(order)) arr = [order]
    else arr = order
    for(var i=arr.length-1; i>-1; i--){
        key = arr[i];
        if(key && key.charAt(0) === '-'){
            desc = true;
            key = key.substr(1)
        }
        else
            desc = false;
        if (last)
            f = me._by(key, desc, last);
        else
            f = me._by(key, desc);
        last = f;
    }
    return mergesort(items, f);
  } else if (typeof order === 'function') {
    // order by sort function
    return mergesort(items, order);
  }
  // TODO: extend order by an Object {field:String, direction:String}
  //       where direction can be 'asc' or 'desc'
  else {
    throw new TypeError('Order must be a function or a string');
  }
};

/**
 * Remove an object by pointer or by id
 * @param {String | Number | Object | Array} id Object or id, or an array with
 *                                              objects or ids to be removed
 * @param {String|Function} [url] Optional url, it'll be remote url or just callback
 *      return value should be {success:true|false, }
 * @return {Array} removedIds
 */
remove = function (id) {
  var removedIds = [],
      i,
      len,
      removedId, minIndex=0, me=this;

      var _remove = function (id) {
        var index, itemId, v, item, level, n;

        if (!id)
          return
        if (typeof id === 'string' || typeof id === 'number')
          item = me.get(id)
        else {
          item = id
        }
        if (!item)
          return
        id = item[me._idField]
        if (removedIds.indexOf(id) !== -1)
          return

        index = me.index(id)
        level = item[me._levelField]

        removedIds.push(id)
        me._data.splice(index, 1);
        me.length--;
        me._resetIds(minIndex)

        if (me._isTree) {
          for(var i=index, len=me.length; i<len; i++){
            n = me._data[index]
            if (n[me._levelField] > level) {
              removedIds.push(n[me._idField])
              me._data.splice(index, 1);
              me.length--;
            } else {
              break
            }
          }

          me._resetParent(index)
        }

      };


  if (Array.isArray(id)) {
    for (i = 0, len = id.length; i < len; i++) {
      removedId = _remove(id[i]);
    }
  } else {
    removedId = _remove(id);
  }

  this._resetIds(minIndex)

  if (removedIds.length) {
    this._trigger('remove', { items: removedIds });
  }
  return removedIds;

};

DataSet.prototype._resetParent = function (index) {
  var me = this, n
  if (index - 1 > -1) {
    n = me._data[index-1]
    if (n[me._hasChildrenField]) {
      if (index < me.length) {
        n[me._hasChildrenField] = me._data[index][me._levelField] > n[me._levelField]
      } else {
        n[me._hasChildrenField] = false
      }
    }
  }
}

/**
 * Reset ids
 * @param {Number | Object} begin   begin index, if undefined, process whole array
 * @returns null
 * @private
 */
DataSet.prototype._resetIds = function (begin) {
  if (begin instanceof Object) {
    begin = begin[this._idField];
  }
  if (!begin)
    begin = 0
  this._ids = {}
  for(var i=0, len=this.length; i<len; i++) {
    this._ids[this._data[i][this._idField]] = i
  }
};

/**
 * Clear the data
 * @param {String} [senderId] Optional sender id
 * @return {Array} removedIds    The ids of all removed items
 */
DataSet.prototype.clear = function (senderId) {
  var ids = Object.keys(this._ids);

  this._data = [];
  this._ids = {};
  this.length = 0;

  this._trigger('remove', { items: ids }, senderId);

  return ids;
};

/**
 * Add a single item. Will fail when an item with the same id already exists.
 * @param {Object} item
 * @param {Object} parent
 * @param {String} position, 'first'
 * @return {String} id
 * @private
 */
DataSet.prototype._addItem = function (item, parent, position) {
  var id = item[this._idField];

  if (id != undefined) {
    // check whether this id is already taken
    if (this._ids.hasOwnProperty(id)) {
      // item already exists
      throw new Error('Cannot add item: item with id ' + id + ' already exists');
    }
  } else {
    // generate an id
    id = util.uuid.v4();
    item[this._idField] = id;
  }

  var d = {};
  for (var field in item) {
    if (item.hasOwnProperty(field)) {
      var fieldType = this._type[field]; // type may be undefined
      d[field] = util.convert(item[field], fieldType);
    }
  }

  if (!parent || !this._isTree) {
    this._data.push(d);
    this.length++;
    this._ids[id] = this.length-1;
  }

  var child, index, node, _order, level, last_order

  if (this._isTree) {
    if (parent) {
      index = this.index(parent)
      parent = this._data[index]
      d[this._parentField] = parent[this._idField]
      if (!d[this._levelField])
        d[this._levelField] = parent[this._levelField] + 1
      //parent is not the real element maybe
      parent[this._hasChildrenField] = true
      child = this._getFirstChild(parent)
      if (!child) {
        d[this._orderField] = 1
        this._data.splice(index+1, 0, d)
      } else {
        if (position == 'first') {
          _order = this._data[index+1][this._orderField]
          this._data.splice(index+1, 0, d)
          level = d[this._levelField]
          if (!d[this._orderField]) {
            d[this._orderField] = _order
            last_order = d[this._orderField]
            this._reOrder(index+2, level, last_order)
          }
        } else {
          index = this._findNext(index)
          if (index == -1) {
            this._data.push(d)
            _order = this._data[this.length-1][this._orderField] + 1
            index = this._data.length
          } else {
            _order = this._data[index-1][this._orderField] + 1
            this._data.splice(index, 0, d)
          }
          if (!d[this._orderField])
            d[this._orderField] = _order
        }
      }
      this.length ++
      this._resetIds()
    } else {
      if (!d[this._levelField])
        d[this._levelField] = 0
      if (!d[this._orderField]) {
        //查找最后的order
        _order = 1
        for(var ii=this.length-2; ii>-1; ii--) {
          if (this._data[ii][this._levelField] == 0){
            _order = this._data[ii][this._orderField] + 1
            break
          }
        }
        d[this._orderField] = _order
      }
    }
  }

  return id;
};

DataSet.prototype._getFirstChild = function (parent) {
  var level = parent[this._levelField]
  var i = this.index(parent)
  var next

  if (i+1 < this.length) {
    next = this._data[i+1]
    if (next[this._levelField] > level)
      return next
  }
}

DataSet.prototype.index = function (id) {
  var itemId;
  if (util.isNumber(id) || util.isString(id)) {
    itemId = id;
  }else if (id instanceof Object) {
    itemId = id[this._idField];
  }

  return this._ids[itemId];
}

/**
 * Get an item. Fields can be converted to a specific type
 * @param {String} id
 * @param {Object.<String, String>} [types]  field types to convert
 * @return {Object | null} item
 * @private
 */
DataSet.prototype._getItem = function (id, types) {
  var field, value;

  // get the item from the dataset
  var index = this._ids[id];
  var raw = this._data[index];
  if (!raw) {
    return null;
  }

  // convert the items field types
  var converted = {};
  if (types) {
    for (field in raw) {
      if (raw.hasOwnProperty(field)) {
        value = raw[field];
        converted[field] = util.convert(value, types[field]);
      }
    }
  } else {
    // no field types specified, no converting needed
    for (field in raw) {
      if (raw.hasOwnProperty(field)) {
        value = raw[field];
        converted[field] = value;
      }
    }
  }
  return converted;
};

DataSet.prototype.save = function () {
  this._saved = $.extend(true, [], this.get({order:[this._idField]}))
  return this._saved
}

function cmpObject(a, b) {
    // Of course, we can do it use for in
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

DataSet.prototype.diff = function (data) {
  data = data || this._saved
  var src = this.get({order:[this._idField]}),
    i=0, j=0, len=src.length, _len=data.length,
    x, y, updated=[], added=[], deleted=[], x_id, y_id
  while(i<len && j<_len) {
    x = src[i]
    y = data[j]
    x_id = x[this._idField]
    y_id = y[this._idField]
    if (x_id == y_id) {
      if (!cmpObject(x, y)) {
        updated.push(x)
      }
      i ++
      j ++
    } else if (x_id<y_id) {
      added.push(x)
      i ++
    } else {
      deleted.push(y)
      j ++
    }
  }
  for(; i<len; i++) {
    added.push(src[i])
  }
  for(; j<_len; j++) {
    deleted.push(data[j])
  }
  return {added:added, updated:updated, deleted:deleted}
}

/**
 * Update a single item: merge with existing item.
 * Will fail when the item has no id, or when there does not exist an item
 * with the same id.
 * @param {Object} item
 * @return {String} id
 * @private
 */
DataSet.prototype._updateItem = function (item) {
  var id = item[this._idField];
  if (id == undefined) {
    throw new Error('Cannot update item: item has no id (item: ' + JSON.stringify(item) + ')');
  }
  var index = this._ids[id];
  var d = this._data[index];
  if (!d) {
    // item doesn't exist
    throw new Error('Cannot update item: no item with id ' + id + ' found');
  }

  // merge with current item
  // according d property
  for (var field in item) {
    var fieldType = this._type[field]; // type may be undefined
    d[field] = util.convert(item[field], fieldType);
  }

  return id;
};

function Util(){
  var _rng;

  var globalVar = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;

  if (globalVar && globalVar.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var _rnds = new Array(16);
    _rng = function () {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  //     uuid.js
  //
  //     Copyright (c) 2010-2012 Robert Kieffer
  //     MIT License - http://opensource.org/licenses/mit-license.php

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required

  //var _rng = require('./rng');

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = buf && offset || 0,
        ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {
      if (ii < 16) {
        // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0,
        bth = _byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [_seedBytes[0] | 0x01, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0,
      _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof options == 'string') {
      buf = options == 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;

  isNumber = function (object) {
    return object instanceof Number || typeof object == 'number';
  };

  /**
   * Test whether given object is a string
   * @param {*} object
   * @return {Boolean} isString
   */
  isString = function (object) {
    return object instanceof String || typeof object == 'string';
  };

  /**
   * Test whether given object is a Date, or a String containing a Date
   * @param {Date | String} object
   * @return {Boolean} isDate
   */
  isDate = function (object) {
    if (object instanceof Date) {
      return true;
    } else if (isString(object)) {
      // test whether this string contains a date
      var match = ASPDateRegex.exec(object);
      if (match) {
        return true;
      } else if (!isNaN(Date.parse(object))) {
        return true;
      }
    }

    return false;
  };

  /**
   * Convert an object to another type
   * @param {Boolean | Number | String | Date | Moment | Null | undefined} object
   * @param {String | undefined} type   Name of the type. Available types:
   *                                    'Boolean', 'Number', 'String',
   *                                    'Date', 'Moment', ISODate', 'ASPDate'.
   * @return {*} object
   * @throws Error
   */
  convert = function (object, type) {
    var match;

    if (object === undefined) {
      return undefined;
    }
    if (object === null) {
      return null;
    }

    if (!type) {
      return object;
    }
    if (!(typeof type === 'string') && !(type instanceof String)) {
      throw new Error('Type must be a string');
    }

    //noinspection FallthroughInSwitchStatementJS
    switch (type) {
      case 'boolean':
      case 'Boolean':
        return Boolean(object);

      case 'number':
      case 'Number':
        return Number(object.valueOf());

      case 'string':
      case 'String':
        return String(object);

      case 'Date':
        if (isNumber(object)) {
          return new Date(object);
        }
        if (object instanceof Date) {
          return new Date(object.valueOf());
        } else if (moment.isMoment(object)) {
          return new Date(object.valueOf());
        }
        if (isString(object)) {
          match = ASPDateRegex.exec(object);
          if (match) {
            // object is an ASP date
            return new Date(Number(match[1])); // parse number
          } else {
            return moment(object).toDate(); // parse string
          }
        } else {
          throw new Error('Cannot convert object of type ' + getType(object) + ' to type Date');
        }

      case 'Moment':
        if (isNumber(object)) {
          return moment(object);
        }
        if (object instanceof Date) {
          return moment(object.valueOf());
        } else if (moment.isMoment(object)) {
          return moment(object);
        }
        if (isString(object)) {
          match = ASPDateRegex.exec(object);
          if (match) {
            // object is an ASP date
            return moment(Number(match[1])); // parse number
          } else {
            return moment(object); // parse string
          }
        } else {
          throw new Error('Cannot convert object of type ' + getType(object) + ' to type Date');
        }

      case 'ISODate':
        if (isNumber(object)) {
          return new Date(object);
        } else if (object instanceof Date) {
          return object.toISOString();
        } else if (moment.isMoment(object)) {
          return object.toDate().toISOString();
        } else if (isString(object)) {
          match = ASPDateRegex.exec(object);
          if (match) {
            // object is an ASP date
            return new Date(Number(match[1])).toISOString(); // parse number
          } else {
            return new Date(object).toISOString(); // parse string
          }
        } else {
          throw new Error('Cannot convert object of type ' + getType(object) + ' to type ISODate');
        }

      case 'ASPDate':
        if (isNumber(object)) {
          return '/Date(' + object + ')/';
        } else if (object instanceof Date) {
          return '/Date(' + object.valueOf() + ')/';
        } else if (isString(object)) {
          match = ASPDateRegex.exec(object);
          var value;
          if (match) {
            // object is an ASP date
            value = new Date(Number(match[1])).valueOf(); // parse number
          } else {
            value = new Date(object).valueOf(); // parse string
          }
          return '/Date(' + value + ')/';
        } else {
          throw new Error('Cannot convert object of type ' + getType(object) + ' to type ASPDate');
        }

      default:
        throw new Error('Unknown type "' + type + '"');
    }
  };

  // parse ASP.Net Date pattern,
  // for example '/Date(1198908717056)/' or '/Date(1198908717056-0700)/'
  // code from http://momentjs.com/
  var ASPDateRegex = /^\/?Date\((\-?\d+)/i;

  /**
   * Get the type of an object, for example getType([]) returns 'Array'
   * @param {*} object
   * @return {String} type
   */
  getType = function (object) {
    var type = typeof object;

    if (type == 'object') {
      if (object === null) {
        return 'null';
      }
      if (object instanceof Boolean) {
        return 'Boolean';
      }
      if (object instanceof Number) {
        return 'Number';
      }
      if (object instanceof String) {
        return 'String';
      }
      if (Array.isArray(object)) {
        return 'Array';
      }
      if (object instanceof Date) {
        return 'Date';
      }
      return 'Object';
    } else if (type == 'number') {
      return 'Number';
    } else if (type == 'boolean') {
      return 'Boolean';
    } else if (type == 'string') {
      return 'String';
    } else if (type === undefined) {
      return 'undefined';
    }

    return type;
  };

  this.getType = getType;
  this.convert = convert;
  this.uuid = uuid;
  this.isNumber = isNumber;
  this.isString = isString;
}

var util = new Util();

"use strict";!function(n,t){"undefined"!=typeof module&&module.exports?module.exports=t():"function"==typeof define&&define.amd?define(t):window[n]=t()}("basicContext",function(){var n=null,t="item",e="separator",i=function(){var n=arguments.length<=0||void 0===arguments[0]?"":arguments[0];return document.querySelector(".basicContext "+n)},l=function(){var n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],i=0===Object.keys(n).length?!0:!1;return i===!0&&(n.type=e),null==n.type&&(n.type=t),null==n["class"]&&(n["class"]=""),n.visible!==!1&&(n.visible=!0),null==n.icon&&(n.icon=null),null==n.title&&(n.title="Undefined"),n.disabled!==!0&&(n.disabled=!1),n.disabled===!0&&(n["class"]+=" basicContext__item--disabled"),null==n.fn&&n.type!==e&&n.disabled===!1?(console.warn("Missing fn for item '"+n.title+"'"),!1):!0},o=function(n,i){var o="",r="";return l(n)===!1?"":n.visible===!1?"":(n.num=i,null!==n.icon&&(r="<span class='basicContext__icon "+n.icon+"'></span>"),n.type===t?o="\n		       <tr class='basicContext__item "+n["class"]+"'>\n		           <td class='basicContext__data' data-num='"+n.num+"'>"+r+n.title+"</td>\n		       </tr>\n		       ":n.type===e&&(o="\n		       <tr class='basicContext__item basicContext__item--separator'></tr>\n		       "),o)},r=function(n){var t="";return t+="\n	        <div class='basicContextContainer'>\n	            <div class='basicContext'>\n	                <table>\n	                    <tbody>\n	        ",n.forEach(function(n,e){return t+=o(n,e)}),t+="\n	                    </tbody>\n	                </table>\n	            </div>\n	        </div>\n	        "},a=function(){var n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],t={x:n.clientX,y:n.clientY};if("touchend"===n.type&&(null==t.x||null==t.y)){var e=n.changedTouches;null!=e&&e.length>0&&(t.x=e[0].clientX,t.y=e[0].clientY)}return(null==t.x||t.x<0)&&(t.x=0),(null==t.y||t.y<0)&&(t.y=0),t},s=function(n,t){var e=a(n),i=e.x,l=e.y,o={width:window.innerWidth,height:window.innerHeight},r={width:t.offsetWidth,height:t.offsetHeight};i+r.width>o.width&&(i-=i+r.width-o.width),l+r.height>o.height&&(l-=l+r.height-o.height),r.height>o.height&&(l=0,t.classList.add("basicContext--scrollable"));var s=e.x-i,u=e.y-l;return{x:i,y:l,rx:s,ry:u}},u=function(){var n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];return null==n.fn?!1:n.visible===!1?!1:n.disabled===!0?!1:(i("td[data-num='"+n.num+"']").onclick=n.fn,i("td[data-num='"+n.num+"']").oncontextmenu=n.fn,!0)},c=function(t,e,l,o){var a=r(t);document.body.insertAdjacentHTML("beforeend",a),null==n&&(n=document.body.style.overflow,document.body.style.overflow="hidden");var c=i(),d=s(e,c);return c.style.left=d.x+"px",c.style.top=d.y+"px",c.style.transformOrigin=d.rx+"px "+d.ry+"px",c.style.opacity=1,null==l&&(l=f),c.parentElement.onclick=l,c.parentElement.oncontextmenu=l,t.forEach(u),"function"==typeof e.preventDefault&&e.preventDefault(),"function"==typeof e.stopPropagation&&e.stopPropagation(),"function"==typeof o&&o(),!0},d=function(){var n=i();return null==n||0===n.length?!1:!0},f=function(){if(d()===!1)return!1;var t=document.querySelector(".basicContextContainer");return t.parentElement.removeChild(t),null!=n&&(document.body.style.overflow=n,n=null),!0};return{ITEM:t,SEPARATOR:e,show:c,visible:d,close:f}});
var string_editor = function (parent, row, col) {
  var self = this
  var $p = $(parent), w=$p.width(), h=$p.height()
  var input = $(riot.util.tmpl('<input type="text" name={name} value="{value}" placeholder="{placeholder}" class="inline-editor"></input>', col))
  input.css({
    position:'absolute',
    left:$p.css('paddingLeft'),
    top:0,
    width:w,
    height:h,
    margin:0,
    padding:0,
    border:'1 solid gray',
    boxSizing:'border-box',
    zIndex:1000,
    fontSize:14,
    backgroundColor:'white'
  })
  $p.append(input)
  input.focus().select()

  input.on('keyup', function(e){
    if (e.keyCode == 13) {
      var value = input.val()
      row[col.name] = value
      $.when(self.onEdited(row, col, value)).then(function(r){
        if (r) {
          self.root.update(row)
          input.destroy()
        }
      })
    } else if (e.keyCode == 27) {
      input.destroy()
    }
  })
  input.on('blur', function(e){
    input.destroy()
  })
  input.destroy = function () {
    input.remove()
    self.editor = null
  }

  return input
}

var select_editor = function (parent, row, col) {
  var self = this
  var $p = $(parent), w=$p.width(), h=$p.height()
  var tmpl = [
    '<select name="' + col.name + '" class="inline-editor" ' + (col.editor.multiple?'multiple="multiple"':'') + '>'
  ]
  var item, choices=col.editor.choices
  if (col.editor.placeholder) {
    tmpl.push('<option value="">'+col.editor.placeholder+'</option>')
  }
  for(var i=0, len=choices.length; i<len; i++) {
    item = {value:col.value, option_value:choices[i][0], option_text:choices[i][1]}
    tmpl.push(riot.util.tmpl('<option {value==option_value?"selected":""} value={option_value}>{option_text}</option>', item))
  }
  tmpl.push('</select>')
  var input = $(tmpl.join(''))
  input.css({
    position:'absolute',
    left:0,
    top:0,
    width:w,
    height:h,
    margin:0,
    padding:0,
    border:'1 solid gray',
    boxSizing:'border-box',
    zIndex:1000,
    fontSize:14,
    backgroundColor:'white'
  })
  $p.append(input)
  input.focus()

  input.on('change', function(e){
    var value = input.val()
    row[col.name] = value
    $.when(self.onEdited(row, col, value)).then(function(r){
      if (r) {
        self.root.update(row)
        input.destroy()
      }
    })
  })

  input.destroy = function () {
    input.remove()
    self.editor = null
  }

  return input
}

var date_editor = function (parent, row, col) {
  var self = this
  var $p = $(parent), w=$p.width(), h=$p.height()
  var input = $(riot.util.tmpl('<input type="text" name={name} value="{value}" placeholder="{placeholder}" class="inline-editor"></input>', col))
  input.css({
    position:'absolute',
    left:0,
    top:0,
    width:w,
    height:h,
    margin:0,
    padding:0,
    border:'1 solid gray',
    boxSizing:'border-box',
    zIndex:1000,
    fontSize:14,
    backgroundColor:'white'
  })
  $p.append(input)
  input.focus().select().pikaday({
    format: 'YYYY-MM-DD',
    showTime:false,
    onClose:function () {
      var value = input.val()
      row[col.name] = value
      $.when(self.onEdited(row, col, value)).then(function(r){
        if (r) {
          self.root.update(row)
          input.destroy()
        }
      })
    }
  })

  input.pikaday('show')

  input.destroy = function () {
    input.remove()
    self.editor = null
  }

  return input
}

var select2_editor = function (parent, row, col) {
  var self = this
  var $p = $(parent), w=$p.width(), h=$p.height()
  var tmpl = [
    '<select name="' + col.name + '" class="inline-editor" ' + (col.editor.multiple?'multiple="multiple"':'') + '>'
  ]
  var item
  var value, text=[], choices=[], value_from = col.editor.value_from
  if (value_from) {
    value = col.row[value_from]['value']
  } else {
    value = col.value
  }
  if (value) {
    if (value_from) {
      if (Array.isArray(value)) {
        for(var j=0, _len=value.length; j<_len; j++) {
          choices.push([col.row[value_from]['value'][j], col.row[value_from]['text'][j]])
        }
      } else {
        choices = [[col.row[value_from]['value'], col.row[value_from]['text']]]
      }
    } else {
      if (Array.isArray(value)) {
        for(var j=0, _len=value.length; j<_len; j++) {
          choices.push([value[j], value[j]])
        }
      } else {
        choices = [[value, value]]
      }
    }
  }
  var choices = col.editor.choices ? col.editor.choices : choices, selected
  if (col.editor.placeholder)
    tmpl.push('<option value="">'+col.editor.placeholder+'</option>')
  for(var i=0, len=choices.length; i<len; i++) {
    item = {value:value, option_value:choices[i][0], option_text:choices[i][1]}
    if (Array.isArray(value))
      item['selected'] = value.indexOf(item['option_value']) > -1
    else {
      item['selected'] = value == item['option_value']
    }
    tmpl.push(riot.util.tmpl('<option {selected?"selected":""} value={option_value}>{option_text}</option>', item))
  }
  tmpl.push('</select>')
  var input = $(tmpl.join(''))
  input.css({
    position:'absolute',
    left:0,
    top:0,
    width:w,
    height:h,
    margin:0,
    padding:0,
    border:'1 solid gray',
    boxSizing:'border-box',
    zIndex:1000,
    fontSize:14,
    backgroundColor:'white'
  })
  $p.append(input)
  input.focus()
  if (col.editor.url)
    input.attr('url', col.editor.url)
  if (col.editor['data-url'])
    input.attr('url', col.editor['data-url'])
  if (col.editor.placeholder)
    input.attr('placeholder', col.editor.placeholder)
  _simple_select2(input)
  $p.find('.select2-container').css({
      zIndex: 2000,
      position: 'absolute',
      left: 0,
      top: 0
  })
  $p.css({
    overflow: 'visible',
    position: 'relative'
  })

  input.on('select2:close', function(e){
    input.destroy()
  })
  input.on('change', function(e){
    var value = input.val()
    row[col.name] = value
    if (col.editor.value_from) {
      if (col.editor.multiple) {
        for(var i=0, len=input.select2('data').length; i<len; i++) {
          text.push(input.select2('data')[i].text)
        }
        row[col.editor.value_from] = {value:value, text:text}
      } else {
        text = input.select2('data')[0].text
        row[col.editor.value_from] = {value:value, text:text}
      }
    }
    else row[col.name] = value
    $.when(self.onEdited(row, col, value)).then(function(r){
      if (r) {
        self.root.update(row)
        input.destroy()
      }
    })
  })

  input.destroy = function () {
    if (input.data('select2')) {
      input.select2('destroy')
    }
    input.remove()
    self.editor = null
  }

  return input
}

function _simple_select2 (el, options){
  var $el = $(el),
    url = $el.attr('data-url') || $el.attr('url'),
    placeholder = $el.attr('placeholder') || '请选择';
  options = options || {}
  if (typeof options === 'string') {
    url = options
    options = {}
  }
  var opts, data
  var limit = options.limit || 10
  if (url)
    opts = {
      minimumInputLength: 2,
      width: '100%',
      placeholder:{
        id:'',
        placeholder:placeholder
      },
      allowClear:true,
      language: 'zh-CN',
      ajax: {
          url: url,
          data: function (params) {
              return {
                  term: params.term,
                  label: 'text',
                  page:params.page,
                  limit:limit
              }
          },
          dataType: 'json',
          processResults: function (result, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            if (!Array.isArray(result)) {
              data = result.rows
              total = result.total
            } else {
              data = result
              total = 0
            }
            return {
              results: data,
              pagination: {
                more: (params.page * limit) < total
              }
            }
          }
      }
    }
      /*,
      formatNoMatches: function () { return "找不到对应值"; },
      formatInputTooShort: function (input, min) { return "请输入至少 " + (min - input.length) + " 个字符"; },
      formatSelectionTooBig: function (limit) { return "你只能选 " + limit + " 条数据"; },
      formatLoadMore: function (pageNumber) { return "装入更多数据..."; },
      formatSearching: function () { return "搜索..."; }
      */

  else
    opts = {
      width: '100%',
      allowClear:true,
      placeholder:{
        id:'',
        placeholder:placeholder
      },
      language: 'zh-CN'
    }

  $el.select2($.extend(true, {}, opts, options));
}

/*
  rtable v1.0
  author : limodou@gmail.com

  options:
    cols(Must):             column definition
    data(Optional):         data source, could be DataSet instance, or just array or empty
    height(Optional):       height of grid, if no provided, it'll use parent height, if the value is 'auto', it'll
                            increase grid height automatically, so there will be no scroll-y at all, default is null
    maxHeight(optional):    Max height, it set height is 'auto', when great than maxHeight, the height will be always maxHeight
    minHeight(optional):    Min height, it set height is 'auto', when less than minHeight, the height will be always minHeight
    width(Optional):        Width of grid, if no provided, it'll use parent width, default is null
    container(Optional):    Used to calculate the width and height, if width or height set to null, default is this.root
    rowHeight(Optional):    single row height. Default is 34
    headerRowHeight(Optonal)Header row height. Default is 34
    nameField(Optional):    Which value will be used for name of column, default is 'name'
    titleField(Optional):   Which value will be used for title of column, default is 'title'
    start(Optional):        Starting index value, it'll be used for index column, default is 0
    indexCol(Optional):     Display index column, starting value will be this.start
    indexColWidth(Optional):Width of index column, default is 40
    checkCol(Optional):     Display checkbox column
    checkColWidth(Optional):Width of checkbox column, default is 30
    multiSelect(Optional):  Multi selection, default is false
    clickSelect(Optional):  If click can select row, default is 'row', others are: 'column', null
    remoteSort(Optional):   If sort in remote, it'll invoke a callback onSort. Default is false
    noData(Optional):       If there is no data, show a message, default is 'No Data'

    options(Optional):      Used to set above options easily via plain object
    theme(Optional):        Theme of grid
    editable(Optional):     If the table cell can be editable.

  events:
    onUpdate:             When DataSet changed, it'll invoke function(dataset, action, changed)
    onSort:               When click sort, it'll invoke function(sort_cols) return new data
    onRowClass:           Return row class

  methods:
    add:                  Add new records: add(row), add(rows)
    remove:               Remove records: remove(row), remove(rows)
    update:               Update records: update(row), update(rows)
    get:                  Get records: get(), get(id), get(ids), get(row)
    select:               Select rows: select(row), select(rows)
    deselect:             Deselect rows: deselect(row), deselect(rows)
    is_selected:          Test is a row is selected: is_selected(row)
    get_selected:         Get selected rows: get_selected()
*/
/*
  rtable v1.0.0.1
  author : lvyangg@gmail.com

  ADD-options:
    combineCols(Optional): list of cols's name, the index of list means grouping-level
*/
riot.tag2('rtable', '<yield></yield> <div class="rtable-root {theme}" riot-style="width:{width-1}px;height:{height-1+(browser.ie?xscroll_fix:0)}px"> <div class="rtable-header rtable-fixed" riot-style="width:{fix_width}px;height:{header_height}px"> <div each="{fix_columns}" no-reorder class="{rtable-cell:true}" riot-style="width:{width}px;height:{height}px;left:{left}px;top:{top}px;line-height:{height}px;"> <div if="{type!=\'check\'}" data-is="rtable-raw" class="rtable-cell-text" content="{title}" riot-style="{sort?\'padding-right:22px\':\'\'}" title="{tooltip}"></div> <div if="{type==\'check\'}"> <i if="{multiSelect && checkAll}" onclick="{checkall}" class="fa {selected_rows.length>0 ? \'fa-check-square-o\' : \'fa-square-o\'}" riot-style="cursor:pointer;height:{headerRowHeight}px;line-height:{headerRowHeight}px"></i> <span if="{title}">{title}</span> </div> <div if="{!fixed && leaf}" class="rtable-resizer" onmousedown="{colresize}"></div> <i if="{sort}" class="rtable-sort fa {get_sorted(name)}" title="{sort}" onclick="{sort_handler}" riot-style="height:{rowHeight}px;line-height:{rowHeight}px;right:4px;"> </i> </div> </div> <div class="rtable-header rtable-main" riot-style="width:{width-fix_width-yscroll_fix}px;right:0px;height:{header_height}px;left:{fix_width}px;"> <div each="{main_columns}" no-reorder class="{rtable-cell:true}" riot-style="width:{width}px;height:{height}px;left:{left}px;top:{top}px;line-height:{height}px;"> <div if="{type!=\'check\'}" data-is="rtable-raw" class="rtable-cell-text" content="{title}" riot-style="{sort?\'padding-right:22px\':\'\'}" title="{tooltip}"></div> <div if="{type==\'check\'}"> <i if="{parent.multiSelect && checkAll}" onclick="{checkall}" class="fa {parent.selected_rows.length>0 ? \'fa-check-square-o\' : \'fa-square-o\'}" riot-style="cursor:pointer;height:{headerRowHeight}px;line-height:{headerRowHeight}px"></i> <span if="{title}">{title}</span> </div> <div if="{!fixed && leaf}" class="rtable-resizer" onmousedown="{colresize}"></div> <i if="{sort}" class="rtable-sort fa {get_sorted(name)}" title="{sort}" onclick="{sort_handler}" riot-style="height:{rowHeight}px;line-height:{rowHeight}px;right:4px;"> </i> </div> </div> <div class="rtable-body rtable-fixed" riot-style="width:{fix_width}px;bottom:0;padding-bottom:{browser.ie?xscroll_fix:0}px;top:{header_height}px;height:{height-header_height+(browser.ie?xscroll_fix:-xscroll_fix)}px;"> <div class="rtable-content" riot-style="width:{fix_width}px;height:{rows.length*rowHeight}px;"> <div each="{row in visCells.fixed}" no-reorder class="{get_row_class(row.row, row.line)}"> <div if="{col.height!=0 && col.width!=0}" each="{col in row.cols}" no-reorder class="{get_cell_class(col)}" riot-style="width:{col.width}px;height:{col.height}px;left:{col.left}px;top:{col.top}px;line-height:{col.height}px;text-align:{col.align};"> <div data-is="rtable-cell" if="{col.type!=\'check\' && !col.buttons}" tag="{col.tag}" content="{col.__value__}" row="{col.row}" col="{col}" riot-style="{col.indentWidth}" title="{col.tooltip}"></div> <span if="{col.expander}" data-is="rtable-raw" content="{col.expander}" class="rtable-expander" riot-style="left:{col.indent-12}px;" onclick="{toggle_expand}"></span> <i if="{col.type==\'check\' && onCheckable(col.row)}" onclick="{checkcol}" class="fa {is_selected(col.row)?\'fa-check-square-o\':\'fa-square-o\'}" riot-style="cursor:pointer;height:{rowHeight}px;line-height:{rowHeight}px"></i> <span if="{col.notation}" class="rtable-notation {col.notation.type}" title="{col.notation.title}"></span> </div> </div> </div> </div> <div class="rtable-body rtable-main" riot-style="left:{fix_width}px;top:{header_height}px;bottom:0px;right:0px;width:{width-fix_width+(browser.ie?yscroll_fix:0)}px;height:{height-header_height+(browser.ie?xscroll_fix:0)+(height_opt==\'auto\' && browser.ie?xscroll_fix:0)}px;"> <div class="rtable-content" riot-style="width:{main_width}px;height:{rows.length*rowHeight}px;"> <div each="{row in visCells.main}" no-reorder class="{get_row_class(row.row, row.line)}"> <div if="{col.height!=0 && col.width!=0}" each="{col in row.cols}" no-reorder class="{get_cell_class(col)}" riot-style="width:{col.width}px;height:{col.height}px;left:{col.left}px;top:{col.top}px;line-height:{col.height}px;text-align:{col.align};"> <div data-is="rtable-cell" if="{col.type!=\'check\' && !col.buttons}" tag="{col.tag}" content="{col.__value__}" row="{col.row}" col="{col}" riot-style="{col.indentWidth}" title="{col.tooltip}"></div> <span if="{col.expander}" data-is="rtable-raw" content="{col.expander}" class="rtable-expander" riot-style="left:{col.indent-12}px;" onclick="{toggle_expand}"></span> <i if="{col.type==\'check\' && onCheckable(col.row)}" onclick="{checkcol}" class="fa {is_selected(col.row)?\'fa-check-square-o\':\'fa-square-o\'}" riot-style="cursor:pointer;height:{rowHeight}px;line-height:{rowHeight}px"></i> <virtual if="{col.buttons}" no-reorder each="{btn in col.buttons}"> <i if="{btn.icon}" class="fa fa-{btn.icon} action" title="{btn.title}" onclick="{parent.parent.action_click(parent.col, btn)}"></i> <a if="{btn.label}" class="action" title="{btn.title}" href="{btn.href || \'#\'}" onclick="{parent.parent.action_click(parent.col, btn)}">{btn.label}</a> </virtual> <span if="{col.notation}" class="rtable-notation {col.notation.type}" title="{col.notation.title}"></span> </div> </div> </div> </div> <div if="{rows.length==0 && noData}" data-is="rtable-raw" content="{noData}" class="rtable-nodata" riot-style="top:{height/2-header_height/2+rowHeight/2}px;"></div> <div riot-style="display:none;top:{height/2-header_height/2+rowHeight/2}px" class="rtable-loading"></div> </div> </div>', 'rtable .action,[data-is="rtable"] .action{cursor:pointer;} rtable .rtable-root,[data-is="rtable"] .rtable-root{ position:relative; border: 1px solid gray; overflow:hidden; } rtable .rtable-header,[data-is="rtable"] .rtable-header{ position:absolute; box-sizing: border-box; } rtable .rtable-header.rtable-fixed,[data-is="rtable"] .rtable-header.rtable-fixed{ left:0; top:0; } rtable .rtable-header.rtable-main,[data-is="rtable"] .rtable-header.rtable-main{ top:0; overflow:hidden; } rtable .rtable-content,[data-is="rtable"] .rtable-content{ overflow: hidden; } rtable .rtable-cell,[data-is="rtable"] .rtable-cell{ position:absolute; box-sizing: border-box; border-right:1px solid gray; border-bottom:1px solid gray; background-color: white; white-space: nowrap; text-overflow: ellipsis; } rtable .rtable-cell-text-wrapper,[data-is="rtable"] .rtable-cell-text-wrapper{ height: 100%; } rtable .rtable-cell-text,[data-is="rtable"] .rtable-cell-text{ position:relative; padding-left:4px; padding-right:4px; height: 100%; } rtable .rtable-cell-text,[data-is="rtable"] .rtable-cell-text,rtable .rtable-cell-text>*,[data-is="rtable"] .rtable-cell-text>*{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rtable .rtable-cell > .rtable-resizer,[data-is="rtable"] .rtable-cell > .rtable-resizer{ width:4px; position:absolute; height:100%; cursor: col-resize; top:0px; right:0px; } rtable .rtable-cell .rtable-sort,[data-is="rtable"] .rtable-cell .rtable-sort{ position: absolute; right: 2px; top:0px; z-index: 102; cursor: pointer; opacity: 0.3; } rtable .rtable-cell .rtable-sort.fa-sort-desc,[data-is="rtable"] .rtable-cell .rtable-sort.fa-sort-desc,rtable .rtable-cell .rtable-sort.fa-sort-asc,[data-is="rtable"] .rtable-cell .rtable-sort.fa-sort-asc{ opacity: 1; } rtable .rtable-header .rtable-cell,[data-is="rtable"] .rtable-header .rtable-cell{ text-align:center; vertical-align: middle; } rtable .rtable-body,[data-is="rtable"] .rtable-body{ position:absolute; box-sizing: border-box; } rtable .rtable-body.rtable-fixed,[data-is="rtable"] .rtable-body.rtable-fixed{ left:0; overflow: hidden; } rtable .rtable-body.rtable-main,[data-is="rtable"] .rtable-body.rtable-main{ overflow: auto; } rtable .rtable-nodata,[data-is="rtable"] .rtable-nodata{ position:relative; margin: auto; height: 34px; text-align: center; color: #ccc; line-height: 34px; } rtable .rtable-loading,[data-is="rtable"] .rtable-loading{ position:relative;; margin: auto; height: 34px; text-align: center; color: black; line-height: 34px; border: 1px solid gray; width: 100px; background-color: antiquewhite; z-index: 9999; } rtable .rtable-expander,[data-is="rtable"] .rtable-expander{ position:absolute; top:0px; cursor:pointer; font-size:14px; } rtable .rtable-row.hover .rtable-cell,[data-is="rtable"] .rtable-row.hover .rtable-cell{ background-color: #e1eff8; } rtable .rtable-row.selected .rtable-cell,[data-is="rtable"] .rtable-row.selected .rtable-cell{ background-color:#ffefd5; } rtable .rtable-root.zebra .rtable-row.even .rtable-cell,[data-is="rtable"] .rtable-root.zebra .rtable-row.even .rtable-cell{ background-color: #f9f9f9; border-bottom:none; border-right:1px solid #ddd; } rtable .rtable-root.zebra .rtable-row.odd .rtable-cell,[data-is="rtable"] .rtable-root.zebra .rtable-row.odd .rtable-cell{ border-bottom:none; border-right:1px solid #ddd; } rtable .rtable-root.zebra .rtable-row.selected .rtable-cell,[data-is="rtable"] .rtable-root.zebra .rtable-row.selected .rtable-cell{ background-color: #ffefd5; } rtable .rtable-root.zebra .rtable-row.hover .rtable-cell,[data-is="rtable"] .rtable-root.zebra .rtable-row.hover .rtable-cell{ background-color: #e1eff8; } rtable .rtable-root.zebra .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.zebra .rtable-header .rtable-cell{ background-color: #f2f2f2; } rtable .rtable-root.simple .rtable-row.even .rtable-cell,[data-is="rtable"] .rtable-root.simple .rtable-row.even .rtable-cell{ } rtable .rtable-root.simple .rtable-row.odd .rtable-cell,[data-is="rtable"] .rtable-root.simple .rtable-row.odd .rtable-cell{ } rtable .rtable-root.simple .rtable-row.selected .rtable-cell,[data-is="rtable"] .rtable-root.simple .rtable-row.selected .rtable-cell{ } rtable .rtable-root.simple .rtable-row.hover .rtable-cell,[data-is="rtable"] .rtable-root.simple .rtable-row.hover .rtable-cell{ } rtable .rtable-root.simple .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.simple .rtable-header .rtable-cell{ background-color: #f2f2f2; } rtable .rtable-root.table,[data-is="rtable"] .rtable-root.table{ border: none; } rtable .rtable-root.table .rtable-row.even .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-row.even .rtable-cell{ } rtable .rtable-root.table .rtable-row.odd .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-row.odd .rtable-cell{ } rtable .rtable-root.table .rtable-row.selected .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-row.selected .rtable-cell{ background-color: #ffefd5; } rtable .rtable-root.table .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-header .rtable-cell{ } rtable .rtable-root.table .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-cell{ border-right:none; border-bottom:1px solid #ddd; } rtable .rtable-root.table .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.table .rtable-header .rtable-cell{ border-bottom: 2px solid #ddd; } rtable .rtable-root.table-striped,[data-is="rtable"] .rtable-root.table-striped{ border: none; } rtable .rtable-root.table-striped .rtable-row.even .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-row.even .rtable-cell{ background-color: #f9f9f9; border-bottom:none; } rtable .rtable-root.table-striped .rtable-row.odd .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-row.odd .rtable-cell{ border-bottom:none; } rtable .rtable-root.table-striped .rtable-row.selected .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-row.selected .rtable-cell{ } rtable .rtable-root.table-striped .rtable-row.hover .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-row.hover .rtable-cell{ } rtable .rtable-root.table-striped .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-header .rtable-cell{ } rtable .rtable-root.table-striped .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-cell{ border-right:none; border-bottom:1px solid #ddd; } rtable .rtable-root.table-striped .rtable-header .rtable-cell,[data-is="rtable"] .rtable-root.table-striped .rtable-header .rtable-cell{ border-bottom: 2px solid #ddd; } rtable .rtable-notation,[data-is="rtable"] .rtable-notation{ border: 6px solid; border-color: transparent transparent transparent transparent; width: 0px; height: 0px; position: absolute; top: 0px; right: -5px; } rtable .rtable-notation.error,[data-is="rtable"] .rtable-notation.error{ border-color: #b94a48 #b94a48 transparent transparent; } rtable .rtable-notation.warning,[data-is="rtable"] .rtable-notation.warning{ border-color: #f89406 #f89406 transparent transparent; } rtable .rtable-notation.success,[data-is="rtable"] .rtable-notation.success{ border-color: #468847 #468847 transparent transparent; } rtable .rtable-notation.info,[data-is="rtable"] .rtable-notation.info{ border-color: #3a87ad #3a87ad transparent transparent; }', '', function(opts) {

  var self = this
  this.observable = opts.observable
  this.root.instance = this

  if(opts.options) {
    for (var k in opts.options) {
      opts[k] = opts.options[k]
    }
  }

  this.nameField = opts.nameField || 'name'
  this.titleField = opts.titleField || 'title'
  this.cols = opts.cols.slice()
  this.combineCols = opts.combineCols || []
  this.headerRowHeight = opts.headerRowHeight || 34
  this.height_opt = opts.height || 'auto'
  this.width_opt = opts.width || 'auto'
  this.rowHeight = opts.rowHeight || 34
  this.indexColWidth = opts.indexColWidth || 40
  this.indexColFrozen = opts.indexColFrozen || false
  this.checkColWidth = opts.checkColWidth || 30
  this.checkColTitle = opts.checkColTitle || ''
  this.checkColFrozen = opts.checkColFrozen || false
  this.multiSelect = opts.multiSelect || false
  this.visCells = []
  this.sort_cols = []
  this.clickSelect = opts.clickSelect === undefined ? 'row' : opts.clickSelect
  this.showSelected = opts.showSelected === undefined ? true : opts.showSelected
  this.checkAll = opts.checkAll === undefined ? true : opts.checkAll
  this.noData = opts.noData || 'No Data'
  this.loading = opts.loading || 'Loading... <i class="fa fa-spinner fa-pulse fa-spin"></i>'
  this.container = opts.container || $(this.root).parent()
  this.editable = opts.editable || false
  this.draggable = opts.draggable || false
  this.theme = opts.theme || 'zebra'
  this.minColWidth = opts.minColWidth || 5
  this.contextMenu = opts.contextMenu || []
  this.virtual = opts.virtual || false

  this.minColWidth = opts.minColWidth || 100

  this.onUpdate = opts.onUpdate || function(){}
  this.onSort = opts.onSort || function(){}
  this.onRowClass = opts.onRowClass || function(){}
  this.onEdit = opts.onEdit || function(){return true}
  this.onEdited = opts.onEdited || function(){return true}
  this.onSelected = opts.onSelected || function(){}
  this.onSelect = opts.onSelect || function(){return true}
  this.onDeselect = opts.onDeselect || function(){return true}
  this.onDeselected = opts.onDeselected || function(){}
  this.onLoadData = opts.onLoadData || function(parent){}
  this.onCheckable = opts.onCheckable || function(row){return true}
  this.onEditable = opts.onEditable || function(row, col){return self.editable}
  this.onInitData = opts.onInitData || function(dataset) {return}

  this.tree = opts.tree
  this.showIcon = opts.showIcon === undefined ? true : opts.showIcon
  if (opts.useFontAwesome) {
    this.openIcon = opts.openIcon || '<i class="fa fa-minus-square-o"></i>'
    this.closeIcon = opts.closeIcon || '<i class="fa fa-plus-square-o"></i>'
  } else {
    this.openIcon = opts.openIcon || '-'
    this.closeIcon = opts.closeIcon || '+'
  }
  this.iconInden = 16
  this.expanded = opts.expanded === undefined ? false: opts.expanded
  this.idField = opts.idField || 'id'
  this.parentField = opts.parentField || 'parent'
  this.orderField = opts.orderField || 'order'
  this.levelField = opts.levelField || 'level'
  this.hasChildrenField = opts.hasChildrenField || 'has_children'
  this.indentWidth = 16
  this.colspanValue = opts.colspanValue || '--'

  this.selected_rows = []
  this.parents_expand_status = {}
  this.loaded_status = {}
  this.notations = {}
  this.xscroll_fix = 0
  this.yscroll_fix = 0
  this.rows = []

  this.browser = test_browser()

  this.show_loading = function (flag) {
    if (flag) {
      $(this.root).find('.rtable-loading').html(this.loading).show()
      $(this.root).find('.rtable-nodata').hide()
    }
    else
      $(this.root).find('.rtable-loading').hide()

  }

  this.load_clear = function() {
    self.selected_rows = []
    self.parents_expand_status = {}
    self.loaded_status = {}
    self.notations = {}
  }

  this.bind = function () {

    self._data.on('*', function(r, d){
      self.onUpdate(self._data, r, d)
      if (r == 'remove') {
        var index, items = d.items
        for(var i=0, len=items.length; i<len; i++){
          index = self.selected_rows.indexOf(items[i].id)
          if (index !== -1) self.selected_rows.splice(index, 1)
        }
      }
      if (r == 'loading') {
        self.show_loading(true)
        self.load_clear()
        return
      } else if (r == 'load'){

        self.init_data()
        self.show_loading(false)
      }
      self.ready_data()
      self.calScrollbar()
      self.calData()
      self.update()
    })
  }

  this.init_data = function() {
    this.onInitData.call(this, this._data)
  }

  this.ready_data = function(){
    var order = []

    if (!opts.tree && !opts.remoteSort && this.sort_cols.length) {
      for(i=0, len=this.sort_cols.length; i<len; i++) {
        col = this.sort_cols[i]
        if (col.direction == 'desc')
          order.push('-'+col.name)
        else if (col.direction == 'asc')
          order.push(col.name)
      }
      this.rows = this._data.get({order:order})
    }
    else
      this.rows = this._data.get()
  }

  function test_browser () {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    return Sys
  }

  this.on('mount', function() {

    var _opts = {tree:opts.tree, idField:this.idField, parentField:this.parentField,
      levelField:this.levelField, orderField:this.orderField, hasChildrenField:this.hasChildrenField}
    var d
    if (opts.data) {
      if (Array.isArray(opts.data)) {
        this._data = new DataSet()
        d = opts.data
      }
      else {
        var d = opts.data.get()
        this._data = opts.data
      }
    } else {
      this._data = new DataSet(_opts)
    }

    this.content = this.root.querySelectorAll(".rtable-body.rtable-main")[0]
    this.header = this.root.querySelectorAll(".rtable-header.rtable-main")[0]
    this.content_fixed = this.root.querySelectorAll(".rtable-body.rtable-fixed")[0]

    this._updated = false
    window.addEventListener('resize', function(){
      if (this.width_opt == 'auto' || this.height_opt == 'auto')
        self.resize()
    })

    this.content.addEventListener('scroll', function(e){
      self.scrolling(e)
    }, {passive:true})

    $(this.content).on('click', '.rtable-cell', this.click_handler)
      .on('dblclick', '.rtable-cell', this.dblclick_handler)
    $(this.content).on('mouseenter', '.rtable-row', this.hover_handler1)
      .on('mouseleave', '.rtable-row', this.hover_handler2)

    $(this.content_fixed).on('click', '.rtable-cell', this.click_handler)
      .on('dblclick', '.rtable-cell', this.dblclick_handler)
    $(this.content_fixed).on('mouseenter', '.rtable-row', this.hover_handler1)
      .on('mouseleave', '.rtable-row', this.hover_handler2)

    this.dnd()

    this.bind_contextmenu()
    this.scrollbar_width = getScrollbarWidth()
    this.ready_data()

    this.bind()

    if (opts.data) {
      if (opts.tree) {
        this._data.setOption(_opts)
        this._data.load_tree(d, {parentField:this.parentField,
          orderField:this.orderField, levelField:this.levelField,
          hasChildrenField:this.hasChildrenField, plain:true})
      } else
        this._data.load(d)
    }

  })

  this.hover_handler1 = function (e) {
    var index = $(this).index()
    $(self.content_fixed).find('.rtable-row:eq('+index+')').addClass('hover')
    $(self.content).find('.rtable-row:eq('+index+')').addClass('hover')
  }

  this.hover_handler2 = function (e) {
    var index = $(this).index()
    $(self.content_fixed).find('.rtable-row:eq('+index+')').removeClass('hover')
    $(self.content).find('.rtable-row:eq('+index+')').removeClass('hover')
  }

  this.dnd = function (reset) {
    var el = $(this.root)
    if (reset) {
      el.off('dragstart', '.rtable-cell-text[draggable]', this.handleDragStart)
        .off('dragover', '.rtable-cell-text[draggable]', this.handleDragOver)
        .off('drop', '.rtable-cell-text[draggable]', this.handleDrop)
      if (this.browser.ie) {
        el.off('selectstart', '.rtable-cell-text[draggable]', this.handleSelectStart)
      }
    }
    if (this.draggable) {
      el.on('dragstart', '.rtable-cell-text[draggable]', this.handleDragStart)
        .on('dragover', '.rtable-cell-text[draggable]', this.handleDragOver)
        .on('drop', '.rtable-cell-text[draggable]', this.handleDrop)
      if (this.browser.ie) {
        el.on('selectstart', '.rtable-cell-text[draggable]', this.handleSelectStart)
      }
    }
  }

  this.handleDragStart = function(e) {
    var col = e.target._tag.opts.col
    self.drag_start_element = e.target
    self.drag_src = col.row
    e.originalEvent.dataTransfer.effectAllowed = 'move'
  }

  this.handleSelectStart = function(e){
    e.preventDefault()
    e.stopPropagation()
    this.dragDrop();
    return false
  }

  function in_rect(r, v) {
    return (v.x>r.left && v.x<r.right && v.y>r.top && v.y<r.bottom)
  }

  function draw_rect(el, r, pos) {
    el.style.width = (r.right-r.left) + 'px'
    if (pos == 'before') {
      el.style.left = r.left + 'px'
      el.style.top = '0px'
      el.style.bottom = ''
    } else {
      el.style.top = ''
      el.style.left = r.left + 'px'
      el.style.bottom = '0px'
    }
  }
  this.handleDragOver = function(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (e.target.isSameNode(self.drag_start_element)) return
    if (!e.target._tag) return
    var col = e.target._tag.opts.col
    if (!col.treeField) return false
    var w = col.width,
      h = col.height, r_up, r_d_left, r_d_right, helper = e.target.querySelector('.rtable-draggable-helper')

    if (self._data.isChild(col.row, self.drag_src)) {
      return false
    }

    r_up = {top:0, left:0, right:w, bottom:h/2}
    r_d_left = {top:h/2, left:0, right:w*2/5, bottom:h}
    r_d_right = {top:h/2, left:w*2/5, right:w, bottom:h}

    var pos = {x: e.originalEvent.offsetX, y: e.originalEvent.offsetY}
    var up = in_rect(r_up, pos), left = in_rect(r_d_left, pos), right = in_rect(r_d_right, pos)
    if (up || left || right) {
      if (!helper){
        helper = document.createElement('div')
        helper.style.position = 'absolute'
        helper.className = 'rtable-draggable-helper'
        helper.style.zIndex = 1000
        helper.style.borderTop = '2px solid green'
        e.target.appendChild(helper)
        if (self.drag_helper) {
          $(self.drag_helper).remove()
          self.drag_helper = null
        }
        self.drag_helper = helper
      }
      if (up && self.drag_last_pos != 'before') {
        self.drag_last_pos = 'before'
        draw_rect(helper, r_up, self.drag_last_pos)
      } else if (left && self.drag_last_pos != 'after') {
        self.drag_last_pos = 'after'
        draw_rect(helper, r_d_left, self.drag_last_pos)
      } else if (right) {
        self.drag_last_pos = 'child'
        draw_rect(helper, r_d_right, self.drag_last_pos)
      }
    }

    col = e.target._tag.opts.col
    e.originalEvent.dataTransfer.dropEffect = 'move';

    return false;
  }

  this.handleDrop = function(e) {
    var last_pos = self.drag_last_pos
    if (!last_pos) return

    if (self.drag_helper) {
      $(self.drag_helper).remove()
      self.drag_helper = null
      self.drag_last_pos = ''
    }
    if (!e.currentTarget._tag) return
    var col = e.currentTarget._tag.opts.col
    var src_item = self.drag_src, to_item = col.row
    if (self.opts.onMove)
      self.opts.onMove(src_item, to_item, last_pos)

  }

  this.bind_contextmenu = function() {

    for (var i=0, len=this.contextMenu.length; i<len; i++) {
      item = this.contextMenu[i]
      item._fn = item.fn
    }

    var init_menus = function(row, col) {
      var item
      for (var i=0, len=self.contextMenu.length; i<len; i++) {
        item = self.contextMenu[i]
        var onclick = function(item, row, col) {
          return function(){
            item._fn.call(self, row, col)
          }
        }
        if (item.type != 'separator')
          item.fn = onclick(item, row, col)
      }
    }
    $(this.content).on('contextmenu', ".rtable-cell", function(e){
      var col = e.target._tag.opts.col
      var row = col.row
      self.select(row)
      self.update()
      e.preventDefault()
      init_menus(row, col)
      basicContext.show(self.contextMenu, e)
    })
  }

  this.on('updated', function(){
    if (!this._updated) {
      this.update()
    }

  })

  this.on('update', function(){
    this.start = opts.start || 0
    if (!self.content)
      return
    if (!this._updated && this._updated != 1) {

      this._updated = 1
      this.calSize()
      this.calHeaderHeight()
      this.calData()

      setTimeout(function(){
        self._updated = 2
        self.resize()
      }, 0)

    } else if(this._updated == 2 ){
      self.calVis()
    }
  })

  this.resize = function () {
    self.calSize()
    self.calHeader()
    self.calData()
    self.calScrollbar()
    self.header.scrollLeft = self.content.scrollLeft
    self.content_fixed.scrollTop = self.content.scrollTop
    this.calVis()
    self.update()
  }

  this.click_handler = function(e) {
    var ret, tag = e.target._tag
    if (self.editable && self.editor) {
      return
    }
    if (!tag) return
    var col = tag.opts.col
    if (opts.onClick) {
      ret = opts.onClick(col.row, col)
    }
    if (!ret && $(e.target).hasClass('rtable-cell-text')) {
      e.preventDefault()
      if (self.clickSelect === 'row') {
        self.toggle_select(col.row)
        self.update()
      } else if (self.clickSelect === 'column') {

      }
    }
  }

  this.dblclick_handler = function(e) {

    var ret, el = $(e.target), item
    if (el.hasClass('rtable-cell-text'))
      item = e.target
    else {
      item = el.parents('.rtable-cell-text')[0]
    }
    if (!item) return
    var tag = item._tag
    if (!tag) return
    var col = item._tag.opts.col
    if (opts.onDblclick)
      ret = opts.onDblclick(col.row, col)
    if (!ret) {
      e.preventDefault()
      if (opts.editable) {
        if (!col.editor) return

        if (!self.onEditable(col.row, col)) return
        e.preventUpdate = true
        document.selection && document.selection.empty && ( document.selection.empty(), 1)
        || window.getSelection && window.getSelection().removeAllRanges();
        create_editor($(item).parent()[0], col.row, col)
      }
    }
  }

  this.sort_handler = function(e) {
    var name, dir, col

    e.preventDefault()
    name = e.item.name
    if (self.sort_cols.length == 0)
      dir = 'asc'
    else {
      col = self.sort_cols[0]
      if (col.direction == 'desc') {
        dir = false
      } else if (col.direction == 'asc') {
        dir = 'desc'
      } else {
        dir = 'asc'
      }
    }
    if (dir)
      self.sort_cols = [{name:name, direction:dir}]
    else
      self.sort_cols = []
    if (opts.remoteSort)
      self.onSort.call(self, self.sort_cols)
    else {
      self.ready_data()
      self.calData()
    }
  }

  this.get_sort_top = function (dir) {
    var top
    if (dir == 'asc')
      top = (self.headerRowHeight - 16) / 2 + 4
    else if (dir == 'desc')
      top = (self.headerRowHeight - 16) / 2 + 2
    else
      top = (self.headerRowHeight - 16) / 2 + 4
    return top
  }

  this.create_col_drag_helper = function () {
    var root = $(this.root).find('.rtable-root')
    if (this.col_drag_helper) this.col_drag_helper.remove()
    this.col_drag_helper = helper = $('<div></div>')
    root.append(helper)
    helper.css({
      position:'absolute',
      zIndex:1000,
      border:'1px solid green',
      height:root.height(),
      top:0,
      display:'block'
    })
    helper.addClass('rtable-col-draggable-helper')
  }
  this.colresize = function (e) {
    var start = e.clientX
    var header = $(self.header)
    var root = $(document)
    var col = e.item
    var width = col.width, d
    var root = $(self.root).find('.rtable-root')
    var left = root.offset()['left']

    document.selection && document.selection.empty && ( document.selection.empty(), 1)
    || window.getSelection && window.getSelection().removeAllRanges();
    document.body.onselectstart = function () {
        return false;
    };
    header.css('-moz-user-select', 'none');
    self.create_col_drag_helper()
    self.col_drag_helper.css('left', e.clientX-left)

    root.on('mousemove', function(e){
      d = Math.max(width + e.clientX - start, self.minColWidth)
      col.real_col.width = d
      self.col_drag_helper.css('left', e.clientX-left)

    }).on('mouseup', function(e){
        self.col_drag_helper.remove()
        self.col_drag_helper = null
        document.body.onselectstart = function(){
            return true;
        };
        header.css('-moz-user-select','text');
        root.off('mousemove').off('mouseup')
        self.resize()
    })
  }

  function getScrollbarWidth() {
      var oP = document.createElement('p'),
          styles = {
              width: '100px',
              height: '100px',
              overflowY: 'scroll'
          }, i, scrollbarWidth;
      for (i in styles) oP.style[i] = styles[i];
      document.body.appendChild(oP);
      scrollbarWidth = oP.offsetWidth - oP.clientWidth;
      document.body.removeChild(oP);
      return scrollbarWidth;
  }
  function _parse_header(cols, max_level, frozen){
    var columns = [],
      columns_width = {},
      i, len, j, jj, col, jl,
      subs_len,
      path,
      rowspan,
      colspan,
      parent,
      new_col,
      left

    if (!cols || cols.length === 0)
      return []

    for (i=0; i<max_level; i++) {
      columns[i] = []
      columns_width[i] = 0
    }

    for(i=0, len=cols.length; i<len; i++) {
      col = cols[i]
      subs_len = col.subs.length
      rowspan = 1
      for (j=0; j<subs_len; j++) {
        path = col.subs[j]
        new_col = {}
        new_col.title = path.replace('%%', '/')
        if (j == subs_len - 1) {

          new_col.rowspan = max_level - (subs_len-1)*rowspan
          new_col.leaf = true
        } else {
          new_col.rowspan = rowspan
        }
        new_col.colspan = 1
        new_col.level = j
        new_col.col = i
        new_col.width = col.width
        new_col.height = new_col.rowspan * self.headerRowHeight
        new_col.top = (self.headerRowHeight) * j
        new_col.frozen = frozen
        new_col.buttons = col.buttons
        new_col.render = col.render
        new_col.name = col.name
        new_col.real_col = col
        new_col.fixed = col.fixed
        new_col.style = col.style
        new_col.type = col.type
        new_col.sort = col.sort
        new_col.align = col.align || 'left'
        new_col.class = col.class
        new_col.tag = col.tag || 'rtable-raw'
        new_col.editor = col.editor
        new_col.leaf = true
        if (col.headerTooltip) {
          if (typeof col.headerTooltip === 'string')
            new_col.tooltip = col.headerTooltip
          else if (typeof col.headerTooltip === 'function')
            new_col.tooltip = col.headerTooltip()
        }
        new_col.columnTooltip = col.columnTooltip

        if (columns[j].length > 0)
          left = columns[j][columns[j].length-1]
        else {
          left = null
        }

        if (left && left.title==new_col.title && left.level==new_col.level) {
          left.colspan ++
          left.width += new_col.width
          columns_width[j] += new_col.width
          left.leaf = false
        } else {

          columns[j].push(new_col)
          new_col.left = columns_width[j]
          columns_width[j] += new_col.width
          for (jl=1; jl<new_col.rowspan; jl++) {
            columns_width[j+jl] += new_col.width
          }
        }
        col.left = new_col.left
      }
    }
    var r = []
    for (i=0; i<max_level; i++)
      r = r.concat(columns[i])
    return r
  }

  this.calHeaderHeight = function () {
    var i, len, col, max_level=0, cols
    cols = this.opts.cols
    for (i=0, len=cols.length; i<len; i++){
      col = cols[i]
      max_level = Math.max(max_level, col.title.split('/').length)
    }
    this.max_level = max_level
    this.header_height = max_level * this.headerRowHeight
  }

  this.calHeader = function () {
    var columns,
      fix_columns,
      i, len,
      col,
      max_level,
      fix_cols = [],
      cols = [],
      cal_cols=[],
      width = 0,
      has_frozen = false,
      has_col, has_check;

    max_level = 0

    for (var x=0, _len=self.cols.length; x<_len; x++) {
      if(self.cols[x][self.nameField] == '__index_col__'){
        has_col = true
      } else if (self.cols[x][self.nameField] == '__check_col__'){
        has_check = true
      }
      if (this.cols[x].frozen){
        has_frozen = true
      }
      if (has_col && has_check && has_frozen) break
    }

    has_frozen = has_frozen || this.indexColFrozen || this.checkColFrozen

    if (opts.indexCol && !has_col) {
      col = {
        render:function(row, col, value){
          return col.index + 1
        },
        width:self.indexColWidth,
        frozen:has_frozen,
        align:'center'
      }
      col[this.nameField] = '__index_col__'
      col[this.titleField] = '#'
      this.cols.unshift(col)
    }

    if (opts.checkCol && !has_check) {
      col = {
        type:'check',
        width:self.checkColWidth,
        align:'center',
        frozen: has_frozen
      }
      col[this.nameField] = '__check_col__'
      col[this.titleField] = opts.checkColTitle || ''
      if (!opts.indexCol)
        this.cols.unshift(col)
      else
        this.cols.splice(1, 0, col)
    }

    for (i=0, len=this.cols.length; i<len; i++){
      col = this.cols[i]
      if (col.hidden)
        continue
      if (col.frozen)
        fix_cols.push(col)
      else
        cols.push(col)
      col.name = col[this.nameField]
      col.title = col[this.titleField]
      col.subs = col.title.split('/')
      max_level = Math.max(max_level, col.subs.length)
      if (!col.width)
        cal_cols.push(col)
      else
        width += col.width
    }
    this.max_level = max_level
    this.header_height = max_level * this.headerRowHeight
    this.calData()

    if ((this.rowHeight * this.rows.length > this.height - this.header_height))
      this.yscroll_fix = this.scrollbar_width
    else
      this.yscroll_fix = 0

    if (cal_cols.length > 0) {
      var w = this.width-width
      if (!this.browser.ie && this.container[0].scrollHeight > this.container[0].clientHeight)
        w -= this.yscroll_fix
      else if (this.browser.ie)
        w -= this.yscroll_fix
      var dw, lw
      lw = this.minColWidth*cal_cols.length

      if (w >= lw) {
        dw = Math.floor(w/cal_cols.length)
      } else {
        dw = this.minColWidth
        w = lw
      }
      for(var i=0, len=cal_cols.length; i<len; i++) {
        cal_cols[i].width = dw
        if (i == cal_cols.length - 1)
          cal_cols[i].width = w - (cal_cols.length-1)*dw

      }
    }

    columns = _parse_header(cols, max_level, false)
    fix_columns = _parse_header(fix_cols, max_level, true)

    this.fix_cols = fix_cols
    this.main_cols = cols
    this.fix_columns = fix_columns
    this.main_columns = columns
    this.max_level = max_level

    var fix_width = 0, main_width = 0, col;
    for (var i=0, len=this.cols.length; i<len; i++) {
      col = this.cols[i]
      if (col.hidden)
        continue
      if (col.frozen)
        fix_width += col.width
      else
        main_width += col.width
    }
    this.fix_width = fix_width
    this.main_width = main_width

  }

  this.calSize = function () {
    if (opts.width === 'auto' || !opts.width) {
      this.width = $(this.container).width()
    } else {
      this.width = opts.width
    }

    if (this.height_opt == 'auto'){

    } else {
      this.height = this.height_opt
    }
  }

  this.calScrollbar = function () {
    this.has_yscroll = this.content.scrollHeight > this.content.clientHeight || (this.rows.length * this.rowHeight > (this.height - this.header_height))

    if (this.height_opt == 'auto' && (!opts.maxHeight || (this.rows.length * this.rowHeight < opts.maxHeight - this.header_height)))
      this.has_yscroll = false
    this.has_xscroll = this.content.scrollWidth > this.content.clientWidth || this.main_width > (this.width - this.fix_width)
    this.xscroll_width = this.has_xscroll ? this.scrollbar_width : 0
    this.yscroll_width = this.has_yscroll ? this.scrollbar_width : 0
    this.xscroll_fix = this.has_xscroll ? this.xscroll_width : 0
    this.yscroll_fix = this.has_yscroll ? this.yscroll_width : 0

  }

  this.calData = function() {

    if (this.height_opt == 'auto') {

      this.height = Math.max(1, this.rows.length) * this.rowHeight + this.header_height

      if (!this.browser.ie) {
        this.height += this.scrollbar_width
      }
      if (opts.maxHeight)
        this.height = Math.min(opts.maxHeight, this.height)
      if (this.rows.length==0 && opts.minHeight)
        this.height = Math.max(opts.minHeight, this.height)
    }
  }

  this.calVis = function() {
    var i, j, last, len, len1, r2, cols, row, col, new_row, value, d, index,
      visrows, top, h, r1, vis_rows, vis_fixed_rows, v_row, vf_row, indent,
      hidden_nodes = {},
      last_colspan;

      function is_hidden (data, row) {
        if (!self.tree) return false
        var parent, stack=[], i, len
        parent = row[self.parentField]
        if (!parent) return false
        while (parent) {
          if (hidden_nodes.hasOwnProperty(parent))
            return hidden_nodes[parent]
          else {
            if (self.opened(parent)) {
              stack.push(parent)
              parent = self._data.get(parent)[self.parentField]
            } else {
              hidden_nodes[parent] = true
              for(i=0, len=stack.length; i<len; i++) {
                hidden_nodes[stack[i]] = true
              }
              return true
            }
          }
        }
        for(i=0, len=stack.length; i<len; i++) {
          hidden_nodes[stack[i]] = false
        }
      }

    r1 = {}
    r1.top = this.content.scrollTop
    r1.left = this.content.scrollLeft
    r1.bottom = r1.top + this.height - this.header_height - this.scrollbar_width
    r1.right = r1.left + this.width - this.fix_width - this.scrollbar_width

    if (this.virtual) {
      first = Math.max(Math.floor(this.content.scrollTop / this.rowHeight), 0)
      last = Math.ceil((this.content.scrollTop+this.height-this.header_height) / this.rowHeight)
    } else {
      first = 0
      last = this.rows.length
    }

    var b = new Date().getTime()

    len = last - first
    vis_rows = []
    vis_fixed_rows = []
    h = this.rowHeight
    cols = this.fix_columns.concat(this.main_columns)

    var last_val = {}
    var last_col_index = {}
    var now_row_combine_flag = []
    for (var key in this.combineCols) {
      last_col_index[key] = -1
      now_row_combine_flag.push(false)
    }

    i = 0
    index = 0

    while (i<this.rows.length) {
      row = this.rows[i]
      if (is_hidden(this.rows, row)) {
        i ++
        continue
      }
      if (index >= first) break
      i ++
      index ++
    }

    index = 0
    while (index<len && i<this.rows.length) {
      row = this.rows[i]

      if (is_hidden(this.rows, row)) {
        i++
        continue
      }
      v_row = {row:row, cols:[], line:first+index}
      vf_row = {row:row, cols:[], line:first+index}
      vis_rows.push(v_row)
      vis_fixed_rows.push(vf_row)

      top = h*(first+index)
      for (j=0, len1=cols.length; j<len1; j++) {
        col = cols[j]
        if (!col.leaf) continue

        if (row[col.name] == this.colspanValue) {
          last_colspan.width += col.width
          continue
        }
        d = {
          top:top,
          width:col.width,
          height:h,
          left: col.left,
          row:row,
          style:col.style,
          type:col.type,
          selected:this.is_selected(row),
          render:col.render,
          buttons:col.buttons,
          index:first+this.start+index,
          sor:col.sort,
          align:col.align,
          class:col.class,
          tag:col.tag,
          editor:col.editor,
          name:col.name,
          notation:this.get_col_notation(row, col)
        }

        last_colspan = d
        if (opts.treeField == col.name && opts.tree) {
          indent = row.level || 0
          if (row.has_children) {
            if (self.opened(row))
              d.expander = self.openIcon
            else
              d.expander = self.closeIcon
          }
          d.treeField = true
          indent ++
          d.indent = indent*self.indentWidth
          d.indentWidth = 'padding-left:' + d.indent + 'px'
        }
        d.value = row[col.name]
        d.__value__ = this.get_col_data(d, row[col.name])

        if (col.columnTooltip) {
          if (typeof col.columnTooltip === 'string')
            d.tooltip = col.columnTooltip
          if (typeof col.columnTooltip === 'function')
            d.tooltip = col.columnTooltip(row, d, d.value)
        }

        if (this.combineCols.indexOf(col.name) > -1) {

          var now_col_level = this.combineCols.indexOf(col.name)

          var before_col_combine_flag = ((now_col_level - 1) >= 0) ? now_row_combine_flag[now_col_level - 1] : true

          if (before_col_combine_flag && last_val[col.name] && (last_val[col.name].value == d.value)){

            now_row_combine_flag[now_col_level] = true

            d.height = 0

            last_val[col.name].height += h
          } else {

            now_row_combine_flag[now_col_level] = false

            last_col_index[col.name] = first+i

            last_val[col.name] = d
          }
        }

        if (col.frozen) {
          vf_row.cols.push(d)
        }
        else {

          if (this.virtual) {
            if (!(d.left > r1.right || d.right < r1.left))
              v_row.cols.push(d)
          } else {
            v_row.cols.push(d)
          }
        }
      }

      i++
      index++
    }
    this.visCells = {
      fixed: vis_fixed_rows,
      main: vis_rows
    }
  }

  this.get_col_notation = function(row, col) {
    var key = row.id + ':' + col.name
    return this.notations[key] || null
  }

  this.set_notation = function(row, field, notation) {
    var id = this.getId(row)
    var key = id + ':' + field
    this.notations[key] = notation
  }

  this.get_sorted = function(name) {
    var col

    for(var i=0, len=this.sort_cols.length; i<len; i++) {
      col = this.sort_cols[i]
      if (col.name == name && col.direction)
        return 'fa-sort-' + col.direction
    }
    return 'fa-sort'
  }

  this.getId = function(row) {
    return self._data.getId(row)
  }

  this.toggle_expand = function(e) {
    var id = self.getId(e.item.col.row), status = self.parents_expand_status[id]
    if (status === undefined)

      status = true
    self._expand(e.item.col.row, !status)
  }

  this.expand = function (row) {
    self._expand(row, true)
    self.update()
  }

  this.collapse = function (row) {
    self._expand(row, false)
    self.update()
  }

  this._expand = function(row, expanded) {
    var item, i, len, id, rows, row

    if (!row) {
      rows = self._data.get()
      for(var i=0, len=rows.length; i<len; i++) {
        row = rows[i]
        id = self.getId(row)
        if (row[self.hasChildrenField]) {
          self.parents_expand_status[id] = expanded
          if (expanded)
            self.load_node(self._data.get(id))
        }
      }
    } else {
      if (Array.isArray(row)) {
        for(i=0, len=row.length; i<len; i++) {
          id = self.getId(row[i])
          if (self.parents_expand_status.hasOwnProperty(id))
            self.parents_expand_status[id] = expanded
            if (expanded)
              self.load_node(self._data.get(id))
        }
      } else {
        id = self.getId(row)
        if (self.parents_expand_status.hasOwnProperty(id))
          self.parents_expand_status[id] = expanded
          if (expanded)
            self.load_node(self._data.get(id))
      }
    }

  }

  this.load_node = function(row) {
    var id = self.getId(row), index
    var status = self.loaded_status[id]

    if (!row[self.hasChildrenField]) return

    if (status) return

    if (self._data.has_child(row)) {
      self.loaded_status[row[self.idField]] = true
      return
    }
    self.onLoadData.call(self, row)
  }

  this.opened = function(row) {
      var id , status
      if (row instanceof Object){
        id = row.id
      } else
        id = row
      status = self.parents_expand_status[id]
      if (status === true) return true
      else if (status === false) return false
      self.parents_expand_status[id] = self.expanded
      return self.parents_expand_status[id]
  }

  this.scrolling = function(e) {
    self.header.scrollLeft = self.content.scrollLeft
    self.content_fixed.scrollTop = self.content.scrollTop
    if (this.virtual)
      return self.update()
  }

  var normalizeWheel = function (event) {
      var PIXEL_STEP = 10;
      var LINE_HEIGHT = 40;
      var PAGE_HEIGHT = 800;

      var sX = 0;
      var sY = 0;

      var pX = 0;
      var pY = 0;

      if ('detail' in event) {
          sY = event.detail;
      }
      if ('wheelDelta' in event) {
          sY = -event.wheelDelta / 120;
      }
      if ('wheelDeltaY' in event) {
          sY = -event.wheelDeltaY / 120;
      }
      if ('wheelDeltaX' in event) {
          sX = -event.wheelDeltaX / 120;
      }

      if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
          sX = sY;
          sY = 0;
      }
      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;
      if ('deltaY' in event) {
          pY = event.deltaY;
      }
      if ('deltaX' in event) {
          pX = event.deltaX;
      }
      if ((pX || pY) && event.deltaMode) {
          if (event.deltaMode == 1) {
              pX *= LINE_HEIGHT;
              pY *= LINE_HEIGHT;
          }
          else {
              pX *= PAGE_HEIGHT;
              pY *= PAGE_HEIGHT;
          }
      }

      if (pX && !sX) {
          sX = (pX < 1) ? -1 : 1;
      }
      if (pY && !sY) {
          sY = (pY < 1) ? -1 : 1;
      }
      return { spinX: sX,
          spinY: sY,
          pixelX: pX,
          pixelY: pY };
  };

  this.mousewheel = function(e) {
    var wheelEvent = normalizeWheel(event);

    if (Math.abs(wheelEvent.pixelX) > Math.abs(wheelEvent.pixelY)) {
        var left1 = this.header.scrollLeft, left2 = this.content.scrollLeft
        this.header.scrollLeft = this.header.scrollLeft + wheelEvent.pixelX
        this.content.scrollLeft = this.content.scrollLeft + wheelEvent.pixelX
        if ((left1 == this.header.scrollLeft) && (left2 == this.content.scrollLeft))
          return false
        return true
    }
    else if (wheelEvent.pixelY){
        var top1 = this.header.scrollTop, top2 = this.content.scrollTop
        this.header.scrollTop = this.header.scrollTop + wheelEvent.pixelY
        this.content.scrollTop = this.content.scrollTop + wheelEvent.pixelY
        if ((top1 == this.header.scrollTop) && (top2 == this.content.scrollTop))
          return false
        return true
    }
    return false
  }

  this.checkall = function(e) {
    e.preventUpdate = true
    var status = true
    if (self.selected_rows.length > 0)
      status = false
    var ids = self._data.getIds()
    for (var i=0, len=ids.length; i<len; i++) {
      if (status)
        self.select(self._data.get(ids[i]))
      else
        self.deselect(self._data.get(ids[i]))
    }
    self.update()
  }

  this.checkcol = function(e) {
    self.toggle_select(e.item.col.row)
    e.target.checked = self.is_selected(e.item.col.row)

  }

  this.toggle_select = function (row) {
    if (this.is_selected(row)) {
      self.deselect(row)
    } else {
      self.select(row)
    }
  }

  this.set_selected = function (row_ids) {
    this.selected_rows = row_ids
  }

  this.select = function(rows) {
    var row, id

    if (!rows) rows = this._data.get()
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    for(var i=0, len=rows.length; i<len; i++){
      row = rows[i]
      if (!self.onCheckable(row)) return
      if (row instanceof Object) id = row.id
      else id = row
      if (this.selected_rows.indexOf(id) == -1) {
        if (this.onSelect(row)) {
          if (!opts.multiSelect)
            self.selected_rows = []
          this.selected_rows.push(id)
          this.onSelected(row)
          if (this.observable)
            this.observable.trigger('selected', row)
        }
      }
    }

  }

  this.deselect = function(rows) {
    var r = [], row, selected_rows = this.selected_rows, index, items = [], id
    if (!rows) {
      items = this.selected_rows.slice()
    }
    else {
      if (!Array.isArray(rows))
        rows = [rows]
      for (var i=0, len=rows.length; i<len; i++) {
        if (rows[i] instanceof Object) id = rows[i].id
        else id = rows[i]
        items.push(id)
      }
      for(var i=selected_rows.length-1; i>-1; i--){
        row = selected_rows[i]
        if (!self.onCheckable(this._data.get(row))) return
        index = items.indexOf(row)
        if (index != -1){
          if (this.onDeselect(this._data.get(row))) {
            selected_rows.splice(i, 1)
            items.splice(index, 1)
            this.onDeselected(this._data.get(row))
            if (this.observable)
              this.observable.trigger('deselected', this._data.get(row))
          }
        }
      }
    }

  }

  function proxy(funcname) {
    return function f(){
      return self[funcname].apply(self, arguments)
    }
  }

  this.is_selected = function (row) {
    var id
    if (!row) return
    if (row instanceof Object) id = row.id
    else id = row
    return self.selected_rows.indexOf(id) !== -1
  }
  this.root.is_selected = proxy('is_selected')

  this.get_selected = function(){
    return this._data.get({
      filter:function(item){
        return self.selected_rows.indexOf(item.id) !== -1
      }
    })
  }
  this.root.get_selected = proxy('get_selected')
  this.root.set_selected = proxy('set_selected')
  this.root.expand = proxy('expand')
  this.root.collapse = proxy('collapse')
  this.root.show_loading = proxy('show_loading')
  this.root.select = proxy('select')
  this.root.deselect = proxy('deselect')

  this.root.resize = proxy('resize')

  function data_proxy (funcname) {
    return function() { return self._data[funcname].apply(self._data, arguments)}
  }

  this.root.add = data_proxy('add')
  this.root.addFirstChild = data_proxy('addFirstChild')
  this.root.update = data_proxy('update')
  this.root.remove = data_proxy('remove')
  this.root.get = data_proxy('get')
  this.root._get = data_proxy('_get')
  this.root.load = data_proxy('load')
  this.root.insertBefore = data_proxy('insertBefore')
  this.root.insertAfter = data_proxy('insertAfter')
  this.root.move = function () {
    var result = self._data.move.apply(self._data, arguments)
    self.expand(arguments[1])
    return result
  }
  this.root.diff = data_proxy('diff')
  this.root.save = data_proxy('save')
  this.root.refresh = proxy('update')
  this.root.set_notation = proxy('set_notation')

  this.root.setData = function(dataset){
    self._data = dataset
    self.bind()
  }.bind(this);

  this.get_col_data = function(col, value) {
    if (col.render && typeof col.render === 'function') {
      value = col.render(col.row, col, value)
    }
    return value || ''
  }

  this.action_click = function (col, btn) {
    return function (e) {
      if (btn.onclick && typeof btn.onclick === 'function') {

        btn.onclick.call(e.target, col.row, self.root)
      }
    }
  }

  this.get_cell_class = function (col) {
    var klass = [], cls
    klass.push('rtable-cell')
    if (col.selected) klass.push('selected')
    if (col['class']) {
      if (typeof col['class'] == 'function') {
        cls = col['class'](col.row, col, col.value)
      } else
        cls = col['class']
      if (cls)
        klass.push(cls)
    }
    return klass.join(' ')
  }

  this.get_row_class = function (row, index) {
    var klass = [], cls
    klass.push('rtable-row')
    if (index % 2 == 1) klass.push('even')
    else klass.push('odd')
    cls = this.onRowClass(row, index)
    if (cls)
      klass.push(cls)
    if (this.is_selected(row) && this.showSelected)
      klass.push('selected')
    return klass.join(' ')
  }

  this.addClass = function(cls, add) {
    var clss = this[cls].split(/\s+/)
    if(clss.indexOf(add) < 0) clss.push(add)
    this[cls] = clss.join(' ')
  }

  this.removeClass = function(cls, rem) {
    if(!this.hasClass(cls, rem)) return;
    var clss = this[cls].split(/\s+/)
    clss.splice(clss.indexOf(rem), 1)
    this[cls] = clss.join(' ')
  }

  this.hasClass = function(haystack, needle) {
    return this[haystack].split(/\s+/).indexOf(needle) > -1
  }

  this.testing = function () {
    console.log('testing', arguments)
    return true
  }

  var create_editor = function (target, row, col) {
    var name

    if (typeof col.editor === 'string')
      name = col.editor
    else
      name = col.editor.name
    if (self.editor) {
      self.editor.destroy()
      self.editor = null
    }
    var editor = window[name+'_editor']
    if (editor) {
      $.when(self.onEdit()).then(function(r){
        if (r)
          self.editor = editor.call(self, target, row, col)
      })
    }
  }
});

riot.tag2('rtable-cell', '<div class="rtable-cell-text {rtable-tree-field:opts.col.treeField}" draggable="{parent.draggable && (!parent.tree || parent.tree && opts.col.treeField) ? ⁗true⁗ : false}"> <yield></yield> </div>', 'rtable-cell [draggable],[data-is="rtable-cell"] [draggable]{ -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; user-select: none; -khtml-user-drag: element; -webkit-user-drag: element; }', 'class="rtable-cell-text-wrapper"', function(opts) {

  var self = this
  this.prevtag = null

  this.on('mount', function() {
    if (!opts.tag) {
      return
    }

    return this.mountedTag = riot.mount(this.root.querySelector('div'), opts.tag, opts)[0]
  });

  this.on('update', function() {
    var _opts = $.extend({}, opts)

    if (this.mountedTag) this.mountedTag.unmount(true)
    var tag = this.mountedTag = riot.mount(this.root.querySelector('div'), opts.tag, opts)[0]
    return tag

  });

  this.on('unmount', function() {
    if (this.mountedTag) {
      return this.mountedTag.unmount(true)
    }
  })
});

riot.tag2('rtable-raw', '<span></span>', '', '', function(opts) {
  this.on('mount', function(){
    this.root.innerHTML = opts.content
  })
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
});


riot.tag2('query-condition', '<div class="query-condition"> <form method="get" action="{opts.url}"> <div each="{row, i in layout}" show="{i==0 || show}" class="{condition-row:true, condition-row-more:i>0}"> <div each="{field in row}" class="condition-cell"> <span class="condition-label {nomore:i==0 &&!show}" riot-style="min-width:{!show?0:labelWidth}px">{fields[this.field].label || field}</span> <input-field field="{fields[field]}" data="{data}" type="{fields[this.field].type || \'str\'}" riot-style="min-width:{field.width || inputWidth}px"> </input-field> </div> <div if="{i==0 && !show}" class="condition-cell condition-buttons"> <button class="btn btn-primary btn-flat" type="submit"><i class="fa fa-search"></i> {searchTitle}</button> <button class="btn btn-link btn-flat" type="button" onclick="{parent.reset}">{clearTitle}</button> </div> </div> <div class="condition-row condition-row-more condition-buttons" show="{show}"> <button class="btn btn-primary btn-flat" type="submit"><i class="fa fa-search"></i> {searchTitle}</button> <button class="btn btn-link btn-flat" type="button" onclick="{reset}">{clearTitle}</button> </div> <div if="{layout.length > 1}" class="{condition-more:true, visible:layout.length>1, hover:hover}"> <span href="#" onclick="{click}" onmouseenter="{mouseenter}" onmouseleave="{mouseleave}"> {show? moreTitle[0] : moreTitle[1]} <i class="{fa:true, fa-angle-up:show, fa-angle-down:!show}"></i> </span> </div> </form> </div>', 'query-condition .query-condition,[data-is="query-condition"] .query-condition{ margin-bottom:5px; background-color: white; padding: 5px; } query-condition .condition-row,[data-is="query-condition"] .condition-row{ margin-top: 5px; margin-bottom: 5px; padding-top: 5px; } query-condition .condition-row-more,[data-is="query-condition"] .condition-row-more{ border-top: 1px solid #ddd; } query-condition .condition-row:last-child,[data-is="query-condition"] .condition-row:last-child{ border-bottom: none; } query-condition .condition-label,[data-is="query-condition"] .condition-label{ margin-left:8px; margin-right:8px; display: inline-block; text-align: right; } query-condition .condition-label.nomore,[data-is="query-condition"] .condition-label.nomore{ min-width: 0px; } query-condition .condition-cell,[data-is="query-condition"] .condition-cell{ display: inline-block; } query-condition .condition-more,[data-is="query-condition"] .condition-more{ text-align: center; margin-top: 5px; margin-bottom: 10px; position: relative; height: 18px; line-height: 18px; } query-condition .condition-more.visible,[data-is="query-condition"] .condition-more.visible{ border-top:1px solid #ddd; } query-condition .condition-more.visible.hover,[data-is="query-condition"] .condition-more.visible.hover{ border-top:1px solid red; } query-condition .condition-more span,[data-is="query-condition"] .condition-more span{ position: absolute; left:0; right:0; top:-1px; width:100px; border: 1px solid #ddd; border-top: 1px solid white; margin: 0 auto; cursor: pointer; font-size: 80%; background-color: white; line-height: 22px; height:22px; } query-condition .condition-more span:hover,[data-is="query-condition"] .condition-more span:hover{ border: 1px solid red; border-top: 1px solid white; } query-condition .form-control,[data-is="query-condition"] .form-control{ display:inline-block; vertical-align: middle; } query-condition input-field,[data-is="query-condition"] input-field{ display:inline-block; } query-condition .condition-row.condition-row-more.condition-buttons,[data-is="query-condition"] .condition-row.condition-row-more.condition-buttons{ text-align: center; margin-right: 5px; } query-condition .condition-row.condition-row-more.condition-buttons button,[data-is="query-condition"] .condition-row.condition-row-more.condition-buttons button{ margin-right: 5px; } query-condition .multiselect-container li input[type="radio"],[data-is="query-condition"] .multiselect-container li input[type="radio"]{margin-left:-200px;}', '', function(opts) {
      var self = this
      this.layout = opts.layout
      this.fields = {}
      this.labelWidth = opts.labelWidth || 100
      this.inputWidth = opts.inputWidth || 200
      this.searchTitle = opts.searchTitle || '查询'
      this.clearTitle = opts.clearTitle || '清除条件'
      this.moreTitle = opts.moreTitle || ['收起', '更多条件']
      this.ajax = opts.ajax
      this.url = opts.url

      opts.fields.forEach(function(v){
        self.fields[v['name']] = v
        if (v.type == 'select')
          v.placeholder = v.placeholder || '--- 请选择 ---'
        v._width = v.width ? v.width+'px' : (v.range?'auto':'100%')
      })
      this.show = false
      self.hover = false

      var query = new QueryString(this.url)
      this.data = $.extend({}, query.urlParams, opts.data)

      if (!this.layout) {
          this.layout = []
          var s = []
          this.layout.push(s)
          for (k in this.fields) {
              s.push(k);
          }
      }

      this.click = function(e){
        self.show = !self.show
      }

      this.mouseenter = function(e) {
        self.hover = true
      }

      this.mouseleave = function(e) {
        self.hover = false
      }

      this.reset = function(e){
        for (k in self.fields) {
          var field = self.fields[k]
          if (field.type == 'select' && field['data-url']) {
            $('[name='+k+']', self.root).val('').trigger('change')
          }
          else if (field.type == 'select') {

            $('[name='+k+']', self.root)
              .multiselect('deselectAll', false)
              .multiselect('updateButtonText')
          } else
            $('[name='+k+']', self.root).val(null)
        }
      }

      this.on('mount', function(){
        if (self.ajax) {
          $(':submit', self.root).click(function (e) {
            e.preventDefault()
            var d = serializeObject(self.root)
            var url = get_url(self.url, d)

            self.parent.page = 1
            self.parent.load(url)
          })
        }
      })

});

riot.tag2('input-field', '<input type="text" name="{opts.field.name}" class="form-control" field-type="str" if="{opts.type==\'str\' || opts.type==\'unicode\' || opts.type==\'int\'}" placeholder="{get_placeholder(opts.field.placeholder, 0)}" riot-style="width:{opts.field._width}"> <input type="password" name="{opts.field.name}" class="form-control" field-type="password" if="{opts.type==\'password\'}" placeholder="{opts.field.placeholder}" riot-style="width:{opts.field._width}"> <select multiple="{opts.field.multiple}" if="{opts.type==\'select\'}" field-type="select" riot-style="width:{opts.field._width}" name="{opts.field.name}" data-url="{opts.field[\'data-url\']}" placeholder="{opts.field.placeholder}"> <option if="{opts.field.placeholder && !opts.field.multiple}" value="">{opts.field.placeholder}</option> <option each="{value in opts.field.choices}" riot-value="{value[0]}"> {value[1]} </option> </select> <input type="text" name="{opts.field.name}" class="form-control" field-type="{opts.type}" if="{(opts.type==\'date\' || opts.type==\'datetime\')}" placeholder="{get_placeholder(opts.field.placeholder, 0)}" riot-style="width:{opts.field._width}"> {⁗-⁗: opts.field.range} <input type="text" name="{opts.field.name}" class="form-control" field-type="{opts.type}" if="{(opts.type==\'date\' || opts.type==\'datetime\' || opts.type==\'str\' || opts.type==\'unicode\' || opts.type==\'int\') && opts.field.range==true}" placeholder="{get_placeholder(opts.field.placeholder, 1)}" riot-style="width:{opts.field._width}">', '', '', function(opts) {
    var self = this

    this.on('mount', function(){
      var i18n = {
        previousMonth : '上个月',
        nextMonth   : '下个月',
        months      : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        weekdays    : ['周日','周一','周二','周三','周四','周五','周六'],
        weekdaysShort : ['日','一','二','三','四','五','六']
      }

      if (opts.type == 'select' && opts.field['data-url']){
        load('ui.select2', function(){
          var el = $('[name='+opts.field.name+']', self.root);
          simple_select2(el, {width:'resolve'})
        })
      }else if (opts.type == 'select') {
        var _opts = $.extend({}, {
            includeSelectAllOption: true,
            selectAllText: '全选',
            allSelectedText: '全部选中',
            nSelectedText: '个已选',

            buttonClass: 'btn btn-default btn-flat',
            numberDisplayed: 2,
            selectedClass: '',
            nonSelectedText: opts.field.placeholder || '请选择',
            maxHeight: 200
            }, opts.field.opts || {})

        if (opts.field.relate_from) {
          if (!opts.field.choices_url) {

            var trigger_name = opts.field.relate_from;
            var trigger = $($('[name="' + trigger_name + '"]')[0]);
            var actor = $($('[name="' + opts.field.name + '"]')[0]);
            var relation_kv = opts.field.relationship;
            var actor_full_choices = opts.field.choices;

            $('body').on('change', '[name="' + trigger_name + '"]', function(){
              var trigger_selected = trigger.val();
              var allow_options = [];
              $.each(trigger_selected || [], function(){
                if (isNaN(parseInt(this))) {
                  Array.prototype.push.apply(allow_options, relation_kv[this]);
                } else {
                  Array.prototype.push.apply(allow_options, relation_kv[parseInt(this)]);
                }
              });

              opts.field.choices = [];
              $.each(actor_full_choices, function() {
                if (allow_options.indexOf(""+this[0]) > -1) {
                  opts.field.choices.push(this);
                }
              });

              self.update();
              if ($.fn.multiselect) {
                actor.multiselect('rebuild');
              }
            });
          } else {

            var trigger_name_list = [];
            var actor = $($('[name="' + opts.field.name + '"]')[0]);
            if (typeof(opts.field.relate_from) == 'string'){
              trigger_name_list.push(opts.field.relate_from);
            } else if (typeof(opts.field.relate_from) == 'object'){
              trigger_name_list = opts.field.relate_from;
            }
            var len = trigger_name_list.length;
            for (var t = 0; t < len; t++){
              $('body').on('change', '[name="' + trigger_name_list[t] + '"]', function(){
                var trigger_selected_list = [];
                for (var tt = 0; tt < len; tt++){
                  var trigger_selected = $('[name=' + trigger_name_list[tt] + ']').val();
                  if (!!trigger_selected && typeof(trigger_selected) == 'object') {
                    if (trigger_selected.length >= 2) {
                      trigger_selected = trigger_selected.join(',');
                    } else if (trigger_selected.length == 1) {
                      trigger_selected = trigger_selected[0];
                    } else {
                      trigger_selected = "-1";
                    }
                  } else {
                    if (trigger_selected === undefined || trigger_selected === null || !("" + trigger_selected)){
                      trigger_selected = "-1";
                    }
                  }

                  trigger_selected_list.push(trigger_selected);
                }

                var trigger_selected_url_string = trigger_selected_list.join('/');
                $.ajax({
                  method: "post",
                  url: opts.field.choices_url + '/' + trigger_selected_url_string,
                  async: false,
                  success: function(result) {
                    opts.field.choices = result;
                    self.update();
                    if ($.fn.multiselect) {
                      actor.multiselect('rebuild');
                    }
                  }
                });
              });
            }

            $.each(trigger_name_list, function(){
              $('[name=' + this + ']').trigger('change');
            });
          }
        }

        load('ui.bootstrap.multiselect', function(){
          var el = $('[name='+opts.field.name+']', self.root).multiselect(_opts);
          if (opts.data[opts.field.name])
            el.multiselect('select', opts.data[opts.field.name])
        })
      } else if (opts.type == 'date') {
        var _opts = {format: 'YYYY-MM-DD', showTime:false, i18n:i18n};
        load('ui.pikaday', function(){
          $('[name='+opts.field.name+']').pikaday(_opts);
        })
      } else if (opts.type == 'datetime') {
        var _opts = {format: 'YYYY-MM-DD HH:mm:ss', showTime:true, use24hour:true, i18n:i18n}
        load('ui.pikaday', function(){
          $('[name='+opts.field.name+']').pikaday(_opts);
        })
      } else {
      }
      if (opts.data[opts.field.name])
        if (opts.type == "select" || typeof(opts.data[opts.field.name]) == "string") {
          $('[name='+opts.field.name+']').val(opts.data[opts.field.name])
        } else {
          $($('[name='+opts.field.name+']')[0]).val(opts.data[opts.field.name][0]);
          $($('[name='+opts.field.name+']')[1]).val(opts.data[opts.field.name][1]);
        }
    })

    this.get_placeholder = function (placeholder, index) {
      index = index === undefined ? 0 : index
      return Array.isArray(placeholder) ? placeholder[index]: placeholder
    }
});


riot.tag2('pagination', '<ul if="{theme==\'long\'}" class="pagination"> <li if="{totalMessage}" class="disabled total"><a>{totalMessage}</a></li> <li if="{has_first}" class="first"><a href="#" onclick="{go(1)}"><pagination-raw content="{first}"></pagination-raw></a></li> <li if="{has_prev}" class="prev"><a href="#" onclick="{go(page-1)}"><pagination-raw content="{prev}"></pagination-raw></a></li> <li class="{page:true, active:p==page}" each="{p in pages}"><a href="#" onclick="{go(p)}">{p}</a></li> <li if="{has_next}" class="next"><a href="#" onclick="{go(page+1)}"><pagination-raw content="{next}"></pagination-raw></a></li> <li if="{has_last}" class="last"><a href="#" onclick="{go(totalPages)}"><pagination-raw content="{last}"></pagination-raw></a></li> <li if="{refresh}" class="refresh"><a href="#" onclick="{go(page)}"><pagination-raw content="{refresh}"></pagination-raw></a></li> </ul> <div if="{theme==\'long\' && buttons.length>0}" class="pull-right {btn_group_class}"> <button each="{btn in buttons}" data-is="pagination-button" btn="{btn}"></button> </div> <div if="{theme==\'simple\'}" class="{btn_group_class} pull-left pagination"> <a class="btn btn-default" disabled="{totalPages<=1 || page==1}" onclick="{go(1)}" title="{first_title}"><pagination-raw content="{first}"></pagination-raw></a> <a class="btn btn-default" disabled="{!has_prev}" onclick="{go(page-1)}" title="{prev_title}"><pagination-raw content="{prev}"></pagination-raw></a> <a class="btn btn-default page_input">第 <input type="text" onkeyup="{page_input_click}" riot-value="{page}" style="width:40px"> 页/共{totalPages}页</input></a> <a class="btn btn-default" disabled="{!has_next}" onclick="{go(page+1)}" title="{next_title}"><pagination-raw content="{next}"></pagination-raw></a> <a class="btn btn-default" disabled="{totalPages<=1 || page==totalPages}" onclick="{go(totalPages)}" title="{last_title}"><pagination-raw content="{last}"></pagination-raw></a> <a if="{refresh}" class="btn btn-default" onclick="{go(page)}" title="{refresh_title}"><pagination-raw content="{refresh}"></pagination-raw></a> </div> <div if="{theme==\'simple\' && buttons.length>0}" class="pull-left {btn_group_class}"> <button each="{btn in buttons}" data-is="pagination-button" btn="{btn}"></button> </div> <p if="{theme==\'simple\'}" class="pull-right message">{totalMessage}</p>', 'pagination .pagination,[data-is="pagination"] .pagination{margin-right:5px;} pagination .pagination>li.disabled>a,[data-is="pagination"] .pagination>li.disabled>a{color:#999;} pagination .page_input,[data-is="pagination"] .page_input{padding:0px 12px; line-height: 34px; height:34px;} pagination .page_input input,[data-is="pagination"] .page_input input{height:20px;line-height:20px;margin:0;} pagination .message,[data-is="pagination"] .message{line-height: 34px;line:34px;margin:0 auto;} pagination .btn.disabled,[data-is="pagination"] .btn.disabled{cursor:not-allowed;}', '', function(opts) {

  var self = this
  this.observable = opts.observable

  this.total = opts.total
  this.theme = opts.theme || 'simple'
  this.page = opts.page || 1
  this.limit = opts.limit || 10
  this.data = opts.data
  this.limits = opts.limits || [10, 20, 30, 40, 50]
  this.buttons = opts.buttons || []
  this.size = opts.size || 10
  this.btn_group_class = opts.btn_group_class || 'btn-group'
  this.pages = []
  this.onpage = opts.onPage || function () {
    return self.data.load(self.get_url(), function(data){
      self.total = data.total

      return data.rows
    })
  }
  this.onpagechanged = opts.onpagechanged

  this._totalMessage = opts.totalMessage || '共 $pages 页 / $records 条记录'
  this.prev = opts.prev || '上一页'
  this.prev_title = opts.prev_title || this.prev
  this.has_prev = false
  this.next = opts.next || '下一页'
  this.next_title = opts.next_title || this.next
  this.has_next = false
  this.first = opts.first || '首页'
  this.first_title = opts.first_title || this.first
  this.has_first = false
  this.last = opts.last || '尾页'
  this.last_title = opts.last_title || this.last
  this.has_last = false
  this.refresh = opts.refresh || '刷新'
  this.refresh_title = opts.refresh_title || this.refresh

  if (this.theme == 'simple') {
    this._totalMessage = opts.totalMessage || '共 $records 条记录'
    this.prev = opts.prev || '<i class="fa fa-backward"></i>'
    this.next = opts.next || '<i class="fa fa-forward"></i>'
    this.first = opts.first || '<i class="fa fa-fast-backward"></i>'
    this.last = opts.last || '<i class="fa fa-fast-forward"></i>'
    this.refresh = opts.refresh || '<i class="fa fa-refresh"></i>'
  }

  this.on('update', function(){
    this.url = opts.url
    this.total = opts.total
    this.page = opts.page
    this.show()
  })

  this.get_url = function(page) {
    return get_url(self.url, {page:page||self.page, limit:self.limit})
  }

  this.push_url = function (url) {
    if(history && history.pushState) history.pushState(null, null, url)
  }

  this.go_page = function (page) {
    var old_page = self.page
    if (self.totalPages == 0) return
    this.observable.trigger('beforepage', page)
    if (opts.onbeforepage && typeof opts.onbeforepage === 'function') {
      if (!opts.onbeforepage.call(self, page))
        return
    }
    self.page = page
    if (self.onpage && typeof self.onpage === 'function') {
      $.when(self.onpage.call(self, page)).done(function(data){
        self.show(page)
        if (self.onpagechanged) {
          self.onpagechanged.call(self, page)
        }
      })
    } else {
      self.show()
    }
  }

  this.go = function (page) {
    f = function (e) {
      e.preventDefault()
      self.go_page(page)
    }
    return f
  }

  this.page_input_click = function(e) {
    if (e.keyCode == 13) {
      var page = $(e.target).val()
      if (page)
        this.go_page(page)
    }
  }

  this.show = function (page) {
    self.total = opts.total || self.total
    self.page = page || self.page
    self.totalPages = parseInt(self.total / self.limit)
    if (self.total % self.limit > 0) self.totalPages++;
    if (self._totalMessage){
      self.totalMessage = self._totalMessage.replace('$pages', self.totalPages);
      self.totalMessage = self.totalMessage.replace('$records', self.total);
    }

    var page = self.page;
    var mid = self.size / 2;
    if (self.size % 2 > 0) mid = (self.size + 1) / 2;
    var startIndex = 1;
    if (page >= 1 && page <= self.totalPages) {
      if (page >= mid) {
        if (self.totalPages - page >= mid) startIndex = page - (mid - 1);
        else startIndex = Math.max(self.totalPages - self.size + 1, 1);
      }
    }

    self.pages = []
    for(var i=startIndex, len=Math.min(startIndex+self.size-1, self.totalPages); i<=len; i++) {
      self.pages.push(i)
    }

    if (self.size > 1) {
      self.has_prev = self.prev && page > 1
      self.has_next = self.next && page < self.totalPages
      self.has_first = startIndex !== 1
      self.has_last = self.pages[self.pages.length-1] < self.totalPages
    } else {
      self.has_prev = false
      self.has_next = false
      self.has_last = false
      self.has_first = false
    }
  }

});

riot.tag2('pagination-raw', '<span></span>', '', '', function(opts) {
  this.on('mount', function(){
    this.root.innerHTML = opts.content
  })
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
});

riot.tag2('pagination-button', '<i if="{opts.btn.icon}" class="{opts.btn.icon}"></i> <span>{opts.btn.label}</span>', '', 'class="{opts.btn.class}" id="{opts.btn.id}" type="button" disabled="{opts.btn.disabled(btn)}" onclick="{opts.btn.onclick}"', function(opts) {
});

riot.tag2('rgrid', '<query-condition if="{has_query}" rules="{query_rules}" url="{query_url}" ajax="{query_ajax}" fields="{query_fields}" layout="{query_layout}" data="{query_data}"></query-condition> <div if="{left_tools.length>0 || right_tools.length>0}" class="btn-toolbar"> <div if="{left_tools.length>0}" class="rgrid-tools pull-left"> <div each="{btn_group in left_tools}" class="{btn_group_class}"> <button each="{btn in btn_group}" data-is="rgrid-button" btn="{btn}"></button> </div> </div> <div if="{right_tools.length>0}" class="rgrid-tools pull-right"> <div each="{btn_group in right_tools}" class="{btn_group_class}"> <button each="{btn in btn_group}" data-is="rgrid-button" btn="{btn}"></button> </div> </div> </div> <yield></yield> <rtable cols="{cols}" options="{rtable_options}" data="{data}" start="{start}" observable="{observable}"></rtable> <div class="clearfix tools"> <pagination if="{pagination}" data="{data}" url="{url}" page="{page}" total="{total}" observable="{observable}" limit="{limit}" onpagechanged="{onpagechanged}" onbeforepage="{onbeforepage}" buttons="{footer_tools}" theme="{page_theme}"></pagination> <div if="{!pagination && footer_tools.length>0}" class="pull-right {btn_group_class}"> <button each="{btn in footer_tools}" data-is="rgrid-button" btn="{btn}"></button> </div> </div>', 'rgrid .rgrid-tools,[data-is="rgrid"] .rgrid-tools{margin-bottom:5px;padding-left:5px;} rgrid .btn-toolbar .btn-group,[data-is="rgrid"] .btn-toolbar .btn-group{margin-right:8px;}', '', function(opts) {


  var self = this

  if (opts.data) {
    if (Array.isArray(opts.data)) {
      this.data = new DataSet(opts.data)
    } else
      this.data = opts.data
  } else
    this.data = new DataSet()
  this.cols = opts.cols
  this.url = opts.url

  var query = new QueryString(this.url)
  this.observable = opts.observable || riot.observable()
  this.page = opts.page || parseInt(query.get('page')) || 1
  this.limit = opts.limit || 10
  this.total = opts.total || 0
  this.pagination = opts.pagination == undefined ? true : opts.pagination
  this.has_query = opts.query !== undefined
  this.query = opts.query || {}
  this.query_rules = this.query.rules || {}
  this.query_fields = this.query.fields || []
  this.query_layout = this.query.layout || []
  this.query_data = this.query.data || {}
  this.query_url = opts.query_url || this.url
  this.query_ajax = opts.query_ajax
  this.start = (this.page - 1) * this.limit
  this.footer_tools = opts.footer_tools || []
  this.left_tools = opts.left_tools || opts.tools || []
  this.right_tools = opts.right_tools || []
  this.btn_group_class = opts.btn_group_class || 'btn-group btn-group-sm'
  this.onLoaded = opts.onLoaded
  this.autoLoad = opts.audoLoad || true
  this.onBeforePage = opts.onBeforePage || function (page){ return true }
  this.page_theme = opts.page_theme || 'simple'

  this.onsort = function (sorts) {
    var _url
    if (sorts.length > 0) {
      _url = get_url(self.url, {sort:sorts[0].name+'.'+sorts[0].direction})
    } else
      _url = get_url(self.url, {sort:''})

    self.url = _url
    self.load(_url, function(r){
      return r.rows
    })
  }

  this.onloaddata = function (parent) {
    var param = {parent:parent[opts.idField || 'id']}
    $.getJSON(self.url, param).done(function(r){
      if (r.rows.length > 0) {
        self.data.add(r.rows, parent)
      }
      else {
        parent.has_children = false
        self.update()
      }
    })
  }

  this.onbeforepage = function (page) {
    self.page = page
    var r = self.onBeforePage(page)
    if (r) {
      self.start = (page - 1) * self.limit
      return true
    } else {
      return false
    }
  }

  this.rtable_options = {
    theme : opts.theme || 'zebra',
    combineCols : opts.combineCols,
    nameField : opts.nameField || 'name',
    labelField : opts.labelField || 'title',
    indexCol: opts.indexCol,
    checkCol: opts.checkCol,
    checkColTitle: opts.checkColTitle,
    checkColWidth: opts.checkColWidth,
    indexColFrozen: opts.indexColFrozen,
    checkColFrozen: opts.checkColFrozen,
    showSelected: opts.showSelected,
    checkAll: opts.checkAll,
    multiSelect: opts.multiSelect,
    maxHeight: opts.maxHeight,
    minHeight: opts.minHeight,
    height: opts.height,
    width: opts.width,
    clickSelect: opts.clickSelect,
    rowHeight: opts.rowHeight,
    container: $(this.root).parent(),
    noData: opts.noData,
    tree: opts.tree,
    expanded: opts.expanded === undefined ? true : opts.expanded,
    useFontAwesome: opts.useFontAwesome === undefined ? true : opts.useFontAwesome,
    idField: opts.idField,
    parentField: opts.parentField,
    orderField: opts.orderField,
    levelField: opts.levelField,
    treeField: opts.treeField,
    hasChildrenField: opts.hasChildrenField,
    virtual: opts.virtual,
    contextMenu: opts.contextMenu,
    onDblclick: opts.onDblclick,
    onClick: opts.onClick,
    onMove: opts.onMove,
    onEdit: opts.onEdit,
    onEdited: opts.onEdited,
    onSelect: opts.onSelect,
    onDeselect: opts.onDeselect,
    onSelected: opts.onSelected,
    onDeselected: opts.onDeselected,
    onLoadData: opts.onLoadData || this.onloaddata,
    onSort: opts.onSort || this.onsort,
    onCheckable: opts.onCheckable,
    onEditable: opts.onEditable,
    onInitData: opts.onInitData,
    colspanValue: opts.colspanValue,
    draggable: opts.draggable,
    editable: opts.editable,
    remoteSort: opts.remoteSort
  }

  this.on('mount', function(){
    this.table = this.root.querySelector('rtable')

    var item, items
    var tools = this.left_tools.concat(this.right_tools).concat([this.footer_tools])
    for(var i=0, len=tools.length; i<len; i++){
        items = tools[i]
        for(var j=0, _len=items.length; j<_len; j++) {
          item = items[j]
          var onclick = function(btn) {
              return function(e) {
                if (btn.onClick)
                  return btn.onClick.call(self, e)
                if (btn.url)
                  window.location.href = btn.url
              }
          }
          item.onclick = onclick(item)

          item.disabled = function(btn) {
              if (btn.onDisabled)
                return btn.onDisabled.call(self)
              if (btn.checkSelected)
                return self.table.get_selected().length == 0
          }
          item.class = 'btn ' + (item.class || 'btn-primary')
        }
    }

    this.root.add = this.table.add
    this.root.addFirstChild = this.table.addFirstChild
    this.root.update = this.table.update
    this.root.remove = this.table.remove
    this.root.get = this.table.get
    this.root._get = this.table._get
    this.root.load = this.load
    this.root.insertBefore = this.table.insertBefore
    this.root.insertAfter = this.table.insertAfter
    this.root.get_selected = this.table.get_selected
    this.root.expand = this.table.expand
    this.root.collapse = this.table.collapse
    this.root.is_selected = this.table.is_selected
    this.root.move = this.table.move
    this.root.save = this.table.save
    this.root.diff = this.table.diff
    this.root.getButton = this.getButton
    this.root.refresh = this.update
    this.root.select = this.table.select
    this.root.deselect = this.table.deselect
    this.root.set_selected = this.table.set_selected
    this.root.resize = this.table.resize
    this.root.instance = this
    if (this.url && this.autoLoad) {
      this.table.show_loading(true)
      setTimeout(function(){self.load()}, 100)
    }

    this.observable.on('selected deselected', function(row) {
      self.update()
    })

    self.data.on('*', function(r, d){
      if (self.pagination) {
        if (r == 'remove') self.total -= d.items.length
        else if (r == 'add') self.total += d.items.length
      } else
        self.total = self.data.length
    })

  })

  this.load = function(url, param){
    var f, url
    param = param || {}
    var _f = function(r){
      return r.rows
    }

    self.url = url || self.url
    if (self.pagination) {
      url = get_url(self.url, {limit:self.limit, page:self.page})
    } else url = self.url
    if (opts.tree) f = self.data.load_tree(url, param, _f)
    else f = self.data.load(url, param, self.onLoaded || _f)
    f.done(function(r){
      self.total = r.total
      self.update()
      self.data.save()
    })
  }

  this.getButton = function(id) {
    return document.getElementById(id)
  }
});

riot.tag2('rgrid-button', '<i if="{opts.btn.icon}" class="{opts.btn.icon}"></i> <span>{opts.btn.label}</span>', '', 'class="{opts.btn.class}" id="{opts.btn.id}" type="button" disabled="{opts.btn.disabled && opts.btn.disabled(btn)}" onclick="{opts.btn.onclick}"', function(opts) {
});
