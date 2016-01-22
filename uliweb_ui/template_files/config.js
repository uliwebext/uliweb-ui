define('jquery', function(){
    return window.jQuery;
});
define('jquery.ui.widget', function(){
//    return window.jQuery;
});
define('bootstrap', function(){
//    return window.jQuery;
});

function get_static_version() {
    var scripts = document.getElementsByTagName('scripts'),
        ver = '';
    for (i = scripts.length - 1; i > -1; i -= 1) {
        ver = script.getAttribute('v');
        if(ver) {
            return ver;
        }
    }
    return ver
}

requirejs.config({
    baseUrl: "/static",
    paths: {
        css: 'modules/requirejs/plugins/css',
        text: 'modules/requirejs/plugins/text',
        domReady: 'modules/requirejs/plugins/domReady',
        json: 'modules/requirejs/plugins/json',
        image: 'modules/requirejs/plugins/image',
        //--------------------------------------
        {{
        import os
        s = []
        _modules = {}
        for _name, _v in modules.items():
            if 'path' in _v:
                s.append('"{}":"{}"'.format(_name, _v['path']))
                _modules[_name] = os.path.dirname(_v['path'])
            pass
        pass}}
        {{=',\n'.join(s)}}
    },
    shim: {
        {{s = []
        for _name, _v in modules.items():
            if 'shim' in _v:
                if 'deps' in _v['shim']:
                    _v['shim']['deps'] = [x.format(**_modules) for x in _v['shim']['deps']]
                pass
                s.append('"{}":{}'.format(_name, json_dumps(_v['shim'])))
            pass
        pass}}
        {{=',\n'.join(s)}}
    },
    urlArgs: get_static_version()
});
