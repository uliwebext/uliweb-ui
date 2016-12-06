(function (window) {
    'use strict';

    /**
     * Module dependencies
     */
    var on = (window.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
        off = (window.removeEventListener !== undefined) ? 'removeEventListener' : 'detachEvent',
        scrollEvent = (on !== 'addEventListener') ? 'onscroll' : 'scroll',
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }()),
        scrolledElement,
        scroll,
        eve;


    /**
     * Captures the scroll event and the element who emits it.
     * @function
     * @private
     */
    function captureScroll(e) {
        // No changing, exit
        if (!scrolled) {
            scrolled = true;
            scrolledElement = this;
            eve = e || window.e;


            /**
             * requestAnimationFrame
             */
            requestAnimFrame(update);
        }
    }

    /**
     * If the scroll event exist, it will execute the scrolledElement listeners.
     * @function
     * @private
     */
    function update() {

        var i = 0,
            listeners = scroll._collection[scrolledElement].listeners,
            len = listeners.length;

        for (i; i < len; i += 1) {
            listeners[i].call(scrolledElement, eve);
        }

        scrolledElement = undefined;

        // Change scroll status
        scrolled = false;
    }

    /**
     * Scroll Constructor.
     * @constructor
     * @returns {scroll} Returns a new instance of Scroll.
     */
    function Scroll() {
        this.initialize();
        return this;
    }

    /**
     * Initializes a new instance of Scroll.
     * @function
     * @returns {scroll} Returns a new instance of Scroll.
     */
    Scroll.prototype.initialize = function () {
        this._collection = {};
        return this;
    };

    /**
     * Adds an el with a listener to the collection.
     * @memberof! Scroll.prototype
     * @function
     * @param {HTMLElement} [el] - A given HTMLElement to add to scroll.
     * @param {Funtion} listener - A given listener to execute when the given el is scrolled.
     * @returns {scroll}
     */
    Scroll.prototype.add = function (el, listener) {

        if ('function' === typeof el) {
            listener = el;
            el = window;
        }

        if (this._collection[el] === undefined) {
            this._collection[el] = {
                'listeners': []
            };

            el[on](scrollEvent, captureScroll, false);
        }

        // Add listeners to an el collection
        this._collection[el].listeners.push(listener);

        return this;
    };

    /**
     * Removes a HTMLElement and its listener from the collection with the given el.
     * @memberof! Scroll.prototype
     * @function
     * @param {HTMLElement} el - A given HTMLElement to remove.
     * @param {Funtion} [listener] - A given listener to remove.
     * @returns {scroll}
     */
    Scroll.prototype.remove = function (el, listener) {
        var listeners = this._collection[el].listeners,
            i = 0,
            len = listeners.length;

        if (len !== undefined) {
            for (i; i < len; i += 1) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        if (listeners.length === 0 || listener === undefined) {
            el[off](scrollEvent, captureScroll, false);
            delete this._collection[el];
        }

        return this;
    };

    // Defines a new instance of Scroll.
    scroll = new Scroll();

    /**
     * Adds an el with a listener to the collection.
     * @function
     * @param {HTMLElement} [el] - A given HTMLElement to add to scroll.
     * @param {Funtion} listener - A given listener to execute when the given el is scrolled.
     * @returns {scroll}
     */
    function scrolling(el, listener) {
        scroll.add(el, listener);

        return scrolling;
    }

    /**
     * Removes a HTMLElement and its listener from the collection with the given el.
     * @function
     * @param {HTMLElement} el - A given HTMLElement to remove.
     * @param {Funtion} [listener] - A given listener to remove.
     * @returns {scrolling}
     */
    scrolling.remove = function (el, listener) {
        scroll.remove(el, listener);

        return scrolling;
    };
    /**
     * Expose scrolling
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('scrolling', [], function () {
            return scrolling;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = scrolling;

    // Default
    } else {
        window.scrolling = scrolling;
    }
}(this));

/**
 * Author: meimeidev
 */

!function($){
    var MMGrid = function (element, options) {
        this._id = (((1 + Math.random()) * 0x10000) | 0).toString(16);
        this._loadCount = 0;
        this.opts = options;
        this._initTitleDeep();
        this._initLayout($(element));
        this._initHead();
        this._initOptions();
        this._initEvents();
        this._setColsWidth();
        if(this.opts.fullWidthRows){
            this._fullWidthRows();
        }

        //初始化插件
        for(var i=0; i< this.opts.plugins.length; i++){
            var plugin = this.opts.plugins[i];
            plugin.init($.extend(element, this));
        }

        if(options.autoLoad){
            var that = this;
            this.opts = options;
            setTimeout(function(){

                if(options.url){
                    that.load();
                }else{
                    that.load(options.items);
                }
            },0); //chrome style problem
        }
        this._init_plugins();
    };

    //see: http://tanalin.com/en/articles/ie-version-js/
    var browser = function(){
        var isIE=!!window.ActiveXObject;
        var isIE10 = isIE && !!window.atob;
        var isIE9 = isIE && document.addEventListener && !window.atob;
        var isIE8 = isIE && document.querySelector && !document.addEventListener;
        var isIE7 = isIE && window.XMLHttpRequest && !document.querySelector;
        var isIE6 = isIE && !window.XMLHttpRequest;

        return {
            isIE: isIE
            , isIE6: isIE6
            , isIE7: isIE7
            , isIE8: isIE8
            , isIE9: isIE9
            , isIE10: isIE10
        };
    }();

    MMGrid.prototype = {

        _initLayout: function($el){
            var opts = this.opts;
            var $elParent = $el.parent();
            var elIndex = $el.index();

            var mmGrid = [
                '<div class="mmGrid">',
                    '<style></style>',
                    '<div class="mmg-headWrapper">',
                        '<table class="mmg-head" cellspacing="0"></table>',
                    '</div>',
                    '<div class="mmg-colResizePointer"></div>',
                    '<div class="mmg-colResizePointer-before"></div>',
                    '<div class="mmg-backboard">',
                        '<a class="mmg-btnBackboardUp"></a>',
                    '</div>',
                    '<div class="mmg-bodyWrapper"></div>',
                    '<a class="mmg-btnBackboardDn"></a>',
                    '<div class="mmg-message">'+ this.opts.noDataText +'</div>',
                    '<div class="mmg-mask mmg-transparent"></div>',
                    '<div class="mmg-loading">',
                        '<div class="mmg-loadingImg"></div>',
                        '<div class="mmg-loadingText">'+ this.opts.loadingText +'</div>',
                    '</div>',

                '</div>'
            ];
            //fix in IE7,IE6
            if(browser.isIE7 || browser.isIE6){
                $el.prop('cellspacing',0);
            }


            //cached object
            var $mmGrid = $(mmGrid.join(''));
            this.$mmGrid = $mmGrid;
            this.$style = $mmGrid.find('style');
            this.$headWrapper = $mmGrid.find('.mmg-headWrapper');
            this.$head = $mmGrid.find('.mmg-head');
            this.$backboard = $mmGrid.find('.mmg-backboard');
            this.$bodyWrapper = $mmGrid.find('.mmg-bodyWrapper');
            this.$count = 0;        //记录所有数据,一行一条
            this.$body = $el.removeAttr("style").addClass('mmg-body');
            this.$page = 1;
            this.$limit = 0;
            this.$runing = 0;
            this._insertEmptyRow();
            this.$body.appendTo(this.$bodyWrapper);

            //放回原位置
            if(elIndex === 0 || $elParent.children().length == 0){
                $elParent.prepend(this.$mmGrid);
            }else{
                $elParent.children().eq(elIndex-1).after(this.$mmGrid);
            }

            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                $mmGrid.height('100%');
                $mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
            }else{
                $mmGrid.height(opts.height);
            }

            if(opts.checkCol){
                var chkHtml = opts.multiSelect ?  '<input type="checkbox" class="checkAll" >'
                    : '<input type="checkbox" disabled="disabled" class="checkAll">';
                opts.cols[0].unshift({title:chkHtml,width: 24, rowspan: this.$titleDeep, align: 'center' ,lockWidth: true, checkCol: true, renderer:function(){
                    return '<input type="checkbox" class="mmg-check">';
                }});
            }

            if(opts.indexCol){
                opts.cols[0].unshift({title:'#',width: opts.indexColWidth, rowspan: this.$titleDeep, 
                    align: 'center' ,lockWidth: true, indexCol:true, renderer:function(val,item,rowIndex){
                    return '<label class="mmg-index">' + (rowIndex+1) + '</label>';
                }});
            }

        }

        ,_expandCols: function(cols){
            var c = []; //记录每行扫描的位置
            var i;
            var that = this;
            for (i=0; i<cols.length; i++){
                c[i] = 0;
            }
            function fix_col(col){
                col.colspan = col.colspan || 1;
                col.rowspan = col.rowspan || 1;
                return col;
            }
            function is_leaf(col, deep){
                if ((col.colspan === 1) && (col.rowspan === that.$titleDeep-deep)){
                    col.isLeaf = true;
                    return true;
                }else{
                    col.isLeaf = false;
                    return false;
                }
            }
            function get_nodes(col, deep){
                var _col;
                var nodes = [];
                var n;
                var pos;
                fix_col(col);
                if(is_leaf(col, deep)) return [col];
                n = 0;
                pos = deep + col.rowspan;
                for(var j=c[pos]; j<cols[pos].length; j++){
                    _col = fix_col(cols[pos][j]);
                    if (n + _col.colspan <= col.colspan){
                        nodes = nodes.concat(get_nodes(_col, pos));
                        c[pos] ++;
                        n = n + _col.colspan;
                        if (col.nodes) col.nodes.push(_col);
                        else col.nodes = [_col];
                    }else break;
                }
                nodes.unshift(col);
                return nodes;
            }
            
            var colspan, col, nodes=[];
            for (var i=0; i<cols[0].length; i++){
                col = cols[0][i];
                nodes = nodes.concat(get_nodes(col, 0));
            }
            return nodes;
        }

        ,_leafCols: function(){
            return this.$columns;
        }

        ,_expandThs: function(){
            return this.$head.find('th').sort(function(a, b){
               return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }

        ,_leafThs: function(){
            return this.$head.find('th').filter(function(){
                return $.data(this,'col').isLeaf;
            }).sort(function(a, b){
                return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }

        /*
            初始化列
            计算title的深度，采用cols为多个[]的写法，例如：
                cols: [[....], [....]]
            为了兼容以前的写法，当第一个值不是[]类型时，自动包装为[[]]形式
            同时实现列的扁平化
        */
        ,_initTitleDeep: function(){
            var cols = this.opts.cols;
            var deep = 0;
            if (cols && cols.length > 0){
                var col = cols[0];
                if($.isArray(col)){
                    deep = cols.length;
                }else{
                    this.opts.cols = [cols];
                    deep = 1;
                }
            }
            this.$titleDeep = deep;
        }

        , _titleHtml: function(col){
            var opts = this.opts;

            var titleHtml = [];
            titleHtml.push('<th class="');
            var colIndex =  $.inArray(col, this.$fullColumns);
            titleHtml.push(this._genColClass(colIndex));
            if (!col.isLeaf)
                titleHtml.push(' mmg-groupCol');
            titleHtml.push(' " ');
            titleHtml.push(' rowspan="');
            titleHtml.push(col.rowspan);
            titleHtml.push('" colspan="');
            titleHtml.push(col.colspan);
            titleHtml.push('" data-colIndex="');
            titleHtml.push(colIndex);
            titleHtml.push('" >');
            titleHtml.push('<div class="mmg-titleWrapper" >');
            titleHtml.push('<span class="mmg-title ');
            if(col.sortable) titleHtml.push('mmg-canSort ');
            titleHtml.push('">');
            if(col.titleHtml){
                titleHtml.push(col.titleHtml);
            }else{
                titleHtml.push(col.title);
            }
            titleHtml.push('</span><div class="mmg-sort"></div>');
            if(!col.lockWidth) titleHtml.push('<div class="mmg-colResize"></div>');
            titleHtml.push('</div></th>');

            return titleHtml.join("");
        }

        , _initHead: function(){
            var that = this;
            var opts = this.opts;
            var $head = this.$head;
            var titleDeep = that.$titleDeep;

            this.$fullColumns = this._expandCols(this.opts.cols);
            this.$columns = $.grep(this.$fullColumns, function(x){
                return x.isLeaf;
            });

            if(titleDeep){
                var theadHtmls = ['<thead>'];
                for(var i=0; i< titleDeep; i++){
                    var cols = opts.cols[i];
                    theadHtmls.push('<tr>');
                    for(var colIndex=0; colIndex< cols.length; colIndex++){
                        var col = cols[colIndex];
                        theadHtmls.push(this._titleHtml(col));
                    }
                    theadHtmls.push('</tr>');
                }
                theadHtmls.push('</thead>');
                $head.html(theadHtmls.join(''));
            }

            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;
            $.each($ths,function(index){
                if(!expandCols[index].width){
                    expandCols[index].width = 100;
                }
                $.data(this,'col-width',expandCols[index].width);
                $.data(this,'col',expandCols[index]);
            });

            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;
            if(opts.height !== 'auto'){
                $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
            }



            //初始化排序状态
            if(opts.sortName){
                for(var colIndex=0; colIndex< expandCols.length; colIndex++){
                    var col = expandCols[colIndex];
                    if(col.sortName === opts.sortName || this._getColName(col) === opts.sortName){
                        var $th= $ths.eq(colIndex);
                        $.data($th.find('.mmg-title')[0],'sortStatus',opts.sortStatus);
                        $th.find('.mmg-sort').addClass('mmg-'+opts.sortStatus);
                    }
                }
            }
        }

        , _initOptions: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $backboard = this.$backboard;
            $mmGrid.find('a.mmg-btnBackboardDn').css({
                'top': $headWrapper.outerHeight(true)
            }).slideUp('fast');

            var cols = this._leafCols();
            if(cols){
                var bbHtml = [];
                for(var colIndex=0; colIndex<cols.length; colIndex++){
                    bbHtml.push('<label ');
                    if(cols[colIndex].checkCol || cols[colIndex].indexCol){
                        bbHtml.push('style="display:none;" ');
                    }
                    var col = cols[colIndex];
                    bbHtml.push('><input type="checkbox"  ');
                    if(!col.hidden) bbHtml.push('checked="checked"');
                    if(col.lockDisplay) bbHtml.push(' disabled="disabled"');
                    bbHtml.push('/><span>');
                    if(col.optionTitle || col.title){
                        bbHtml.push(col.optionTitle || col.title);
                    }else{
                        bbHtml.push('未命名');
                    }

                    bbHtml.push('</span></label>');
                }
                $backboard.append($(bbHtml.join('')));
            }
        }

        , _initEvents: function(){
            var that = this;
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $head = this.$head;
            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $backboard = this.$backboard;
            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;
            var leafCols = this._leafCols();

            //调整浏览器
            if(opts.width === 'auto' || opts.height === 'auto' || (typeof opts.width === 'string' && opts.width.indexOf('%') === opts.width.length-1) ||
                typeof opts.height === 'string' && opts.height.indexOf('%') === opts.height.length-1){
                $(window).on('resize', function(){
                    that.resize();
                });
            }

            //滚动条事件
            $bodyWrapper.on('scroll', function(){
                $head.css('left',- $(this).scrollLeft());
            });

            //向下按钮
            var $btnBackboardDn = $mmGrid.find('a.mmg-btnBackboardDn').on('click', function(){
                var backboardHeight = $mmGrid.height() - $headWrapper.outerHeight(true);
                if(opts.height === 'auto'&& opts.backboardMinHeight !== 'auto' && backboardHeight < opts.backboardMinHeight){
                    backboardHeight = opts.backboardMinHeight;
                }
                $backboard.height(backboardHeight);
                if(opts.height === 'auto'){
                    $mmGrid.height($headWrapper.outerHeight(true) + $backboard.outerHeight(true));
                }
                $backboard.slideDown();
                $btnBackboardDn.slideUp('fast');

                that._hideNoData();
            });
            $body.on('mouseenter', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $mmGrid.on('mouseleave', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $headWrapper.on('mouseenter',function(){
                if($backboard.is(':hidden') && opts.showBackboard){
                    $btnBackboardDn.slideDown('fast');
                }
            });
            //向上按钮
            $mmGrid.find('a.mmg-btnBackboardUp').on('click', function(){
                $backboard.slideUp().queue(function(next){
                    if(!that.rowsLength() || (that.rowsLength() === 1 && $body.find('tr.emptyRow').length === 1)){
                        that._showNoData();
                    }
                    if(opts.height === 'auto'){
                        $mmGrid.height('auto');
                    }
                    next();
                });
            });

            //隐藏列
            $backboard.on('click', ':checkbox', function(){
                var index = $backboard.find('label').index($(this).parent());
                //最后一个不隐藏
                var last = 1;
                if(opts.checkCol){
                    last = last + 1;
                }
                if(opts.indexCol){
                    last = last + 1;
                }
                if($backboard.find('label :checked').length < last){
                    this.checked = true;
                    return;
                }

                var col = leafCols[index];
                if(this.checked){
                    col.hidden = false;

                }else{
                    col.hidden = true;
                }

                var $ths = $head.find('th');
                for(var colIndex=$ths.length-1; colIndex>=0; colIndex--){
                    var $th = $ths.eq(colIndex);
                    var iCol = $th.data('col');
                    if(! iCol.isLeaf){
                        var hidden = true;
                        var colspan = 0;
                        $.each(iCol.nodes,function(index,item){
                            if(!item.hidden){
                                hidden = false;
                                colspan = colspan + item.colspan;
                            }
                        });
                        //IE bug
                        if(colspan !== 0){
                            iCol.colspan = colspan;
                            $th.prop('colspan',colspan);
                        }
                        iCol.hidden = hidden;
                    }
                }

                that._setColsWidth();
                $backboard.height($mmGrid.height() - $headWrapper.outerHeight(true));
                if(opts.height !== 'auto'){
                    $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
                }
                $mmGrid.find('a.mmg-btnBackboardDn').css({
                    'top': $headWrapper.outerHeight(true)
                })
            });



            //排序事件
            $head.on('click', '.mmg-title', function(){
                var $this = $(this);
                var $titles =  $ths.find('.mmg-title');

                //当前列不允许排序
                var col =$this.parent().parent().data('col');
                if(!col.sortable){
                    return;
                }
                //取得当前列下一个排序状态
                var sortStatus = $.data(this, 'sortStatus') === 'asc' ? 'desc' : 'asc';
                //清除排序状态
                $.each($titles, function(){
                    $.removeData(this,'sortStatus');
                });
                $ths.find('.mmg-sort').removeClass('mmg-asc').removeClass('mmg-desc');
                //设置当前列排序状态
                $.data(this, 'sortStatus', sortStatus);
                $this.siblings('.mmg-sort').addClass('mmg-'+sortStatus);

                if(opts.url && opts.remoteSort){
                    that.load()
                }else{
                    that._nativeSorter($.inArray(col, leafCols), sortStatus);
                    that._setStyle();
                }
            }).on('mousedown', '.mmg-colResize', function(e){
                //调整列宽
                var $resize = $(this);
                var start = e.pageX;
                var $colResizePointer = $mmGrid.find('.mmg-colResizePointer')
                    .css('left', e.pageX - $headWrapper.offset().left).show();

                var scrollLeft = $head.position().left;
                var $colResizePointerBefore = $mmGrid.find('.mmg-colResizePointer-before')
                    .css('left', $resize.parent().parent().position().left + scrollLeft).show();
                //取消文字选择
                document.selection && document.selection.empty && ( document.selection.empty(), 1)
                || window.getSelection && window.getSelection().removeAllRanges();
                document.body.onselectstart = function () {
                    return false;
                };
                $headWrapper.css('-moz-user-select','none');

                $mmGrid.on('mousemove', function(e){
                    $colResizePointer.css('left', e.pageX - $headWrapper.offset().left);
                }).on('mouseup', function(e){
                    //改变宽度
                    var $th = $resize.parent().parent();
                    var width = $th.width() + e.pageX - start;
                    $.data($th[0], 'col-width', width);
                    that._setColsWidth();
                    $headWrapper.mouseleave();
                }).on('mouseleave',function(){
                    $mmGrid.off('mouseup').off('mouseleave').off('mousemove');
                    $colResizePointer.hide();
                    $colResizePointerBefore.hide();
                    document.body.onselectstart = function(){
                        return true;//开启文字选择
                    };
                    $headWrapper.css('-moz-user-select','text');
                });
            });

            //选中事件
            var $body = this.$body;
            $body.on('click dblclick','td',function(e){
                //清除选中文本
                document.selection && document.selection.empty && ( document.selection.empty(), 1)
                || window.getSelection && window.getSelection().removeAllRanges();
                
                var $this = $(this);
                var event = jQuery.Event("cellSelected");
                event.target = e.target;
                that.$body.triggerHandler(event, [$.data($this.parent()[0], 'item'), $this.parent().index(), $this.index()]);

                if(event.isPropagationStopped()){
                    return;
                }
                if(!$this.parent().hasClass('selected')){
                    that.select($this.parent().index());
                }else{
                    that.deselect($this.parent().index());
                }
            });

            $body.on('click','tr > td .mmg-check',function(e){
                e.stopPropagation();
                var $this = $(this);
                if(this.checked){
                    that.select($($this.parents('tr')[0]).index());
                }else{
                    that.deselect($($this.parents('tr')[0]).index());
                }
            });

            //checkbox列
            if(opts.checkCol){
                $head.find('th .checkAll').on('click', function(){
                    if(this.checked){
                        that.select('all');
                    }else{
                        that.deselect('all');
                    }
                });
            }

            //IE6不支持hover
            if (browser.isIE6){
                $body.on('mouseenter','tr', function () {
                    $(this).toggleClass('hover');
                }).on('mouseleave','tr', function () {
                    $(this).toggleClass('hover');
                });
            };


        }

        //用来保存插件的初始化函数
        , _plugins_init_functions: []
        //执行插件初始化函数
        , _init_plugins: function(){
            for(var i=0; i < this._plugins_init_functions.length; i++){
                this._plugins_init_functions[i].call(this);
            }
        }
        , _getColName: function(col){
            var opts = this.opts;
            return col[this.opts.nameField];
        }
        , _rowHtml: function(item, rowIndex){
            var opts = this.opts;
            var expandCols = this.$fullColumns;
            var leafCols = this._leafCols();


            if($.isPlainObject(item)){
                var trHtml = [];
                trHtml.push('<tr>');
                for(var colIndex=0; colIndex < leafCols.length; colIndex++){
                    var col = leafCols[colIndex];
                    trHtml.push('<td class="');
                    var index =  $.inArray(col, expandCols);
                    trHtml.push(this._genColClass(index));
                    if(opts.nowrap){
                        trHtml.push(' nowrap');
                    }
                    trHtml.push('"><span class="');
                    if(opts.nowrap){
                        trHtml.push('nowrap');
                    }
                    trHtml.push('">');
                    if(col.renderer){
                        trHtml.push(col.renderer(item[this._getColName(col)],item,rowIndex));
                    }else{
                        trHtml.push(item[this._getColName(col)]);
                    }

                    trHtml.push('</span></td>');
                };
                trHtml.push('</tr>');
                return trHtml.join('');
            }
        }

        , _populate: function(items, append){
            var opts = this.opts;
            var $body = this.$body;
            var replace = false;
            var has_body = $body.find('tbody').size() > 0;
            
            if (!has_body || (!append && has_body))
                replace = true;

            this._hideNoData();
            if(items && items.length !== 0 && opts.cols){

                var tbodyHtmls = [];
                if (replace)
                    tbodyHtmls.push('<tbody>');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    var item = items[rowIndex];
                    tbodyHtmls.push(this._rowHtml(item, rowIndex));
                }
                if (replace)
                    tbodyHtmls.push('</tbody>');
                    
                if (replace)
                    $body.empty().html(tbodyHtmls.join(''));
                else
                    $body.find('tbody').append(tbodyHtmls.join(''));
                var $trs = $body.find('tr');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    $.data($trs.eq(rowIndex)[0],'item',items[rowIndex]);
                }
            }else{
                if (replace){
                    this._insertEmptyRow();
                    this._showNoData();
                }
            }
            this._setStyle();

            if(opts.fullWidthRows && this._loadCount <= 1){
                this._fullWidthRows();
            }

            this._hideLoading();
        }

        , _insertEmptyRow: function(){
            var $body = this.$body;
            $body.empty().html('<tbody><tr class="emptyRow"><td  style="border: 0px;background: none;">&nbsp;</td></tr></tbody>');
        }
        , _removeEmptyRow: function(){
            var $body = this.$body;
            $body.find('tr.emptyRow').remove();
        }

        /* 生成列类 */
        , _genColClass: function(colIndex){
            return 'mmg'+ this._id +'-col'+colIndex;
        }

        , _setStyle: function(){
            var $head = this.$head;
            var $ths = this._expandThs();
            var $body = this.$body;
            var leafCol = this._leafCols();

            //head
            $ths.eq(0).addClass('first');
            $ths.eq(-1).addClass('last');
            //body
            $body.find('tr,td').removeClass('even')
                .removeClass('colSelected').removeClass('colSelectedEven');

            $body.find('tr:odd').addClass('even');



            var sortIndex = $.inArray($head.find('.mmg-title').filter(function(){
                return $.data(this,'sortStatus') === 'asc' || $(this).data('sortStatus') === 'desc';
            }).parent().parent().data('col'), leafCol);

            $body.find('tr > td:nth-child('+(sortIndex+1)+')').addClass('colSelected')
                .filter(':odd').addClass('colSelectedEven');

            this._resizeHeight();

        }
        , _setColsWidth: function(){
            var opts = this.opts;
            var $style = this.$style;
            var $head = this.$head;

            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;

            var scrollTop = $bodyWrapper.scrollTop();
            var scrollLeft = $head.position().left;

            $bodyWrapper.width(9999);
            $body.width('auto');
            var styleText = [];
            for(var colIndex=0; colIndex<$ths.length; colIndex++){
                var $th = $ths.eq(colIndex);
                styleText.push('.mmGrid .'+this._genColClass(colIndex) + ' {');
                var width = $.data($th[0],'col-width');
                styleText.push('width: '+ width +'px;');
                styleText.push('max-width: '+ width +'px;');

                var col = expandCols[colIndex];
                if(col.align){
                    styleText.push('text-align: '+col.align+';');
                }
                if(col.hidden){
                    styleText.push('display: none; ');
                }
                styleText.push(' }');
            }

            $body.detach();
            try{
                $style.text(styleText.join(''));
            }catch(error){
                $style[0].styleSheet.cssText = styleText.join('');//IE fix
            }
            $body.width($head.width());
            $bodyWrapper.width('100%');
            $bodyWrapper.append($body);

            //调整滚动条

            $bodyWrapper.scrollLeft(-scrollLeft);
            if($bodyWrapper.scrollLeft() === 0){
                $head.css('left', 0);
            }

            $bodyWrapper.scrollTop(scrollTop);
        }
        , _fullWidthRows: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $mmGrid = this.$mmGrid;
            var $head = this.$head;
            var scrollWidth = $bodyWrapper.width() - $bodyWrapper[0].clientWidth;

            if(scrollWidth && browser.isIE){
                scrollWidth = scrollWidth + 1;
            }

            var fitWidth =  $mmGrid.width() - $head.width() - scrollWidth;
            if(fitWidth < -20){
                return;
            }

            var thsArr = [];
            var $ths = this._leafThs();
            var leafCol = this._leafCols();
            for(var i=0; i< leafCol.length; i++){
                var col = leafCol[i];
                var $th = $ths.eq(i);
                if(!col.lockWidth && $th.is(':visible')){
                    thsArr.push($th);
                }
            }

            var increaseWidth =  Math.floor(fitWidth / thsArr.length);
            var maxColWidthIndex = 0;
            for(var i=0; i< thsArr.length; i++){
                var $th = thsArr[i];
                var colWidth = $.data($th[0], 'col-width') + increaseWidth;
                $.data($th[0], 'col-width', colWidth);

                var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
                if(maxColWidth < colWidth){
                    maxColWidthIndex = i;
                }
            }

            var remainWidth =  fitWidth -  increaseWidth * thsArr.length;
            var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
            $.data(thsArr[maxColWidthIndex][0], 'col-width', maxColWidth + remainWidth);
            this._setColsWidth();
        }


        , _showLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').show();

            var $loading = $mmGrid.find('.mmg-loading');
            $loading.css({
                'left': ($mmGrid.width() - $loading.width()) / 2,
                'top': ($mmGrid.height() - $loading.height()) / 2
            }).show();
        }
        , _hideLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').hide();
            $mmGrid.find('.mmg-loading').hide();
        }
        , _showNoData: function(){
            this._showMessage(this.opts.noDataText);
        }
        , _hideNoData: function(){
            this._hideMessage();
        }

        , _showMessage: function(msg){
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $message = $mmGrid.find('.mmg-message');
            $message.css({
                'left': ($mmGrid.width() - $message.width()) / 2,
                'top': ($mmGrid.height() + $headWrapper.height()  - $message.height()) / 2
            }).text(msg).show();
        }
        , _hideMessage: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-message').hide();
        }

        , _nativeSorter: function(colIndex, sortStatus){
            var leafCols = this._leafCols();
            var col = leafCols[colIndex];

            this.$body.find('tr > td:nth-child('+(colIndex+1)+')')
                .sortElements(function(a, b){
                    var av = $.text($(a));
                    var bv = $.text($(b));
                    //排序前转换
                    if(col.type === 'number'){
                        av = parseFloat(av);
                        bv = parseFloat(bv);
                    }else{
                        //各个浏览器localeCompare的结果不一致
                        return sortStatus === 'desc' ? -av.localeCompare(bv)  : av.localeCompare(bv);
                    }
                    return av > bv ? (sortStatus === 'desc' ? -1 : 1) : (sortStatus === 'desc' ? 1 : -1);
                }, function(){
                    return this.parentNode;
                });
        }

        , _refreshSortStatus: function(){
            var $ths = this.$head.find('th');
            var sortColIndex = -1;
            var sortStatus = '';
            $ths.find('.mmg-title').each(function(index, item){
                var status = $.data(item, 'sortStatus');
                if(status){
                    sortColIndex = index;
                    sortStatus = status;
                }
            });
            var sortStatus = sortStatus === 'desc' ? 'asc' : 'desc';
            if(sortColIndex >=0){
                $ths.eq(sortColIndex).find('.mmg-title').data('sortStatus',sortStatus).click();
            }
        }

        , _loadAjax: function(args, append){
            var that = this;
            var opts = this.opts;
            var params = {};
            //opt的params可以使函数，例如收集过滤的参数
            if($.isFunction(opts.params)){
                params = $.extend(params, opts.params());
            }else if($.isPlainObject(opts.params)){
                params = $.extend(params, opts.params);
            }

            if(opts.remoteSort){
                var sortName = '';
                var sortStatus = '';
                var $titles = this.$head.find('.mmg-title');
                for(var colIndex=0; colIndex<$titles.length; colIndex++){
                    var status = $.data($titles[colIndex], 'sortStatus');
                    if(status){
                        var col = $titles.eq(colIndex).parent().parent().data('col');
                        sortName = col.sortName ?
                            col.sortName : this._getColName(col);
                        sortStatus = status;
                    }
                }
                if(sortName){
                    params.sort = sortName+'.'+sortStatus;
                }
            }

            //插件参数合并
            for(var i=0; i< this.opts.plugins.length; i++){
                var plugin = this.opts.plugins[i];
                $.extend(params, plugin.params());
            }

            //合并load的参数
            params = $.extend(params, args);
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: params,
                dataType: 'json',
                cache: opts.cache
            }).done(function(data){
                //获得root对象
                var items = data;
                that.$page = data.page || 1;
                that.$limit = data.limit || 0;
                if($.isArray(data[opts.root])){
                    items = data[opts.root];
                }
                that.$runing = 1;
                that._populate(items, append);
                that.$runing = 0;
                that._updateIndex(append);
                if(!opts.remoteSort){
                    that._refreshSortStatus();
                }

                that.$body.triggerHandler('loadSuccess', data);

            }).fail(function(data){
                that.$body.triggerHandler('loadError', data);
            });

        }

        , _loadNative: function(args){
            this._populate(args);
            this._refreshSortStatus();
            this.$body.triggerHandler('loadSuccess', args);
        }
        , load: function(args, append){
            var opts = this.opts;
            this._hideMessage();
            this._showLoading();
            this._loadCount = this._loadCount + 1 ;

            if($.isArray(args)){
                //加载本地数据
                this._loadNative(args);
            }else if(opts.url){
                this._loadAjax(args, append);
            }else if(opts.items){
                this._loadNative(opts.items);
            }else{
                this._loadNative([]);
            }
        }

        //重设尺寸
        , resize: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;

            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(opts.height !== 'auto'){
                if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                    $mmGrid.height('100%');
                    $mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
                }else{
                    $mmGrid.height(opts.height);
                }

                $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
            }

            //调整message
            var $message = $mmGrid.find('.mmg-message');
            if($message.is(':visible')){
                $message.css({
                    'left': ($mmGrid.width() - $message.width()) / 2,
                    'top': ($mmGrid.height() + $headWrapper.height() - $message.height()) / 2
                });
            }
            //调整loading
            var $mask = $mmGrid.find('.mmg-mask');
            if($mask.is(':visible')){
                $mask.width($mmGrid.width()).height($mmGrid.height());
                var $loadingWrapper = $mmGrid.find('.mmg-loading');
                $loadingWrapper.css({
                    'left': ($mmGrid.width() - $loadingWrapper.width()) / 2,
                    'top': ($mmGrid.height() - $loadingWrapper.height()) / 2
                })
            }

            $bodyWrapper.trigger('scroll');

            this._resizeHeight();
        }

        , _resizeHeight: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $body= this.$body;
            if(opts.height === 'auto' && browser.isIE7){
                $bodyWrapper.height('auto');
                if($bodyWrapper.width() < $body.width()){
                    $bodyWrapper.height($bodyWrapper.height() + $bodyWrapper.height() - $bodyWrapper[0].clientHeight  + 1);
                }
            }
        }

        , _updateIndex: function(append){
            if(this.opts.indexCol && !this.$runing){
                var $body = this.$body;
                var index_col = this.opts.cols[0][0];
                var start = (this.$page - 1) * this.$limit;
                if (append)
                    start = 0;
                $body.find('tr').each(function(index, el){
                    var col = $(el).find('td:first');
                    col.html(index_col.renderer(null, null, start+index));
                });
            }
        }

            //选中
        , select: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;

            if(typeof args === 'number'){
                var $tr = $body.find('tr').eq(args);
                if(!opts.multiSelect){
                    $body.find('tr.selected').removeClass('selected');
                    if(opts.checkCol){
                        $body.find('tr > td').find('.mmg-check').prop('checked','');
                    }
                }
                if(!$tr.hasClass('selected')){
                    $tr.addClass('selected');
                    if(opts.checkCol){
                        $tr.find('td .mmg-check').prop('checked','checked');
                    }
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        var $this = $(this);
                        if(!$this.hasClass('selected')){
                            $this.addClass('selected');
                            if(opts.checkCol){
                                $this.find('td .mmg-check').prop('checked','checked');
                            }
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                $body.find('tr').addClass('selected');
                $body.find('tr > td').find('.mmg-check').prop('checked','checked');
            }else{
                return;
            }

            if(opts.checkCol){
                var $checks = $body.find('tr > td').find('.mmg-check');
                if($checks.length === $checks.filter(':checked').length){
                    $head.find('th .checkAll').prop('checked','checked');
                }
            }


        }
            //取消选中
        , deselect: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;
            if(typeof args === 'number'){
                $body.find('tr').eq(args).removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr').eq(args).find('td .mmg-check').prop('checked','');
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        $(this).removeClass('selected');
                        if(opts.checkCol){
                            $(this).find('td .mmg-check').prop('checked','');
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr > td').find('.mmg-check').prop('checked','');
                }
            }else{
                return;
            }

            $head.find('th .checkAll').prop('checked','');

        }
        , selectedRows: function(){
            var $body = this.$body;
            var selected = [];
            $.each($body.find('tr.selected'), function(index ,item){
                selected.push($.data(this,'item'));
            });
            return selected;
        }

        , selectedRowsIndex: function(){
            var $body = this.$body;
            var $trs = this.$body.find('tr')
            var selected = [];
            $.each($body.find('tr.selected'), function(index){
                selected.push($trs.index(this));
            });
            return selected;
        }

        , rows: function(){
            var $body = this.$body;
            var items = [];
            $.each($body.find('tr'), function(){
                items.push($.data(this,'item'));
            });
            return items;
        }

        , row: function(index){
            var $body = this.$body;
            if(index !== undefined && index >= 0){
                var $tr = $body.find('tr').eq(index);
                if($tr.length !== 0){
                    return $.data($tr[0],'item');
                }
            }
        }

        , rowsLength: function(){
            var $body = this.$body;
            var length = $body.find('tr').length;
            if(length === 1 && $body.find('tr.emptyRow').length === 1){
                return 0;
            }
            return length;
        }

        //添加数据，第一个参数可以为数组
        , addRow: function(item, index){
            var $tbody = this.$body.find('tbody');

            if($.isArray(item)){
                for(var i=item.length-1; i >= 0; i--){
                    this.addRow(item[i], index);
                }
                return ;
            }

            if(!$.isPlainObject(item)){
                return ;
            }

            this._hideNoData();
            this._removeEmptyRow();

            var $tr;

            if(index === undefined || index < 0){
                $tr = $(this._rowHtml(item, this.rowsLength()));
                $tbody.append($tr);
            }else{
                $tr = $(this._rowHtml(item, index));
                if(index === 0){
                    $tbody.prepend($tr);
                }else{
                    var $before = $tbody.find('tr').eq(index-1);
                    //找不到就插到最后
                    if($before.length === 0){
                        $tbody.append($tr);
                    }else{
                        $before.after($($tr));
                    }
                }
            }
            $tr.data('item', item);
            this._setStyle();

            //update index
            this._updateIndex();
            this.$body.triggerHandler('rowInserted', [item, index]);
        }
        //更新行内容，两个参数都必填
        , updateRow: function(item, index){
            var opts = this.opts;
            var $tbody = this.$body.find('tbody');
            if(!$.isPlainObject(item)){
                return ;
            }
            var oldItem = this.row(index);

            var $tr = $tbody.find('tr').eq(index);
            var checked = $tr.find('td:first :checkbox').is(':checked');
            $tr.html(this._rowHtml(item, index).slice(4,-5));
            if(opts.checkCol){
                $tr.find('td:first :checkbox').prop('checked',checked);
            }

            $tr.data('item', item);
            this._setStyle();

            this.$body.triggerHandler('rowUpdated', [oldItem, item, index]);
        }

        //删除行，参数可以为索引数组
        , removeRow: function(index){
            var that = this;
            var $tbody = that.$body.find('tbody');

            if($.isArray(index)){
                for(var i=index.length-1; i >= 0; i--){
                    that.removeRow(index[i]);
                }
                return ;
            }

            if(index === undefined){
                var $trs = $tbody.find('tr');
                for(var i=$trs.length-1; i >= 0; i--){
                    that.removeRow(i);
                }
            }else{
                var item = that.row(index);
                $tbody.find('tr').eq(index).remove();
                this.$body.triggerHandler('rowRemoved', [item, index]);
            }
            this._setStyle();
            if(this.rowsLength() === 0){
                this._showNoData();
                this._insertEmptyRow();
            }
            //update index
            this._updateIndex();
        }
    };

    $.fn.mmGrid = function(){
        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , data = this.data('mmGrid')
                , options = $.extend(true, {}, $.fn.mmGrid.defaults, option);
            if (!data) {
                data = new MMGrid(this, options);
                this.data('mmGrid', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            var data = this.data('mmGrid');
            var fn =  data[arguments[0]];
            if(fn){
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.mmGrid.defaults = {
        width: 'auto'
        , height: '280px'
        , cols: []
        , url: false
        , params: {}
        , method: 'POST'
        , cache: false
        , root: 'items'
        , nameField: 'name'
        , items: []
        , autoLoad: true
        , remoteSort: false
        , sortName: ''
        , sortStatus: 'asc'
        , loadingText: '正在载入...'
        , noDataText: '没有数据'
        , multiSelect: false
        , checkCol: false
        , indexCol: false
        , indexColWidth: 30
        , fullWidthRows: false
        , nowrap: false
        , showBackboard: true
        , backboardMinHeight: 125
        , plugins: [] //插件 插件必须实现 init($mmGrid)和params()方法，参考mmPaginator
    };
//  event : loadSuccess(e,data), loadError(e, data), cellSelected(e, item, rowIndex, colIndex)
//          rowInserted(e,item, rowIndex), rowUpdated(e, oldItem, newItem, rowIndex), rowRemoved(e,item, rowIndex)
//


    $.fn.mmGrid.Constructor = MMGrid;
    
    //添加插件支持
    $.fn.mmGrid.addPlugin = function(plugin){
        $.extend($.fn.mmGrid.defaults, plugin.defaults);
        $.extend(MMGrid.prototype, plugin.methods);
        if (plugin._init){
            MMGrid.prototype._plugins_init_functions.push(plugin._init);
        }
    }


    // see: http://james.padolsey.com/javascript/sorting-elements-with-jquery/
    $.fn.sortElements = (function(){
        var sort = [].sort;
        return function(comparator, getSortable) {
            getSortable = getSortable || function(){return this;};
            var placements = this.map(function(){
                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );
                return function() {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }
                    parentNode.insertBefore(this, nextSibling);
                    parentNode.removeChild(nextSibling);
                };
            });
            return sort.call(this, comparator).each(function(i){
                placements[i].call(getSortable.call(this));
            });
        };
    })();
}(window.jQuery);
!function($){
    var MMPaginator = function(element, options){
        this.$el = $(element);
        this.opts = options;
    };

    MMPaginator.prototype = {
        _initLayout: function(){
            var that = this;
            var $el = this.$el;
            var opts = this.opts;

            $el.addClass("mmPaginator");
            var pgHtmls = [
                '<div class="totalCountLabel"></div>',
                '<ul class="pageList"></ul>',
                '<div class="limit"><select></select></div>'
            ];
            $el.append($(pgHtmls.join('')));
            
            this.$totalCountLabel = $el.find('.totalCountLabel');
            this.$pageList = $el.find('.pageList');
            this.$limitList = $el.find('.limit select');
            this.$infinite_stop = false;
            this.$lastScrollX = 0;
            var body = this.$mmGrid.$bodyWrapper;
            this.$bodyBottom = body.offset().top + body.height();
            
             var $limitList = this.$limitList
            $.each(opts.limitList, function(){
                var $option = $('<option></option>')
                    .prop('value',this)
                    .text(that.formatString(opts.limitLabel,[this]));
                $limitList.append($option);
            });

            $limitList.on('change', function(){
                that.$mmGrid.load();
            });
            
            //if infinite, then hidden the element
            if (opts.infinite){
                $el.find('ul.pageList, div.limit').hide();
            }

            var scrolling;

            if (typeof window.define === 'function' && window.define.amd !== undefined) {
                scrolling = require("scrolling")    
            } else {
                scrolling = window.scrolling;

            }
            scrolling(this.$mmGrid.$bodyWrapper[0], function(){
                if (!opts.infinite) return;
                var top = that.$mmGrid.$bodyWrapper.scrollTop();
                var last = that.$lastScrollX;
                that.$lastScrollX = top;
                if (last < top)
                    that._check_visible();
            });
            
        }

        , _plain: function(page, totalCount, limit){
            var that = this;
            var $el = this.$el;
            var $pageList = this.$pageList;

            var totalPage = totalCount % limit === 0 ? parseInt(totalCount/limit) : parseInt(totalCount/limit) + 1;
            totalPage = totalPage ? totalPage : 0;
            if(totalPage === 0){
                page = 1;
            }else if(page > totalPage){
                page = totalPage;
            }else if(page < 1 && totalPage != 0){
                page = 1;
            }
            //
            var $prev = $('<li class="prev"><a>'+that.opts.prev+'</a></li>');
            if(page<=1){
                $prev.addClass('disable');
            }else{
                $prev.find('a').on('click', function(){
                    $el.data('page', page-1);
                    that.$mmGrid.load();
                });
            }
            $pageList.append($prev);
            /////
            var list = [1];
            if(page > 4 ){
                list.push('...');
            }
            for(var i= 0; i < 5; i++){
                var no = page - 2 + i;
                if(no > 1 && no <= totalPage-1){
                    list.push(no);
                }
            }
            if(page+1 < totalPage-1){
                list.push('...');
            }
            if(totalPage>1){
                list.push(totalPage);
            }
            $.each(list, function(index, item){
                var $li = $('<li><a></a></li>');
                if(item === '...'){
                    $li.addClass('').html('...');
                }else if(item === page){
                    $li.addClass('active').find('a').text(item);
                }else{
                    $li.find('a').text(item).prop('title','第'+item+'页').on('click', function(e){
                        $el.data('page', item);
                        that.$mmGrid.load();
                    });
                }
                $pageList.append($li);
            });
            //
            var $next = $('<li class="next"><a>'+that.opts.next+'</a></li>');
            if(page>=totalPage){
                $next.addClass('disable');
            }else{
                $next.find('a').on('click', function(){
                    $el.data('page', page+1);
                    that.$mmGrid.load();
                });
            }
            $pageList.append($next);
        }

        , _search: function(page, totalCount, limit){

        }

        , load: function(params){
            var $el = this.$el;
            var $limitList = this.$limitList;
            var opts = this.opts;

            var page = params[opts.pageParamName];
            if(page === undefined || page === null){
                page = $el.data('page');
            }
            $el.data('page', page);

            var totalCount = params[opts.totalCountName];
            if(totalCount === undefined){
                totalCount = 0;
            }
            $el.data('totalCount', totalCount);
            this.$infinite_stop = false;

            var limit = params[opts.limitParamName];
            if(!limit){
                limit = $limitList.val();
            }
            this.$limitList.val(limit);

            this.$totalCountLabel.html(this.formatString(opts.totalCountLabel,[totalCount]));
            this.$pageList.empty();

            this._plain(page, totalCount, this.$limitList.val());
            
            this._check_visible();
        }
        
        , _test_visible: function(el){
            var top = $(el).offset().top;
            
            return top < this.$bodyBottom;
        }

        , _check_visible: function(){
            var opts = this.opts;
            
            if (!opts.infinite) return;
            
            var $el = this.$el;
            var page = $el.data('page');
            var limit = parseInt(this.$limitList.val());
            var total = $el.data('totalCount');

            if (page+limit-1<total){
                var $tbody = this.$mmGrid.$body.find('tbody');
                var el = $tbody.find('tr:last');
                var that = this;
                
                if (el.size()>0){
                    if (this._test_visible(el)){
                        $el.data('page', page+1);
                        that.$mmGrid.load({}, true);
                    }
                }
            }
        }
        
        , formatString: function(text, args){
            return text.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        }

        , params: function(){
            var opts = this.opts;
            var $el = this.$el;
            var $limitList = this.$limitList;

            var params = {};
            params[opts.pageParamName] = $el.data('page');
            params[opts.limitParamName] = $limitList.val();
            return params;
        }

        , init: function($grid){
            var that = this;
            var opts = that.opts;
            this.$mmGrid = $grid;
            this._initLayout();
            this.$mmGrid.on('loadSuccess', function(e, data){
                that.load(data);
            });

            var params = {};
            params[opts.totalCountName] = 0;
            params[opts.pageParamName] = opts.page;
            params[opts.limitParamName] = opts.limit;
            this.load(params);

            if($grid.opts.indexCol){
                var indexCol = $grid.opts.cols[0];
                indexCol.renderer = function(val,item,rowIndex){
                    var params = that.params();
                    return '<label class="mmg-index">' +
                        (rowIndex + 1 + ((params[opts.pageParamName]-1) * params[opts.limitParamName])) +
                        '</label>';
                };
            }

        }

    };

    $.fn.mmPaginator = function(){

        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , data = this.data('mmPaginator')
                , options = $.extend(true, {}, $.fn.mmPaginator.defaults, option);
            if (!data) {
                data = new MMPaginator(this[0], options);
                this.data('mmPaginator', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            var data = this.data('mmPaginator');
            var fn =  data[arguments[0]];
            if(fn){
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.mmPaginator.defaults = {
         style: 'plain'
        , totalCountName: 'totalCount'
        , page: 1
        , prev: '上一页'
        , next: '下一页'
        , pageParamName: 'page'
        , limitParamName: 'limit'
        , limitLabel: '每页{0}条'
        , totalCountLabel: '共<span>{0}</span>条记录'
        , limit: undefined
        , limitList: [20, 30, 40, 50]
        , infinite: false  //无限分页，要与mmPaginator配合
    };

    $.fn.mmPaginator.Constructor = MMPaginator;

}(window.jQuery);
/*
 * Inspired from treeTable plugin
 * Author: limodou@gmail.com
 * License: BSD
 */

!(function($) {

    treegrid = {
        defaults: {
            parentAttrName: 'parent',  //保存父结点id值使用的属性名
            clickableNodeNames: false,  //点击名称是否可以切換展示或折叠状态
            expandable: true, //如果为false，则不能折叠或展开
            defaultPaddingLeft: 6,
            indent: 16,     //每级缩近的宽度值
//            initialState: "collapsed",
            treeColumn: 0,  //可以是字段名
            fieldTarget: 'div.mmg-cellWrapper div', //每个单元格的第一个子元素标签名，在生成每个单元格时要与此一致
            persist: false, //是否将折叠状态保存在cookie中
            persistCookiePrefix: 'treeTable_',
            persistCookieOptions: {},
            stringExpand: "Expand", //展开按钮的中文提示
            stringCollapse: "Collapse", //折叠按钮的中文提示
            idField: 'id',  //用来定义数据中主键key
            keyAttrName: 'id',  //将主键key写到tr元素时使用的属性名称
            parentField: '_parent',  //用来在数据中标识父结点的字段名
            bind: false,        //是否启用数据绑定功能，如果启动则在数据发生变化时会主动调用处理函数
            bindHandler: null,  //数据绑定处理函数，如果bind为true，此值为空，则使用缺省处理函数
            readonly: true,  //如果是只读，则不能进行add, remove, indent, unindent等编辑操作
            orderingField: 'ordering',   //ordering用来保持每条的顺序号
            showMessage: null,   //显示消息的函数,
            cssRender:null,      //返回tr对应的css回调函数
            
            showIcon: false,    //树列显示图标
            iconIndent: 16,     //图标的宽度
            expandMethod: 'GET',//自动展开子结点ajax请求方式
            expandParam: 'id',  //自动展开子结点ajax请求参数名
            expandFilter: null, //自动展开数据预处理
            expandURL: null,    //自动展开子结点URL 

            detailPane: false,
            detailRenderer: null,
            detailField: "detailinfo"
            
            
        },
        
        _init: function(){
            var $self = this;
        }
        
        , methods: {
            /*
                返回表格总条数
            */
            count: function (){
                return this.$count;
            }
            
            /*
                返回当前结点的level值
            */
            , _level: function (node){
                return parseInt(node.attr('level') || 0);
            }
            /*
                数据格式为 {}或数组，其中如果数据中有 _isParent 则表示树结点
                _children 为 [] ，是当前结点的子结点
                index为指定的父结点，或者为序号或者为tr元素
                如果index为0，则插入最前面
                如果index为undefined，则表示自动判断数据中是否有父结点，自动按父结点
                来进行父子关系处理。则否视为0的效果。所以，如果数据中有父结点，但是
                不想以父结点方式来插入（子结点），则应指定index为插入位置，同时设
                置合适的position值。
                如果为undefined或null，则添加到最后
                position为插入的位置：before为向前插入， after为向后插入,
                last为在存在父结点时，插入到子结点的最后，如果无父结点则和after一样
                为每个结点添加一个level的值，这样后续计划缩近时可以使用这个值
                第一级为0
            */
            , _add : function(item, index, isChild, position){
                var $tbody = this.$body.find('tbody');
                var nodes = [];
                var pos;

                var hasDetail = this.opts.detailPane;
                
                position = position || 'after';
                
                //如果是数组，则按同组结点进行处理
                if($.isArray(item)){
                    for(var i=0; i < item.length; i++){
                        if(i == 0) pos = position;
                        else pos = 'last';
                        var d = this._add(item[i], index, isChild, pos);
                        nodes.push(d);
                    }
                    
                    return nodes;
                }
                
                if(!$.isPlainObject(item)){
                    return ;
                }
                
                var $tr;
                var length;
                var e;
                var parent;
                var children;
                var next;
                
                $tr = $(this._rowHtml(item));
                $tr.attr('level', 0);
                $tr.data('item', item);

                if(this.opts.detailPane) {
                    $tr_detail = $(this._detailRowHtml(item))
                }

                //无数据直接追加
                if(this.count() == 0){
                    e = this._trigger(this.$body, 'add', item);
                    if(e.isDefaultPrevented()) return;
                    $tbody.append($tr);
                    this._trigger($tr, 'added', item);
                }
                else{
                    //如果定义了父结点值，查找父结点是否存在，如果不存在则抛出错误
                    if (index===undefined && item[this.opts.parentField]){
                        parent = this.findItem(item[this.opts.parentField]);
                        if (!parent){
                            this._trigger(this.$body, {type:'error',
                                message:"can't find parent node"},
                                item);
                            return ;
                        }
                        isChild = true;
                    }
                    
                    node = this._get_item(index);
                    
                    //如果定义了isChild则不再判断position
                    if(isChild){
                        if (!parent) parent = node;
                    }else{
                        e = this._trigger(this.$body, 'add', item);
                        if(e.isDefaultPrevented()) return;
                        
                        //没找到则直接插入
                        if (!node) {
                            $tbody.append($tr);
                        }else{
                            //根据postion的指示插入结点
                            if (position == 'after' || position == 'last'){
                                next = this.getNext(node);
                                if (next){
                                    next.before($tr);
                                }
                                else
                                    $tbody.append($tr);
                            }else{
                                node.before($tr);
                            }
                            var p = this.getParent(node);
                            if (p){
                                var key = p.attr(this.opts.keyAttrName);
                                this._setParentValue($tr, key);
                                $tr.attr('level', this._level(p)+1);
                            }
                        }
                        
                        this._updateIndex();
                        this._trigger($tr, 'added', item);
                        
                    }
                }
                
                //如果有父结点，则处理父结点的样式
                if (parent){
                    e = this._trigger(this.$body, 'add', item);
                    if(e.isDefaultPrevented()) return;
                    
                    //如果position为last，则插入到子结点的最后
                    if(position == 'last'){
                        var children = this.getChildren(parent);
                        if(children.length > 0){
                            next = this.getNext($(children[children.length-1]));
                            if (next){
                                next.before($tr);
                            }
                            else
                                $tbody.append($tr);
                        } else {
                            if(hasDetail) {
                                parent.next().after($($tr));
                            } else {
                                parent.after($($tr));    
                            }
                        }
                    } else {
                        if(hasDetail) {
                            parent.next().after($($tr));
                        } else {
                            parent.after($($tr));    
                        }
                    }
                    
                    this._updateIndex();
                    this._trigger($tr, 'added', item);
                    
                    var key = parent.attr(this.opts.keyAttrName);
                    this._setParentValue($tr, key);
                    $tr.attr('level', this._level(parent)+1);
                    
                    this.updateStyle(parent, true);
                }
                
                this.$count ++;
                
                //处理子结点
                if (item._children){
                    nodes = this._add(item._children, $tr, true, position);
                    if (nodes){
                        if($.isArray(nodes)){
                            for(var i=0; i<nodes.length; i++){
                                this.updateStyle(nodes[i], false);
                            }
                        }else this.updateStyle(nodes, false);
                    }
                    this.updateStyle($tr, true);
                }else
                    this.updateStyle($tr, false);
                
                this._updateIndex();

                if(this.opts.detailPane) {
                    $tr.after($tr_detail)
                }
                return $tr
            }
            
            /*
                根据id值找到对应的元素对象
            */
            , findItem: function(id){
                var $body = this.$body;
                var trs = $body.find('tbody tr['+this.opts.keyAttrName+'="'+id+'"]');
                if (trs.length > 0)
                    return trs
                return ;
            }
            
            /*
                查找当前元素的上一个兄弟结点
            */
            
            , _populate: function(items, append){
                var opts = this.opts;
                var $body = this.$body;
                this._initing = true;   //初始化标志
                var replace = false;
                var has_body = $body.find('tbody').size() > 0;
                
                if (!has_body || (!append && has_body))
                    replace = true;
                
                this._hideMessage();
                if(items && items.length !== 0 && opts.cols){
                    if (replace)
                        $body.empty().html('<tbody></tbody>');
                    this.add(items, undefined, 'last')
                }else{
                    if (replace){
                        this._insertEmptyRow();
                        this._showNoData();
                    }
                }
                this._setStyle();
                
                if(opts.fullWidthRows && this._loadCount <= 1){
                    this._fullWidthRows();
                }
                
                this._hideLoading();
                this._initing = false;
                this._trigger(this.$body, 'inited');
            }
            
            //在某结点之后添加新结点
            , add: function(item, index, position){
                this._add(item, index, false, position);
                this._setStyle();
            }
            
            //在某结点之前添加新结点
            , insert: function(item, index){
                this._add(item, index, false, 'before');
                this._setStyle();
            }
            
            
            , addChild: function(item, index, position){
                this._add(item, index, true, position);
                this._setStyle();
            }
            
            /*
                获得某个索引的行数据，索引可以是tr元素
            */
            , row: function(index){
                var node = this._get_item(index);
                if(node) return node.data('item');
            }
            
            /*
                获得某个元素
                index可以为索引值或tr元素
                如果不存在则返回原index值
            */
            , _get_item: function(index){
                var item;
                var $tbody = this.$body.find('tbody');
                
                if($.isNumeric(index)){
                    item = $tbody.find('tr:not([rowinfo])').eq(index)
                    if(item.length == 0)
                        return ;
                    else
                        return item;
                }
                if(!index || index.length==0)
                    return ;
                return $(index);
            }

            /*
                删除行，参数可以为索引数组，同时増加是否删除标志
                如果数据中存在 _canDelete = false 则不允许删除
                index可以为索引或某个tr对象
                cascade表示是否同时删除子结点,如果不同时删除子结点
                则删除之后，其下的子结点将自动移到原结点的父结点上
                
            */
            , remove: function(index, cascade){
                var $tbody = this.$body.find('tbody');
                var $self = this;
                var nodes = [];
                var node;
                var para = [];
                var item = this._get_item(index);
                var data = this.row(index);
                
                //发出beforeDelete事件
                var e = this._trigger(item, 'delete', data);
                
                //如果被中止，则取消删除
                if (e.isDefaultPrevented()) return false;

                if(index == undefined){
                    nodes = $tbody.find('tr');
                }else{
                    node = this._get_item(index);
                    nodes.push(node);
                    if(cascade){
                        var children = this.getChildrenAll(node);
                        Array.prototype.push.apply(nodes, children);
                    }
                }
                
                for(var i=0; i<nodes.length; i++){
                    para.push(this.getKey(nodes[i]));
                }
                
                function f(data, is_direct){
                    if (!is_direct){
                        for(var i=0; i<data.length; i++){
                            var n = $self.findItem(data[i]);
                            $self._remove(n);
                        }
                    }else{
                        $self._remove(nodes);
                    }
                    
                    //更新所有父结点的样式
                    var parents = $self.getParents(node);
                    for(var i=0; i<parents.length; i++){
                        $self.updateStyle($(parents[i]));
                    }
                    $self._updateIndex();
                    $self._trigger($self.$body, {type:'deleted'}, data);
                    $self._setStyle();
                }
                
                this._bind_handler('delete', para, f);
            }
            
            /*
                发送事件，如果处理于初始化状态，则不发出事件
            */
            , _trigger: function(el, type, data){
                var e = $.Event(type);
                if(!this._initing)
                    $(el).trigger(e, data);
                return e;
            }
            
            /*
                删除某条记录，如果删除成功，则返回 true, 否则返回 false
            */
            , _remove: function(index){
                var $self = this;
                
                if($.isArray(index)){
                    for(var i=index.length-1; i >= 0; i--){
                        this._remove(index[i]);
                    }
                    return ;
                }
                
                var item = this._get_item(index);
                
                if (item){
                    if(item.next().attr("rowinfo")) {
                        item.next().remove()
                    }
                    item.remove();
                    this.$count --;
                }
            }
            
            //増加向tr中添加id的处理，因此要保证item有id属性
            //用户可以在options.idField中指定使用哪个key作为id值
            , _rowHtml: function(item){
            
                var opts = this.opts;
                var cls;
                var expandCols = this.$fullColumns;
                var leafCols = this._leafCols();
                
                if($.isPlainObject(item)){
                    var trHtml = [];
                    if (item[opts.idField])
                        trHtml.push('<tr '+ opts.keyAttrName + '="' + item[opts.idField] + '"');
                    else
                        trHtml.push('<tr');
                    if($.isFunction(opts.cssRender)){
                        cls = opts.cssRender(item);
                        if (cls[0] == 'add'){
                            trHtml.push(' class="'+cls[1]+'"');
                        }
                    }
                    trHtml.push('>');
                    for(var colIndex=0; colIndex < leafCols.length; colIndex++){
                        var col = leafCols[colIndex];
                        trHtml.push('<td class="');
                        var index =  $.inArray(col, expandCols);
                        trHtml.push(this._genColClass(index));
                        if(opts.nowrap){
                            trHtml.push(' nowrap');
                        }
                        trHtml.push('"><div class="mmg-cellWrapper"><div class="');
                        if(opts.nowrap){
                            trHtml.push('nowrap');
                        }
                        trHtml.push('"')
                        //如果是tree结点列，则每行预留一定的空白
                        if(colIndex == this._getColumnIndex(opts.treeColumn)){
                            var rowIndent = opts.showIcon ? opts.indent + opts.iconIndent+6 : opts.indent
                            trHtml.push(' style="padding-left:' + rowIndent + 'px"');
                        }
                        trHtml.push('>');
                        if(col.renderer){
                            trHtml.push(col.renderer(item[this._getColName(col)],item));
                        }else{
                            trHtml.push(item[this._getColName(col)]);
                        }
                        trHtml.push('</div>');
                        trHtml.push('</span></td>');
                    };

                    trHtml.push('</tr>');
                    return trHtml.join('');
                }
            }

            , _detailRowHtml: function(item) {
                var trHtml = [];
                var opts = this.opts;
                var leafCols = this._leafCols();

                if (item[opts.idField])
                    trHtml.push('<tr rowinfo="'+ opts.keyAttrName + '-' + item[opts.idField] + '"');
                else
                    trHtml.push('<tr');

                trHtml.push(' class="row-detail-pane"');
                trHtml.push('>');
                trHtml.push('<td class="" colspan="'+(leafCols.length+1)+'">');

                trHtml.push('<div class="mmg-detailCellWrapper">');
                if(opts.detailRenderer) {
                    trHtml.push(opts.detailRenderer(item))
                } else {
                    trHtml.push(item[opts.detailField])
                }
                trHtml.push('</div>');
                trHtml.push('</td>');
                trHtml.push('</tr>');

                return trHtml.join('');
            }
            
            /*
                绑定处理，如果定义了处理函数，则调用函数，如果为字符串
                则认为是URL，调用URL进行处理
                如果是初始化过程，则直接返回不作处理
            */
            , _bind_handler: function(action, data, callback){
                var $self = this;
                var item;
                if(this._initing) return;
                if (this.opts.bind){
                    if($.isFunction(this.opts.bindHandler)){
                        this.opts.bindHandler(action, data, callback);
                        return ;
                    }else if(typeof(this.opts.bindHandler) == 'string'){
                        data.action = action;
                        $.ajax({
                            url:this.opts.bindHandler,
                            type:'POST',
                            dataType:'json',
                            data:{action:action, data:JSON.stringify(data)}
                        })
                        .done(function(r){
                            if(r.success){
                                if(r.update_data){
                                    for(var i=0; i<r.update_data.length; i++){
                                        item = $self.findItem(r.update_data[i][$self.opts.idField]);
                                        $self._update(r.update_data[i], item);
                                    }
                                }
                                if($.isFunction(callback))
                                    callback(r.data);
                                if($self.opts.showMessage && r.message){
                                    $self.opts.showMessage(r.message);
                                }
                            }
                            else{
                                if(r.message){
                                    if($self.opts.showMessage) $self.opts.showMessage(r.message, 'error');
                                    else alert('Response failed: '+r.message);
                                }
                            }
                        })
                        .fail(function(jqXHR, textStatus){
                            if($self.opts.showMessage) $self.opts.showMessage('Response failed: '+textStatus, 'error');
                            else alert('Response failed: '+textStatus);
                        });
                        return ;
                    }
                }
                 
                if($.isFunction(callback))
                    callback(undefined, 'direct');
            }
            
            , saveOrdering: function (callback){
                var para = [];
                var nodes = this.$body.find('tbody tr');
                var d;
                var data;
                var ordering = 0;
                for(var i=0; i<nodes.length; i++){
                    d = {};
                    data = this.row($(nodes[i]));
                    if (data[this.opts.orderingField] <= ordering){
                        ordering ++;
                        d[this.opts.idField] = data[this.opts.idField];
                        d[this.opts.orderingField] = ordering;
                        data[this.opts.orderingField] = ordering;
                        para.push(d);
                    }else{
                        ordering = data[this.opts.orderingField];
                    }
                }
                this._bind_handler('saveOrdering', para, callback);
            }
            /*
                将后台返回的数据合并到数据中，格式为 [{id: k1:, k2}]
            */
            , mergeData: function (data){
                if (!data) return;
                
                var item;
                for(var i=0; i<data.length; i++){
                    item = this.findItem(data[i][this.opts.idField]);
                    this._update(data[i], item);
                }
            }
            
            , collapse: function (node){
                return this._collapse($(node), true);
            }
            
            , collapseById: function(nodeId){
                var node = this.findItem(nodeId);
                return this.collapse(node);
            }
            
            , collapseAll: function (){
                var children = this.getChildren();
                for (var i=0; i<children.length; i++){
                    this.collapse(children[i]);
                }
            }
            
            , expandAll: function (){
                var children = this.getChildren();
                for (var i=0; i<children.length; i++){
                    this.expand(children[i]);
                }
            }
            
            /*
                收起一个树结点
            */
            , _collapse: function (node, first) {
                if(!node || node.length == 0)
                    return ;

                if(!node.hasClass('parent')) 
                    return ;
                
                $self = this;
                var hasDetail = this.opts.detailPane;
                var data = this.row(node);
                
                if(node.hasClass('parent') && node.hasClass('expanded')){
                    if(first)
                        node.removeClass("expanded").addClass("collapsed");
                    else
                        node.addClass("collapsed");
                        
                    if(this.opts.showIcon) {
                        var icon = node.find('span.tree-icon');
                        icon.removeClass('tree-folder-open').addClass('tree-folder');
                    }
                
                    e = this._trigger(node, 'collapse', data);
                    if(e.isDefaultPrevented()) return;
                    
                    this.getChildren(node).each(function() {
                        if(!$(this).hasClass("collapsed")) {
                            $self._collapse($(this));
                        }
                
                        $(this).addClass('ui-helper-hidden');
                        if(hasDetail) {
                            $(this).next().addClass('ui-helper-hidden');    
                        }
                    });

                    this._trigger(node, 'collapsed', data);
                    
                }
                return node;
            }
            
            /*
                展开一个树结点
            */
            , expand: function (node) {
                if(!node || node.length == 0)
                    return ;
                    
                if(!node.hasClass('parent')) 
                    return ;
                    
                var $self = this;
                var hasDetail = this.opts.detailPane;
                var data = this.row(node);
                var children = this.getChildren(node);
                
                if (node.hasClass('collapsed')){
                    node.removeClass("collapsed").addClass("expanded");
                    if(this.opts.showIcon) {
                        var icon = node.find('span.tree-icon');
                        icon.removeClass('tree-folder').addClass('tree-folder-open');
                    }
                
                    e = this._trigger(node, 'expand', data);
                    if(e.isDefaultPrevented()) return;
                    
                    if(children.length > 0){
                        children.each(function() {
                            if($(this).is(".parent.expanded")) {
                                $self.expand($(this));
                            }
                    
                            $(this).removeClass('ui-helper-hidden');
                            if(hasDetail) {
                                $(this).next().removeClass('ui-helper-hidden');    
                            }
                    
                        });
                    }
                    //如果没有子结点，则判断是否装过数据，data('loaded')
                    //如果装过数据，则忽略
                    else{
                        if(!node.data('loaded')){
                            this.ajaxDo('expand', data);
                            node.data('loaded', true);
                        }
                    }
                    
                    this._trigger(node, 'expanded', data);
                }
            
              return node;
            }
            
            , expandById: function(nodeId) {
                var node = this.findItem(nodeId);
                return this.expand(node);
            }
            
            , ajaxDo: function (action, node) {
                if(this.opts.expandURL) {
                    var $self = this;
                    var data = {};
                    if (typeof this.opts.expandParam === 'string'){
                        data[this.opts.expandParam] = node[this.opts.expandParam];
                    }else if($.isPlainObject(this.opts.expandParam)){
                        $.each(this.opts.expandParam, function(k, v){
                            data[k] = node[v];
                        });
                    }
                    
                    $.ajax({
                        url: this.opts.expandURL,
                        type: this.opts.expandMethod || 'GET',
                        dataType:'json',
                        data:data
                    })
                    .done(function(r){
                        if($.isArray(r)) {
                            r = {success: true, data: r}
                        }
                        
                        if(r.success){
                            if(r.data){
                                var parentId = node[$self.opts.idField];
                                var parent = $self.findItem(parentId);
                                if($.isFunction($self.opts.expandFilter)) {
                                    var data = $self.opts.expandFilter(r.data, parentId);
                                    $self.addChild(data, parent)
                                } else {
                                    $self.addChild(r.data, parent)
                                }
                            }
                            if($self.opts.showMessage && r.message){
                                $self.opts.showMessage(r.message);
                            }
                        }
                        else{
                            if(r.message){
                                if($self.opts.showMessage) $self.opts.showMessage(r.message, 'error');
                                else alert('Response failed: '+r.message);
                            }
                        }
                    })
                    .fail(function(jqXHR, textStatus){
                        if($self.opts.showMessage) $self.opts.showMessage('Response failed: '+textStatus, 'error');
                        else alert('Response failed: '+textStatus);
                    });
                    
                } else {
                    
                }
                //console.log('ajaxdo', node, action);
            }
            
            , selectedItem: function(){
                var $body = this.$body;
                return $body.find('tr.selected:first');
            }
            
            , selectedItems: function(){
                var $body = this.$body;
                var selected = [];
                return $body.find('tr.selected');
            }
            
            /*
                切換折叠和展示状态
            */
            , toggleExpand: function (node) {
                if(node.hasClass("collapsed")) {
                    this.expand(node);
                } else {
                    this.collapse(node);
                }

                if (this.opts.persist) {
                    // Store cookie if this node is expanded, otherwise delete cookie.
                    var cookieName = this.opts.persistCookiePrefix + node.attr(this.opts.keyAttrName);
                    $.cookie(cookieName, node.hasClass('expanded') ? 'true' : null, this.opts.persistCookieOptions);
                }

                return this;
            }
            
            /*
                获得当前结点对应的父结点的值，此值的属性名可以根据 parentAttrName
                来修改
            */
            , _getParentValue: function (node){
                return $(node).attr(this.opts.parentAttrName);
            }
            
            /*
                设置当前结点对应的父结点的值
            */
            , _setParentValue: function (node, value){
                var parent;
                var data = this.row(node);
                
                if (value){
                    $(node).attr(this.opts.parentAttrName, value);
                    data[this.opts.parentField] = value;
                    parent = this.findItem(value);
                    if (parent){
                        parent.data('loaded', true);
                    }
                }
                else{
                    $(node).removeAttr(this.opts.parentAttrName);
                    data[this.opts.parentField] = '';                    
                }
            }
            
            , _getPaddingLeft: function (node) {
                var paddingLeft = parseInt(node[0].style.paddingLeft, 10);
                return ((isNaN(paddingLeft)) ? this.opts.defaultPaddingLeft : paddingLeft);
            }
            
            /*
                获得对应的列索引。如果index为字段名则查找对应的索引值
            */
            , _getColumnIndex: function (index) {
                if (!$.isNumeric(index)){
                    for(var i=0; i<this.$columns.length; i++){
                        if(this._getColName(this.$columns[i]) == index) return i;
                    }
                    return ;
                }else
                    return index;
            }
            
            /*
                获得某个结点的key值
            */
            , getKey: function(node) {
                return $(node).attr(this.opts.keyAttrName);
            }
            /*
                获得某个结点的子结点,如果node为undefined则返回所有顶层
                的结点
            */
            , getChildren: function(node){
                if(node)
                    return $(node).siblings("tr[" + this.opts.parentAttrName + '="' + this.getKey(node) + '"]');
                else{
                    return this.$body.find('tbody tr:not(['+this.opts.parentAttrName+']):not([rowinfo])');
                }
            }
            /*
                获得某个结点的所有子结点，包括子结点的子结点
            */
            , getChildrenAll: function(node, include_self){
                var nodes = [];
                
                if (!node || node.length==0) return nodes;
                
                if (include_self) nodes.push(node);
                
                var cur;
                var level = node.attr('level');
                
                //如果是同层，则取相同的parent和level的下一个结点
                cur = $(node).next();
                while (cur.length>0){
                    if (cur.attr("rowinfo")) {
                        cur = $(cur).next();
                    } else {
                        if (cur.attr('level') <= level){
                            break;
                        }
                        nodes.push(cur);
                        cur = $(cur).next();                        
                    }
                }
                return nodes;
            }

            /*
                获得当前结点的所有父结点
            */
            , getParents: function (node) {
                var parents = [];
                while(node = this.getParent(node)) {
                    parents[parents.length] = node[0];
                }
                return parents;
            }

            /*
                获得当前结点的直接父结点
            */
            , getParent: function (node) {
                if (!node || node.length==0) return ;
                
                var parent = this._getParentValue(node);
                if (parent)
                    return $('#' + parent);
            
                return ;
            }
            
            /*
                获得当前结点的下一个同级或高级结点,如果不存在则返回undefined
                如果samelevel=true，则只找同一个父结点的下一个同级结点
                如果为false，则返回其它树的第一个结点
            */
            , getNext: function(node, samelevel){
                if (!node || node.length==0) return ;
                
                var cur;
                var level = parseInt(node.attr('level'));
                var x;
                
                //如果是同层，则取相同的parent和level的下一个结点
                cur = $(node).next();
                while (cur.length>0){
                    if(cur.attr("rowinfo")) {
                        cur = $(cur).next();
                        continue;
                    }
                    x = parseInt(cur.attr('level'));
                    if(level == x){
                        return cur;
                    } else {
                        if (x > level) {
                            cur = $(cur).next();
                        } else {
                            if (x < level) {
                                if(!samelevel) {
                                    return cur;
                                } else {
                                    return ;
                                }
                            }
                        }
                    }
                }
            }
            
            /*
                获得node同级的所有后续的结点
            */
            , getNextAll: function(node){
                if (!node || node.length==0) return ;
                
                var cur;
                var level = node.attr('level');
                var nodes = [];
                
                //如果是同层，则取相同的parent和level的下一个结点
                cur = $(node).next();
                while (cur.length>0){
                    if(cur.attr("rowinfo")) {
                        cur = $(cur).next();
                        continue;
                    }

                    if(level == cur.attr('level')){
                        nodes.push(cur);
                    }else if (cur.attr('level') < level){
                        break;
                    }
                    
                    cur = $(cur).next();
                }
                return nodes;
            }
            
            /*
                获得当前结点的上一个同级结点,如果不存在则返回undefined
            */
            , getPrev: function (node){
                if (!node || node.length==0) return ;
                
                var cur;
                var level = node.attr('level');
                
                //如果是同层，则取相同的parent和level的下一个结点
                cur = $(node).prev();
                while (cur.length>0){
                    if(cur.attr("rowinfo")) {
                        cur = $(cur).prev();
                        continue;
                    }

                    if(level == cur.attr('level')){
                        return cur;
                    }else if (cur.attr('level') < level){
                        return ;
                    }
                    
                    cur = $(cur).prev();
                }
            }
            
            , select: function(args){
                var opts = this.opts;
                var $body = this.$body;
            
                e = this._trigger($body, 'select');
                if(e.isDefaultPrevented()) return;

                if(typeof args === 'number'){
                    var $tr = $body.find('tr').eq(args);

                    if($tr.attr("rowinfo")) {
                        return;
                    }

                    if(!opts.multiSelect){
                        $body.find('tr.selected').removeClass('selected');
                        if(opts.checkCol){
                            $body.find('tr > td').find('.mmg-check').prop('checked','');
                        }
                    }
                    if(!$tr.hasClass('selected')){
                        $tr.addClass('selected');
                        if(opts.checkCol){
                            $tr.find('td .mmg-check').prop('checked','checked');
                        }
                    }
                }else if(typeof args === 'function'){
                    $.each($body.find('tr'), function(index){
                        if(args($.data(this, 'item'), index)){
                            var $this = $(this);
                            if(!$this.hasClass('selected')){
                                $this.addClass('selected');
                                if(opts.checkCol){
                                    $this.find('td .mmg-check').prop('checked','checked');
                                }
                            }
                        }
                    });
                }else if(args === undefined || (typeof args === 'string' && args === 'all')){

                    if(!opts.multiSelect){
                        $body.find('tr.selected').removeClass('selected');
                        $body.find('tr:not([rowinfo]):first').addClass('selected');
                        $body.find('tr > td').find('.mmg-check:first').prop('checked','checked');
                    } else {
                        $body.find('tr.selected').removeClass('selected');
                        $body.find('tr:not([rowinfo])').addClass('selected');
                        $body.find('tr > td').find('.mmg-check').prop('checked','checked');
                    }
                }else{
                    return;
                }
                
                if(opts.checkCol){
                    var $checks = $body.find('tr > td').find('.mmg-check');
                    if($checks.length === $checks.filter(':checked').length){
                        $head.find('th .checkAll').prop('checked','checked');
                    }
                }
                
                this._trigger($body, 'selected');
                
            }
                //取消选中
            , deselect: function(args){
                var opts = this.opts;
                var $body = this.$body;
                var $head = this.$head;
                
                e = this._trigger($body, 'deselect');
                if(e.isDefaultPrevented()) return;
                
                if(typeof args === 'number'){
                    $body.find('tr').eq(args).removeClass('selected');
                    if(opts.checkCol){
                        $body.find('tr').eq(args).find('td .mmg-check').prop('checked','');
                    }
                }else if(typeof args === 'function'){
                    $.each($body.find('tr'), function(index){
                        if(args($.data(this, 'item'), index)){
                            $(this).removeClass('selected');
                            if(opts.checkCol){
                                $(this).find('td .mmg-check').prop('checked','');
                            }
                        }
                    });
                }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                    $body.find('tr.selected').removeClass('selected');
                    if(opts.checkCol){
                        $body.find('tr > td').find('.mmg-check').prop('checked','');
                    }
                }else{
                    return;
                }
                
                $head.find('th .checkAll').prop('checked','');
                
                this._trigger($body, 'deselected');
                
            }
            
//            , move: function (node, destination) {
//                var $self = this;
//                
//                node.insertAfter(destination);
//                this.getChildren(node).reverse().each(function() { 
//                    $self.move($(this), node[0]); 
//                });
//            }
            
            /*
                更新某条记录，只更新对应的字段
            */
            , _update: function(item, index){
                var opts = this.opts;
                var $tbody = this.$body.find('tbody');
                if(!$.isPlainObject(item)){
                    return ;
                }
                
                var that = this;
                var $tr = this._get_item(index);
                var checked = $tr.find('td:first :checkbox').is(':checked');
                var text;
                var cell;
                var data = this.row($tr);
                $.extend(data, item);
                
                $.each(data, function(key, value){
                    for(var colIndex=0; colIndex < that.$columns.length; colIndex++){
                        var col = that.$columns[colIndex];
                        if(that._getColName(col) == key){
                            if(col.renderer){
                                text = col.renderer(data[that._getColName(col)], data);
                            }else{
                                text = value;
                            }
                            cell = $tr.find('td:eq('+colIndex+')').find(opts.fieldTarget);
                            cell.html(text);
                            break;
                        }
                    }
                });
                
                //更新样式
                if($.isFunction(opts.cssRender)){
                    cls = opts.cssRender(data);
                    if (cls[0] == 'add'){
                        if(!$tr.hasClass(cls[1])) $tr.addClass(cls[1]);
                    }else if(cls[0] == 'remove') $tr.removeClass(cls[1]);
                }
                
                if(opts.checkCol){
                    $tr.find('td:first :checkbox').prop('checked',checked);
                }
            
                this._setStyle();
                return data;
            }

            , update: function(item, index){
                var data = this._update(item, index);
                var $tr = this._get_item(index);
                if (data)
                    this._trigger($tr, 'updated', data);
            }
            
            /*
                向上移动
            */
            , up: function (node, target) {
                var n = target || this.getPrev(node);
                var data = this.row(node);
                var children = this.getChildrenAll(node, true);
                var para = [];
                var i;
                var $self = this;

                if(n){
                    e = this._trigger(node, 'up', data);
                    if(e.isDefaultPrevented()) return;
                
                    var d = {}
                    d[this.opts.idField] = this.getKey(node);
                    d[this.opts.orderingField] = this.row(n)[this.opts.orderingField];
                    para.push(d);
                    
                    d = {}
                    d[this.opts.idField] = this.getKey(n);
                    d[this.opts.orderingField] = data[this.opts.orderingField];
                    para.push(d);
                    
                    function f(){
                        for(i=0; i<children.length; i++){

                            if($self.opts.detailPane) {
                                var next = children[i].next()
                                n.before(children[i])
                                n.before(next)
                            } else {
                                n.before(children[i]);    
                            }
                            
                        }
                        $self.mergeData(para);
                        
                        $self._trigger(node, 'upped', data);
                    }
                    
                    this._bind_handler('update', para, f);
                }
                
            }
            
            , down: function (node) {
                var n = this.getNext(node, true);

                if(n){
                    this.up(n, node);
                }
                
            }
            /*
                使当前结点向后缩近，变成上一结点的子结点
            */
            , indent: function (node, value) {
                var $self = this;
                var prev;
                var data = this.row(node);
                var para = [];
                
                //取同级上一个结点
                prev = this.getPrev(node);
                if (prev){
                
                    e = this._trigger(node, 'indent', data);
                    if(e.isDefaultPrevented()) return;
                    
                    //获得第一个结点的数据，及它的子结点的数据
                    //第一个结点为新的level及父结点
                    //子结点只需要新的level
                    var d = {};
                    d[this.opts.idField] = data[this.opts.idField];
                    d['level'] = this._level(node)+1;
                    d[this.opts.parentField] = this.getKey(prev);
                    
                    //取父结点的最后一个子结点，得到它的ordering值
                    var c = this.getChildren(prev);
                    if(c.length>0){
                        var ordering = this.row(c[c.length-1])[this.opts.orderingField];
                        if (data[this.opts.orderingField] <= ordering){
                            d[this.opts.orderingField] = ordering + 1;
                            data[this.opts.orderingField] = d[this.opts.orderingField];
                        }
                    }
                    //如果无子结点，ordering值可以不变
                    para.push(d);
                    
                    var children = this.getChildrenAll(node);
                    var x;
                    for(var i=0; i<children.length; i++){
                        x = this.row(children[i]);
                        d = {};
                        d[this.opts.idField] = x[this.opts.idField];
                        d['level'] = this._level(children[i])+1;
                        para.push(d);
                    }
                    
                    function f(){
                        //将当前结点变为同级上一个结点的子结点
                        $self._setParentValue(node, $self.getKey(prev));
                        $self._indent(node, 1);
                        $self._indent(children, 1);
                        
                        $self.updateStyle(prev);
                        
                        $self._trigger(node, 'indented', data);
                    }
                    
                    d = {data:para, node_id:data[this.opts.idField]}
                    this._bind_handler('indent', d, f);
                    

                }
            }
            
            /*
                使当前结点向前缩近，变成当前结点父结点的子结点
            */
            , unindent: function (node, value) {
                var $self = this;
                var parent;
                var grandpar;
                var data = this.row(node);
                var next;
                var para = [];
                var d, i, x, ordering;
                
                parent = this.getParent(node);
                if (parent){
                
                    next = this.getNext(node, true);
                    
                    e = this._trigger(node, 'unindent', data);
                    if(e.isDefaultPrevented()) return;

                    grandpar = this.getParent(parent);
                    
                    d = {};
                    d[this.opts.idField] = data[this.opts.idField];
                    if(grandpar){
                        //将当前结点变为祖父结点的子结点
                        d[this.opts.parentField] = this.getKey(grandpar);
                    }
                    else{
                        //已经到顶层，则清除父结点信息
                        d[this.opts.parentField] = '';
                    }
                    d['level'] = Math.max(0, this._level(node)-1);
                    ordering = this.row(parent)[this.opts.orderingField];
                    if (data[this.opts.orderingField] <= ordering){
                        ordering ++;
                        d[this.opts.orderingField] = ordering;
                        data[this.opts.orderingField] = ordering;
                    }
                    para.push(d);
                    
                    //将parent下的同级结点的ordering按node的ordering向后移动
                    var nexts = this.getNextAll(parent);
                    for(i=0; i<nexts.length; i++){
                        d = {};
                        x = this.row(nexts[i]);
                        d[this.opts.idField] = x[this.opts.idField];
                        if (x[this.opts.orderingField] > ordering){
                            ordering = x[this.opts.orderingField];
                        }else{
                            ordering ++;
                            x[this.opts.orderingField] = ordering;
                            d[this.opts.orderingField] = ordering;
                            para.push(d);
                        }
                    }
                    
                    var children = this.getChildrenAll(node);
                    for(i=0; i<children.length; i++){
                        x = this.row(children[i]);
                        d = {};
                        d[this.opts.idField] = x[this.opts.idField];
                        d['level'] = Math.max(0, this._level(children[i])-1);
                        para.push(d);
                    }
                    var nextNode = next;
                    while(nextNode){
                        d = {}
                        d[this.opts.idField] = this.row(nextNode)[this.opts.idField];
                        d[this.opts.parentField] = this.getKey(node);
                        para.push(d);
                        nextNode = this.getNext(nextNode, true);
                    }
                    
                    function f(){
                        if(grandpar){
                            //将当前结点变为祖父结点的子结点
                            $self._setParentValue(node, grandpar.attr($self.opts.keyAttrName));
                        }
                        else{
                            //已经到顶层，则清除父结点信息
                            $self._setParentValue(node);
                        }

                        $self._indent(node, -1);
                        $self._indent(children, -1);
                        
                        //下一个同级结点应该是当前结点的子结点
                        var nextNode = next;
                        while (nextNode){
                            $self._setParentValue(nextNode, node.attr($self.opts.keyAttrName));
                            nextNode = $self.getNext(nextNode, true);
                        }
                        
                        $self.updateStyle(parent);
                        $self.updateStyle(node);
                        
                        $self._trigger(node, 'unindented', data);
                    }
                    
                    d = {data:para, node_id:data[this.opts.idField], 
                        old_parent_id: this.getKey(parent)}
                    this._bind_handler('unindent', d, f);
                    
                }
            }
            
            , updateStyle: function(node, expandable, force){
                var old_expand = expandable;
                var $self = this;
                var cell = $(node.children("td")[this._getColumnIndex(this.opts.treeColumn)]);
                var target = cell.find(this.opts.fieldTarget);
                var a = cell.find('a.expander');
                var padding = this.opts.indent*(this._level(node)+1);
                var data = this.row(node);
                var children = this.getChildren(node);
                var parent = this.getParent(node);
                
                if (expandable || expandable === undefined)
                    expand = 'expanded'
                else
                    expand = 'collapsed';
                
                if(!node.hasClass('initialized') || force || 
                    (node.hasClass('parent') && children.length==0) || 
                    (!node.hasClass('parent') && children.length>0) ||
                    (node.hasClass('expanded') && !expand) ||
                    (node.hasClass('collapsed') && expand)){
                    
                    if(!node.hasClass('initialized'))
                        node.addClass('initialized');
                    
                    if(expandable && (!node.hasClass('expanded'))){
                        node.removeClass('collapsed').addClass('expanded');
                    }
                    if((expandable === false) && (!node.hasClass('collapsed')) && (children.length>0)){
                        node.removeClass('expanded').addClass('collapsed');
                    }
                    
                    //如果当前结点的数据中有_isParent或子结点数>0，则添加parent信息
                    if(data._isParent || children.length > 0) {
                        node.addClass("parent");
                    }else{
                        node.removeClass('parent');
                        cell.find('a.expander').remove();
                    }
                    if(this.opts.showIcon) {
                        var icon = cell.find('span.tree-icon');
                        if(icon.length==0) {
                            icon = $('<span class="tree-icon"></span>');
                            cell.children('div').prepend(icon);
                        }
                        target.css('paddingLeft', padding + this.opts.iconIndent+6);
                        icon.css('left', padding-16 + this.opts.iconIndent);
                        icon.removeClass('tree-file').removeClass('tree-folder').removeClass('tree-folder-open');
                        if (node.hasClass('parent')) {
                            if(node.hasClass('expanded')){
                                icon.addClass('tree-folder-open');
                            } else {
                                icon.addClass('tree-folder');
                            }
                        } else {
                            icon.addClass('tree-file')
                        }
                        if(data.iconCls) {
                            icon.addClass(data.iconCls);
                        }
                    } else {
                        target.css('paddingLeft', padding);
                    }
                    
                    if(node.hasClass('parent')){
                        if(this.opts.expandable) {
                            if (a.length==0){
                                a = $('<a href="#" title="' + this.opts.stringExpand + '" class="expander"></a>');
                                cell.children('div').prepend(a);
                                a.click(function() { $self.toggleExpand(node); return false; });
                                if(this.opts.clickableNodeNames) {
                                    a.css('cursor', "pointer");
                                    $(cell).click(function(e) {
                                        // Don't double-toggle if the click is on the existing expander icon
                                        if (e.target.className != 'expander') {
                                            $self.toggleExpand(node);
                                        }
                                    });
                                }
                            }
                        }
                        
                        if(!(node.hasClass("expanded") || node.hasClass("collapsed"))) {
                            node.addClass(expand);
                        }
                        
                    }

                    a.css('left', padding-16);
                }
            }
            /*
                在指定的行对应的列显示一个小图标
            */
            , set_notation: function(index, column, cls, message){
                var $tr = this._get_item(index);
                var cell = $($tr.children("td")[this._getColumnIndex(column)]);
                cell.removeClass('error').removeClass('warning').removeClass('success').remove('info');
                cell.addClass(cls);
                cell.attr('title', message);
                cell.find('.mmg-notation').remove();
                var item = $('<span class="mmg-notation '+cls+'" title="'+message+'"></span>');
                cell.find('div.mmg-cellWrapper').append(item);
            }
            
            /*
                在指定的行对应的列显示不同的背景
            */
            , set_cell_notation: function(index, column, cls, message){
                var $tr = this._get_item(index);
                var cell = $($tr.children("td")[this._getColumnIndex(column)]);
                cell.removeClass('error').removeClass('warning').removeClass('success').remove('info');
                cell.addClass(cls);
                cell.attr('title', message);
            }
            
            /*
                使当前结，包括子结点向后缩近
            */
            , _indent: function (node, direction){
                if (!node || node.length==0) return ;
                if ($.isArray(node) && node.length>0){
                    for(var i=0; i<node.length; i++){
                        this._indent(node[i], direction);
                    }
                    return ;
                }
                node = $(node);
                var $self = this;
                var cell = $(node.children("td")[this._getColumnIndex(this.opts.treeColumn)]);
                var target = cell.find(this.opts.fieldTarget);
                var a = cell.find('a.expander');
                
                if(direction>0){
                    $(node).attr('level', this._level(node)+1);
                }
                else{
                    $(node).attr('level', Math.max(0, this._level(node)-1));
                }
                
                this.updateStyle(node, undefined, true);
            }

            , showDetailPane: function(node) {
                var item = this._get_item(index);
                item.next().addClass("showing")
            }

            , hideDetailPane: function(node) {
                var item = this._get_item(index);
                item.next().removeClass("showing")
            }

            , toggleDetailPane: function(index) {
                var item = this._get_item(index);
                if(item.next().hasClass("showing")) {
                    item.next().removeClass("showing")
                } else {
                    item.next().addClass("showing")
                }
            }

            , selectedRowsIndex: function(){
                var $body = this.$body;
                var $trs = this.$body.find('tr:not([rowinfo])')
                var selected = [];
                $.each($body.find('tr.selected'), function(index){
                    selected.push($trs.index(this));
                });
                return selected;
            }


        } // end of methods
        
        
    } //end of treegrid

    //调用mmGrid插件初始化处理
    $.fn.mmGrid.addPlugin(treegrid);
    
})(jQuery);

