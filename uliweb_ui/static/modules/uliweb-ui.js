/* display clear input text buttons
*/
(function($){
    $.fn.clear_button = function(options){
        //各种属性和参数

        // var options = $.extend(defaults, options || {});

        this.each(function(){
            //插件的实现代码
            var $item = $(this)
            if ($item.data('clear_button')) return
            $item.css({'padding-right':24})
            var $parent = $item.parent()
            $parent.css({position:'relative'})
            var el = $('<i class="ion-ios-close"></i>')
            var h = $item.outerHeight()
            el.css({height:h, 'line-height':h+'px', position:'absolute',
              right:4, top:0, cursor:'pointer', "font-size":'1.4em',
              color: "gray", display:'none'})
            $parent.append(el)
            $item.keyup(function(e){
              if ($item.val())
                el.show()
              else {
                el.hide()
              }
            })
            el.click(function(e){
              e.preventDefault()
              $item.val('')
              el.hide()
            })
            $item.data('clear_button', el)
        });
    };
})(jQuery);

/*
 * use head.load to load js files
 *
 * options:
 *    module is configed in /static/jsmodules.js
 *           and jsmodules.js can be created via `uliweb jsmodule -a uliweb_ui`
 */

function load(module, callback){
    $import(["/static/jsmodules.js"], function(){
        var modules = [];
        if ($.isArray(module)) {
            module.forEach(function(v){
                $.merge(modules, jsmodules[v])
            })
        } else modules = jsmodules[module].slice()
        $import(modules, callback);
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
    d[data[i].name] = data[i].value
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



function S4(){
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function getId(){
   return '_'+S4()+S4();
}

/*
 * process ajax request and jquery.validation
 */

function dialog_ajax_submit(dialog, validator) {

    load('ui.jquery.form', function(){

        var el = dialog.getModalBody().find('form');
        el.ajaxSubmit({
            beforeSubmit: function () {
              dialog.enableButtons(false);
              dialog.setClosable(false);
            },
            success: function (data) {
                if (data.success) {
                    el.trigger('success.form', data);
                    if (data.message)
                      show_message(data.message)
                    dialog.close();

                    //处理成功事件
                    if (dialog.options.onSuccess) {
                      dialog.options.onSuccess(dialog, data)
                    }
                } else {
                    show_message(data.message, 'error')
                    validator.showErrors(data.errors);
                    //处理成功事件
                    if (dialog.options.onFail) {
                      dialog.options.onFail(dialog, data)
                    }
                }
                dialog.enableButtons(true);
                dialog.setClosable(true);
                dialog.getButton('btnSave').stopSpin();
            },
            error: function () {
              dialog.enableButtons(true);
              dialog.setClosable(true);
              dialog.getButton('btnSave').stopSpin();
            }
        });
    });
}

function dialog_validate_submit(dialog, options) {
    var default_options = {
        rules: {},
        messages: {},
        ajax_submit: common_ajax_submit
    }

    var opts = $.extend(true, {}, default_options, options);
    load(['ui.jquery.validation'], function(){
        var form = dialog.getModalBody().find('form');
        var validator = form.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            rules: opts.rules,
            messages: opts.messages,
            highlight: function (element) {
                $(element).closest('.form-group, .table-field-row').addClass('has-error');
            },

            success: function (label) {
                label.closest('.form-group, .table-field-row').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                element.parent('div').append(error);
            },

            submitHandler: function (form) {
              if (options.onBeforeSubmit) {
                if (options.onBeforeSubmit(dialog, form))
                    return
              }
              opts.ajax_submit(dialog, validator);
            }
        });

    });
}

/*
 * open a remote dialog
 * need BootstrapDialog3
 */

function dialog(url, options) {
  options = options || {}
  var onBeforeSubmit = options.onBeforeSubmit || function (dialog, form) {return false;}
  load('ui.bootstrap.dialog', function(){
    var default_opts = {
      message: function(dialog) {
          var content = $('<div></div>')
          $.ajax({
            url: url,
            context: content, //document.body,
            success: function(responseText) {
              content.append($(responseText))
              //content.filter("script").each(function(i) {
              //    eval($(this).text());
              //});
              content.find('.form-actions').remove()
              //处理标题
              var h1 = content.find('h1')
              if (h1.size()>0) {
                var title = h1.html()
                dialog.setTitle(title)
                h1.remove()
              }
              var form = content.find('form')
              if (form.size() > 0)
                form_widgets(form)

              //处理表单校验
              dialog_validate_submit(dialog, {ajax_submit:dialog_ajax_submit, onBeforeSubmit:onBeforeSubmit})
            }
          })

          return content
      },
      draggable: true
    }, opts;
    opts = $.extend(true, {}, default_opts, options)
    var  okButton = {
        label: opts.okLabel===undefined ? '确定' : opts.okLabel,
        id: 'btnSave',
        cssClass: 'btn-primary btn-flat',
        hotkey: 13,
        action: function(dialog){
          if (options.onOk) options.onOk(dialog)
          else {
            var form = dialog.getModalBody().find('form');
            this.spin();
            form.submit();
          }
        }
    }
    var cancelButton = {
        label: opts.cancelLabel===undefined ? '取消' : opts.cancelLabel,
        cssClass: 'btn-default btn-flat',
        hotkey: 27,
        action: function(dialog){
            dialog.close();
        }
    }
    if (!opts.buttons) {
      opts.buttons = []
      if (okButton.label) {
        opts.buttons.push(okButton)
      }
      if (cancelButton.label) {
        opts.buttons.push(cancelButton)
      }
    }
    return BootstrapDialog.show(opts);
  })
}

function Confirm(message, callback) {
  load('ui.bootstrap.dialog', function(){
    BootstrapDialog.confirm(message, callback);
  })
}

function Alert(message, callback) {
  load('ui.bootstrap.dialog', function(){
    BootstrapDialog.confirm(message, callback);
  })
}

/*
 * process ajax request and jquery.validation
 */

function common_ajax_submit(target, validator) {

    load('ui.jquery.form', function(){

        var el = $(target);
        el.ajaxSubmit({
            beforeSubmit: function () {
                el.find(':submit').prop('disabled', true);
            },
            success: function (data) {
                if (data.success) {
                    el.trigger('success.form', data);
                } else {
                    show_message(data.message, 'error')
                    validator.showErrors(data.errors);
                }
                el.find(':submit').prop('disabled', false);
            },
            error: function () {
                el.find(':submit').prop('disabled', false);
            }
        });
    });
}

/*
 * options:
 *    rules
 *    messages
 *    ajax_submit
 */
function validate_submit(target, options) {
    var default_options = {
        rules: {},
        messages: {},
        ajax_submit: common_ajax_submit
    }

    var opts = $.extend(true, {}, default_options, options);
    load(['ui.jquery.validation'], function(){
        var form = $(target);
        var validator = form.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            rules: opts.rules,
            messages: opts.messages,
            highlight: function (element) {
                $(element).closest('.form-group, .table-field-row').addClass('has-error');
            },

            success: function (label) {
                label.closest('.form-group, .table-field-row').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                element.parent('div').append(error);
            },

            submitHandler: function (form) {
                opts.ajax_submit(form, validator);
            }
        });

    });
}

