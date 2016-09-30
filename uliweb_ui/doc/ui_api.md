# uliweb-ui api doc

## load

```
load(module, callback)
```

用来实现异步靜态模块装入。

_module_ 可以是：

* 单个模块名，如： 'ui.riot'
* 模块数组，如： ['ui.riot', 'ui.rgrid']
* 服务器绝对路径，如： ["/static/jsmodules.js"]

_callback_ 是一个回调，用于当静态资源装入完毕后执行。


## show_message

```
show_message(message, category)
```

显示一个消息框，

_message_ 用于显示的消息

_category_ 消息类型：'success', 'error', 'info', 'warning'

## popup_info

```
popup_info(target, url, options)
```

在target上绑定tip事件响应，显示url返回的内容，可以向 `options` 中传入额外的参数 `parameters`
