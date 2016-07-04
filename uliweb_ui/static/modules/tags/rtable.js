riot.tag2('rtable', '<yield></yield> <table class="{opts.class}"> <th each="{c in cols}" riot-style="{c.style}">{c.name}</th> <tr each="{row, index in rows.get()}"> <td each="{col, colval in parent.cols}"> <raw content="{parent.parent.get_col_data(parent.row, parent.index, col, colval)}"></raw> </td> </tr> </table>', 'rtable rcol,[riot-tag="rtable"] rcol,[data-is="rtable"] rcol{display: none} rtable .table,[riot-tag="rtable"] .table,[data-is="rtable"] .table{margin-bottom:0px;}', '', function(opts) {

  var self = this
  var EL = self.root
  this.cols = []
  if (Array.isArray(opts.rows)) {
    this.rows = new DataSet()
    this.rows.add(opts.rows)
  } else if (opts.rows)
    this.rows = opts.rows
  else
    this.rows = new DataSet()

  this.on('mount', function() {
      for(var c=0; c<EL.children.length; c++){
          var child = EL.children[c]
          if(child.localName == 'rcol'){
            var col_style = ''
            if(child.attributes['width'] != undefined)
              col_style='width: '+ child.attributes['width'].value

            self.cols.push({name:child.attributes['name'].value,
                inner:child.innerHTML,
                style:col_style
            })
          }
      }

      if(opts.ongetdata){
        self.rows.add(window[opts.ongetdata]()) ;
      }

      self.update()
    })

  EL.load = function(newrows){
    self.rows.clear()
    self.rows.add(newrows)
    self.update()
  }.bind(this);

  EL.change = function(newrows){
    self.rows.add(newrows)
    self.update()
  }.bind(this);

  EL.setData = function(dataset){
    self.rows = dataset
    self.update()
  }.bind(this);

  this.get_col_data = function(row, index, col, colval) {

    var value
    if (col.name == '#') value = index + 1
    else value = row[col.name]

    if (value == undefined)
      value = col.inner
    return value
  }

  this.edit = function (e) {
    console.log(e)
  }

  this.remove = function (e) {
    console.log(e)
  }

});

riot.tag2('rcol', '<yield></yield>', '', '', function(opts) {
});

riot.tag2('raw', '<span></span>', '', '', function(opts) {
  this.root.innerHTML = opts.content
});
