define('jquery', function(){
return window.jQuery;
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
"baseUrl": "/static",
"paths": {
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
"handsontable":"modules/handsontable/handsontable.full.min",
"toastr":"modules/jquery.toastr/toastr.min"
},
map: {
'*': {
'css': 'modules/requirejs/plugins/css'
}
},
"shim": {

"select2":{"exports":"jQuery.fn.select2","deps":["css!modules/select2/select2","css!modules/select2/select2-bootstrap3"]},
"mmgrid":{"exports":"jQuery.fn.mmGrid","deps":["css!modules/mmgrid/mmGrid","mmpaginator","scrolling"]},
"mmpaginator":{"exports":"jQuery.fn.mmPaginator","deps":["css!modules/mmgrid/mmPaginator"]},
"mmtreegrid":{"exports":"jQuery.fn.mmGrid","deps":["mmgrid","css!modules/mmgrid/mmTreeGrid"]},
"pikaday":{"deps":["css!modules/pikaday/pikaday"]},
"handsontable":{"deps":["css!modules/handsontable/handsontable.full.min"]},
"toastr":{"deps":["css!modules/jquery.toastr/toastr.min"]}
},
urlArgs: get_static_version()
});
