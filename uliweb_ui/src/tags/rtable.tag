<rtable>

  <style scoped>
    rcol {display: none}
    .table {margin-bottom:0px;}
    .action {cursor:pointer;}
  </style>

  <yield/>

  <table class="{options.tableClass}">
    <thead>
      <tr>
        <th each="{ c in cols }" style="{c.style}">{c.title || c.name}</th>
      </tr>
    </thead>
    <tbody>
      <tr each="{ row, index in rows.get() }">
        <td each="{ col, colval in parent.cols }">
          <raw if={!col.buttons} content={parent.parent.get_col_data(parent.row, parent.index, col, colval)}></raw>
          <virtual if={col.buttons} each={btn in col.buttons}>
            <!-- 按钮支持两种模式，一种是icon方式，需要定义 {icon:fa的class名，不要前面的fa-, title:[可选]}
                另一种是链接模式，需要定义 {label:名称, title:[可选], href:[可选]}
            -->
            <i if={ btn.icon } class="fa fa-{btn.icon} action" title={ btn.title }
              onclick={parent.parent.action_click(parent.parent.row, btn)}></i>
            <a if={ btn.label } class="action" title={ btn.title }
              href={ btn.href || '#' }
              onclick={parent.parent.action_click(parent.parent.row, btn)}>{ btn.label }</a>
          </virtual>
        </td>
      </tr>
    </tbody>
  </table>

  var self = this
  var EL = self.root
  this.cols = opts.cols
  this.nameField = opts.nameField || 'name'
  this.labelField = opts.labelField || 'title'
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
    // 绑定事件
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

  this.on('update', function(){
    this.start = opts.start || 0
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
        //绑定this为e.target，即当前dom元素
        btn.onclick.call(e.target, row, self)
      }
    }
  }

</rtable>

<raw>
  <span></span>
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
</raw>