/*
 * replace current form wedgits to sepcified js wedgits
 * options:
 *    target: target form element
 */

var widgets_mapping = {
    date: function(el, options){
        load(['ui.moment', 'ui.pikaday'], function(){
            var opts = {format: 'YYYY-MM-DD', showTime:false};
            $.extend(true, opts, options || {});
            $(el).pikaday(opts);
        })
    },
    select: function(el, options){
        load(['ui.select2'], function(select2){
/*            var opts = {width:'resolve'};
            $.extend(true, opts, options || {});
            $(el).select2(opts);
            */
            simple_select2(el)
        });
    },
    datetime: function(el, options){
        load(['ui.moment', 'ui.pikaday'], function(){
            var opts = {format: 'YYYY-MM-DD hh:mm:ss', showTime:true, use24hour:true};
            $.extend(true, opts, options || {});
            $(el).pikaday(opts);
        })
    },
    file: function(el, options){
        load(['ui.bootstrap-filestyle'], function(filestyle){
            var opts = {buttonText:'', buttonName:'btn-primary'};
            $.extend(true, opts, options || {});
            $(el).filestyle(opts);
        });
    },
    image: function(el, options){
        load(['ui.bootstrap-filestyle'], function(filestyle){
            var opts = {buttonText:'', buttonName:'btn-primary',
                iconName:'glyphicon-picture'};
            $.extend(true, opts, options || {});
            $(el).filestyle(opts);
        });
    }
}

function form_widgets(target, options) {
    var form = $(target);
    var _type, element, opts, func, param;
    opts = $.extend(true, {}, widgets_mapping, options || {});
    form.find('[widget]').each(function (index, el) {
        element = $(el);
        _type = element.attr('widget');
        param = eval('(' + element.attr('options') + ')');
        func = opts[_type];
        if (func) {
            func(element, param);
        }
    });
}

/*
 * Form Builder
 *
 * options
 *    {
 *      attrs:{id, class, action, method}
 *      fields:[]
 *      layout:[]
 *      rules:[]
 *
 *    }
 */
