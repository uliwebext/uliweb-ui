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

var i18n = { // 本地化
    previousMonth : '上个月',
    nextMonth   : '下个月',
    months      : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    weekdays    : ['周日','周一','周二','周三','周四','周五','周六'],
    weekdaysShort : ['日','一','二','三','四','五','六']
}

var widgets_mapping = {
    date: function(el, options){
        load(['ui.moment', 'ui.pikaday'], function(){
            var opts = {format: 'YYYY-MM-DD', showTime:false, i18n:i18n};
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
            simple_select2(el, options)
        });
    },
    datetime: function(el, options){
        load(['ui.moment', 'ui.pikaday'], function(){
            var opts = {format: 'YYYY-MM-DD HH:mm:ss', showTime:true,
              use24hour:true, i18n:i18n};
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

function register_widgets(name, render) {
  widgets_mapping[name] = render
}

/*
 * options:
 *   name: {
 *     render: function(element)
 *     option: render parameter used for default render function
 *   }
 */
function form_widgets(target, options) {
    options = options || {}
    var form = $(target);
    var _type, element, opts, func, param, render, name;
    form.find('[widget]').each(function (index, el) {
        element = $(el);
        name = element.attr('name')
        _type = element.attr('widget');
        field_opt = options[name]
        render = field_opt && field_opt.render
        if (render) render.call(target, element)
        else {
          func = widgets_mapping[_type];
          if (func) {
            param = field_opt && field_opt.option || {}
              func(element, param);
          }
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
