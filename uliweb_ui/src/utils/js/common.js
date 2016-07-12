/*
 * use head.load to load js files
 *
 * options:
 *    module is configed in /static/jsmodules.js
 *           and jsmodules.js can be created via `uliweb jsmodule -a uliweb_ui`
 */

function load(module, callback){
    head.load(["/static/jsmodules.js"], function(){
        var modules = [];
        if ($.isArray(module)) {
            module.forEach(function(v){
                $.merge(modules, jsmodules[v])
            })
        } else modules = jsmodules[module].slice()
        head.load(modules, callback);
    });

}
/*
 * show message on top center of window
 *
 * options:
 *    message
 *    category: success, error, info, warning
 */
function show_message(message, category) {

    load('ui.toastr', function(){
        category = category || "success"

        var config = {
            "closeButton": true,
            "positionClass": "toast-top-center"
        }
        var title = ""

        if (category == "success") {
            toastr.success(message, title, config)
        } else if (category == "error") {
            toastr.error(message, title, config)
        } else if (category == "info") {
            toastr.info(message, title, config)
        } else if (category == "warning") {
            toastr.warning(message, title, config)
        } else {
            toastr.info(message, title, config)
        }
    });

    return;

}


/* popup dialog

 @param target: target element
 @param options: could be url or plain object

 async content sould fire 'success.form' event, it'll hide the popup by default
 */
function popup_url(target, options, title, callback) {
    var opts;
    if (typeof options === 'string') {
        opts = {url: options, title: title || ''};
    } else opts = options;
    callback = callback || options.callback;

    var d = {
        content: function (data) {
            var begin, end;
            begin = data.indexOf('<!-- form -->')
            end = data.indexOf('<!-- end form -->')
            if (begin > -1 && end > -1) {
                return data.substring(begin, end);
            }
            return data;
        },
        async: {
            success: function (that) {
                that.getContentElement().on('success.form', function (e, data) {
                    that.hide();
                    if (callback) callback(data);
                });
            }
        },
        title: 'Popup',
        width: 400,
        cache: false,
        height: 'auto',
        padding: true,
        closeable: true,
        type: 'async',
        url: 'example',
        delay: 50
    };

    load('ui.popover', function(){
        var o = $.extend({}, d, opts);
        $(target).webuiPopover(o);
        if (o.show)
            $(target).webuiPopover('show');
    });
}

function show_popup_url(target, options, title, callback) {
    var opts;
    if (typeof options === 'string') {
        opts = {url: options, title: title || ''};
    } else opts = options;
    opts.show = true;
    popup_url(target, opts, title, callback);
}


/* download

 @param url: download url
 */

(function ($) {
    $(function () {
        jQuery('<iframe src="" style="display:none" id="ajaxiframedownload"></iframe>')
            .appendTo('body');
    });
    $.download = function (url) {
        //url and data options required
        if (url) {
            //send request
            var el = $('#ajaxiframedownload');
            el.attr('src', url);
        }
    }
})(jQuery);


/* block_message

  @param message: message
  @param options: blockUI options
*/

function block_message(message, options) {
    load('ui.blockUI', function() {
        var df = { css: {
               border: 'none',
               padding: '15px',
               backgroundColor: '#000',
               '-webkit-border-radius': '5px',
               '-moz-border-radius': '5px',
               opacity: .5,
               color: '#fff'
              }
        }
        var opts = $.extend({}, df, options, {message:message})
        $.blockUI(opts);
    });
}

/* bootstrap model fix for select2 */
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

/* simple_select2

  make select2 plugin easily

  @param el: target element
  @param options: select2 options if options is string, then
      it'll be {ajax:{url:options}}
*/

function simple_select2 (el, options){
  var url = null
  if (typeof options === 'string') {
    url = options
    options = {}
  }
  // no options passwd, it'll find el url attribute
  else if (!options) {
    url = $(el).attr('data-url')
    options = {}
  }
  var opts
  if (url)
    opts = {
      minimumInputLength: 2,
      width: '100%',
      allowClear:true,
      language: 'zh-CN',
      ajax: {
          url: url,
          data: function (params) {
              return {
                  term: params.term,
                  label: 'text',
                  page:params.page
              }
          },
          dataType: 'json',
          processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;

            return {
              results: data,
              pagination: {
                more: (params.page * 20) < data.length
              }
            }
          }
      }
    }
      /*,
      formatNoMatches: function () { return "找不到对应值"; },
      formatInputTooShort: function (input, min) { return "请输入至少 " + (min - input.length) + " 个字符"; },
      formatSelectionTooBig: function (limit) { return "你只能选 " + limit + " 条数据"; },
      formatLoadMore: function (pageNumber) { return "装入更多数据..."; },
      formatSearching: function () { return "搜索..."; }
      */

  else
    opts = {
      width: '100%',
      allowClear:true,
      language: 'zh-CN'
    }

  $(el).select2($.extend(true, {}, opts, options));
}

/* jquery init function
*/
$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    var m = $.parseJSON(jqxhr.responseText);
    if (m && !m.success && m.redirect) {
        var login = /\/login\b/;
        var url = m.redirect;
        //Test if login, then replace next parameter
        if (login.test(m.redirect)) {
            url = updateURLParameter(m.redirect, 'next', window.location.href);
        }
        window.location.href = url;
    }
});


$.ajaxSetup({
    cache: false,
    traditional: true
});
