/* 依赖于 uliweb-ui.js 中的 pagination */
<ag-grid>
  <style scoped>
    .ag-fresh .ag-header {
      background: none;
    }
    .ag-header-group-cell-label {
      text-align: center;
    }
  </style>

  <div style="height: 300px;" class="grid ag-fresh"></div>

  var self = this
  var _default_opts = {
    rowData: null,
    groupHeaders: true,
    enableServerSideSorting: true,
//    enableFilter: true,
    enableColResize: true,
    marryChildren: true,
//    rowModelType: 'pagination'
  }
  self.options = $.extend(true, {}, _default_opts, opts.options)


  /*
  function headerCellRendererFunc(params) {
    var cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');

    var eHeader = document.createElement('label');
    var eTitle = document.createTextNode(params.colDef.headerName);
    eHeader.appendChild(cb);
    eHeader.appendChild(eTitle);

    cb.addEventListener('change', function (e) {
        if ($(this)[0].checked) {
            $scope.gridOptions.api.selectAll();
        } else {
            $scope.gridOptions.api.deselectAll();
        }
    });
    return eHeader;
  }
  */


  this.init = function () {
    var new_columns = []
    var names = {} //按名字保存cell

    //self.options.headerCellRenderer = headerCellRendererFunc

    //处理URL，在url上添加 data=
    //var query = new QueryString(self.options.url);
    //var query_string = query.set('data', '').toString();
    //self.options.url = query.url + query_string
    //console.log(self.options.url)


    for(var i=0, len=self.options.columnDefs.length; i<len; i++) {
      var col = $.extend({}, self.options.columnDefs[i])
      if (col.verbose_name)
        col.headerName = col.verbose_name
      if (col.frozen)
        col.pinned = 'left'
      if (col.name)
        col.field = col.name
      if (col.hidden)
        col.hide = true
      if (col.align == 'center')
        col.cellStyle = {'text-align': 'center'}
      if (col.align == 'left')
        col.cellStyle = {'text-align': 'left'}
      if (col.align == 'right')
        col.cellStyle = {'text-align': 'right'}
      //处理多级表头 '/'
      var n = col.headerName.split('/') //行层数
      var path, index, parent, node, found;
      if (n.length > 1){
        parent = null
        for (var j=0, _len=n.length-1; j<_len; j++) {
          path = n[j]
          if (j == 0) {
            //如果是第一层，则创建新结点添加到new_columns中
            if (!names.hasOwnProperty(path)) {
              parent = {headerName:path, children:[]}
              new_columns.push(parent)
              names[path] = parent
            } else {
              parent = names[path]
            }
          } else {
            found = false
            for (var x=0, __len=parent.children; x<__len; x++) {
              node = parent.children[x]
              if (node.headerName == path) {
                parent = node
                found = true
                break
              }
            }
            if (!found) {
              node = {headerName:path, children:[]}
              parent.children.push(node)
              parent = node
            }
          }
        }
        col.headerName = n[n.length-1]
        parent.children.push(col)
      } else {
          new_columns.push(col)
      }
    }
    self.options.columnDefs = new_columns;

    //增加分页
    var p = $(self.options.pagination || '#pagination')
    var p_opts = {
      pageRows: self.options.pageRows || 10
      , onChange: self.load
      , total: self.options.total
      , next: '下一页'
      , prev: '上一页'
      , first: '首页'
      , last: '尾页'
      , refresh: '<i class="fa fa-refresh" title="刷新"></i>'
      , totalMessage: '共 $pages 页 / $records 条' //if not then doesn't display at all
    }
    if (p.size() > 0) {
      p.pagination(p_opts)
      p.pagination('show', null, 1)
    }
  }

/*  function createDatasource() {

    var dataSource = {
      pageSize: opts.info.pageSize,
      rowCount: opts.info.total,
      getRows: function (params) {
        console.log(params, opts.url)
        var d = {}
        d.page = params.endRow / opts.info.pageSize
        d.limit = opts.info.pageSize
        $.post(opts.url, d)
          .success(function (r){
            var lastRow = -1;
            if (r.rows.length == r.page_rows)
              lastRow = r.page_rows * r.page
            params.successCallback(r.rows, lastRow)
          })
      }
    }

    self.options.api.setDatasource(dataSource);
}
*/

  this.load = function (page) {
    var d = {}
    d.page = page || 1
    d.limit = self.options.pageRows
    $.post(self.options.url, d)
      .success(function (r){
        self.options.api.setRowData(r.rows)
      })
  }

  self.init()

  this.on('mount', function(){
    var el = $('div.grid', self.root)
    new agGrid.Grid(el[0], self.options)
    self.load()
    if (self.options.autoFit)
      self.options.api.sizeColumnsToFit()
  })
</ag-grid>
