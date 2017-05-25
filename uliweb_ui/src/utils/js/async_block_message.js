/*
 *   异步轮询的Api, 显示遮罩，定时访问后台处理逻辑，
 *   如果成功或者失败，则去除遮罩， 设置超时时间， 如果超时，则显示特定错误信息
 *   调用后台处理逻辑可以返回三种状态 status: 'SUCCESS', 'STARTING', 'FAIL',
 *   分别表示成功，处理中，失败
 *   @param options:
 *       object {
 *          url: 用于轮询异步任务后台任务对应的url,
 *          data: 需要传递给后台的参数
 *          timeout: 超时时间timeout，
 *          message: 显示在遮罩上的信息,
 *          successMessage: 任务成功时显示的消息，也可以由后台返回,
 *          failMessage: 任务失败时显示的消息， 也可以由后台返回,
 *          timeoutMessage: 任务超时时显示的消息, 也可以由后台返回,
 *          css: 遮罩的样式,
 *          onSuccess: 成功的回调函数
 *          error: 失败的回调函数
 *        }
 *       string: url 轮询URL
 *   @onSuccess 用于成功后的回调处理
 */
var async_block_message = function (options, onSuccess) {

  load('ui.blockUI', function() {
    // times表示循环次数， url对应异步轮询的后台处理逻辑， timeout对应轮询超时时间
    var times = 0, url = '', timeout = 300;
    options = options || {};
    if (typeof options === 'string') {
        options = {url: options};
    }
    onSuccess = onSuccess || options.onSuccess;
    // 默认参数
    var _defaults  = {
        url: url,
        data: {},
        timeout: timeout,
        message: '正在处理请稍候...',
        successMessage: '处理成功',
        failMessage: '任务失败，如有需要请与管理员联系',
        timeoutMessage: '处理时间过长，如有需要请与管理员联系',
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '5px',
            '-moz-border-radius':  '5px',
            opacity: .5,
            color: '#fff'
        }
    }

    /**
    *后台轮询异步任务执行情况
    */
    function check_async() {
        $.get(opts.url, opts.data).success(function(data){
            if (data.status == 'SUCCESS') {
                //任务成功执行
                if (onSuccess && (typeof onSuccess === "function")) {
                    onSuccess(data);
                }
                $.unblockUI({fadeout:200});
                show_message(data.message || opts.successMessage);
            } else if (data.status == 'STARTING') {
                //任务正在处理中
                times ++;
                if (times > opts.timeout) {
                    show_message(data.message || opts.timeoutMessage,'error');
                    $.unblockUI({fadeout:200});
                    return;
                } else{
                    setTimeout(check_async, 5000);
                }
            } else {
                //失败时的处理情况
                if (opts.error && (typeof opts.error === "function")) {
                    opts.error(data);
                }
                show_message(data.message || opts.failMessage,'error');
                $.unblockUI({fadeout:200});
                return;
            }

       });
    }

    //和输入参数合并后组成的最终参数表
    var opts = $.extend(true, {}, _defaults, options);

    //显示遮罩
    $.blockUI({
        css: opts.css,
        message: opts.message
    });
    times = 0;
    check_async();

  })
}