;
(function ($, window, document, undefined) {
    /* convert plainobject to k="value" format */
    function to_attrs(opt) {
        var buf = [];
        if (opt) {
            $.each(opt, function (k, v) {
                buf.push(k + '="' + v + '"');
            });
            return buf.join(' ');
        } else return '';
    }

    function to_choices_static(field) {
        var buf = [], choice;
        if (field.choices && field.choices.length > 0) {
            for (var i = 0, _len = field.choices.length; i < _len; i++) {
                choice = field.choices[i];
                if (field.multiple) {
                    selected = field.value.indexOf(choice[0]) > -1 ? true : false;
                } else {
                    selected = field.value == choice[0] ? true : false;
                }
                if (selected)
                    buf.push('<span class="label label-default">' + choice[1] + '</span>');
            }
            return buf.join(' ');
        }
    }

    /*
     * create_table
     */

    function _create_tbody(data) {
        var buf = [];
        $.each(data, function (index, v) {
            tr = ['<tr>'];
            $.each(v, function (index, x) {
                tr.push('<td>' + x + '</td>');
            });
            tr.push('</tr>');
            buf.push(tr.join(''));
        });
        return buf.join('\n');
    }

    function create_table(field, readonly) {
        var buf = [],
            fields = this.fields,
            f, id = 'table_' + field.name, tr;
        if (!readonly) {
            buf.push('<a class="btn btn-primary btn-flat btn-xs"><i class="fa fa-plus"></i> 增加</a>');
        }
        buf.push('<table id="' + id + '" class="' + this.options.table_class + '">');
        buf.push('<thead><tr>');
        $.each(field.fields, function (index, v) {
            f = fields[v];
            buf.push('<th>' + f.label + '</th>');
        });
        buf.push('</tr></thead><tbody>');
        //如果不是数组,表示是URL
        if (field.data) {
            if (!$.isArray(field.data)) {
                buf.push(_create_tbody(field.data));
            } else { //按URL进行处理
                $.get(field.data).success(function (r) {
                    var tbody = _create_tbody(r);
                    $(id).find('tbody').append(tbody);
                })
            }
        }
        buf.push('</tbody></table>');
        return buf.join('\n');
    }

    /*
     * converter
     */
    function str_convert(field, attrs, readonly, table_cell) {
        var cls = '';

        readonly = readonly || field.static || false;
        if (!readonly) {
            attrs['value'] = field.value;
            return '<input type="text" ' + to_attrs(attrs) + ' class="form-control">';
        } else if (table_cell) cls = ' table-field-content';
        return '<div class="form-control-static' + cls + '">' +
            this.field_to_static(field) + '</div>';

    }

    function password_convert(field, attrs, readonly, table_cell) {
        var cls = '';

        readonly = readonly || field.static || false;
        if (!readonly) {
            attrs['value'] = field.value;
            return '<input type="password" ' + to_attrs(attrs) + ' class="form-control">';
        } else if (table_cell) cls = ' table-field-content';
        return '<div class="form-control-static' + cls + '">' +
            this.field_to_static(field, '******') + '</div>';

    }

    function text_convert(field, attrs, readonly, table_cell) {
        var cls = '';

        readonly = readonly || field.static || false;
        if (!readonly) {
            attrs.rows = attrs.rows || 4;
            return '<textarea ' + to_attrs(attrs) + ' class="form-control">' +
                field.value +
                '</textarea>';
        } else if (table_cell) cls = ' table-field-content';
        return '<div class="form-control-static' + cls + '">' +
            this.field_to_static(field) + '</div>';

    }

    function hidden_convert(field, attrs, readonly, table_cell) {
        var cls = '';

        readonly = readonly || field.static || false;
        if (!readonly) {
            attrs['value'] = field.value;
            return '<input type="hidden" ' + to_attrs(attrs) + '>';
        } else
            return '';
    }

    /*
     * 表格处理
     */
    function table_convert(field, attrs, readonly, table_cell) {
        var cls = '';

        readonly = readonly || field.static || false;
        return create_table.call(this, field, readonly);
    }

    function checkbox_convert(field, attrs, readonly, table_cell) {
        var cls = '', inline = field.inline, static_value;

        if (field.value === '') field.value = false;
        readonly = readonly || field.static || false;
        if (!readonly) {
            if (field.value) attrs['checked'] = 'checked';
            if (inline)
                return '<label class="checkbox-inline"><input type="checkbox" ' +
                    to_attrs(attrs) +
                    '> ' + field.label + '</label>';
            else
                return '<input type="checkbox" ' + to_attrs(attrs) + ' class="checkbox">';
        } else {
            if (table_cell) cls = ' table-field-content';
            if (field.value) static_value = '<i class="glyphicon glyphicon-ok"></i>';
            else static_value = '<i class="glyphicon glyphicon-remove"></i>';
            if (inline)
                return '<div class="form-control-static' + cls + '">' +
                    this.field_to_static(field, static_value) + ' ' + field.label + '</div>';
            else
                return '<div class="form-control-static' + cls + '">' +
                    this.field_to_static(field, static_value) + '</div>';
        }
    }

    function file_convert(field, attrs, readonly, table_cell) {
        var cls = '', inline = field.inline;

        readonly = readonly || field.static || false;
        if (!readonly) {
            return '<input type="file" ' + to_attrs(attrs) + ' class="form-control">';
        } else {
            if (table_cell) cls = ' table-field-content';
            return '<div class="form-control-static' + cls + '">' +
                this.field_to_static(field) + '</div>';
        }
    }

    function select_convert(field, attrs, readonly, table_cell) {
        var cls = '';
        var buf = [], multiple = field.multiple ? ' multiple="multiple"' : '',
            choice, checked;

        readonly = readonly || field.static || false;
        if (!readonly) {
            buf.push('<select ' + to_attrs(attrs) + multiple + ' class="form-control">');
            if (field.choices) {
                for (var i = 0, _len = field.choices.length; i < _len; i++) {
                    choice = field.choices[i];
                    if (field.multiple) {
                        selected = field.value.indexOf(choice[0]) > -1 ? 'selected="selected"' : '';
                    } else {
                        selected = field.value == choice[0] ? 'selected="selected"' : '';
                    }
                    buf.push('<option ' + selected + 'value="' + choice[0] + '">' +
                    choice[1] + '</option>');
                }
            }
            buf.push('</select>');
            return buf.join('');
        } else {
            if (table_cell) cls = ' table-field-content';

            return '<div class="form-control-static' + cls + '">' +
                this.field_to_static(field, to_choices_static(field)) + '</div>';
        }
    }

    function radios_convert(field, attrs, readonly, table_cell) {
        var buf = [], selected, choice;

        readonly = readonly || field.static || false;
        if (!readonly) {
            for (var i = 0, _len = field.choices.length; i < _len; i++) {
                choice = field.choices[i];
                delete attrs['class'];
                attrs.id = attrs.id + (i + 1);
                attrs.name = field.name;
                selected = field.value == choice[0] ? 'checked="checked"' : '';
                if (field.inline) {
                    buf.push('<label class="radio-inline">');
                    buf.push('<input type="radio" ' + to_attrs(attrs) + selected + 'value="' + choice[0] + '">');
                    buf.push(choice[1]);
                    buf.push('</label>');
                } else {
                    buf.push('<div class="radio"><label>');
                    buf.push('<input type="radio" ' + to_attrs(attrs) + selected + 'value="' + choice[0] + '">');
                    buf.push(choice[1]);
                    buf.push('</label></div>');
                }
            }
            return buf.join('');
        } else {
            if (table_cell) cls = ' table-field-content';

            return '<div class="form-control-static' + cls + '">' +
                this.field_to_static(field, to_choices_static(field)) + '</div>';
        }
    }

    function checkboxes_convert(field, attrs, readonly, table_cell) {
        var buf = [], selected, choice;

        readonly = readonly || field.static || false;
        field.multiple = true;
        if (!readonly) {
            for (var i = 0, _len = field.choices.length; i < _len; i++) {
                choice = field.choices[i];
                attrs.name = field.name;
                selected = field.value.indexOf(choice[0]) > -1 ? 'checked="checked"' : '';
                if (field.inline) {
                    buf.push('<label class="checkbox-inline">');
                    buf.push('<input type="checkbox" ' + to_attrs(attrs) + selected + 'value="' + choice[0] + '">');
                    buf.push(choice[1]);
                    buf.push('</label>');
                } else {
                    buf.push('<div class="checkbox"><label>');
                    buf.push('<input type="checkbox" ' + to_attrs(attrs) + selected + 'value="' + choice[0] + '">');
                    buf.push(choice[1]);
                    buf.push('</label></div>');
                }
            }
            return buf.join('');
        } else {
            if (table_cell) cls = ' table-field-content';

            return '<div class="form-control-static' + cls + '">' +
                this.field_to_static(field, to_choices_static(field)) + '</div>';
        }
    }

    var FormBuilder = function (ele, options) {
        if (ele)
            this.element = $(ele);
        else
            this.element = null;
        this.defaults = {
            attrs: {role: 'form', method: 'POST'},
            layout_class: 'bs3t',
            layout: {
                table_class: 'table table-hover table-layout',
                column_class: 'form-group',
                button_offset: 0,
                label_width: 0,
                fields: [],
                rows: [],
                buttons: []
            },
            fields: [],
            rules: {},
            messages: {},
            data: {},
            js_form: true,
            buttons_class: 'form-actions',
            create_table: create_table,
            table_class: 'table table-bordered'
        },
            this.options = $.extend(true, {}, this.defaults, options),
            this.buf = [],
            this.fields = {},
            this.fields_list = [],
            this.hidden_fields = [],
            this.has_file = false,
            this.rows = [];
    }
    FormBuilder.prototype = {
        html: function () {
            var form;
            this._init_fields();
            this._init_layout();
            this.begin();
            this.body();
            this.buttons();
            this.end();
            return this.buf.join('');
        },
        init: function () {
            var html = this.html();
            this.element.append(html);
            form = this.element.find('form');
            if (!this.options.readonly && !$.isEmptyObject(this.options.rules)) {
                validate_submit(form, {
                    rules: this.options.rules,
                    messages: this.options.messages,
                    ajax_submit: this.options.ajax_submit
                });
            }
            if (this.options.js_form)
                form_widgets(form);
        },
        begin: function () {
            if (this.has_file)
                this.options.attrs['enctype'] = 'multipart/form-data';
            var attr = to_attrs(this.options.attrs);
            this.buf.push('<form ');
            this.buf.push(attr);
            this.buf.push('>');
        },
        body: function () {
            this._process_hidden();
            var layout_class = this.options.layout_class || 'bs3h';
            if (layout_class === 'bs3v') this.v_layout();
            else this.v_layout(true);
        },
        buttons: function () {
            var buttons, b, btn, btn_offset, text;

            if (this.options.layout.buttons) {
                buttons = this.options.layout.buttons;
                this.buf.push('<div class="form-group ' + this.options.buttons_class + '">');
                if (this.options.layout.button_offset) {
                    btn_offset = this.options.layout.button_offset;
                    this.buf.push('<div style="padding-left:' + btn_offset + '">');
                }
                for (var i = 0, _len = buttons.length; i < _len; i++) {
                    b = buttons[i];
                    //test if a button type
                    if ($.isPlainObject(b)) {
                        btn = $.extend({}, b);
                        text = btn.text;
                        delete btn.text;
                        this.buf.push('<button ' + to_attrs(b) + '>' + text + '</button>\n');
                    } else {
                        this.buf.push(b + "\n");
                    }
                }
                if (this.options.layout.button_offset)
                    this.buf.push('</div>');
                this.buf.push('</div>');
            }
        },
        _init_fields: function () {
            var fields = this.options.fields, field, rules;
            for (var i = 0, _len = fields.length; i < _len; i++) {
                field = fields[i];
                this.fields[field.name] = field;
                field.id = 'field_' + field.name;

                // rules process, merge rules options and field.rules
                // also copy it to rules options
                if (!field.rules) field.rules = {};
                rules = this.options.rules[field.name];
                if (rules)
                    $.extend(field.rules, rules);

                field.value = this.options.data[field.name];
                if (typeof field.value === 'undefined')
                    field.value = '';
                this.options.rules[field.name] = field.rules;
                if (field.type === 'hidden')
                    this.hidden_fields.push(field);
                else {
                    if (field.type === 'file' || field.type === 'image')
                        this.has_file = true;
                    this.fields_list.push(field.name);
                }
            }
        },
        /*
         * combine layout.fields and fields
         */
        _init_layout: function () {
            var fields, field;
            if (this.options.layout) {
                if (this.options.layout.fields) {
                    fields = this.options.layout.fields;
                    for (var i = 0, _len = fields.length; i < _len; i++) {
                        field = fields[i];
                        if (this.fields.hasOwnProperty(field.name))
                            $.extend(true, this.fields[field.name], field);
                        else this.fields[field.name] = field;
                    }
                }
                if (this.options.layout.rows) {
                    this.rows = this.options.layout.rows;
                } else this.rows = this.fields_list;
            }
        },
        _process_hidden: function () {
            var fields = this.hidden_fields;
            for (var i = 0, _len = fields.length; i < _len; i++) {
                this.buf.push(this.field_to_html(fields[i]));
            }
        },
        end: function () {
            this.buf.push('</form>');
        },
        _get_widget: function (type) {
            var widget = $.fn.formb.type_mapping[type];
            if (!widget) widget = 'str';
            return widget;
        },
        /* convert field to html */
        field_to_html: function (field, readonly, table_cell) {
            var attrs = {};
            if (field.name) attrs.name = field.name;
            if (field.placeholder) attrs.placeholder = field.placeholder;
            if (field.attrs) $.extend(attrs, field.attrs);
            attrs.data_type = field.type;
            attrs.widget = field.widget || this._get_widget(field.type);

            var converter = $.fn.formb.converters[attrs.widget] || str_convert;
            return converter.call(this, field, attrs, readonly, table_cell);
        },
        /* convert field to label */
        field_to_label: function (field, readonly, table_cell) {
            if (!!field.hide_label_grid) {
                return ''
            }
            var attrs = {}, buf = [];
            if (table_cell) attrs['class'] = 'table-field-label';
            attrs['for'] = field.id
            buf.push('<label ' + to_attrs(attrs) + '>');
            if (!field.hide_label) {
                buf.push(field.label);
                if (field.label) buf.push(': ');
                if (!readonly && field.rules.required)
                    buf.push('<span class="field_required">*</span>');
            }
            buf.push('</label>');
            return buf.join('');
        },
        /* static formatter */
        field_to_static: function (field, default_value) {
            default_value = default_value || field.value;
            var render = field.render;
            if (render) {
                return render.call(this, field.value);
            } else return default_value;
        },
        /* help string */
        field_to_help_string: function (field) {
            if (field.help_string)
                return '<p class="help-block">' + field.help_string + '</p>';
            return '';
        },
        v_layout: function (use_table) {
            var row, col, cols_num, fields_set = false,
                first = true, title, table = false,
                table_class = this.options.layout.table_class;
            for (var i = 0, _len = this.rows.length; i < _len; i++) {
                row = this.rows[i];
                if (!$.isArray(row)) {
                    if (row.substr(0, 3) == '-- ' && row.substr(row.length - 3, 3) == ' --') {
                        fields_set = true;
                        title = row.substring(3, row.length - 3).trim();
                        if (first) {
                            this.buf.push('<fieldset><legend>' + title + '</legend>');
                            first = false;
                        } else {
                            if (table) {
                                this.buf.push('</table>');
                            }
                            this.buf.push('</fieldset><fieldset><legend>' + title + '</legend>');
                        }
                        if (use_table) {
                            this.buf.push('<table class="' + table_class + '">');
                            table = true;
                        }
                        continue;
                    } else {
                        if (use_table && !table) {
                            this.buf.push('<table class="' + table_class + '">');
                            table = true;
                        }

                        row = [row];
                    }
                } else {
                    if (use_table && !table) {
                        this.buf.push('<table class="' + table_class + '">');
                        table = true;
                    }
                }
                //process line
                this._process_line(row, use_table);
            }
            if (table) this.buf.push('</table>');
            if (fields_set) this.buf.push('</fieldset>');
        },
        _process_line: function (cols, use_table) {
            var cols_num = cols.length, total_width = 0,
                result = [], buf = [], i, width, content, r, span;

            for (var j = 0; j < cols_num; j++) {
                r = this._process_column(cols[j], cols_num, use_table);
                result.push(r);
                total_width += r[0];
            }

            if (cols_num === 1) {
                if (use_table) {
                    buf.push('<tr><td colspan="12">')
                    buf.push(result[0][1]);
                    buf.push('</td></tr>');
                } else {
                    buf.push(result[0][1]);
                }
            } else {
                if (use_table) {
                    buf.push('<tr>');
                    for (i = 0, _len = result.length; i < _len; i++) {
                        width = result[i][0];
                        content = result[i][1];
                        span = width * 12 / total_width;
                        buf.push('<td colspan="' + span +
                        '" width="' + span * 100 / 12 + '%">' + content + '</td>');
                    }
                    buf.push('</tr>');
                } else {
                    buf.push('<div class="row">');
                    for (i = 0, _len = result.length; i < _len; i++) {
                        width = result[i][0];
                        content = result[i][1];
                        buf.push('<div class="col-sm-' + width * 12 / total_width + '">');
                        buf.push(content);
                        buf.push('</div>');
                    }
                    buf.push('</div>')
                }
            }
            this.buf.push(buf.join(''));
        },
        _process_column: function (col, cols_num, use_table) {

            if (col == "<empty>") {
                return [12 / cols_num, ""];
            }

            var field = this.fields[col];
            if (!field) throw 'Field ' + col + ' if not found';
            var col_w = field.colspan || 1;
            var col_width = col_w * 12 / cols_num;
            var div_attrs = {};
            var buf = [];

            if (use_table) {
                return [col_width, '<div class="table-field-row">' +
                this.field_to_label(field, this.options.readonly, use_table) +
                '<div class="table-field-col">' +
                this.field_to_html(field, this.options.readonly, use_table) +
                this.field_to_help_string(field) +
                '</div></div>']
            } else {
                div_attrs['class'] = this.options.layout.column_class;
                div_attrs['id'] = 'div_' + field.id;
                buf.push('<div ' + to_attrs(div_attrs) + '>');
                buf.push(this.field_to_label(field, this.options.readonly, use_table));
                buf.push(this.field_to_html(field, this.options.readonly, use_table));
                buf.push(this.field_to_help_string(field));
                buf.push('</div>');
                return [col_width, buf.join('')];
            }
        }

    }
    $.fn.formb = function (options) {
        var builder = new FormBuilder(this, options);
        return builder.init();
    }
    $.fn.formb_html = function (options) {
        var builder = new FormBuilder(this, options);
        return builder.html();
    }
    $.fn.formb.type_mapping = {
        str: 'str',
        unicode: 'str',
        select: 'select',
        text: 'text',
        lines: 'text',
        password: 'password',
        hidden: 'hidden',
        int: 'str',
        list: 'str',
        radios: 'radios',
        image: 'file',
        float: 'str',
        file: 'file',
        bool: 'checkbox',
        checkboxes: 'checkboxes',
        date: 'date',
        time: 'str',
        datetime: 'datetime',
        table: 'table'
    }
    $.fn.formb.converters = {
        str: str_convert,
        password: password_convert,
        hidden: hidden_convert,
        checkbox: checkbox_convert,
        file: file_convert,
        select: select_convert,
        text: text_convert,
        radios: radios_convert,
        checkboxes: checkboxes_convert,
        table: table_convert
    }
})(jQuery, window, document);

