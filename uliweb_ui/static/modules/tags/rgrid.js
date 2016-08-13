riot.tag2('rgrid', '<query-condition if="{has_query}" rules="{query_ules}" fields="{query_fields}" layout="{query_layout}"></query-condition> <div if="{tools}" class="rgrid-tools pull-left"> <button each="{btn in tools}" class="{btn.class}" onclick="{btn.onclick}">{btn.label}</button> </div> <rtable cols="{cols}" options="{rtable_options}" data="{data}" start="{start}"></rtable> <div class="clearfix tools"> <pagination if="{pagination}" data="{data}" url="{url}" page="{page}" total="{total}" limit="{limit}" onpagechanged="{onpagechanged}"></pagination> <div if="{footer_tools}" class="pull-right"> <button each="{btn in footer_tools}" class="btn btn-flat btn-sm btn-default" onclick="{btn.onClick}">{btn.label}</button> </div> </div>', 'rgrid .rgrid-tools,[riot-tag="rgrid"] .rgrid-tools,[data-is="rgrid"] .rgrid-tools{margin-bottom:5px;} rgrid .rgrid-tools button,[riot-tag="rgrid"] .rgrid-tools button,[data-is="rgrid"] .rgrid-tools button{margin-right:4px;}', '', function(opts) {


  var self = this

  this.data = new DataSet()
  this.cols = opts.cols
  this.url = opts.url
  this.page = opts.page || 1
  this.limit = opts.limit || 10
  this.total = opts.total || 0
  this.pagination = opts.pagination == undefined ? true : opts.pagination
  this.has_query = opts.query !== undefined
  this.query = opts.query || {}
  this.query_rules = this.query.rules || {}
  this.query_fields = this.query.fields || []
  this.query_layout = this.query.layout || []
  this.start = (this.page - 1) * this.limit
  this.footer_tools = opts.footer_tools || []
  this.tools = opts.tools || []

  this.rtable_options = {
    theme : opts.theme,
    nameField : opts.nameField || 'name',
    labelField : opts.labelField || 'title',
    indexCol: opts.indexCol,
    checkCol: opts.checkCol,
    multiSelect: opts.multiSelect,
    maxHeight: opts.maxHeight,
    minHeight: opts.minHeight,
    height: opts.height,
    width: opts.width,
    rowHeight: opts.rowHeight,
    container: $(this.root).parent(),
    noData: opts.noData,
    tree: opts.tree,
    expanded: opts.expanded === undefined ? true : opts.expanded,
    useFontAwesome: opts.useFontAwesome === undefined ? true : opts.useFontAwesome,
    parentField: opts.parentField,
    orderField: opts.orderField,
    levelField: opts.levelField,
    treeField: opts.treeField,
    onDblclick: opts.onDblclick,
    onClick: opts.onClick,
    onMove: opts.onMove,
    onEdit: opts.onEdit,
    onEdited: opts.onEdited,
    draggable: opts.draggable,
    editable: opts.editable

  }

  this.onpagechanged = function (page) {
    self.start = (page - 1) * self.limit
    self.update()
  }

  this.on('mount', function(){
    var item
    for(var i=0, len=this.tools.length; i<len; i++){
        item = this.tools[i]
        var action = function(btn) {
            return function(e) {
                return btn.onClick.call(self, e)
            }
        }
        item.onclick = action(item)
        item.class = item.class || 'btn btn-flat btn-sm btn-primary'
    }
    this.table = this.root.querySelector('rtable')
    this.root.add = this.table.add
    this.root.addFirstChild = this.table.addFirstChild
    this.root.update = this.table.update
    this.root.remove = this.table.remove
    this.root.get = this.table.get
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
    this.load()
  })

  this.load = function(url){
    self.url = url || self.url
    self.data.load(self.url, function(r){
      self.total = r.total
      return r.rows
    }).done(function(){
      self.update()
      self.data.save()

    })
  }
});
