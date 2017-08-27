

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
            dataType: 'json',
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
 * options:
 *  Callback:
 *   onBeforeSubmit
 *   onUpdated after updated content from remove
 *   onOk if set, use should submit himself
 *  Property:
 *   fieldOptions used to render widget
 *     eg: {'date':
              option: {
                format: 'YYYY-MM-DD hh:mm:ss',
                showTime:true,
                use24hour:true
              },
              render: function
          }
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
                form_widgets(form, options.fieldOptions)

              //处理表单校验
              if (!options.disableValidate)
                dialog_validate_submit(dialog, {ajax_submit:dialog_ajax_submit, onBeforeSubmit:onBeforeSubmit})

              //add onUpdated callback
              if (options.onUpdated)
                options.onUpdated(dialog, dialog.getModalBody()) //content
            }
          })

          return content
      },
      draggable: true,
      closeByBackdrop: false
    }, opts;
    opts = $.extend(true, {}, default_opts, options)
    var  okButton = {
        label: opts.okLabel===undefined ? '确定' : opts.okLabel,
        id: 'btnSave',
        cssClass: 'btn-primary btn-flat',
//        hotkey: 13,
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
  var opts
  load('ui.bootstrap.dialog', function(){
    if (message instanceof Object){
      opts = message
    } else {
      opts = {
        title: '确认',
        message: message,
        callback: callback,
        btnCancelLabel: '取消',
        btnOKLabel: '确定'
      }
    }
    BootstrapDialog.confirm(opts);
  })
}

function Alert(message, callback) {
  var opts
  load('ui.bootstrap.dialog', function(){
    if (message instanceof Object){
      opts = message
    } else {
      opts = {
        title: '消息',
        message: message,
        callback: callback,
        btnOKLabel: '确定'
      }
    }
    BootstrapDialog.alert(opts);
  })
}
