riot.tag2('rtable', '<yield></yield> <table class="{options.tableClass}"> <thead> <tr> <th each="{c in cols}" riot-style="{c.style}">{c.title || c.name}</th> </tr> </thead> <tbody> <tr each="{row, index in rows.get()}"> <td each="{col, colval in parent.cols}"> <raw if="{!col.buttons}" content="{parent.parent.get_col_data(parent.row, parent.index, col, colval)}"></raw> <virtual if="{col.buttons}" each="{btn in col.buttons}"> <i if="{btn.icon}" class="fa fa-{btn.icon} action" title="{btn.title}" onclick="{parent.parent.action_click(parent.parent.row, btn)}"></i> <a if="{btn.label}" class="action" title="{btn.title}" href="{btn.href || \'#\'}" onclick="{parent.parent.action_click(parent.parent.row, btn)}">{btn.label}</a> </virtual> </td> </tr> </tbody> </table>', 'rtable rcol,[riot-tag="rtable"] rcol,[data-is="rtable"] rcol{display: none} rtable .table,[riot-tag="rtable"] .table,[data-is="rtable"] .table{margin-bottom:0px;} rtable .action,[riot-tag="rtable"] .action,[data-is="rtable"] .action{cursor:pointer;}', '', function(opts) {

  var self = this
  var EL = self.root
  this.cols = opts.cols
  this.nameField = opts.nameField || 'name'
  this.labelField = opts.labelField || 'title'
  this.start = 0
  this.options = opts.options || {}
  if (opts.data) {
    if (Array.isArray(opts.data)) {
      this.rows = new DataSet()
      this.rows.add(opts.data)
    }
    else
      this.rows = opts.data
  } else {
    this.rows = new DataSet()
  }

  this.bind = function (dataset) {

    dataset.on('*', function(r, d){
      if (self.options.onUpdate) {
        self.options.onUpdate(dataset)
      }
      self.update()
    })
  }

  this.on('mount', function() {
    for(var i=0, len=self.cols.length; i<len; i++) {
      var col = self.cols[i]
      var width = col.width
      col.style = ''
      if (width) {
        if (typeof width === 'number')
          width = width + 'px'
        col.style = 'width:'+width
      }
      col.name = col[self.nameField]
      col.title = col[self.labelField]
    }
    self.bind(self.rows)
  })

  EL.load = function(newrows){
    self.rows.clear()
    self.rows.add(newrows)
  }.bind(this);

  EL.change = function(newrows){
    self.rows.update(newrows)
  }.bind(this);

  EL.setData = function(dataset){
    self.rows = dataset
    self.bind(self.rows)
  }.bind(this);

  this.get_col_data = function(row, index, col, col_index) {
    var value
    if (col.render && typeof col.render === 'function') {
      return col.render(row, index, col, col_index)
    }
    if (col.name == '#') value = self.start + index + 1
    else value = row[col.name] || ''
    return value
  }

  this.action_click = function (row, btn) {
    return function (e) {
      if (btn.onclick && typeof btn.onclick === 'function') {

        btn.onclick.call(e.target, row, self)
      }
    }
  }

});

riot.tag2('raw', '<span></span>', '', '', function(opts) {
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
});
