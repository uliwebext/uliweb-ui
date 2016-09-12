(function(factory) {
        if (typeof define === "function" && define.amd) {
            define(["jquery", "jqvalidation"], factory);
        } else {
            factory(jQuery);
        }
    })(function($) {

        //表单验证用共同属性
        var validOptions = {
            errorElement: "div",
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                error.appendTo($(element).closest(".validDiv"));
                $(element).parent().addClass("has-error");
            },
            ignore: "",
            highlight: function(element) {},
            unhighlight: function(element) {},
            success: function(label, element) {
                label.remove();
                $(element).parent().removeClass('has-error').addClass("has-success");
            }
        };

        $.extend(true, $.validator, {
            defaults: validOptions
        });

        //手机验证
        $.validator.addMethod('mobile', function(value, element) {
            // /^1\d{10}$/ 来自支付宝的正则
            return this.optional(element) || /^1\d{10}$/.test(value);
        }, '请输入正确的手机号码');

        //国内固话
        $.validator.addMethod('telphoneCN', function(value, element) {
            // /^1\d{10}$/ 来自支付宝的正则
            return this.optional(element) || /^0\d{2,3}-?\d{7,8}$/.test(value);
        }, '请输入正确的固定电话号码');

        //电话
        $.validator.addMethod('telphone', function(value, element) {
            // /^1\d{10}$/ 来自支付宝的正则
            return this.optional(element) || !(/[^0-9\-]/.test(value));
        }, '请输入正确的电话号码');

        //金额
        $.validator.addMethod('cash', function(value, element) {
            return this.optional(element) || !(/^\d+\.\d{1,2}$/.test(value));
        }, '请输入正确的金额');
    });