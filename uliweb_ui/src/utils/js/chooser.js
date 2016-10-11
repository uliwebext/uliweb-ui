/*
 * 通用输入框选择控件，可以用在input, select上
 * 可以支持多种展示形式：
 * 1. 作为一个图标显示在原输入控件后面
 * 2. 替换原输入控件
 * 另外，可以容易实现扩展
 */
 ;(function($,window,document,undefined){
   "use strict";


    var Chooser = function(el, opt) {
      var self = this;
      this.element = el;
      this.$el = $(el);
      this.options = opt;
      this.init();
    }

    Chooser.prototype = {
        constructor: Chooser,
        init: function () {
          var contain, icon, h, self=this

          if (this.options.type == 'addon') {
            this.$el.css('paddingRight', 24)
            contain = this.options.contain || this.$el.parent()
            contain.css('position', 'relative')
            icon = $('<i class="'+this.options.icon+' chooser"></i>')
            h = this.$el.outerHeight()
            icon.css({height:h, 'line-height':h+'px', position:'absolute',
              right:4, top:0, cursor:'pointer', "font-size":'1em',
              color: "gray"})
            contain.append(icon)

            icon.click(function(e){
              e.preventDefault()
              e.stopPropagation()
              self._do()
            })

          }
        },

        _do: function() {
          var name = this.options.widgets[this.options.widget]
          window[name](this.$el, this.options.widget_options)
        }
    }
    $.fn.chooser = function (option) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('chooser'),
          options = $.extend({}, $.fn.chooser.defaults, typeof option == 'object' && option || {});
        if (!data) $this.data('chooser', (data = new Chooser(this, options)));
        if (typeof option == 'string') data[option].apply(data, args);
      })
    }

    $.fn.chooser.defaults = {
      icon: 'fa fa-ellipsis-h',  //展示图标，可以使用ion图标或fontawesome图标, 用在 'addon' 类型上
      container: null, //关联的父元素，缺省使用input的父元素
      widget: null, //使用何种控件，如'tree', 'list'
      url: null, //是否有url
      data: null, //传入的数据
      widget_options: {}, //控件需要的额外的参数
      type: 'addon', //与input关联时的展示形式，缺省为图标模式，还可以选 'overwrite',
      placeholder: '请输入', //占位符
      multiple: null, //是否可以多选，缺省根据控件的multiple属性来判断
      onValue: function (){},
      render: function(data) {}, //在进行操作之后，如何显示结果，data是一个数组，形式为：
                                   //[{value:'value', text:'text'}]
      widgets: {tree:'tree_select'}
    }

    $.fn.chooser.Constructor = Chooser;

 })(jQuery,window,document);
