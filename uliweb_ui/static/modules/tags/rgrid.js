riot.tag2('rgrid', '<query-condition rules="{query_rules}" fields="{query_fields}" layout="{query_layout}"></query-condition> <rtable cols="{cols}" options="{rtable_options}" data="{data}"></rtable> <div class="clearfix tools"> <pagination if="{pagination}" data="{data}" url="{url}" page="{page}" total="{total}"></pagination> <div if="{!pagination}" id="pagination" class="pull-left"></div> </div>', '', '', function(opts) {


  self = this
  this.data = new DataSet()
  this.cols = opts.cols
  this.url = opts.url
  this.page = opts.page || 1
  this.total = opts.total || 0
  this.pagination = opts.pagination || true
  this.query_rules = opts.query.rules
  this.query_fields = opts.query.fields
  this.query_layout = opts.query.layout

  this.rtable_options = {
    tableClass : opts.tableClass || 'table table-bordered',
    nameField : opts.nameField || 'name',
    labelField : opts.labelField || 'title',
    onUpdate: opts.onupdate || function(data){
      $('#pagination').text('共 ' + data.length + ' 条记录')
    }
  }

  this.on('mount', function(){
    this.load()
  })

  this.load = function(url){
    self.url = url || self.url
    self.data.load(self.url, function(r){
      self.total = r.total
      return r.rows
    }).done(function(){
      self.update()
    })
  }
});
