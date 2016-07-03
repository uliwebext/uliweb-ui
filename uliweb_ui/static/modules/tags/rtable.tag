<rtable>

  <style scoped>
    rcol {display: none}
  </style>

  <yield/>

  <table class="{opts.class}">
    <th each="{ c in cols }" riot-style="{c.style}">{c.name}</th>
    <tr each="{ row in rows.get() }" >
      <td each="{ col, colval in parent.cols }"><raw content={parent.row[col.name]}></raw></td>
    </tr>
  </table>

  var self = this
  var EL = self.root
  this.cols = []
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

  EL.update = function(newrows){
    self.rows.add(newrows)
    self.update()
  }.bind(this);

</rtable>

<rcol></rcol>

<raw>
  <span></span>
  this.root.innerHTML = opts.content
</raw>