/**
 * JavaScript/CSS/LESS files $import utility
 *
 * Usage: $import (src[, srcN, ...][, callback])
 *
 * Where "src" is: "[name:type] url"
 *             OR: "[name] url"
 *             OR: "[:type] url"
 *             OR: "url"
 *
 * Where "type" is: "js" or "css" or "less"
 *
 * https://github.com/w3core/import.js/
 * @version 1.0.0
 * @license BSD License
 * @author Max Chuhryaev
 */
(new function (window, document) {

  var NODES = [], head = document.getElementsByTagName("head")[0];

  function on (event, node, fn, sign) { node.addEventListener(event, fn, sign) }
  function off (event, node, fn, sign) { node.removeEventListener(event, fn, sign) }
  function isEnum (o) {return o && typeof o == "object" && typeof o.length == "number" && !o.nodeName && o != window}

  function dispatch (event, data) {
    var e = document.createEvent("HTMLEvents");
    e.data = data;
    e.initEvent(event, true, true );
    return !document.dispatchEvent(e);
  }

  function parseString (s) {
    var v = /^(\s*\[\s*(\!?)\s*([a-zA-Z0-9\.\-_]*)\s*\:?\s*([a-zA-Z]*)\s*\])?\s*([^\s]+)\s*$/g.exec(s);
    var t = /^[^#?]+\.([a-zA-Z0-9]+)([?#].*)?$/g.exec(s);
    return v ? {
      reload: !!v[2],
      name: v[3] ? [v[3]] : [],
      type: v[4] || t ? (v[4] || t[1]).toLowerCase() : null,
      url: v[5]
    } : null;
  }

  function pushSrc (src, s) {
    var s = typeof s == "string" ? parseString(s) : s;
    if (s) {
      var done;
      for (var i=0; i<src.length; i++) {
        if (src[i].url == s.url) {
          if (s.reload) src[i].reload = !0;
          if (s.type && !src[i].type) src[i].type = s.type;
          if (s.name.length) {
            for (var j=0; j<s.name.length; j++) {
              if (src[i].name.indexOf(s.name[j]) < 0) src[i].name.push(s.name[j]);
            }
          }
          done = !0;
          break;
        }
      }
      if (!done) src.push(s);
    }
  }

  function parseArguments (o) {
    var callback = [], src = [], v;

    if (typeof o == "function") callback.push(o);
    else if (typeof o == "string") {
      v = o.split(",");
      for (var i=0; i<v.length; i++) pushSrc(src, v[i]);
    }
    else if (o && typeof o == "object") {
      var list = isEnum(o);
      for (var i in o) {
        v = parseArguments(o[i]);
        for (var s=0; s<v.src.length; s++) {
          if (!list) v.src[s].name.push(i);
          pushSrc(src, v.src[s]);
        }
        for (var c=0; c<v.callback.length; c++) callback.push(v.callback[c]);
      }
    }
    return {src:src, callback:callback};
  }

  function isTypeJS (type) {return !type || type == "js"}
  function tagByType (type) {return isTypeJS(type) ? "script" : "link"}
  function srcByType (type) {return isTypeJS(type) ? "src" : "href"}

  function load (inf, callback) {
    var img = document.createElement("img"),
       load = "load",
      error = "error",
         js = isTypeJS(inf.type),
       node = document.createElement(tagByType(inf.type));
    node.queue = [callback];
    node[srcByType(inf.type)] = inf.url;
    node[js?"type":"rel"] = js ? "text/javascript"
                          : inf.type == "less" ? "stylesheet/less"
                          : "stylesheet";
    var fn = function (e) {
      off(load, node, fn);
      off(error, node, fn);
      if (isEnum(node.queue) && node.queue.length) {
        while (node.queue.length > 0) {
          var callback = node.queue.shift();
          if (typeof callback == "function") callback(node, inf, e);
        }
      }
    };
    on(load, js?node:img, fn);
    on(error, js?node:img, fn);
    NODES.push(node);
    head.appendChild(node);
    if(!js) img.src = inf.url;
    return node;
  }

  function searchExists (type, url) {
    var attr = srcByType(type), list = document.getElementsByTagName(tagByType(type));
    for (var i=0; i<list.length; i++) {
      if (list[i][attr] == url) return list[i];
    }
  }

  function getExists (type, url) {
    var found = searchExists(type, url);
    if (found) {
      if (!isEnum(found.queue)) {
        found.queue = [];
        NODES.push(found);
      }
      return found;
    }
    else {
      var attr = srcByType(type);
      for (var i=0; i<NODES.length; i++) {
        if (NODES[i][attr] == url) return NODES[i];
      }
    }
  }

  function $import (src, callback) {
    var req = parseArguments([].slice.call(arguments));

    var src = req.src, callback = req.callback, done = 0;
    var reconnect = function (node) {
      if (!node.parentNode) head.appendChild(node);
      return node;
    };
    var exec = function () {
      for (var i=0; i<callback.length; i++) callback[i](src);
      for (var i=0; i<src.length; i++) {
        dispatch("@import", src[i]);
        for (var j=0; j<src[i].name.length; j++) dispatch("@import:" + src[i].name[j], src[i]);
      }
    };
    if (!src.length) return exec();
    var calc = function () {
      done++; if (done == src.length) exec();
    };
    for (var i=0; i<src.length; i++) {
      var type = src[i].type, url = src[i].url;
      var exists = getExists(type, url);
      if (exists) {
        src[i].node = reconnect(exists);
        if (exists.queue.length) exists.queue.push(calc);
        else calc();
      }
      else src[i].node = load(src[i], calc);
    }
  }

  window.$import = $import;
}(window, document));


/* =========================================================
 * bootstrap-pagination.js v1.0
 * =========================================================
 * Copyright limodou.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!
function($) {

  "use strict"

  /* MODAL CLASS DEFINITION
   * ====================== */

  var Pagination = function(content, options) {

      var that = this;
      this.options = options;

      this.$element = $(content).empty();
      var list = $('<ul class="pagination"/>').appendTo(this.$element);
      this.totalMessage = this.options.totalMessage ? $('<li class="disabled total"><a href="#"></a></li>') : '';
      this.btnFirst = this.options.first ? $('<li class="first"><a href="#">' + this.options.first + '</a></li>') : '';
      this.btnPrev = this.options.prev ? $('<li class="prev"><a href="#">' + this.options.prev + '</a></li>') : '';
      this.btnNext = this.options.next ? $('<li class="next"><a href="#">' + this.options.next + '</a></li>') : '';
      this.btnLast = this.options.last ? $('<li class="last"><a href="#">' + this.options.last + '</a></li>') : '';
      this.btnRefresh = this.options.last ? $('<li class="refresh"><a href="#">' + this.options.refresh + '</a></li>') : '';

      if (this.totalMessage) list.append(this.totalMessage);
      if (this.btnFirst && this.options.total>this.options.pageRows) list.append(this.btnFirst);
      if (this.btnPrev && this.options.total>this.options.pageRows) list.append(this.btnPrev);
      if (this.btnNext && this.options.total>this.options.pageRows) list.append(this.btnNext);
      if (this.btnLast && this.options.total>this.options.pageRows) list.append(this.btnLast);
      if (this.btnRefresh) list.append(this.btnRefresh);

      this.$element.on('click.pagination', 'li:enabled, li', function(e) {

        e.preventDefault();

        var $this = $(this);
        var list = that.$element.find('ul');

        if ($this.hasClass('prev')) {
          that.currentPage = parseInt(list.find('li.active a').text()) - 1;
        } else if ($this.hasClass('next')) {
          that.currentPage = parseInt(list.find('li.active a').text()) + 1;
        } else if ($this.hasClass('first')) {
          that.currentPage = 1;
        } else if ($this.hasClass('last')) {
          that.currentPage = that.totalPages;
        } else if ($this.hasClass('refresh')) {
          that.currentPage = parseInt(list.find('li.active a').text());
        } else {
          that.currentPage = parseInt($this.text());
        }

        if (!$this.hasClass('disabled')) {
          that.load(--that.currentPage);
        }

      });

    }

  Pagination.prototype = {

    constructor: Pagination,
    show: function(total, start) {
      this.options.start = start || this.options.start;
      this.options.total = total || this.options.total;
      this.currentPage = this.options.start - 1;
      this.totalPages = parseInt(this.options.total / this.options.pageRows);
      if (this.options.total % this.options.pageRows > 0) this.totalPages++;
      if (this.totalMessage){
        var msg = this.options.totalMessage.replace('$pages', this.totalPages);
        msg = msg.replace('$records', this.options.total);
        this.totalMessage.html('<a href="#">'+msg+'</a>');
      }
      navigate.call(this, this.currentPage);
      if (this.options.initLoad) {
        this.load(this.currentPage);
      }
    },
    load: function(page) {
      navigate.call(this, page);
      if (this.options.onChange) {
        this.options.onChange((this.currentPage + 1));
      }
    }
  }

  /* MODAL PRIVATE METHODS
   * ===================== */

  function _buildNavigation(startPage) {

    var s = this.options;
    var self = this;
    var list = this.$element.find('ul');

    if (s.total <= s.pageRows) return;

    var target = list.find('li:last');
    if (this.btnLast) target = target.prev();

    for (var i = startPage; i < startPage + s.length; i++) {
      if (i == this.totalPages) break;
      var li = $('<li class="page"/>').insertBefore(target).append($('<a>').attr('rel', (i + 1)).attr('href', '#').text(i + 1));
    }
  }

  function navigate(topage) {

    var s = this.options;
    var list = this.$element.find('ul');
    list.find('li.page').remove();
    var index = topage;
    var mid = s.length / 2;
    if (s.length % 2 > 0) mid = (s.length + 1) / 2;
    var startIndex = 0;
    if (topage >= 0 && topage < this.totalPages) {
      if (topage >= mid) {
        if (this.totalPages - topage > mid) startIndex = topage - (mid - 1);
        else if (this.totalPages > s.length) startIndex = this.totalPages - s.length;
      }
      _buildNavigation.call(this, startIndex);
      list.find('li').removeClass('active');
      list.find('li a[rel=' + (index + 1) + ']').parent().addClass('active');
    }

    _showRequiredButtons.call(this);

  }

  function _showRequiredButtons() {
    var s = this.options;
    if (this.totalPages > 1) {
      if (this.currentPage > 0) {
        if (this.btnPrev) this.btnPrev.removeClass('disabled');
        if (this.btnFirst) this.btnFirst.removeClass('disabled');
      } else {
        if (this.btnPrev) this.btnPrev.addClass('disabled');
        if (this.btnFirst) this.btnFirst.addClass('disabled');
      }

      if (this.currentPage == this.totalPages - 1) {
        if (this.btnNext) this.btnNext.addClass('disabled');
        if (this.btnLast) this.btnLast.addClass('disabled');
      } else {
        if (this.btnNext) this.btnNext.removeClass('disabled');
        if (this.btnLast) this.btnLast.removeClass('disabled');
      }
    } else {
      if (this.btnPrev) this.btnPrev.addClass('disabled');
      if (this.btnNext) this.btnNext.addClass('disabled');
      if (this.btnFirst) this.btnFirst.addClass('disabled');
      if (this.btnLast) this.btnLast.addClass('disabled');
    }
  }


  /* MODAL PLUGIN DEFINITION
   * ======================= */

  $.fn.pagination = function(option) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    return this.each(function() {
      var $this = $(this),
        data = $this.data('pagination'),
        options = $.extend({}, $.fn.pagination.defaults, typeof option == 'object' && option);
      if (!data) $this.data('pagination', (data = new Pagination(this, options)));
      if (typeof option == 'string') data[option].apply(data, args);
    })
  }

  $.fn.pagination.defaults = {
    total: 0,
    pageRows: 0,
    length: 10,
    next: 'Next',
    prev: 'Prev',
    first: 'First',
    last: 'Last',
    start: 1,
    totalMessage: 'Total $pages pages / $records records', //if not then doesn't display at all
    initLoad: false,
    onChange: null
  }

  $.fn.pagination.Constructor = Pagination;

}(window.jQuery);


