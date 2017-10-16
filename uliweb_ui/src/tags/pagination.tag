<!-- 分页控件 -->
<pagination>

  <style scoped>
    .pagination {margin:0px;margin-right:5px;}
    .pagination>li.disabled>a {color:#999;}
    .page_input {padding:0px 12px; line-height: 34px; height:34px;}
    .page_input input {height:20px;line-height:20px;margin:0;}
    .message {line-height: 34px;line:34px;margin:0 auto;}
    .btn.disabled {cursor:not-allowed;}
    .pagination .page-limits {}
    .pagination .page-limits button{border-radius: 0px;}
  </style>

  <ul if={theme=='long'} class="pagination">
    <li if={totalMessage} class="disabled total"><a>{totalMessage}</a></li>
    <li if={has_first} class="first"><a href="#" onclick={go(1)}><pagination-raw content={first}></pagination-raw></a></li>
    <li if={has_prev} class="prev"><a href="#" onclick={go(page-1)}><pagination-raw content={prev}></pagination-raw></a></li>
    <li class={page:true, active:p==page} each={p in pages}><a href="#" onclick={go(p)}>{p}</a></li>
    <li if={has_next} class="next"><a href="#" onclick={go(page+1)}><pagination-raw content="{next}"></pagination-raw></a></li>
    <li if={has_last} class="last"><a href="#" onclick={go(totalPages)}><pagination-raw content={last}></pagination-raw></a></li>
    <li if={refresh} class="refresh"><a href="#" onclick={go(page, true)}><pagination-raw content={refresh}></pagination-raw></a></li>
  </ul>
  <div if={theme=='long' && buttons.length>0} class="pull-right {btn_group_class}">
    <button each={btn in buttons} data-is="pagination-button" btn={btn}></button>
  </div>

  <div if={theme=='simple'} class="{btn_group_class} pull-left pagination">
    <a class="btn btn-default" disabled="{totalPages<=1 || page==1}" onclick={go(1)} title={first_title}><pagination-raw content={first}></pagination-raw></a>
    <a class="btn btn-default" disabled="{!has_prev}" onclick={go(page-1)} title={prev_title}><pagination-raw content={prev}></pagination-raw></a>
    <a class="btn btn-default page_input">第 <input type="text" onkeypress={page_input_click} value={page} style="width:40px"> 页/共{totalPages}页</input></a>
    <div class="btn-group dropup page-limits">
      <div class="dropdown">
        <button class="btn btn-default" type="button" data-toggle="dropdown">
          每页 {limit} 条
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li each={p in limits}><a href="#" onclick={change_limit(p)}>{p}</a></li>
        </ul>
      </div>
    </div>
    <a class="btn btn-default" disabled="{!has_next}" onclick={go(page+1)} title={next_title}><pagination-raw content="{next}"></pagination-raw></a>
    <a class="btn btn-default" disabled="{totalPages<=1 || page==totalPages}" onclick={go(totalPages)} title={last_title}><pagination-raw content={last}></pagination-raw></a>
    <a if={refresh} class="btn btn-default" onclick={go(page, true)} title={refresh_title}><pagination-raw content={refresh}></pagination-raw></a>
  </div>
  <div if={theme=='simple' && buttons.length>0} class="pull-left {btn_group_class}">
    <button each={btn in buttons} data-is="pagination-button" btn={btn}></button>
  </div>
  <p if={theme=='simple'} class="pull-right message">{totalMessage}</p>

  var self = this
  this.observable = opts.observable

  this.total = opts.total       //记录总数
  this.theme = opts.theme || 'simple'
  this.page = opts.page || 1    //当前页号
  this.limit = opts.limit || 10 //每页记录条数，当值为 <=0 时，不限制
  this.data = opts.data         //数据源
  this.limits = opts.limits || [10, 20, 30, 40, 50] //每次最大条数
  this.buttons = opts.buttons || []
  this.size = opts.size || 10   //页号范围
  this.btn_group_class = opts.btn_group_class || 'btn-group'
  this.pages = []
  this.onpage = opts.onPage || function () {
    return self.data.load(self.get_url(), function(data){
      self.total = data.total   //根据反回值修改total
      <!-- self.push_url(self.get_url()) -->
      return data.rows
    })
  }    //页面事件回调,缺省使用data作为数据源
  this.onlimit = opts.onlimit
  this.onpagechanged = opts.onpagechanged

  this._totalMessage = opts.totalMessage || '共 $pages 页 / $records 条记录'  //'Total $pages pages / $records records'
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
    this._totalMessage = opts.totalMessage || '共 $records 条记录'  //'Total $pages pages / $records records'
    this.prev = opts.prev || '<i class="fa fa-backward"></i>'
    this.next = opts.next || '<i class="fa fa-forward"></i>'
    this.first = opts.first || '<i class="fa fa-fast-backward"></i>'
    this.last = opts.last || '<i class="fa fa-fast-forward"></i>'
    this.refresh = opts.refresh || '<i class="fa fa-refresh"></i>'
  }

  this.on('update', function(){
    this.url = opts.url           //数据展示URL
    this.total = opts.total
    this.page = opts.page
    this.limit = opts.limit
    this.show()
  })

  /* 获得指定页的URL
   * @param page: 指定页号，如果未提供则直接使用 this.page, 需要有uliweb-ui的
   *              query_string的支持
   *              将添加 page= & limit= 两个参数
   */
  this.get_url = function(page) {
    return get_url(self.url, {page:page||self.page, limit:self.limit})
  }

  /* pushState url处理
   */
  this.push_url = function (url) {
    if(history && history.pushState) history.pushState(null, null, url)
  }

  /* 跳转指定页
   * @param page: 指定页号，如果未提供则直接使用 this.page，并且设置当前页号
   *               如果opts中有onpage回调，则通过promise来先处理onpage，
   *               然后再调用show，需要有jquery的支持
   * @param force: 是否强制刷新
   */
  this.go_page = function (page, force) {
    var old_page = self.page
    if (self.totalPages == 0) {
      return
    }
    if (!force && (page <= 0 || page > self.totalPages || self.page === page)) {
      return
    }
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

  /* 切换每页条数
  */
  this.change_limit = function (p) {
    f = function (e) {
      e.preventDefault()
      self.limit = p
      if (self.onlimit)
        self.onlimit(self.limit)
    }
    return f
  }

  /* 分页跳转事件处理
   * @param page: 指定页号
   * @param force: 是否强制刷新
   */
  this.go = function (page, force) {
    f = function (e) {
      e.preventDefault()
      self.go_page(page, force)
    }
    return f
  }

  /* 页号输入事件处理
   */
  this.page_input_click = function(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      var page = parseInt($(e.target).val())
      if (page)
        this.go_page(page)
    }
  }

  /* 显示指定页
   * @param start: 指定页号，如果未提供则直接使用 this.page，并且设置当前页号
   */
  this.show = function (page) {
    self.total = opts.total || self.total
    self.page = page || self.page
    self.totalPages = parseInt(self.total / self.limit)
    if (self.total % self.limit > 0) self.totalPages++;
    if (self._totalMessage){
      self.totalMessage = self._totalMessage.replace('$pages', self.totalPages);
      self.totalMessage = self.totalMessage.replace('$records', self.total);
    }

    //计算显示页号
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


</pagination>

<pagination-raw>
  <span></span>
  this.on('mount', function(){
    this.root.innerHTML = opts.content
  })
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
</pagination-raw>

<pagination-button class="{opts.btn.class}" id={opts.btn.id} type="button"
  disabled={opts.btn.disabled && opts.btn.disabled(btn)} onclick={opts.btn.onclick}>
  <i if={opts.btn.icon} class={opts.btn.icon}></i>
  <span>{opts.btn.label}</span>
</pagination-button>
