/*
 * use head.load to load js files
 *
 * options:
 *    module is configed in /static/jsmodules.js
 *           and jsmodules.js can be created via `uliweb jsmodule -a uliweb_ui`
 */

/*
 * add disable load control
 * if you don't want to use load you should include resource yourself, and
 * invoke load_disable() to disable load feature
 */

var _load_disable = false

function load_disable() {
  _load_disable = true
}

function load(module, callback){
  if (_load_disable) {
    callback()
  }
  else {
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
            "positionClass": "toast-top-full-width",
            "timeOut": "5000",
            "newestOnTop": true,
            "progressBar": true
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
    options = options || {}
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
        title: '',
        cache: true,
        widht: 'auto',
        height: 'auto',
        trigger:'hover',
        placement:'right',
        padding: true,
        closeable: false,
        type: 'async',
        url: 'example',
        parameters: {info:1},
        delay: 50
    };

    load('ui.popover', function(){
      $(target).each(function(){
        var el = $(this);
        var o = $.extend(true, {}, d, opts);
        var url = el.attr('href') || el.attr('data-url') || o.url
        var query = new QueryString()
        query.load(url)
        query.merge(o.parameters)
        o.url = url + query.toString()
        el.webuiPopover(o);
        if (o.show)
            $(target).webuiPopover('show');
      })
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

/* show url info
 * depends on tooltipster
 */
function popup_info(target, url, options) {
  var opts = {
    interactive: true,
    content: 'Loading...',
    side: 'right',
    contentAsHTML: true,
    theme: 'tooltipster-light',
    parameters: {info:1},
    // 'instance' is basically the tooltip. More details in the "Object-oriented Tooltipster" section.
    functionBefore: function(instance, helper) {
      var $origin = $(helper.origin);
      // we set a variable so the data is only loaded once via Ajax, not every time the tooltip opens
      if ($origin.data('loaded') !== true) {
        $.get(instance.__options.url, function(data) {
          // call the 'content' method to update the content of our tooltip with the returned data
          instance.content(data);
          // to remember that the data has been loaded
          $origin.data('loaded', true);
        });
      }
    }
  }
  load('ui.tooltipster', function(){
    $(target).each(function(){
      var el = $(this);
      var o = $.extend(true, {}, opts, options || {});
      var url = el.attr('href') || el.attr('data-url') || o.url
      var query = new QueryString()
      query.load(url)
      query.merge(o.parameters)
      o.url = url + query.toString()
      el.tooltipster(o);
    })
  })
}


/* download

 @param url: download url
 */

 $.download = function (url) {
     //url and data options required
     if (url) {
         //send request
         var el = $('#ajaxiframedownload');
         el.attr('src', url);
     }
 }

$(function () {
    var frame = $('#ajaxiframedownload')
    if (frame.size() == 0)
        $('<iframe src="" style="display:none" id="ajaxiframedownload"></iframe>').appendTo('body');
});


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
      it'll be {ajax:{url:options}} or it'll fetch from element url or data-url attribute
      it'll also process placeholder attribute
*/

function simple_select2 (el, options){
  load('ui.select2', function(){
    var $el = $(el),
      url = $el.attr('data-url') || $el.attr('url'),
      placeholder = $el.attr('placeholder') || '请选择';
    options = options || {}
    if (typeof options === 'string') {
      url = options
      options = {}
    }
    var opts, data
    var limit = options.limit || 10
    if (url)
      opts = {
        minimumInputLength: 2,
        width: '100%',
        placeholder:{
          id:'',
          placeholder:placeholder
        },
        allowClear:true,
        language: 'zh-CN',
        ajax: {
            url: url,
            data: function (params) {
                return {
                    term: params.term,
                    label: 'text',
                    page:params.page,
                    limit:limit
                }
            },
            dataType: 'json',
            processResults: function (result, params) {
              // parse the results into the format expected by Select2
              // since we are using custom formatting functions we do not need to
              // alter the remote JSON data, except to indicate that infinite
              // scrolling can be used
              params.page = params.page || 1;

              if (!Array.isArray(result)) {
                data = result.rows
                total = result.total
              } else {
                data = result
                total = 0
              }

              return {
                results: data,
                pagination: {
                  more: (params.page * limit) < total
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
        placeholder:{
          id:'',
          placeholder:placeholder
        },
        language: 'zh-CN'
      }

    $(el).select2($.extend(true, {}, opts, options));
  })
}

/*
  get select options from url
  server shoud return data just like this:

    [[value1, text1], [value2, text2], ...]

  or

    [{value:'value1', text:'text1'}, {value:'value2', text:'text2'}...]
*/
function get_select(target, url, data){
    $.ajax({
        type: 'POST',
        url: url,
        data: data || {},
        dataType: 'json',
        success: function(data){
            var html = "<option value=''></option>";
            var v,k,t;
            $.each(data, function(j, value){
                if($.type(value) == 'array'){
                    v = value[0];
                    k = value[1];
                }else{
                    v = value.value;
                    k = value.text;
                }
                html = html + '<option value=' + v + '>' + k + '</option>'
            });
            if (typeof target == 'string') t = $('select[name='+target+']');
            else t = $(target);
            t.html(html);
        }
    });
};

/* serialize form data
*/
function serializeObject(el) {
  var d = {}
  var data = $(':input', el).serializeArray()
  for(var i=0, len=data.length; i<len; i++) {
    if (d.hasOwnProperty(data[i].name)) {
      if (Array.isArray(d[data[i].name]))
        d[data[i].name].push(data[i].value)
      else {
        d[data[i].name] = [d[data[i].name], data[i].value]
      }
    } else {
      d[data[i].name] = data[i].value
    }
  }
  return d
}

/* get display value from choices dataType
 * for example:
 * var choices = [['0', 'A'], ['1', 'B']]
 * get_choice(choices, '0') === 'A'
*/
function get_choice(choices, value) {
  for(var i=0, len=choices.length; i<len; i++) {
    if (choices[i][0] == value){
      return choices[i][1]
    }
  }
  return ''
}

function push_url (url) {
  if(history && history.pushState) history.pushState(null, null, url)
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
            url = get_url(m.redirect, {next: window.location.href});
        }
        window.location.href = url;
    }
});


$.ajaxSetup({
    cache: false,
    traditional: true
});
