var tree_select = function(target, options) {
  var $target = $(target)
  options = options || {}

  load(['ui.ztree', 'ui.popover'], function(){
    var _defaults = {
      content:function(){
        return '<ul class="ztree"></ul>'
      },
      type: 'html',
      height: 'auto',
      maxHeight: 300,
      arrow: false,
    }

    var ztree_options = {
      async:{},
      check:{},
      view:{},
      check:{},
      callback: {
        onClick: function(e, treeId, node) {
          if (!z_opts.multiple) {
            $target.val(node.tId)
            $target.webuiPopover('hide')
          }
        }
      }
    }
    var url = options.url
    delete options.url
    var opts = $.extend({}, _defaults, options || {})
    var z_opts = $.extend(true, {}, ztree_options, options || {})
    var data = options.data
    if (url) {
      z_opts.async.url = url
      z_opts.async.enable = true
      z_opts.async.autoParam = ["id=parent"]
    }

    $(target).webuiPopover(opts).on('show.webui.popover', function(e){
      var body = $target.data('plugin_webuiPopover').getContentElement()
      var ztree = $(body).find('.ztree')
      if (!ztree.data('ztree_loaded')) {
        $.fn.zTree.init(ztree, z_opts, data);
        ztree.data('ztree_loaded', true)
      }
    });
    setTimeout(function(){
      $target.webuiPopover('show');
    }, 100)
  });

};
