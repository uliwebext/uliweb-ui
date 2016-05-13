(function(factory) {
    "use strict";
    if ("function" === typeof define && define.amd) {
        define(["jquery"], factory);
    } else if ("object" === typeof exports) {
        factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function($, undefined) {
    "use strict";
    $.fn.combotree = function(options) {
        var is_method = (typeof options === 'string'),
            args = Array.prototype.slice.call(arguments, 1),
            $this = $(this),
            that = this;

        //没有选择对象时返回false
        if (!this.length) {
            return false;
        }

        //获取实例和方法
        var instance = $this.data("combotree"),
            method = instance && is_method ? instance[options] : null;

        //返回方法操作
        if (method) {
            return method.apply(instance, args);
        }

        //如果没有参数返回实例
        if (options === undefined) {
            return instance;
        } else {
            $this.data("jstree") && $this.data("jstree").destroy();
            $this.data("tagsinput") && $this.data("tagsinput").destroy();
            $this.parent().find(">input,.bootstrap-tagsinput,.input-group-addon").off(".combotree");
            $this.siblings('.select-picker').remove();
            $(document).off(".combotree."+$this.prop("id"));
        }

        var v, to = false,
            r, tree, flag,
            id = $this.prop("id"),

            //默认参数
            defultOptions = {
                search: true,
                searchOptions: false,
                searchDelay: 300,
                placeholder: "筛选",
                partid: false,
                tags: {
                    freeInput: false,
                    tagClass: "label label-sm default-tag",
                    itemValue: 'id',
                    itemText: 'text'
                },
                tree: {
                    "core": {
                        "strings": {
                            "Loading ...": "正在加载 ..."
                        },
                        "multiple": false,
                        "themes": {
                            "responsive": false
                        },
                        // so that create works
                        "check_callback": true
                    },
                    "types": {
                        "default": {
                            "icon": "fa fa-folder text-primary fa-lg"
                        },
                        "user": {
                            "icon": "fa fa-user text-primary fa-lg"
                        }
                    },
                    "state": "closed", // or "open"
                    "search": {
                        "show_only_matches": true
                    },
                    "checkbox": {
                        "three_state": false
                    },
                    "plugins": ["search", "types", "checkbox"]
                },
                "inputClass": "",
                "selectClass": "",
                "loadComplete": false
            },

            //合并设置参数
            settings = $.extend(true, {}, defultOptions, $this.data(), options),

            str = '<div class="select-picker">' +
            '<input type="text" placeholder="' + settings.placeholder + '">' +
            '<div><div role="tree">' +
            '</div></div>' +
            '</div>',

            picker = $this.siblings(".select-picker").length == 0 ? $(str) : $this.siblings(".select-picker");

        if ($.isFunction(settings.tree.core.newData)) {
            settings.tree.core.data = function(obj, callback) {
                return settings.tree.core.newData(obj, settings.param, callback, $this, settings);
            }
        }

        $this.prop("readonly", "true");
        $this.addClass("combotree");
        $this.css("background-color", "transparent");

        if (settings.tree.core.multiple) {
            $this.tagsinput(settings.tags);
            $this.siblings(".bootstrap-tagsinput").find("input").css({
                width: "0"
            });
        }

        //picker.css({"min-width": $this.parent().width(), "top": $this.parent().height()});
        //
        //$this.on("change", function () {
        //    picker.css({"top": $this.parent().height()});
        //});


        $("input", picker).addClass(settings.inputClass);
        $("div[role=tree]", picker).addClass(settings.selectClass);

        if ($this.siblings(".select-picker").length == 0) {
            $this.after(picker);
        }

        picker.hide();

        $this.parent().find(">:not(.select-picker)").on("click.combotree."+$this.prop("id"), function(e) {
            picker.css("min-width", $this.parent().outerWidth());
            // picker.css("width", $this.parent().outerWidth());
            // if ($this.offset().top + picker.height() > $(window).height() && $this.offset().top - picker.height() > 0) {
            //     picker.css("bottom", $this.parent().height());
            //     picker.css("top", "initial");
            // } else {
                picker.css("top", $this.outerHeight());
                picker.css("bottom", "initial");
            // }

            picker.css("max-width", $(window).width() - $this.offset().left - 10);

            if ($(document).find($(e.target)).length != 0) {
                var selectNode = tree.get_node(tree.get_selected()[0], true);

                picker.toggle();
                if ($(picker).is(":visible")) {
                    $("input", picker).focus();
                }

                if (selectNode && !picker.is(":hidden") && selectNode.offset() && $(">div", picker).offset()) {
                    $(">div", picker).scrollTop(0);
                    $(">div", picker).scrollTop(selectNode.offset().top - $(">div", picker).offset().top);
                }
            }

            // e.stopImmediatePropagation();
            //$("input", picker).focus();
        });


        //区域外点击隐藏picker
        $(document).on('mousedown.combotree.'+$this.prop("id"), function(e) {
            var $target = $(e.target),
                $select = $target.closest('.input-group').find('.select-picker');
            if ($select[0] != picker[0]) {
                picker.hide();
            }
        });


        this._getText = function() {
            var node = tree.get_selected(true);
            $this.data("value", tree.get_selected().join());
            var list = $($.map(node, function(item) {
                return item.text;
            })).get();
            $this.val(list.join());
        };


        $("div[role=tree]", picker).jstree(settings.tree).on("select_node.jstree", function(e, data) {

            if (settings.tree.core.multiple) {
                var len = $this.tagsinput("items").length;
                $this.tagsinput("add", data.node);
            } else {
                $this.data("value", data.node.id);
                $this.val(data.node.text).trigger("change");
                if (!flag) {
                    picker.hide();
                }
                $this.trigger("blur");
            }
        }).on("deselect_node.jstree", function(e, data) {
            if (settings.tree.core.multiple) {
                if (!flag) {
                    $this.tagsinput("remove", data.node);
                }
            } else {
                $this.data("value", "");
                $this.val("").trigger("change");
            }
            flag = false;
        }).on("deselect_all.jstree", function() {
            if (settings.tree.core.multiple) {
                $this.tagsinput("removeAll");
            }

            $this.data("value", "");
            $this.val("");
        }).on("load_node.jstree", function() {
            flag = true;
            $(this).jstree("select_node", $this.data("value") && $this.data("value").toString().split(","));
            flag = false;
            if ($.isFunction(settings.loadComplete)) {
                settings.loadComplete.call(this, settings);
            }
        });

        tree = $("div[role=tree]", picker).data('jstree');

        $this.on('beforeItemRemove', function(event) {
            flag = true;
            if (tree.get_selected().length == $this.tagsinput("items").length) {
                tree.get_node(event.item) ? tree.uncheck_node(event.item) : true;
            }
        });

        $this.on('itemAdded itemRemoved', function(event) {
            that._getText();
        });

        if (!settings.search) {
            $("input", picker).hide();
        } else {
            $("input", picker).keyup(function() {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function() {
                    if (!(v + $("input", picker).val()).trim() == "") {
                        v = $("input", picker).val().trim();
                        if (!settings.searchOptions) {
                            tree.search(v);
                        } else {
                            if (settings.tree.core.multiple) {
                                tree.deselect_all();
                            }
                            if (v != "") {
                                if ($.isFunction(settings.searchOptions)) {
                                    settings.searchOptions(v, settings.param, function(data) {
                                        tree.settings.core.data = data;
                                        tree.refresh(true, true);
                                    });
                                }
                            } else {
                                tree.settings.core.data = settings.tree.core.data;
                                tree.refresh(true, true);
                            }
                        }
                    }
                }, settings.searchDelay);
            });
        }

        this.clear = function() {
            tree.deselect_all(true);
            $this.tagsinput("removeAll");

            return this;
        };

        this.setCheck = function(v) {
            var t = v ? v : $this.data("value");
            if (tree.get_node(t)) {
                tree.deselect_all(true);
            }
            if (t) {
                tree.select_node(t.toString().split(","));
            }
            return this;
        };

        this.setValue = function(obj) {
            var textList = [];
            var valueList = [];
            if (settings.tree.core.multiple) {
                $.each(obj, function() {
                    textList.push(this.text);
                    valueList.push(this.id);
                    $this.tagsinput("add", this);
                });
                $this.data("value", valueList.join(","));
                $this.val(textList.join(","));
            } else if (typeof(obj) === "object" && !$.isArray(obj)) {
                $this.val(obj.text);
                $this.data("value", obj.id);
            }
            this.setCheck();
            return this;
        };

        this.getValue = function(full) {
            return tree.get_selected(full);
        };

        $this.data("jstree", tree);
        $this.data("combotree", this);

        return this;
    };

    //根据机构编号查人员
    var sigleEmpe = {
        param: "0",
        searchOptions: function(value, param, callbak) {

            var inputkey;
            if (value != "#") {
                inputkey = value;
            }
            var reqData = {
                usrNm: inputkey,
                SN: param
            };
            var req = P2.simpleTx("A09021104", reqData);
            var that = this;
            req.success(function(result) {

                var empeJson = [];
                var empeVdos = result["EMPE_GRP"] && result["EMPE_GRP"]["EMPE_VDO"];

                if (empeVdos) {
                    for (var i = 0; i < empeVdos.length; i++) {
                        if (!empeVdos[i]["CCB_EMPID"]) continue;
                        var tmp = {}
                        tmp["id"] = empeVdos[i]["BLNG_INST_ID"] + "|" + empeVdos[i]["CCB_EMPID"];
                        tmp["text"] = empeVdos[i]["USR_NM"];
                        tmp["title"] = empeVdos[i]["USR_ID_LAND_NM"] + "(" + empeVdos[i]["WRK_UNIT_NM"] + ")";
                        tmp["data"] = empeVdos[i];
                        tmp["type"] = 'user';

                        empeJson.push(tmp);
                    }
                }

                callbak.call(that, empeJson);
            });
        },
        tree: {
            "core": {
                newData: function(node, rootId, callback) {
                    var nodeId = rootId;
                    if (node.id != "#") {
                        nodeId = node.data.SN;
                    }

                    var reqData = {
                        blngInsId: nodeId
                    };
                    var req = P2.simpleTx("A09021103", reqData);
                    var that = this;
                    req.success(function(result) {
                        var empeJson = [];
                        var empeVdos = result["EMPE_GRP"] && result["EMPE_GRP"]["EMPE_VDO"];
                        var depVdos = result["CCBINS_GRP"] && result["CCBINS_GRP"]["CCBINS_VDO"];

                        if (empeVdos) {
                            for (var i = 0; i < empeVdos.length; i++) {
                                if (!empeVdos[i]["CCB_EMPID"]) continue;
                                var tmp = {}
                                tmp["id"] = empeVdos[i]["BLNG_INST_ID"] + "|" + empeVdos[i]["CCB_EMPID"];
                                tmp["text"] = empeVdos[i]["USR_NM"];
                                tmp["title"] = empeVdos[i]["USR_ID_LAND_NM"];
                                tmp["data"] = empeVdos[i];
                                tmp["type"] = 'user';

                                empeJson.push(tmp);
                            }
                        }

                        if (depVdos) {
                            for (var i = 0; i < depVdos.length; i++) {
                                if (!depVdos[i]["CCBINS_ID"]) continue;
                                var tmp = {}
                                tmp["id"] = depVdos[i]["CCBINS_ID"];
                                tmp["text"] = depVdos[i]["CCBINS_CHN_FULLNM"];
                                tmp["data"] = depVdos[i];
                                tmp["children"] = true;
                                tmp["state"] = {
                                    "disabled": true
                                }

                                empeJson.push(tmp);
                            }
                        }

                        callback.call(that, empeJson);
                    });
                }
            }
        }
    };

    var multiEmpe = $.extend(true, {}, sigleEmpe, {
        tree: {
            core: {
                multiple: true
            }
        }
    });

    //根据编号查询自机构
    var sigleDep = {
        param: {
            rootId: "0"
        },
        searchOptions: function(value, param, callbak) {

            var inputkey;
            if (value != "#") {
                inputkey = value;
            }
            var reqData = {
                ccbInsChnFullNm: inputkey,
                SN: param.rootId||'0',
                tpCds: param.tpCds
            };
            var req = P2.simpleTx("A09021102", reqData);
            var that = this;
            req.success(function(result) {

                var depJson = [];
                var ccbInsVdos = result["CCBINS_GRP"] && result["CCBINS_GRP"]["CCBINS_VDO"];

                if (ccbInsVdos) {
                    for (var i = 0; i < ccbInsVdos.length; i++) {
                        if (!ccbInsVdos[i]["CCBINS_ID"]) continue;
                        var tmp = {}
                        tmp["id"] = ccbInsVdos[i]["CCBINS_ID"];
                        tmp["text"] = ccbInsVdos[i]["CCBINS_CHN_FULLNM"];
                        tmp["data"] = ccbInsVdos[i];

                        depJson.push(tmp);
                    }
                }

                callbak.call(that, depJson);
            });
        },
        tree: {
            "core": {
                newData: function(node, param, callback) {
                    var nodeId;

                    if (param.rootId) {
                        nodeId = param.rootId||'0';
                    }
                    if (node.id != "#") {
                        nodeId = node.data.SN;
                    }

                    var reqData = {
                        primCCBInsId: nodeId,
                        tpCds: param.tpCds
                    };
                    var req = P2.simpleTx("A09021101", reqData);
                    var that = this;
                    req.success(function(result) {
                        var depJson = [];
                        var ccbInsVdos = result["CCBINS_GRP"] && result["CCBINS_GRP"]["CCBINS_VDO"];

                        if (ccbInsVdos) {
                            for (var i = 0; i < ccbInsVdos.length; i++) {
                                if (!ccbInsVdos[i]["CCBINS_ID"]) continue;
                                var tmp = {}
                                tmp["id"] = ccbInsVdos[i]["CCBINS_ID"];
                                tmp["text"] = ccbInsVdos[i]["CCBINS_CHN_FULLNM"];
                                tmp["data"] = ccbInsVdos[i];

                                if (ccbInsVdos[i]["HAS_SUB_CCBINS"] != '0' && nodeId) {
                                    tmp["children"] = true;
                                }

                                depJson.push(tmp);
                            }
                        }

                        callback.call(that, depJson);
                    });
                }
            }
        }
    };

    var multiDep = $.extend(true, {}, sigleDep, {
        tree: {
            core: {
                multiple: true
            }
        }
    });

    $.fn.empeTree = function(rootID, single, partID) {
        var $this = $(this);
        var defaultConfig = single == true ? sigleEmpe : multiEmpe;
        if (partID) {
            defaultConfig.loadComplete = function() {
                $(this).jstree("open_node", $(partID).data("value"));
            }
            $(partID).change(function() {
                $this.data("jstree").refresh(false, true);
            });

        }
        var newConfig = $.extend(true, {}, defaultConfig, {
            param: rootID
        });
        return $(this).combotree(newConfig)
    }

    $.fn.depTree = function(rootID, single, tpCds) {
        var defaultConfig = single == true ? sigleDep : multiDep;
        var newConfig = $.extend(true, {}, defaultConfig, {
            param: {
                'rootId': rootID,
                'tpCds': tpCds
            }
        });
        return $(this).combotree(newConfig)
    }

    // 下一环节处理人
    var sigleEmpe2 = {
        tree: {
            "core": {
                newData: function(node, param, callback, $this, option) {
                    if (node.id == "#") {
                        var req = P2.simpleTx("A09021106", param);
                        var that = this;
                        req.success(function(result) {
                            var empeJson = [];
                            var tJson = [];


                            var deaultUser = "";
                            var empeVdos = result["NEXT_USER_GRP"] && result["NEXT_USER_GRP"]["NEXT_TASK_USER"];

                            var roleVdos = result["NEXT_ROLE_GRP"] && result["NEXT_ROLE_GRP"]["NEXT_TASK_ROLE"];

                            if (option.mnode && roleVdos) {
                                tJson = [];
                                for (var i = 0; i < roleVdos.length; i++) {
                                    var tmp = {}
                                    tmp["id"] = "ROLE_" + roleVdos[i]["PRC_ACTION_ID"] + "_" + roleVdos[i]["ROLE_ID"];
                                    if (roleVdos[i]["PRC_ACTION_NM"]) {
                                        tmp["text"] = roleVdos[i]["ROLE_NM"] + "(" + roleVdos[i]["PRC_ACTION_NM"].replace(/虚拟尾|虚拟/,'') + ")";
                                    } else {
                                        tmp["text"] = roleVdos[i]["ROLE_NM"];
                                    }
                                    
                                    tmp["data"] = roleVdos[i];
                                    if (roleVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += "ROLE_" + roleVdos[i]["PRC_ACTION_ID"] + "_" + roleVdos[i]["ROLE_ID"] + ",";
                                    }

                                    tJson.push(tmp);
                                }

                                empeJson.push({
                                    "id": "ROLE",
                                    "text": "角色",
                                    "state": {
                                        "disabled": true,
                                        "opened": true
                                    },
                                    "children": tJson
                                });
                            }

                            if (empeVdos) {
                                tJson = [];
                                for (var i = 0; i < empeVdos.length; i++) {
                                    var tmp = {}
                                    tmp["id"] = "USER_" + empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"];
                                    if (empeVdos[i]["PRC_ACTION_NM"]) {
                                        tmp["text"] = empeVdos[i]["NAME"] + "(" + empeVdos[i]["PRC_ACTION_NM"].replace(/虚拟尾|虚拟/,'') + ")";
                                    } else {
                                        tmp["text"] = empeVdos[i]["NAME"];
                                    }
                                    tmp["title"] = empeVdos[i]["LAND_NAME"];
                                    tmp["data"] = empeVdos[i];
                                    tmp["type"] = 'user';
                                    if (!param.DEFAULTUSER && empeVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += "USER_" + empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"] + ",";
                                    }
 
                                    if (param.DEFAULTUSER && empeVdos[i]["ID"] == param.DEFAULTUSER) {
                                        deaultUser = "USER_" + empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"];
                                    }

                                    tJson.push(tmp);
                                }

                                empeJson.push({
                                    "id": "USER",
                                    "text": "处理人",
                                    "state": {
                                        "disabled": true,
                                        "opened": true
                                    },
                                    "children": tJson
                                });
                            }

                            $this.data("value", deaultUser);
                            if (option.mnode) {
                                callback.call(that, empeJson);
                            } else {
                                callback.call(that, tJson);
                            }

                        });
                    }
                }
            }
        }
    };

    // 查询可退会节点人员
    var sigleEmpe3 = {
        tree: {
            "core": {
                newData: function(node, param, callback, $this) {
                    if (node.id == "#") {
                        var req = P2.simpleTx("A09021107", param);
                        var that = this;
                        req.success(function(result) {
                            var empeJson = [];

                            var empeVdos = result["CAN_RETREAT_USER_LIST"] && result["CAN_RETREAT_USER_LIST"]["CAN_RETREAT_USER"];

                            var deaultUser = "";

                            if (empeVdos) {
                                for (var i = 0; i < empeVdos.length; i++) {
                                    var tmp = {}
                                    tmp["id"] = empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"];
                                    if (empeVdos[i]["PRC_ACTION_NM"]) {
                                        tmp["text"] = empeVdos[i]["NAME"] + "(" + empeVdos[i]["PRC_ACTION_NM"].replace(/虚拟尾|虚拟/,'') + ")";
                                    } else {
                                        tmp["text"] = empeVdos[i]["NAME"];
                                    }
                                    tmp["title"] = empeVdos[i]["LAND_NAME"];
                                    tmp["data"] = empeVdos[i];
                                    tmp["type"] = 'user';
                                    if (empeVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"] + ",";
                                    }

                                    empeJson.push(tmp);
                                }
                            }

                            $this.data("value", deaultUser);
                            callback.call(that, empeJson);
                        });
                    }
                }
            }
        }
    };

    // 当前环节处理人
    var sigleEmpe4 = {
        tree: {
            "core": {
                newData: function(node, param, callback, $this) {
                    if (node.id == "#") {
                        var req = P2.simpleTx("A09021193", param);
                        var that = this;
                        req.success(function(result) {
                            var empeJson = [];

                            var empeVdos = result["NEXT_USER_GRP"] && result["NEXT_USER_GRP"]["NEXT_TASK_USER"];

                            var deaultUser = "";

                            if (empeVdos) {
                                for (var i = 0; i < empeVdos.length; i++) {
                                    var tmp = {}
                                    tmp["id"] = empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"];
                                    if (empeVdos[i]["PRC_ACTION_NM"]) {
                                        tmp["text"] = empeVdos[i]["NAME"] + "(" + empeVdos[i]["PRC_ACTION_NM"].replace(/虚拟尾|虚拟/,'') + ")";
                                    } else {
                                        tmp["text"] = empeVdos[i]["NAME"];
                                    }
                                    tmp["title"] = empeVdos[i]["LAND_NAME"];
                                    tmp["data"] = empeVdos[i];
                                    tmp["type"] = 'user';
                                    if (empeVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"] + ",";
                                    }

                                    empeJson.push(tmp);
                                }
                            }
                            $this.data("value", deaultUser);
                            callback.call(that, empeJson);
                        });
                    }
                }
            }
        }
    };


    // 历史环节处理人
    var sigleEmpe5 = {
        tree: {
            "core": {
                newData: function(node, param, callback, $this) {
                    if (node.id == "#") {
                        var req = P2.simpleTx("A09021190", param);
                        var that = this;
                        req.success(function(result) {
                            var empeJson = [];

                            var empeVdos = result["NEXT_USER_GRP"] && result["NEXT_USER_GRP"]["NEXT_TASK_USER"];

                            var deaultUser = "";

                            if (empeVdos) {
                                for (var i = 0; i < empeVdos.length; i++) {
                                    var tmp = {}
                                    tmp["id"] = empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"];
                                    if (empeVdos[i]["PRC_ACTION_NM"]) {
                                        tmp["text"] = empeVdos[i]["NAME"] + "(" + empeVdos[i]["PRC_ACTION_NM"].replace(/虚拟尾|虚拟/,'') + ")";
                                    } else {
                                        tmp["text"] = empeVdos[i]["NAME"];
                                    }
                                    tmp["title"] = empeVdos[i]["LAND_NAME"];
                                    tmp["data"] = empeVdos[i];
                                    tmp["type"] = 'user';
                                    if (empeVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"] + ",";
                                    }

                                    empeJson.push(tmp);
                                }
                            }
                            $this.data("value", deaultUser);
                            callback.call(that, empeJson);
                        });
                    }
                }
            }
        }
    };

    // 业务委处理人
    var sigleEmpe6 = {
        tree: {
            "core": {
                newData: function(node, param, callback, $this) {
                    if (node.id == "#") {
                        var req = P2.simpleTx("A09020222", param);
                        var that = this;
                        req.success(function(result) {
                            var empeJson = [];

                            var empeVdos = result["BSN_REL_MGR_LIST"] && result["BSN_REL_MGR_LIST"]["BSN_REL_MGR"];

                            var deaultUser = "";

                            if (empeVdos) {
                                for (var i = 0; i < empeVdos.length; i++) {
                                    var tmp = {}
                                    if(param.QUERY_TARGET=="ACPT_PSN_MGR"){
	                                    tmp["id"] = empeVdos[i]["ACPT_PSN_ID"];
	                                    tmp["text"] = empeVdos[i]["ACPT_PSN_NM"];
                                    }else{
                                    	tmp["id"] = empeVdos[i]["RQM_APRV_PSN_ID"];
	                                    tmp["text"] = empeVdos[i]["RQM_APRV_PSN_NM"];
                                    }
                                    tmp["title"] = empeVdos[i]["LAND_NAME"];
                                    tmp["data"] = empeVdos[i];
                                    tmp["type"] = 'user';
                                    if (empeVdos[i]["DEFAULT_FALG"]) {
                                        deaultUser += empeVdos[i]["PRC_ACTION_ID"] + "_" + empeVdos[i]["ID"] + ",";
                                    }

                                    empeJson.push(tmp);
                                }
                            }
                            $this.data("value", deaultUser);
                            callback.call(that, empeJson);
                        });
                    }
                }
            }
        }
    };

    $.fn.empeTree2 = function(param, single) {
        //    	var param = {PROCESS_INST_ID:"20150918172104000000000129",TASK_ID:"10102",P_TPL_NO:"TestTemplate||com.ccb.itdm.wfe||1", ROLE_NAME:"", BLNG_LNST_DEPT_ID:"", CONDITIONS:""};
        var newConfig = $.extend(true, {}, sigleEmpe2, {
            param: param,
            tree: {
                core: {
                    multiple: !single
                }
            },
            mnode: false
        });
        return $(this).combotree(newConfig);
    }

    $.fn.empeTree3 = function(param, single) {
        //    	var param = {PROCESS_INST_ID:"20150918172104000000000129",TASK_ID:"10102",P_TPL_NO:"TestTemplate||com.ccb.itdm.wfe||1"};
        var newConfig = $.extend(true, {}, sigleEmpe3, {
            param: param,
            tree: {
                core: {
                    multiple: !single
                }
            }
        });
        return $(this).combotree(newConfig);
    }

    $.fn.empeTree4 = function(param, single) {
        //    	var param = {PROCESS_INST_ID:"20150918172104000000000129",TASK_ID:"10102",P_TPL_NO:"TestTemplate||com.ccb.itdm.wfe||1"};
        var newConfig = $.extend(true, {}, sigleEmpe4, {
            param: param,
            tree: {
                core: {
                    multiple: !single
                }
            }
        });
        return $(this).combotree(newConfig);
    }

    $.fn.empeTree5 = function(param, single) {
        //    	var param = {PROCESS_INST_ID:"20150918172104000000000129",TASK_ID:"10102",P_TPL_NO:"TestTemplate||com.ccb.itdm.wfe||1"};
        var newConfig = $.extend(true, {}, sigleEmpe5, {
            param: param,
            tree: {
                core: {
                    multiple: !single
                }
            }
        });
        return $(this).combotree(newConfig);
    }

    $.fn.empeTree6 = function(param, single) {
        //      var param = {PROCESS_INST_ID:"20150918172104000000000129",TASK_ID:"10102",P_TPL_NO:"TestTemplate||com.ccb.itdm.wfe||1"};
        var newConfig = $.extend(true, {}, sigleEmpe6, {
            param: param,
            tree: {
                core: {
                    multiple: !single
                }
            }
        });
        return $(this).combotree(newConfig);
    }
}));