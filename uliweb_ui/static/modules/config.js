define('jquery', function(){
    return window.jQuery;
});
define('jquery.ui.widget', function(){
// return window.jQuery;
});
define('bootstrap', function(){
// return window.jQuery;
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

        "select2":"modules/select2/select2",
        "scrolling":"modules/mmgrid/scrolling",
        "mmgrid":"modules/mmgrid/mmGrid",
        "mmpaginator":"modules/mmgrid/mmPaginator",
        "mmtreegrid":"modules/mmgrid/mmTreeGrid",
        "pjax":"modules/jquery.pjax",
        "jquery.validation":"modules/jquery.validation/jquery.validate.min",
        "moment":"modules/moment-with-locales.min",
        "pikaday":"modules/pikaday/pikaday",
        "pikaday.jquery":"modules/pikaday/plugins/pikaday.jquery",
        "handsontable":"modules/handsontable/handsontable.full.min",
        "toastr":"modules/jquery.toastr/toastr.min",
        "jquery.form":"modules/jquery.form",
        "popover":"modules/webui_popover/jquery.webui-popover.min",
        "jquery.confirm":"modules/jquery-confirm/jquery-confirm.min",
        "bootstrap-dialog":"modules/bootstrap-dialog/bootstrap-dialog.min",
        "jquery.dialog2":"modules/jquery.dialog2/jquery.dialog2",
        "jquery.fileupload":"modules/jquery.fileupload/jquery.fileupload",
        "avalon":"modules/avalon/1.4.7.1/avalon.shim",
        "jquery.toggler":"modules/jquery.toggler/jquery-toggler",
        "jquery.cookie":"modules/jquery-cookie/jquery.cookie",
        "jstree":"modules/jstree/jstree.min",
        "layer":"modules/layer/layer",
        "codemirror":"modules/codemirror/codemirror",
        "prgressbar":"modules/bootstrap-progressbar/bootstrap-progressbar.min",
        "tagsinput":"modules/bootstrap-tagsinput/bootstrap-tagsinput",
        "combotree":"modules/combotree/combotree",
        "Chart":"modules/Chart.js/Chart.min"
    },
    shim: {
        "select2":{"exports":"jQuery.fn.select2","deps":["css!modules/select2/select2","css!modules/select2/select2-bootstrap3"]},
        "mmgrid":{"exports":"jQuery.fn.mmGrid","deps":["css!modules/mmgrid/mmGrid","mmpaginator","scrolling"]},
        "mmpaginator":{"exports":"jQuery.fn.mmPaginator","deps":["css!modules/mmgrid/mmPaginator"]},
        "mmtreegrid":{"exports":"jQuery.fn.mmGrid","deps":["mmgrid","css!modules/mmgrid/mmTreeGrid"]},
        "pikaday":{"deps":["css!modules/pikaday/pikaday"]},
        "pikaday.jquery":{"deps":["pikaday"]},
        "handsontable":{"deps":["css!modules/handsontable/handsontable.full.min"]},
        "toastr":{"deps":["css!modules/jquery.toastr/toastr.min"]},
        "popover":{"deps":["css!modules/webui_popover/jquery.webui-popover.min"]},
        "jquery.confirm":{"deps":["css!modules/jquery-confirm/jquery-confirm.min"]},
        "bootstrap-dialog":{"deps":["css!modules/bootstrap-dialog/bootstrap-dialog.min"]},
        "jquery.dialog2":{"exports":"jQuery.fn.dialog2","deps":["modules/jquery.dialog2/jquery.controls","css!modules/jquery.dialog2/jquery.dialog2"]},
        "jquery.fileupload":{"deps":["css!modules/jquery.fileupload/jquery.fileupload","modules/jquery.fileupload/jquery.iframe-transport"]},
        "jstree":{"deps":["css!modules/jstree/themes/default/style.min"]},
        "layer":{"exports":"layer","deps":["css!modules/layer/skin/layer"]},
        "codemirror":{"deps":["modules/codemirror/mode/xml/xml","modules/codemirror/addon/selection/active-line","css!modules/codemirror/codemirror"]},
        "prgressbar":{"deps":["css!modules/bootstrap-progressbar/bootstrap-progressbar-3.3.0.min"]},
        "tagsinput":{"exports":"jQuery.fn.tagsinput","deps":["css!tagsinput"]},
        "combotree":{"export":"jQuery.fn.combotree","deps":["jstree","tagsinput"]}
    },
    urlArgs: get_static_version()
});