/*
 * $.query_string
 */

(function ($) {
    QueryString = function (url) {
        this.urlParams = {};
        this.load(url);
    }
    QueryString.prototype = {
        load: function (param) {
            this.urlParams = {};
            this.url = param;
            var e, k, v, i,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {
                    return decodeURIComponent(s.replace(a, " "));
                }
            if (!param) {
                param = window.location.search;
            }
            if (param.charAt(0) == '?') {
                param = param.substring(1);
                this.url = '';
            } else {
                i = param.indexOf('?');
                if (i > -1) {
                    this.url = param.substring(0, i);
                    param = param.substring(i + 1);
                } else
                    param = '';
            }
            while (e = r.exec(param)) {
                k = d(e[1]);
                v = d(e[2]);
                this.set(k, v, false);
            }
            return this;
        },
        toString: function (options) {
            var settings = {
                'hash': false,
                'traditional': true
            };
            if (options) {
                $.extend(settings, options);
            }
            var old = jQuery.ajaxSettings.traditional;
            jQuery.ajaxSettings.traditional = settings.traditional;
            var result = '?' + $.param(this.urlParams);
            jQuery.ajaxSettings.traditional = old;
            if (settings.hash)
                result = result + window.location.hash;
            return result;
        },
        merge: function (data) {
          for(var k in data) {
            if (k[0] == '-') //first char is '-' means this key will be removed
              this.remove(k.substr(1))
            else {
              this.set(k, data[k], true)
            }
          }
          return this
        },
        set: function (k, v, replace) {
            replace = replace || false;
            if (replace)
                this.urlParams[k] = v;
            else {
                if (k in this.urlParams) {
                    if ($.type(this.urlParams[k]) === 'array') {
                        this.urlParams[k].push(v);
                    }
                    else {
                        if (this.urlParams[k] == '')
                            this.urlParams[k] = v;
                        else
                            this.urlParams[k] = [this.urlParams[k], v];
                    }
                }
                else
                    this.urlParams[k] = v;
            }
            return this;
        },
        get: function (k) {
            return this.urlParams[k];
        },
        remove: function (k) {
            if (k in this.urlParams) {
                delete this.urlParams[k];
            }
            return this;
        }
    }
    $.query_string = new QueryString();
})(jQuery);

function get_url(url, data) {
  var query = new QueryString(url)
  query.merge(data)
  return query.url+query.toString()
}

/*
 * 生成树弹出框
 * target 目标元素
 * url 后台路径
 */
function tree_select(target, url, options) {
    load('ui.popover', function(){
        var default_setting = {
            content:function(data){
                var begin, end;
                begin = data.indexOf('<!-- form -->')
                end = data.indexOf('<!-- end form -->')
                if (begin > -1 && end > -1){
                    return data.substring(begin, end);
                }
                return data;
            },
            async: {
                success: function(that){
                    that.getContentElement().on('success.form', function(e, data){
                        that.hide();
                    });
                }
            },
            title: '',
            width:400,
            arrow:false,
            cache:false,
            height:'auto',
            padding:true,
            closeable:true,
            type:'async',
            url:url,
            delay:50
        }
        var opts = $.extend({}, default_setting, options || {})
        $(target).webuiPopover(opts);
    })
}