/* 依赖于 uliweb-ui.js 中的 pagination */
riot.tag2('ag-grid', '<div style="height: 300px;" class="grid ag-fresh"></div>', 'ag-grid .ag-fresh .ag-header,[riot-tag="ag-grid"] .ag-fresh .ag-header,[data-is="ag-grid"] .ag-fresh .ag-header{ background: none; } ag-grid .ag-header-group-cell-label,[riot-tag="ag-grid"] .ag-header-group-cell-label,[data-is="ag-grid"] .ag-header-group-cell-label{ text-align: center; }', '', function(opts) {

  var self = this
  var _default_opts = {
    rowData: null,
    groupHeaders: true,
    enableServerSideSorting: true,

    enableColResize: true,
    marryChildren: true,

  }
  self.options = $.extend(true, {}, _default_opts, opts.options)

  this.init = function () {
    var new_columns = []
    var names = {}

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

      var n = col.headerName.split('/')
      var path, index, parent, node, found;
      if (n.length > 1){
        parent = null
        for (var j=0, _len=n.length-1; j<_len; j++) {
          path = n[j]
          if (j == 0) {

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
      , totalMessage: '共 $pages 页 / $records 条'
    }
    if (p.size() > 0) {
      p.pagination(p_opts)
      p.pagination('show', null, 1)
    }
  }

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
});
