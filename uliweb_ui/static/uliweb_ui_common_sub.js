/*! AdminLTE app.js
 * ================
 * Main JS application file for AdminLTE v2. This file
 * should be included in all pages. It controls some layout
 * options and implements exclusive AdminLTE plugins.
 *
 * @Author  Almsaeed Studio
 * @Support <http://www.almsaeedstudio.com>
 * @Email   <support@almsaeedstudio.com>
 * @version 2.3.2
 * @license MIT <http://opensource.org/licenses/MIT>
 */
function _init() {
    "use strict";
    $.AdminLTE.layout = {
        activate: function () {
            var a = this;
            a.fix(), a.fixSidebar(), $(window, ".wrapper").resize(function () {
                a.fix(), a.fixSidebar()
            })
        }, fix: function () {
            var a = $(".main-header").outerHeight() + $(".main-footer").outerHeight(), b = $(window).height(), c = $(".sidebar").height();
            if ($("body").hasClass("fixed"))$(".content-wrapper, .right-side").css("min-height", b - $(".main-footer").outerHeight()); else {
                var d;
                b >= c ? ($(".content-wrapper, .right-side").css("min-height", b - a), d = b - a) : ($(".content-wrapper, .right-side").css("min-height", c), d = c);
                var e = $($.AdminLTE.options.controlSidebarOptions.selector);
                "undefined" != typeof e && e.height() > d && $(".content-wrapper, .right-side").css("min-height", e.height())
            }
        }, fixSidebar: function () {
            return $("body").hasClass("fixed") ? ("undefined" == typeof $.fn.slimScroll && window.console && window.console.error("Error: the fixed layout requires the slimscroll plugin!"), void($.AdminLTE.options.sidebarSlimScroll && "undefined" != typeof $.fn.slimScroll && ($(".sidebar").slimScroll({destroy: !0}).height("auto"), $(".sidebar").slimscroll({
                height: $(window).height() - $(".main-header").height() + "px",
                color: "rgba(0,0,0,0.2)",
                size: "3px"
            })))) : void("undefined" != typeof $.fn.slimScroll && $(".sidebar").slimScroll({destroy: !0}).height("auto"))
        }
    }, $.AdminLTE.pushMenu = {
        activate: function (a) {
            var b = $.AdminLTE.options.screenSizes;
            $(document).on("click", a, function (a) {
                a.preventDefault(), $(window).width() > b.sm - 1 ? $("body").hasClass("sidebar-collapse") ? $("body").removeClass("sidebar-collapse").trigger("expanded.pushMenu") : $("body").addClass("sidebar-collapse").trigger("collapsed.pushMenu") : $("body").hasClass("sidebar-open") ? $("body").removeClass("sidebar-open").removeClass("sidebar-collapse").trigger("collapsed.pushMenu") : $("body").addClass("sidebar-open").trigger("expanded.pushMenu")
            }), $(".content-wrapper").click(function () {
                $(window).width() <= b.sm - 1 && $("body").hasClass("sidebar-open") && $("body").removeClass("sidebar-open")
            }), ($.AdminLTE.options.sidebarExpandOnHover || $("body").hasClass("fixed") && $("body").hasClass("sidebar-mini")) && this.expandOnHover()
        }, expandOnHover: function () {
            var a = this, b = $.AdminLTE.options.screenSizes.sm - 1;
            $(".main-sidebar").hover(function () {
                $("body").hasClass("sidebar-mini") && $("body").hasClass("sidebar-collapse") && $(window).width() > b && a.expand()
            }, function () {
                $("body").hasClass("sidebar-mini") && $("body").hasClass("sidebar-expanded-on-hover") && $(window).width() > b && a.collapse()
            })
        }, expand: function () {
            $("body").removeClass("sidebar-collapse").addClass("sidebar-expanded-on-hover")
        }, collapse: function () {
            $("body").hasClass("sidebar-expanded-on-hover") && $("body").removeClass("sidebar-expanded-on-hover").addClass("sidebar-collapse")
        }
    }, $.AdminLTE.tree = function (a) {
        var b = this, c = $.AdminLTE.options.animationSpeed;
        $(a).on("click", "li a", function (d) {
            var e = $(this), f = e.next();
            if (f.is(".treeview-menu") && f.is(":visible") && !$("body").hasClass("sidebar-collapse"))f.slideUp(c, function () {
                f.removeClass("menu-open")
            }), f.parent("li").removeClass("active"); else if (f.is(".treeview-menu") && !f.is(":visible")) {
                var g = e.parents("ul").first(), h = g.find("ul:visible").slideUp(c);
                h.removeClass("menu-open");
                var i = e.parent("li");
                f.slideDown(c, function () {
                    f.addClass("menu-open"), g.find("li.active.treeview").removeClass("active"), i.addClass("active"), b.layout.fix()
                })
            } else e.is(".active") || ($(a).find(".active").each(function (a, b) {
                var c = $(b);
                c.is(".treeview") || c.removeClass("active")
            }), e.parent("li").addClass("active"));
            f.is(".treeview-menu") && d.preventDefault()
        })
    }, $.AdminLTE.controlSidebar = {
        activate: function () {
            var a = this, b = $.AdminLTE.options.controlSidebarOptions, c = $(b.selector), d = $(b.toggleBtnSelector);
            d.on("click", function (d) {
                d.preventDefault(), c.hasClass("control-sidebar-open") || $("body").hasClass("control-sidebar-open") ? a.close(c, b.slide) : a.open(c, b.slide)
            });
            var e = $(".control-sidebar-bg");
            a._fix(e), $("body").hasClass("fixed") ? a._fixForFixed(c) : $(".content-wrapper, .right-side").height() < c.height() && a._fixForContent(c)
        }, open: function (a, b) {
            b ? a.addClass("control-sidebar-open") : $("body").addClass("control-sidebar-open")
        }, close: function (a, b) {
            b ? a.removeClass("control-sidebar-open") : $("body").removeClass("control-sidebar-open")
        }, _fix: function (a) {
            var b = this;
            $("body").hasClass("layout-boxed") ? (a.css("position", "absolute"), a.height($(".wrapper").height()), $(window).resize(function () {
                b._fix(a)
            })) : a.css({position: "fixed", height: "auto"})
        }, _fixForFixed: function (a) {
            a.css({position: "fixed", "max-height": "100%", overflow: "auto", "padding-bottom": "50px"})
        }, _fixForContent: function (a) {
            $(".content-wrapper, .right-side").css("min-height", a.height())
        }
    }, $.AdminLTE.boxWidget = {
        selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
        icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
        animationSpeed: $.AdminLTE.options.animationSpeed,
        activate: function (a) {
            var b = this;
            a || (a = document), $(a).on("click", b.selectors.collapse, function (a) {
                a.preventDefault(), b.collapse($(this))
            }), $(a).on("click", b.selectors.remove, function (a) {
                a.preventDefault(), b.remove($(this))
            })
        },
        collapse: function (a) {
            var b = this, c = a.parents(".box").first(), d = c.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
            c.hasClass("collapsed-box") ? (a.children(":first").removeClass(b.icons.open).addClass(b.icons.collapse), d.slideDown(b.animationSpeed, function () {
                c.removeClass("collapsed-box")
            })) : (a.children(":first").removeClass(b.icons.collapse).addClass(b.icons.open), d.slideUp(b.animationSpeed, function () {
                c.addClass("collapsed-box")
            }))
        },
        remove: function (a) {
            var b = a.parents(".box").first();
            b.slideUp(this.animationSpeed)
        }
    }
}
if ("undefined" == typeof jQuery)throw new Error("AdminLTE requires jQuery");
$.AdminLTE = {}, $.AdminLTE.options = {
    navbarMenuSlimscroll: !0,
    navbarMenuSlimscrollWidth: "3px",
    navbarMenuHeight: "200px",
    animationSpeed: 500,
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    sidebarPushMenu: !0,
    sidebarSlimScroll: !0,
    sidebarExpandOnHover: !1,
    enableBoxRefresh: !0,
    enableBSToppltip: !0,
    BSTooltipSelector: "[data-toggle='tooltip']",
    enableFastclick: !0,
    enableControlSidebar: !0,
    controlSidebarOptions: {
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        selector: ".control-sidebar",
        slide: !0
    },
    enableBoxWidget: !0,
    boxWidgetOptions: {
        boxWidgetIcons: {collapse: "fa-minus", open: "fa-plus", remove: "fa-times"},
        boxWidgetSelectors: {remove: '[data-widget="remove"]', collapse: '[data-widget="collapse"]'}
    },
    directChat: {enable: !0, contactToggleSelector: '[data-widget="chat-pane-toggle"]'},
    colors: {
        lightBlue: "#3c8dbc",
        red: "#f56954",
        green: "#00a65a",
        aqua: "#00c0ef",
        yellow: "#f39c12",
        blue: "#0073b7",
        navy: "#001F3F",
        teal: "#39CCCC",
        olive: "#3D9970",
        lime: "#01FF70",
        orange: "#FF851B",
        fuchsia: "#F012BE",
        purple: "#8E24AA",
        maroon: "#D81B60",
        black: "#222222",
        gray: "#d2d6de"
    },
    screenSizes: {xs: 480, sm: 768, md: 992, lg: 1200}
}, $(function () {
    "use strict";
    $("body").removeClass("hold-transition"), "undefined" != typeof AdminLTEOptions && $.extend(!0, $.AdminLTE.options, AdminLTEOptions);
    var a = $.AdminLTE.options;
    _init(), $.AdminLTE.layout.activate(), $.AdminLTE.tree(".sidebar"), a.enableControlSidebar && $.AdminLTE.controlSidebar.activate(), a.navbarMenuSlimscroll && "undefined" != typeof $.fn.slimscroll && $(".navbar .menu").slimscroll({
        height: a.navbarMenuHeight,
        alwaysVisible: !1,
        size: a.navbarMenuSlimscrollWidth
    }).css("width", "100%"), a.sidebarPushMenu && $.AdminLTE.pushMenu.activate(a.sidebarToggleSelector), a.enableBSToppltip && $("body").tooltip({selector: a.BSTooltipSelector}), a.enableBoxWidget && $.AdminLTE.boxWidget.activate(), a.enableFastclick && "undefined" != typeof FastClick && FastClick.attach(document.body), a.directChat.enable && $(document).on("click", a.directChat.contactToggleSelector, function () {
        var a = $(this).parents(".direct-chat").first();
        a.toggleClass("direct-chat-contacts-open")
    }), $('.btn-group[data-toggle="btn-toggle"]').each(function () {
        var a = $(this);
        $(this).find(".btn").on("click", function (b) {
            a.find(".btn.active").removeClass("active"), $(this).addClass("active"), b.preventDefault()
        })
    }), $.Metro.initWidgets()
}), function (a) {
    "use strict";
    a.fn.boxRefresh = function (b) {
        function c(a) {
            a.append(f), e.onLoadStart.call(a)
        }

        function d(a) {
            a.find(f).remove(), e.onLoadDone.call(a)
        }

        var e = a.extend({
            trigger: ".refresh-btn", source: "", onLoadStart: function (a) {
                return a
            }, onLoadDone: function (a) {
                return a
            }
        }, b), f = a('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');
        return this.each(function () {
            if ("" === e.source)return void(window.console && window.console.log("Please specify a source first - boxRefresh()"));
            var b = a(this), f = b.find(e.trigger).first();
            f.on("click", function (a) {
                a.preventDefault(), c(b), b.find(".box-body").load(e.source, function () {
                    d(b)
                })
            })
        })
    }
}(jQuery), function (a) {
    "use strict";
    a.fn.activateBox = function () {
        a.AdminLTE.boxWidget.activate(this)
    }, a.fn.toggleBox = function () {
        var b = a(a.AdminLTE.boxWidget.selectors.collapse, this);
        a.AdminLTE.boxWidget.collapse(b)
    }, a.fn.removeBox = function () {
        var b = a(a.AdminLTE.boxWidget.selectors.remove, this);
        a.AdminLTE.boxWidget.remove(b)
    }
}(jQuery), function (a) {
    "use strict";
    a.fn.todolist = function (b) {
        var c = a.extend({
            onCheck: function (a) {
                return a
            }, onUncheck: function (a) {
                return a
            }
        }, b);
        return this.each(function () {
            "undefined" != typeof a.fn.iCheck ? (a("input", this).on("ifChecked", function () {
                var b = a(this).parents("li").first();
                b.toggleClass("done"), c.onCheck.call(b)
            }), a("input", this).on("ifUnchecked", function () {
                var b = a(this).parents("li").first();
                b.toggleClass("done"), c.onUncheck.call(b)
            })) : a("input", this).on("change", function () {
                var b = a(this).parents("li").first();
                b.toggleClass("done"), a("input", b).is(":checked") ? c.onCheck.call(b) : c.onUncheck.call(b)
            })
        })
    }
}(jQuery), window.isTouchDevice = function () {
    return "ontouchstart"in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}, $.widget("metro.tile", {
    version: "3.0.0",
    options: {
        effect: "slideLeft", period: 4e3, duration: 700, easing: "doubleSqrt", onClick: function (a) {
        }
    },
    _frames: {},
    _currentIndex: 0,
    _interval: 0,
    _outPosition: 0,
    _size: {},
    _create: function () {
        var a = this.element, b = this.options;
        $.each(a.data(), function (a, c) {
            if (a in b)try {
                b[a] = $.parseJSON(c)
            } catch (d) {
                b[a] = c
            }
        }), this._createTransformTile(), this._createLiveTile(), this._createEvents(), a.data("tile", this)
    },
    _createEvents: function () {
        var that = this, element = this.element, o = this.options, event = isTouchDevice() ? "touchstart" : "click";
        element.on(event, function (e) {
            if ("A" === element[0].tagName); else if ("function" == typeof o.onClick)o.onClick(element); else if ("function" == typeof window[o.onClick])window[o.onClick](element); else {
                var result = eval("(function(){" + o.onClick + "})");
                result.call(element)
            }
        })
    },
    _createLiveTile: function () {
        var a = this, b = this.element, c = (this.options, isTouchDevice() ? "touchstart" : "mouseenter"), d = isTouchDevice() ? "touchend" : "mouseleave";
        return this._frames = b.find(".live-slide"), this._frames.length <= 1 ? !1 : ($.easing.doubleSqrt = function (a) {
            return Math.sqrt(Math.sqrt(a))
        }, this._size = {width: b.width(), height: b.height()}, b.on(c, function () {
            a.stop()
        }), b.on(d, function () {
            a.start()
        }), void this.start())
    },
    start: function () {
        var a = this;
        this._interval = setInterval(function () {
            a._animate()
        }, this.options.period)
    },
    stop: function () {
        clearInterval(this._interval)
    },
    _animate: function () {
        var a, b = this._frames[this._currentIndex];
        switch (this._currentIndex += 1, this._currentIndex >= this._frames.length && (this._currentIndex = 0), a = this._frames[this._currentIndex], this.options.effect) {
            case"slideLeft":
                this._effectSlideLeft(b, a);
                break;
            case"slideRight":
                this._effectSlideRight(b, a);
                break;
            case"slideDown":
                this._effectSlideDown(b, a);
                break;
            case"slideUpDown":
                this._effectSlideUpDown(b, a);
                break;
            case"slideLeftRight":
                this._effectSlideLeftRight(b, a);
                break;
            default:
                this._effectSlideUp(b, a)
        }
    },
    _effectSlideLeftRight: function (a, b) {
        this._currentIndex % 2 === 0 ? this._effectSlideLeft(a, b) : this._effectSlideRight(a, b)
    },
    _effectSlideUpDown: function (a, b) {
        this._currentIndex % 2 === 0 ? this._effectSlideUp(a, b) : this._effectSlideDown(a, b)
    },
    _effectSlideUp: function (a, b) {
        var c = this._size.height, d = {duration: this.options.duration, easing: this.options.easing};
        $(a).animate({top: -c}, d), $(b).css({top: c}).show().animate({top: 0}, d)
    },
    _effectSlideDown: function (a, b) {
        var c = this._size.height, d = {duration: this.options.duration, easing: this.options.easing};
        $(a).animate({top: c}, d), $(b).css({top: -c}).show().animate({top: 0}, d)
    },
    _effectSlideLeft: function (a, b) {
        var c = this._size.width, d = {duration: this.options.duration, easing: this.options.easing};
        $(a).animate({left: -1 * c}, d), $(b).css({left: c}).show().animate({left: 0}, d)
    },
    _effectSlideRight: function (a, b) {
        var c = this._size.width, d = {duration: this.options.duration, easing: this.options.easing};
        $(a).animate({left: c}, d), $(b).css({left: -c}).show().animate({left: 0}, d)
    },
    _createTransformTile: function () {
        var a = this.element, b = (this.options, {
            w: a.width(),
            h: a.height()
        }), c = isTouchDevice() ? "touchstart" : "mousedown", d = isTouchDevice() ? "touchend" : "mouseup", e = isTouchDevice() ? "touchend" : "mouseleave";
        a.on(c, function (c) {
            var d = c.pageX - $(this).offset().left, e = c.pageY - $(this).offset().top, f = "top";
            d < 1 * b.w / 3 && (e < 1 * b.h / 2 || e > 1 * b.h / 2) ? f = "left" : d > 2 * b.w / 3 && (e < 1 * b.h / 2 || e > 1 * b.h / 2) ? f = "right" : d > 1 * b.w / 3 && d < 2 * b.w / 3 && e > b.h / 2 && (f = "bottom"), $(this).addClass("tile-transform-" + f), "A" === a[0].tagName && a.attr("href") && setTimeout(function () {
                document.location.href = a.attr("href")
            }, 500)
        }), a.on(d, function () {
            $(this).removeClass("tile-transform-left").removeClass("tile-transform-right").removeClass("tile-transform-top").removeClass("tile-transform-bottom")
        }), a.on(e, function () {
            $(this).removeClass("tile-transform-left").removeClass("tile-transform-right").removeClass("tile-transform-top").removeClass("tile-transform-bottom")
        })
    },
    _destroy: function () {
    },
    _setOption: function (a, b) {
        this._super("_setOption", a, b)
    }
}), $.widget("metro.fitImage", {
    version: "3.0.0",
    options: {shadow: !1, overlay: !1, type: "default", frameColor: "default", format: "hd"},
    _create: function () {
        var a, b, c, d, e, f = this.element, g = this.options, h = f.parent(), i = f.attr("src");
        $.each(f.data(), function (a, b) {
            if (a in g)try {
                g[a] = $.parseJSON(b)
            } catch (c) {
                g[a] = b
            }
        }), $("<img/>").attr("src", i).load(function () {
            a = this.width, b = this.height
        }).remove();
        var j = $("<div/>").addClass("image-container").css("width", "100%").appendTo(h), k = $("<div/>").addClass("frame").appendTo(j);
        switch (c = k.innerWidth(), d = k.innerHeight(), g.format) {
            case"sd":
                d = 3 * c / 4;
                break;
            case"square":
                d = c;
                break;
            case"cycle":
                d = c;
                break;
            case"fill-h":
                d = "100%", j.css("height", "100%");
                break;
            case"fill":
                d = "100%", j.css("height", "100%");
                break;
            default:
                d = 9 * c / 16
        }
        if (e = $("<div/>").css({
                width: "100%",
                height: d,
                "background-image": "url(" + i + ")",
                "background-size": "cover",
                "background-repeat": "no-repeat",
                "border-radius": "cycle" === g.format ? "50%" : "0"
            }), $(window).on("resize", function () {
                var a = k.innerWidth(), b = k.innerHeight();
                switch (g.format) {
                    case"sd":
                        b = 3 * a / 4;
                        break;
                    case"square":
                        b = a;
                        break;
                    case"cycle":
                        b = a;
                        break;
                    case"fill-h":
                        b = "100%", j.css("height", "100%");
                        break;
                    case"fill":
                        b = "100%", j.css("height", "100%");
                        break;
                    default:
                        b = 9 * a / 16
                }
                e.css({height: b})
            }), "default" !== g.frameColor && (g.frameColor.isUrl() ? k.css("background-color", g.frameColor) : k.addClass(g.frameColor)), g.overlay !== !1) {
            $("<div/>").addClass("image-overlay").html(g.overlay).appendTo(j)
        }
        switch (g.shadow !== !1 && j.addClass("block-shadow"), e.appendTo(k), g.type) {
            case"diamond":
                j.addClass("diamond"), e.addClass("image-replacer");
                break;
            case"bordered":
                j.addClass("bordered");
                break;
            case"polaroid":
                j.addClass("polaroid");
                break;
            case"handing":
                j.addClass("handing");
                break;
            case"handing-ani":
                j.addClass("handing ani");
                break;
            case"handing-ani-hover":
                j.addClass("handing ani-hover")
        }
        j.addClass("image-format-" + g.format), f.remove()
    },
    _destroy: function () {
    },
    _setOption: function (a, b) {
        this._super("_setOption", a, b)
    }
}), $.Metro = {}, $.Metro.initWidgets = function () {
    var a = $("[data-role]");
    $.each(a, function () {
        var a = $(this), b = a.data("role").split(/\s*,\s*/);
        b.map(function (b) {
            try {
                void 0 !== $.fn[b] && a.data(b + "-initiated") !== !0 && ($.fn[b].call(a), a.data(b + "-initiated", !0))
            } catch (c) {
                window.METRO_DEBUG && console.log(c.message, c.stack)
            }
        })
    })
};
/* =========================================================
 * bootstrap-datepicker.js
 * Repo: https://github.com/eternicode/bootstrap-datepicker/
 * Demo: http://eternicode.github.io/bootstrap-datepicker/
 * Docs: http://bootstrap-datepicker.readthedocs.org/
 * Forked from http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
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

(function($, undefined){

	var $window = $(window);

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.splice(0);
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		this.dates = new DateArray();
		this.viewDate = UTCToday();
		this.focusDate = null;

		this._process_options(options);

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode){
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
				else
					o.multidate = 1;
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return (/^auto|left|right|top|bottom$/).test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return (/^left|right$/).test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return (/^top|bottom$/).test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
			if (this.isInput){ // single input
				this._events = [
					[this.element, {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.element.is('div')){  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (!this.isInline)
				this.picker.appendTo('body');
			this.picker.show();
			this.place();
			this._attachSecondaryEvents();
			this._trigger('show');
		},

		hide: function(){
			if (this.isInline)
				return;
			if (!this.picker.is(':visible'))
				return;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this._trigger('hide');
		},

		remove: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			return new Date(this.dates.get(-1));
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			if (!this.isInput){
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			}
			else {
				this.element.val(formatted).change();
			}
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

			var zIndex = parseInt(this.element.parents().filter(function(){
					return $(this).css('z-index') !== 'auto';
				}).first().css('z-index'))+10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					date < this.o.startDate ||
					date > this.o.endDate ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12){
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
				cls.push('disabled');
			}
			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				tooltip;
			this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(dates[this.o.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot th.clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			var years = $.map(this.dates, function(d){
					return d.getUTCFullYear();
				}),
				classes;
			for (var i = -1; i < 11; i++){
				classes = ['year'];
				if (i === -1)
					classes.push('old');
				else if (i === 10)
					classes.push('new');
				if ($.inArray(year, years) !== -1)
					classes.push('active');
				if (year < startYear || year > endYear)
					classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length === 1){
				switch (target[0].nodeName.toLowerCase()){
					case 'th':
						switch (target[0].className){
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								var element;
								if (this.isInput)
									element = this.element;
								else if (this.component)
									element = this.element.find('input');
								if (element)
									element.val("").change();
								this.update();
								this._trigger('changeDate');
								if (this.o.autoclose)
									this.hide();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')){
							this.viewDate.setUTCDate(1);
							if (target.is('.month')){
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1){
									this._setDate(UTCDate(year, month, day));
								}
							}
							else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2){
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							day = parseInt(target.text(), 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.is('.old')){
								if (month === 0){
									month = 11;
									year -= 1;
								}
								else {
									month -= 1;
								}
							}
							else if (target.is('.new')){
								if (month === 11){
									month = 0;
									year += 1;
								}
								else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}
			else if (ix !== -1){
				this.dates.remove(ix);
			}
			else {
				this.dates.push(date);
			}
			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which  === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			this._trigger('changeDate');
			var element;
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date)
				return undefined;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32: // spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13: // enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					this._toggle_multidate(focusDate);
					dateChanged = true;
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				var element;
				if (this.isInput){
					element = this.element;
				}
				else if (this.component){
					element = this.element.find('input');
				}
				if (element){
					element.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker
				.find('>div')
				.hide()
				.filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName)
					.css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		$(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[i]){
				// Date being moved earlier/left
				while (i >= 0 && new_date < this.dates[i]){
					this.pickers[i--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[i]){
				// Date being moved later/right
				while (i < l && new_date > this.dates[i]){
					this.pickers[i++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	$.fn.datepicker = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.is('.input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else {
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		daysOfWeekDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				part, dir, i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(2000+v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m === p;
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datepicker('show');
		}
	);
	$(function(){
		$('[data-provide="datepicker-inline"]').datepicker();
	});

}(window.jQuery));

/**
 * Simplified Chinese translation for bootstrap-datepicker
 * Yuan Cheung <advanimal@gmail.com>
 */
;(function($){
	$.fn.datepicker.dates['zh-CN'] = {
		days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
		daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		today: "今日",
		format: "yyyy年mm月dd日",
		weekStart: 1
	};
}(jQuery));

(function (window) {
    'use strict';

    /**
     * Module dependencies
     */
    var on = (window.addEventListener !== undefined) ? 'addEventListener' : 'attachEvent',
        off = (window.removeEventListener !== undefined) ? 'removeEventListener' : 'detachEvent',
        scrollEvent = (on !== 'addEventListener') ? 'onscroll' : 'scroll',
        scrolled = false,
        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        }()),
        scrolledElement,
        scroll,
        eve;


    /**
     * Captures the scroll event and the element who emits it.
     * @function
     * @private
     */
    function captureScroll(e) {
        // No changing, exit
        if (!scrolled) {
            scrolled = true;
            scrolledElement = this;
            eve = e || window.e;


            /**
             * requestAnimationFrame
             */
            requestAnimFrame(update);
        }
    }

    /**
     * If the scroll event exist, it will execute the scrolledElement listeners.
     * @function
     * @private
     */
    function update() {

        var i = 0,
            listeners = scroll._collection[scrolledElement].listeners,
            len = listeners.length;

        for (i; i < len; i += 1) {
            listeners[i].call(scrolledElement, eve);
        }

        scrolledElement = undefined;

        // Change scroll status
        scrolled = false;
    }

    /**
     * Scroll Constructor.
     * @constructor
     * @returns {scroll} Returns a new instance of Scroll.
     */
    function Scroll() {
        this.initialize();
        return this;
    }

    /**
     * Initializes a new instance of Scroll.
     * @function
     * @returns {scroll} Returns a new instance of Scroll.
     */
    Scroll.prototype.initialize = function () {
        this._collection = {};
        return this;
    };

    /**
     * Adds an el with a listener to the collection.
     * @memberof! Scroll.prototype
     * @function
     * @param {HTMLElement} [el] - A given HTMLElement to add to scroll.
     * @param {Funtion} listener - A given listener to execute when the given el is scrolled.
     * @returns {scroll}
     */
    Scroll.prototype.add = function (el, listener) {

        if ('function' === typeof el) {
            listener = el;
            el = window;
        }

        if (this._collection[el] === undefined) {
            this._collection[el] = {
                'listeners': []
            };

            el[on](scrollEvent, captureScroll, false);
        }

        // Add listeners to an el collection
        this._collection[el].listeners.push(listener);

        return this;
    };

    /**
     * Removes a HTMLElement and its listener from the collection with the given el.
     * @memberof! Scroll.prototype
     * @function
     * @param {HTMLElement} el - A given HTMLElement to remove.
     * @param {Funtion} [listener] - A given listener to remove.
     * @returns {scroll}
     */
    Scroll.prototype.remove = function (el, listener) {
        var listeners = this._collection[el].listeners,
            i = 0,
            len = listeners.length;

        if (len !== undefined) {
            for (i; i < len; i += 1) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        if (listeners.length === 0 || listener === undefined) {
            el[off](scrollEvent, captureScroll, false);
            delete this._collection[el];
        }

        return this;
    };

    // Defines a new instance of Scroll.
    scroll = new Scroll();

    /**
     * Adds an el with a listener to the collection.
     * @function
     * @param {HTMLElement} [el] - A given HTMLElement to add to scroll.
     * @param {Funtion} listener - A given listener to execute when the given el is scrolled.
     * @returns {scroll}
     */
    function scrolling(el, listener) {
        scroll.add(el, listener);

        return scrolling;
    }

    /**
     * Removes a HTMLElement and its listener from the collection with the given el.
     * @function
     * @param {HTMLElement} el - A given HTMLElement to remove.
     * @param {Funtion} [listener] - A given listener to remove.
     * @returns {scrolling}
     */
    scrolling.remove = function (el, listener) {
        scroll.remove(el, listener);

        return scrolling;
    };
    /**
     * Expose scrolling
     */
    // AMD suppport
    if (typeof window.define === 'function' && window.define.amd !== undefined) {
        window.define('scrolling', [], function () {
            return scrolling;
        });

    // CommonJS suppport
    } else if (typeof module !== 'undefined' && module.exports !== undefined) {
        module.exports = scrolling;

    // Default
    } else {
        window.scrolling = scrolling;
    }
}(this));

/**
 * Author: meimeidev
 */

!function($){
    var MMGrid = function (element, options) {
        this._id = (((1 + Math.random()) * 0x10000) | 0).toString(16);
        this._loadCount = 0;
        this.opts = options;
        this._initTitleDeep();
        this._initLayout($(element));
        this._initHead();
        this._initOptions();
        this._initEvents();
        this._setColsWidth();
        if(this.opts.fullWidthRows){
            this._fullWidthRows();
        }

        //初始化插件
        for(var i=0; i< this.opts.plugins.length; i++){
            var plugin = this.opts.plugins[i];
            plugin.init($.extend(element, this));
        }

        if(options.autoLoad){
            var that = this;
            this.opts = options;
            setTimeout(function(){

                if(options.url){
                    that.load();
                }else{
                    that.load(options.items);
                }
            },0); //chrome style problem
        }
        this._init_plugins();
    };

    //see: http://tanalin.com/en/articles/ie-version-js/
    var browser = function(){
        var isIE=!!window.ActiveXObject;
        var isIE10 = isIE && !!window.atob;
        var isIE9 = isIE && document.addEventListener && !window.atob;
        var isIE8 = isIE && document.querySelector && !document.addEventListener;
        var isIE7 = isIE && window.XMLHttpRequest && !document.querySelector;
        var isIE6 = isIE && !window.XMLHttpRequest;

        return {
            isIE: isIE
            , isIE6: isIE6
            , isIE7: isIE7
            , isIE8: isIE8
            , isIE9: isIE9
            , isIE10: isIE10
        };
    }();

    MMGrid.prototype = {

        _initLayout: function($el){
            var opts = this.opts;
            var $elParent = $el.parent();
            var elIndex = $el.index();

            var mmGrid = [
                '<div class="mmGrid">',
                    '<style></style>',
                    '<div class="mmg-headWrapper">',
                        '<table class="mmg-head" cellspacing="0"></table>',
                    '</div>',
                    '<div class="mmg-colResizePointer"></div>',
                    '<div class="mmg-colResizePointer-before"></div>',
                    '<div class="mmg-backboard">',
                        '<a class="mmg-btnBackboardUp"></a>',
                    '</div>',
                    '<div class="mmg-bodyWrapper"></div>',
                    '<a class="mmg-btnBackboardDn"></a>',
                    '<div class="mmg-message">'+ this.opts.noDataText +'</div>',
                    '<div class="mmg-mask mmg-transparent"></div>',
                    '<div class="mmg-loading">',
                        '<div class="mmg-loadingImg"></div>',
                        '<div class="mmg-loadingText">'+ this.opts.loadingText +'</div>',
                    '</div>',

                '</div>'
            ];
            //fix in IE7,IE6
            if(browser.isIE7 || browser.isIE6){
                $el.prop('cellspacing',0);
            }


            //cached object
            var $mmGrid = $(mmGrid.join(''));
            this.$mmGrid = $mmGrid;
            this.$style = $mmGrid.find('style');
            this.$headWrapper = $mmGrid.find('.mmg-headWrapper');
            this.$head = $mmGrid.find('.mmg-head');
            this.$backboard = $mmGrid.find('.mmg-backboard');
            this.$bodyWrapper = $mmGrid.find('.mmg-bodyWrapper');
            this.$count = 0;        //记录所有数据,一行一条
            this.$body = $el.removeAttr("style").addClass('mmg-body');
            this.$page = 1;
            this.$limit = 0;
            this.$runing = 0;
            this._insertEmptyRow();
            this.$body.appendTo(this.$bodyWrapper);

            //放回原位置
            if(elIndex === 0 || $elParent.children().length == 0){
                $elParent.prepend(this.$mmGrid);
            }else{
                $elParent.children().eq(elIndex-1).after(this.$mmGrid);
            }

            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                $mmGrid.height('100%');
                $mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
            }else{
                $mmGrid.height(opts.height);
            }

            if(opts.checkCol){
                var chkHtml = opts.multiSelect ?  '<input type="checkbox" class="checkAll" >'
                    : '<input type="checkbox" disabled="disabled" class="checkAll">';
                opts.cols[0].unshift({title:chkHtml,width: 24, rowspan: this.$titleDeep, align: 'center' ,lockWidth: true, checkCol: true, renderer:function(){
                    return '<input type="checkbox" class="mmg-check">';
                }});
            }

            if(opts.indexCol){
                opts.cols[0].unshift({title:'#',width: opts.indexColWidth, rowspan: this.$titleDeep, 
                    align: 'center' ,lockWidth: true, indexCol:true, renderer:function(val,item,rowIndex){
                    return '<label class="mmg-index">' + (rowIndex+1) + '</label>';
                }});
            }

        }

        ,_expandCols: function(cols){
            var c = []; //记录每行扫描的位置
            var i;
            var that = this;
            for (i=0; i<cols.length; i++){
                c[i] = 0;
            }
            function fix_col(col){
                col.colspan = col.colspan || 1;
                col.rowspan = col.rowspan || 1;
                return col;
            }
            function is_leaf(col, deep){
                if ((col.colspan === 1) && (col.rowspan === that.$titleDeep-deep)){
                    col.isLeaf = true;
                    return true;
                }else{
                    col.isLeaf = false;
                    return false;
                }
            }
            function get_nodes(col, deep){
                var _col;
                var nodes = [];
                var n;
                var pos;
                fix_col(col);
                if(is_leaf(col, deep)) return [col];
                n = 0;
                pos = deep + col.rowspan;
                for(var j=c[pos]; j<cols[pos].length; j++){
                    _col = fix_col(cols[pos][j]);
                    if (n + _col.colspan <= col.colspan){
                        nodes = nodes.concat(get_nodes(_col, pos));
                        c[pos] ++;
                        n = n + _col.colspan;
                        if (col.nodes) col.nodes.push(_col);
                        else col.nodes = [_col];
                    }else break;
                }
                nodes.unshift(col);
                return nodes;
            }
            
            var colspan, col, nodes=[];
            for (var i=0; i<cols[0].length; i++){
                col = cols[0][i];
                nodes = nodes.concat(get_nodes(col, 0));
            }
            return nodes;
        }

        ,_leafCols: function(){
            return this.$columns;
        }

        ,_expandThs: function(){
            return this.$head.find('th').sort(function(a, b){
               return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }

        ,_leafThs: function(){
            return this.$head.find('th').filter(function(){
                return $.data(this,'col').isLeaf;
            }).sort(function(a, b){
                return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }

        /*
            初始化列
            计算title的深度，采用cols为多个[]的写法，例如：
                cols: [[....], [....]]
            为了兼容以前的写法，当第一个值不是[]类型时，自动包装为[[]]形式
            同时实现列的扁平化
        */
        ,_initTitleDeep: function(){
            var cols = this.opts.cols;
            var deep = 0;
            if (cols && cols.length > 0){
                var col = cols[0];
                if($.isArray(col)){
                    deep = cols.length;
                }else{
                    this.opts.cols = [cols];
                    deep = 1;
                }
            }
            this.$titleDeep = deep;
        }

        , _titleHtml: function(col){
            var opts = this.opts;

            var titleHtml = [];
            titleHtml.push('<th class="');
            var colIndex =  $.inArray(col, this.$fullColumns);
            titleHtml.push(this._genColClass(colIndex));
            if (!col.isLeaf)
                titleHtml.push(' mmg-groupCol');
            titleHtml.push(' " ');
            titleHtml.push(' rowspan="');
            titleHtml.push(col.rowspan);
            titleHtml.push('" colspan="');
            titleHtml.push(col.colspan);
            titleHtml.push('" data-colIndex="');
            titleHtml.push(colIndex);
            titleHtml.push('" >');
            titleHtml.push('<div class="mmg-titleWrapper" >');
            titleHtml.push('<span class="mmg-title ');
            if(col.sortable) titleHtml.push('mmg-canSort ');
            titleHtml.push('">');
            if(col.titleHtml){
                titleHtml.push(col.titleHtml);
            }else{
                titleHtml.push(col.title);
            }
            titleHtml.push('</span><div class="mmg-sort"></div>');
            if(!col.lockWidth) titleHtml.push('<div class="mmg-colResize"></div>');
            titleHtml.push('</div></th>');

            return titleHtml.join("");
        }

        , _initHead: function(){
            var that = this;
            var opts = this.opts;
            var $head = this.$head;
            var titleDeep = that.$titleDeep;

            this.$fullColumns = this._expandCols(this.opts.cols);
            this.$columns = $.grep(this.$fullColumns, function(x){
                return x.isLeaf;
            });

            if(titleDeep){
                var theadHtmls = ['<thead>'];
                for(var i=0; i< titleDeep; i++){
                    var cols = opts.cols[i];
                    theadHtmls.push('<tr>');
                    for(var colIndex=0; colIndex< cols.length; colIndex++){
                        var col = cols[colIndex];
                        theadHtmls.push(this._titleHtml(col));
                    }
                    theadHtmls.push('</tr>');
                }
                theadHtmls.push('</thead>');
                $head.html(theadHtmls.join(''));
            }

            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;
            $.each($ths,function(index){
                if(!expandCols[index].width){
                    expandCols[index].width = 100;
                }
                $.data(this,'col-width',expandCols[index].width);
                $.data(this,'col',expandCols[index]);
            });

            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;
            if(opts.height !== 'auto'){
                $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
            }



            //初始化排序状态
            if(opts.sortName){
                for(var colIndex=0; colIndex< expandCols.length; colIndex++){
                    var col = expandCols[colIndex];
                    if(col.sortName === opts.sortName || this._getColName(col) === opts.sortName){
                        var $th= $ths.eq(colIndex);
                        $.data($th.find('.mmg-title')[0],'sortStatus',opts.sortStatus);
                        $th.find('.mmg-sort').addClass('mmg-'+opts.sortStatus);
                    }
                }
            }
        }

        , _initOptions: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $backboard = this.$backboard;
            $mmGrid.find('a.mmg-btnBackboardDn').css({
                'top': $headWrapper.outerHeight(true)
            }).slideUp('fast');

            var cols = this._leafCols();
            if(cols){
                var bbHtml = [];
                for(var colIndex=0; colIndex<cols.length; colIndex++){
                    bbHtml.push('<label ');
                    if(cols[colIndex].checkCol || cols[colIndex].indexCol){
                        bbHtml.push('style="display:none;" ');
                    }
                    var col = cols[colIndex];
                    bbHtml.push('><input type="checkbox"  ');
                    if(!col.hidden) bbHtml.push('checked="checked"');
                    if(col.lockDisplay) bbHtml.push(' disabled="disabled"');
                    bbHtml.push('/><span>');
                    if(col.optionTitle || col.title){
                        bbHtml.push(col.optionTitle || col.title);
                    }else{
                        bbHtml.push('未命名');
                    }

                    bbHtml.push('</span></label>');
                }
                $backboard.append($(bbHtml.join('')));
            }
        }

        , _initEvents: function(){
            var that = this;
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $head = this.$head;
            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $backboard = this.$backboard;
            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;
            var leafCols = this._leafCols();

            //调整浏览器
            if(opts.width === 'auto' || opts.height === 'auto' || (typeof opts.width === 'string' && opts.width.indexOf('%') === opts.width.length-1) ||
                typeof opts.height === 'string' && opts.height.indexOf('%') === opts.height.length-1){
                $(window).on('resize', function(){
                    that.resize();
                });
            }

            //滚动条事件
            $bodyWrapper.on('scroll', function(){
                $head.css('left',- $(this).scrollLeft());
            });

            //向下按钮
            var $btnBackboardDn = $mmGrid.find('a.mmg-btnBackboardDn').on('click', function(){
                var backboardHeight = $mmGrid.height() - $headWrapper.outerHeight(true);
                if(opts.height === 'auto'&& opts.backboardMinHeight !== 'auto' && backboardHeight < opts.backboardMinHeight){
                    backboardHeight = opts.backboardMinHeight;
                }
                $backboard.height(backboardHeight);
                if(opts.height === 'auto'){
                    $mmGrid.height($headWrapper.outerHeight(true) + $backboard.outerHeight(true));
                }
                $backboard.slideDown();
                $btnBackboardDn.slideUp('fast');

                that._hideNoData();
            });
            $body.on('mouseenter', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $mmGrid.on('mouseleave', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $headWrapper.on('mouseenter',function(){
                if($backboard.is(':hidden') && opts.showBackboard){
                    $btnBackboardDn.slideDown('fast');
                }
            });
            //向上按钮
            $mmGrid.find('a.mmg-btnBackboardUp').on('click', function(){
                $backboard.slideUp().queue(function(next){
                    if(!that.rowsLength() || (that.rowsLength() === 1 && $body.find('tr.emptyRow').length === 1)){
                        that._showNoData();
                    }
                    if(opts.height === 'auto'){
                        $mmGrid.height('auto');
                    }
                    next();
                });
            });

            //隐藏列
            $backboard.on('click', ':checkbox', function(){
                var index = $backboard.find('label').index($(this).parent());
                //最后一个不隐藏
                var last = 1;
                if(opts.checkCol){
                    last = last + 1;
                }
                if(opts.indexCol){
                    last = last + 1;
                }
                if($backboard.find('label :checked').length < last){
                    this.checked = true;
                    return;
                }

                var col = leafCols[index];
                if(this.checked){
                    col.hidden = false;

                }else{
                    col.hidden = true;
                }

                var $ths = $head.find('th');
                for(var colIndex=$ths.length-1; colIndex>=0; colIndex--){
                    var $th = $ths.eq(colIndex);
                    var iCol = $th.data('col');
                    if(! iCol.isLeaf){
                        var hidden = true;
                        var colspan = 0;
                        $.each(iCol.nodes,function(index,item){
                            if(!item.hidden){
                                hidden = false;
                                colspan = colspan + item.colspan;
                            }
                        });
                        //IE bug
                        if(colspan !== 0){
                            iCol.colspan = colspan;
                            $th.prop('colspan',colspan);
                        }
                        iCol.hidden = hidden;
                    }
                }

                that._setColsWidth();
                $backboard.height($mmGrid.height() - $headWrapper.outerHeight(true));
                if(opts.height !== 'auto'){
                    $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
                }
                $mmGrid.find('a.mmg-btnBackboardDn').css({
                    'top': $headWrapper.outerHeight(true)
                })
            });



            //排序事件
            $head.on('click', '.mmg-title', function(){
                var $this = $(this);
                var $titles =  $ths.find('.mmg-title');

                //当前列不允许排序
                var col =$this.parent().parent().data('col');
                if(!col.sortable){
                    return;
                }
                //取得当前列下一个排序状态
                var sortStatus = $.data(this, 'sortStatus') === 'asc' ? 'desc' : 'asc';
                //清除排序状态
                $.each($titles, function(){
                    $.removeData(this,'sortStatus');
                });
                $ths.find('.mmg-sort').removeClass('mmg-asc').removeClass('mmg-desc');
                //设置当前列排序状态
                $.data(this, 'sortStatus', sortStatus);
                $this.siblings('.mmg-sort').addClass('mmg-'+sortStatus);

                if(opts.url && opts.remoteSort){
                    that.load()
                }else{
                    that._nativeSorter($.inArray(col, leafCols), sortStatus);
                    that._setStyle();
                }
            }).on('mousedown', '.mmg-colResize', function(e){
                //调整列宽
                var $resize = $(this);
                var start = e.pageX;
                var $colResizePointer = $mmGrid.find('.mmg-colResizePointer')
                    .css('left', e.pageX - $headWrapper.offset().left).show();

                var scrollLeft = $head.position().left;
                var $colResizePointerBefore = $mmGrid.find('.mmg-colResizePointer-before')
                    .css('left', $resize.parent().parent().position().left + scrollLeft).show();
                //取消文字选择
                document.selection && document.selection.empty && ( document.selection.empty(), 1)
                || window.getSelection && window.getSelection().removeAllRanges();
                document.body.onselectstart = function () {
                    return false;
                };
                $headWrapper.css('-moz-user-select','none');

                $mmGrid.on('mousemove', function(e){
                    $colResizePointer.css('left', e.pageX - $headWrapper.offset().left);
                }).on('mouseup', function(e){
                    //改变宽度
                    var $th = $resize.parent().parent();
                    var width = $th.width() + e.pageX - start;
                    $.data($th[0], 'col-width', width);
                    that._setColsWidth();
                    $headWrapper.mouseleave();
                }).on('mouseleave',function(){
                    $mmGrid.off('mouseup').off('mouseleave').off('mousemove');
                    $colResizePointer.hide();
                    $colResizePointerBefore.hide();
                    document.body.onselectstart = function(){
                        return true;//开启文字选择
                    };
                    $headWrapper.css('-moz-user-select','text');
                });
            });

            //选中事件
            var $body = this.$body;
            $body.on('click dblclick','td',function(e){
                //清除选中文本
                document.selection && document.selection.empty && ( document.selection.empty(), 1)
                || window.getSelection && window.getSelection().removeAllRanges();
                
                var $this = $(this);
                var event = jQuery.Event("cellSelected");
                event.target = e.target;
                that.$body.triggerHandler(event, [$.data($this.parent()[0], 'item'), $this.parent().index(), $this.index()]);

                if(event.isPropagationStopped()){
                    return;
                }
                if(!$this.parent().hasClass('selected')){
                    that.select($this.parent().index());
                }else{
                    that.deselect($this.parent().index());
                }
            });

            $body.on('click','tr > td .mmg-check',function(e){
                e.stopPropagation();
                var $this = $(this);
                if(this.checked){
                    that.select($($this.parents('tr')[0]).index());
                }else{
                    that.deselect($($this.parents('tr')[0]).index());
                }
            });

            //checkbox列
            if(opts.checkCol){
                $head.find('th .checkAll').on('click', function(){
                    if(this.checked){
                        that.select('all');
                    }else{
                        that.deselect('all');
                    }
                });
            }

            //IE6不支持hover
            if (browser.isIE6){
                $body.on('mouseenter','tr', function () {
                    $(this).toggleClass('hover');
                }).on('mouseleave','tr', function () {
                    $(this).toggleClass('hover');
                });
            };


        }

        //用来保存插件的初始化函数
        , _plugins_init_functions: []
        //执行插件初始化函数
        , _init_plugins: function(){
            for(var i=0; i < this._plugins_init_functions.length; i++){
                this._plugins_init_functions[i].call(this);
            }
        }
        , _getColName: function(col){
            var opts = this.opts;
            return col[this.opts.nameField];
        }
        , _rowHtml: function(item, rowIndex){
            var opts = this.opts;
            var expandCols = this.$fullColumns;
            var leafCols = this._leafCols();


            if($.isPlainObject(item)){
                var trHtml = [];
                trHtml.push('<tr>');
                for(var colIndex=0; colIndex < leafCols.length; colIndex++){
                    var col = leafCols[colIndex];
                    trHtml.push('<td class="');
                    var index =  $.inArray(col, expandCols);
                    trHtml.push(this._genColClass(index));
                    if(opts.nowrap){
                        trHtml.push(' nowrap');
                    }
                    trHtml.push('"><span class="');
                    if(opts.nowrap){
                        trHtml.push('nowrap');
                    }
                    trHtml.push('">');
                    if(col.renderer){
                        trHtml.push(col.renderer(item[this._getColName(col)],item,rowIndex));
                    }else{
                        trHtml.push(item[this._getColName(col)]);
                    }

                    trHtml.push('</span></td>');
                };
                trHtml.push('</tr>');
                return trHtml.join('');
            }
        }

        , _populate: function(items, append){
            var opts = this.opts;
            var $body = this.$body;
            var replace = false;
            var has_body = $body.find('tbody').size() > 0;
            
            if (!has_body || (!append && has_body))
                replace = true;

            this._hideNoData();
            if(items && items.length !== 0 && opts.cols){

                var tbodyHtmls = [];
                if (replace)
                    tbodyHtmls.push('<tbody>');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    var item = items[rowIndex];
                    tbodyHtmls.push(this._rowHtml(item, rowIndex));
                }
                if (replace)
                    tbodyHtmls.push('</tbody>');
                    
                if (replace)
                    $body.empty().html(tbodyHtmls.join(''));
                else
                    $body.find('tbody').append(tbodyHtmls.join(''));
                var $trs = $body.find('tr');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    $.data($trs.eq(rowIndex)[0],'item',items[rowIndex]);
                }
            }else{
                if (replace){
                    this._insertEmptyRow();
                    this._showNoData();
                }
            }
            this._setStyle();

            if(opts.fullWidthRows && this._loadCount <= 1){
                this._fullWidthRows();
            }

            this._hideLoading();
        }

        , _insertEmptyRow: function(){
            var $body = this.$body;
            $body.empty().html('<tbody><tr class="emptyRow"><td  style="border: 0px;background: none;">&nbsp;</td></tr></tbody>');
        }
        , _removeEmptyRow: function(){
            var $body = this.$body;
            $body.find('tr.emptyRow').remove();
        }

        /* 生成列类 */
        , _genColClass: function(colIndex){
            return 'mmg'+ this._id +'-col'+colIndex;
        }

        , _setStyle: function(){
            var $head = this.$head;
            var $ths = this._expandThs();
            var $body = this.$body;
            var leafCol = this._leafCols();

            //head
            $ths.eq(0).addClass('first');
            $ths.eq(-1).addClass('last');
            //body
            $body.find('tr,td').removeClass('even')
                .removeClass('colSelected').removeClass('colSelectedEven');

            $body.find('tr:odd').addClass('even');



            var sortIndex = $.inArray($head.find('.mmg-title').filter(function(){
                return $.data(this,'sortStatus') === 'asc' || $(this).data('sortStatus') === 'desc';
            }).parent().parent().data('col'), leafCol);

            $body.find('tr > td:nth-child('+(sortIndex+1)+')').addClass('colSelected')
                .filter(':odd').addClass('colSelectedEven');

            this._resizeHeight();

        }
        , _setColsWidth: function(){
            var opts = this.opts;
            var $style = this.$style;
            var $head = this.$head;

            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $ths = this._expandThs();
            var expandCols = this.$fullColumns;

            var scrollTop = $bodyWrapper.scrollTop();
            var scrollLeft = $head.position().left;

            $bodyWrapper.width(9999);
            $body.width('auto');
            var styleText = [];
            for(var colIndex=0; colIndex<$ths.length; colIndex++){
                var $th = $ths.eq(colIndex);
                styleText.push('.mmGrid .'+this._genColClass(colIndex) + ' {');
                var width = $.data($th[0],'col-width');
                styleText.push('width: '+ width +'px;');
                styleText.push('max-width: '+ width +'px;');

                var col = expandCols[colIndex];
                if(col.align){
                    styleText.push('text-align: '+col.align+';');
                }
                if(col.hidden){
                    styleText.push('display: none; ');
                }
                styleText.push(' }');
            }

            $body.detach();
            try{
                $style.text(styleText.join(''));
            }catch(error){
                $style[0].styleSheet.cssText = styleText.join('');//IE fix
            }
            $body.width($head.width());
            $bodyWrapper.width('100%');
            $bodyWrapper.append($body);

            //调整滚动条

            $bodyWrapper.scrollLeft(-scrollLeft);
            if($bodyWrapper.scrollLeft() === 0){
                $head.css('left', 0);
            }

            $bodyWrapper.scrollTop(scrollTop);
        }
        , _fullWidthRows: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $mmGrid = this.$mmGrid;
            var $head = this.$head;
            var scrollWidth = $bodyWrapper.width() - $bodyWrapper[0].clientWidth;

            if(scrollWidth && browser.isIE){
                scrollWidth = scrollWidth + 1;
            }

            var fitWidth =  $mmGrid.width() - $head.width() - scrollWidth;
            if(fitWidth < -20){
                return;
            }

            var thsArr = [];
            var $ths = this._leafThs();
            var leafCol = this._leafCols();
            for(var i=0; i< leafCol.length; i++){
                var col = leafCol[i];
                var $th = $ths.eq(i);
                if(!col.lockWidth && $th.is(':visible')){
                    thsArr.push($th);
                }
            }

            var increaseWidth =  Math.floor(fitWidth / thsArr.length);
            var maxColWidthIndex = 0;
            for(var i=0; i< thsArr.length; i++){
                var $th = thsArr[i];
                var colWidth = $.data($th[0], 'col-width') + increaseWidth;
                $.data($th[0], 'col-width', colWidth);

                var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
                if(maxColWidth < colWidth){
                    maxColWidthIndex = i;
                }
            }

            var remainWidth =  fitWidth -  increaseWidth * thsArr.length;
            var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
            $.data(thsArr[maxColWidthIndex][0], 'col-width', maxColWidth + remainWidth);
            this._setColsWidth();
        }


        , _showLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').show();

            var $loading = $mmGrid.find('.mmg-loading');
            $loading.css({
                'left': ($mmGrid.width() - $loading.width()) / 2,
                'top': ($mmGrid.height() - $loading.height()) / 2
            }).show();
        }
        , _hideLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').hide();
            $mmGrid.find('.mmg-loading').hide();
        }
        , _showNoData: function(){
            this._showMessage(this.opts.noDataText);
        }
        , _hideNoData: function(){
            this._hideMessage();
        }

        , _showMessage: function(msg){
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $message = $mmGrid.find('.mmg-message');
            $message.css({
                'left': ($mmGrid.width() - $message.width()) / 2,
                'top': ($mmGrid.height() + $headWrapper.height()  - $message.height()) / 2
            }).text(msg).show();
        }
        , _hideMessage: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-message').hide();
        }

        , _nativeSorter: function(colIndex, sortStatus){
            var leafCols = this._leafCols();
            var col = leafCols[colIndex];

            this.$body.find('tr > td:nth-child('+(colIndex+1)+')')
                .sortElements(function(a, b){
                    var av = $.text($(a));
                    var bv = $.text($(b));
                    //排序前转换
                    if(col.type === 'number'){
                        av = parseFloat(av);
                        bv = parseFloat(bv);
                    }else{
                        //各个浏览器localeCompare的结果不一致
                        return sortStatus === 'desc' ? -av.localeCompare(bv)  : av.localeCompare(bv);
                    }
                    return av > bv ? (sortStatus === 'desc' ? -1 : 1) : (sortStatus === 'desc' ? 1 : -1);
                }, function(){
                    return this.parentNode;
                });
        }

        , _refreshSortStatus: function(){
            var $ths = this.$head.find('th');
            var sortColIndex = -1;
            var sortStatus = '';
            $ths.find('.mmg-title').each(function(index, item){
                var status = $.data(item, 'sortStatus');
                if(status){
                    sortColIndex = index;
                    sortStatus = status;
                }
            });
            var sortStatus = sortStatus === 'desc' ? 'asc' : 'desc';
            if(sortColIndex >=0){
                $ths.eq(sortColIndex).find('.mmg-title').data('sortStatus',sortStatus).click();
            }
        }

        , _loadAjax: function(args, append){
            var that = this;
            var opts = this.opts;
            var params = {};
            //opt的params可以使函数，例如收集过滤的参数
            if($.isFunction(opts.params)){
                params = $.extend(params, opts.params());
            }else if($.isPlainObject(opts.params)){
                params = $.extend(params, opts.params);
            }

            if(opts.remoteSort){
                var sortName = '';
                var sortStatus = '';
                var $titles = this.$head.find('.mmg-title');
                for(var colIndex=0; colIndex<$titles.length; colIndex++){
                    var status = $.data($titles[colIndex], 'sortStatus');
                    if(status){
                        var col = $titles.eq(colIndex).parent().parent().data('col');
                        sortName = col.sortName ?
                            col.sortName : this._getColName(col);
                        sortStatus = status;
                    }
                }
                if(sortName){
                    params.sort = sortName+'.'+sortStatus;
                }
            }

            //插件参数合并
            for(var i=0; i< this.opts.plugins.length; i++){
                var plugin = this.opts.plugins[i];
                $.extend(params, plugin.params());
            }

            //合并load的参数
            params = $.extend(params, args);
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: params,
                dataType: 'json',
                cache: opts.cache
            }).done(function(data){
                //获得root对象
                var items = data;
                that.$page = data.page || 1;
                that.$limit = data.limit || 0;
                if($.isArray(data[opts.root])){
                    items = data[opts.root];
                }
                that.$runing = 1;
                that._populate(items, append);
                that.$runing = 0;
                that._updateIndex(append);
                if(!opts.remoteSort){
                    that._refreshSortStatus();
                }

                that.$body.triggerHandler('loadSuccess', data);

            }).fail(function(data){
                that.$body.triggerHandler('loadError', data);
            });

        }

        , _loadNative: function(args){
            this._populate(args);
            this._refreshSortStatus();
            this.$body.triggerHandler('loadSuccess', args);
        }
        , load: function(args, append){
            var opts = this.opts;
            this._hideMessage();
            this._showLoading();
            this._loadCount = this._loadCount + 1 ;

            if($.isArray(args)){
                //加载本地数据
                this._loadNative(args);
            }else if(opts.url){
                this._loadAjax(args, append);
            }else if(opts.items){
                this._loadNative(opts.items);
            }else{
                this._loadNative([]);
            }
        }

        //重设尺寸
        , resize: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;

            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(opts.height !== 'auto'){
                if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                    $mmGrid.height('100%');
                    $mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
                }else{
                    $mmGrid.height(opts.height);
                }

                $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
            }

            //调整message
            var $message = $mmGrid.find('.mmg-message');
            if($message.is(':visible')){
                $message.css({
                    'left': ($mmGrid.width() - $message.width()) / 2,
                    'top': ($mmGrid.height() + $headWrapper.height() - $message.height()) / 2
                });
            }
            //调整loading
            var $mask = $mmGrid.find('.mmg-mask');
            if($mask.is(':visible')){
                $mask.width($mmGrid.width()).height($mmGrid.height());
                var $loadingWrapper = $mmGrid.find('.mmg-loading');
                $loadingWrapper.css({
                    'left': ($mmGrid.width() - $loadingWrapper.width()) / 2,
                    'top': ($mmGrid.height() - $loadingWrapper.height()) / 2
                })
            }

            $bodyWrapper.trigger('scroll');

            this._resizeHeight();
        }

        , _resizeHeight: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $body= this.$body;
            if(opts.height === 'auto' && browser.isIE7){
                $bodyWrapper.height('auto');
                if($bodyWrapper.width() < $body.width()){
                    $bodyWrapper.height($bodyWrapper.height() + $bodyWrapper.height() - $bodyWrapper[0].clientHeight  + 1);
                }
            }
        }

        , _updateIndex: function(append){
            if(this.opts.indexCol && !this.$runing){
                var $body = this.$body;
                var index_col = this.opts.cols[0][0];
                var start = (this.$page - 1) * this.$limit;
                if (append)
                    start = 0;
                $body.find('tr').each(function(index, el){
                    var col = $(el).find('td:first');
                    col.html(index_col.renderer(null, null, start+index));
                });
            }
        }

            //选中
        , select: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;

            if(typeof args === 'number'){
                var $tr = $body.find('tr').eq(args);
                if(!opts.multiSelect){
                    $body.find('tr.selected').removeClass('selected');
                    if(opts.checkCol){
                        $body.find('tr > td').find('.mmg-check').prop('checked','');
                    }
                }
                if(!$tr.hasClass('selected')){
                    $tr.addClass('selected');
                    if(opts.checkCol){
                        $tr.find('td .mmg-check').prop('checked','checked');
                    }
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        var $this = $(this);
                        if(!$this.hasClass('selected')){
                            $this.addClass('selected');
                            if(opts.checkCol){
                                $this.find('td .mmg-check').prop('checked','checked');
                            }
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                $body.find('tr').addClass('selected');
                $body.find('tr > td').find('.mmg-check').prop('checked','checked');
            }else{
                return;
            }

            if(opts.checkCol){
                var $checks = $body.find('tr > td').find('.mmg-check');
                if($checks.length === $checks.filter(':checked').length){
                    $head.find('th .checkAll').prop('checked','checked');
                }
            }


        }
            //取消选中
        , deselect: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;
            if(typeof args === 'number'){
                $body.find('tr').eq(args).removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr').eq(args).find('td .mmg-check').prop('checked','');
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        $(this).removeClass('selected');
                        if(opts.checkCol){
                            $(this).find('td .mmg-check').prop('checked','');
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr > td').find('.mmg-check').prop('checked','');
                }
            }else{
                return;
            }

            $head.find('th .checkAll').prop('checked','');

        }
        , selectedRows: function(){
            var $body = this.$body;
            var selected = [];
            $.each($body.find('tr.selected'), function(index ,item){
                selected.push($.data(this,'item'));
            });
            return selected;
        }

        , selectedRowsIndex: function(){
            var $body = this.$body;
            var $trs = this.$body.find('tr')
            var selected = [];
            $.each($body.find('tr.selected'), function(index){
                selected.push($trs.index(this));
            });
            return selected;
        }

        , rows: function(){
            var $body = this.$body;
            var items = [];
            $.each($body.find('tr'), function(){
                items.push($.data(this,'item'));
            });
            return items;
        }

        , row: function(index){
            var $body = this.$body;
            if(index !== undefined && index >= 0){
                var $tr = $body.find('tr').eq(index);
                if($tr.length !== 0){
                    return $.data($tr[0],'item');
                }
            }
        }

        , rowsLength: function(){
            var $body = this.$body;
            var length = $body.find('tr').length;
            if(length === 1 && $body.find('tr.emptyRow').length === 1){
                return 0;
            }
            return length;
        }

        //添加数据，第一个参数可以为数组
        , addRow: function(item, index){
            var $tbody = this.$body.find('tbody');

            if($.isArray(item)){
                for(var i=item.length-1; i >= 0; i--){
                    this.addRow(item[i], index);
                }
                return ;
            }

            if(!$.isPlainObject(item)){
                return ;
            }

            this._hideNoData();
            this._removeEmptyRow();

            var $tr;

            if(index === undefined || index < 0){
                $tr = $(this._rowHtml(item, this.rowsLength()));
                $tbody.append($tr);
            }else{
                $tr = $(this._rowHtml(item, index));
                if(index === 0){
                    $tbody.prepend($tr);
                }else{
                    var $before = $tbody.find('tr').eq(index-1);
                    //找不到就插到最后
                    if($before.length === 0){
                        $tbody.append($tr);
                    }else{
                        $before.after($($tr));
                    }
                }
            }
            $tr.data('item', item);
            this._setStyle();

            //update index
            this._updateIndex();
            this.$body.triggerHandler('rowInserted', [item, index]);
        }
        //更新行内容，两个参数都必填
        , updateRow: function(item, index){
            var opts = this.opts;
            var $tbody = this.$body.find('tbody');
            if(!$.isPlainObject(item)){
                return ;
            }
            var oldItem = this.row(index);

            var $tr = $tbody.find('tr').eq(index);
            var checked = $tr.find('td:first :checkbox').is(':checked');
            $tr.html(this._rowHtml(item, index).slice(4,-5));
            if(opts.checkCol){
                $tr.find('td:first :checkbox').prop('checked',checked);
            }

            $tr.data('item', item);
            this._setStyle();

            this.$body.triggerHandler('rowUpdated', [oldItem, item, index]);
        }

        //删除行，参数可以为索引数组
        , removeRow: function(index){
            var that = this;
            var $tbody = that.$body.find('tbody');

            if($.isArray(index)){
                for(var i=index.length-1; i >= 0; i--){
                    that.removeRow(index[i]);
                }
                return ;
            }

            if(index === undefined){
                var $trs = $tbody.find('tr');
                for(var i=$trs.length-1; i >= 0; i--){
                    that.removeRow(i);
                }
            }else{
                var item = that.row(index);
                $tbody.find('tr').eq(index).remove();
                this.$body.triggerHandler('rowRemoved', [item, index]);
            }
            this._setStyle();
            if(this.rowsLength() === 0){
                this._showNoData();
                this._insertEmptyRow();
            }
            //update index
            this._updateIndex();
        }
    };

    $.fn.mmGrid = function(){
        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , data = this.data('mmGrid')
                , options = $.extend(true, {}, $.fn.mmGrid.defaults, option);
            if (!data) {
                data = new MMGrid(this, options);
                this.data('mmGrid', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            var data = this.data('mmGrid');
            var fn =  data[arguments[0]];
            if(fn){
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.mmGrid.defaults = {
        width: 'auto'
        , height: '280px'
        , cols: []
        , url: false
        , params: {}
        , method: 'POST'
        , cache: false
        , root: 'items'
        , nameField: 'name'
        , items: []
        , autoLoad: true
        , remoteSort: false
        , sortName: ''
        , sortStatus: 'asc'
        , loadingText: '正在载入...'
        , noDataText: '没有数据'
        , multiSelect: false
        , checkCol: false
        , indexCol: false
        , indexColWidth: 30
        , fullWidthRows: false
        , nowrap: false
        , showBackboard: true
        , backboardMinHeight: 125
        , plugins: [] //插件 插件必须实现 init($mmGrid)和params()方法，参考mmPaginator
    };
//  event : loadSuccess(e,data), loadError(e, data), cellSelected(e, item, rowIndex, colIndex)
//          rowInserted(e,item, rowIndex), rowUpdated(e, oldItem, newItem, rowIndex), rowRemoved(e,item, rowIndex)
//


    $.fn.mmGrid.Constructor = MMGrid;
    
    //添加插件支持
    $.fn.mmGrid.addPlugin = function(plugin){
        $.extend($.fn.mmGrid.defaults, plugin.defaults);
        $.extend(MMGrid.prototype, plugin.methods);
        if (plugin._init){
            MMGrid.prototype._plugins_init_functions.push(plugin._init);
        }
    }


    // see: http://james.padolsey.com/javascript/sorting-elements-with-jquery/
    $.fn.sortElements = (function(){
        var sort = [].sort;
        return function(comparator, getSortable) {
            getSortable = getSortable || function(){return this;};
            var placements = this.map(function(){
                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );
                return function() {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }
                    parentNode.insertBefore(this, nextSibling);
                    parentNode.removeChild(nextSibling);
                };
            });
            return sort.call(this, comparator).each(function(i){
                placements[i].call(getSortable.call(this));
            });
        };
    })();
}(window.jQuery);
!function($){
    var MMPaginator = function(element, options){
        this.$el = $(element);
        this.opts = options;
    };

    MMPaginator.prototype = {
        _initLayout: function(){
            var that = this;
            var $el = this.$el;
            var opts = this.opts;

            $el.addClass("mmPaginator");
            var pgHtmls = [
                '<div class="totalCountLabel"></div>',
                '<ul class="pageList"></ul>',
                '<div class="limit"><select></select></div>'
            ];
            $el.append($(pgHtmls.join('')));
            
            this.$totalCountLabel = $el.find('.totalCountLabel');
            this.$pageList = $el.find('.pageList');
            this.$limitList = $el.find('.limit select');
            this.$infinite_stop = false;
            this.$lastScrollX = 0;
            var body = this.$mmGrid.$bodyWrapper;
            this.$bodyBottom = body.offset().top + body.height();
            
             var $limitList = this.$limitList
            $.each(opts.limitList, function(){
                var $option = $('<option></option>')
                    .prop('value',this)
                    .text(that.formatString(opts.limitLabel,[this]));
                $limitList.append($option);
            });

            $limitList.on('change', function(){
                that.$mmGrid.load();
            });
            
            //if infinite, then hidden the element
            if (opts.infinite){
                $el.find('ul.pageList, div.limit').hide();
            }

            var scrolling;

            if (typeof window.define === 'function' && window.define.amd !== undefined) {
                scrolling = require("scrolling")    
            } else {
                scrolling = window.scrolling;

            }
            scrolling(this.$mmGrid.$bodyWrapper[0], function(){
                if (!opts.infinite) return;
                var top = that.$mmGrid.$bodyWrapper.scrollTop();
                var last = that.$lastScrollX;
                that.$lastScrollX = top;
                if (last < top)
                    that._check_visible();
            });
            
        }

        , _plain: function(page, totalCount, limit){
            var that = this;
            var $el = this.$el;
            var $pageList = this.$pageList;

            var totalPage = totalCount % limit === 0 ? parseInt(totalCount/limit) : parseInt(totalCount/limit) + 1;
            totalPage = totalPage ? totalPage : 0;
            if(totalPage === 0){
                page = 1;
            }else if(page > totalPage){
                page = totalPage;
            }else if(page < 1 && totalPage != 0){
                page = 1;
            }
            //
            var $prev = $('<li class="prev"><a>'+that.opts.prev+'</a></li>');
            if(page<=1){
                $prev.addClass('disable');
            }else{
                $prev.find('a').on('click', function(){
                    $el.data('page', page-1);
                    that.$mmGrid.load();
                });
            }
            $pageList.append($prev);
            /////
            var list = [1];
            if(page > 4 ){
                list.push('...');
            }
            for(var i= 0; i < 5; i++){
                var no = page - 2 + i;
                if(no > 1 && no <= totalPage-1){
                    list.push(no);
                }
            }
            if(page+1 < totalPage-1){
                list.push('...');
            }
            if(totalPage>1){
                list.push(totalPage);
            }
            $.each(list, function(index, item){
                var $li = $('<li><a></a></li>');
                if(item === '...'){
                    $li.addClass('').html('...');
                }else if(item === page){
                    $li.addClass('active').find('a').text(item);
                }else{
                    $li.find('a').text(item).prop('title','第'+item+'页').on('click', function(e){
                        $el.data('page', item);
                        that.$mmGrid.load();
                    });
                }
                $pageList.append($li);
            });
            //
            var $next = $('<li class="next"><a>'+that.opts.next+'</a></li>');
            if(page>=totalPage){
                $next.addClass('disable');
            }else{
                $next.find('a').on('click', function(){
                    $el.data('page', page+1);
                    that.$mmGrid.load();
                });
            }
            $pageList.append($next);
        }

        , _search: function(page, totalCount, limit){

        }

        , load: function(params){
            var $el = this.$el;
            var $limitList = this.$limitList;
            var opts = this.opts;

            var page = params[opts.pageParamName];
            if(page === undefined || page === null){
                page = $el.data('page');
            }
            $el.data('page', page);

            var totalCount = params[opts.totalCountName];
            if(totalCount === undefined){
                totalCount = 0;
            }
            $el.data('totalCount', totalCount);
            this.$infinite_stop = false;

            var limit = params[opts.limitParamName];
            if(!limit){
                limit = $limitList.val();
            }
            this.$limitList.val(limit);

            this.$totalCountLabel.html(this.formatString(opts.totalCountLabel,[totalCount]));
            this.$pageList.empty();

            this._plain(page, totalCount, this.$limitList.val());
            
            this._check_visible();
        }
        
        , _test_visible: function(el){
            var top = $(el).offset().top;
            
            return top < this.$bodyBottom;
        }

        , _check_visible: function(){
            var opts = this.opts;
            
            if (!opts.infinite) return;
            
            var $el = this.$el;
            var page = $el.data('page');
            var limit = parseInt(this.$limitList.val());
            var total = $el.data('totalCount');

            if (page+limit-1<total){
                var $tbody = this.$mmGrid.$body.find('tbody');
                var el = $tbody.find('tr:last');
                var that = this;
                
                if (el.size()>0){
                    if (this._test_visible(el)){
                        $el.data('page', page+1);
                        that.$mmGrid.load({}, true);
                    }
                }
            }
        }
        
        , formatString: function(text, args){
            return text.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        }

        , params: function(){
            var opts = this.opts;
            var $el = this.$el;
            var $limitList = this.$limitList;

            var params = {};
            params[opts.pageParamName] = $el.data('page');
            params[opts.limitParamName] = $limitList.val();
            return params;
        }

        , init: function($grid){
            var that = this;
            var opts = that.opts;
            this.$mmGrid = $grid;
            this._initLayout();
            this.$mmGrid.on('loadSuccess', function(e, data){
                that.load(data);
            });

            var params = {};
            params[opts.totalCountName] = 0;
            params[opts.pageParamName] = opts.page;
            params[opts.limitParamName] = opts.limit;
            this.load(params);

            if($grid.opts.indexCol){
                var indexCol = $grid.opts.cols[0];
                indexCol.renderer = function(val,item,rowIndex){
                    var params = that.params();
                    return '<label class="mmg-index">' +
                        (rowIndex + 1 + ((params[opts.pageParamName]-1) * params[opts.limitParamName])) +
                        '</label>';
                };
            }

        }

    };

    $.fn.mmPaginator = function(){

        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , data = this.data('mmPaginator')
                , options = $.extend(true, {}, $.fn.mmPaginator.defaults, option);
            if (!data) {
                data = new MMPaginator(this[0], options);
                this.data('mmPaginator', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            var data = this.data('mmPaginator');
            var fn =  data[arguments[0]];
            if(fn){
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.mmPaginator.defaults = {
         style: 'plain'
        , totalCountName: 'totalCount'
        , page: 1
        , prev: '上一页'
        , next: '下一页'
        , pageParamName: 'page'
        , limitParamName: 'limit'
        , limitLabel: '每页{0}条'
        , totalCountLabel: '共<span>{0}</span>条记录'
        , limit: undefined
        , limitList: [20, 30, 40, 50]
        , infinite: false  //无限分页，要与mmPaginator配合
    };

    $.fn.mmPaginator.Constructor = MMPaginator;

}(window.jQuery);
/*! gridster.js - v0.5.6 - 2014-09-25
* http://gridster.net/
* Copyright (c) 2014 ducksboard; Licensed MIT */

;(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define('gridster-coords', ['jquery'], factory);
    } else {
       root.GridsterCoords = factory(root.$ || root.jQuery);
    }

}(this, function($) {
    /**
    * Creates objects with coordinates (x1, y1, x2, y2, cx, cy, width, height)
    * to simulate DOM elements on the screen.
    * Coords is used by Gridster to create a faux grid with any DOM element can
    * collide.
    *
    * @class Coords
    * @param {HTMLElement|Object} obj The jQuery HTMLElement or a object with: left,
    * top, width and height properties.
    * @return {Object} Coords instance.
    * @constructor
    */
    function Coords(obj) {
        if (obj[0] && $.isPlainObject(obj[0])) {
            this.data = obj[0];
        }else {
            this.el = obj;
        }

        this.isCoords = true;
        this.coords = {};
        this.init();
        return this;
    }


    var fn = Coords.prototype;


    fn.init = function(){
        this.set();
        this.original_coords = this.get();
    };


    fn.set = function(update, not_update_offsets) {
        var el = this.el;

        if (el && !update) {
            this.data = el.offset();
            this.data.width = el.width();
            this.data.height = el.height();
        }

        if (el && update && !not_update_offsets) {
            var offset = el.offset();
            this.data.top = offset.top;
            this.data.left = offset.left;
        }

        var d = this.data;

        typeof d.left === 'undefined' && (d.left = d.x1);
        typeof d.top === 'undefined' && (d.top = d.y1);

        this.coords.x1 = d.left;
        this.coords.y1 = d.top;
        this.coords.x2 = d.left + d.width;
        this.coords.y2 = d.top + d.height;
        this.coords.cx = d.left + (d.width / 2);
        this.coords.cy = d.top + (d.height / 2);
        this.coords.width  = d.width;
        this.coords.height = d.height;
        this.coords.el  = el || false ;

        return this;
    };


    fn.update = function(data){
        if (!data && !this.el) {
            return this;
        }

        if (data) {
            var new_data = $.extend({}, this.data, data);
            this.data = new_data;
            return this.set(true, true);
        }

        this.set(true);
        return this;
    };


    fn.get = function(){
        return this.coords;
    };

    fn.destroy = function() {
        this.el.removeData('coords');
        delete this.el;
    };

    //jQuery adapter
    $.fn.coords = function() {
        if (this.data('coords') ) {
            return this.data('coords');
        }

        var ins = new Coords(this, arguments[0]);
        this.data('coords', ins);
        return ins;
    };

    return Coords;

}));

;(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define('gridster-collision', ['jquery', 'gridster-coords'], factory);
    } else {
        root.GridsterCollision = factory(root.$ || root.jQuery,
            root.GridsterCoords);
    }

}(this, function($, Coords) {

    var defaults = {
        colliders_context: document.body,
        overlapping_region: 'C'
        // ,on_overlap: function(collider_data){},
        // on_overlap_start : function(collider_data){},
        // on_overlap_stop : function(collider_data){}
    };


    /**
    * Detects collisions between a DOM element against other DOM elements or
    * Coords objects.
    *
    * @class Collision
    * @uses Coords
    * @param {HTMLElement} el The jQuery wrapped HTMLElement.
    * @param {HTMLElement|Array} colliders Can be a jQuery collection
    *  of HTMLElements or an Array of Coords instances.
    * @param {Object} [options] An Object with all options you want to
    *        overwrite:
    *   @param {String} [options.overlapping_region] Determines when collision
    *    is valid, depending on the overlapped area. Values can be: 'N', 'S',
    *    'W', 'E', 'C' or 'all'. Default is 'C'.
    *   @param {Function} [options.on_overlap_start] Executes a function the first
    *    time each `collider ` is overlapped.
    *   @param {Function} [options.on_overlap_stop] Executes a function when a
    *    `collider` is no longer collided.
    *   @param {Function} [options.on_overlap] Executes a function when the
    * mouse is moved during the collision.
    * @return {Object} Collision instance.
    * @constructor
    */
    function Collision(el, colliders, options) {
        this.options = $.extend(defaults, options);
        this.$element = el;
        this.last_colliders = [];
        this.last_colliders_coords = [];
        this.set_colliders(colliders);

        this.init();
    }

    Collision.defaults = defaults;

    var fn = Collision.prototype;


    fn.init = function() {
        this.find_collisions();
    };


    fn.overlaps = function(a, b) {
        var x = false;
        var y = false;

        if ((b.x1 >= a.x1 && b.x1 <= a.x2) ||
            (b.x2 >= a.x1 && b.x2 <= a.x2) ||
            (a.x1 >= b.x1 && a.x2 <= b.x2)
        ) { x = true; }

        if ((b.y1 >= a.y1 && b.y1 <= a.y2) ||
            (b.y2 >= a.y1 && b.y2 <= a.y2) ||
            (a.y1 >= b.y1 && a.y2 <= b.y2)
        ) { y = true; }

        return (x && y);
    };


    fn.detect_overlapping_region = function(a, b){
        var regionX = '';
        var regionY = '';

        if (a.y1 > b.cy && a.y1 < b.y2) { regionX = 'N'; }
        if (a.y2 > b.y1 && a.y2 < b.cy) { regionX = 'S'; }
        if (a.x1 > b.cx && a.x1 < b.x2) { regionY = 'W'; }
        if (a.x2 > b.x1 && a.x2 < b.cx) { regionY = 'E'; }

        return (regionX + regionY) || 'C';
    };


    fn.calculate_overlapped_area_coords = function(a, b){
        var x1 = Math.max(a.x1, b.x1);
        var y1 = Math.max(a.y1, b.y1);
        var x2 = Math.min(a.x2, b.x2);
        var y2 = Math.min(a.y2, b.y2);

        return $({
            left: x1,
            top: y1,
             width : (x2 - x1),
            height: (y2 - y1)
          }).coords().get();
    };


    fn.calculate_overlapped_area = function(coords){
        return (coords.width * coords.height);
    };


    fn.manage_colliders_start_stop = function(new_colliders_coords, start_callback, stop_callback){
        var last = this.last_colliders_coords;

        for (var i = 0, il = last.length; i < il; i++) {
            if ($.inArray(last[i], new_colliders_coords) === -1) {
                start_callback.call(this, last[i]);
            }
        }

        for (var j = 0, jl = new_colliders_coords.length; j < jl; j++) {
            if ($.inArray(new_colliders_coords[j], last) === -1) {
                stop_callback.call(this, new_colliders_coords[j]);
            }

        }
    };


    fn.find_collisions = function(player_data_coords){
        var self = this;
        var overlapping_region = this.options.overlapping_region;
        var colliders_coords = [];
        var colliders_data = [];
        var $colliders = (this.colliders || this.$colliders);
        var count = $colliders.length;
        var player_coords = self.$element.coords()
                             .update(player_data_coords || false).get();

        while(count--){
          var $collider = self.$colliders ?
                           $($colliders[count]) : $colliders[count];
          var $collider_coords_ins = ($collider.isCoords) ?
                  $collider : $collider.coords();
          var collider_coords = $collider_coords_ins.get();
          var overlaps = self.overlaps(player_coords, collider_coords);

          if (!overlaps) {
            continue;
          }

          var region = self.detect_overlapping_region(
              player_coords, collider_coords);

            //todo: make this an option
            if (region === overlapping_region || overlapping_region === 'all') {

                var area_coords = self.calculate_overlapped_area_coords(
                    player_coords, collider_coords);
                var area = self.calculate_overlapped_area(area_coords);
                var collider_data = {
                    area: area,
                    area_coords : area_coords,
                    region: region,
                    coords: collider_coords,
                    player_coords: player_coords,
                    el: $collider
                };

                if (self.options.on_overlap) {
                    self.options.on_overlap.call(this, collider_data);
                }
                colliders_coords.push($collider_coords_ins);
                colliders_data.push(collider_data);
            }
        }

        if (self.options.on_overlap_stop || self.options.on_overlap_start) {
            this.manage_colliders_start_stop(colliders_coords,
                self.options.on_overlap_start, self.options.on_overlap_stop);
        }

        this.last_colliders_coords = colliders_coords;

        return colliders_data;
    };


    fn.get_closest_colliders = function(player_data_coords){
        var colliders = this.find_collisions(player_data_coords);

        colliders.sort(function(a, b) {
            /* if colliders are being overlapped by the "C" (center) region,
             * we have to set a lower index in the array to which they are placed
             * above in the grid. */
            if (a.region === 'C' && b.region === 'C') {
                if (a.coords.y1 < b.coords.y1 || a.coords.x1 < b.coords.x1) {
                    return - 1;
                }else{
                    return 1;
                }
            }

            if (a.area < b.area) {
                return 1;
            }

            return 1;
        });
        return colliders;
    };


    fn.set_colliders = function(colliders) {
        if (typeof colliders === 'string' || colliders instanceof $) {
            this.$colliders = $(colliders,
                 this.options.colliders_context).not(this.$element);
        }else{
            this.colliders = $(colliders);
        }
    };


    //jQuery adapter
    $.fn.collision = function(collider, options) {
          return new Collision( this, collider, options );
    };

    return Collision;

}));

;(function(window, undefined) {

    /* Delay, debounce and throttle functions taken from underscore.js
     *
     * Copyright (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and
     * Investigative Reporters & Editors
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     */

    window.delay = function(func, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return func.apply(null, args); }, wait);
    };

    window.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          if (immediate && !timeout) func.apply(context, args);
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
    };

    window.throttle = function(func, wait) {
        var context, args, timeout, throttling, more, result;
        var whenDone = debounce(
            function(){ more = throttling = false; }, wait);
        return function() {
          context = this; args = arguments;
          var later = function() {
            timeout = null;
            if (more) func.apply(context, args);
            whenDone();
          };
          if (!timeout) timeout = setTimeout(later, wait);
          if (throttling) {
            more = true;
          } else {
            result = func.apply(context, args);
          }
          whenDone();
          throttling = true;
          return result;
        };
    };

})(window);

;(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define('gridster-draggable', ['jquery'], factory);
    } else {
        root.GridsterDraggable = factory(root.$ || root.jQuery);
    }

}(this, function($) {

    var defaults = {
        items: 'li',
        distance: 1,
        limit: true,
        offset_left: 0,
        autoscroll: true,
        ignore_dragging: ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'], // or function
        handle: null,
        container_width: 0,  // 0 == auto
        move_element: true,
        helper: false,  // or 'clone'
        remove_helper: true
        // drag: function(e) {},
        // start : function(e, ui) {},
        // stop : function(e) {}
    };

    var $window = $(window);
    var dir_map = { x : 'left', y : 'top' };
    var isTouch = !!('ontouchstart' in window);

    var capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    var idCounter = 0;
    var uniqId = function() {
        return ++idCounter + '';
    }

    /**
    * Basic drag implementation for DOM elements inside a container.
    * Provide start/stop/drag callbacks.
    *
    * @class Draggable
    * @param {HTMLElement} el The HTMLelement that contains all the widgets
    *  to be dragged.
    * @param {Object} [options] An Object with all options you want to
    *        overwrite:
    *    @param {HTMLElement|String} [options.items] Define who will
    *     be the draggable items. Can be a CSS Selector String or a
    *     collection of HTMLElements.
    *    @param {Number} [options.distance] Distance in pixels after mousedown
    *     the mouse must move before dragging should start.
    *    @param {Boolean} [options.limit] Constrains dragging to the width of
    *     the container
    *    @param {Object|Function} [options.ignore_dragging] Array of node names
    *      that sould not trigger dragging, by default is `['INPUT', 'TEXTAREA',
    *      'SELECT', 'BUTTON']`. If a function is used return true to ignore dragging.
    *    @param {offset_left} [options.offset_left] Offset added to the item
    *     that is being dragged.
    *    @param {Number} [options.drag] Executes a callback when the mouse is
    *     moved during the dragging.
    *    @param {Number} [options.start] Executes a callback when the drag
    *     starts.
    *    @param {Number} [options.stop] Executes a callback when the drag stops.
    * @return {Object} Returns `el`.
    * @constructor
    */
    function Draggable(el, options) {
      this.options = $.extend({}, defaults, options);
      this.$document = $(document);
      this.$container = $(el);
      this.$dragitems = $(this.options.items, this.$container);
      this.is_dragging = false;
      this.player_min_left = 0 + this.options.offset_left;
      this.id = uniqId();
      this.ns = '.gridster-draggable-' + this.id;
      this.init();
    }

    Draggable.defaults = defaults;

    var fn = Draggable.prototype;

    fn.init = function() {
        var pos = this.$container.css('position');
        this.calculate_dimensions();
        this.$container.css('position', pos === 'static' ? 'relative' : pos);
        this.disabled = false;
        this.events();

        $(window).bind(this.nsEvent('resize'),
            throttle($.proxy(this.calculate_dimensions, this), 200));
    };

    fn.nsEvent = function(ev) {
        return (ev || '') + this.ns;
    };

    fn.events = function() {
        this.pointer_events = {
            start: this.nsEvent('touchstart') + ' ' + this.nsEvent('mousedown'),
            move: this.nsEvent('touchmove') + ' ' + this.nsEvent('mousemove'),
            end: this.nsEvent('touchend') + ' ' + this.nsEvent('mouseup'),
        };

        this.$container.on(this.nsEvent('selectstart'),
            $.proxy(this.on_select_start, this));

        this.$container.on(this.pointer_events.start, this.options.items,
            $.proxy(this.drag_handler, this));

        this.$document.on(this.pointer_events.end, $.proxy(function(e) {
            this.is_dragging = false;
            if (this.disabled) { return; }
            this.$document.off(this.pointer_events.move);
            if (this.drag_start) {
                this.on_dragstop(e);
            }
        }, this));
    };

    fn.get_actual_pos = function($el) {
        var pos = $el.position();
        return pos;
    };


    fn.get_mouse_pos = function(e) {
        if (e.originalEvent && e.originalEvent.touches) {
            var oe = e.originalEvent;
            e = oe.touches.length ? oe.touches[0] : oe.changedTouches[0];
        }

        return {
            left: e.clientX,
            top: e.clientY
        };
    };


    fn.get_offset = function(e) {
        e.preventDefault();
        var mouse_actual_pos = this.get_mouse_pos(e);
        var diff_x = Math.round(
            mouse_actual_pos.left - this.mouse_init_pos.left);
        var diff_y = Math.round(mouse_actual_pos.top - this.mouse_init_pos.top);

        var left = Math.round(this.el_init_offset.left +
            diff_x - this.baseX + $(window).scrollLeft() - this.win_offset_x);
        var top = Math.round(this.el_init_offset.top +
            diff_y - this.baseY + $(window).scrollTop() - this.win_offset_y);

        if (this.options.limit) {
            if (left > this.player_max_left) {
                left = this.player_max_left;
            } else if(left < this.player_min_left) {
                left = this.player_min_left;
            }
        }

        return {
            position: {
                left: left,
                top: top
            },
            pointer: {
                left: mouse_actual_pos.left,
                top: mouse_actual_pos.top,
                diff_left: diff_x + ($(window).scrollLeft() - this.win_offset_x),
                diff_top: diff_y + ($(window).scrollTop() - this.win_offset_y)
            }
        };
    };


    fn.get_drag_data = function(e) {
        var offset = this.get_offset(e);
        offset.$player = this.$player;
        offset.$helper = this.helper ? this.$helper : this.$player;

        return offset;
    };


    fn.set_limits = function(container_width) {
        container_width || (container_width = this.$container.width());
        this.player_max_left = (container_width - this.player_width +
            - this.options.offset_left);

        this.options.container_width = container_width;

        return this;
    };


    fn.scroll_in = function(axis, data) {
        var dir_prop = dir_map[axis];

        var area_size = 50;
        var scroll_inc = 30;

        var is_x = axis === 'x';
        var window_size = is_x ? this.window_width : this.window_height;
        var doc_size = is_x ? $(document).width() : $(document).height();
        var player_size = is_x ? this.$player.width() : this.$player.height();

        var next_scroll;
        var scroll_offset = $window['scroll' + capitalize(dir_prop)]();
        var min_window_pos = scroll_offset;
        var max_window_pos = min_window_pos + window_size;

        var mouse_next_zone = max_window_pos - area_size;  // down/right
        var mouse_prev_zone = min_window_pos + area_size;  // up/left

        var abs_mouse_pos = min_window_pos + data.pointer[dir_prop];

        var max_player_pos = (doc_size - window_size + player_size);

        if (abs_mouse_pos >= mouse_next_zone) {
            next_scroll = scroll_offset + scroll_inc;
            if (next_scroll < max_player_pos) {
                $window['scroll' + capitalize(dir_prop)](next_scroll);
                this['scroll_offset_' + axis] += scroll_inc;
            }
        }

        if (abs_mouse_pos <= mouse_prev_zone) {
            next_scroll = scroll_offset - scroll_inc;
            if (next_scroll > 0) {
                $window['scroll' + capitalize(dir_prop)](next_scroll);
                this['scroll_offset_' + axis] -= scroll_inc;
            }
        }

        return this;
    };


    fn.manage_scroll = function(data) {
        this.scroll_in('x', data);
        this.scroll_in('y', data);
    };


    fn.calculate_dimensions = function(e) {
        this.window_height = $window.height();
        this.window_width = $window.width();
    };


    fn.drag_handler = function(e) {
        var node = e.target.nodeName;
        // skip if drag is disabled, or click was not done with the mouse primary button
        if (this.disabled || e.which !== 1 && !isTouch) {
            return;
        }

        if (this.ignore_drag(e)) {
            return;
        }

        var self = this;
        var first = true;
        this.$player = $(e.currentTarget);

        this.el_init_pos = this.get_actual_pos(this.$player);
        this.mouse_init_pos = this.get_mouse_pos(e);
        this.offsetY = this.mouse_init_pos.top - this.el_init_pos.top;

        this.$document.on(this.pointer_events.move, function(mme) {
            var mouse_actual_pos = self.get_mouse_pos(mme);
            var diff_x = Math.abs(
                mouse_actual_pos.left - self.mouse_init_pos.left);
            var diff_y = Math.abs(
                mouse_actual_pos.top - self.mouse_init_pos.top);
            if (!(diff_x > self.options.distance ||
                diff_y > self.options.distance)
                ) {
                return false;
            }

            if (first) {
                first = false;
                self.on_dragstart.call(self, mme);
                return false;
            }

            if (self.is_dragging === true) {
                self.on_dragmove.call(self, mme);
            }

            return false;
        });

        if (!isTouch) { return false; }
    };


    fn.on_dragstart = function(e) {
        e.preventDefault();

        if (this.is_dragging) { return this; }

        this.drag_start = this.is_dragging = true;
        var offset = this.$container.offset();
        this.baseX = Math.round(offset.left);
        this.baseY = Math.round(offset.top);
        this.initial_container_width = this.options.container_width || this.$container.width();

        if (this.options.helper === 'clone') {
            this.$helper = this.$player.clone()
                .appendTo(this.$container).addClass('helper');
            this.helper = true;
        } else {
            this.helper = false;
        }

        this.win_offset_y = $(window).scrollTop();
        this.win_offset_x = $(window).scrollLeft();
        this.scroll_offset_y = 0;
        this.scroll_offset_x = 0;
        this.el_init_offset = this.$player.offset();
        this.player_width = this.$player.width();
        this.player_height = this.$player.height();

        this.set_limits(this.options.container_width);

        if (this.options.start) {
            this.options.start.call(this.$player, e, this.get_drag_data(e));
        }
        return false;
    };


    fn.on_dragmove = function(e) {
        var data = this.get_drag_data(e);

        this.options.autoscroll && this.manage_scroll(data);

        if (this.options.move_element) {
            (this.helper ? this.$helper : this.$player).css({
                'position': 'absolute',
                'left' : data.position.left,
                'top' : data.position.top
            });
        }

        var last_position = this.last_position || data.position;
        data.prev_position = last_position;

        if (this.options.drag) {
            this.options.drag.call(this.$player, e, data);
        }

        this.last_position = data.position;
        return false;
    };


    fn.on_dragstop = function(e) {
        var data = this.get_drag_data(e);
        this.drag_start = false;

        if (this.options.stop) {
            this.options.stop.call(this.$player, e, data);
        }

        if (this.helper && this.options.remove_helper) {
            this.$helper.remove();
        }

        return false;
    };

    fn.on_select_start = function(e) {
        if (this.disabled) { return; }

        if (this.ignore_drag(e)) {
            return;
        }

        return false;
    };

    fn.enable = function() {
        this.disabled = false;
    };

    fn.disable = function() {
        this.disabled = true;
    };

    fn.destroy = function() {
        this.disable();

        this.$container.off(this.ns);
        this.$document.off(this.ns);
        $(window).off(this.ns);

        $.removeData(this.$container, 'drag');
    };

    fn.ignore_drag = function(event) {
        if (this.options.handle) {
            return !$(event.target).is(this.options.handle);
        }

        if ($.isFunction(this.options.ignore_dragging)) {
            return this.options.ignore_dragging(event);
        }

        return $(event.target).is(this.options.ignore_dragging.join(', '));
    };

    //jQuery adapter
    $.fn.drag = function ( options ) {
        return new Draggable(this, options);
    };

    return Draggable;

}));

;(function(root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'gridster-draggable', 'gridster-collision'], factory);
    } else {
        root.Gridster = factory(root.$ || root.jQuery, root.GridsterDraggable,
            root.GridsterCollision);
    }

 }(this, function($, Draggable, Collision) {

    var defaults = {
        namespace: '',
        widget_selector: 'li',
        widget_margins: [10, 10],
        widget_base_dimensions: [400, 225],
        extra_rows: 0,
        extra_cols: 0,
        min_cols: 1,
        max_cols: Infinity,
        min_rows: 15,
        max_size_x: false,
        autogrow_cols: false,
        autogenerate_stylesheet: true,
        avoid_overlapped_widgets: true,
        auto_init: true,
        serialize_params: function($w, wgd) {
            return {
                col: wgd.col,
                row: wgd.row,
                size_x: wgd.size_x,
                size_y: wgd.size_y
            };
        },
        collision: {},
        draggable: {
            items: '.gs-w',
            distance: 4,
            ignore_dragging: Draggable.defaults.ignore_dragging.slice(0)
        },
        resize: {
            enabled: false,
            axes: ['both'],
            handle_append_to: '',
            handle_class: 'gs-resize-handle',
            max_size: [Infinity, Infinity],
            min_size: [1, 1]
        }
    };

    /**
    * @class Gridster
    * @uses Draggable
    * @uses Collision
    * @param {HTMLElement} el The HTMLelement that contains all the widgets.
    * @param {Object} [options] An Object with all options you want to
    *        overwrite:
    *    @param {HTMLElement|String} [options.widget_selector] Define who will
    *     be the draggable widgets. Can be a CSS Selector String or a
    *     collection of HTMLElements
    *    @param {Array} [options.widget_margins] Margin between widgets.
    *     The first index for the horizontal margin (left, right) and
    *     the second for the vertical margin (top, bottom).
    *    @param {Array} [options.widget_base_dimensions] Base widget dimensions
    *     in pixels. The first index for the width and the second for the
    *     height.
    *    @param {Number} [options.extra_cols] Add more columns in addition to
    *     those that have been calculated.
    *    @param {Number} [options.extra_rows] Add more rows in addition to
    *     those that have been calculated.
    *    @param {Number} [options.min_cols] The minimum required columns.
    *    @param {Number} [options.max_cols] The maximum columns possible (set to null
    *     for no maximum).
    *    @param {Number} [options.min_rows] The minimum required rows.
    *    @param {Number} [options.max_size_x] The maximum number of columns
    *     that a widget can span.
    *    @param {Boolean} [options.autogenerate_stylesheet] If true, all the
    *     CSS required to position all widgets in their respective columns
    *     and rows will be generated automatically and injected to the
    *     `<head>` of the document. You can set this to false, and write
    *     your own CSS targeting rows and cols via data-attributes like so:
    *     `[data-col="1"] { left: 10px; }`
    *    @param {Boolean} [options.avoid_overlapped_widgets] Avoid that widgets loaded
    *     from the DOM can be overlapped. It is helpful if the positions were
    *     bad stored in the database or if there was any conflict.
    *    @param {Boolean} [options.auto_init] Automatically call gridster init
    *     method or not when the plugin is instantiated.
    *    @param {Function} [options.serialize_params] Return the data you want
    *     for each widget in the serialization. Two arguments are passed:
    *     `$w`: the jQuery wrapped HTMLElement, and `wgd`: the grid
    *     coords object (`col`, `row`, `size_x`, `size_y`).
    *    @param {Object} [options.collision] An Object with all options for
    *     Collision class you want to overwrite. See Collision docs for
    *     more info.
    *    @param {Object} [options.draggable] An Object with all options for
    *     Draggable class you want to overwrite. See Draggable docs for more
    *     info.
    *       @param {Object|Function} [options.draggable.ignore_dragging] Note that
    *        if you use a Function, and resize is enabled, you should ignore the
    *        resize handlers manually (options.resize.handle_class).
    *    @param {Object} [options.resize] An Object with resize config options.
    *       @param {Boolean} [options.resize.enabled] Set to true to enable
    *        resizing.
    *       @param {Array} [options.resize.axes] Axes in which widgets can be
    *        resized. Possible values: ['x', 'y', 'both'].
    *       @param {String} [options.resize.handle_append_to] Set a valid CSS
    *        selector to append resize handles to.
    *       @param {String} [options.resize.handle_class] CSS class name used
    *        by resize handles.
    *       @param {Array} [options.resize.max_size] Limit widget dimensions
    *        when resizing. Array values should be integers:
    *        `[max_cols_occupied, max_rows_occupied]`
    *       @param {Array} [options.resize.min_size] Limit widget dimensions
    *        when resizing. Array values should be integers:
    *        `[min_cols_occupied, min_rows_occupied]`
    *       @param {Function} [options.resize.start] Function executed
    *        when resizing starts.
    *       @param {Function} [otions.resize.resize] Function executed
    *        during the resizing.
    *       @param {Function} [options.resize.stop] Function executed
    *        when resizing stops.
    *
    * @constructor
    */
    function Gridster(el, options) {
        this.options = $.extend(true, {}, defaults, options);
        this.$el = $(el);
        this.$wrapper = this.$el.parent();
        this.$widgets = this.$el.children(
            this.options.widget_selector).addClass('gs-w');
        this.widgets = [];
        this.$changed = $([]);
        this.wrapper_width = this.$wrapper.width();
        this.min_widget_width = (this.options.widget_margins[0] * 2) +
          this.options.widget_base_dimensions[0];
        this.min_widget_height = (this.options.widget_margins[1] * 2) +
          this.options.widget_base_dimensions[1];

        this.generated_stylesheets = [];
        this.$style_tags = $([]);

        this.options.auto_init && this.init();
    }

    Gridster.defaults = defaults;
    Gridster.generated_stylesheets = [];


    /**
    * Sorts an Array of grid coords objects (representing the grid coords of
    * each widget) in ascending way.
    *
    * @method sort_by_row_asc
    * @param {Array} widgets Array of grid coords objects
    * @return {Array} Returns the array sorted.
    */
    Gridster.sort_by_row_asc = function(widgets) {
        widgets = widgets.sort(function(a, b) {
            if (!a.row) {
                a = $(a).coords().grid;
                b = $(b).coords().grid;
            }

           if (a.row > b.row) {
               return 1;
           }
           return -1;
        });

        return widgets;
    };


    /**
    * Sorts an Array of grid coords objects (representing the grid coords of
    * each widget) placing first the empty cells upper left.
    *
    * @method sort_by_row_and_col_asc
    * @param {Array} widgets Array of grid coords objects
    * @return {Array} Returns the array sorted.
    */
    Gridster.sort_by_row_and_col_asc = function(widgets) {
        widgets = widgets.sort(function(a, b) {
           if (a.row > b.row || a.row === b.row && a.col > b.col) {
               return 1;
           }
           return -1;
        });

        return widgets;
    };


    /**
    * Sorts an Array of grid coords objects by column (representing the grid
    * coords of each widget) in ascending way.
    *
    * @method sort_by_col_asc
    * @param {Array} widgets Array of grid coords objects
    * @return {Array} Returns the array sorted.
    */
    Gridster.sort_by_col_asc = function(widgets) {
        widgets = widgets.sort(function(a, b) {
           if (a.col > b.col) {
               return 1;
           }
           return -1;
        });

        return widgets;
    };


    /**
    * Sorts an Array of grid coords objects (representing the grid coords of
    * each widget) in descending way.
    *
    * @method sort_by_row_desc
    * @param {Array} widgets Array of grid coords objects
    * @return {Array} Returns the array sorted.
    */
    Gridster.sort_by_row_desc = function(widgets) {
        widgets = widgets.sort(function(a, b) {
            if (a.row + a.size_y < b.row + b.size_y) {
                return 1;
            }
           return -1;
        });
        return widgets;
    };



    /** Instance Methods **/

    var fn = Gridster.prototype;

    fn.init = function() {
        this.options.resize.enabled && this.setup_resize();
        this.generate_grid_and_stylesheet();
        this.get_widgets_from_DOM();
        this.set_dom_grid_height();
        this.set_dom_grid_width();
        this.$wrapper.addClass('ready');
        this.draggable();
        this.options.resize.enabled && this.resizable();

        $(window).bind('resize.gridster', throttle(
            $.proxy(this.recalculate_faux_grid, this), 200));
    };


    /**
    * Disables dragging.
    *
    * @method disable
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.disable = function() {
        this.$wrapper.find('.player-revert').removeClass('player-revert');
        this.drag_api.disable();
        return this;
    };


    /**
    * Enables dragging.
    *
    * @method enable
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.enable = function() {
        this.drag_api.enable();
        return this;
    };



    /**
    * Disables drag-and-drop widget resizing.
    *
    * @method disable
    * @return {Class} Returns instance of gridster Class.
    */
    fn.disable_resize = function() {
        this.$el.addClass('gs-resize-disabled');
        this.resize_api.disable();
        return this;
    };


    /**
    * Enables drag-and-drop widget resizing.
    *
    * @method enable
    * @return {Class} Returns instance of gridster Class.
    */
    fn.enable_resize = function() {
        this.$el.removeClass('gs-resize-disabled');
        this.resize_api.enable();
        return this;
    };


    /**
    * Add a new widget to the grid.
    *
    * @method add_widget
    * @param {String|HTMLElement} html The string representing the HTML of the widget
    *  or the HTMLElement.
    * @param {Number} [size_x] The nº of rows the widget occupies horizontally.
    * @param {Number} [size_y] The nº of columns the widget occupies vertically.
    * @param {Number} [col] The column the widget should start in.
    * @param {Number} [row] The row the widget should start in.
    * @param {Array} [max_size] max_size Maximun size (in units) for width and height.
    * @param {Array} [min_size] min_size Minimum size (in units) for width and height.
    * @return {HTMLElement} Returns the jQuery wrapped HTMLElement representing.
    *  the widget that was just created.
    */
    fn.add_widget = function(html, size_x, size_y, col, row, max_size, min_size) {
        var pos;
        size_x || (size_x = 1);
        size_y || (size_y = 1);

        if (!col & !row) {
            pos = this.next_position(size_x, size_y);
        } else {
            pos = {
                col: col,
                row: row,
                size_x: size_x,
                size_y: size_y
            };

            this.empty_cells(col, row, size_x, size_y);
        }

        var $w = $(html).attr({
                'data-col': pos.col,
                'data-row': pos.row,
                'data-sizex' : size_x,
                'data-sizey' : size_y
            }).addClass('gs-w').appendTo(this.$el).hide();

        this.$widgets = this.$widgets.add($w);

        this.register_widget($w);

        this.add_faux_rows(pos.size_y);
        //this.add_faux_cols(pos.size_x);

        if (max_size) {
            this.set_widget_max_size($w, max_size);
        }

        if (min_size) {
            this.set_widget_min_size($w, min_size);
        }

        this.set_dom_grid_width();
        this.set_dom_grid_height();

        this.drag_api.set_limits(this.cols * this.min_widget_width);

        return $w.fadeIn();
    };


    /**
    * Change widget size limits.
    *
    * @method set_widget_min_size
    * @param {HTMLElement|Number} $widget The jQuery wrapped HTMLElement
    *  representing the widget or an index representing the desired widget.
    * @param {Array} min_size Minimum size (in units) for width and height.
    * @return {HTMLElement} Returns instance of gridster Class.
    */
    fn.set_widget_min_size = function($widget, min_size) {
        $widget = typeof $widget === 'number' ?
            this.$widgets.eq($widget) : $widget;

        if (!$widget.length) { return this; }

        var wgd = $widget.data('coords').grid;
        wgd.min_size_x = min_size[0];
        wgd.min_size_y = min_size[1];

        return this;
    };


    /**
    * Change widget size limits.
    *
    * @method set_widget_max_size
    * @param {HTMLElement|Number} $widget The jQuery wrapped HTMLElement
    *  representing the widget or an index representing the desired widget.
    * @param {Array} max_size Maximun size (in units) for width and height.
    * @return {HTMLElement} Returns instance of gridster Class.
    */
    fn.set_widget_max_size = function($widget, max_size) {
        $widget = typeof $widget === 'number' ?
            this.$widgets.eq($widget) : $widget;

        if (!$widget.length) { return this; }

        var wgd = $widget.data('coords').grid;
        wgd.max_size_x = max_size[0];
        wgd.max_size_y = max_size[1];

        return this;
    };


    /**
    * Append the resize handle into a widget.
    *
    * @method add_resize_handle
    * @param {HTMLElement} $widget The jQuery wrapped HTMLElement
    *  representing the widget.
    * @return {HTMLElement} Returns instance of gridster Class.
    */
    fn.add_resize_handle = function($w) {
        var append_to = this.options.resize.handle_append_to;
        $(this.resize_handle_tpl).appendTo( append_to ? $(append_to, $w) : $w);

        return this;
    };


    /**
    * Change the size of a widget. Width is limited to the current grid width.
    *
    * @method resize_widget
    * @param {HTMLElement} $widget The jQuery wrapped HTMLElement
    *  representing the widget.
    * @param {Number} size_x The number of columns that will occupy the widget.
    *  By default <code>size_x</code> is limited to the space available from
    *  the column where the widget begins, until the last column to the right.
    * @param {Number} size_y The number of rows that will occupy the widget.
    * @param {Function} [callback] Function executed when the widget is removed.
    * @return {HTMLElement} Returns $widget.
    */
    fn.resize_widget = function($widget, size_x, size_y, callback) {
        var wgd = $widget.coords().grid;
        var col = wgd.col;
        var max_cols = this.options.max_cols;
        var old_size_y = wgd.size_y;
        var old_col = wgd.col;
        var new_col = old_col;

        size_x || (size_x = wgd.size_x);
        size_y || (size_y = wgd.size_y);

        if (max_cols !== Infinity) {
            size_x = Math.min(size_x, max_cols - col + 1);
        }

        if (size_y > old_size_y) {
            this.add_faux_rows(Math.max(size_y - old_size_y, 0));
        }

        var player_rcol = (col + size_x - 1);
        if (player_rcol > this.cols) {
            this.add_faux_cols(player_rcol - this.cols);
        }

        var new_grid_data = {
            col: new_col,
            row: wgd.row,
            size_x: size_x,
            size_y: size_y
        };

        this.mutate_widget_in_gridmap($widget, wgd, new_grid_data);

        this.set_dom_grid_height();
        this.set_dom_grid_width();

        if (callback) {
            callback.call(this, new_grid_data.size_x, new_grid_data.size_y);
        }

        return $widget;
    };


    /**
    * Mutate widget dimensions and position in the grid map.
    *
    * @method mutate_widget_in_gridmap
    * @param {HTMLElement} $widget The jQuery wrapped HTMLElement
    *  representing the widget to mutate.
    * @param {Object} wgd Current widget grid data (col, row, size_x, size_y).
    * @param {Object} new_wgd New widget grid data.
    * @return {HTMLElement} Returns instance of gridster Class.
    */
    fn.mutate_widget_in_gridmap = function($widget, wgd, new_wgd) {
        var old_size_x = wgd.size_x;
        var old_size_y = wgd.size_y;

        var old_cells_occupied = this.get_cells_occupied(wgd);
        var new_cells_occupied = this.get_cells_occupied(new_wgd);

        var empty_cols = [];
        $.each(old_cells_occupied.cols, function(i, col) {
            if ($.inArray(col, new_cells_occupied.cols) === -1) {
                empty_cols.push(col);
            }
        });

        var occupied_cols = [];
        $.each(new_cells_occupied.cols, function(i, col) {
            if ($.inArray(col, old_cells_occupied.cols) === -1) {
                occupied_cols.push(col);
            }
        });

        var empty_rows = [];
        $.each(old_cells_occupied.rows, function(i, row) {
            if ($.inArray(row, new_cells_occupied.rows) === -1) {
                empty_rows.push(row);
            }
        });

        var occupied_rows = [];
        $.each(new_cells_occupied.rows, function(i, row) {
            if ($.inArray(row, old_cells_occupied.rows) === -1) {
                occupied_rows.push(row);
            }
        });

        this.remove_from_gridmap(wgd);

        if (occupied_cols.length) {
            var cols_to_empty = [
                new_wgd.col, new_wgd.row, new_wgd.size_x, Math.min(old_size_y, new_wgd.size_y), $widget
            ];
            this.empty_cells.apply(this, cols_to_empty);
        }

        if (occupied_rows.length) {
            var rows_to_empty = [new_wgd.col, new_wgd.row, new_wgd.size_x, new_wgd.size_y, $widget];
            this.empty_cells.apply(this, rows_to_empty);
        }

        // not the same that wgd = new_wgd;
        wgd.col = new_wgd.col;
        wgd.row = new_wgd.row;
        wgd.size_x = new_wgd.size_x;
        wgd.size_y = new_wgd.size_y;

        this.add_to_gridmap(new_wgd, $widget);

        $widget.removeClass('player-revert');

        //update coords instance attributes
        $widget.data('coords').update({
            width: (new_wgd.size_x * this.options.widget_base_dimensions[0] +
                ((new_wgd.size_x - 1) * this.options.widget_margins[0]) * 2),
            height: (new_wgd.size_y * this.options.widget_base_dimensions[1] +
                ((new_wgd.size_y - 1) * this.options.widget_margins[1]) * 2)
        });

        $widget.attr({
            'data-col': new_wgd.col,
            'data-row': new_wgd.row,
            'data-sizex': new_wgd.size_x,
            'data-sizey': new_wgd.size_y
        });

        if (empty_cols.length) {
            var cols_to_remove_holes = [
                empty_cols[0], new_wgd.row,
                empty_cols.length,
                Math.min(old_size_y, new_wgd.size_y),
                $widget
            ];

            this.remove_empty_cells.apply(this, cols_to_remove_holes);
        }

        if (empty_rows.length) {
            var rows_to_remove_holes = [
                new_wgd.col, new_wgd.row, new_wgd.size_x, new_wgd.size_y, $widget
            ];
            this.remove_empty_cells.apply(this, rows_to_remove_holes);
        }

        this.move_widget_up($widget);

        return this;
    };


    /**
    * Move down widgets in cells represented by the arguments col, row, size_x,
    * size_y
    *
    * @method empty_cells
    * @param {Number} col The column where the group of cells begin.
    * @param {Number} row The row where the group of cells begin.
    * @param {Number} size_x The number of columns that the group of cells
    * occupy.
    * @param {Number} size_y The number of rows that the group of cells
    * occupy.
    * @param {HTMLElement} $exclude Exclude widgets from being moved.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.empty_cells = function(col, row, size_x, size_y, $exclude) {
        var $nexts = this.widgets_below({
                col: col,
                row: row - size_y,
                size_x: size_x,
                size_y: size_y
            });

        $nexts.not($exclude).each($.proxy(function(i, w) {
            var wgd = $(w).coords().grid;
            if ( !(wgd.row <= (row + size_y - 1))) { return; }
            var diff =  (row + size_y) - wgd.row;
            this.move_widget_down($(w), diff);
        }, this));

        this.set_dom_grid_height();

        return this;
    };


    /**
    * Move up widgets below cells represented by the arguments col, row, size_x,
    * size_y.
    *
    * @method remove_empty_cells
    * @param {Number} col The column where the group of cells begin.
    * @param {Number} row The row where the group of cells begin.
    * @param {Number} size_x The number of columns that the group of cells
    * occupy.
    * @param {Number} size_y The number of rows that the group of cells
    * occupy.
    * @param {HTMLElement} exclude Exclude widgets from being moved.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.remove_empty_cells = function(col, row, size_x, size_y, exclude) {
        var $nexts = this.widgets_below({
            col: col,
            row: row,
            size_x: size_x,
            size_y: size_y
        });

        $nexts.not(exclude).each($.proxy(function(i, widget) {
            this.move_widget_up( $(widget), size_y );
        }, this));

        this.set_dom_grid_height();

        return this;
    };


    /**
    * Get the most left column below to add a new widget.
    *
    * @method next_position
    * @param {Number} size_x The nº of rows the widget occupies horizontally.
    * @param {Number} size_y The nº of columns the widget occupies vertically.
    * @return {Object} Returns a grid coords object representing the future
    *  widget coords.
    */
    fn.next_position = function(size_x, size_y) {
        size_x || (size_x = 1);
        size_y || (size_y = 1);
        var ga = this.gridmap;
        var cols_l = ga.length;
        var valid_pos = [];
        var rows_l;

        for (var c = 1; c < cols_l; c++) {
            rows_l = ga[c].length;
            for (var r = 1; r <= rows_l; r++) {
                var can_move_to = this.can_move_to({
                    size_x: size_x,
                    size_y: size_y
                }, c, r);

                if (can_move_to) {
                    valid_pos.push({
                        col: c,
                        row: r,
                        size_y: size_y,
                        size_x: size_x
                    });
                }
            }
        }

        if (valid_pos.length) {
            return Gridster.sort_by_row_and_col_asc(valid_pos)[0];
        }
        return false;
    };


    /**
    * Remove a widget from the grid.
    *
    * @method remove_widget
    * @param {HTMLElement} el The jQuery wrapped HTMLElement you want to remove.
    * @param {Boolean|Function} silent If true, widgets below the removed one
    * will not move up. If a Function is passed it will be used as callback.
    * @param {Function} callback Function executed when the widget is removed.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.remove_widget = function(el, silent, callback) {
        var $el = el instanceof $ ? el : $(el);
        var wgd = $el.coords().grid;

        // if silent is a function assume it's a callback
        if ($.isFunction(silent)) {
            callback = silent;
            silent = false;
        }

        this.cells_occupied_by_placeholder = {};
        this.$widgets = this.$widgets.not($el);

        var $nexts = this.widgets_below($el);

        this.remove_from_gridmap(wgd);

        $el.fadeOut($.proxy(function() {
            $el.remove();

            if (!silent) {
                $nexts.each($.proxy(function(i, widget) {
                    this.move_widget_up( $(widget), wgd.size_y );
                }, this));
            }

            this.set_dom_grid_height();

            if (callback) {
                callback.call(this, el);
            }
        }, this));

        return this;
    };


    /**
    * Remove all widgets from the grid.
    *
    * @method remove_all_widgets
    * @param {Function} callback Function executed for each widget removed.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.remove_all_widgets = function(callback) {
        this.$widgets.each($.proxy(function(i, el){
              this.remove_widget(el, true, callback);
        }, this));

        return this;
    };


    /**
    * Returns a serialized array of the widgets in the grid.
    *
    * @method serialize
    * @param {HTMLElement} [$widgets] The collection of jQuery wrapped
    *  HTMLElements you want to serialize. If no argument is passed all widgets
    *  will be serialized.
    * @return {Array} Returns an Array of Objects with the data specified in
    *  the serialize_params option.
    */
    fn.serialize = function($widgets) {
        $widgets || ($widgets = this.$widgets);

        return $widgets.map($.proxy(function(i, widget) {
            var $w = $(widget);
            return this.options.serialize_params($w, $w.coords().grid);
        }, this)).get();
    };


    /**
    * Returns a serialized array of the widgets that have changed their
    *  position.
    *
    * @method serialize_changed
    * @return {Array} Returns an Array of Objects with the data specified in
    *  the serialize_params option.
    */
    fn.serialize_changed = function() {
        return this.serialize(this.$changed);
    };


    /**
    * Convert widgets from DOM elements to "widget grid data" Objects.
    *
    * @method dom_to_coords
    * @param {HTMLElement} $widget The widget to be converted.
    */
    fn.dom_to_coords = function($widget) {
        return {
            'col': parseInt($widget.attr('data-col'), 10),
            'row': parseInt($widget.attr('data-row'), 10),
            'size_x': parseInt($widget.attr('data-sizex'), 10) || 1,
            'size_y': parseInt($widget.attr('data-sizey'), 10) || 1,
            'max_size_x': parseInt($widget.attr('data-max-sizex'), 10) || false,
            'max_size_y': parseInt($widget.attr('data-max-sizey'), 10) || false,
            'min_size_x': parseInt($widget.attr('data-min-sizex'), 10) || false,
            'min_size_y': parseInt($widget.attr('data-min-sizey'), 10) || false,
            'el': $widget
        };
    };


    /**
    * Creates the grid coords object representing the widget an add it to the
    * mapped array of positions.
    *
    * @method register_widget
    * @param {HTMLElement|Object} $el jQuery wrapped HTMLElement representing
    *  the widget, or an "widget grid data" Object with (col, row, el ...).
    * @return {Boolean} Returns true if the widget final position is different
    *  than the original.
    */
    fn.register_widget = function($el) {
        var isDOM = $el instanceof jQuery;
        var wgd = isDOM ? this.dom_to_coords($el) : $el;
        var posChanged = false;
        isDOM || ($el = wgd.el);

        var empty_upper_row = this.can_go_widget_up(wgd);
        if (empty_upper_row) {
            wgd.row = empty_upper_row;
            $el.attr('data-row', empty_upper_row);
            this.$el.trigger('gridster:positionchanged', [wgd]);
            posChanged = true;
        }

        if (this.options.avoid_overlapped_widgets &&
            !this.can_move_to(
             {size_x: wgd.size_x, size_y: wgd.size_y}, wgd.col, wgd.row)
        ) {
            $.extend(wgd, this.next_position(wgd.size_x, wgd.size_y));
            $el.attr({
                'data-col': wgd.col,
                'data-row': wgd.row,
                'data-sizex': wgd.size_x,
                'data-sizey': wgd.size_y
            });
            posChanged = true;
        }

        // attach Coord object to player data-coord attribute
        $el.data('coords', $el.coords());
        // Extend Coord object with grid position info
        $el.data('coords').grid = wgd;

        this.add_to_gridmap(wgd, $el);

        this.options.resize.enabled && this.add_resize_handle($el);

        return posChanged;
    };


    /**
    * Update in the mapped array of positions the value of cells represented by
    * the grid coords object passed in the `grid_data` param.
    *
    * @param {Object} grid_data The grid coords object representing the cells
    *  to update in the mapped array.
    * @param {HTMLElement|Boolean} value Pass `false` or the jQuery wrapped
    *  HTMLElement, depends if you want to delete an existing position or add
    *  a new one.
    * @method update_widget_position
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.update_widget_position = function(grid_data, value) {
        this.for_each_cell_occupied(grid_data, function(col, row) {
            if (!this.gridmap[col]) { return this; }
            this.gridmap[col][row] = value;
        });
        return this;
    };


    /**
    * Remove a widget from the mapped array of positions.
    *
    * @method remove_from_gridmap
    * @param {Object} grid_data The grid coords object representing the cells
    *  to update in the mapped array.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.remove_from_gridmap = function(grid_data) {
        return this.update_widget_position(grid_data, false);
    };


    /**
    * Add a widget to the mapped array of positions.
    *
    * @method add_to_gridmap
    * @param {Object} grid_data The grid coords object representing the cells
    *  to update in the mapped array.
    * @param {HTMLElement|Boolean} value The value to set in the specified
    *  position .
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.add_to_gridmap = function(grid_data, value) {
        this.update_widget_position(grid_data, value || grid_data.el);

        if (grid_data.el) {
            var $widgets = this.widgets_below(grid_data.el);
            $widgets.each($.proxy(function(i, widget) {
                this.move_widget_up( $(widget));
            }, this));
        }
    };


    /**
    * Make widgets draggable.
    *
    * @uses Draggable
    * @method draggable
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.draggable = function() {
        var self = this;
        var draggable_options = $.extend(true, {}, this.options.draggable, {
            offset_left: this.options.widget_margins[0],
            offset_top: this.options.widget_margins[1],
            container_width: this.cols * this.min_widget_width,
            limit: true,
            start: function(event, ui) {
                self.$widgets.filter('.player-revert')
                    .removeClass('player-revert');

                self.$player = $(this);
                self.$helper = $(ui.$helper);

                self.helper = !self.$helper.is(self.$player);

                self.on_start_drag.call(self, event, ui);
                self.$el.trigger('gridster:dragstart');
            },
            stop: function(event, ui) {
                self.on_stop_drag.call(self, event, ui);
                self.$el.trigger('gridster:dragstop');
            },
            drag: throttle(function(event, ui) {
                self.on_drag.call(self, event, ui);
                self.$el.trigger('gridster:drag');
            }, 60)
          });

        this.drag_api = this.$el.drag(draggable_options);
        return this;
    };


    /**
    * Bind resize events to get resize working.
    *
    * @method resizable
    * @return {Class} Returns instance of gridster Class.
    */
    fn.resizable = function() {
        this.resize_api = this.$el.drag({
            items: '.' + this.options.resize.handle_class,
            offset_left: this.options.widget_margins[0],
            container_width: this.container_width,
            move_element: false,
            resize: true,
            limit: this.options.autogrow_cols ? false : true,
            start: $.proxy(this.on_start_resize, this),
            stop: $.proxy(function(event, ui) {
                delay($.proxy(function() {
                    this.on_stop_resize(event, ui);
                }, this), 120);
            }, this),
            drag: throttle($.proxy(this.on_resize, this), 60)
        });

        return this;
    };


    /**
    * Setup things required for resizing. Like build templates for drag handles.
    *
    * @method setup_resize
    * @return {Class} Returns instance of gridster Class.
    */
    fn.setup_resize = function() {
        this.resize_handle_class = this.options.resize.handle_class;
        var axes = this.options.resize.axes;
        var handle_tpl = '<span class="' + this.resize_handle_class + ' ' +
            this.resize_handle_class + '-{type}" />';

        this.resize_handle_tpl = $.map(axes, function(type) {
            return handle_tpl.replace('{type}', type);
        }).join('');

        if ($.isArray(this.options.draggable.ignore_dragging)) {
            this.options.draggable.ignore_dragging.push(
                '.' + this.resize_handle_class);
        }

        return this;
    };


    /**
    * This function is executed when the player begins to be dragged.
    *
    * @method on_start_drag
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_start_drag = function(event, ui) {
        this.$helper.add(this.$player).add(this.$wrapper).addClass('dragging');

        this.highest_col = this.get_highest_occupied_cell().col;

        this.$player.addClass('player');
        this.player_grid_data = this.$player.coords().grid;
        this.placeholder_grid_data = $.extend({}, this.player_grid_data);

        this.set_dom_grid_height(this.$el.height() +
            (this.player_grid_data.size_y * this.min_widget_height));

        this.set_dom_grid_width(this.cols);

        var pgd_sizex = this.player_grid_data.size_x;
        var cols_diff = this.cols - this.highest_col;

        if (this.options.autogrow_cols && cols_diff <= pgd_sizex) {
            this.add_faux_cols(Math.min(pgd_sizex - cols_diff, 1));
        }

        var colliders = this.faux_grid;
        var coords = this.$player.data('coords').coords;

        this.cells_occupied_by_player = this.get_cells_occupied(
            this.player_grid_data);
        this.cells_occupied_by_placeholder = this.get_cells_occupied(
            this.placeholder_grid_data);

        this.last_cols = [];
        this.last_rows = [];

        // see jquery.collision.js
        this.collision_api = this.$helper.collision(
            colliders, this.options.collision);

        this.$preview_holder = $('<' + this.$player.get(0).tagName + ' />', {
              'class': 'preview-holder',
              'data-row': this.$player.attr('data-row'),
              'data-col': this.$player.attr('data-col'),
              css: {
                  width: coords.width,
                  height: coords.height
              }
        }).appendTo(this.$el);

        if (this.options.draggable.start) {
          this.options.draggable.start.call(this, event, ui);
        }
    };


    /**
    * This function is executed when the player is being dragged.
    *
    * @method on_drag
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_drag = function(event, ui) {
        //break if dragstop has been fired
        if (this.$player === null) {
            return false;
        }

        var abs_offset = {
            left: ui.position.left + this.baseX,
            top: ui.position.top + this.baseY
        };

        // auto grow cols
        if (this.options.autogrow_cols) {
            var prcol = this.placeholder_grid_data.col +
                this.placeholder_grid_data.size_x - 1;

            // "- 1" due to adding at least 1 column in on_start_drag
            if (prcol >= this.cols - 1 && this.options.max_cols >= this.cols + 1) {
                this.add_faux_cols(1);
                this.set_dom_grid_width(this.cols + 1);
                this.drag_api.set_limits(this.container_width);
            }

            this.collision_api.set_colliders(this.faux_grid);
        }

        this.colliders_data = this.collision_api.get_closest_colliders(
            abs_offset);

        this.on_overlapped_column_change(
            this.on_start_overlapping_column, this.on_stop_overlapping_column);

        this.on_overlapped_row_change(
            this.on_start_overlapping_row, this.on_stop_overlapping_row);


        if (this.helper && this.$player) {
            this.$player.css({
                'left': ui.position.left,
                'top': ui.position.top
            });
        }

        if (this.options.draggable.drag) {
            this.options.draggable.drag.call(this, event, ui);
        }
    };


    /**
    * This function is executed when the player stops being dragged.
    *
    * @method on_stop_drag
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_stop_drag = function(event, ui) {
        this.$helper.add(this.$player).add(this.$wrapper)
            .removeClass('dragging');

        ui.position.left = ui.position.left + this.baseX;
        ui.position.top = ui.position.top + this.baseY;
        this.colliders_data = this.collision_api.get_closest_colliders(
            ui.position);

        this.on_overlapped_column_change(
            this.on_start_overlapping_column,
            this.on_stop_overlapping_column
        );

        this.on_overlapped_row_change(
            this.on_start_overlapping_row,
            this.on_stop_overlapping_row
        );

        this.$player.addClass('player-revert').removeClass('player')
            .attr({
                'data-col': this.placeholder_grid_data.col,
                'data-row': this.placeholder_grid_data.row
            }).css({
                'left': '',
                'top': ''
            });

        this.$changed = this.$changed.add(this.$player);

        this.cells_occupied_by_player = this.get_cells_occupied(
            this.placeholder_grid_data);
        this.set_cells_player_occupies(
            this.placeholder_grid_data.col, this.placeholder_grid_data.row);

        this.$player.coords().grid.row = this.placeholder_grid_data.row;
        this.$player.coords().grid.col = this.placeholder_grid_data.col;

        if (this.options.draggable.stop) {
          this.options.draggable.stop.call(this, event, ui);
        }

        this.$preview_holder.remove();

        this.$player = null;
        this.$helper = null;
        this.placeholder_grid_data = {};
        this.player_grid_data = {};
        this.cells_occupied_by_placeholder = {};
        this.cells_occupied_by_player = {};

        this.set_dom_grid_height();
        this.set_dom_grid_width();

        if (this.options.autogrow_cols) {
            this.drag_api.set_limits(this.cols * this.min_widget_width);
        }
    };


    /**
    * This function is executed every time a widget starts to be resized.
    *
    * @method on_start_resize
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_start_resize = function(event, ui) {
        this.$resized_widget = ui.$player.closest('.gs-w');
        this.resize_coords = this.$resized_widget.coords();
        this.resize_wgd = this.resize_coords.grid;
        this.resize_initial_width = this.resize_coords.coords.width;
        this.resize_initial_height = this.resize_coords.coords.height;
        this.resize_initial_sizex = this.resize_coords.grid.size_x;
        this.resize_initial_sizey = this.resize_coords.grid.size_y;
        this.resize_initial_col = this.resize_coords.grid.col;
        this.resize_last_sizex = this.resize_initial_sizex;
        this.resize_last_sizey = this.resize_initial_sizey;

        this.resize_max_size_x = Math.min(this.resize_wgd.max_size_x ||
            this.options.resize.max_size[0],
            this.options.max_cols - this.resize_initial_col + 1);
        this.resize_max_size_y = this.resize_wgd.max_size_y ||
            this.options.resize.max_size[1];

        this.resize_min_size_x = (this.resize_wgd.min_size_x ||
            this.options.resize.min_size[0] || 1);
        this.resize_min_size_y = (this.resize_wgd.min_size_y ||
            this.options.resize.min_size[1] || 1);

        this.resize_initial_last_col = this.get_highest_occupied_cell().col;

        this.set_dom_grid_width(this.cols);

        this.resize_dir = {
            right: ui.$player.is('.' + this.resize_handle_class + '-x'),
            bottom: ui.$player.is('.' + this.resize_handle_class + '-y')
        };

        this.$resized_widget.css({
            'min-width': this.options.widget_base_dimensions[0],
            'min-height': this.options.widget_base_dimensions[1]
        });

        var nodeName = this.$resized_widget.get(0).tagName;
        this.$resize_preview_holder = $('<' + nodeName + ' />', {
              'class': 'preview-holder resize-preview-holder',
              'data-row': this.$resized_widget.attr('data-row'),
              'data-col': this.$resized_widget.attr('data-col'),
              'css': {
                  'width': this.resize_initial_width,
                  'height': this.resize_initial_height
              }
        }).appendTo(this.$el);

        this.$resized_widget.addClass('resizing');

		if (this.options.resize.start) {
            this.options.resize.start.call(this, event, ui, this.$resized_widget);
        }

        this.$el.trigger('gridster:resizestart');
    };


    /**
    * This function is executed every time a widget stops being resized.
    *
    * @method on_stop_resize
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_stop_resize = function(event, ui) {
        this.$resized_widget
            .removeClass('resizing')
            .css({
                'width': '',
                'height': ''
            });

        delay($.proxy(function() {
            this.$resize_preview_holder
                .remove()
                .css({
                    'min-width': '',
                    'min-height': ''
                });

            if (this.options.resize.stop) {
                this.options.resize.stop.call(this, event, ui, this.$resized_widget);
            }

            this.$el.trigger('gridster:resizestop');
        }, this), 300);

        this.set_dom_grid_width();

        if (this.options.autogrow_cols) {
            this.drag_api.set_limits(this.cols * this.min_widget_width);
        }
    };


    /**
    * This function is executed when a widget is being resized.
    *
    * @method on_resize
    * @param {Event} event The original browser event
    * @param {Object} ui A prepared ui object with useful drag-related data
    */
    fn.on_resize = function(event, ui) {
        var rel_x = (ui.pointer.diff_left);
        var rel_y = (ui.pointer.diff_top);
        var wbd_x = this.options.widget_base_dimensions[0];
        var wbd_y = this.options.widget_base_dimensions[1];
        var margin_x = this.options.widget_margins[0];
        var margin_y = this.options.widget_margins[1];
        var max_size_x = this.resize_max_size_x;
        var min_size_x = this.resize_min_size_x;
        var max_size_y = this.resize_max_size_y;
        var min_size_y = this.resize_min_size_y;
        var autogrow = this.options.autogrow_cols;
        var width;
        var max_width = Infinity;
        var max_height = Infinity;

        var inc_units_x = Math.ceil((rel_x / (wbd_x + margin_x * 2)) - 0.2);
        var inc_units_y = Math.ceil((rel_y / (wbd_y + margin_y * 2)) - 0.2);

        var size_x = Math.max(1, this.resize_initial_sizex + inc_units_x);
        var size_y = Math.max(1, this.resize_initial_sizey + inc_units_y);

        var max_cols = (this.container_width / this.min_widget_width) -
            this.resize_initial_col + 1;
        var limit_width = ((max_cols * this.min_widget_width) - margin_x * 2);

        size_x = Math.max(Math.min(size_x, max_size_x), min_size_x);
        size_x = Math.min(max_cols, size_x);
        width = (max_size_x * wbd_x) + ((size_x - 1) * margin_x * 2);
        max_width = Math.min(width, limit_width);
        min_width = (min_size_x * wbd_x) + ((size_x - 1) * margin_x * 2);

        size_y = Math.max(Math.min(size_y, max_size_y), min_size_y);
        max_height = (max_size_y * wbd_y) + ((size_y - 1) * margin_y * 2);
        min_height = (min_size_y * wbd_y) + ((size_y - 1) * margin_y * 2);

        if (this.resize_dir.right) {
            size_y = this.resize_initial_sizey;
        } else if (this.resize_dir.bottom) {
            size_x = this.resize_initial_sizex;
        }

        if (autogrow) {
            var last_widget_col = this.resize_initial_col + size_x - 1;
            if (autogrow && this.resize_initial_last_col <= last_widget_col) {
                this.set_dom_grid_width(Math.max(last_widget_col + 1, this.cols));

                if (this.cols < last_widget_col) {
                    this.add_faux_cols(last_widget_col - this.cols);
                }
            }
        }

        var css_props = {};
        !this.resize_dir.bottom && (css_props.width = Math.max(Math.min(
            this.resize_initial_width + rel_x, max_width), min_width));
        !this.resize_dir.right && (css_props.height = Math.max(Math.min(
            this.resize_initial_height + rel_y, max_height), min_height));

        this.$resized_widget.css(css_props);

        if (size_x !== this.resize_last_sizex ||
            size_y !== this.resize_last_sizey) {

            this.resize_widget(this.$resized_widget, size_x, size_y);
            this.set_dom_grid_width(this.cols);

            this.$resize_preview_holder.css({
                'width': '',
                'height': ''
            }).attr({
                'data-row': this.$resized_widget.attr('data-row'),
                'data-sizex': size_x,
                'data-sizey': size_y
            });
        }

        if (this.options.resize.resize) {
            this.options.resize.resize.call(this, event, ui, this.$resized_widget);
        }

        this.$el.trigger('gridster:resize');

        this.resize_last_sizex = size_x;
        this.resize_last_sizey = size_y;
    };


    /**
    * Executes the callbacks passed as arguments when a column begins to be
    * overlapped or stops being overlapped.
    *
    * @param {Function} start_callback Function executed when a new column
    *  begins to be overlapped. The column is passed as first argument.
    * @param {Function} stop_callback Function executed when a column stops
    *  being overlapped. The column is passed as first argument.
    * @method on_overlapped_column_change
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.on_overlapped_column_change = function(start_callback, stop_callback) {
        if (!this.colliders_data.length) {
            return this;
        }
        var cols = this.get_targeted_columns(
            this.colliders_data[0].el.data.col);

        var last_n_cols = this.last_cols.length;
        var n_cols = cols.length;
        var i;

        for (i = 0; i < n_cols; i++) {
            if ($.inArray(cols[i], this.last_cols) === -1) {
                (start_callback || $.noop).call(this, cols[i]);
            }
        }

        for (i = 0; i< last_n_cols; i++) {
            if ($.inArray(this.last_cols[i], cols) === -1) {
                (stop_callback || $.noop).call(this, this.last_cols[i]);
            }
        }

        this.last_cols = cols;

        return this;
    };


    /**
    * Executes the callbacks passed as arguments when a row starts to be
    * overlapped or stops being overlapped.
    *
    * @param {Function} start_callback Function executed when a new row begins
    *  to be overlapped. The row is passed as first argument.
    * @param {Function} end_callback Function executed when a row stops being
    *  overlapped. The row is passed as first argument.
    * @method on_overlapped_row_change
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.on_overlapped_row_change = function(start_callback, end_callback) {
        if (!this.colliders_data.length) {
            return this;
        }
        var rows = this.get_targeted_rows(this.colliders_data[0].el.data.row);
        var last_n_rows = this.last_rows.length;
        var n_rows = rows.length;
        var i;

        for (i = 0; i < n_rows; i++) {
            if ($.inArray(rows[i], this.last_rows) === -1) {
                (start_callback || $.noop).call(this, rows[i]);
            }
        }

        for (i = 0; i < last_n_rows; i++) {
            if ($.inArray(this.last_rows[i], rows) === -1) {
                (end_callback || $.noop).call(this, this.last_rows[i]);
            }
        }

        this.last_rows = rows;
    };


    /**
    * Sets the current position of the player
    *
    * @param {Number} col
    * @param {Number} row
    * @param {Boolean} no_player
    * @method set_player
    * @return {object}
    */
    fn.set_player = function(col, row, no_player) {
        var self = this;
        if (!no_player) {
            this.empty_cells_player_occupies();
        }
        var cell = !no_player ? self.colliders_data[0].el.data : {col: col};
        var to_col = cell.col;
        var to_row = row || cell.row;

        this.player_grid_data = {
            col: to_col,
            row: to_row,
            size_y : this.player_grid_data.size_y,
            size_x : this.player_grid_data.size_x
        };

        this.cells_occupied_by_player = this.get_cells_occupied(
            this.player_grid_data);

        var $overlapped_widgets = this.get_widgets_overlapped(
            this.player_grid_data);

        var constraints = this.widgets_constraints($overlapped_widgets);

        this.manage_movements(constraints.can_go_up, to_col, to_row);
        this.manage_movements(constraints.can_not_go_up, to_col, to_row);

        /* if there is not widgets overlapping in the new player position,
         * update the new placeholder position. */
        if (!$overlapped_widgets.length) {
            var pp = this.can_go_player_up(this.player_grid_data);
            if (pp !== false) {
                to_row = pp;
            }
            this.set_placeholder(to_col, to_row);
        }

        return {
            col: to_col,
            row: to_row
        };
    };


    /**
    * See which of the widgets in the $widgets param collection can go to
    * a upper row and which not.
    *
    * @method widgets_contraints
    * @param {jQuery} $widgets A jQuery wrapped collection of
    * HTMLElements.
    * @return {object} Returns a literal Object with two keys: `can_go_up` &
    * `can_not_go_up`. Each contains a set of HTMLElements.
    */
    fn.widgets_constraints = function($widgets) {
        var $widgets_can_go_up = $([]);
        var $widgets_can_not_go_up;
        var wgd_can_go_up = [];
        var wgd_can_not_go_up = [];

        $widgets.each($.proxy(function(i, w) {
            var $w = $(w);
            var wgd = $w.coords().grid;
            if (this.can_go_widget_up(wgd)) {
                $widgets_can_go_up = $widgets_can_go_up.add($w);
                wgd_can_go_up.push(wgd);
            } else {
                wgd_can_not_go_up.push(wgd);
            }
        }, this));

        $widgets_can_not_go_up = $widgets.not($widgets_can_go_up);

        return {
            can_go_up: Gridster.sort_by_row_asc(wgd_can_go_up),
            can_not_go_up: Gridster.sort_by_row_desc(wgd_can_not_go_up)
        };
    };


    /**
    * Sorts an Array of grid coords objects (representing the grid coords of
    * each widget) in descending way.
    *
    * @method manage_movements
    * @param {jQuery} $widgets A jQuery collection of HTMLElements
    *  representing the widgets you want to move.
    * @param {Number} to_col The column to which we want to move the widgets.
    * @param {Number} to_row The row to which we want to move the widgets.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.manage_movements = function($widgets, to_col, to_row) {
        $.each($widgets, $.proxy(function(i, w) {
            var wgd = w;
            var $w = wgd.el;

            var can_go_widget_up = this.can_go_widget_up(wgd);

            if (can_go_widget_up) {
                //target CAN go up
                //so move widget up
                this.move_widget_to($w, can_go_widget_up);
                this.set_placeholder(to_col, can_go_widget_up + wgd.size_y);

            } else {
                //target can't go up
                var can_go_player_up = this.can_go_player_up(
                    this.player_grid_data);

                if (!can_go_player_up) {
                    // target can't go up
                    // player cant't go up
                    // so we need to move widget down to a position that dont
                    // overlaps player
                    var y = (to_row + this.player_grid_data.size_y) - wgd.row;

                    this.move_widget_down($w, y);
                    this.set_placeholder(to_col, to_row);
                }
            }
        }, this));

        return this;
    };

    /**
    * Determines if there is a widget in the row and col given. Or if the
    * HTMLElement passed as first argument is the player.
    *
    * @method is_player
    * @param {Number|HTMLElement} col_or_el A jQuery wrapped collection of
    * HTMLElements.
    * @param {Number} [row] The column to which we want to move the widgets.
    * @return {Boolean} Returns true or false.
    */
    fn.is_player = function(col_or_el, row) {
        if (row && !this.gridmap[col_or_el]) { return false; }
        var $w = row ? this.gridmap[col_or_el][row] : col_or_el;
        return $w && ($w.is(this.$player) || $w.is(this.$helper));
    };


    /**
    * Determines if the widget that is being dragged is currently over the row
    * and col given.
    *
    * @method is_player_in
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_player_in = function(col, row) {
        var c = this.cells_occupied_by_player || {};
        return $.inArray(col, c.cols) >= 0 && $.inArray(row, c.rows) >= 0;
    };


    /**
    * Determines if the placeholder is currently over the row and col given.
    *
    * @method is_placeholder_in
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_placeholder_in = function(col, row) {
        var c = this.cells_occupied_by_placeholder || {};
        return this.is_placeholder_in_col(col) && $.inArray(row, c.rows) >= 0;
    };


    /**
    * Determines if the placeholder is currently over the column given.
    *
    * @method is_placeholder_in_col
    * @param {Number} col The column to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_placeholder_in_col = function(col) {
        var c = this.cells_occupied_by_placeholder || [];
        return $.inArray(col, c.cols) >= 0;
    };


    /**
    * Determines if the cell represented by col and row params is empty.
    *
    * @method is_empty
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_empty = function(col, row) {
        if (typeof this.gridmap[col] !== 'undefined') {
			if(typeof this.gridmap[col][row] !== 'undefined' &&
				 this.gridmap[col][row] === false
			) {
				return true;
			}
			return false;
		}
		return true;
    };


    /**
    * Determines if the cell represented by col and row params is occupied.
    *
    * @method is_occupied
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_occupied = function(col, row) {
        if (!this.gridmap[col]) {
            return false;
        }

        if (this.gridmap[col][row]) {
            return true;
        }
        return false;
    };


    /**
    * Determines if there is a widget in the cell represented by col/row params.
    *
    * @method is_widget
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean|HTMLElement} Returns false if there is no widget,
    * else returns the jQuery HTMLElement
    */
    fn.is_widget = function(col, row) {
        var cell = this.gridmap[col];
        if (!cell) {
            return false;
        }

        cell = cell[row];

        if (cell) {
            return cell;
        }

        return false;
    };


    /**
    * Determines if there is a widget in the cell represented by col/row
    * params and if this is under the widget that is being dragged.
    *
    * @method is_widget_under_player
    * @param {Number} col The column to check.
    * @param {Number} row The row to check.
    * @return {Boolean} Returns true or false.
    */
    fn.is_widget_under_player = function(col, row) {
        if (this.is_widget(col, row)) {
            return this.is_player_in(col, row);
        }
        return false;
    };


    /**
    * Get widgets overlapping with the player or with the object passed
    * representing the grid cells.
    *
    * @method get_widgets_under_player
    * @return {HTMLElement} Returns a jQuery collection of HTMLElements
    */
    fn.get_widgets_under_player = function(cells) {
        cells || (cells = this.cells_occupied_by_player || {cols: [], rows: []});
        var $widgets = $([]);

        $.each(cells.cols, $.proxy(function(i, col) {
            $.each(cells.rows, $.proxy(function(i, row) {
                if(this.is_widget(col, row)) {
                    $widgets = $widgets.add(this.gridmap[col][row]);
                }
            }, this));
        }, this));

        return $widgets;
    };


    /**
    * Put placeholder at the row and column specified.
    *
    * @method set_placeholder
    * @param {Number} col The column to which we want to move the
    *  placeholder.
    * @param {Number} row The row to which we want to move the
    *  placeholder.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.set_placeholder = function(col, row) {
        var phgd = $.extend({}, this.placeholder_grid_data);
        var $nexts = this.widgets_below({
                col: phgd.col,
                row: phgd.row,
                size_y: phgd.size_y,
                size_x: phgd.size_x
            });

        // Prevents widgets go out of the grid
        var right_col = (col + phgd.size_x - 1);
        if (right_col > this.cols) {
            col = col - (right_col - col);
        }

        var moved_down = this.placeholder_grid_data.row < row;
        var changed_column = this.placeholder_grid_data.col !== col;

        this.placeholder_grid_data.col = col;
        this.placeholder_grid_data.row = row;

        this.cells_occupied_by_placeholder = this.get_cells_occupied(
            this.placeholder_grid_data);

        this.$preview_holder.attr({
            'data-row' : row,
            'data-col' : col
        });

        if (moved_down || changed_column) {
            $nexts.each($.proxy(function(i, widget) {
                this.move_widget_up(
                 $(widget), this.placeholder_grid_data.col - col + phgd.size_y);
            }, this));
        }

        var $widgets_under_ph = this.get_widgets_under_player(
            this.cells_occupied_by_placeholder);

        if ($widgets_under_ph.length) {
            $widgets_under_ph.each($.proxy(function(i, widget) {
                var $w = $(widget);
                this.move_widget_down(
                 $w, row + phgd.size_y - $w.data('coords').grid.row);
            }, this));
        }

    };


    /**
    * Determines whether the player can move to a position above.
    *
    * @method can_go_player_up
    * @param {Object} widget_grid_data The actual grid coords object of the
    *  player.
    * @return {Number|Boolean} If the player can be moved to an upper row
    *  returns the row number, else returns false.
    */
    fn.can_go_player_up = function(widget_grid_data) {
        var p_bottom_row = widget_grid_data.row + widget_grid_data.size_y - 1;
        var result = true;
        var upper_rows = [];
        var min_row = 10000;
        var $widgets_under_player = this.get_widgets_under_player();

        /* generate an array with columns as index and array with upper rows
         * empty as value */
        this.for_each_column_occupied(widget_grid_data, function(tcol) {
            var grid_col = this.gridmap[tcol];
            var r = p_bottom_row + 1;
            upper_rows[tcol] = [];

            while (--r > 0) {
                if (this.is_empty(tcol, r) || this.is_player(tcol, r) ||
                    this.is_widget(tcol, r) &&
                    grid_col[r].is($widgets_under_player)
                ) {
                    upper_rows[tcol].push(r);
                    min_row = r < min_row ? r : min_row;
                } else {
                    break;
                }
            }

            if (upper_rows[tcol].length === 0) {
                result = false;
                return true; //break
            }

            upper_rows[tcol].sort(function(a, b) {
                return a - b;
            });
        });

        if (!result) { return false; }

        return this.get_valid_rows(widget_grid_data, upper_rows, min_row);
    };


    /**
    * Determines whether a widget can move to a position above.
    *
    * @method can_go_widget_up
    * @param {Object} widget_grid_data The actual grid coords object of the
    *  widget we want to check.
    * @return {Number|Boolean} If the widget can be moved to an upper row
    *  returns the row number, else returns false.
    */
    fn.can_go_widget_up = function(widget_grid_data) {
        var p_bottom_row = widget_grid_data.row + widget_grid_data.size_y - 1;
        var result = true;
        var upper_rows = [];
        var min_row = 10000;

        /* generate an array with columns as index and array with topmost rows
         * empty as value */
        this.for_each_column_occupied(widget_grid_data, function(tcol) {
            var grid_col = this.gridmap[tcol];
            upper_rows[tcol] = [];

            var r = p_bottom_row + 1;
            // iterate over each row
            while (--r > 0) {
                if (this.is_widget(tcol, r) && !this.is_player_in(tcol, r)) {
                    if (!grid_col[r].is(widget_grid_data.el)) {
                        break;
                    }
                }

                if (!this.is_player(tcol, r) &&
                    !this.is_placeholder_in(tcol, r) &&
                    !this.is_player_in(tcol, r)) {
                    upper_rows[tcol].push(r);
                }

                if (r < min_row) {
                    min_row = r;
                }
            }

            if (upper_rows[tcol].length === 0) {
                result = false;
                return true; //break
            }

            upper_rows[tcol].sort(function(a, b) {
                return a - b;
            });
        });

        if (!result) { return false; }

        return this.get_valid_rows(widget_grid_data, upper_rows, min_row);
    };


    /**
    * Search a valid row for the widget represented by `widget_grid_data' in
    * the `upper_rows` array. Iteration starts from row specified in `min_row`.
    *
    * @method get_valid_rows
    * @param {Object} widget_grid_data The actual grid coords object of the
    *  player.
    * @param {Array} upper_rows An array with columns as index and arrays
    *  of valid rows as values.
    * @param {Number} min_row The upper row from which the iteration will start.
    * @return {Number|Boolean} Returns the upper row valid from the `upper_rows`
    *  for the widget in question.
    */
    fn.get_valid_rows = function(widget_grid_data, upper_rows, min_row) {
        var p_top_row = widget_grid_data.row;
        var p_bottom_row = widget_grid_data.row + widget_grid_data.size_y - 1;
        var size_y = widget_grid_data.size_y;
        var r = min_row - 1;
        var valid_rows = [];

        while (++r <= p_bottom_row ) {
            var common = true;
            $.each(upper_rows, function(col, rows) {
                if ($.isArray(rows) && $.inArray(r, rows) === -1) {
                    common = false;
                }
            });

            if (common === true) {
                valid_rows.push(r);
                if (valid_rows.length === size_y) {
                    break;
                }
            }
        }

        var new_row = false;
        if (size_y === 1) {
            if (valid_rows[0] !== p_top_row) {
                new_row = valid_rows[0] || false;
            }
        } else {
            if (valid_rows[0] !== p_top_row) {
                new_row = this.get_consecutive_numbers_index(
                    valid_rows, size_y);
            }
        }

        return new_row;
    };


    fn.get_consecutive_numbers_index = function(arr, size_y) {
        var max = arr.length;
        var result = [];
        var first = true;
        var prev = -1; // or null?

        for (var i=0; i < max; i++) {
            if (first || arr[i] === prev + 1) {
                result.push(i);
                if (result.length === size_y) {
                    break;
                }
                first = false;
            } else {
                result = [];
                first = true;
            }

            prev = arr[i];
        }

        return result.length >= size_y ? arr[result[0]] : false;
    };


    /**
    * Get widgets overlapping with the player.
    *
    * @method get_widgets_overlapped
    * @return {jQuery} Returns a jQuery collection of HTMLElements.
    */
    fn.get_widgets_overlapped = function() {
        var $w;
        var $widgets = $([]);
        var used = [];
        var rows_from_bottom = this.cells_occupied_by_player.rows.slice(0);
        rows_from_bottom.reverse();

        $.each(this.cells_occupied_by_player.cols, $.proxy(function(i, col) {
            $.each(rows_from_bottom, $.proxy(function(i, row) {
                // if there is a widget in the player position
                if (!this.gridmap[col]) { return true; } //next iteration
                var $w = this.gridmap[col][row];
                if (this.is_occupied(col, row) && !this.is_player($w) &&
                    $.inArray($w, used) === -1
                ) {
                    $widgets = $widgets.add($w);
                    used.push($w);
                }

            }, this));
        }, this));

        return $widgets;
    };


    /**
    * This callback is executed when the player begins to collide with a column.
    *
    * @method on_start_overlapping_column
    * @param {Number} col The collided column.
    * @return {jQuery} Returns a jQuery collection of HTMLElements.
    */
    fn.on_start_overlapping_column = function(col) {
        this.set_player(col, false);
    };


    /**
    * A callback executed when the player begins to collide with a row.
    *
    * @method on_start_overlapping_row
    * @param {Number} row The collided row.
    * @return {jQuery} Returns a jQuery collection of HTMLElements.
    */
    fn.on_start_overlapping_row = function(row) {
        this.set_player(false, row);
    };


    /**
    * A callback executed when the the player ends to collide with a column.
    *
    * @method on_stop_overlapping_column
    * @param {Number} col The collided row.
    * @return {jQuery} Returns a jQuery collection of HTMLElements.
    */
    fn.on_stop_overlapping_column = function(col) {
        this.set_player(col, false);

        var self = this;
        this.for_each_widget_below(col, this.cells_occupied_by_player.rows[0],
            function(tcol, trow) {
                self.move_widget_up(this, self.player_grid_data.size_y);
        });
    };


    /**
    * This callback is executed when the player ends to collide with a row.
    *
    * @method on_stop_overlapping_row
    * @param {Number} row The collided row.
    * @return {jQuery} Returns a jQuery collection of HTMLElements.
    */
    fn.on_stop_overlapping_row = function(row) {
        this.set_player(false, row);

        var self = this;
        var cols = this.cells_occupied_by_player.cols;
        for (var c = 0, cl = cols.length; c < cl; c++) {
            this.for_each_widget_below(cols[c], row, function(tcol, trow) {
                self.move_widget_up(this, self.player_grid_data.size_y);
            });
        }
    };


    /**
    * Move a widget to a specific row. The cell or cells must be empty.
    * If the widget has widgets below, all of these widgets will be moved also
    * if they can.
    *
    * @method move_widget_to
    * @param {HTMLElement} $widget The jQuery wrapped HTMLElement of the
    * widget is going to be moved.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.move_widget_to = function($widget, row) {
        var self = this;
        var widget_grid_data = $widget.coords().grid;
        var diff = row - widget_grid_data.row;
        var $next_widgets = this.widgets_below($widget);

        var can_move_to_new_cell = this.can_move_to(
            widget_grid_data, widget_grid_data.col, row, $widget);

        if (can_move_to_new_cell === false) {
            return false;
        }

        this.remove_from_gridmap(widget_grid_data);
        widget_grid_data.row = row;
        this.add_to_gridmap(widget_grid_data);
        $widget.attr('data-row', row);
        this.$changed = this.$changed.add($widget);


        $next_widgets.each(function(i, widget) {
            var $w = $(widget);
            var wgd = $w.coords().grid;
            var can_go_up = self.can_go_widget_up(wgd);
            if (can_go_up && can_go_up !== wgd.row) {
                self.move_widget_to($w, can_go_up);
            }
        });

        return this;
    };


    /**
    * Move up the specified widget and all below it.
    *
    * @method move_widget_up
    * @param {HTMLElement} $widget The widget you want to move.
    * @param {Number} [y_units] The number of cells that the widget has to move.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.move_widget_up = function($widget, y_units) {
        var el_grid_data = $widget.coords().grid;
        var actual_row = el_grid_data.row;
        var moved = [];
        var can_go_up = true;
        y_units || (y_units = 1);

        if (!this.can_go_up($widget)) { return false; } //break;

        this.for_each_column_occupied(el_grid_data, function(col) {
            // can_go_up
            if ($.inArray($widget, moved) === -1) {
                var widget_grid_data = $widget.coords().grid;
                var next_row = actual_row - y_units;
                next_row = this.can_go_up_to_row(
                    widget_grid_data, col, next_row);

                if (!next_row) {
                    return true;
                }

                var $next_widgets = this.widgets_below($widget);

                this.remove_from_gridmap(widget_grid_data);
                widget_grid_data.row = next_row;
                this.add_to_gridmap(widget_grid_data);
                $widget.attr('data-row', widget_grid_data.row);
                this.$changed = this.$changed.add($widget);

                moved.push($widget);

                $next_widgets.each($.proxy(function(i, widget) {
                    this.move_widget_up($(widget), y_units);
                }, this));
            }
        });

    };


    /**
    * Move down the specified widget and all below it.
    *
    * @method move_widget_down
    * @param {jQuery} $widget The jQuery object representing the widget
    *  you want to move.
    * @param {Number} y_units The number of cells that the widget has to move.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.move_widget_down = function($widget, y_units) {
        var el_grid_data, actual_row, moved, y_diff;

        if (y_units <= 0) { return false; }

        el_grid_data = $widget.coords().grid;
        actual_row = el_grid_data.row;
        moved = [];
        y_diff = y_units;

        if (!$widget) { return false; }

        if ($.inArray($widget, moved) === -1) {

            var widget_grid_data = $widget.coords().grid;
            var next_row = actual_row + y_units;
            var $next_widgets = this.widgets_below($widget);

            this.remove_from_gridmap(widget_grid_data);

            $next_widgets.each($.proxy(function(i, widget) {
                var $w = $(widget);
                var wd = $w.coords().grid;
                var tmp_y = this.displacement_diff(
                             wd, widget_grid_data, y_diff);

                if (tmp_y > 0) {
                    this.move_widget_down($w, tmp_y);
                }
            }, this));

            widget_grid_data.row = next_row;
            this.update_widget_position(widget_grid_data, $widget);
            $widget.attr('data-row', widget_grid_data.row);
            this.$changed = this.$changed.add($widget);

            moved.push($widget);
        }
    };


    /**
    * Check if the widget can move to the specified row, else returns the
    * upper row possible.
    *
    * @method can_go_up_to_row
    * @param {Number} widget_grid_data The current grid coords object of the
    *  widget.
    * @param {Number} col The target column.
    * @param {Number} row The target row.
    * @return {Boolean|Number} Returns the row number if the widget can move
    *  to the target position, else returns false.
    */
    fn.can_go_up_to_row = function(widget_grid_data, col, row) {
        var ga = this.gridmap;
        var result = true;
        var urc = []; // upper_rows_in_columns
        var actual_row = widget_grid_data.row;
        var r;

        /* generate an array with columns as index and array with
         * upper rows empty in the column */
        this.for_each_column_occupied(widget_grid_data, function(tcol) {
            var grid_col = ga[tcol];
            urc[tcol] = [];

            r = actual_row;
            while (r--) {
                if (this.is_empty(tcol, r) &&
                    !this.is_placeholder_in(tcol, r)
                ) {
                    urc[tcol].push(r);
                } else {
                    break;
                }
            }

            if (!urc[tcol].length) {
                result = false;
                return true;
            }

        });

        if (!result) { return false; }

        /* get common rows starting from upper position in all the columns
         * that widget occupies */
        r = row;
        for (r = 1; r < actual_row; r++) {
            var common = true;

            for (var uc = 0, ucl = urc.length; uc < ucl; uc++) {
                if (urc[uc] && $.inArray(r, urc[uc]) === -1) {
                    common = false;
                }
            }

            if (common === true) {
                result = r;
                break;
            }
        }

        return result;
    };


    fn.displacement_diff = function(widget_grid_data, parent_bgd, y_units) {
        var actual_row = widget_grid_data.row;
        var diffs = [];
        var parent_max_y = parent_bgd.row + parent_bgd.size_y;

        this.for_each_column_occupied(widget_grid_data, function(col) {
            var temp_y_units = 0;

            for (var r = parent_max_y; r < actual_row; r++) {
                if (this.is_empty(col, r)) {
                    temp_y_units = temp_y_units + 1;
                }
            }

            diffs.push(temp_y_units);
        });

        var max_diff = Math.max.apply(Math, diffs);
        y_units = (y_units - max_diff);

        return y_units > 0 ? y_units : 0;
    };


    /**
    * Get widgets below a widget.
    *
    * @method widgets_below
    * @param {HTMLElement} $el The jQuery wrapped HTMLElement.
    * @return {jQuery} A jQuery collection of HTMLElements.
    */
    fn.widgets_below = function($el) {
        var el_grid_data = $.isPlainObject($el) ? $el : $el.coords().grid;
        var self = this;
        var ga = this.gridmap;
        var next_row = el_grid_data.row + el_grid_data.size_y - 1;
        var $nexts = $([]);

        this.for_each_column_occupied(el_grid_data, function(col) {
            self.for_each_widget_below(col, next_row, function(tcol, trow) {
                if (!self.is_player(this) && $.inArray(this, $nexts) === -1) {
                    $nexts = $nexts.add(this);
                    return true; // break
                }
            });
        });

        return Gridster.sort_by_row_asc($nexts);
    };


    /**
    * Update the array of mapped positions with the new player position.
    *
    * @method set_cells_player_occupies
    * @param {Number} col The new player col.
    * @param {Number} col The new player row.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.set_cells_player_occupies = function(col, row) {
        this.remove_from_gridmap(this.placeholder_grid_data);
        this.placeholder_grid_data.col = col;
        this.placeholder_grid_data.row = row;
        this.add_to_gridmap(this.placeholder_grid_data, this.$player);
        return this;
    };


    /**
    * Remove from the array of mapped positions the reference to the player.
    *
    * @method empty_cells_player_occupies
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.empty_cells_player_occupies = function() {
        this.remove_from_gridmap(this.placeholder_grid_data);
        return this;
    };


    fn.can_go_up = function($el) {
        var el_grid_data = $el.coords().grid;
        var initial_row = el_grid_data.row;
        var prev_row = initial_row - 1;
        var ga = this.gridmap;
        var upper_rows_by_column = [];

        var result = true;
        if (initial_row === 1) { return false; }

        this.for_each_column_occupied(el_grid_data, function(col) {
            var $w = this.is_widget(col, prev_row);

            if (this.is_occupied(col, prev_row) ||
                this.is_player(col, prev_row) ||
                this.is_placeholder_in(col, prev_row) ||
                this.is_player_in(col, prev_row)
            ) {
                result = false;
                return true; //break
            }
        });

        return result;
    };


    /**
    * Check if it's possible to move a widget to a specific col/row. It takes
    * into account the dimensions (`size_y` and `size_x` attrs. of the grid
    *  coords object) the widget occupies.
    *
    * @method can_move_to
    * @param {Object} widget_grid_data The grid coords object that represents
    *  the widget.
    * @param {Object} col The col to check.
    * @param {Object} row The row to check.
    * @param {Number} [max_row] The max row allowed.
    * @return {Boolean} Returns true if all cells are empty, else return false.
    */
    fn.can_move_to = function(widget_grid_data, col, row, max_row) {
        var ga = this.gridmap;
        var $w = widget_grid_data.el;
        var future_wd = {
            size_y: widget_grid_data.size_y,
            size_x: widget_grid_data.size_x,
            col: col,
            row: row
        };
        var result = true;

        //Prevents widgets go out of the grid
        var right_col = col + widget_grid_data.size_x - 1;
        if (right_col > this.cols) {
            return false;
        }

        if (max_row && max_row < row + widget_grid_data.size_y - 1) {
            return false;
        }

        this.for_each_cell_occupied(future_wd, function(tcol, trow) {
            var $tw = this.is_widget(tcol, trow);
            if ($tw && (!widget_grid_data.el || $tw.is($w))) {
                result = false;
            }
        });

        return result;
    };


    /**
    * Given the leftmost column returns all columns that are overlapping
    *  with the player.
    *
    * @method get_targeted_columns
    * @param {Number} [from_col] The leftmost column.
    * @return {Array} Returns an array with column numbers.
    */
    fn.get_targeted_columns = function(from_col) {
        var max = (from_col || this.player_grid_data.col) +
            (this.player_grid_data.size_x - 1);
        var cols = [];
        for (var col = from_col; col <= max; col++) {
            cols.push(col);
        }
        return cols;
    };


    /**
    * Given the upper row returns all rows that are overlapping with the player.
    *
    * @method get_targeted_rows
    * @param {Number} [from_row] The upper row.
    * @return {Array} Returns an array with row numbers.
    */
    fn.get_targeted_rows = function(from_row) {
        var max = (from_row || this.player_grid_data.row) +
            (this.player_grid_data.size_y - 1);
        var rows = [];
        for (var row = from_row; row <= max; row++) {
            rows.push(row);
        }
        return rows;
    };

    /**
    * Get all columns and rows that a widget occupies.
    *
    * @method get_cells_occupied
    * @param {Object} el_grid_data The grid coords object of the widget.
    * @return {Object} Returns an object like `{ cols: [], rows: []}`.
    */
    fn.get_cells_occupied = function(el_grid_data) {
        var cells = { cols: [], rows: []};
        var i;
        if (arguments[1] instanceof $) {
            el_grid_data = arguments[1].coords().grid;
        }

        for (i = 0; i < el_grid_data.size_x; i++) {
            var col = el_grid_data.col + i;
            cells.cols.push(col);
        }

        for (i = 0; i < el_grid_data.size_y; i++) {
            var row = el_grid_data.row + i;
            cells.rows.push(row);
        }

        return cells;
    };


    /**
    * Iterate over the cells occupied by a widget executing a function for
    * each one.
    *
    * @method for_each_cell_occupied
    * @param {Object} el_grid_data The grid coords object that represents the
    *  widget.
    * @param {Function} callback The function to execute on each column
    *  iteration. Column and row are passed as arguments.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.for_each_cell_occupied = function(grid_data, callback) {
        this.for_each_column_occupied(grid_data, function(col) {
            this.for_each_row_occupied(grid_data, function(row) {
                callback.call(this, col, row);
            });
        });
        return this;
    };


    /**
    * Iterate over the columns occupied by a widget executing a function for
    * each one.
    *
    * @method for_each_column_occupied
    * @param {Object} el_grid_data The grid coords object that represents
    *  the widget.
    * @param {Function} callback The function to execute on each column
    *  iteration. The column number is passed as first argument.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.for_each_column_occupied = function(el_grid_data, callback) {
        for (var i = 0; i < el_grid_data.size_x; i++) {
            var col = el_grid_data.col + i;
            callback.call(this, col, el_grid_data);
        }
    };


    /**
    * Iterate over the rows occupied by a widget executing a function for
    * each one.
    *
    * @method for_each_row_occupied
    * @param {Object} el_grid_data The grid coords object that represents
    *  the widget.
    * @param {Function} callback The function to execute on each column
    *  iteration. The row number is passed as first argument.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.for_each_row_occupied = function(el_grid_data, callback) {
        for (var i = 0; i < el_grid_data.size_y; i++) {
            var row = el_grid_data.row + i;
            callback.call(this, row, el_grid_data);
        }
    };



    fn._traversing_widgets = function(type, direction, col, row, callback) {
        var ga = this.gridmap;
        if (!ga[col]) { return; }

        var cr, max;
        var action = type + '/' + direction;
        if (arguments[2] instanceof $) {
            var el_grid_data = arguments[2].coords().grid;
            col = el_grid_data.col;
            row = el_grid_data.row;
            callback = arguments[3];
        }
        var matched = [];
        var trow = row;


        var methods = {
            'for_each/above': function() {
                while (trow--) {
                    if (trow > 0 && this.is_widget(col, trow) &&
                        $.inArray(ga[col][trow], matched) === -1
                    ) {
                        cr = callback.call(ga[col][trow], col, trow);
                        matched.push(ga[col][trow]);
                        if (cr) { break; }
                    }
                }
            },
            'for_each/below': function() {
                for (trow = row + 1, max = ga[col].length; trow < max; trow++) {
                    if (this.is_widget(col, trow) &&
                        $.inArray(ga[col][trow], matched) === -1
                    ) {
                        cr = callback.call(ga[col][trow], col, trow);
                        matched.push(ga[col][trow]);
                        if (cr) { break; }
                    }
                }
            }
        };

        if (methods[action]) {
            methods[action].call(this);
        }
    };


    /**
    * Iterate over each widget above the column and row specified.
    *
    * @method for_each_widget_above
    * @param {Number} col The column to start iterating.
    * @param {Number} row The row to start iterating.
    * @param {Function} callback The function to execute on each widget
    *  iteration. The value of `this` inside the function is the jQuery
    *  wrapped HTMLElement.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.for_each_widget_above = function(col, row, callback) {
        this._traversing_widgets('for_each', 'above', col, row, callback);
        return this;
    };


    /**
    * Iterate over each widget below the column and row specified.
    *
    * @method for_each_widget_below
    * @param {Number} col The column to start iterating.
    * @param {Number} row The row to start iterating.
    * @param {Function} callback The function to execute on each widget
    *  iteration. The value of `this` inside the function is the jQuery wrapped
    *  HTMLElement.
    * @return {Class} Returns the instance of the Gridster Class.
    */
    fn.for_each_widget_below = function(col, row, callback) {
        this._traversing_widgets('for_each', 'below', col, row, callback);
        return this;
    };


    /**
    * Returns the highest occupied cell in the grid.
    *
    * @method get_highest_occupied_cell
    * @return {Object} Returns an object with `col` and `row` numbers.
    */
    fn.get_highest_occupied_cell = function() {
        var r;
        var gm = this.gridmap;
        var rl = gm[1].length;
        var rows = [], cols = [];
        var row_in_col = [];
        for (var c = gm.length - 1; c >= 1; c--) {
            for (r = rl - 1; r >= 1; r--) {
                if (this.is_widget(c, r)) {
                    rows.push(r);
                    cols.push(c);
                    break;
                }
            }
        }

        return {
            col: Math.max.apply(Math, cols),
            row: Math.max.apply(Math, rows)
        };
    };


    fn.get_widgets_from = function(col, row) {
        var ga = this.gridmap;
        var $widgets = $();

        if (col) {
            $widgets = $widgets.add(
                this.$widgets.filter(function() {
                    var tcol = $(this).attr('data-col');
                    return (tcol === col || tcol > col);
                })
            );
        }

        if (row) {
            $widgets = $widgets.add(
                this.$widgets.filter(function() {
                    var trow = $(this).attr('data-row');
                    return (trow === row || trow > row);
                })
            );
        }

        return $widgets;
    };


    /**
    * Set the current height of the parent grid.
    *
    * @method set_dom_grid_height
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.set_dom_grid_height = function(height) {
        if (typeof height === 'undefined') {
            var r = this.get_highest_occupied_cell().row;
            height = r * this.min_widget_height;
        }

        this.container_height = height;
        this.$el.css('height', this.container_height);
        return this;
    };

    /**
    * Set the current width of the parent grid.
    *
    * @method set_dom_grid_width
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.set_dom_grid_width = function(cols) {
        if (typeof cols === 'undefined') {
            cols = this.get_highest_occupied_cell().col;
        }

        var max_cols = (this.options.autogrow_cols ? this.options.max_cols :
            this.cols);

        cols = Math.min(max_cols, Math.max(cols, this.options.min_cols));
        this.container_width = cols * this.min_widget_width;
        this.$el.css('width', this.container_width);
        return this;
    };


    /**
    * It generates the neccessary styles to position the widgets.
    *
    * @method generate_stylesheet
    * @param {Number} rows Number of columns.
    * @param {Number} cols Number of rows.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.generate_stylesheet = function(opts) {
        var styles = '';
        var max_size_x = this.options.max_size_x || this.cols;
        var max_rows = 0;
        var max_cols = 0;
        var i;
        var rules;

        opts || (opts = {});
        opts.cols || (opts.cols = this.cols);
        opts.rows || (opts.rows = this.rows);
        opts.namespace || (opts.namespace = this.options.namespace);
        opts.widget_base_dimensions ||
            (opts.widget_base_dimensions = this.options.widget_base_dimensions);
        opts.widget_margins ||
            (opts.widget_margins = this.options.widget_margins);
        opts.min_widget_width = (opts.widget_margins[0] * 2) +
            opts.widget_base_dimensions[0];
        opts.min_widget_height = (opts.widget_margins[1] * 2) +
            opts.widget_base_dimensions[1];

        // don't duplicate stylesheets for the same configuration
        var serialized_opts = $.param(opts);
        if ($.inArray(serialized_opts, Gridster.generated_stylesheets) >= 0) {
            return false;
        }

        this.generated_stylesheets.push(serialized_opts);
        Gridster.generated_stylesheets.push(serialized_opts);

        /* generate CSS styles for cols */
        for (i = opts.cols; i >= 0; i--) {
            styles += (opts.namespace + ' [data-col="'+ (i + 1) + '"] { left:' +
                ((i * opts.widget_base_dimensions[0]) +
                (i * opts.widget_margins[0]) +
                ((i + 1) * opts.widget_margins[0])) + 'px; }\n');
        }

        /* generate CSS styles for rows */
        for (i = opts.rows; i >= 0; i--) {
            styles += (opts.namespace + ' [data-row="' + (i + 1) + '"] { top:' +
                ((i * opts.widget_base_dimensions[1]) +
                (i * opts.widget_margins[1]) +
                ((i + 1) * opts.widget_margins[1]) ) + 'px; }\n');
        }

        for (var y = 1; y <= opts.rows; y++) {
            styles += (opts.namespace + ' [data-sizey="' + y + '"] { height:' +
                (y * opts.widget_base_dimensions[1] +
                (y - 1) * (opts.widget_margins[1] * 2)) + 'px; }\n');
        }

        for (var x = 1; x <= max_size_x; x++) {
            styles += (opts.namespace + ' [data-sizex="' + x + '"] { width:' +
                (x * opts.widget_base_dimensions[0] +
                (x - 1) * (opts.widget_margins[0] * 2)) + 'px; }\n');
        }

        this.remove_style_tags();

        return this.add_style_tag(styles);
    };


    /**
    * Injects the given CSS as string to the head of the document.
    *
    * @method add_style_tag
    * @param {String} css The styles to apply.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.add_style_tag = function(css) {
        var d = document;
        var tag = d.createElement('style');

        d.getElementsByTagName('head')[0].appendChild(tag);
        tag.setAttribute('type', 'text/css');

        if (tag.styleSheet) {
            tag.styleSheet.cssText = css;
        } else {
            tag.appendChild(document.createTextNode(css));
        }

        this.$style_tags = this.$style_tags.add(tag);

        return this;
    };


    /**
    * Remove the style tag with the associated id from the head of the document
    *
    * @method  remove_style_tag
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.remove_style_tags = function() {
        var all_styles = Gridster.generated_stylesheets;
        var ins_styles = this.generated_stylesheets;

        this.$style_tags.remove();

        Gridster.generated_stylesheets = $.map(all_styles, function(s) {
            if ($.inArray(s, ins_styles) === -1) { return s; }
        });
    };


    /**
    * Generates a faux grid to collide with it when a widget is dragged and
    * detect row or column that we want to go.
    *
    * @method generate_faux_grid
    * @param {Number} rows Number of columns.
    * @param {Number} cols Number of rows.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.generate_faux_grid = function(rows, cols) {
        this.faux_grid = [];
        this.gridmap = [];
        var col;
        var row;
        for (col = cols; col > 0; col--) {
            this.gridmap[col] = [];
            for (row = rows; row > 0; row--) {
                this.add_faux_cell(row, col);
            }
        }
        return this;
    };


    /**
    * Add cell to the faux grid.
    *
    * @method add_faux_cell
    * @param {Number} row The row for the new faux cell.
    * @param {Number} col The col for the new faux cell.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.add_faux_cell = function(row, col) {
        var coords = $({
                        left: this.baseX + ((col - 1) * this.min_widget_width),
                        top: this.baseY + (row -1) * this.min_widget_height,
                        width: this.min_widget_width,
                        height: this.min_widget_height,
                        col: col,
                        row: row,
                        original_col: col,
                        original_row: row
                    }).coords();

        if (!$.isArray(this.gridmap[col])) {
            this.gridmap[col] = [];
        }

        this.gridmap[col][row] = false;
        this.faux_grid.push(coords);

        return this;
    };


    /**
    * Add rows to the faux grid.
    *
    * @method add_faux_rows
    * @param {Number} rows The number of rows you want to add to the faux grid.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.add_faux_rows = function(rows) {
        var actual_rows = this.rows;
        var max_rows = actual_rows + (rows || 1);

        for (var r = max_rows; r > actual_rows; r--) {
            for (var c = this.cols; c >= 1; c--) {
                this.add_faux_cell(r, c);
            }
        }

        this.rows = max_rows;

        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet();
        }

        return this;
    };

     /**
    * Add cols to the faux grid.
    *
    * @method add_faux_cols
    * @param {Number} cols The number of cols you want to add to the faux grid.
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.add_faux_cols = function(cols) {
        var actual_cols = this.cols;
        var max_cols = actual_cols + (cols || 1);
        max_cols = Math.min(max_cols, this.options.max_cols);

        for (var c = actual_cols + 1; c <= max_cols; c++) {
            for (var r = this.rows; r >= 1; r--) {
                this.add_faux_cell(r, c);
            }
        }

        this.cols = max_cols;

        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet();
        }

        return this;
    };


    /**
    * Recalculates the offsets for the faux grid. You need to use it when
    * the browser is resized.
    *
    * @method recalculate_faux_grid
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.recalculate_faux_grid = function() {
        var aw = this.$wrapper.width();
        this.baseX = ($(window).width() - aw) / 2;
        this.baseY = this.$wrapper.offset().top;

        $.each(this.faux_grid, $.proxy(function(i, coords) {
            this.faux_grid[i] = coords.update({
                left: this.baseX + (coords.data.col -1) * this.min_widget_width,
                top: this.baseY + (coords.data.row -1) * this.min_widget_height
            });
        }, this));

        return this;
    };


    /**
    * Get all widgets in the DOM and register them.
    *
    * @method get_widgets_from_DOM
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.get_widgets_from_DOM = function() {
        var widgets_coords = this.$widgets.map($.proxy(function(i, widget) {
            var $w = $(widget);
            return this.dom_to_coords($w);
        }, this));

        widgets_coords = Gridster.sort_by_row_and_col_asc(widgets_coords);

        var changes = $(widgets_coords).map($.proxy(function(i, wgd) {
            return this.register_widget(wgd) || null;
        }, this));

        if (changes.length) {
            this.$el.trigger('gridster:positionschanged');
        }

        return this;
    };


    /**
    * Calculate columns and rows to be set based on the configuration
    *  parameters, grid dimensions, etc ...
    *
    * @method generate_grid_and_stylesheet
    * @return {Object} Returns the instance of the Gridster class.
    */
    fn.generate_grid_and_stylesheet = function() {
        var aw = this.$wrapper.width();
        var max_cols = this.options.max_cols;

        var cols = Math.floor(aw / this.min_widget_width) +
                   this.options.extra_cols;

        var actual_cols = this.$widgets.map(function() {
            return $(this).attr('data-col');
        }).get();

        //needed to pass tests with phantomjs
        actual_cols.length || (actual_cols = [0]);

        var min_cols = Math.max.apply(Math, actual_cols);

        this.cols = Math.max(min_cols, cols, this.options.min_cols);

        if (max_cols !== Infinity && max_cols >= min_cols && max_cols < this.cols) {
            this.cols = max_cols;
        }

        // get all rows that could be occupied by the current widgets
        var max_rows = this.options.extra_rows;
        this.$widgets.each(function(i, w) {
            max_rows += (+$(w).attr('data-sizey'));
        });

        this.rows = Math.max(max_rows, this.options.min_rows);

        this.baseX = ($(window).width() - aw) / 2;
        this.baseY = this.$wrapper.offset().top;

        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet();
        }

        return this.generate_faux_grid(this.rows, this.cols);
    };

    /**
     * Destroy this gridster by removing any sign of its presence, making it easy to avoid memory leaks
     *
     * @method destroy
     * @param {Boolean} remove If true, remove gridster from DOM.
     * @return {Object} Returns the instance of the Gridster class.
     */
    fn.destroy = function(remove) {
        this.$el.removeData('gridster');

        // remove bound callback on window resize
        $(window).unbind('.gridster');

        if (this.drag_api) {
            this.drag_api.destroy();
        }

        this.remove_style_tags();

        remove && this.$el.remove();

        return this;
    };


    //jQuery adapter
    $.fn.gridster = function(options) {
        return this.each(function() {
            if (! $(this).data('gridster')) {
                $(this).data('gridster', new Gridster( this, options ));
            }
        });
    };

    return Gridster;

}));

!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.moment=b()}(this,function(){"use strict";function a(){return Md.apply(null,arguments)}function b(a){Md=a}function c(a){return"[object Array]"===Object.prototype.toString.call(a)}function d(a){return a instanceof Date||"[object Date]"===Object.prototype.toString.call(a)}function e(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function f(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function g(a,b){for(var c in b)f(b,c)&&(a[c]=b[c]);return f(b,"toString")&&(a.toString=b.toString),f(b,"valueOf")&&(a.valueOf=b.valueOf),a}function h(a,b,c,d){return Ca(a,b,c,d,!0).utc()}function i(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function j(a){return null==a._pf&&(a._pf=i()),a._pf}function k(a){if(null==a._isValid){var b=j(a);a._isValid=!(isNaN(a._d.getTime())||!(b.overflow<0)||b.empty||b.invalidMonth||b.invalidWeekday||b.nullInput||b.invalidFormat||b.userInvalidated),a._strict&&(a._isValid=a._isValid&&0===b.charsLeftOver&&0===b.unusedTokens.length&&void 0===b.bigHour)}return a._isValid}function l(a){var b=h(NaN);return null!=a?g(j(b),a):j(b).userInvalidated=!0,b}function m(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=j(b)),"undefined"!=typeof b._locale&&(a._locale=b._locale),Od.length>0)for(c in Od)d=Od[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function n(b){m(this,b),this._d=new Date(null!=b._d?b._d.getTime():NaN),Pd===!1&&(Pd=!0,a.updateOffset(this),Pd=!1)}function o(a){return a instanceof n||null!=a&&null!=a._isAMomentObject}function p(a){return 0>a?Math.ceil(a):Math.floor(a)}function q(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=p(b)),c}function r(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&q(a[d])!==q(b[d]))&&g++;return g+f}function s(){}function t(a){return a?a.toLowerCase().replace("_","-"):a}function u(a){for(var b,c,d,e,f=0;f<a.length;){for(e=t(a[f]).split("-"),b=e.length,c=t(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=v(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&r(e,c,!0)>=b-1)break;b--}f++}return null}function v(a){var b=null;if(!Qd[a]&&"undefined"!=typeof module&&module&&module.exports)try{b=Nd._abbr,require("./locale/"+a),w(b)}catch(c){}return Qd[a]}function w(a,b){var c;return a&&(c="undefined"==typeof b?y(a):x(a,b),c&&(Nd=c)),Nd._abbr}function x(a,b){return null!==b?(b.abbr=a,Qd[a]=Qd[a]||new s,Qd[a].set(b),w(a),Qd[a]):(delete Qd[a],null)}function y(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return Nd;if(!c(a)){if(b=v(a))return b;a=[a]}return u(a)}function z(a,b){var c=a.toLowerCase();Rd[c]=Rd[c+"s"]=Rd[b]=a}function A(a){return"string"==typeof a?Rd[a]||Rd[a.toLowerCase()]:void 0}function B(a){var b,c,d={};for(c in a)f(a,c)&&(b=A(c),b&&(d[b]=a[c]));return d}function C(b,c){return function(d){return null!=d?(E(this,b,d),a.updateOffset(this,c),this):D(this,b)}}function D(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function E(a,b,c){return a._d["set"+(a._isUTC?"UTC":"")+b](c)}function F(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else if(a=A(a),"function"==typeof this[a])return this[a](b);return this}function G(a,b,c){var d=""+Math.abs(a),e=b-d.length,f=a>=0;return(f?c?"+":"":"-")+Math.pow(10,Math.max(0,e)).toString().substr(1)+d}function H(a,b,c,d){var e=d;"string"==typeof d&&(e=function(){return this[d]()}),a&&(Vd[a]=e),b&&(Vd[b[0]]=function(){return G(e.apply(this,arguments),b[1],b[2])}),c&&(Vd[c]=function(){return this.localeData().ordinal(e.apply(this,arguments),a)})}function I(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function J(a){var b,c,d=a.match(Sd);for(b=0,c=d.length;c>b;b++)Vd[d[b]]?d[b]=Vd[d[b]]:d[b]=I(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function K(a,b){return a.isValid()?(b=L(b,a.localeData()),Ud[b]=Ud[b]||J(b),Ud[b](a)):a.localeData().invalidDate()}function L(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Td.lastIndex=0;d>=0&&Td.test(a);)a=a.replace(Td,c),Td.lastIndex=0,d-=1;return a}function M(a){return"function"==typeof a&&"[object Function]"===Object.prototype.toString.call(a)}function N(a,b,c){ie[a]=M(b)?b:function(a){return a&&c?c:b}}function O(a,b){return f(ie,a)?ie[a](b._strict,b._locale):new RegExp(P(a))}function P(a){return a.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e}).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function Q(a,b){var c,d=b;for("string"==typeof a&&(a=[a]),"number"==typeof b&&(d=function(a,c){c[b]=q(a)}),c=0;c<a.length;c++)je[a[c]]=d}function R(a,b){Q(a,function(a,c,d,e){d._w=d._w||{},b(a,d._w,d,e)})}function S(a,b,c){null!=b&&f(je,a)&&je[a](b,c._a,c,a)}function T(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function U(a){return this._months[a.month()]}function V(a){return this._monthsShort[a.month()]}function W(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=h([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}}function X(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),T(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function Y(b){return null!=b?(X(this,b),a.updateOffset(this,!0),this):D(this,"Month")}function Z(){return T(this.year(),this.month())}function $(a){var b,c=a._a;return c&&-2===j(a).overflow&&(b=c[le]<0||c[le]>11?le:c[me]<1||c[me]>T(c[ke],c[le])?me:c[ne]<0||c[ne]>24||24===c[ne]&&(0!==c[oe]||0!==c[pe]||0!==c[qe])?ne:c[oe]<0||c[oe]>59?oe:c[pe]<0||c[pe]>59?pe:c[qe]<0||c[qe]>999?qe:-1,j(a)._overflowDayOfYear&&(ke>b||b>me)&&(b=me),j(a).overflow=b),a}function _(b){a.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+b)}function aa(a,b){var c=!0;return g(function(){return c&&(_(a+"\n"+(new Error).stack),c=!1),b.apply(this,arguments)},b)}function ba(a,b){te[a]||(_(b),te[a]=!0)}function ca(a){var b,c,d=a._i,e=ue.exec(d);if(e){for(j(a).iso=!0,b=0,c=ve.length;c>b;b++)if(ve[b][1].exec(d)){a._f=ve[b][0];break}for(b=0,c=we.length;c>b;b++)if(we[b][1].exec(d)){a._f+=(e[6]||" ")+we[b][0];break}d.match(fe)&&(a._f+="Z"),va(a)}else a._isValid=!1}function da(b){var c=xe.exec(b._i);return null!==c?void(b._d=new Date(+c[1])):(ca(b),void(b._isValid===!1&&(delete b._isValid,a.createFromInputFallback(b))))}function ea(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function fa(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function ga(a){return ha(a)?366:365}function ha(a){return a%4===0&&a%100!==0||a%400===0}function ia(){return ha(this.year())}function ja(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=Da(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function ka(a){return ja(a,this._week.dow,this._week.doy).week}function la(){return this._week.dow}function ma(){return this._week.doy}function na(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")}function oa(a){var b=ja(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")}function pa(a,b,c,d,e){var f,g=6+e-d,h=fa(a,0,1+g),i=h.getUTCDay();return e>i&&(i+=7),c=null!=c?1*c:e,f=1+g+7*(b-1)-i+c,{year:f>0?a:a-1,dayOfYear:f>0?f:ga(a-1)+f}}function qa(a){var b=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")}function ra(a,b,c){return null!=a?a:null!=b?b:c}function sa(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function ta(a){var b,c,d,e,f=[];if(!a._d){for(d=sa(a),a._w&&null==a._a[me]&&null==a._a[le]&&ua(a),a._dayOfYear&&(e=ra(a._a[ke],d[ke]),a._dayOfYear>ga(e)&&(j(a)._overflowDayOfYear=!0),c=fa(e,0,a._dayOfYear),a._a[le]=c.getUTCMonth(),a._a[me]=c.getUTCDate()),b=0;3>b&&null==a._a[b];++b)a._a[b]=f[b]=d[b];for(;7>b;b++)a._a[b]=f[b]=null==a._a[b]?2===b?1:0:a._a[b];24===a._a[ne]&&0===a._a[oe]&&0===a._a[pe]&&0===a._a[qe]&&(a._nextDay=!0,a._a[ne]=0),a._d=(a._useUTC?fa:ea).apply(null,f),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[ne]=24)}}function ua(a){var b,c,d,e,f,g,h;b=a._w,null!=b.GG||null!=b.W||null!=b.E?(f=1,g=4,c=ra(b.GG,a._a[ke],ja(Da(),1,4).year),d=ra(b.W,1),e=ra(b.E,1)):(f=a._locale._week.dow,g=a._locale._week.doy,c=ra(b.gg,a._a[ke],ja(Da(),f,g).year),d=ra(b.w,1),null!=b.d?(e=b.d,f>e&&++d):e=null!=b.e?b.e+f:f),h=pa(c,d,e,g,f),a._a[ke]=h.year,a._dayOfYear=h.dayOfYear}function va(b){if(b._f===a.ISO_8601)return void ca(b);b._a=[],j(b).empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,k=0;for(e=L(b._f,b._locale).match(Sd)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(O(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&j(b).unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),k+=d.length),Vd[f]?(d?j(b).empty=!1:j(b).unusedTokens.push(f),S(f,d,b)):b._strict&&!d&&j(b).unusedTokens.push(f);j(b).charsLeftOver=i-k,h.length>0&&j(b).unusedInput.push(h),j(b).bigHour===!0&&b._a[ne]<=12&&b._a[ne]>0&&(j(b).bigHour=void 0),b._a[ne]=wa(b._locale,b._a[ne],b._meridiem),ta(b),$(b)}function wa(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function xa(a){var b,c,d,e,f;if(0===a._f.length)return j(a).invalidFormat=!0,void(a._d=new Date(NaN));for(e=0;e<a._f.length;e++)f=0,b=m({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._f=a._f[e],va(b),k(b)&&(f+=j(b).charsLeftOver,f+=10*j(b).unusedTokens.length,j(b).score=f,(null==d||d>f)&&(d=f,c=b));g(a,c||b)}function ya(a){if(!a._d){var b=B(a._i);a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],ta(a)}}function za(a){var b=new n($(Aa(a)));return b._nextDay&&(b.add(1,"d"),b._nextDay=void 0),b}function Aa(a){var b=a._i,e=a._f;return a._locale=a._locale||y(a._l),null===b||void 0===e&&""===b?l({nullInput:!0}):("string"==typeof b&&(a._i=b=a._locale.preparse(b)),o(b)?new n($(b)):(c(e)?xa(a):e?va(a):d(b)?a._d=b:Ba(a),a))}function Ba(b){var f=b._i;void 0===f?b._d=new Date:d(f)?b._d=new Date(+f):"string"==typeof f?da(b):c(f)?(b._a=e(f.slice(0),function(a){return parseInt(a,10)}),ta(b)):"object"==typeof f?ya(b):"number"==typeof f?b._d=new Date(f):a.createFromInputFallback(b)}function Ca(a,b,c,d,e){var f={};return"boolean"==typeof c&&(d=c,c=void 0),f._isAMomentObject=!0,f._useUTC=f._isUTC=e,f._l=c,f._i=a,f._f=b,f._strict=d,za(f)}function Da(a,b,c,d){return Ca(a,b,c,d,!1)}function Ea(a,b){var d,e;if(1===b.length&&c(b[0])&&(b=b[0]),!b.length)return Da();for(d=b[0],e=1;e<b.length;++e)(!b[e].isValid()||b[e][a](d))&&(d=b[e]);return d}function Fa(){var a=[].slice.call(arguments,0);return Ea("isBefore",a)}function Ga(){var a=[].slice.call(arguments,0);return Ea("isAfter",a)}function Ha(a){var b=B(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=y(),this._bubble()}function Ia(a){return a instanceof Ha}function Ja(a,b){H(a,0,0,function(){var a=this.utcOffset(),c="+";return 0>a&&(a=-a,c="-"),c+G(~~(a/60),2)+b+G(~~a%60,2)})}function Ka(a){var b=(a||"").match(fe)||[],c=b[b.length-1]||[],d=(c+"").match(Ce)||["-",0,0],e=+(60*d[1])+q(d[2]);return"+"===d[0]?e:-e}function La(b,c){var e,f;return c._isUTC?(e=c.clone(),f=(o(b)||d(b)?+b:+Da(b))-+e,e._d.setTime(+e._d+f),a.updateOffset(e,!1),e):Da(b).local()}function Ma(a){return 15*-Math.round(a._d.getTimezoneOffset()/15)}function Na(b,c){var d,e=this._offset||0;return null!=b?("string"==typeof b&&(b=Ka(b)),Math.abs(b)<16&&(b=60*b),!this._isUTC&&c&&(d=Ma(this)),this._offset=b,this._isUTC=!0,null!=d&&this.add(d,"m"),e!==b&&(!c||this._changeInProgress?bb(this,Ya(b-e,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,a.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?e:Ma(this)}function Oa(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}function Pa(a){return this.utcOffset(0,a)}function Qa(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(Ma(this),"m")),this}function Ra(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(Ka(this._i)),this}function Sa(a){return a=a?Da(a).utcOffset():0,(this.utcOffset()-a)%60===0}function Ta(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()}function Ua(){if("undefined"!=typeof this._isDSTShifted)return this._isDSTShifted;var a={};if(m(a,this),a=Aa(a),a._a){var b=a._isUTC?h(a._a):Da(a._a);this._isDSTShifted=this.isValid()&&r(a._a,b.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted}function Va(){return!this._isUTC}function Wa(){return this._isUTC}function Xa(){return this._isUTC&&0===this._offset}function Ya(a,b){var c,d,e,g=a,h=null;return Ia(a)?g={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(g={},b?g[b]=a:g.milliseconds=a):(h=De.exec(a))?(c="-"===h[1]?-1:1,g={y:0,d:q(h[me])*c,h:q(h[ne])*c,m:q(h[oe])*c,s:q(h[pe])*c,ms:q(h[qe])*c}):(h=Ee.exec(a))?(c="-"===h[1]?-1:1,g={y:Za(h[2],c),M:Za(h[3],c),d:Za(h[4],c),h:Za(h[5],c),m:Za(h[6],c),s:Za(h[7],c),w:Za(h[8],c)}):null==g?g={}:"object"==typeof g&&("from"in g||"to"in g)&&(e=_a(Da(g.from),Da(g.to)),g={},g.ms=e.milliseconds,g.M=e.months),d=new Ha(g),Ia(a)&&f(a,"_locale")&&(d._locale=a._locale),d}function Za(a,b){var c=a&&parseFloat(a.replace(",","."));return(isNaN(c)?0:c)*b}function $a(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function _a(a,b){var c;return b=La(b,a),a.isBefore(b)?c=$a(a,b):(c=$a(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function ab(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(ba(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=Ya(c,d),bb(this,e,a),this}}function bb(b,c,d,e){var f=c._milliseconds,g=c._days,h=c._months;e=null==e?!0:e,f&&b._d.setTime(+b._d+f*d),g&&E(b,"Date",D(b,"Date")+g*d),h&&X(b,D(b,"Month")+h*d),e&&a.updateOffset(b,g||h)}function cb(a,b){var c=a||Da(),d=La(c,this).startOf("day"),e=this.diff(d,"days",!0),f=-6>e?"sameElse":-1>e?"lastWeek":0>e?"lastDay":1>e?"sameDay":2>e?"nextDay":7>e?"nextWeek":"sameElse";return this.format(b&&b[f]||this.localeData().calendar(f,this,Da(c)))}function db(){return new n(this)}function eb(a,b){var c;return b=A("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+this>+a):(c=o(a)?+a:+Da(a),c<+this.clone().startOf(b))}function fb(a,b){var c;return b=A("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+a>+this):(c=o(a)?+a:+Da(a),+this.clone().endOf(b)<c)}function gb(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)}function hb(a,b){var c;return b=A(b||"millisecond"),"millisecond"===b?(a=o(a)?a:Da(a),+this===+a):(c=+Da(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))}function ib(a,b,c){var d,e,f=La(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=A(b),"year"===b||"month"===b||"quarter"===b?(e=jb(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:p(e)}function jb(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function kb(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")}function lb(){var a=this.clone().utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():K(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):K(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")}function mb(b){var c=K(this,b||a.defaultFormat);return this.localeData().postformat(c)}function nb(a,b){return this.isValid()?Ya({to:this,from:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function ob(a){return this.from(Da(),a)}function pb(a,b){return this.isValid()?Ya({from:this,to:a}).locale(this.locale()).humanize(!b):this.localeData().invalidDate()}function qb(a){return this.to(Da(),a)}function rb(a){var b;return void 0===a?this._locale._abbr:(b=y(a),null!=b&&(this._locale=b),this)}function sb(){return this._locale}function tb(a){switch(a=A(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a&&this.weekday(0),"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this}function ub(a){return a=A(a),void 0===a||"millisecond"===a?this:this.startOf(a).add(1,"isoWeek"===a?"week":a).subtract(1,"ms")}function vb(){return+this._d-6e4*(this._offset||0)}function wb(){return Math.floor(+this/1e3)}function xb(){return this._offset?new Date(+this):this._d}function yb(){var a=this;return[a.year(),a.month(),a.date(),a.hour(),a.minute(),a.second(),a.millisecond()]}function zb(){var a=this;return{years:a.year(),months:a.month(),date:a.date(),hours:a.hours(),minutes:a.minutes(),seconds:a.seconds(),milliseconds:a.milliseconds()}}function Ab(){return k(this)}function Bb(){return g({},j(this))}function Cb(){return j(this).overflow}function Db(a,b){H(0,[a,a.length],0,b)}function Eb(a,b,c){return ja(Da([a,11,31+b-c]),b,c).week}function Fb(a){var b=ja(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")}function Gb(a){var b=ja(this,1,4).year;return null==a?b:this.add(a-b,"y")}function Hb(){return Eb(this.year(),1,4)}function Ib(){var a=this.localeData()._week;return Eb(this.year(),a.dow,a.doy)}function Jb(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)}function Kb(a,b){return"string"!=typeof a?a:isNaN(a)?(a=b.weekdaysParse(a),"number"==typeof a?a:null):parseInt(a,10)}function Lb(a){return this._weekdays[a.day()]}function Mb(a){return this._weekdaysShort[a.day()]}function Nb(a){return this._weekdaysMin[a.day()]}function Ob(a){var b,c,d;for(this._weekdaysParse=this._weekdaysParse||[],b=0;7>b;b++)if(this._weekdaysParse[b]||(c=Da([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b}function Pb(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=Kb(a,this.localeData()),this.add(a-b,"d")):b}function Qb(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")}function Rb(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)}function Sb(a,b){H(a,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),b)})}function Tb(a,b){return b._meridiemParse}function Ub(a){return"p"===(a+"").toLowerCase().charAt(0)}function Vb(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"}function Wb(a,b){b[qe]=q(1e3*("0."+a))}function Xb(){return this._isUTC?"UTC":""}function Yb(){return this._isUTC?"Coordinated Universal Time":""}function Zb(a){return Da(1e3*a)}function $b(){return Da.apply(null,arguments).parseZone()}function _b(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.call(b,c):d}function ac(a){var b=this._longDateFormat[a],c=this._longDateFormat[a.toUpperCase()];return b||!c?b:(this._longDateFormat[a]=c.replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a])}function bc(){return this._invalidDate}function cc(a){return this._ordinal.replace("%d",a)}function dc(a){return a}function ec(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)}function fc(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)}function gc(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)}function hc(a,b,c,d){var e=y(),f=h().set(d,b);return e[c](f,a)}function ic(a,b,c,d,e){if("number"==typeof a&&(b=a,a=void 0),a=a||"",null!=b)return hc(a,b,c,e);var f,g=[];for(f=0;d>f;f++)g[f]=hc(a,f,c,e);return g}function jc(a,b){return ic(a,b,"months",12,"month")}function kc(a,b){return ic(a,b,"monthsShort",12,"month")}function lc(a,b){return ic(a,b,"weekdays",7,"day")}function mc(a,b){return ic(a,b,"weekdaysShort",7,"day")}function nc(a,b){return ic(a,b,"weekdaysMin",7,"day")}function oc(){var a=this._data;return this._milliseconds=_e(this._milliseconds),this._days=_e(this._days),this._months=_e(this._months),a.milliseconds=_e(a.milliseconds),a.seconds=_e(a.seconds),a.minutes=_e(a.minutes),a.hours=_e(a.hours),a.months=_e(a.months),a.years=_e(a.years),this}function pc(a,b,c,d){var e=Ya(b,c);return a._milliseconds+=d*e._milliseconds,a._days+=d*e._days,a._months+=d*e._months,a._bubble()}function qc(a,b){return pc(this,a,b,1)}function rc(a,b){return pc(this,a,b,-1)}function sc(a){return 0>a?Math.floor(a):Math.ceil(a)}function tc(){var a,b,c,d,e,f=this._milliseconds,g=this._days,h=this._months,i=this._data;return f>=0&&g>=0&&h>=0||0>=f&&0>=g&&0>=h||(f+=864e5*sc(vc(h)+g),g=0,h=0),i.milliseconds=f%1e3,a=p(f/1e3),i.seconds=a%60,b=p(a/60),i.minutes=b%60,c=p(b/60),i.hours=c%24,g+=p(c/24),e=p(uc(g)),h+=e,g-=sc(vc(e)),d=p(h/12),h%=12,i.days=g,i.months=h,i.years=d,this}function uc(a){return 4800*a/146097}function vc(a){return 146097*a/4800}function wc(a){var b,c,d=this._milliseconds;if(a=A(a),"month"===a||"year"===a)return b=this._days+d/864e5,c=this._months+uc(b),"month"===a?c:c/12;switch(b=this._days+Math.round(vc(this._months)),a){case"week":return b/7+d/6048e5;case"day":return b+d/864e5;case"hour":return 24*b+d/36e5;case"minute":return 1440*b+d/6e4;case"second":return 86400*b+d/1e3;case"millisecond":return Math.floor(864e5*b)+d;default:throw new Error("Unknown unit "+a)}}function xc(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*q(this._months/12)}function yc(a){return function(){return this.as(a)}}function zc(a){return a=A(a),this[a+"s"]()}function Ac(a){return function(){return this._data[a]}}function Bc(){return p(this.days()/7)}function Cc(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function Dc(a,b,c){var d=Ya(a).abs(),e=qf(d.as("s")),f=qf(d.as("m")),g=qf(d.as("h")),h=qf(d.as("d")),i=qf(d.as("M")),j=qf(d.as("y")),k=e<rf.s&&["s",e]||1===f&&["m"]||f<rf.m&&["mm",f]||1===g&&["h"]||g<rf.h&&["hh",g]||1===h&&["d"]||h<rf.d&&["dd",h]||1===i&&["M"]||i<rf.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,Cc.apply(null,k)}function Ec(a,b){return void 0===rf[a]?!1:void 0===b?rf[a]:(rf[a]=b,!0)}function Fc(a){var b=this.localeData(),c=Dc(this,!a,b);return a&&(c=b.pastFuture(+this,c)),b.postformat(c)}function Gc(){var a,b,c,d=sf(this._milliseconds)/1e3,e=sf(this._days),f=sf(this._months);a=p(d/60),b=p(a/60),d%=60,a%=60,c=p(f/12),f%=12;var g=c,h=f,i=e,j=b,k=a,l=d,m=this.asSeconds();return m?(0>m?"-":"")+"P"+(g?g+"Y":"")+(h?h+"M":"")+(i?i+"D":"")+(j||k||l?"T":"")+(j?j+"H":"")+(k?k+"M":"")+(l?l+"S":""):"P0D"}
//! moment.js locale configuration
//! locale : belarusian (be)
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire
function Hc(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function Ic(a,b,c){var d={mm:b?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:b?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===c?b?"хвіліна":"хвіліну":"h"===c?b?"гадзіна":"гадзіну":a+" "+Hc(d[c],+a)}function Jc(a,b){var c={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Kc(a,b){var c={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},d=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : breton (br)
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
function Lc(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+Oc(d[c],a)}function Mc(a){switch(Nc(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function Nc(a){return a>9?Nc(a%10):a}function Oc(a,b){return 2===b?Pc(a):a}function Pc(a){var b={m:"v",b:"v",d:"z"};return void 0===b[a.charAt(0)]?a:b[a.charAt(0)]+a.substring(1)}
//! moment.js locale configuration
//! locale : bosnian (bs)
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković
function Qc(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Rc(a){return a>1&&5>a&&1!==~~(a/10)}function Sc(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekund":"pár sekundami";case"m":return b?"minuta":d?"minutu":"minutou";case"mm":return b||d?e+(Rc(a)?"minuty":"minut"):e+"minutami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(Rc(a)?"hodiny":"hodin"):e+"hodinami";break;case"d":return b||d?"den":"dnem";case"dd":return b||d?e+(Rc(a)?"dny":"dní"):e+"dny";break;case"M":return b||d?"měsíc":"měsícem";case"MM":return b||d?e+(Rc(a)?"měsíce":"měsíců"):e+"měsíci";break;case"y":return b||d?"rok":"rokem";case"yy":return b||d?e+(Rc(a)?"roky":"let"):e+"lety"}}
//! moment.js locale configuration
//! locale : austrian german (de-at)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
function Tc(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : german (de)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
function Uc(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : estonian (et)
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka
function Vc(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}function Wc(a,b,c,d){var e="";switch(c){case"s":return d?"muutaman sekunnin":"muutama sekunti";case"m":return d?"minuutin":"minuutti";case"mm":e=d?"minuutin":"minuuttia";break;case"h":return d?"tunnin":"tunti";case"hh":e=d?"tunnin":"tuntia";break;case"d":return d?"päivän":"päivä";case"dd":e=d?"päivän":"päivää";break;case"M":return d?"kuukauden":"kuukausi";case"MM":e=d?"kuukauden":"kuukautta";break;case"y":return d?"vuoden":"vuosi";case"yy":e=d?"vuoden":"vuotta"}return e=Xc(a,d)+" "+e}function Xc(a,b){return 10>a?b?Pf[a]:Of[a]:a}
//! moment.js locale configuration
//! locale : hrvatski (hr)
//! author : Bojan Marković : https://github.com/bmarkovic
function Yc(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function Zc(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function $c(a){return(a?"":"[múlt] ")+"["+Uf[this.day()]+"] LT[-kor]"}
//! moment.js locale configuration
//! locale : Armenian (hy-am)
//! author : Armendarabyan : https://github.com/armendarabyan
function _c(a,b){var c={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function ad(a,b){var c="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return c[a.month()]}function bd(a,b){var c="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return c[a.day()]}
//! moment.js locale configuration
//! locale : icelandic (is)
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
function cd(a){return a%100===11?!0:a%10===1?!1:!0}function dd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return b?"mínúta":"mínútu";case"mm":return cd(a)?e+(b||d?"mínútur":"mínútum"):b?e+"mínúta":e+"mínútu";case"hh":return cd(a)?e+(b||d?"klukkustundir":"klukkustundum"):e+"klukkustund";case"d":return b?"dagur":d?"dag":"degi";case"dd":return cd(a)?b?e+"dagar":e+(d?"daga":"dögum"):b?e+"dagur":e+(d?"dag":"degi");case"M":return b?"mánuður":d?"mánuð":"mánuði";case"MM":return cd(a)?b?e+"mánuðir":e+(d?"mánuði":"mánuðum"):b?e+"mánuður":e+(d?"mánuð":"mánuði");case"y":return b||d?"ár":"ári";case"yy":return cd(a)?e+(b||d?"ár":"árum"):e+(b||d?"ár":"ári")}}
//! moment.js locale configuration
//! locale : Georgian (ka)
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
function ed(a,b){var c={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},d=/D[oD] *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function fd(a,b){var c={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},d=/(წინა|შემდეგ)/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : Luxembourgish (lb)
//! author : mweimerskirch : https://github.com/mweimerskirch, David Raison : https://github.com/kwisatz
function gd(a,b,c,d){var e={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?e[c][0]:e[c][1]}function hd(a){var b=a.substr(0,a.indexOf(" "));return jd(b)?"a "+a:"an "+a}function id(a){var b=a.substr(0,a.indexOf(" "));return jd(b)?"viru "+a:"virun "+a}function jd(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)return!0;if(10>a)return a>=4&&7>=a?!0:!1;if(100>a){var b=a%10,c=a/10;return jd(0===b?c:b)}if(1e4>a){for(;a>=10;)a/=10;return jd(a)}return a/=1e3,jd(a)}function kd(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function ld(a,b){var c={nominative:"sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split("_"),accusative:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function md(a,b,c,d){return b?od(c)[0]:d?od(c)[1]:od(c)[2]}function nd(a){return a%10===0||a>10&&20>a}function od(a){return Vf[a].split("_")}function pd(a,b,c,d){var e=a+" ";return 1===a?e+md(a,b,c[0],d):b?e+(nd(a)?od(c)[1]:od(c)[0]):d?e+od(c)[1]:e+(nd(a)?od(c)[1]:od(c)[2])}function qd(a,b){var c=-1===b.indexOf("dddd HH:mm"),d=Wf[a.day()];return c?d:d.substring(0,d.length-2)+"į"}function rd(a,b,c){return c?b%10===1&&11!==b?a[2]:a[3]:b%10===1&&11!==b?a[0]:a[1]}function sd(a,b,c){return a+" "+rd(Xf[c],a,b)}function td(a,b,c){return rd(Xf[c],a,b)}function ud(a,b){return b?"dažas sekundes":"dažām sekundēm"}function vd(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function wd(a,b,c){var d=a+" ";switch(c){case"m":return b?"minuta":"minutę";case"mm":return d+(vd(a)?"minuty":"minut");case"h":return b?"godzina":"godzinę";case"hh":return d+(vd(a)?"godziny":"godzin");case"MM":return d+(vd(a)?"miesiące":"miesięcy");case"yy":return d+(vd(a)?"lata":"lat")}}
//! moment.js locale configuration
//! locale : romanian (ro)
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly
function xd(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}
//! moment.js locale configuration
//! locale : russian (ru)
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
function yd(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function zd(a,b,c){var d={mm:b?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===c?b?"минута":"минуту":a+" "+yd(d[c],+a)}function Ad(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Bd(a,b){var c={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Cd(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}function Dd(a){return a>1&&5>a}function Ed(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekúnd":"pár sekundami";case"m":return b?"minúta":d?"minútu":"minútou";case"mm":return b||d?e+(Dd(a)?"minúty":"minút"):e+"minútami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(Dd(a)?"hodiny":"hodín"):e+"hodinami";break;case"d":return b||d?"deň":"dňom";case"dd":return b||d?e+(Dd(a)?"dni":"dní"):e+"dňami";break;case"M":return b||d?"mesiac":"mesiacom";case"MM":return b||d?e+(Dd(a)?"mesiace":"mesiacov"):e+"mesiacmi";break;case"y":return b||d?"rok":"rokom";case"yy":return b||d?e+(Dd(a)?"roky":"rokov"):e+"rokmi"}}
//! moment.js locale configuration
//! locale : slovenian (sl)
//! author : Robert Sedovšek : https://github.com/sedovsek
function Fd(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nekaj sekund":"nekaj sekundami";case"m":return b?"ena minuta":"eno minuto";case"mm":return e+=1===a?b?"minuta":"minuto":2===a?b||d?"minuti":"minutama":5>a?b||d?"minute":"minutami":b||d?"minut":"minutami";case"h":return b?"ena ura":"eno uro";case"hh":return e+=1===a?b?"ura":"uro":2===a?b||d?"uri":"urama":5>a?b||d?"ure":"urami":b||d?"ur":"urami";case"d":return b||d?"en dan":"enim dnem";case"dd":return e+=1===a?b||d?"dan":"dnem":2===a?b||d?"dni":"dnevoma":b||d?"dni":"dnevi";case"M":return b||d?"en mesec":"enim mesecem";case"MM":return e+=1===a?b||d?"mesec":"mesecem":2===a?b||d?"meseca":"mesecema":5>a?b||d?"mesece":"meseci":b||d?"mesecev":"meseci";case"y":return b||d?"eno leto":"enim letom";case"yy":return e+=1===a?b||d?"leto":"letom":2===a?b||d?"leti":"letoma":5>a?b||d?"leta":"leti":b||d?"let":"leti"}}function Gd(a,b,c,d){var e={s:["viensas secunds","'iensas secunds"],m:["'n míut","'iens míut"],mm:[a+" míuts"," "+a+" míuts"],h:["'n þora","'iensa þora"],hh:[a+" þoras"," "+a+" þoras"],d:["'n ziua","'iensa ziua"],dd:[a+" ziuas"," "+a+" ziuas"],M:["'n mes","'iens mes"],MM:[a+" mesen"," "+a+" mesen"],y:["'n ar","'iens ar"],yy:[a+" ars"," "+a+" ars"]};return d?e[c][0]:b?e[c][0]:e[c][1].trim()}
//! moment.js locale configuration
//! locale : ukrainian (uk)
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
function Hd(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function Id(a,b,c){var d={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===c?b?"хвилина":"хвилину":"h"===c?b?"година":"годину":a+" "+Hd(d[c],+a)}function Jd(a,b){var c={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function Kd(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function Ld(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}var Md,Nd,Od=a.momentProperties=[],Pd=!1,Qd={},Rd={},Sd=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,Td=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Ud={},Vd={},Wd=/\d/,Xd=/\d\d/,Yd=/\d{3}/,Zd=/\d{4}/,$d=/[+-]?\d{6}/,_d=/\d\d?/,ae=/\d{1,3}/,be=/\d{1,4}/,ce=/[+-]?\d{1,6}/,de=/\d+/,ee=/[+-]?\d+/,fe=/Z|[+-]\d\d:?\d\d/gi,ge=/[+-]?\d+(\.\d{1,3})?/,he=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,ie={},je={},ke=0,le=1,me=2,ne=3,oe=4,pe=5,qe=6;H("M",["MM",2],"Mo",function(){return this.month()+1}),H("MMM",0,0,function(a){return this.localeData().monthsShort(this,a)}),H("MMMM",0,0,function(a){return this.localeData().months(this,a)}),z("month","M"),N("M",_d),N("MM",_d,Xd),N("MMM",he),N("MMMM",he),Q(["M","MM"],function(a,b){b[le]=q(a)-1}),Q(["MMM","MMMM"],function(a,b,c,d){var e=c._locale.monthsParse(a,d,c._strict);null!=e?b[le]=e:j(c).invalidMonth=a});var re="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),se="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),te={};a.suppressDeprecationWarnings=!1;var ue=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,ve=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],we=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],xe=/^\/?Date\((\-?\d+)/i;a.createFromInputFallback=aa("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),H(0,["YY",2],0,function(){return this.year()%100}),H(0,["YYYY",4],0,"year"),H(0,["YYYYY",5],0,"year"),H(0,["YYYYYY",6,!0],0,"year"),z("year","y"),N("Y",ee),N("YY",_d,Xd),N("YYYY",be,Zd),N("YYYYY",ce,$d),N("YYYYYY",ce,$d),Q(["YYYYY","YYYYYY"],ke),Q("YYYY",function(b,c){c[ke]=2===b.length?a.parseTwoDigitYear(b):q(b)}),Q("YY",function(b,c){c[ke]=a.parseTwoDigitYear(b)}),a.parseTwoDigitYear=function(a){return q(a)+(q(a)>68?1900:2e3)};var ye=C("FullYear",!1);H("w",["ww",2],"wo","week"),H("W",["WW",2],"Wo","isoWeek"),z("week","w"),z("isoWeek","W"),N("w",_d),N("ww",_d,Xd),N("W",_d),N("WW",_d,Xd),R(["w","ww","W","WW"],function(a,b,c,d){b[d.substr(0,1)]=q(a)});var ze={dow:0,doy:6};H("DDD",["DDDD",3],"DDDo","dayOfYear"),z("dayOfYear","DDD"),N("DDD",ae),N("DDDD",Yd),Q(["DDD","DDDD"],function(a,b,c){c._dayOfYear=q(a)}),a.ISO_8601=function(){};var Ae=aa("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(){var a=Da.apply(null,arguments);return this>a?this:a}),Be=aa("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(){var a=Da.apply(null,arguments);return a>this?this:a});Ja("Z",":"),Ja("ZZ",""),N("Z",fe),N("ZZ",fe),Q(["Z","ZZ"],function(a,b,c){c._useUTC=!0,c._tzm=Ka(a)});var Ce=/([\+\-]|\d\d)/gi;a.updateOffset=function(){};var De=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Ee=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;Ya.fn=Ha.prototype;var Fe=ab(1,"add"),Ge=ab(-1,"subtract");a.defaultFormat="YYYY-MM-DDTHH:mm:ssZ";var He=aa("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(a){return void 0===a?this.localeData():this.locale(a)});H(0,["gg",2],0,function(){return this.weekYear()%100}),H(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Db("gggg","weekYear"),Db("ggggg","weekYear"),Db("GGGG","isoWeekYear"),Db("GGGGG","isoWeekYear"),z("weekYear","gg"),z("isoWeekYear","GG"),N("G",ee),N("g",ee),N("GG",_d,Xd),N("gg",_d,Xd),N("GGGG",be,Zd),N("gggg",be,Zd),N("GGGGG",ce,$d),N("ggggg",ce,$d),R(["gggg","ggggg","GGGG","GGGGG"],function(a,b,c,d){b[d.substr(0,2)]=q(a)}),R(["gg","GG"],function(b,c,d,e){c[e]=a.parseTwoDigitYear(b)}),H("Q",0,0,"quarter"),z("quarter","Q"),N("Q",Wd),Q("Q",function(a,b){b[le]=3*(q(a)-1)}),H("D",["DD",2],"Do","date"),z("date","D"),N("D",_d),N("DD",_d,Xd),N("Do",function(a,b){return a?b._ordinalParse:b._ordinalParseLenient}),Q(["D","DD"],me),Q("Do",function(a,b){b[me]=q(a.match(_d)[0],10)});var Ie=C("Date",!0);H("d",0,"do","day"),H("dd",0,0,function(a){return this.localeData().weekdaysMin(this,a)}),H("ddd",0,0,function(a){return this.localeData().weekdaysShort(this,a)}),H("dddd",0,0,function(a){return this.localeData().weekdays(this,a)}),H("e",0,0,"weekday"),H("E",0,0,"isoWeekday"),z("day","d"),z("weekday","e"),z("isoWeekday","E"),N("d",_d),N("e",_d),N("E",_d),N("dd",he),N("ddd",he),N("dddd",he),R(["dd","ddd","dddd"],function(a,b,c){var d=c._locale.weekdaysParse(a);null!=d?b.d=d:j(c).invalidWeekday=a}),R(["d","e","E"],function(a,b,c,d){b[d]=q(a)});var Je="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Ke="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Le="Su_Mo_Tu_We_Th_Fr_Sa".split("_");H("H",["HH",2],0,"hour"),H("h",["hh",2],0,function(){return this.hours()%12||12}),Sb("a",!0),Sb("A",!1),z("hour","h"),N("a",Tb),N("A",Tb),N("H",_d),N("h",_d),N("HH",_d,Xd),N("hh",_d,Xd),Q(["H","HH"],ne),Q(["a","A"],function(a,b,c){c._isPm=c._locale.isPM(a),c._meridiem=a}),Q(["h","hh"],function(a,b,c){b[ne]=q(a),j(c).bigHour=!0});var Me=/[ap]\.?m?\.?/i,Ne=C("Hours",!0);H("m",["mm",2],0,"minute"),z("minute","m"),N("m",_d),N("mm",_d,Xd),Q(["m","mm"],oe);var Oe=C("Minutes",!1);H("s",["ss",2],0,"second"),z("second","s"),N("s",_d),N("ss",_d,Xd),Q(["s","ss"],pe);var Pe=C("Seconds",!1);H("S",0,0,function(){return~~(this.millisecond()/100)}),H(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),H(0,["SSS",3],0,"millisecond"),H(0,["SSSS",4],0,function(){return 10*this.millisecond()}),H(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),H(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),H(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),H(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),H(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),z("millisecond","ms"),N("S",ae,Wd),N("SS",ae,Xd),N("SSS",ae,Yd);var Qe;for(Qe="SSSS";Qe.length<=9;Qe+="S")N(Qe,de);for(Qe="S";Qe.length<=9;Qe+="S")Q(Qe,Wb);var Re=C("Milliseconds",!1);H("z",0,0,"zoneAbbr"),H("zz",0,0,"zoneName");var Se=n.prototype;Se.add=Fe,Se.calendar=cb,Se.clone=db,Se.diff=ib,Se.endOf=ub,Se.format=mb,Se.from=nb,Se.fromNow=ob,Se.to=pb,Se.toNow=qb,Se.get=F,Se.invalidAt=Cb,Se.isAfter=eb,Se.isBefore=fb,Se.isBetween=gb,Se.isSame=hb,Se.isValid=Ab,Se.lang=He,Se.locale=rb,Se.localeData=sb,Se.max=Be,Se.min=Ae,Se.parsingFlags=Bb,Se.set=F,Se.startOf=tb,Se.subtract=Ge,Se.toArray=yb,Se.toObject=zb,Se.toDate=xb,Se.toISOString=lb,Se.toJSON=lb,Se.toString=kb,Se.unix=wb,Se.valueOf=vb,Se.year=ye,Se.isLeapYear=ia,Se.weekYear=Fb,Se.isoWeekYear=Gb,Se.quarter=Se.quarters=Jb,Se.month=Y,Se.daysInMonth=Z,Se.week=Se.weeks=na,Se.isoWeek=Se.isoWeeks=oa,Se.weeksInYear=Ib,Se.isoWeeksInYear=Hb,Se.date=Ie,Se.day=Se.days=Pb,Se.weekday=Qb,Se.isoWeekday=Rb,Se.dayOfYear=qa,Se.hour=Se.hours=Ne,Se.minute=Se.minutes=Oe,Se.second=Se.seconds=Pe,Se.millisecond=Se.milliseconds=Re,Se.utcOffset=Na,Se.utc=Pa,Se.local=Qa,Se.parseZone=Ra,Se.hasAlignedHourOffset=Sa,Se.isDST=Ta,Se.isDSTShifted=Ua,Se.isLocal=Va,Se.isUtcOffset=Wa,Se.isUtc=Xa,Se.isUTC=Xa,Se.zoneAbbr=Xb,Se.zoneName=Yb,Se.dates=aa("dates accessor is deprecated. Use date instead.",Ie),Se.months=aa("months accessor is deprecated. Use month instead",Y),Se.years=aa("years accessor is deprecated. Use year instead",ye),Se.zone=aa("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",Oa);var Te=Se,Ue={sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},Ve={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},We="Invalid date",Xe="%d",Ye=/\d{1,2}/,Ze={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},$e=s.prototype;$e._calendar=Ue,$e.calendar=_b,$e._longDateFormat=Ve,$e.longDateFormat=ac,$e._invalidDate=We,$e.invalidDate=bc,$e._ordinal=Xe,$e.ordinal=cc,$e._ordinalParse=Ye,$e.preparse=dc,$e.postformat=dc,$e._relativeTime=Ze,$e.relativeTime=ec,$e.pastFuture=fc,$e.set=gc,$e.months=U,$e._months=re,$e.monthsShort=V,$e._monthsShort=se,$e.monthsParse=W,$e.week=ka,$e._week=ze,$e.firstDayOfYear=ma,$e.firstDayOfWeek=la,$e.weekdays=Lb,$e._weekdays=Je,$e.weekdaysMin=Nb,$e._weekdaysMin=Le,$e.weekdaysShort=Mb,$e._weekdaysShort=Ke,$e.weekdaysParse=Ob,$e.isPM=Ub,$e._meridiemParse=Me,$e.meridiem=Vb,w("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===q(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.lang=aa("moment.lang is deprecated. Use moment.locale instead.",w),a.langData=aa("moment.langData is deprecated. Use moment.localeData instead.",y);var _e=Math.abs,af=yc("ms"),bf=yc("s"),cf=yc("m"),df=yc("h"),ef=yc("d"),ff=yc("w"),gf=yc("M"),hf=yc("y"),jf=Ac("milliseconds"),kf=Ac("seconds"),lf=Ac("minutes"),mf=Ac("hours"),nf=Ac("days"),of=Ac("months"),pf=Ac("years"),qf=Math.round,rf={s:45,m:45,h:22,d:26,M:11},sf=Math.abs,tf=Ha.prototype;tf.abs=oc,tf.add=qc,tf.subtract=rc,tf.as=wc,tf.asMilliseconds=af,tf.asSeconds=bf,tf.asMinutes=cf,tf.asHours=df,tf.asDays=ef,tf.asWeeks=ff,tf.asMonths=gf,tf.asYears=hf,tf.valueOf=xc,tf._bubble=tc,tf.get=zc,tf.milliseconds=jf,tf.seconds=kf,tf.minutes=lf,tf.hours=mf,tf.days=nf,tf.weeks=Bc,tf.months=of,tf.years=pf,tf.humanize=Fc,tf.toISOString=Gc,tf.toString=Gc,tf.toJSON=Gc,tf.locale=rb,tf.localeData=sb,tf.toIsoString=aa("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Gc),tf.lang=He,H("X",0,0,"unix"),H("x",0,0,"valueOf"),N("x",ee),N("X",ge),Q("X",function(a,b,c){c._d=new Date(1e3*parseFloat(a,10))}),Q("x",function(a,b,c){c._d=new Date(q(a))}),
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
a.version="2.10.6",b(Da),a.fn=Te,a.min=Fa,a.max=Ga,a.utc=h,a.unix=Zb,a.months=jc,a.isDate=d,a.locale=w,a.invalid=l,a.duration=Ya,a.isMoment=o,a.weekdays=lc,a.parseZone=$b,a.localeData=y,a.isDuration=Ia,a.monthsShort=kc,a.weekdaysMin=nc,a.defineLocale=x,a.weekdaysShort=mc,a.normalizeUnits=A,a.relativeTimeThreshold=Ec;var uf=a,vf=(uf.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),uf.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),wf={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},xf=(uf.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return wf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return vf[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),uf.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),yf={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},zf=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},Af={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},Bf=function(a){return function(b,c,d,e){var f=zf(b),g=Af[a][zf(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},Cf=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"],Df=(uf.defineLocale("ar",{months:Cf,monthsShort:Cf,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:Bf("s"),m:Bf("m"),mm:Bf("m"),h:Bf("h"),hh:Bf("h"),d:Bf("d"),dd:Bf("d"),M:Bf("M"),MM:Bf("M"),y:Bf("y"),yy:Bf("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return yf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return xf[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),{1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"}),Ef=(uf.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a,b,c){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(Df[b]||Df[c]||Df[d])},week:{dow:1,doy:7}}),uf.defineLocale("be",{months:Jc,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:Kc,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:Ic,mm:Ic,h:Ic,hh:Ic,d:"дзень",dd:Ic,M:"месяц",MM:Ic,y:"год",yy:Ic},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}}),uf.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),{1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"}),Ff={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},Gf=(uf.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm সময়",LLLL:"dddd, D MMMM YYYY, A h:mm সময়"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return Ff[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ef[a]})},meridiemParse:/রাত|সকাল|দুপুর|বিকেল|রাত/,isPM:function(a){return/^(দুপুর|বিকেল|রাত)$/.test(a)},meridiem:function(a,b,c){return 4>a?"রাত":10>a?"সকাল":17>a?"দুপুর":20>a?"বিকেল":"রাত"},week:{dow:0,doy:6}}),{1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"}),Hf={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},If=(uf.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"A h:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm",LLLL:"dddd, D MMMM YYYY, A h:mm"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return Hf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Gf[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(a){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(a)},meridiem:function(a,b,c){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),uf.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY h[e]mm A",LLLL:"dddd, D [a viz] MMMM YYYY h[e]mm A"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:Lc,h:"un eur",hh:"%d eur",d:"un devezh",dd:Lc,M:"ur miz",MM:Lc,y:"ur bloaz",yy:Mc},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}}),uf.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Qc,mm:Qc,h:Qc,hh:Qc,d:"dan",dd:Qc,M:"mjesec",MM:Qc,y:"godinu",yy:Qc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),uf.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return("w"===b||"W"===b)&&(c="a"),a+c},week:{dow:1,doy:4}}),"leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")),Jf="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),Kf=(uf.defineLocale("cs",{months:If,monthsShort:Jf,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(If,Jf),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:Sc,m:Sc,mm:Sc,h:Sc,hh:Sc,d:Sc,dd:Sc,M:Sc,MM:Sc,y:Sc,yy:Sc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/ҫул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),uf.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}}),uf.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd [d.] D. MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Tc,mm:"%d Minuten",h:Tc,hh:"%d Stunden",d:Tc,dd:Tc,M:Tc,MM:Tc,y:Tc,yy:Tc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY HH:mm",LLLL:"dddd, D. MMMM YYYY HH:mm"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:Uc,mm:"%d Minuten",h:Uc,hh:"%d Stunden",d:Uc,dd:Uc,M:Uc,MM:Uc,y:Uc,yy:Uc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return"function"==typeof c&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),uf.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),uf.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY h:mm A",LLLL:"dddd, D MMMM, YYYY h:mm A"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),uf.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),uf.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY HH:mm",LLLL:"dddd, [la] D[-an de] MMMM, YYYY HH:mm"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}}),"Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_")),Lf="Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),Mf=(uf.defineLocale("es",{months:"Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Lf[a.month()]:Kf[a.month()]},weekdays:"Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY H:mm",LLLL:"dddd, D [de] MMMM [de] YYYY H:mm"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),uf.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:Vc,m:Vc,mm:Vc,h:Vc,hh:Vc,d:Vc,dd:"%d päeva",M:Vc,MM:Vc,y:Vc,yy:Vc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] HH:mm",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] HH:mm",llll:"ddd, YYYY[ko] MMM D[a] HH:mm"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",
lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"}),Nf={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},Of=(uf.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a,b,c){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return Nf[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return Mf[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}}),"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")),Pf=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",Of[7],Of[8],Of[9]],Qf=(uf.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] HH.mm",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] HH.mm",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] HH.mm",llll:"ddd, Do MMM YYYY, [klo] HH.mm"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:Wc,m:Wc,mm:Wc,h:Wc,hh:Wc,d:Wc,dd:Wc,M:Wc,MM:Wc,y:Wc,yy:Wc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D. MMMM, YYYY HH:mm"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|e)/,ordinal:function(a){return a+(1===a?"er":"e")}}),uf.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,doy:4}}),"jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")),Rf="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),Sf=(uf.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Rf[a.month()]:Qf[a.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),uf.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd D MMMM YYYY H:mm"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}}),uf.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY HH:mm",LLLL:"dddd, D [ב]MMMM YYYY HH:mm",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Tf={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Uf=(uf.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm बजे",LLLL:"dddd, D MMMM YYYY, A h:mm बजे"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Tf[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Sf[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,doy:6}}),uf.defineLocale("hr",{months:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:Yc,mm:Yc,h:Yc,hh:Yc,d:"dan",dd:Yc,M:"mjesec",MM:Yc,y:"godinu",yy:Yc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),"vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")),Vf=(uf.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return $c.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return $c.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:Zc,m:Zc,mm:Zc,h:Zc,hh:Zc,d:Zc,dd:Zc,M:Zc,MM:Zc,y:Zc,yy:Zc},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),uf.defineLocale("hy-am",{months:_c,monthsShort:ad,weekdays:bd,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., HH:mm",LLLL:"dddd, D MMMM YYYY թ., HH:mm"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}}),uf.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),uf.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H:mm",LLLL:"dddd, D. MMMM YYYY [kl.] H:mm"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:dd,m:dd,mm:dd,h:"klukkustund",hh:dd,d:dd,dd:dd,M:dd,MM:dd,y:dd,yy:dd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),uf.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"Ah時m分s秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日Ah時m分",LLLL:"YYYY年M月D日Ah時m分 dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a,b,c){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),uf.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(a,b){return 12===a&&(a=0),"enjing"===b?a:"siyang"===b?a>=11?a:a+12:"sonten"===b||"ndalu"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"enjing":15>a?"siyang":19>a?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),uf.defineLocale("ka",{months:ed,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:fd,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY h:mm A",LLLL:"dddd, D MMMM YYYY h:mm A"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}}),uf.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}}),uf.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 A h시 m분",LLLL:"YYYY년 MMMM D일 dddd A h시 m분"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a,b,c){return 12>a?"오전":"오후"}}),uf.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm [Auer]",LLLL:"dddd, D. MMMM YYYY H:mm [Auer]"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:hd,past:id,s:"e puer Sekonnen",m:gd,mm:"%d Minutten",h:gd,hh:"%d Stonnen",d:gd,dd:"%d Deeg",M:gd,MM:"%d Méint",y:gd,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"}),Wf="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),Xf=(uf.defineLocale("lt",{months:ld,monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:qd,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], HH:mm [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], HH:mm [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:kd,m:md,mm:pd,h:md,hh:pd,d:md,dd:pd,M:md,MM:pd,y:md,yy:pd},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}}),{m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")}),Yf=(uf.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, HH:mm",LLLL:"YYYY. [gada] D. MMMM, dddd, HH:mm"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:ud,m:td,mm:sd,h:td,hh:sd,d:td,dd:sd,M:td,MM:sd,y:td,yy:sd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Yf.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Yf.correctGrammaticalCase(a,d)}}),Zf=(uf.defineLocale("me",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sri.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:Yf.translate,mm:Yf.translate,h:Yf.translate,hh:Yf.translate,d:"dan",dd:Yf.translate,M:"mjesec",MM:Yf.translate,y:"godinu",yy:Yf.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),uf.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),uf.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm -നു",LLLL:"dddd, D MMMM YYYY, A h:mm -നു"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(a){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(a)},meridiem:function(a,b,c){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),$f={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},_f=(uf.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, A h:mm वाजता",LLLL:"dddd, D MMMM YYYY, A h:mm वाजता"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return $f[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Zf[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),uf.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",
lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),uf.defineLocale("ms",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] HH.mm",LLLL:"dddd, D MMMM YYYY [pukul] HH.mm"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),{1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"}),ag={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},bg=(uf.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return ag[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return _f[a]})},week:{dow:1,doy:4}}),uf.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"H.mm.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] H.mm",LLLL:"dddd D. MMMM YYYY [kl.] H.mm"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),cg={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},dg=(uf.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, Aको h:mm बजे",LLLL:"dddd, D MMMM YYYY, Aको h:mm बजे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return cg[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return bg[a]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(a,b){return 12===a&&(a=0),"राती"===b?3>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"बेलुका"===b||"साँझ"===b?a+12:void 0},meridiem:function(a,b,c){return 3>a?"राती":10>a?"बिहान":15>a?"दिउँसो":18>a?"बेलुका":20>a?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}}),"jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")),eg="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),fg=(uf.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?eg[a.month()]:dg[a.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),uf.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),gg="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"),hg=(uf.defineLocale("pl",{months:function(a,b){return""===b?"("+gg[a.month()]+"|"+fg[a.month()]+")":/D MMMM/.test(b)?gg[a.month()]:fg[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:wd,mm:wd,h:wd,hh:wd,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:wd,y:"rok",yy:wd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY [às] HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"poucos segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),uf.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY HH:mm",LLLL:"dddd, D [de] MMMM [de] YYYY HH:mm"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),uf.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:xd,h:"o oră",hh:xd,d:"o zi",dd:xd,M:"o lună",MM:xd,y:"un an",yy:xd},week:{dow:1,doy:7}}),uf.defineLocale("ru",{months:Ad,monthsShort:Bd,weekdays:Cd,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., HH:mm",LLLL:"dddd, D MMMM YYYY г., HH:mm"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:zd,mm:zd,h:"час",hh:zd,d:"день",dd:zd,M:"месяц",MM:zd,y:"год",yy:zd},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}}),uf.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, a h:mm",LLLL:"YYYY MMMM D [වැනි] dddd, a h:mm:ss"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(a){return a+" වැනි"},meridiem:function(a,b,c){return a>11?c?"ප.ව.":"පස් වරු":c?"පෙ.ව.":"පෙර වරු"}}),"január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")),ig="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),jg=(uf.defineLocale("sk",{months:hg,monthsShort:ig,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(hg,ig),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd D. MMMM YYYY H:mm"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:Ed,m:Ed,mm:Ed,h:Ed,hh:Ed,d:Ed,dd:Ed,M:Ed,MM:Ed,y:Ed,yy:Ed},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:Fd,m:Fd,mm:Fd,h:Fd,hh:Fd,d:Fd,dd:Fd,M:Fd,MM:Fd,y:Fd,yy:Fd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),uf.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a,b,c){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=jg.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+jg.correctGrammaticalCase(a,d)}}),kg=(uf.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:jg.translate,mm:jg.translate,h:jg.translate,hh:jg.translate,d:"дан",dd:jg.translate,M:"месец",MM:jg.translate,y:"годину",yy:jg.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=kg.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+kg.correctGrammaticalCase(a,d)}}),lg=(uf.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"H:mm:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY H:mm",LLLL:"dddd, D. MMMM YYYY H:mm"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:kg.translate,mm:kg.translate,h:kg.translate,hh:kg.translate,d:"dan",dd:kg.translate,M:"mesec",MM:kg.translate,y:"godinu",yy:kg.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),uf.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}}),uf.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, HH:mm",LLLL:"dddd, D MMMM YYYY, HH:mm"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a,b,c){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}}),uf.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"H นาฬิกา m นาที s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา H นาฬิกา m นาที",LLLL:"วันddddที่ D MMMM YYYY เวลา H นาฬิกา m นาที"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a},meridiem:function(a,b,c){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),uf.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY HH:mm",LLLL:"dddd, MMMM DD, YYYY HH:mm"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),{1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"}),mg=(uf.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(lg[b]||lg[c]||lg[d])},week:{dow:1,doy:7}}),uf.defineLocale("tzl",{months:"Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split("_"),monthsShort:"Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),weekdays:"Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),weekdaysShort:"Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),weekdaysMin:"Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM [dallas] YYYY",LLL:"D. MMMM [dallas] YYYY LT",LLLL:"dddd, [li] D. MMMM [dallas] YYYY LT"},meridiem:function(a,b,c){return a>11?c?"d'o":"D'O":c?"d'a":"D'A"},calendar:{sameDay:"[oxhi à] LT",nextDay:"[demà à] LT",nextWeek:"dddd [à] LT",lastDay:"[ieiri à] LT",lastWeek:"[sür el] dddd [lasteu à] LT",sameElse:"L"},relativeTime:{future:"osprei %s",past:"ja%s",s:Gd,m:Gd,mm:Gd,h:Gd,hh:Gd,d:Gd,dd:Gd,M:Gd,MM:Gd,y:Gd,yy:Gd},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),uf.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),uf.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),uf.defineLocale("uk",{months:Jd,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:Kd,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"},calendar:{sameDay:Ld("[Сьогодні "),nextDay:Ld("[Завтра "),lastDay:Ld("[Вчора "),nextWeek:Ld("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return Ld("[Минулої] dddd [").call(this);case 1:case 2:case 4:return Ld("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:Id,mm:Id,h:"годину",hh:Id,d:"день",dd:Id,M:"місяць",MM:Id,y:"рік",yy:Id},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}}),uf.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),uf.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY HH:mm",LLLL:"dddd, D MMMM [năm] YYYY HH:mm",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY HH:mm",
llll:"ddd, D MMM YYYY HH:mm"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),uf.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah点mm分",LLLL:"YYYY年MMMD日ddddAh点mm分",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah点mm分",llll:"YYYY年MMMD日ddddAh点mm分"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b,c){var d=100*a+b;return 600>d?"凌晨":900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var a,b;return a=uf().startOf("week"),b=this.unix()-a.unix()>=604800?"[下]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},lastWeek:function(){var a,b;return a=uf().startOf("week"),b=this.unix()<a.unix()?"[上]":"[本]",0===this.minutes()?b+"dddAh点整":b+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),uf.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日Ah點mm分",LLLL:"YYYY年MMMD日ddddAh點mm分",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日Ah點mm分",llll:"YYYY年MMMD日ddddAh點mm分"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;return 900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}}),uf);return mg.locale("en"),mg});
/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date)
    {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the default flag for moment's strict date parsing
        formatStrict: false,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // Render days of the calendar grid that fall in the next or previous month
        showDaysInNextAndPreviousMonths: false,

        // how many months are visible
        numberOfMonths: 1,

        // time
        showTime: true,
        showSeconds: false,
        use24hour: false,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
            midnight      : 'Midnight',
            noon          : 'Noon'
        },

        // Theme Classname
        theme: null,

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(opts)
    {
        var arr = [];
        if (opts.isEmpty) {
            if (opts.showDaysInNextAndPreviousMonths) {
                arr.push('is-outside-current-month');
            } else {
                return '<td class="is-empty"></td>';
            }
        }
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
                        opts.day +
                 '</button>' +
               '</td>';
    },

    renderWeek = function (d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL)
    {
        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance, c, year, month, refYear)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }
        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },

    renderTimePicker = function(num_options, selected_val, select_class, display_func) {
        var to_return = '<td><select class="pika-select '+select_class+'">';
        for (var i=0; i<num_options; i++) {
            to_return += '<option value="'+i+'" '+(i==selected_val ? 'selected' : '')+'>'+display_func(i)+'</option>'
        }
        to_return += '</select></td>';
        return to_return;
    },

    renderTime = function(hh, mm, ss, opts)
    {
        var to_return = '<table cellpadding="0" cellspacing="0" class="pika-time"><tbody><tr>' +
            renderTimePicker(24, hh, 'pika-select-hour', function(i) {
                if (opts.use24hour) {
                    return i;
                } else {
                    var to_return = (i%12) + (i<12 ? ' AM' : ' PM');
                    if (to_return == '0 AM') {
                        return opts.i18n.midnight;
                    } else if (to_return == '0 PM') {
                        return opts.i18n.noon;
                    } else {
                        return to_return;
                    }
                }
            }) +
            '<td>:</td>' +
            renderTimePicker(60, mm, 'pika-select-minute', function(i) { if (i < 10) return "0" + i; return i });

        if (opts.showSeconds) {
            to_return += '<td>:</td>' +
                renderTimePicker(60, ss, 'pika-select-second', function(i) { if (i < 10) return "0" + i; return i });
        }
        return to_return + '</tr></tbody></table>';
    },



    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target.parentNode, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    var newDate = new Date(
                            target.getAttribute('data-pika-year'),
                            target.getAttribute('data-pika-month'),
                            target.getAttribute('data-pika-day')
                        );
                    // Preserve time selection when date changed
                    if (self._d && opts.showTime) {
                        newDate.setHours(self._d.getHours());
                        newDate.setMinutes(self._d.getMinutes());
                    }
                    self.setDate(newDate);
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                // if this is touch event prevent mouse events emulation
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
            else if (hasClass(target, 'pika-select-hour')) {
                self.setTime(target.value);
            }
            else if (hasClass(target, 'pika-select-minute')) {
                self.setTime(null, target.value);
            }
            else if (hasClass(target, 'pika-select-second')) {
                self.setTime(null, null, target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                date = moment(opts.field.value, opts.format, opts.formatStrict);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
              self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));

            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') ||
                    pEl === opts.trigger ||
                    (opts.showTime && hasClass(pEl, 'pika-time-container'))) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                if (!opts.showTime) setToStartOfDay(opts.maxDate);
                opts.maxYear  = opts.maxDate.getFullYear();
                opts.maxMonth = opts.maxDate.getMonth();
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            // If no format is given, set based on showTime
            if (opts.format === null) {
                opts.format = 'YYYY-MM-DD';
                if (opts.showTime) {
                    opts.format += ' HH:mm:ss';
                }
            }

            if(!opts.inputFormats) {
                opts.inputFormats = opts.format;
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._o.showTime ? this._d.toString() : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set time components
         * Currently defaulting to setting date to today if not set
         */
        setTime: function(hours, minutes, seconds) {
            if (!this._d) {
                this._d = new Date();
                this._d.setHours(0,0,0,0);
            }
            if (hours) {
                this._d.setHours(hours);
            }
            if (minutes) {
                this._d.setMinutes(minutes);
            }
            if (seconds) {
                this._d.setSeconds(seconds);
            }
            this.setDate(this._d);
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());

            if (this._o.showTime && !this._o.showSeconds) {
                this._d.setSeconds(0);
            } else if (!this._o.showTime) {
                setToStartOfDay(this._d);
            }

            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear(),
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    second: date.getSeconds()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            if (!this._o.showTime) setToStartOfDay(this._o.minDate);
                                   setToStartOfDay(value);
            this._o.minDate = value;
            this._o.minYear  = value.getFullYear();
            this._o.minMonth = value.getMonth();
            this.draw();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            setToStartOfDay(value);
            this._o.maxDate = value;
            this._o.maxYear = value.getFullYear();
            this._o.maxMonth = value.getMonth();
            this.draw();
        },

        setStartRange: function(value)
        {
            this._o.startRange = value;
        },

        setEndRange: function(value)
        {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year) + this.render(this.calendars[c].year, this.calendars[c].month) + '</div>';
            }

            if (opts.showTime) {
                html += '<div class="pika-time-container">' +
                        renderTime(
                            this._d ? this._d.getHours() : 0,
                            this._d ? this._d.getMinutes() : 0,
                            this._d ? this._d.getSeconds() : 0,
                            opts)
                    + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        adjustPosition: function()
        {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            if (!opts.showTime) setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var previousMonth = month === 0 ? 11 : month - 1,
                nextMonth = month === 11 ? 0 : month + 1,
                yearOfPreviousMonth = month === 0 ? year - 1 : year,
                yearOfNextMonth = month === 11 ? year + 1 : year,
                daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before),
                    dayNumber = 1 + (i - before),
                    monthNumber = month,
                    yearNumber = year,
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = (opts.minDate && day < opts.minDate) ||
                                 (opts.maxDate && day > opts.maxDate) ||
                                 (opts.disableWeekends && isWeekend(day)) ||
                                 (opts.disableDayFn && opts.disableDayFn(day));

                if (isEmpty) {
                    if (i < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    } else {
                        dayNumber = dayNumber - days;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }

                var dayConfig = {
                        day: dayNumber,
                        month: monthNumber,
                        year: yearNumber,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange,
                        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths
                    };

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));

/*!
 * Pikaday jQuery plugin.
 *
 * Copyright © 2013 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS module
        factory(require('jquery'), require('../pikaday'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'pikaday'], factory);
    } else {
        // Browser globals
        factory(root.jQuery, root.Pikaday);
    }
}(this, function ($, Pikaday)
{
    'use strict';

    $.fn.pikaday = function()
    {
        var args = arguments;

        if (!args || !args.length) {
            args = [{ }];
        }

        return this.each(function()
        {
            var self   = $(this),
                plugin = self.data('pikaday');

            if (!(plugin instanceof Pikaday)) {
                if (typeof args[0] === 'object') {
                    var options = $.extend({}, args[0]);
                    options.field = self[0];
                    self.data('pikaday', new Pikaday(options));
                }
            } else {
                if (typeof args[0] === 'string' && typeof plugin[args[0]] === 'function') {
                    plugin[args[0]].apply(plugin, Array.prototype.slice.call(args,1));

                    if (args[0] === 'destroy') {
                        self.removeData('pikaday');
                    }
                }
            }
        });
    };

}));

!function(e){e(["jquery"],function(e){return function(){function t(e,t,n){return f({type:O.error,iconClass:g().iconClasses.error,message:e,optionsOverride:n,title:t})}function n(t,n){return t||(t=g()),v=e("#"+t.containerId),v.length?v:(n&&(v=c(t)),v)}function i(e,t,n){return f({type:O.info,iconClass:g().iconClasses.info,message:e,optionsOverride:n,title:t})}function o(e){w=e}function s(e,t,n){return f({type:O.success,iconClass:g().iconClasses.success,message:e,optionsOverride:n,title:t})}function a(e,t,n){return f({type:O.warning,iconClass:g().iconClasses.warning,message:e,optionsOverride:n,title:t})}function r(e){var t=g();v||n(t),l(e,t)||u(t)}function d(t){var i=g();return v||n(i),t&&0===e(":focus",t).length?void h(t):void(v.children().length&&v.remove())}function u(t){for(var n=v.children(),i=n.length-1;i>=0;i--)l(e(n[i]),t)}function l(t,n){return t&&0===e(":focus",t).length?(t[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){h(t)}}),!0):!1}function c(t){return v=e("<div/>").attr("id",t.containerId).addClass(t.positionClass).attr("aria-live","polite").attr("role","alert"),v.appendTo(e(t.target)),v}function p(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",target:"body",closeHtml:'<button type="button">&times;</button>',newestOnTop:!0,preventDuplicates:!1,progressBar:!1}}function m(e){w&&w(e)}function f(t){function i(t){return!e(":focus",l).length||t?(clearTimeout(O.intervalId),l[r.hideMethod]({duration:r.hideDuration,easing:r.hideEasing,complete:function(){h(l),r.onHidden&&"hidden"!==b.state&&r.onHidden(),b.state="hidden",b.endTime=new Date,m(b)}})):void 0}function o(){(r.timeOut>0||r.extendedTimeOut>0)&&(u=setTimeout(i,r.extendedTimeOut),O.maxHideTime=parseFloat(r.extendedTimeOut),O.hideEta=(new Date).getTime()+O.maxHideTime)}function s(){clearTimeout(u),O.hideEta=0,l.stop(!0,!0)[r.showMethod]({duration:r.showDuration,easing:r.showEasing})}function a(){var e=(O.hideEta-(new Date).getTime())/O.maxHideTime*100;f.width(e+"%")}var r=g(),d=t.iconClass||r.iconClass;if("undefined"!=typeof t.optionsOverride&&(r=e.extend(r,t.optionsOverride),d=t.optionsOverride.iconClass||d),r.preventDuplicates){if(t.message===C)return;C=t.message}T++,v=n(r,!0);var u=null,l=e("<div/>"),c=e("<div/>"),p=e("<div/>"),f=e("<div/>"),w=e(r.closeHtml),O={intervalId:null,hideEta:null,maxHideTime:null},b={toastId:T,state:"visible",startTime:new Date,options:r,map:t};return t.iconClass&&l.addClass(r.toastClass).addClass(d),t.title&&(c.append(t.title).addClass(r.titleClass),l.append(c)),t.message&&(p.append(t.message).addClass(r.messageClass),l.append(p)),r.closeButton&&(w.addClass("toast-close-button").attr("role","button"),l.prepend(w)),r.progressBar&&(f.addClass("toast-progress"),l.prepend(f)),l.hide(),r.newestOnTop?v.prepend(l):v.append(l),l[r.showMethod]({duration:r.showDuration,easing:r.showEasing,complete:r.onShown}),r.timeOut>0&&(u=setTimeout(i,r.timeOut),O.maxHideTime=parseFloat(r.timeOut),O.hideEta=(new Date).getTime()+O.maxHideTime,r.progressBar&&(O.intervalId=setInterval(a,10))),l.hover(s,o),!r.onclick&&r.tapToDismiss&&l.click(i),r.closeButton&&w&&w.click(function(e){e.stopPropagation?e.stopPropagation():void 0!==e.cancelBubble&&e.cancelBubble!==!0&&(e.cancelBubble=!0),i(!0)}),r.onclick&&l.click(function(){r.onclick(),i()}),m(b),r.debug&&console&&console.log(b),l}function g(){return e.extend({},p(),b.options)}function h(e){v||(v=n()),e.is(":visible")||(e.remove(),e=null,0===v.children().length&&(v.remove(),C=void 0))}var v,w,C,T=0,O={error:"error",info:"info",success:"success",warning:"warning"},b={clear:r,remove:d,error:t,getContainer:n,info:i,options:{},subscribe:o,success:s,version:"2.1.0",warning:a};return b}()})}("function"==typeof define&&define.amd?define:function(e,t){"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):window.toastr=t(window.jQuery)});
//# sourceMappingURL=toastr.js.map

(function(window,document,undefined){"use strict";(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports==="object"){module.exports=factory(require("jquery"))}else{factory(window.jQuery)}})(function($){var pluginName="webuiPopover";var pluginClass="webui-popover";var pluginType="webui.popover";var defaults={placement:"auto",container:null,width:"auto",height:"auto",trigger:"click",style:"",selector:false,delay:{show:null,hide:300},async:{type:"GET",before:null,success:null,error:null},cache:true,multi:false,arrow:true,title:"",content:"",closeable:false,padding:true,url:"",type:"html",direction:"",animation:null,template:'<div class="webui-popover">'+'<div class="webui-arrow"></div>'+'<div class="webui-popover-inner">'+'<a href="#" class="close"></a>'+'<h3 class="webui-popover-title"></h3>'+'<div class="webui-popover-content"><i class="icon-refresh"></i> <p>&nbsp;</p></div>'+"</div>"+"</div>",backdrop:false,dismissible:true,onShow:null,onHide:null,abortXHR:true,autoHide:false,offsetTop:0,offsetLeft:0,iframeOptions:{frameborder:"0",allowtransparency:"true",id:"",name:"",scrolling:"",onload:"",height:"",width:""},hideEmpty:false};var rtlClass=pluginClass+"-rtl";var _srcElements=[];var backdrop=$('<div class="webui-popover-backdrop"></div>');var _globalIdSeed=0;var _isBodyEventHandled=false;var _offsetOut=-2e3;var $document=$(document);var toNumber=function(numeric,fallback){return isNaN(numeric)?fallback||0:Number(numeric)};var getPopFromElement=function($element){return $element.data("plugin_"+pluginName)};var hideAllPop=function(){var pop=null;for(var i=0;i<_srcElements.length;i++){pop=getPopFromElement(_srcElements[i]);if(pop){pop.hide(true)}}$document.trigger("hiddenAll."+pluginType)};var hideOtherPops=function(currentPop){var pop=null;for(var i=0;i<_srcElements.length;i++){pop=getPopFromElement(_srcElements[i]);if(pop&&pop.id!==currentPop.id){pop.hide(true)}}$document.trigger("hiddenAll."+pluginType)};var isMobile="ontouchstart"in document.documentElement&&/Mobi/.test(navigator.userAgent);var pointerEventToXY=function(e){var out={x:0,y:0};if(e.type==="touchstart"||e.type==="touchmove"||e.type==="touchend"||e.type==="touchcancel"){var touch=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0];out.x=touch.pageX;out.y=touch.pageY}else if(e.type==="mousedown"||e.type==="mouseup"||e.type==="click"){out.x=e.pageX;out.y=e.pageY}return out};function WebuiPopover(element,options){this.$element=$(element);if(options){if($.type(options.delay)==="string"||$.type(options.delay)==="number"){options.delay={show:options.delay,hide:options.delay}}}this.options=$.extend({},defaults,options);this._defaults=defaults;this._name=pluginName;this._targetclick=false;this.init();_srcElements.push(this.$element);return this}WebuiPopover.prototype={init:function(){if(this.$element[0]instanceof document.constructor&&!this.options.selector){throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!")}if(this.getTrigger()!=="manual"){if(this.getTrigger()==="click"||isMobile){this.$element.off("click touchend",this.options.selector).on("click touchend",this.options.selector,$.proxy(this.toggle,this))}else if(this.getTrigger()==="hover"){this.$element.off("mouseenter mouseleave click",this.options.selector).on("mouseenter",this.options.selector,$.proxy(this.mouseenterHandler,this)).on("mouseleave",this.options.selector,$.proxy(this.mouseleaveHandler,this))}}this._poped=false;this._inited=true;this._opened=false;this._idSeed=_globalIdSeed;this.id=pluginName+this._idSeed;this.options.container=$(this.options.container||document.body).first();if(this.options.backdrop){backdrop.appendTo(this.options.container).hide()}_globalIdSeed++;if(this.getTrigger()==="sticky"){this.show()}if(this.options.selector){this._options=$.extend({},this.options,{selector:""})}},destroy:function(){var index=-1;for(var i=0;i<_srcElements.length;i++){if(_srcElements[i]===this.$element){index=i;break}}_srcElements.splice(index,1);this.hide();this.$element.data("plugin_"+pluginName,null);if(this.getTrigger()==="click"){this.$element.off("click")}else if(this.getTrigger()==="hover"){this.$element.off("mouseenter mouseleave")}if(this.$target){this.$target.remove()}},getDelegateOptions:function(){var options={};this._options&&$.each(this._options,function(key,value){if(defaults[key]!==value){options[key]=value}});return options},hide:function(force,event){if(!force&&this.getTrigger()==="sticky"){return}if(!this._opened){return}if(event){event.preventDefault();event.stopPropagation()}if(this.xhr&&this.options.abortXHR===true){this.xhr.abort();this.xhr=null}var e=$.Event("hide."+pluginType);this.$element.trigger(e,[this.$target]);if(this.$target){this.$target.removeClass("in").addClass(this.getHideAnimation());var that=this;setTimeout(function(){that.$target.hide();if(!that.getCache()){that.$target.remove()}},that.getHideDelay())}if(this.options.backdrop){backdrop.hide()}this._opened=false;this.$element.trigger("hidden."+pluginType,[this.$target]);if(this.options.onHide){this.options.onHide(this.$target)}},resetAutoHide:function(){var that=this;var autoHide=that.getAutoHide();if(autoHide){if(that.autoHideHandler){clearTimeout(that.autoHideHandler)}that.autoHideHandler=setTimeout(function(){that.hide()},autoHide)}},delegate:function(eventTarget){var self=$(eventTarget).data("plugin_"+pluginName);if(!self){self=new WebuiPopover(eventTarget,this.getDelegateOptions());$(eventTarget).data("plugin_"+pluginName,self)}return self},toggle:function(e){var self=this;if(e){e.preventDefault();e.stopPropagation();if(this.options.selector){self=this.delegate(e.currentTarget)}}self[self.getTarget().hasClass("in")?"hide":"show"]()},hideAll:function(){hideAllPop()},hideOthers:function(){hideOtherPops(this)},show:function(){if(this._opened){return}var $target=this.getTarget().removeClass().addClass(pluginClass).addClass(this._customTargetClass);if(!this.options.multi){this.hideOthers()}if(!this.getCache()||!this._poped||this.content===""){this.content="";this.setTitle(this.getTitle());if(!this.options.closeable){$target.find(".close").off("click").remove()}if(!this.isAsync()){this.setContent(this.getContent())}else{this.setContentASync(this.options.content)}if(this.canEmptyHide()&&this.content===""){return}$target.show()}this.displayContent();if(this.options.onShow){this.options.onShow($target)}this.bindBodyEvents();if(this.options.backdrop){backdrop.show()}this._opened=true;this.resetAutoHide()},displayContent:function(){var elementPos=this.getElementPosition(),$target=this.getTarget().removeClass().addClass(pluginClass).addClass(this._customTargetClass),$targetContent=this.getContentElement(),targetWidth=$target[0].offsetWidth,targetHeight=$target[0].offsetHeight,placement="bottom",e=$.Event("show."+pluginType);if(this.canEmptyHide()){var content=$targetContent.children().html();if(content!==null&&content.trim().length===0){return}}this.$element.trigger(e,[$target]);var optWidth=this.$element.data("width")||this.options.width;if(optWidth===""){optWidth=this._defaults.width}if(optWidth!=="auto"){$target.width(optWidth)}var optHeight=this.$element.data("height")||this.options.height;if(optHeight===""){optHeight=this._defaults.height}if(optHeight!=="auto"){$targetContent.height(optHeight)}if(this.options.style){this.$target.addClass(pluginClass+"-"+this.options.style)}if(this.options.direction==="rtl"&&!$targetContent.hasClass(rtlClass)){$targetContent.addClass(rtlClass)}if(!this.options.arrow){$target.find(".webui-arrow").remove()}$target.detach().css({top:_offsetOut,left:_offsetOut,display:"block"});if(this.getAnimation()){$target.addClass(this.getAnimation())}$target.appendTo(this.options.container);placement=this.getPlacement(elementPos);this.$element.trigger("added."+pluginType);this.initTargetEvents();if(!this.options.padding){if(this.options.height!=="auto"){$targetContent.css("height",$targetContent.outerHeight())}this.$target.addClass("webui-no-padding")}if(this.options.maxHeight){$targetContent.css("maxHeight",this.options.maxHeight)}if(this.options.maxWidth){$targetContent.css("maxWidth",this.options.maxWidth)}targetWidth=$target[0].offsetWidth;targetHeight=$target[0].offsetHeight;var postionInfo=this.getTargetPositin(elementPos,placement,targetWidth,targetHeight);this.$target.css(postionInfo.position).addClass(placement).addClass("in");if(this.options.type==="iframe"){var $iframe=$target.find("iframe");var iframeWidth=$target.width();var iframeHeight=$iframe.parent().height();if(this.options.iframeOptions.width!==""&&this.options.iframeOptions.width!=="auto"){iframeWidth=this.options.iframeOptions.width}if(this.options.iframeOptions.height!==""&&this.options.iframeOptions.height!=="auto"){iframeHeight=this.options.iframeOptions.height}$iframe.width(iframeWidth).height(iframeHeight)}if(!this.options.arrow){this.$target.css({margin:0})}if(this.options.arrow){var $arrow=this.$target.find(".webui-arrow");$arrow.removeAttr("style");if(placement==="left"||placement==="right"){$arrow.css({top:this.$target.height()/2})}else if(placement==="top"||placement==="bottom"){$arrow.css({left:this.$target.width()/2})}if(postionInfo.arrowOffset){if(postionInfo.arrowOffset.left===-1||postionInfo.arrowOffset.top===-1){$arrow.hide()}else{$arrow.css(postionInfo.arrowOffset)}}}this._poped=true;this.$element.trigger("shown."+pluginType,[this.$target])},isTargetLoaded:function(){return this.getTarget().find("i.glyphicon-refresh").length===0},getTriggerElement:function(){return this.$element},getTarget:function(){if(!this.$target){var id=pluginName+this._idSeed;this.$target=$(this.options.template).attr("id",id);this._customTargetClass=this.$target.attr("class")!==pluginClass?this.$target.attr("class"):null;this.getTriggerElement().attr("data-target",id)}if(!this.$target.data("trigger-element")){this.$target.data("trigger-element",this.getTriggerElement())}return this.$target},removeTarget:function(){this.$target.remove();this.$target=null;this.$contentElement=null},getTitleElement:function(){return this.getTarget().find("."+pluginClass+"-title")},getContentElement:function(){if(!this.$contentElement){this.$contentElement=this.getTarget().find("."+pluginClass+"-content")}return this.$contentElement},getTitle:function(){return this.$element.attr("data-title")||this.options.title||this.$element.attr("title")},getUrl:function(){return this.$element.attr("data-url")||this.options.url},getAutoHide:function(){return this.$element.attr("data-auto-hide")||this.options.autoHide},getOffsetTop:function(){return toNumber(this.$element.attr("data-offset-top"))||this.options.offsetTop},getOffsetLeft:function(){return toNumber(this.$element.attr("data-offset-left"))||this.options.offsetLeft},getCache:function(){var dataAttr=this.$element.attr("data-cache");if(typeof dataAttr!=="undefined"){switch(dataAttr.toLowerCase()){case"true":case"yes":case"1":return true;case"false":case"no":case"0":return false}}return this.options.cache},getTrigger:function(){return this.$element.attr("data-trigger")||this.options.trigger},getDelayShow:function(){var dataAttr=this.$element.attr("data-delay-show");if(typeof dataAttr!=="undefined"){return dataAttr}return this.options.delay.show===0?0:this.options.delay.show||100},getHideDelay:function(){var dataAttr=this.$element.attr("data-delay-hide");if(typeof dataAttr!=="undefined"){return dataAttr}return this.options.delay.hide===0?0:this.options.delay.hide||100},getAnimation:function(){var dataAttr=this.$element.attr("data-animation");return dataAttr||this.options.animation},getHideAnimation:function(){var ani=this.getAnimation();return ani?ani+"-out":"out"},setTitle:function(title){var $titleEl=this.getTitleElement();if(title){if(this.options.direction==="rtl"&&!$titleEl.hasClass(rtlClass)){$titleEl.addClass(rtlClass)}$titleEl.html(title)}else{$titleEl.remove()}},hasContent:function(){return this.getContent()},canEmptyHide:function(){return this.options.hideEmpty&&this.options.type==="html"},getIframe:function(){var $iframe=$("<iframe></iframe>").attr("src",this.getUrl());var self=this;$.each(this._defaults.iframeOptions,function(opt){if(typeof self.options.iframeOptions[opt]!=="undefined"){$iframe.attr(opt,self.options.iframeOptions[opt])}});return $iframe},getContent:function(){if(this.getUrl()){switch(this.options.type){case"iframe":this.content=this.getIframe();break;case"html":try{this.content=$(this.getUrl());if(!this.content.is(":visible")){this.content.show()}}catch(error){throw new Error("Unable to get popover content. Invalid selector specified.")}break}}else if(!this.content){var content="";if($.isFunction(this.options.content)){content=this.options.content.apply(this.$element[0],[this])}else{content=this.options.content}this.content=this.$element.attr("data-content")||content;if(!this.content){var $next=this.$element.next();if($next&&$next.hasClass(pluginClass+"-content")){this.content=$next}}}return this.content},setContent:function(content){var $target=this.getTarget();var $ct=this.getContentElement();if(typeof content==="string"){$ct.html(content)}else if(content instanceof $){$ct.html("");if(!this.options.cache){content.clone(true,true).removeClass(pluginClass+"-content").appendTo($ct)}else{content.removeClass(pluginClass+"-content").appendTo($ct)}}this.$target=$target},isAsync:function(){return this.options.type==="async"},setContentASync:function(content){var that=this;if(this.xhr){return}this.xhr=$.ajax({url:this.getUrl(),type:this.options.async.type,cache:this.getCache(),beforeSend:function(xhr){if(that.options.async.before){that.options.async.before(that,xhr)}},success:function(data){that.bindBodyEvents();if(content&&$.isFunction(content)){that.content=content.apply(that.$element[0],[data])}else{that.content=data}that.setContent(that.content);var $targetContent=that.getContentElement();$targetContent.removeAttr("style");that.displayContent();if(that.options.async.success){that.options.async.success(that,data)}},complete:function(){that.xhr=null},error:function(xhr,data){if(that.options.async.error){that.options.async.error(that,xhr,data)}}})},bindBodyEvents:function(){if(_isBodyEventHandled){return}if(this.options.dismissible&&this.getTrigger()==="click"){$document.off("keyup.webui-popover").on("keyup.webui-popover",$.proxy(this.escapeHandler,this));$document.off("click.webui-popover touchend.webui-popover").on("click.webui-popover touchend.webui-popover",$.proxy(this.bodyClickHandler,this))}else if(this.getTrigger()==="hover"){$document.off("touchend.webui-popover").on("touchend.webui-popover",$.proxy(this.bodyClickHandler,this))}},mouseenterHandler:function(e){var self=this;if(e&&this.options.selector){self=this.delegate(e.currentTarget)}if(self._timeout){clearTimeout(self._timeout)}self._enterTimeout=setTimeout(function(){if(!self.getTarget().is(":visible")){self.show()}},this.getDelayShow())},mouseleaveHandler:function(){var self=this;clearTimeout(self._enterTimeout);self._timeout=setTimeout(function(){self.hide()},this.getHideDelay())},escapeHandler:function(e){if(e.keyCode===27){this.hideAll()}},bodyClickHandler:function(e){_isBodyEventHandled=true;var canHide=true;for(var i=0;i<_srcElements.length;i++){var pop=getPopFromElement(_srcElements[i]);if(pop&&pop._opened){var offset=pop.getTarget().offset();var popX1=offset.left;var popY1=offset.top;var popX2=offset.left+pop.getTarget().width();var popY2=offset.top+pop.getTarget().height();var pt=pointerEventToXY(e);var inPop=pt.x>=popX1&&pt.x<=popX2&&pt.y>=popY1&&pt.y<=popY2;if(inPop){canHide=false;break}}}if(canHide){hideAllPop()}},initTargetEvents:function(){if(this.getTrigger()==="hover"){this.$target.off("mouseenter mouseleave").on("mouseenter",$.proxy(this.mouseenterHandler,this)).on("mouseleave",$.proxy(this.mouseleaveHandler,this))}this.$target.find(".close").off("click").on("click",$.proxy(this.hide,this,true))},getPlacement:function(pos){var placement,container=this.options.container,clientWidth=container.innerWidth(),clientHeight=container.innerHeight(),scrollTop=container.scrollTop(),scrollLeft=container.scrollLeft(),pageX=Math.max(0,pos.left-scrollLeft),pageY=Math.max(0,pos.top-scrollTop);if(typeof this.options.placement==="function"){placement=this.options.placement.call(this,this.getTarget()[0],this.$element[0])}else{placement=this.$element.data("placement")||this.options.placement}var isH=placement==="horizontal";var isV=placement==="vertical";var detect=placement==="auto"||isH||isV;if(detect){if(pageX<clientWidth/3){if(pageY<clientHeight/3){placement=isH?"right-bottom":"bottom-right"}else if(pageY<clientHeight*2/3){if(isV){placement=pageY<=clientHeight/2?"bottom-right":"top-right"}else{placement="right"}}else{placement=isH?"right-top":"top-right"}}else if(pageX<clientWidth*2/3){if(pageY<clientHeight/3){if(isH){placement=pageX<=clientWidth/2?"right-bottom":"left-bottom"}else{placement="bottom"}}else if(pageY<clientHeight*2/3){if(isH){placement=pageX<=clientWidth/2?"right":"left"}else{placement=pageY<=clientHeight/2?"bottom":"top"}}else{if(isH){placement=pageX<=clientWidth/2?"right-top":"left-top"}else{placement="top"}}}else{if(pageY<clientHeight/3){placement=isH?"left-bottom":"bottom-left"}else if(pageY<clientHeight*2/3){if(isV){placement=pageY<=clientHeight/2?"bottom-left":"top-left"}else{placement="left"}}else{placement=isH?"left-top":"top-left"}}}else if(placement==="auto-top"){if(pageX<clientWidth/3){placement="top-right"}else if(pageX<clientWidth*2/3){placement="top"}else{placement="top-left"}}else if(placement==="auto-bottom"){if(pageX<clientWidth/3){placement="bottom-right"}else if(pageX<clientWidth*2/3){placement="bottom"}else{placement="bottom-left"}}else if(placement==="auto-left"){if(pageY<clientHeight/3){placement="left-top"}else if(pageY<clientHeight*2/3){placement="left"}else{placement="left-bottom"}}else if(placement==="auto-right"){if(pageY<clientHeight/3){placement="right-bottom"}else if(pageY<clientHeight*2/3){placement="right"}else{placement="right-top"}}return placement},getElementPosition:function(){var elRect=this.$element[0].getBoundingClientRect();var container=this.options.container;var cssPos=container.css("position");if(container.is(document.body)||cssPos==="static"){return $.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth||elRect.width,height:this.$element[0].offsetHeight||elRect.height})}else if(cssPos==="fixed"){var containerRect=container[0].getBoundingClientRect();return{top:elRect.top-containerRect.top+container.scrollTop(),left:elRect.left-containerRect.left+container.scrollLeft(),width:elRect.width,height:elRect.height}}else if(cssPos==="relative"){return{top:this.$element.offset().top-container.offset().top,left:this.$element.offset().left-container.offset().left,width:this.$element[0].offsetWidth||elRect.width,height:this.$element[0].offsetHeight||elRect.height}}},getTargetPositin:function(elementPos,placement,targetWidth,targetHeight){var pos=elementPos,container=this.options.container,elementW=this.$element.outerWidth(),elementH=this.$element.outerHeight(),scrollTop=document.documentElement.scrollTop+container.scrollTop(),scrollLeft=document.documentElement.scrollLeft+container.scrollLeft(),position={},arrowOffset=null,arrowSize=this.options.arrow?20:0,padding=10,fixedW=elementW<arrowSize+padding?arrowSize:0,fixedH=elementH<arrowSize+padding?arrowSize:0,refix=0,pageH=document.documentElement.clientHeight+scrollTop,pageW=document.documentElement.clientWidth+scrollLeft;var validLeft=pos.left+pos.width/2-fixedW>0;var validRight=pos.left+pos.width/2+fixedW<pageW;var validTop=pos.top+pos.height/2-fixedH>0;var validBottom=pos.top+pos.height/2+fixedH<pageH;switch(placement){case"bottom":position={top:pos.top+pos.height,left:pos.left+pos.width/2-targetWidth/2};break;case"top":position={top:pos.top-targetHeight,left:pos.left+pos.width/2-targetWidth/2};break;case"left":position={top:pos.top+pos.height/2-targetHeight/2,left:pos.left-targetWidth};break;case"right":position={top:pos.top+pos.height/2-targetHeight/2,left:pos.left+pos.width};break;case"top-right":position={top:pos.top-targetHeight,left:validLeft?pos.left-fixedW:padding};arrowOffset={left:validLeft?Math.min(elementW,targetWidth)/2+fixedW:_offsetOut};break;case"top-left":refix=validRight?fixedW:-padding;position={top:pos.top-targetHeight,left:pos.left-targetWidth+pos.width+refix};arrowOffset={left:validRight?targetWidth-Math.min(elementW,targetWidth)/2-fixedW:_offsetOut};break;case"bottom-right":position={top:pos.top+pos.height,left:validLeft?pos.left-fixedW:padding};arrowOffset={left:validLeft?Math.min(elementW,targetWidth)/2+fixedW:_offsetOut};break;case"bottom-left":refix=validRight?fixedW:-padding;position={top:pos.top+pos.height,left:pos.left-targetWidth+pos.width+refix};arrowOffset={left:validRight?targetWidth-Math.min(elementW,targetWidth)/2-fixedW:_offsetOut};break;case"right-top":refix=validBottom?fixedH:-padding;position={top:pos.top-targetHeight+pos.height+refix,left:pos.left+pos.width};arrowOffset={top:validBottom?targetHeight-Math.min(elementH,targetHeight)/2-fixedH:_offsetOut};break;case"right-bottom":position={top:validTop?pos.top-fixedH:padding,left:pos.left+pos.width};arrowOffset={top:validTop?Math.min(elementH,targetHeight)/2+fixedH:_offsetOut};break;case"left-top":refix=validBottom?fixedH:-padding;position={top:pos.top-targetHeight+pos.height+refix,left:pos.left-targetWidth};arrowOffset={top:validBottom?targetHeight-Math.min(elementH,targetHeight)/2-fixedH:_offsetOut};break;case"left-bottom":position={top:validTop?pos.top-fixedH:padding,left:pos.left-targetWidth};arrowOffset={top:validTop?Math.min(elementH,targetHeight)/2+fixedH:_offsetOut};break}position.top+=this.getOffsetTop();position.left+=this.getOffsetLeft();return{position:position,arrowOffset:arrowOffset}}};$.fn[pluginName]=function(options,noInit){var results=[];var $result=this.each(function(){var webuiPopover=$.data(this,"plugin_"+pluginName);if(!webuiPopover){if(!options){webuiPopover=new WebuiPopover(this,null)}else if(typeof options==="string"){if(options!=="destroy"){if(!noInit){webuiPopover=new WebuiPopover(this,null);results.push(webuiPopover[options]())}}}else if(typeof options==="object"){webuiPopover=new WebuiPopover(this,options)}$.data(this,"plugin_"+pluginName,webuiPopover)}else{if(options==="destroy"){webuiPopover.destroy()}else if(typeof options==="string"){results.push(webuiPopover[options]())}}});return results.length?results:$result};var webuiPopovers=function(){var _hideAll=function(){hideAllPop()};var _create=function(selector,options){options=options||{};$(selector).webuiPopover(options)};var _isCreated=function(selector){var created=true;$(selector).each(function(item){created=created&&$(item).data("plugin_"+pluginName)!==undefined});return created};var _show=function(selector,options){if(options){$(selector).webuiPopover(options).webuiPopover("show")}else{$(selector).webuiPopover("show")}};var _hide=function(selector){$(selector).webuiPopover("hide")};var _updateContent=function(selector,content){var pop=$(selector).data("plugin_"+pluginName);if(pop){var cache=pop.getCache();pop.options.cache=false;pop.options.content=content;if(pop._opened){pop._opened=false;pop.show()}else{if(pop.isAsync()){pop.setContentASync(content)}else{pop.setContent(content)}}pop.options.cache=cache}};return{show:_show,hide:_hide,create:_create,isCreated:_isCreated,hideAll:_hideAll,updateContent:_updateContent}}();window.WebuiPopovers=webuiPopovers})})(window,document);
/*!
 * jquery-confirm v2.0.0 (http://craftpip.github.io/jquery-confirm/)
 * Author: Boniface Pereira
 * Website: www.craftpip.com
 * Contact: hey@craftpip.com
 *
 * Copyright 2013-2015 jquery-confirm
 * Licensed under MIT (https://github.com/craftpip/jquery-confirm/blob/master/LICENSE)
 */
if(typeof jQuery==="undefined"){throw new Error("jquery-confirm requires jQuery")}var jconfirm,Jconfirm;(function(b){b.fn.confirm=function(c){if(typeof c==="undefined"){c={}}var d=b(this);d.on("click",function(f){f.preventDefault();if(d.attr("href")){c.confirm=function(){location.href=d.attr("href")}}b.confirm(c)});return d};b.confirm=function(c){return jconfirm(c)};b.alert=function(c){c.cancelButton=false;return jconfirm(c)};b.dialog=function(c){c.cancelButton=false;c.confirmButton=false;c.confirmKeys=[13];return jconfirm(c)};jconfirm=function(c){if(typeof c==="undefined"){c={}}if(jconfirm.defaults){b.extend(jconfirm.pluginDefaults,jconfirm.defaults)}var c=b.extend({},jconfirm.pluginDefaults,c);return new Jconfirm(c)};Jconfirm=function(c){b.extend(this,c);this._init()};Jconfirm.prototype={_init:function(){var c=this;this._rand=Math.round(Math.random()*99999);this._buildHTML();this._bindEvents();setTimeout(function(){c.open()},0)},animations:["anim-scale","anim-top","anim-bottom","anim-left","anim-right","anim-zoom","anim-opacity","anim-none","anim-rotate","anim-rotatex","anim-rotatey","anim-scalex","anim-scaley"],_buildHTML:function(){this.animation="anim-"+this.animation.toLowerCase();this.closeAnimation="anim-"+this.closeAnimation.toLowerCase();this.$el=b(this.template).appendTo(this.container).addClass(this.theme);this.$el.find(".jconfirm-box-container").addClass(this.columnClass);this.CSS={"-webkit-transition-duration":this.animationSpeed/1000+"s","transition-duration":this.animationSpeed/1000+"s","-webkit-transition-timing-function":"cubic-bezier(.38,1.28,.2, "+this.animationBounce+")","transition-timing-function":"cubic-bezier(.38,1.28,.2, "+this.animationBounce+")"};this.$el.find(".jconfirm-bg").css(this.CSS);this.$b=this.$el.find(".jconfirm-box").css(this.CSS).addClass(this.animation);this.$body=this.$b;if(this.rtl){this.$el.addClass("rtl")}this.$title=this.$el.find("div.title");this.setTitle();this.contentDiv=this.$el.find("div.content");this.$content=this.contentDiv;this.$btnc=this.$el.find(".buttons");if(this.confirmButton&&this.confirmButton.trim()!==""){this.$confirmButton=b('<button class="btn">'+this.confirmButton+"</button>").appendTo(this.$btnc).addClass(this.confirmButtonClass)}if(this.cancelButton&&this.cancelButton.trim()!==""){this.$cancelButton=b('<button class="btn">'+this.cancelButton+"</button>").appendTo(this.$btnc).addClass(this.cancelButtonClass)}if(!this.confirmButton&&!this.cancelButton){this.$btnc.remove()}if(!this.confirmButton&&!this.cancelButton&&this.closeIcon===null){this.$closeButton=this.$b.find(".closeIcon").show()}if(this.closeIcon===true){this.$closeButton=this.$b.find(".closeIcon").show()}this.setContent();if(this.autoClose){this._startCountDown()}},setTitle:function(c){this.title=(typeof c!=="undefined")?c:this.title;if(this.title&&this.$title){this.$title.html('<i class="'+this.icon+'"></i> '+this.title)}else{this.$title.remove()}},setContent:function(e){var f=this;this.content=(e)?e:this.content;var c=(e)?true:false;if(typeof this.content==="boolean"){if(!this.content){this.contentDiv.remove()}else{console.error("Invalid option for property content: passed TRUE")}}else{if(typeof this.content==="string"){if(this.content.substr(0,4).toLowerCase()==="url:"){this.contentDiv.html("");this.$btnc.find("button").prop("disabled",true);var d=this.content.substring(4,this.content.length);b.get(d).done(function(h){f.contentDiv.html(h)}).always(function(i,h,j){if(typeof f.contentLoaded==="function"){f.contentLoaded(i,h,j)}f.$btnc.find("button").prop("disabled",false);f.setDialogCenter()})}else{this.contentDiv.html(this.content)}}else{if(typeof this.content==="function"){this.contentDiv.html("");this.$btnc.find("button").attr("disabled","disabled");var g=this.content(this);if(typeof g!=="object"){console.error("The content function must return jquery promise.")}else{if(typeof g.always!=="function"){console.error("The object returned is not a jquery promise.")}else{g.always(function(i,h){f.$btnc.find("button").removeAttr("disabled");f.setDialogCenter()})}}}else{console.error("Invalid option for property content, passed: "+typeof this.content)}}}this.setDialogCenter(c)},_startCountDown:function(){var c=this.autoClose.split("|");if(/cancel/.test(c[0])&&this.type==="alert"){return false}else{if(/confirm|cancel/.test(c[0])){this.$cd=b('<span class="countdown">').appendTo(this["$"+c[0]+"Button"]);var d=this;d.$cd.parent().click();var e=c[1]/1000;this.interval=setInterval(function(){d.$cd.html(" ["+(e-=1)+"]");if(e===0){d.$cd.parent().trigger("click");clearInterval(d.interval)}},1000)}else{console.error("Invalid option "+c[0]+", must be confirm/cancel")}}},_bindEvents:function(){var d=this;var c=false;this.$el.find(".jconfirm-scrollpane").click(function(f){if(!c){if(d.backgroundDismiss){d.cancel();d.close()}else{d.$b.addClass("hilight");setTimeout(function(){d.$b.removeClass("hilight")},400)}}c=false});this.$el.find(".jconfirm-box").click(function(f){c=true});if(this.$confirmButton){this.$confirmButton.click(function(g){g.preventDefault();var f=d.confirm(d.$b);d.onAction("confirm");if(typeof f==="undefined"||f){d.close()}})}if(this.$cancelButton){this.$cancelButton.click(function(g){g.preventDefault();var f=d.cancel(d.$b);d.onAction("cancel");if(typeof f==="undefined"||f){d.close()}})}if(this.$closeButton){this.$closeButton.click(function(f){f.preventDefault();d.cancel();d.onAction("close");d.close()})}if(this.keyboardEnabled){setTimeout(function(){b(window).on("keyup."+this._rand,function(f){d.reactOnKey(f)})},500)}b(window).on("resize."+this._rand,function(){d.setDialogCenter(true)})},reactOnKey:function a(f){var c=b(".jconfirm");if(c.eq(c.length-1)[0]!==this.$el[0]){return false}var d=f.which;if(this.contentDiv.find(":input").is(":focus")&&/13|32/.test(d)){return false}if(b.inArray(d,this.cancelKeys)!==-1){if(!this.backgroundDismiss){this.$el.find(".jconfirm-bg").click();return false}if(this.$cancelButton){this.$cancelButton.click()}else{this.close()}}if(b.inArray(d,this.confirmKeys)!==-1){if(this.$confirmButton){this.$confirmButton.click()}}},setDialogCenter:function(d){var h=b(window).height();var g=this.$b.outerHeight();var c=(h-g)/2;var f=100;if(g>(h-f)){var e={"margin-top":f/2,"margin-bottom":f/2}}else{var e={"margin-top":c}}if(d){this.$b.animate(e,{duration:this.animationSpeed,queue:false})}else{this.$b.css(e)}},close:function(){var c=this;if(this.isClosed()){return false}if(typeof this.onClose==="function"){this.onClose()}b(window).unbind("resize."+this._rand);if(this.keyboardEnabled){b(window).unbind("keyup."+this._rand)}c.$el.find(".jconfirm-bg").removeClass("seen");this.$b.addClass(this.closeAnimation);var d=(this.closeAnimation=="anim-none")?0:this.animationSpeed;setTimeout(function(){c.$el.remove()},d+50);jconfirm.record.closed+=1;jconfirm.record.currentlyOpen-=1;if(jconfirm.record.currentlyOpen<1){b("body").removeClass("jconfirm-noscroll")}return true},open:function(){var d=this;if(this.isClosed()){return false}d.$el.find(".jconfirm-bg").addClass("seen");b("body").addClass("jconfirm-noscroll");this.$b.removeClass(this.animations.join(" "));this.$b.find("input[autofocus]:visible:first").focus();jconfirm.record.opened+=1;jconfirm.record.currentlyOpen+=1;if(typeof this.onOpen==="function"){this.onOpen()}var c="jconfirm-box"+this._rand;this.$b.attr("aria-labelledby",c).attr("tabindex",-1).focus();if(this.$title){this.$title.attr("id",c)}else{if(this.$content){this.$content.attr("id",c)}}return true},isClosed:function(){return this.$el.css("display")===""}};jconfirm.pluginDefaults={template:'<div class="jconfirm"><div class="jconfirm-bg"></div><div class="jconfirm-scrollpane"><div class="container"><div class="row"><div class="jconfirm-box-container span6 offset3"><div class="jconfirm-box" role="dialog" aria-labelledby="labelled" tabindex="-1"><div class="closeIcon"><span class="glyphicon glyphicon-remove"></span></div><div class="title"></div><div class="content"></div><div class="buttons"></div><div class="jquery-clear"></div></div></div></div></div></div></div>',title:"Hello",content:"Are you sure to continue?",contentLoaded:function(){},icon:"",confirmButton:"Okay",cancelButton:"Cancel",confirmButtonClass:"btn-default",cancelButtonClass:"btn-default",theme:"white",animation:"zoom",closeAnimation:"scale",animationSpeed:500,animationBounce:1.2,keyboardEnabled:false,rtl:false,confirmKeys:[13,32],cancelKeys:[27],container:"body",confirm:function(){},cancel:function(){},backgroundDismiss:true,autoClose:false,closeIcon:null,columnClass:"col-md-4 col-md-offset-4",onOpen:function(){},onClose:function(){},onAction:function(){}};jconfirm.record={opened:0,closed:0,currentlyOpen:0}})(jQuery);
!function(t,e){"use strict";if("undefined"!=typeof module&&module.exports){var n="undefined"!=typeof process,o=n&&"electron"in process.versions;o?t.BootstrapDialog=e(t.jQuery):module.exports=e(require("jquery"),require("bootstrap"))}else"function"==typeof define&&define.amd?define("bootstrap-dialog",["jquery","bootstrap"],function(t){return e(t)}):t.BootstrapDialog=e(t.jQuery)}(this,function(t){"use strict";var e=t.fn.modal.Constructor,n=function(t,n){e.call(this,t,n)};n.getModalVersion=function(){var e=null;return e="undefined"==typeof t.fn.modal.Constructor.VERSION?"v3.1":/3\.2\.\d+/.test(t.fn.modal.Constructor.VERSION)?"v3.2":/3\.3\.[1,2]/.test(t.fn.modal.Constructor.VERSION)?"v3.3":"v3.3.4"},n.ORIGINAL_BODY_PADDING=parseInt(t("body").css("padding-right")||0,10),n.METHODS_TO_OVERRIDE={},n.METHODS_TO_OVERRIDE["v3.1"]={},n.METHODS_TO_OVERRIDE["v3.2"]={hide:function(e){if(e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()){this.isShown=!1;var n=this.getGlobalOpenedDialogs();0===n.length&&this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}}},n.METHODS_TO_OVERRIDE["v3.3"]={setScrollbar:function(){var t=n.ORIGINAL_BODY_PADDING;this.bodyIsOverflowing&&this.$body.css("padding-right",t+this.scrollbarWidth)},resetScrollbar:function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.css("padding-right",n.ORIGINAL_BODY_PADDING)},hideModal:function(){this.$element.hide(),this.backdrop(t.proxy(function(){var t=this.getGlobalOpenedDialogs();0===t.length&&this.$body.removeClass("modal-open"),this.resetAdjustments(),this.resetScrollbar(),this.$element.trigger("hidden.bs.modal")},this))}},n.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},n.METHODS_TO_OVERRIDE["v3.3"]),n.prototype={constructor:n,getGlobalOpenedDialogs:function(){var e=[];return t.each(o.dialogs,function(t,n){n.isRealized()&&n.isOpened()&&e.push(n)}),e}},n.prototype=t.extend(n.prototype,e.prototype,n.METHODS_TO_OVERRIDE[n.getModalVersion()]);var o=function(e){this.defaultOptions=t.extend(!0,{id:o.newGuid(),buttons:[],data:{},onshow:null,onshown:null,onhide:null,onhidden:null},o.defaultOptions),this.indexedButtons={},this.registeredButtonHotkeys={},this.draggableData={isMouseDown:!1,mouseOffset:{}},this.realized=!1,this.opened=!1,this.initOptions(e),this.holdThisInstance()};return o.BootstrapDialogModal=n,o.NAMESPACE="bootstrap-dialog",o.TYPE_DEFAULT="type-default",o.TYPE_INFO="type-info",o.TYPE_PRIMARY="type-primary",o.TYPE_SUCCESS="type-success",o.TYPE_WARNING="type-warning",o.TYPE_DANGER="type-danger",o.DEFAULT_TEXTS={},o.DEFAULT_TEXTS[o.TYPE_DEFAULT]="Information",o.DEFAULT_TEXTS[o.TYPE_INFO]="Information",o.DEFAULT_TEXTS[o.TYPE_PRIMARY]="Information",o.DEFAULT_TEXTS[o.TYPE_SUCCESS]="Success",o.DEFAULT_TEXTS[o.TYPE_WARNING]="Warning",o.DEFAULT_TEXTS[o.TYPE_DANGER]="Danger",o.DEFAULT_TEXTS.OK="OK",o.DEFAULT_TEXTS.CANCEL="Cancel",o.DEFAULT_TEXTS.CONFIRM="Confirmation",o.SIZE_NORMAL="size-normal",o.SIZE_SMALL="size-small",o.SIZE_WIDE="size-wide",o.SIZE_LARGE="size-large",o.BUTTON_SIZES={},o.BUTTON_SIZES[o.SIZE_NORMAL]="",o.BUTTON_SIZES[o.SIZE_SMALL]="",o.BUTTON_SIZES[o.SIZE_WIDE]="",o.BUTTON_SIZES[o.SIZE_LARGE]="btn-lg",o.ICON_SPINNER="glyphicon glyphicon-asterisk",o.defaultOptions={type:o.TYPE_PRIMARY,size:o.SIZE_NORMAL,cssClass:"",title:null,message:null,nl2br:!0,closable:!0,closeByBackdrop:!0,closeByKeyboard:!0,spinicon:o.ICON_SPINNER,autodestroy:!0,draggable:!1,animate:!0,description:"",tabindex:-1},o.configDefaultOptions=function(e){o.defaultOptions=t.extend(!0,o.defaultOptions,e)},o.dialogs={},o.openAll=function(){t.each(o.dialogs,function(t,e){e.open()})},o.closeAll=function(){t.each(o.dialogs,function(t,e){e.close()})},o.getDialog=function(t){var e=null;return"undefined"!=typeof o.dialogs[t]&&(e=o.dialogs[t]),e},o.setDialog=function(t){return o.dialogs[t.getId()]=t,t},o.addDialog=function(t){return o.setDialog(t)},o.moveFocus=function(){var e=null;t.each(o.dialogs,function(t,n){n.isRealized()&&n.isOpened()&&(e=n)}),null!==e&&e.getModal().focus()},o.METHODS_TO_OVERRIDE={},o.METHODS_TO_OVERRIDE["v3.1"]={handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(t){t.target===this&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByBackdrop()&&t.data.dialog.close()}),this},updateZIndex:function(){var e=1040,n=1050,i=0;t.each(o.dialogs,function(t,e){i++});var s=this.getModal(),a=s.data("bs.modal").$backdrop;return s.css("z-index",n+20*(i-1)),a.css("z-index",e+20*(i-1)),this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this.updateZIndex(),this}},o.METHODS_TO_OVERRIDE["v3.2"]={handleModalBackdropEvent:o.METHODS_TO_OVERRIDE["v3.1"].handleModalBackdropEvent,updateZIndex:o.METHODS_TO_OVERRIDE["v3.1"].updateZIndex,open:o.METHODS_TO_OVERRIDE["v3.1"].open},o.METHODS_TO_OVERRIDE["v3.3"]={},o.METHODS_TO_OVERRIDE["v3.3.4"]=t.extend({},o.METHODS_TO_OVERRIDE["v3.1"]),o.prototype={constructor:o,initOptions:function(e){return this.options=t.extend(!0,this.defaultOptions,e),this},holdThisInstance:function(){return o.addDialog(this),this},initModalStuff:function(){return this.setModal(this.createModal()).setModalDialog(this.createModalDialog()).setModalContent(this.createModalContent()).setModalHeader(this.createModalHeader()).setModalBody(this.createModalBody()).setModalFooter(this.createModalFooter()),this.getModal().append(this.getModalDialog()),this.getModalDialog().append(this.getModalContent()),this.getModalContent().append(this.getModalHeader()).append(this.getModalBody()).append(this.getModalFooter()),this},createModal:function(){var e=t('<div class="modal" role="dialog" aria-hidden="true"></div>');return e.prop("id",this.getId()),e.attr("aria-labelledby",this.getId()+"_title"),e},getModal:function(){return this.$modal},setModal:function(t){return this.$modal=t,this},createModalDialog:function(){return t('<div class="modal-dialog"></div>')},getModalDialog:function(){return this.$modalDialog},setModalDialog:function(t){return this.$modalDialog=t,this},createModalContent:function(){return t('<div class="modal-content"></div>')},getModalContent:function(){return this.$modalContent},setModalContent:function(t){return this.$modalContent=t,this},createModalHeader:function(){return t('<div class="modal-header"></div>')},getModalHeader:function(){return this.$modalHeader},setModalHeader:function(t){return this.$modalHeader=t,this},createModalBody:function(){return t('<div class="modal-body"></div>')},getModalBody:function(){return this.$modalBody},setModalBody:function(t){return this.$modalBody=t,this},createModalFooter:function(){return t('<div class="modal-footer"></div>')},getModalFooter:function(){return this.$modalFooter},setModalFooter:function(t){return this.$modalFooter=t,this},createDynamicContent:function(t){var e=null;return e="function"==typeof t?t.call(t,this):t,"string"==typeof e&&(e=this.formatStringContent(e)),e},formatStringContent:function(t){return this.options.nl2br?t.replace(/\r\n/g,"<br />").replace(/[\r\n]/g,"<br />"):t},setData:function(t,e){return this.options.data[t]=e,this},getData:function(t){return this.options.data[t]},setId:function(t){return this.options.id=t,this},getId:function(){return this.options.id},getType:function(){return this.options.type},setType:function(t){return this.options.type=t,this.updateType(),this},updateType:function(){if(this.isRealized()){var t=[o.TYPE_DEFAULT,o.TYPE_INFO,o.TYPE_PRIMARY,o.TYPE_SUCCESS,o.TYPE_WARNING,o.TYPE_DANGER];this.getModal().removeClass(t.join(" ")).addClass(this.getType())}return this},getSize:function(){return this.options.size},setSize:function(t){return this.options.size=t,this.updateSize(),this},updateSize:function(){if(this.isRealized()){var e=this;this.getModal().removeClass(o.SIZE_NORMAL).removeClass(o.SIZE_SMALL).removeClass(o.SIZE_WIDE).removeClass(o.SIZE_LARGE),this.getModal().addClass(this.getSize()),this.getModalDialog().removeClass("modal-sm"),this.getSize()===o.SIZE_SMALL&&this.getModalDialog().addClass("modal-sm"),this.getModalDialog().removeClass("modal-lg"),this.getSize()===o.SIZE_WIDE&&this.getModalDialog().addClass("modal-lg"),t.each(this.options.buttons,function(n,o){var i=e.getButton(o.id),s=["btn-lg","btn-sm","btn-xs"],a=!1;if("string"==typeof o.cssClass){var d=o.cssClass.split(" ");t.each(d,function(e,n){-1!==t.inArray(n,s)&&(a=!0)})}a||(i.removeClass(s.join(" ")),i.addClass(e.getButtonSize()))})}return this},getCssClass:function(){return this.options.cssClass},setCssClass:function(t){return this.options.cssClass=t,this},getTitle:function(){return this.options.title},setTitle:function(t){return this.options.title=t,this.updateTitle(),this},updateTitle:function(){if(this.isRealized()){var t=null!==this.getTitle()?this.createDynamicContent(this.getTitle()):this.getDefaultText();this.getModalHeader().find("."+this.getNamespace("title")).html("").append(t).prop("id",this.getId()+"_title")}return this},getMessage:function(){return this.options.message},setMessage:function(t){return this.options.message=t,this.updateMessage(),this},updateMessage:function(){if(this.isRealized()){var t=this.createDynamicContent(this.getMessage());this.getModalBody().find("."+this.getNamespace("message")).html("").append(t)}return this},isClosable:function(){return this.options.closable},setClosable:function(t){return this.options.closable=t,this.updateClosable(),this},setCloseByBackdrop:function(t){return this.options.closeByBackdrop=t,this},canCloseByBackdrop:function(){return this.options.closeByBackdrop},setCloseByKeyboard:function(t){return this.options.closeByKeyboard=t,this},canCloseByKeyboard:function(){return this.options.closeByKeyboard},isAnimate:function(){return this.options.animate},setAnimate:function(t){return this.options.animate=t,this},updateAnimate:function(){return this.isRealized()&&this.getModal().toggleClass("fade",this.isAnimate()),this},getSpinicon:function(){return this.options.spinicon},setSpinicon:function(t){return this.options.spinicon=t,this},addButton:function(t){return this.options.buttons.push(t),this},addButtons:function(e){var n=this;return t.each(e,function(t,e){n.addButton(e)}),this},getButtons:function(){return this.options.buttons},setButtons:function(t){return this.options.buttons=t,this.updateButtons(),this},getButton:function(t){return"undefined"!=typeof this.indexedButtons[t]?this.indexedButtons[t]:null},getButtonSize:function(){return"undefined"!=typeof o.BUTTON_SIZES[this.getSize()]?o.BUTTON_SIZES[this.getSize()]:""},updateButtons:function(){return this.isRealized()&&(0===this.getButtons().length?this.getModalFooter().hide():this.getModalFooter().show().find("."+this.getNamespace("footer")).html("").append(this.createFooterButtons())),this},isAutodestroy:function(){return this.options.autodestroy},setAutodestroy:function(t){this.options.autodestroy=t},getDescription:function(){return this.options.description},setDescription:function(t){return this.options.description=t,this},setTabindex:function(t){return this.options.tabindex=t,this},getTabindex:function(){return this.options.tabindex},updateTabindex:function(){return this.isRealized()&&this.getModal().attr("tabindex",this.getTabindex()),this},getDefaultText:function(){return o.DEFAULT_TEXTS[this.getType()]},getNamespace:function(t){return o.NAMESPACE+"-"+t},createHeaderContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("header")),e.append(this.createTitleContent()),e.prepend(this.createCloseButton()),e},createTitleContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("title")),e},createCloseButton:function(){var e=t("<div></div>");e.addClass(this.getNamespace("close-button"));var n=t('<button class="close">&times;</button>');return e.append(n),e.on("click",{dialog:this},function(t){t.data.dialog.close()}),e},createBodyContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("body")),e.append(this.createMessageContent()),e},createMessageContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("message")),e},createFooterContent:function(){var e=t("<div></div>");return e.addClass(this.getNamespace("footer")),e},createFooterButtons:function(){var e=this,n=t("<div></div>");return n.addClass(this.getNamespace("footer-buttons")),this.indexedButtons={},t.each(this.options.buttons,function(t,i){i.id||(i.id=o.newGuid());var s=e.createButton(i);e.indexedButtons[i.id]=s,n.append(s)}),n},createButton:function(e){var n=t('<button class="btn"></button>');return n.prop("id",e.id),n.data("button",e),"undefined"!=typeof e.icon&&""!==t.trim(e.icon)&&n.append(this.createButtonIcon(e.icon)),"undefined"!=typeof e.label&&n.append(e.label),n.addClass("undefined"!=typeof e.cssClass&&""!==t.trim(e.cssClass)?e.cssClass:"btn-default"),"undefined"!=typeof e.hotkey&&(this.registeredButtonHotkeys[e.hotkey]=n),n.on("click",{dialog:this,$button:n,button:e},function(t){var e=t.data.dialog,n=t.data.$button,o=n.data("button");return o.autospin&&n.toggleSpin(!0),"function"==typeof o.action?o.action.call(n,e,t):void 0}),this.enhanceButton(n),"undefined"!=typeof e.enabled&&n.toggleEnable(e.enabled),n},enhanceButton:function(t){return t.dialog=this,t.toggleEnable=function(t){var e=this;return"undefined"!=typeof t?e.prop("disabled",!t).toggleClass("disabled",!t):e.prop("disabled",!e.prop("disabled")),e},t.enable=function(){var t=this;return t.toggleEnable(!0),t},t.disable=function(){var t=this;return t.toggleEnable(!1),t},t.toggleSpin=function(e){var n=this,o=n.dialog,i=n.find("."+o.getNamespace("button-icon"));return"undefined"==typeof e&&(e=!(t.find(".icon-spin").length>0)),e?(i.hide(),t.prepend(o.createButtonIcon(o.getSpinicon()).addClass("icon-spin"))):(i.show(),t.find(".icon-spin").remove()),n},t.spin=function(){var t=this;return t.toggleSpin(!0),t},t.stopSpin=function(){var t=this;return t.toggleSpin(!1),t},this},createButtonIcon:function(e){var n=t("<span></span>");return n.addClass(this.getNamespace("button-icon")).addClass(e),n},enableButtons:function(e){return t.each(this.indexedButtons,function(t,n){n.toggleEnable(e)}),this},updateClosable:function(){return this.isRealized()&&this.getModalHeader().find("."+this.getNamespace("close-button")).toggle(this.isClosable()),this},onShow:function(t){return this.options.onshow=t,this},onShown:function(t){return this.options.onshown=t,this},onHide:function(t){return this.options.onhide=t,this},onHidden:function(t){return this.options.onhidden=t,this},isRealized:function(){return this.realized},setRealized:function(t){return this.realized=t,this},isOpened:function(){return this.opened},setOpened:function(t){return this.opened=t,this},handleModalEvents:function(){return this.getModal().on("show.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!0),e.isModalEvent(t)&&"function"==typeof e.options.onshow){var n=e.options.onshow(e);return n===!1&&e.setOpened(!1),n}}),this.getModal().on("shown.bs.modal",{dialog:this},function(t){var e=t.data.dialog;e.isModalEvent(t)&&"function"==typeof e.options.onshown&&e.options.onshown(e)}),this.getModal().on("hide.bs.modal",{dialog:this},function(t){var e=t.data.dialog;if(e.setOpened(!1),e.isModalEvent(t)&&"function"==typeof e.options.onhide){var n=e.options.onhide(e);return n===!1&&e.setOpened(!0),n}}),this.getModal().on("hidden.bs.modal",{dialog:this},function(e){var n=e.data.dialog;n.isModalEvent(e)&&"function"==typeof n.options.onhidden&&n.options.onhidden(n),n.isAutodestroy()&&(n.setRealized(!1),delete o.dialogs[n.getId()],t(this).remove()),o.moveFocus()}),this.handleModalBackdropEvent(),this.getModal().on("keyup",{dialog:this},function(t){27===t.which&&t.data.dialog.isClosable()&&t.data.dialog.canCloseByKeyboard()&&t.data.dialog.close()}),this.getModal().on("keyup",{dialog:this},function(e){var n=e.data.dialog;if("undefined"!=typeof n.registeredButtonHotkeys[e.which]){var o=t(n.registeredButtonHotkeys[e.which]);!o.prop("disabled")&&o.focus().trigger("click")}}),this},handleModalBackdropEvent:function(){return this.getModal().on("click",{dialog:this},function(e){t(e.target).hasClass("modal-backdrop")&&e.data.dialog.isClosable()&&e.data.dialog.canCloseByBackdrop()&&e.data.dialog.close()}),this},isModalEvent:function(t){return"undefined"!=typeof t.namespace&&"bs.modal"===t.namespace},makeModalDraggable:function(){return this.options.draggable&&(this.getModalHeader().addClass(this.getNamespace("draggable")).on("mousedown",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown=!0;var n=e.getModalDialog().offset();e.draggableData.mouseOffset={top:t.clientY-n.top,left:t.clientX-n.left}}),this.getModal().on("mouseup mouseleave",{dialog:this},function(t){t.data.dialog.draggableData.isMouseDown=!1}),t("body").on("mousemove",{dialog:this},function(t){var e=t.data.dialog;e.draggableData.isMouseDown&&e.getModalDialog().offset({top:t.clientY-e.draggableData.mouseOffset.top,left:t.clientX-e.draggableData.mouseOffset.left})})),this},realize:function(){return this.initModalStuff(),this.getModal().addClass(o.NAMESPACE).addClass(this.getCssClass()),this.updateSize(),this.getDescription()&&this.getModal().attr("aria-describedby",this.getDescription()),this.getModalFooter().append(this.createFooterContent()),this.getModalHeader().append(this.createHeaderContent()),this.getModalBody().append(this.createBodyContent()),this.getModal().data("bs.modal",new n(this.getModal(),{backdrop:"static",keyboard:!1,show:!1})),this.makeModalDraggable(),this.handleModalEvents(),this.setRealized(!0),this.updateButtons(),this.updateType(),this.updateTitle(),this.updateMessage(),this.updateClosable(),this.updateAnimate(),this.updateSize(),this.updateTabindex(),this},open:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("show"),this},close:function(){return!this.isRealized()&&this.realize(),this.getModal().modal("hide"),this}},o.prototype=t.extend(o.prototype,o.METHODS_TO_OVERRIDE[n.getModalVersion()]),o.newGuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0,n="x"===t?e:3&e|8;return n.toString(16)})},o.show=function(t){return new o(t).open()},o.alert=function(){var e={},n={type:o.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,buttonLabel:o.DEFAULT_TEXTS.OK,callback:null};return e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],callback:"undefined"!=typeof arguments[1]?arguments[1]:null}),new o({type:e.type,title:e.title,message:e.message,closable:e.closable,draggable:e.draggable,data:{callback:e.callback},onhide:function(t){!t.getData("btnClicked")&&t.isClosable()&&"function"==typeof t.getData("callback")&&t.getData("callback")(!1)},buttons:[{label:e.buttonLabel,action:function(t){return t.setData("btnClicked",!0),"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)===!1?!1:t.close()}}]}).open()},o.confirm=function(){var e={},n={type:o.TYPE_PRIMARY,title:null,message:null,closable:!1,draggable:!1,btnCancelLabel:o.DEFAULT_TEXTS.CANCEL,btnOKLabel:o.DEFAULT_TEXTS.OK,btnOKClass:null,callback:null};return e="object"==typeof arguments[0]&&arguments[0].constructor==={}.constructor?t.extend(!0,n,arguments[0]):t.extend(!0,n,{message:arguments[0],closable:!1,buttonLabel:o.DEFAULT_TEXTS.OK,callback:"undefined"!=typeof arguments[1]?arguments[1]:null}),null===e.btnOKClass&&(e.btnOKClass=["btn",e.type.split("-")[1]].join("-")),new o({type:e.type,title:e.title,message:e.message,closable:e.closable,draggable:e.draggable,data:{callback:e.callback},buttons:[{label:e.btnCancelLabel,action:function(t){return"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!1)===!1?!1:t.close()}},{label:e.btnOKLabel,cssClass:e.btnOKClass,action:function(t){return"function"==typeof t.getData("callback")&&t.getData("callback").call(this,!0)===!1?!1:t.close()}}]}).open()},o.warning=function(t,e){return new o({type:o.TYPE_WARNING,message:t}).open()},o.danger=function(t,e){return new o({type:o.TYPE_DANGER,message:t}).open()},o.success=function(t,e){return new o({type:o.TYPE_SUCCESS,message:t}).open()},o});
/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("select2/compat/utils",["jquery"],function(a){function b(b,c,d){var e,f,g=[];e=a.trim(b.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0===this.indexOf("select2-")&&g.push(this)})),e=a.trim(c.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&(f=d(this),null!=f&&g.push(f))})),b.attr("class",g.join(" "))}return{syncCssClasses:b}}),b.define("select2/compat/containerCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("containerCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptContainerCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("containerCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/dropdownCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("dropdownCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptDropdownCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("dropdownCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/initSelection",["jquery"],function(a){function b(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=c.get("initSelection"),this._isInitialized=!1,a.call(this,b,c)}return b.prototype.current=function(b,c){var d=this;return this._isInitialized?void b.call(this,c):void this.initSelection.call(null,this.$element,function(b){d._isInitialized=!0,a.isArray(b)||(b=[b]),c(b)})},b}),b.define("select2/compat/inputData",["jquery"],function(a){function b(a,b,c){this._currentData=[],this._valueSeparator=c.get("valueSeparator")||",","hidden"===b.prop("type")&&c.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),a.call(this,b,c)}return b.prototype.current=function(b,c){function d(b,c){var e=[];return b.selected||-1!==a.inArray(b.id,c)?(b.selected=!0,e.push(b)):b.selected=!1,b.children&&e.push.apply(e,d(b.children,c)),e}for(var e=[],f=0;f<this._currentData.length;f++){var g=this._currentData[f];e.push.apply(e,d(g,this.$element.val().split(this._valueSeparator)))}c(e)},b.prototype.select=function(b,c){if(this.options.get("multiple")){var d=this.$element.val();d+=this._valueSeparator+c.id,this.$element.val(d),this.$element.trigger("change")}else this.current(function(b){a.map(b,function(a){a.selected=!1})}),this.$element.val(c.id),this.$element.trigger("change")},b.prototype.unselect=function(a,b){var c=this;b.selected=!1,this.current(function(a){for(var d=[],e=0;e<a.length;e++){var f=a[e];b.id!=f.id&&d.push(f.id)}c.$element.val(d.join(c._valueSeparator)),c.$element.trigger("change")})},b.prototype.query=function(a,b,c){for(var d=[],e=0;e<this._currentData.length;e++){var f=this._currentData[e],g=this.matches(b,f);null!==g&&d.push(g)}c({results:d})},b.prototype.addOptions=function(b,c){var d=a.map(c,function(b){return a.data(b[0],"data")});this._currentData.push.apply(this._currentData,d)},b}),b.define("select2/compat/matcher",["jquery"],function(a){function b(b){function c(c,d){var e=a.extend(!0,{},d);if(null==c.term||""===a.trim(c.term))return e;if(d.children){for(var f=d.children.length-1;f>=0;f--){var g=d.children[f],h=b(c.term,g.text,g);h||e.children.splice(f,1)}if(e.children.length>0)return e}return b(c.term,d.text,d)?e:null}return c}return b}),b.define("select2/compat/query",[],function(){function a(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),a.call(this,b,c)}return a.prototype.query=function(a,b,c){b.callback=c;var d=this.options.get("query");d.call(null,b)},a}),b.define("select2/dropdown/attachContainer",[],function(){function a(a,b,c){a.call(this,b,c)}return a.prototype.position=function(a,b,c){var d=c.find(".dropdown-wrapper");d.append(b),b.addClass("select2-dropdown--below"),c.addClass("select2-container--below")},a}),b.define("select2/dropdown/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$dropdown.on(d.join(" "),function(a){a.stopPropagation()})},a}),b.define("select2/selection/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$selection.on(d.join(" "),function(a){a.stopPropagation()})},a}),function(c){"function"==typeof b.define&&b.define.amd?b.define("jquery-mousewheel",["jquery"],c):"object"==typeof exports?module.exports=c:c(a)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});
/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */

(function(){if(jQuery&&jQuery.fn&&jQuery.fn.select2&&jQuery.fn.select2.amd)var e=jQuery.fn.select2.amd;return e.define("select2/i18n/zh-CN",[],function(){return{errorLoading:function(){return"无法载入结果。"},inputTooLong:function(e){var t=e.input.length-e.maximum,n="请删除"+t+"个字符";return n},inputTooShort:function(e){var t=e.minimum-e.input.length,n="请再输入至少"+t+"个字符";return n},loadingMore:function(){return"载入更多结果…"},maximumSelected:function(e){var t="最多只能选择"+e.maximum+"个项目";return t},noResults:function(){return"未找到结果"},searching:function(){return"搜索中…"}}}),{define:e.define,require:e.require}})();
/*! jsTree - v3.0.9 - 2015-03-02 - (MIT) */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a,b){"use strict";if(!a.jstree){var c=0,d=!1,e=!1,f=!1,g=[],h=a("script:last").attr("src"),i=window.document,j=i.createElement("LI"),k,l;j.setAttribute("role","treeitem"),k=i.createElement("I"),k.className="jstree-icon jstree-ocl",k.setAttribute("role","presentation"),j.appendChild(k),k=i.createElement("A"),k.className="jstree-anchor",k.setAttribute("href","#"),k.setAttribute("tabindex","-1"),l=i.createElement("I"),l.className="jstree-icon jstree-themeicon",l.setAttribute("role","presentation"),k.appendChild(l),j.appendChild(k),k=l=null,a.jstree={version:"3.0.9",defaults:{plugins:[]},plugins:{},path:h&&-1!==h.indexOf("/")?h.replace(/\/[^\/]+$/,""):"",idregex:/[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g},a.jstree.create=function(b,d){var e=new a.jstree.core(++c),f=d;return d=a.extend(!0,{},a.jstree.defaults,d),f&&f.plugins&&(d.plugins=f.plugins),a.each(d.plugins,function(a,b){"core"!==a&&(e=e.plugin(b,d[b]))}),e.init(b,d),e},a.jstree.destroy=function(){a(".jstree:jstree").jstree("destroy"),a(i).off(".jstree")},a.jstree.core=function(a){this._id=a,this._cnt=0,this._wrk=null,this._data={core:{themes:{name:!1,dots:!1,icons:!1},selected:[],last_error:{},working:!1,worker_queue:[],focused:null}}},a.jstree.reference=function(b){var c=null,d=null;if(!b||!b.id||b.tagName&&b.nodeType||(b=b.id),!d||!d.length)try{d=a(b)}catch(e){}if(!d||!d.length)try{d=a("#"+b.replace(a.jstree.idregex,"\\$&"))}catch(e){}return d&&d.length&&(d=d.closest(".jstree")).length&&(d=d.data("jstree"))?c=d:a(".jstree").each(function(){var d=a(this).data("jstree");return d&&d._model.data[b]?(c=d,!1):void 0}),c},a.fn.jstree=function(c){var d="string"==typeof c,e=Array.prototype.slice.call(arguments,1),f=null;return c!==!0||this.length?(this.each(function(){var g=a.jstree.reference(this),h=d&&g?g[c]:null;return f=d&&h?h.apply(g,e):null,g||d||c!==b&&!a.isPlainObject(c)||a(this).data("jstree",new a.jstree.create(this,c)),(g&&!d||c===!0)&&(f=g||!1),null!==f&&f!==b?!1:void 0}),null!==f&&f!==b?f:this):!1},a.expr[":"].jstree=a.expr.createPseudo(function(c){return function(c){return a(c).hasClass("jstree")&&a(c).data("jstree")!==b}}),a.jstree.defaults.core={data:!1,strings:!1,check_callback:!1,error:a.noop,animation:200,multiple:!0,themes:{name:!1,url:!1,dir:!1,dots:!0,icons:!0,stripes:!1,variant:!1,responsive:!1},expand_selected_onload:!0,worker:!0,force_text:!1,dblclick_toggle:!0},a.jstree.core.prototype={plugin:function(b,c){var d=a.jstree.plugins[b];return d?(this._data[b]={},d.prototype=this,new d(c,this)):this},init:function(b,c){this._model={data:{"#":{id:"#",parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}}},changed:[],force_full_redraw:!1,redraw_timeout:!1,default_state:{loaded:!0,opened:!1,selected:!1,disabled:!1}},this.element=a(b).addClass("jstree jstree-"+this._id),this.settings=c,this._data.core.ready=!1,this._data.core.loaded=!1,this._data.core.rtl="rtl"===this.element.css("direction"),this.element[this._data.core.rtl?"addClass":"removeClass"]("jstree-rtl"),this.element.attr("role","tree"),this.settings.core.multiple&&this.element.attr("aria-multiselectable",!0),this.element.attr("tabindex")||this.element.attr("tabindex","0"),this.bind(),this.trigger("init"),this._data.core.original_container_html=this.element.find(" > ul > li").clone(!0),this._data.core.original_container_html.find("li").addBack().contents().filter(function(){return 3===this.nodeType&&(!this.nodeValue||/^\s+$/.test(this.nodeValue))}).remove(),this.element.html("<ul class='jstree-container-ul jstree-children' role='group'><li id='j"+this._id+"_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='tree-item'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading"),this._data.core.li_height=this.get_container_ul().children("li").first().height()||24,this.trigger("loading"),this.load_node("#")},destroy:function(a){if(this._wrk)try{window.URL.revokeObjectURL(this._wrk),this._wrk=null}catch(b){}a||this.element.empty(),this.teardown()},teardown:function(){this.unbind(),this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class",function(){return this.className.replace(/jstree[^ ]*|$/gi,"")}),this.element=null},bind:function(){var b="",c=null,d=0;this.element.on("dblclick.jstree",function(){if(i.selection&&i.selection.empty)i.selection.empty();else if(window.getSelection){var a=window.getSelection();try{a.removeAllRanges(),a.collapse()}catch(b){}}}).on("mousedown.jstree",a.proxy(function(a){a.target===this.element[0]&&(a.preventDefault(),d=+new Date)},this)).on("mousedown.jstree",".jstree-ocl",function(a){a.preventDefault()}).on("click.jstree",".jstree-ocl",a.proxy(function(a){this.toggle_node(a.target)},this)).on("dblclick.jstree",".jstree-anchor",a.proxy(function(a){this.settings.core.dblclick_toggle&&this.toggle_node(a.target)},this)).on("click.jstree",".jstree-anchor",a.proxy(function(b){b.preventDefault(),b.currentTarget!==i.activeElement&&a(b.currentTarget).focus(),this.activate_node(b.currentTarget,b)},this)).on("keydown.jstree",".jstree-anchor",a.proxy(function(b){if("INPUT"===b.target.tagName)return!0;if(32!==b.which&&13!==b.which&&(b.shiftKey||b.ctrlKey||b.altKey||b.metaKey))return!0;var c=null;switch(this._data.core.rtl&&(37===b.which?b.which=39:39===b.which&&(b.which=37)),b.which){case 32:b.ctrlKey&&(b.type="click",a(b.currentTarget).trigger(b));break;case 13:b.type="click",a(b.currentTarget).trigger(b);break;case 37:b.preventDefault(),this.is_open(b.currentTarget)?this.close_node(b.currentTarget):(c=this.get_parent(b.currentTarget),c&&"#"!==c.id&&this.get_node(c,!0).children(".jstree-anchor").focus());break;case 38:b.preventDefault(),c=this.get_prev_dom(b.currentTarget),c&&c.length&&c.children(".jstree-anchor").focus();break;case 39:b.preventDefault(),this.is_closed(b.currentTarget)?this.open_node(b.currentTarget,function(a){this.get_node(a,!0).children(".jstree-anchor").focus()}):this.is_open(b.currentTarget)&&(c=this.get_node(b.currentTarget,!0).children(".jstree-children")[0],c&&a(this._firstChild(c)).children(".jstree-anchor").focus());break;case 40:b.preventDefault(),c=this.get_next_dom(b.currentTarget),c&&c.length&&c.children(".jstree-anchor").focus();break;case 106:this.open_all();break;case 36:b.preventDefault(),c=this._firstChild(this.get_container_ul()[0]),c&&a(c).children(".jstree-anchor").filter(":visible").focus();break;case 35:b.preventDefault(),this.element.find(".jstree-anchor").filter(":visible").last().focus()}},this)).on("load_node.jstree",a.proxy(function(b,c){c.status&&("#"!==c.node.id||this._data.core.loaded||(this._data.core.loaded=!0,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.trigger("loaded")),this._data.core.ready||setTimeout(a.proxy(function(){if(!this.get_container_ul().find(".jstree-loading").length){if(this._data.core.ready=!0,this._data.core.selected.length){if(this.settings.core.expand_selected_onload){var b=[],c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)b=b.concat(this._model.data[this._data.core.selected[c]].parents);for(b=a.vakata.array_unique(b),c=0,d=b.length;d>c;c++)this.open_node(b[c],!1,0)}this.trigger("changed",{action:"ready",selected:this._data.core.selected})}this.trigger("ready")}},this),0))},this)).on("keypress.jstree",a.proxy(function(d){if("INPUT"===d.target.tagName)return!0;c&&clearTimeout(c),c=setTimeout(function(){b=""},500);var e=String.fromCharCode(d.which).toLowerCase(),f=this.element.find(".jstree-anchor").filter(":visible"),g=f.index(i.activeElement)||0,h=!1;if(b+=e,b.length>1){if(f.slice(g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return}if(new RegExp("^"+e+"+$").test(b)){if(f.slice(g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return}},this)).on("init.jstree",a.proxy(function(){var a=this.settings.core.themes;this._data.core.themes.dots=a.dots,this._data.core.themes.stripes=a.stripes,this._data.core.themes.icons=a.icons,this.set_theme(a.name||"default",a.url),this.set_theme_variant(a.variant)},this)).on("loading.jstree",a.proxy(function(){this[this._data.core.themes.dots?"show_dots":"hide_dots"](),this[this._data.core.themes.icons?"show_icons":"hide_icons"](),this[this._data.core.themes.stripes?"show_stripes":"hide_stripes"]()},this)).on("blur.jstree",".jstree-anchor",a.proxy(function(b){this._data.core.focused=null,a(b.currentTarget).filter(".jstree-hovered").mouseleave(),this.element.attr("tabindex","0")},this)).on("focus.jstree",".jstree-anchor",a.proxy(function(b){var c=this.get_node(b.currentTarget);c&&c.id&&(this._data.core.focused=c.id),this.element.find(".jstree-hovered").not(b.currentTarget).mouseleave(),a(b.currentTarget).mouseenter(),this.element.attr("tabindex","-1")},this)).on("focus.jstree",a.proxy(function(){+new Date-d>500&&!this._data.core.focused&&(d=0,this.get_node(this.element.attr("aria-activedescendant"),!0).find("> .jstree-anchor").focus())},this)).on("mouseenter.jstree",".jstree-anchor",a.proxy(function(a){this.hover_node(a.currentTarget)},this)).on("mouseleave.jstree",".jstree-anchor",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},unbind:function(){this.element.off(".jstree"),a(i).off(".jstree-"+this._id)},trigger:function(a,b){b||(b={}),b.instance=this,this.element.triggerHandler(a.replace(".jstree","")+".jstree",b)},get_container:function(){return this.element},get_container_ul:function(){return this.element.children(".jstree-children").first()},get_string:function(b){var c=this.settings.core.strings;return a.isFunction(c)?c.call(this,b):c&&c[b]?c[b]:b},_firstChild:function(a){a=a?a.firstChild:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_nextSibling:function(a){a=a?a.nextSibling:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_previousSibling:function(a){a=a?a.previousSibling:null;while(null!==a&&1!==a.nodeType)a=a.previousSibling;return a},get_node:function(b,c){b&&b.id&&(b=b.id);var d;try{if(this._model.data[b])b=this._model.data[b];else if("string"==typeof b&&this._model.data[b.replace(/^#/,"")])b=this._model.data[b.replace(/^#/,"")];else if("string"==typeof b&&(d=a("#"+b.replace(a.jstree.idregex,"\\$&"),this.element)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else if((d=a(b,this.element)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else{if(!(d=a(b,this.element)).length||!d.hasClass("jstree"))return!1;b=this._model.data["#"]}return c&&(b="#"===b.id?this.element:a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)),b}catch(e){return!1}},get_path:function(a,b,c){if(a=a.parents?a:this.get_node(a),!a||"#"===a.id||!a.parents)return!1;var d,e,f=[];for(f.push(c?a.id:a.text),d=0,e=a.parents.length;e>d;d++)f.push(c?a.parents[d]:this.get_text(a.parents[d]));return f=f.reverse().slice(1),b?f.join(b):f},get_next_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this._firstChild(this.get_container_ul()[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}if(b.hasClass("jstree-open")){d=this._firstChild(b.children(".jstree-children")[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);if(null!==d)return a(d)}d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return null!==d?a(d):b.parentsUntil(".jstree",".jstree-node").next(".jstree-node:visible").first()},get_prev_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this.get_container_ul()[0].lastChild;while(d&&0===d.offsetHeight)d=this._previousSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);if(null!==d){b=a(d);while(b.hasClass("jstree-open"))b=b.children(".jstree-children").first().children(".jstree-node:visible:last");return b}return d=b[0].parentNode.parentNode,d&&d.className&&-1!==d.className.indexOf("jstree-node")?a(d):!1},get_parent:function(a){return a=this.get_node(a),a&&"#"!==a.id?a.parent:!1},get_children_dom:function(a){return a=this.get_node(a,!0),a[0]===this.element[0]?this.get_container_ul().children(".jstree-node"):a&&a.length?a.children(".jstree-children").children(".jstree-node"):!1},is_parent:function(a){return a=this.get_node(a),a&&(a.state.loaded===!1||a.children.length>0)},is_loaded:function(a){return a=this.get_node(a),a&&a.state.loaded},is_loading:function(a){return a=this.get_node(a),a&&a.state&&a.state.loading},is_open:function(a){return a=this.get_node(a),a&&a.state.opened},is_closed:function(a){return a=this.get_node(a),a&&this.is_parent(a)&&!a.state.opened},is_leaf:function(a){return!this.is_parent(a)},load_node:function(b,c){var d,e,f,g,h;if(a.isArray(b))return this._load_nodes(b.slice(),c),!0;if(b=this.get_node(b),!b)return c&&c.call(this,b,!1),!1;if(b.state.loaded){for(b.state.loaded=!1,d=0,e=b.children_d.length;e>d;d++){for(f=0,g=b.parents.length;g>f;f++)this._model.data[b.parents[f]].children_d=a.vakata.array_remove_item(this._model.data[b.parents[f]].children_d,b.children_d[d]);this._model.data[b.children_d[d]].state.selected&&(h=!0,this._data.core.selected=a.vakata.array_remove_item(this._data.core.selected,b.children_d[d])),delete this._model.data[b.children_d[d]]}b.children=[],b.children_d=[],h&&this.trigger("changed",{action:"load_node",node:b,selected:this._data.core.selected})}return b.state.failed=!1,b.state.loading=!0,this.get_node(b,!0).addClass("jstree-loading").attr("aria-busy",!0),this._load_node(b,a.proxy(function(a){b=this._model.data[b.id],b.state.loading=!1,b.state.loaded=a,b.state.failed=!b.state.loaded;var d=this.get_node(b,!0);b.state.loaded&&!b.children.length&&d&&d.length&&!d.hasClass("jstree-leaf")&&d.removeClass("jstree-closed jstree-open").addClass("jstree-leaf"),d.removeClass("jstree-loading").attr("aria-busy",!1),this.trigger("load_node",{node:b,status:a}),c&&c.call(this,b,a)},this)),!0},_load_nodes:function(a,b,c){var d=!0,e=function(){this._load_nodes(a,b,!0)},f=this._model.data,g,h,i=[];for(g=0,h=a.length;h>g;g++)!f[a[g]]||(f[a[g]].state.loaded||f[a[g]].state.failed)&&c||(this.is_loading(a[g])||this.load_node(a[g],e),d=!1);if(d){for(g=0,h=a.length;h>g;g++)f[a[g]]&&f[a[g]].state.loaded&&i.push(a[g]);b&&!b.done&&(b.call(this,i),b.done=!0)}},load_all:function(a,b){if(a||(a="#"),a=this.get_node(a),!a)return!1;var c=[],d=this._model.data,e=d[a.id].children_d,f,g;for(a.state&&!a.state.loaded&&c.push(a.id),f=0,g=e.length;g>f;f++)d[e[f]]&&d[e[f]].state&&!d[e[f]].state.loaded&&c.push(e[f]);c.length?this._load_nodes(c,function(){this.load_all(a,b)}):(b&&b.call(this,a),this.trigger("load_all",{node:a}))},_load_node:function(b,c){var d=this.settings.core.data,e;return d?a.isFunction(d)?d.call(this,b,a.proxy(function(d){d===!1&&c.call(this,!1),this["string"==typeof d?"_append_html_data":"_append_json_data"](b,"string"==typeof d?a(a.parseHTML(d)).filter(function(){return 3!==this.nodeType}):d,function(a){c.call(this,a)})},this)):"object"==typeof d?d.url?(d=a.extend(!0,{},d),a.isFunction(d.url)&&(d.url=d.url.call(this,b)),a.isFunction(d.data)&&(d.data=d.data.call(this,b)),a.ajax(d).done(a.proxy(function(d,e,f){var g=f.getResponseHeader("Content-Type");return g&&-1!==g.indexOf("json")||"object"==typeof d?this._append_json_data(b,d,function(a){c.call(this,a)}):g&&-1!==g.indexOf("html")||"string"==typeof d?this._append_html_data(b,a(a.parseHTML(d)).filter(function(){return 3!==this.nodeType}),function(a){c.call(this,a)}):(this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:f})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))},this)).fail(a.proxy(function(a){c.call(this,!1),this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:a})},this.settings.core.error.call(this,this._data.core.last_error)},this))):(e=a.isArray(d)||a.isPlainObject(d)?JSON.parse(JSON.stringify(d)):d,"#"===b.id?this._append_json_data(b,e,function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_05",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))):"string"==typeof d?"#"===b.id?this._append_html_data(b,a(a.parseHTML(d)).filter(function(){return 3!==this.nodeType}),function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_06",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1)):c.call(this,!1):"#"===b.id?this._append_html_data(b,this._data.core.original_container_html.clone(!0),function(a){c.call(this,a)}):c.call(this,!1)},_node_changed:function(a){a=this.get_node(a),a&&this._model.changed.push(a.id)},_append_html_data:function(b,c,d){b=this.get_node(b),b.children=[],b.children_d=[];var e=c.is("ul")?c.children():c,f=b.id,g=[],h=[],i=this._model.data,j=i[f],k=this._data.core.selected.length,l,m,n;for(e.each(a.proxy(function(b,c){l=this._parse_model_from_html(a(c),f,j.parents.concat()),l&&(g.push(l),h.push(l),i[l].children_d.length&&(h=h.concat(i[l].children_d)))},this)),j.children=g,j.children_d=h,m=0,n=j.parents.length;n>m;m++)i[j.parents[m]].children_d=i[j.parents[m]].children_d.concat(h);this.trigger("model",{nodes:h,parent:f}),"#"!==f?(this._node_changed(f),this.redraw()):(this.get_container_ul().children(".jstree-initial-node").remove(),this.redraw(!0)),this._data.core.selected.length!==k&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)},_append_json_data:function(b,c,d,e){b=this.get_node(b),b.children=[],b.children_d=[],c.d&&(c=c.d,"string"==typeof c&&(c=JSON.parse(c))),a.isArray(c)||(c=[c]);var f=null,g={df:this._model.default_state,dat:c,par:b.id,m:this._model.data,t_id:this._id,t_cnt:this._cnt,sel:this._data.core.selected},h=function(a,b){a.data&&(a=a.data);var c=a.dat,d=a.par,e=[],f=[],g=[],h=a.df,i=a.t_id,j=a.t_cnt,k=a.m,l=k[d],m=a.sel,n,o,p,q,r=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f,i,j,l,m={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(m.state[f]=h[f]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(m.icon=a.data.jstree.icon),(m.icon===b||null===m.icon||""===m.icon)&&(m.icon=!0),a&&a.data&&(m.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(m.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(m.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(m.li_attr[f]=a.li_attr[f]);if(m.li_attr.id||(m.li_attr.id=e),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(m.a_attr[f]=a.a_attr[f]);for(a&&a.children&&a.children===!0&&(m.state.loaded=!1,m.children=[],m.children_d=[]),k[m.id]=m,f=0,i=m.children.length;i>f;f++)j=r(k[m.children[f]],m.id,d),l=k[j],m.children_d.push(j),l.children_d.length&&(m.children_d=m.children_d.concat(l.children_d));return delete a.data,delete a.children,k[m.id].original=a,m.state.selected&&g.push(m.id),m.id},s=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,l,m,n,o;do e="j"+i+"_"+ ++j;while(k[e]);o={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(o.state[f]=h[f]);if(a&&a.id&&(o.id=a.id.toString()),a&&a.text&&(o.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(o.icon=a.data.jstree.icon),(o.icon===b||null===o.icon||""===o.icon)&&(o.icon=!0),a&&a.data&&(o.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(o.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(o.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(o.li_attr[f]=a.li_attr[f]);if(o.li_attr.id&&!o.id&&(o.id=o.li_attr.id.toString()),o.id||(o.id=e),o.li_attr.id||(o.li_attr.id=o.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(o.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,l=a.children.length;l>f;f++)m=s(a.children[f],o.id,d),n=k[m],o.children.push(m),n.children_d.length&&(o.children_d=o.children_d.concat(n.children_d));o.children_d=o.children_d.concat(o.children)}return a&&a.children&&a.children===!0&&(o.state.loaded=!1,o.children=[],o.children_d=[]),delete a.data,delete a.children,o.original=a,k[o.id]=o,o.state.selected&&g.push(o.id),o.id};if(c.length&&c[0].id!==b&&c[0].parent!==b){for(o=0,p=c.length;p>o;o++)c[o].children||(c[o].children=[]),k[c[o].id.toString()]=c[o];for(o=0,p=c.length;p>o;o++)k[c[o].parent.toString()].children.push(c[o].id.toString()),l.children_d.push(c[o].id.toString());for(o=0,p=l.children.length;p>o;o++)n=r(k[l.children[o]],d,l.parents.concat()),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d));for(o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}else{for(o=0,p=c.length;p>o;o++)n=s(c[o],d,l.parents.concat()),n&&(e.push(n),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d)));for(l.children=e,l.children_d=f,o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}return"undefined"!=typeof window&&"undefined"!=typeof window.document?q:void postMessage(q)},i=function(b,c){if(this._cnt=b.cnt,this._model.data=b.mod,c){var e,f,g=b.add,h=b.sel,i=this._data.core.selected.slice(),j=this._model.data;if(h.length!==i.length||a.vakata.array_unique(h.concat(i)).length!==h.length){for(e=0,f=h.length;f>e;e++)-1===a.inArray(h[e],g)&&-1===a.inArray(h[e],i)&&(j[h[e]].state.selected=!1);for(e=0,f=i.length;f>e;e++)-1===a.inArray(i[e],h)&&(j[i[e]].state.selected=!0)}}b.add.length&&(this._data.core.selected=this._data.core.selected.concat(b.add)),this.trigger("model",{nodes:b.dpc,parent:b.par}),"#"!==b.par?(this._node_changed(b.par),this.redraw()):this.redraw(!0),b.add.length&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)};if(this.settings.core.worker&&window.Blob&&window.URL&&window.Worker)try{null===this._wrk&&(this._wrk=window.URL.createObjectURL(new window.Blob(["self.onmessage = "+h.toString()],{type:"text/javascript"}))),!this._data.core.working||e?(this._data.core.working=!0,f=new window.Worker(this._wrk),f.onmessage=a.proxy(function(a){i.call(this,a.data,!0);try{f.terminate(),f=null}catch(b){}this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1},this),g.par?f.postMessage(g):this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1):this._data.core.worker_queue.push([b,c,d,!0])}catch(j){i.call(this,h(g),!1),this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1}else i.call(this,h(g),!1)},_parse_model_from_html:function(c,d,e){e=e?[].concat(e):[],d&&e.unshift(d);var f,g,h=this._model.data,i={id:!1,text:!1,icon:!0,parent:d,parents:e,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1},j,k,l;for(j in this._model.default_state)this._model.default_state.hasOwnProperty(j)&&(i.state[j]=this._model.default_state[j]);if(k=a.vakata.attributes(c,!0),a.each(k,function(b,c){return c=a.trim(c),c.length?(i.li_attr[b]=c,void("id"===b&&(i.id=c.toString()))):!0}),k=c.children("a").first(),k.length&&(k=a.vakata.attributes(k,!0),a.each(k,function(b,c){c=a.trim(c),c.length&&(i.a_attr[b]=c)})),k=c.children("a").first().length?c.children("a").first().clone():c.clone(),k.children("ins, i, ul").remove(),k=k.html(),k=a("<div />").html(k),i.text=this.settings.core.force_text?k.text():k.html(),k=c.data(),i.data=k?a.extend(!0,{},k):null,i.state.opened=c.hasClass("jstree-open"),i.state.selected=c.children("a").hasClass("jstree-clicked"),i.state.disabled=c.children("a").hasClass("jstree-disabled"),i.data&&i.data.jstree)for(j in i.data.jstree)i.data.jstree.hasOwnProperty(j)&&(i.state[j]=i.data.jstree[j]);k=c.children("a").children(".jstree-themeicon"),k.length&&(i.icon=k.hasClass("jstree-themeicon-hidden")?!1:k.attr("rel")),i.state.icon&&(i.icon=i.state.icon),(i.icon===b||null===i.icon||""===i.icon)&&(i.icon=!0),k=c.children("ul").children("li");do l="j"+this._id+"_"+ ++this._cnt;while(h[l]);return i.id=i.li_attr.id?i.li_attr.id.toString():l,k.length?(k.each(a.proxy(function(b,c){f=this._parse_model_from_html(a(c),i.id,e),g=this._model.data[f],i.children.push(f),g.children_d.length&&(i.children_d=i.children_d.concat(g.children_d))},this)),i.children_d=i.children_d.concat(i.children)):c.hasClass("jstree-closed")&&(i.state.loaded=!1),i.li_attr["class"]&&(i.li_attr["class"]=i.li_attr["class"].replace("jstree-closed","").replace("jstree-open","")),i.a_attr["class"]&&(i.a_attr["class"]=i.a_attr["class"].replace("jstree-clicked","").replace("jstree-disabled","")),h[i.id]=i,i.state.selected&&this._data.core.selected.push(i.id),i.id},_parse_model_from_flat_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f=this._model.data,g=this._model.default_state,h,i,j,k,l={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(h in g)g.hasOwnProperty(h)&&(l.state[h]=g[h]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(h in a.data.jstree)a.data.jstree.hasOwnProperty(h)&&(l.state[h]=a.data.jstree[h]);if(a&&"object"==typeof a.state)for(h in a.state)a.state.hasOwnProperty(h)&&(l.state[h]=a.state[h]);if(a&&"object"==typeof a.li_attr)for(h in a.li_attr)a.li_attr.hasOwnProperty(h)&&(l.li_attr[h]=a.li_attr[h]);if(l.li_attr.id||(l.li_attr.id=e),a&&"object"==typeof a.a_attr)for(h in a.a_attr)a.a_attr.hasOwnProperty(h)&&(l.a_attr[h]=a.a_attr[h]);for(a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),f[l.id]=l,h=0,i=l.children.length;i>h;h++)j=this._parse_model_from_flat_json(f[l.children[h]],l.id,d),k=f[j],l.children_d.push(j),k.children_d.length&&(l.children_d=l.children_d.concat(k.children_d));return delete a.data,delete a.children,f[l.id].original=a,l.state.selected&&this._data.core.selected.push(l.id),l.id},_parse_model_from_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,g,h,i,j=this._model.data,k=this._model.default_state,l;do e="j"+this._id+"_"+ ++this._cnt;while(j[e]);l={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in k)k.hasOwnProperty(f)&&(l.state[f]=k[f]);if(a&&a.id&&(l.id=a.id.toString()),a&&a.text&&(l.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(l.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(l.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(l.li_attr[f]=a.li_attr[f]);if(l.li_attr.id&&!l.id&&(l.id=l.li_attr.id.toString()),l.id||(l.id=e),l.li_attr.id||(l.li_attr.id=l.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(l.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,g=a.children.length;g>f;f++)h=this._parse_model_from_json(a.children[f],l.id,d),i=j[h],l.children.push(h),i.children_d.length&&(l.children_d=l.children_d.concat(i.children_d));l.children_d=l.children_d.concat(l.children)}return a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),delete a.data,delete a.children,l.original=a,j[l.id]=l,l.state.selected&&this._data.core.selected.push(l.id),l.id},_redraw:function(){var a=this._model.force_full_redraw?this._model.data["#"].children.concat([]):this._model.changed.concat([]),b=i.createElement("UL"),c,d,e,f=this._data.core.focused;for(d=0,e=a.length;e>d;d++)c=this.redraw_node(a[d],!0,this._model.force_full_redraw),c&&this._model.force_full_redraw&&b.appendChild(c);this._model.force_full_redraw&&(b.className=this.get_container_ul()[0].className,b.setAttribute("role","group"),this.element.empty().append(b)),null!==f&&(c=this.get_node(f,!0),c&&c.length&&c.children(".jstree-anchor")[0]!==i.activeElement?c.children(".jstree-anchor").focus():this._data.core.focused=null),this._model.force_full_redraw=!1,this._model.changed=[],this.trigger("redraw",{nodes:a})},redraw:function(a){a&&(this._model.force_full_redraw=!0),this._redraw()},draw_children:function(a){var b=this.get_node(a),c=!1,d=!1,e=!1,f=i;if(!b)return!1;if("#"===b.id)return this.redraw(!0);if(a=this.get_node(a,!0),!a||!a.length)return!1;if(a.children(".jstree-children").remove(),a=a[0],b.children.length&&b.state.loaded){for(e=f.createElement("UL"),e.setAttribute("role","group"),e.className="jstree-children",c=0,d=b.children.length;d>c;c++)e.appendChild(this.redraw_node(b.children[c],!0,!0));a.appendChild(e)}},redraw_node:function(b,c,d,e){var f=this.get_node(b),g=!1,h=!1,k=!1,l=!1,m=!1,n=!1,o="",p=i,q=this._model.data,r=!1,s=!1,t=null,u=0,v=0;if(!f)return!1;if("#"===f.id)return this.redraw(!0);if(c=c||0===f.children.length,b=i.querySelector?this.element[0].querySelector("#"+(-1!=="0123456789".indexOf(f.id[0])?"\\3"+f.id[0]+" "+f.id.substr(1).replace(a.jstree.idregex,"\\$&"):f.id.replace(a.jstree.idregex,"\\$&"))):i.getElementById(f.id))b=a(b),d||(g=b.parent().parent()[0],g===this.element[0]&&(g=null),h=b.index()),c||!f.children.length||b.children(".jstree-children").length||(c=!0),c||(k=b.children(".jstree-children")[0]),r=b.children(".jstree-anchor")[0]===i.activeElement,b.remove();else if(c=!0,!d){if(g="#"!==f.parent?a("#"+f.parent.replace(a.jstree.idregex,"\\$&"),this.element)[0]:null,!(null===g||g&&q[f.parent].state.opened))return!1;h=a.inArray(f.id,null===g?q["#"].children:q[f.parent].children)}b=j.cloneNode(!0),o="jstree-node ";for(l in f.li_attr)if(f.li_attr.hasOwnProperty(l)){if("id"===l)continue;"class"!==l?b.setAttribute(l,f.li_attr[l]):o+=f.li_attr[l]}f.a_attr.id||(f.a_attr.id=f.id+"_anchor"),b.setAttribute("aria-selected",!!f.state.selected),b.setAttribute("aria-level",f.parents.length),b.setAttribute("aria-labelledby",f.a_attr.id),b.setAttribute("title",f.original.title||f.text),f.state.disabled&&b.setAttribute("aria-disabled",!0),f.state.loaded&&!f.children.length?o+=" jstree-leaf":(o+=f.state.opened&&f.state.loaded?" jstree-open":" jstree-closed",b.setAttribute("aria-expanded",f.state.opened&&f.state.loaded)),null!==f.parent&&q[f.parent].children[q[f.parent].children.length-1]===f.id&&(o+=" jstree-last"),b.id=f.id,b.className=o,o=(f.state.selected?" jstree-clicked":"")+(f.state.disabled?" jstree-disabled":"");
for(m in f.a_attr)if(f.a_attr.hasOwnProperty(m)){if("href"===m&&"#"===f.a_attr[m])continue;"class"!==m?b.childNodes[1].setAttribute(m,f.a_attr[m]):o+=" "+f.a_attr[m]}if(o.length&&(b.childNodes[1].className="jstree-anchor "+o),(f.icon&&f.icon!==!0||f.icon===!1)&&(f.icon===!1?b.childNodes[1].childNodes[0].className+=" jstree-themeicon-hidden":-1===f.icon.indexOf("/")&&-1===f.icon.indexOf(".")?b.childNodes[1].childNodes[0].className+=" "+f.icon+" jstree-themeicon-custom":(b.childNodes[1].childNodes[0].style.backgroundImage="url("+f.icon+")",b.childNodes[1].childNodes[0].style.backgroundPosition="center center",b.childNodes[1].childNodes[0].style.backgroundSize="auto",b.childNodes[1].childNodes[0].className+=" jstree-themeicon-custom")),this.settings.core.force_text?b.childNodes[1].appendChild(p.createTextNode(f.text)):b.childNodes[1].innerHTML+=f.text,c&&f.children.length&&(f.state.opened||e)&&f.state.loaded){for(n=p.createElement("UL"),n.setAttribute("role","group"),n.className="jstree-children",l=0,m=f.children.length;m>l;l++)n.appendChild(this.redraw_node(f.children[l],c,!0));b.appendChild(n)}if(k&&b.appendChild(k),!d){for(g||(g=this.element[0]),l=0,m=g.childNodes.length;m>l;l++)if(g.childNodes[l]&&g.childNodes[l].className&&-1!==g.childNodes[l].className.indexOf("jstree-children")){t=g.childNodes[l];break}t||(t=p.createElement("UL"),t.setAttribute("role","group"),t.className="jstree-children",g.appendChild(t)),g=t,h<g.childNodes.length?g.insertBefore(b,g.childNodes[h]):g.appendChild(b),r&&(u=this.element[0].scrollTop,v=this.element[0].scrollLeft,b.childNodes[1].focus(),this.element[0].scrollTop=u,this.element[0].scrollLeft=v)}return f.state.opened&&!f.state.loaded&&(f.state.opened=!1,setTimeout(a.proxy(function(){this.open_node(f.id,!1,0)},this),0)),b},open_node:function(c,d,e){var f,g,h,i;if(a.isArray(c)){for(c=c.slice(),f=0,g=c.length;g>f;f++)this.open_node(c[f],d,e);return!0}if(c=this.get_node(c),!c||"#"===c.id)return!1;if(e=e===b?this.settings.core.animation:e,!this.is_closed(c))return d&&d.call(this,c,!1),!1;if(this.is_loaded(c))h=this.get_node(c,!0),i=this,h.length&&(e&&h.children(".jstree-children").length&&h.children(".jstree-children").stop(!0,!0),c.children.length&&!this._firstChild(h.children(".jstree-children")[0])&&this.draw_children(c),e?(this.trigger("before_open",{node:c}),h.children(".jstree-children").css("display","none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded",!0).children(".jstree-children").stop(!0,!0).slideDown(e,function(){this.style.display="",i.trigger("after_open",{node:c})})):(this.trigger("before_open",{node:c}),h[0].className=h[0].className.replace("jstree-closed","jstree-open"),h[0].setAttribute("aria-expanded",!0))),c.state.opened=!0,d&&d.call(this,c,!0),h.length||this.trigger("before_open",{node:c}),this.trigger("open_node",{node:c}),e&&h.length||this.trigger("after_open",{node:c});else{if(this.is_loading(c))return setTimeout(a.proxy(function(){this.open_node(c,d,e)},this),500);this.load_node(c,function(a,b){return b?this.open_node(a,d,e):d?d.call(this,a,!1):!1})}},_open_to:function(b){if(b=this.get_node(b),!b||"#"===b.id)return!1;var c,d,e=b.parents;for(c=0,d=e.length;d>c;c+=1)"#"!==c&&this.open_node(e[c],!1,0);return a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)},close_node:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.close_node(c[e],d);return!0}return c=this.get_node(c),c&&"#"!==c.id?this.is_closed(c)?!1:(d=d===b?this.settings.core.animation:d,g=this,h=this.get_node(c,!0),h.length&&(d?h.children(".jstree-children").attr("style","display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded",!1).children(".jstree-children").stop(!0,!0).slideUp(d,function(){this.style.display="",h.children(".jstree-children").remove(),g.trigger("after_close",{node:c})}):(h[0].className=h[0].className.replace("jstree-open","jstree-closed"),h.attr("aria-expanded",!1).children(".jstree-children").remove())),c.state.opened=!1,this.trigger("close_node",{node:c}),void(d&&h.length||this.trigger("after_close",{node:c}))):!1},toggle_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.toggle_node(b[c]);return!0}return this.is_closed(b)?this.open_node(b):this.is_open(b)?this.close_node(b):void 0},open_all:function(a,b,c){if(a||(a="#"),a=this.get_node(a),!a)return!1;var d="#"===a.id?this.get_container_ul():this.get_node(a,!0),e,f,g;if(!d.length){for(e=0,f=a.children_d.length;f>e;e++)this.is_closed(this._model.data[a.children_d[e]])&&(this._model.data[a.children_d[e]].state.opened=!0);return this.trigger("open_all",{node:a})}c=c||d,g=this,d=this.is_closed(a)?d.find(".jstree-closed").addBack():d.find(".jstree-closed"),d.each(function(){g.open_node(this,function(a,d){d&&this.is_parent(a)&&this.open_all(a,b,c)},b||0)}),0===c.find(".jstree-closed").length&&this.trigger("open_all",{node:this.get_node(c)})},close_all:function(b,c){if(b||(b="#"),b=this.get_node(b),!b)return!1;var d="#"===b.id?this.get_container_ul():this.get_node(b,!0),e=this,f,g;if(!d.length){for(f=0,g=b.children_d.length;g>f;f++)this._model.data[b.children_d[f]].state.opened=!1;return this.trigger("close_all",{node:b})}d=this.is_open(b)?d.find(".jstree-open").addBack():d.find(".jstree-open"),a(d.get().reverse()).each(function(){e.close_node(this,c||0)}),this.trigger("close_all",{node:b})},is_disabled:function(a){return a=this.get_node(a),a&&a.state&&a.state.disabled},enable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.enable_node(b[c]);return!0}return b=this.get_node(b),b&&"#"!==b.id?(b.state.disabled=!1,this.get_node(b,!0).children(".jstree-anchor").removeClass("jstree-disabled").attr("aria-disabled",!1),void this.trigger("enable_node",{node:b})):!1},disable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.disable_node(b[c]);return!0}return b=this.get_node(b),b&&"#"!==b.id?(b.state.disabled=!0,this.get_node(b,!0).children(".jstree-anchor").addClass("jstree-disabled").attr("aria-disabled",!0),void this.trigger("disable_node",{node:b})):!1},activate_node:function(a,c){if(this.is_disabled(a))return!1;if(this._data.core.last_clicked=this._data.core.last_clicked&&this._data.core.last_clicked.id!==b?this.get_node(this._data.core.last_clicked.id):null,this._data.core.last_clicked&&!this._data.core.last_clicked.state.selected&&(this._data.core.last_clicked=null),!this._data.core.last_clicked&&this._data.core.selected.length&&(this._data.core.last_clicked=this.get_node(this._data.core.selected[this._data.core.selected.length-1])),this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&(!c.shiftKey||this._data.core.last_clicked&&this.get_parent(a)&&this.get_parent(a)===this._data.core.last_clicked.parent))if(c.shiftKey){var d=this.get_node(a).id,e=this._data.core.last_clicked.id,f=this.get_node(this._data.core.last_clicked.parent).children,g=!1,h,i;for(h=0,i=f.length;i>h;h+=1)f[h]===d&&(g=!g),f[h]===e&&(g=!g),g||f[h]===d||f[h]===e?this.select_node(f[h],!0,!1,c):this.deselect_node(f[h],!0,c);this.trigger("changed",{action:"select_node",node:this.get_node(a),selected:this._data.core.selected,event:c})}else this.is_selected(a)?this.deselect_node(a,!1,c):this.select_node(a,!1,!1,c);else!this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&this.is_selected(a)?this.deselect_node(a,!1,c):(this.deselect_all(!0),this.select_node(a,!1,!1,c),this._data.core.last_clicked=this.get_node(a));this.trigger("activate_node",{node:this.get_node(a)})},hover_node:function(a){if(a=this.get_node(a,!0),!a||!a.length||a.children(".jstree-hovered").length)return!1;var b=this.element.find(".jstree-hovered"),c=this.element;b&&b.length&&this.dehover_node(b),a.children(".jstree-anchor").addClass("jstree-hovered"),this.trigger("hover_node",{node:this.get_node(a)}),setTimeout(function(){c.attr("aria-activedescendant",a[0].id)},0)},dehover_node:function(a){return a=this.get_node(a,!0),a&&a.length&&a.children(".jstree-hovered").length?(a.children(".jstree-anchor").removeClass("jstree-hovered"),void this.trigger("dehover_node",{node:this.get_node(a)})):!1},select_node:function(b,c,d,e){var f,g,h,i;if(a.isArray(b)){for(b=b.slice(),g=0,h=b.length;h>g;g++)this.select_node(b[g],c,d,e);return!0}return b=this.get_node(b),b&&"#"!==b.id?(f=this.get_node(b,!0),void(b.state.selected||(b.state.selected=!0,$.vakata.array_remove_item(this._data.core.selected,b.id),this._data.core.selected.push(b.id),d||(f=this._open_to(b)),f&&f.length&&f.attr("aria-selected",!0).children(".jstree-anchor").addClass("jstree-clicked"),this.trigger("select_node",{node:b,selected:this._data.core.selected,event:e}),c||this.trigger("changed",{action:"select_node",node:b,selected:this._data.core.selected,event:e})))):!1},deselect_node:function(b,c,d){var e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.deselect_node(b[e],c,d);return!0}return b=this.get_node(b),b&&"#"!==b.id?(g=this.get_node(b,!0),void(b.state.selected&&(b.state.selected=!1,this._data.core.selected=a.vakata.array_remove_item(this._data.core.selected,b.id),g.length&&g.attr("aria-selected",!1).children(".jstree-anchor").removeClass("jstree-clicked"),this.trigger("deselect_node",{node:b,selected:this._data.core.selected,event:d}),c||this.trigger("changed",{action:"deselect_node",node:b,selected:this._data.core.selected,event:d})))):!1},select_all:function(a){var b=this._data.core.selected.concat([]),c,d;for(this._data.core.selected=this._model.data["#"].children_d.concat(),c=0,d=this._data.core.selected.length;d>c;c++)this._model.data[this._data.core.selected[c]]&&(this._model.data[this._data.core.selected[c]].state.selected=!0);this.redraw(!0),this.trigger("select_all",{selected:this._data.core.selected}),a||this.trigger("changed",{action:"select_all",selected:this._data.core.selected,old_selection:b})},deselect_all:function(a){var b=this._data.core.selected.concat([]),c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)this._model.data[this._data.core.selected[c]]&&(this._model.data[this._data.core.selected[c]].state.selected=!1);this._data.core.selected=[],this.element.find(".jstree-clicked").removeClass("jstree-clicked").parent().attr("aria-selected",!1),this.trigger("deselect_all",{selected:this._data.core.selected,node:b}),a||this.trigger("changed",{action:"deselect_all",selected:this._data.core.selected,old_selection:b})},is_selected:function(a){return a=this.get_node(a),a&&"#"!==a.id?a.state.selected:!1},get_selected:function(b){return b?a.map(this._data.core.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.core.selected.slice()},get_top_selected:function(b){var c=this.get_selected(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},get_bottom_selected:function(b){var c=this.get_selected(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},get_state:function(){var a={core:{open:[],scroll:{left:this.element.scrollLeft(),top:this.element.scrollTop()},selected:[]}},b;for(b in this._model.data)this._model.data.hasOwnProperty(b)&&"#"!==b&&(this._model.data[b].state.opened&&a.core.open.push(b),this._model.data[b].state.selected&&a.core.selected.push(b));return a},set_state:function(c,d){if(c){if(c.core){var e,f,g,h,i;if(c.core.open)return a.isArray(c.core.open)&&c.core.open.length?this._load_nodes(c.core.open,function(a){this.open_node(a,!1,0),delete c.core.open,this.set_state(c,d)},!0):(delete c.core.open,this.set_state(c,d)),!1;if(c.core.scroll)return c.core.scroll&&c.core.scroll.left!==b&&this.element.scrollLeft(c.core.scroll.left),c.core.scroll&&c.core.scroll.top!==b&&this.element.scrollTop(c.core.scroll.top),delete c.core.scroll,this.set_state(c,d),!1;if(c.core.selected)return h=this,this.deselect_all(),a.each(c.core.selected,function(a,b){h.select_node(b,!1,!0)}),delete c.core.selected,this.set_state(c,d),!1;for(i in c)c.hasOwnProperty(i)&&"core"!==i&&-1===a.inArray(i,this.settings.plugins)&&delete c[i];if(a.isEmptyObject(c.core))return delete c.core,this.set_state(c,d),!1}return a.isEmptyObject(c)?(c=null,d&&d.call(this),this.trigger("set_state"),!1):!0}return!1},refresh:function(b,c){this._data.core.state=c===!0?{}:this.get_state(),c&&a.isFunction(c)&&(this._data.core.state=c.call(this,this._data.core.state)),this._cnt=0,this._model.data={"#":{id:"#",parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}}};var d=this.get_container_ul()[0].className;b||(this.element.html("<ul class='"+d+"' role='group'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='treeitem' id='j"+this._id+"_loading'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading")),this.load_node("#",function(b,c){c&&(this.get_container_ul()[0].className=d,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.set_state(a.extend(!0,{},this._data.core.state),function(){this.trigger("refresh")})),this._data.core.state=null})},refresh_node:function(b){if(b=this.get_node(b),!b||"#"===b.id)return!1;var c=[],d=[],e=this._data.core.selected.concat([]);d.push(b.id),b.state.opened===!0&&c.push(b.id),this.get_node(b,!0).find(".jstree-open").each(function(){c.push(this.id)}),this._load_nodes(d,a.proxy(function(a){this.open_node(c,!1,0),this.select_node(this._data.core.selected),this.trigger("refresh_node",{node:b,nodes:a})},this))},set_id:function(b,c){if(b=this.get_node(b),!b||"#"===b.id)return!1;var d,e,f=this._model.data;for(c=c.toString(),f[b.parent].children[a.inArray(b.id,f[b.parent].children)]=c,d=0,e=b.parents.length;e>d;d++)f[b.parents[d]].children_d[a.inArray(b.id,f[b.parents[d]].children_d)]=c;for(d=0,e=b.children.length;e>d;d++)f[b.children[d]].parent=c;for(d=0,e=b.children_d.length;e>d;d++)f[b.children_d[d]].parents[a.inArray(b.id,f[b.children_d[d]].parents)]=c;return d=a.inArray(b.id,this._data.core.selected),-1!==d&&(this._data.core.selected[d]=c),d=this.get_node(b.id,!0),d&&d.attr("id",c),delete f[b.id],b.id=c,f[c]=b,!0},get_text:function(a){return a=this.get_node(a),a&&"#"!==a.id?a.text:!1},set_text:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.set_text(b[d],c);return!0}return b=this.get_node(b),b&&"#"!==b.id?(b.text=c,this.get_node(b,!0).length&&this.redraw_node(b.id),this.trigger("set_text",{obj:b,text:c}),!0):!1},get_json:function(b,c,d){if(b=this.get_node(b||"#"),!b)return!1;c&&c.flat&&!d&&(d=[]);var e={id:b.id,text:b.text,icon:this.get_icon(b),li_attr:a.extend(!0,{},b.li_attr),a_attr:a.extend(!0,{},b.a_attr),state:{},data:c&&c.no_data?!1:a.extend(!0,{},b.data)},f,g;if(c&&c.flat?e.parent=b.parent:e.children=[],!c||!c.no_state)for(f in b.state)b.state.hasOwnProperty(f)&&(e.state[f]=b.state[f]);if(c&&c.no_id&&(delete e.id,e.li_attr&&e.li_attr.id&&delete e.li_attr.id,e.a_attr&&e.a_attr.id&&delete e.a_attr.id),c&&c.flat&&"#"!==b.id&&d.push(e),!c||!c.no_children)for(f=0,g=b.children.length;g>f;f++)c&&c.flat?this.get_json(b.children[f],c,d):e.children.push(this.get_json(b.children[f],c));return c&&c.flat?d:"#"===b.id?e.children:e},create_node:function(c,d,e,f,g){if(null===c&&(c="#"),c=this.get_node(c),!c)return!1;if(e=e===b?"last":e,!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(c))return this.load_node(c,function(){this.create_node(c,d,e,f,!0)});d||(d={text:this.get_string("New node")}),"string"==typeof d&&(d={text:d}),d.text===b&&(d.text=this.get_string("New node"));var h,i,j,k;switch("#"===c.id&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":h=this.get_node(c.parent),e=a.inArray(c.id,h.children),c=h;break;case"after":h=this.get_node(c.parent),e=a.inArray(c.id,h.children)+1,c=h;break;case"inside":case"first":e=0;break;case"last":e=c.children.length;break;default:e||(e=0)}if(e>c.children.length&&(e=c.children.length),d.id||(d.id=!0),!this.check("create_node",d,c,e))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(d.id===!0&&delete d.id,d=this._parse_model_from_json(d,c.id,c.parents.concat()),!d)return!1;for(h=this.get_node(d),i=[],i.push(d),i=i.concat(h.children_d),this.trigger("model",{nodes:i,parent:c.id}),c.children_d=c.children_d.concat(i),j=0,k=c.parents.length;k>j;j++)this._model.data[c.parents[j]].children_d=this._model.data[c.parents[j]].children_d.concat(i);for(d=h,h=[],j=0,k=c.children.length;k>j;j++)h[j>=e?j+1:j]=c.children[j];return h[e]=d.id,c.children=h,this.redraw_node(c,!0),f&&f.call(this,this.get_node(d)),this.trigger("create_node",{node:this.get_node(d),parent:c.id,position:e}),d.id},rename_node:function(b,c){var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.rename_node(b[d],c);return!0}return b=this.get_node(b),b&&"#"!==b.id?(f=b.text,this.check("rename_node",b,this.get_parent(b),c)?(this.set_text(b,c),this.trigger("rename_node",{node:b,text:c,old:f}),!0):(this.settings.core.error.call(this,this._data.core.last_error),!1)):!1},delete_node:function(b){var c,d,e,f,g,h,i,j,k,l;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.delete_node(b[c]);return!0}if(b=this.get_node(b),!b||"#"===b.id)return!1;if(e=this.get_node(b.parent),f=a.inArray(b.id,e.children),l=!1,!this.check("delete_node",b,e,f))return this.settings.core.error.call(this,this._data.core.last_error),!1;for(-1!==f&&(e.children=a.vakata.array_remove(e.children,f)),g=b.children_d.concat([]),g.push(b.id),j=0,k=g.length;k>j;j++){for(h=0,i=b.parents.length;i>h;h++)f=a.inArray(g[j],this._model.data[b.parents[h]].children_d),-1!==f&&(this._model.data[b.parents[h]].children_d=a.vakata.array_remove(this._model.data[b.parents[h]].children_d,f));this._model.data[g[j]].state.selected&&(l=!0,f=a.inArray(g[j],this._data.core.selected),-1!==f&&(this._data.core.selected=a.vakata.array_remove(this._data.core.selected,f)))}for(this.trigger("delete_node",{node:b,parent:e.id}),l&&this.trigger("changed",{action:"delete_node",node:b,selected:this._data.core.selected,parent:e.id}),j=0,k=g.length;k>j;j++)delete this._model.data[g[j]];return this.redraw_node(e,!0),!0},check:function(b,c,d,e,f){c=c&&c.id?c:this.get_node(c),d=d&&d.id?d:this.get_node(d);var g=b.match(/^move_node|copy_node|create_node$/i)?d:c,h=this.settings.core.check_callback;return"move_node"!==b&&"copy_node"!==b||f&&f.is_multi||c.id!==d.id&&a.inArray(c.id,d.children)!==e&&-1===a.inArray(d.id,c.children_d)?(g&&g.data&&(g=g.data),g&&g.functions&&(g.functions[b]===!1||g.functions[b]===!0)?(g.functions[b]===!1&&(this._data.core.last_error={error:"check",plugin:"core",id:"core_02",reason:"Node data prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})}),g.functions[b]):h===!1||a.isFunction(h)&&h.call(this,b,c,d,e,f)===!1||h&&h[b]===!1?(this._data.core.last_error={error:"check",plugin:"core",id:"core_03",reason:"User config for core.check_callback prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1):!0):(this._data.core.last_error={error:"check",plugin:"core",id:"core_01",reason:"Moving parent inside child",data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1)},last_error:function(){return this._data.core.last_error},move_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t,u,v,w;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.move_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(r=this.move_node(c[j],d,e,f,g,!1,i))&&(d=r,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||"#"===c.id)return!1;if(l=(c.parent||"#").toString(),n=e.toString().match(/^(before|after)$/)&&"#"!==d.id?this.get_node(d.parent):d,o=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),p=!o||!o._id||this._id!==o._id,m=o&&o._id&&l&&o._model.data[l]&&o._model.data[l].children?a.inArray(c.id,o._model.data[l].children):-1,p)return(r=this.copy_node(c,d,e,f,g,!1,i))?(o&&o.delete_node(c),r):!1;switch("#"===d.id&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,n.children);break;case"after":e=a.inArray(d.id,n.children)+1;break;case"inside":case"first":e=0;break;case"last":e=n.children.length;break;default:e||(e=0)}if(e>n.children.length&&(e=n.children.length),!this.check("move_node",c,n,e,{core:!0,origin:i,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(c.parent===n.id){for(q=n.children.concat(),r=a.inArray(c.id,q),-1!==r&&(q=a.vakata.array_remove(q,r),e>r&&e--),r=[],s=0,t=q.length;t>s;s++)r[s>=e?s+1:s]=q[s];r[e]=c.id,n.children=r,this._node_changed(n.id),this.redraw("#"===n.id)}else{for(r=c.children_d.concat(),r.push(c.id),s=0,t=c.parents.length;t>s;s++){for(q=[],w=o._model.data[c.parents[s]].children_d,u=0,v=w.length;v>u;u++)-1===a.inArray(w[u],r)&&q.push(w[u]);o._model.data[c.parents[s]].children_d=q}for(o._model.data[l].children=a.vakata.array_remove_item(o._model.data[l].children,c.id),s=0,t=n.parents.length;t>s;s++)this._model.data[n.parents[s]].children_d=this._model.data[n.parents[s]].children_d.concat(r);for(q=[],s=0,t=n.children.length;t>s;s++)q[s>=e?s+1:s]=n.children[s];for(q[e]=c.id,n.children=q,n.children_d.push(c.id),n.children_d=n.children_d.concat(c.children_d),c.parent=n.id,r=n.parents.concat(),r.unshift(n.id),w=c.parents.length,c.parents=r,r=r.concat(),s=0,t=c.children_d.length;t>s;s++)this._model.data[c.children_d[s]].parents=this._model.data[c.children_d[s]].parents.slice(0,-1*w),Array.prototype.push.apply(this._model.data[c.children_d[s]].parents,r);("#"===l||"#"===n.id)&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||(this._node_changed(l),this._node_changed(n.id)),h||this.redraw()}return f&&f.call(this,c,n,e),this.trigger("move_node",{node:c,parent:n.id,position:e,old_parent:l,old_position:m,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id,old_instance:o,new_instance:this}),c.id},copy_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.copy_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(m=this.copy_node(c[j],d,e,f,g,!0,i))&&(d=m,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||"#"===c.id)return!1;switch(q=(c.parent||"#").toString(),r=e.toString().match(/^(before|after)$/)&&"#"!==d.id?this.get_node(d.parent):d,s=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),t=!s||!s._id||this._id!==s._id,"#"===d.id&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,r.children);break;case"after":e=a.inArray(d.id,r.children)+1;break;case"inside":case"first":e=0;break;case"last":e=r.children.length;break;default:e||(e=0)}if(e>r.children.length&&(e=r.children.length),!this.check("copy_node",c,r,e,{core:!0,origin:i,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(p=s?s.get_json(c,{no_id:!0,no_data:!0,no_state:!0}):c,!p)return!1;if(p.id===!0&&delete p.id,p=this._parse_model_from_json(p,r.id,r.parents.concat()),!p)return!1;for(m=this.get_node(p),c&&c.state&&c.state.loaded===!1&&(m.state.loaded=!1),l=[],l.push(p),l=l.concat(m.children_d),this.trigger("model",{nodes:l,parent:r.id}),n=0,o=r.parents.length;o>n;n++)this._model.data[r.parents[n]].children_d=this._model.data[r.parents[n]].children_d.concat(l);for(l=[],n=0,o=r.children.length;o>n;n++)l[n>=e?n+1:n]=r.children[n];return l[e]=m.id,r.children=l,r.children_d.push(m.id),r.children_d=r.children_d.concat(m.children_d),"#"===r.id&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||this._node_changed(r.id),h||this.redraw("#"===r.id),f&&f.call(this,m,r,e),this.trigger("copy_node",{node:m,original:c,parent:r.id,position:e,old_parent:q,old_position:s&&s._id&&q&&s._model.data[q]&&s._model.data[q].children?a.inArray(c.id,s._model.data[q].children):-1,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id,old_instance:s,new_instance:this}),m.id},cut:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&"#"!==g.id&&c.push(g);return c.length?(d=c,f=this,e="move_node",void this.trigger("cut",{node:b})):!1},copy:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&"#"!==g.id&&c.push(g);return c.length?(d=c,f=this,e="copy_node",void this.trigger("copy",{node:b})):!1},get_buffer:function(){return{mode:e,node:d,inst:f}},can_paste:function(){return e!==!1&&d!==!1},paste:function(a,b){return a=this.get_node(a),a&&e&&e.match(/^(copy_node|move_node)$/)&&d?(this[e](d,a,b,!1,!1,!1,f)&&this.trigger("paste",{parent:a.id,node:d,mode:e}),d=!1,e=!1,void(f=!1)):!1},clear_buffer:function(){d=!1,e=!1,f=!1,this.trigger("clear_buffer")},edit:function(b,c){var d,e,f,g,h,i,j,k,l;return(b=this.get_node(b))?this.settings.core.check_callback===!1?(this._data.core.last_error={error:"check",plugin:"core",id:"core_07",reason:"Could not edit node because of check_callback"},this.settings.core.error.call(this,this._data.core.last_error),!1):(l=b,c="string"==typeof c?c:b.text,this.set_text(b,""),b=this._open_to(b),l.text=c,d=this._data.core.rtl,e=this.element.width(),f=b.children(".jstree-anchor"),g=a("<span>"),h=c,i=a("<div />",{css:{position:"absolute",top:"-200px",left:d?"0px":"-1000px",visibility:"hidden"}}).appendTo("body"),j=a("<input />",{value:h,"class":"jstree-rename-input",css:{padding:"0",border:"1px solid silver","box-sizing":"border-box",display:"inline-block",height:this._data.core.li_height+"px",lineHeight:this._data.core.li_height+"px",width:"150px"},blur:a.proxy(function(){var c=g.children(".jstree-rename-input"),d=c.val();""===d&&(d=h),i.remove(),g.replaceWith(f),g.remove(),this.set_text(b,h),this.rename_node(b,a("<div></div>").text(d)[this.settings.core.force_text?"text":"html"]())===!1&&this.set_text(b,h)},this),keydown:function(a){var b=a.which;27===b&&(this.value=h),(27===b||13===b||37===b||38===b||39===b||40===b||32===b)&&a.stopImmediatePropagation(),(27===b||13===b)&&(a.preventDefault(),this.blur())},click:function(a){a.stopImmediatePropagation()},mousedown:function(a){a.stopImmediatePropagation()},keyup:function(a){j.width(Math.min(i.text("pW"+this.value).width(),e))},keypress:function(a){return 13===a.which?!1:void 0}}),k={fontFamily:f.css("fontFamily")||"",fontSize:f.css("fontSize")||"",fontWeight:f.css("fontWeight")||"",fontStyle:f.css("fontStyle")||"",fontStretch:f.css("fontStretch")||"",fontVariant:f.css("fontVariant")||"",letterSpacing:f.css("letterSpacing")||"",wordSpacing:f.css("wordSpacing")||""},g.attr("class",f.attr("class")).append(f.contents().clone()).append(j),f.replaceWith(g),i.css(k),void j.css(k).width(Math.min(i.text("pW"+j[0].value).width(),e))[0].select()):!1},set_theme:function(b,c){if(!b)return!1;if(c===!0){var d=this.settings.core.themes.dir;d||(d=a.jstree.path+"/themes"),c=d+"/"+b+"/style.css"}c&&-1===a.inArray(c,g)&&(a("head").append('<link rel="stylesheet" href="'+c+'" type="text/css" />'),g.push(c)),this._data.core.themes.name&&this.element.removeClass("jstree-"+this._data.core.themes.name),this._data.core.themes.name=b,this.element.addClass("jstree-"+b),this.element[this.settings.core.themes.responsive?"addClass":"removeClass"]("jstree-"+b+"-responsive"),this.trigger("set_theme",{theme:b})},get_theme:function(){return this._data.core.themes.name},set_theme_variant:function(a){this._data.core.themes.variant&&this.element.removeClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant),this._data.core.themes.variant=a,a&&this.element.addClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant)},get_theme_variant:function(){return this._data.core.themes.variant},show_stripes:function(){this._data.core.themes.stripes=!0,this.get_container_ul().addClass("jstree-striped")},hide_stripes:function(){this._data.core.themes.stripes=!1,this.get_container_ul().removeClass("jstree-striped")},toggle_stripes:function(){this._data.core.themes.stripes?this.hide_stripes():this.show_stripes()},show_dots:function(){this._data.core.themes.dots=!0,this.get_container_ul().removeClass("jstree-no-dots")},hide_dots:function(){this._data.core.themes.dots=!1,this.get_container_ul().addClass("jstree-no-dots")},toggle_dots:function(){this._data.core.themes.dots?this.hide_dots():this.show_dots()},show_icons:function(){this._data.core.themes.icons=!0,this.get_container_ul().removeClass("jstree-no-icons")},hide_icons:function(){this._data.core.themes.icons=!1,this.get_container_ul().addClass("jstree-no-icons")},toggle_icons:function(){this._data.core.themes.icons?this.hide_icons():this.show_icons()},set_icon:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.set_icon(c[e],d);return!0}return c=this.get_node(c),c&&"#"!==c.id?(h=c.icon,c.icon=d===!0||null===d||d===b||""===d?!0:d,g=this.get_node(c,!0).children(".jstree-anchor").children(".jstree-themeicon"),d===!1?this.hide_icon(c):d===!0||null===d||d===b||""===d?(g.removeClass("jstree-themeicon-custom "+h).css("background","").removeAttr("rel"),h===!1&&this.show_icon(c)):-1===d.indexOf("/")&&-1===d.indexOf(".")?(g.removeClass(h).css("background",""),g.addClass(d+" jstree-themeicon-custom").attr("rel",d),h===!1&&this.show_icon(c)):(g.removeClass(h).css("background",""),g.addClass("jstree-themeicon-custom").css("background","url('"+d+"') center center no-repeat").attr("rel",d),h===!1&&this.show_icon(c)),!0):!1},get_icon:function(a){return a=this.get_node(a),a&&"#"!==a.id?a.icon:!1},hide_icon:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.hide_icon(b[c]);return!0}return b=this.get_node(b),b&&"#"!==b?(b.icon=!1,this.get_node(b,!0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"),!0):!1},show_icon:function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.show_icon(b[c]);return!0}return b=this.get_node(b),b&&"#"!==b?(e=this.get_node(b,!0),b.icon=e.length?e.children(".jstree-anchor").children(".jstree-themeicon").attr("rel"):!0,b.icon||(b.icon=!0),e.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"),!0):!1}},a.vakata={},a.vakata.attributes=function(b,c){b=a(b)[0];var d=c?{}:[];return b&&b.attributes&&a.each(b.attributes,function(b,e){-1===a.inArray(e.name.toLowerCase(),["style","contenteditable","hasfocus","tabindex"])&&null!==e.value&&""!==a.trim(e.value)&&(c?d[e.name]=e.value:d.push(e.name))}),d},a.vakata.array_unique=function(a){var b=[],c,d,e;for(c=0,e=a.length;e>c;c++){for(d=0;c>=d;d++)if(a[c]===a[d])break;d===c&&b.push(a[c])}return b},a.vakata.array_remove=function(a,b,c){var d=a.slice((c||b)+1||a.length);return a.length=0>b?a.length+b:b,a.push.apply(a,d),a},a.vakata.array_remove_item=function(b,c){var d=a.inArray(c,b);return-1!==d?a.vakata.array_remove(b,d):b};var m=i.createElement("I");m.className="jstree-icon jstree-checkbox",m.setAttribute("role","presentation"),a.jstree.defaults.checkbox={visible:!0,three_state:!0,whole_node:!0,keep_selected_style:!0,cascade:"",tie_selection:!0},a.jstree.plugins.checkbox=function(b,c){this.bind=function(){c.bind.call(this),this._data.checkbox.uto=!1,this._data.checkbox.selected=[],this.settings.checkbox.three_state&&(this.settings.checkbox.cascade="up+down+undetermined"),this.element.on("init.jstree",a.proxy(function(){this._data.checkbox.visible=this.settings.checkbox.visible,this.settings.checkbox.keep_selected_style||this.element.addClass("jstree-checkbox-no-clicked"),this.settings.checkbox.tie_selection&&this.element.addClass("jstree-checkbox-selection")
},this)).on("loading.jstree",a.proxy(function(){this[this._data.checkbox.visible?"show_checkboxes":"hide_checkboxes"]()},this)),-1!==this.settings.checkbox.cascade.indexOf("undetermined")&&this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree",a.proxy(function(){this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)},this)),this.settings.checkbox.tie_selection||this.element.on("model.jstree",a.proxy(function(a,b){var c=this._model.data,d=c[b.parent],e=b.nodes,f,g;for(f=0,g=e.length;g>f;f++)c[e[f]].state.checked=c[e[f]].original&&c[e[f]].original.state&&c[e[f]].original.state.checked,c[e[f]].state.checked&&this._data.checkbox.selected.push(e[f])},this)),(-1!==this.settings.checkbox.cascade.indexOf("up")||-1!==this.settings.checkbox.cascade.indexOf("down"))&&this.element.on("model.jstree",a.proxy(function(b,c){var d=this._model.data,e=d[c.parent],f=c.nodes,g=[],h,i,j,k,l,m,n=this.settings.checkbox.cascade,o=this.settings.checkbox.tie_selection;if(-1!==n.indexOf("down"))if(e.state[o?"selected":"checked"]){for(i=0,j=f.length;j>i;i++)d[f[i]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(f)}else for(i=0,j=f.length;j>i;i++)if(d[f[i]].state[o?"selected":"checked"]){for(k=0,l=d[f[i]].children_d.length;l>k;k++)d[d[f[i]].children_d[k]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(d[f[i]].children_d)}if(-1!==n.indexOf("up")){for(i=0,j=e.children_d.length;j>i;i++)d[e.children_d[i]].children.length||g.push(d[e.children_d[i]].parent);for(g=a.vakata.array_unique(g),k=0,l=g.length;l>k;k++){e=d[g[k]];while(e&&"#"!==e.id){for(h=0,i=0,j=e.children.length;j>i;i++)h+=d[e.children[i]].state[o?"selected":"checked"];if(h!==j)break;e.state[o?"selected":"checked"]=!0,this._data[o?"core":"checkbox"].selected.push(e.id),m=this.get_node(e,!0),m&&m.length&&m.attr("aria-selected",!0).children(".jstree-anchor").addClass(o?"jstree-clicked":"jstree-checked"),e=this.get_node(e.parent)}}}this._data[o?"core":"checkbox"].selected=a.vakata.array_unique(this._data[o?"core":"checkbox"].selected)},this)).on(this.settings.checkbox.tie_selection?"select_node.jstree":"check_node.jstree",a.proxy(function(b,c){var d=c.node,e=this._model.data,f=this.get_node(d.parent),g=this.get_node(d,!0),h,i,j,k,l=this.settings.checkbox.cascade,m=this.settings.checkbox.tie_selection;if(-1!==l.indexOf("down"))for(this._data[m?"core":"checkbox"].selected=a.vakata.array_unique(this._data[m?"core":"checkbox"].selected.concat(d.children_d)),h=0,i=d.children_d.length;i>h;h++)k=e[d.children_d[h]],k.state[m?"selected":"checked"]=!0,k&&k.original&&k.original.state&&k.original.state.undetermined&&(k.original.state.undetermined=!1);if(-1!==l.indexOf("up"))while(f&&"#"!==f.id){for(j=0,h=0,i=f.children.length;i>h;h++)j+=e[f.children[h]].state[m?"selected":"checked"];if(j!==i)break;f.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(f.id),k=this.get_node(f,!0),k&&k.length&&k.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),f=this.get_node(f.parent)}-1!==l.indexOf("down")&&g.length&&g.find(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked").parent().attr("aria-selected",!0)},this)).on(this.settings.checkbox.tie_selection?"deselect_all.jstree":"uncheck_all.jstree",a.proxy(function(a,b){var c=this.get_node("#"),d=this._model.data,e,f,g;for(e=0,f=c.children_d.length;f>e;e++)g=d[c.children_d[e]],g&&g.original&&g.original.state&&g.original.state.undetermined&&(g.original.state.undetermined=!1)},this)).on(this.settings.checkbox.tie_selection?"deselect_node.jstree":"uncheck_node.jstree",a.proxy(function(b,c){var d=c.node,e=this.get_node(d,!0),f,g,h,i=this.settings.checkbox.cascade,j=this.settings.checkbox.tie_selection;if(d&&d.original&&d.original.state&&d.original.state.undetermined&&(d.original.state.undetermined=!1),-1!==i.indexOf("down"))for(f=0,g=d.children_d.length;g>f;f++)h=this._model.data[d.children_d[f]],h.state[j?"selected":"checked"]=!1,h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1);if(-1!==i.indexOf("up"))for(f=0,g=d.parents.length;g>f;f++)h=this._model.data[d.parents[f]],h.state[j?"selected":"checked"]=!1,h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1),h=this.get_node(d.parents[f],!0),h&&h.length&&h.attr("aria-selected",!1).children(".jstree-anchor").removeClass(j?"jstree-clicked":"jstree-checked");for(h=[],f=0,g=this._data[j?"core":"checkbox"].selected.length;g>f;f++)-1!==i.indexOf("down")&&-1!==a.inArray(this._data[j?"core":"checkbox"].selected[f],d.children_d)||-1!==i.indexOf("up")&&-1!==a.inArray(this._data[j?"core":"checkbox"].selected[f],d.parents)||h.push(this._data[j?"core":"checkbox"].selected[f]);this._data[j?"core":"checkbox"].selected=a.vakata.array_unique(h),-1!==i.indexOf("down")&&e.length&&e.find(".jstree-anchor").removeClass(j?"jstree-clicked":"jstree-checked").parent().attr("aria-selected",!1)},this)),-1!==this.settings.checkbox.cascade.indexOf("up")&&this.element.on("delete_node.jstree",a.proxy(function(a,b){var c=this.get_node(b.parent),d=this._model.data,e,f,g,h,i=this.settings.checkbox.tie_selection;while(c&&"#"!==c.id){for(g=0,e=0,f=c.children.length;f>e;e++)g+=d[c.children[e]].state[i?"selected":"checked"];if(g!==f)break;c.state[i?"selected":"checked"]=!0,this._data[i?"core":"checkbox"].selected.push(c.id),h=this.get_node(c,!0),h&&h.length&&h.attr("aria-selected",!0).children(".jstree-anchor").addClass(i?"jstree-clicked":"jstree-checked"),c=this.get_node(c.parent)}},this)).on("move_node.jstree",a.proxy(function(b,c){var d=c.is_multi,e=c.old_parent,f=this.get_node(c.parent),g=this._model.data,h,i,j,k,l,m=this.settings.checkbox.tie_selection;if(!d){h=this.get_node(e);while(h&&"#"!==h.id){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(i!==k)break;h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),h=this.get_node(h.parent)}}h=f;while(h&&"#"!==h.id){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(i===k)h.state[m?"selected":"checked"]||(h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"));else{if(!h.state[m?"selected":"checked"])break;h.state[m?"selected":"checked"]=!1,this._data[m?"core":"checkbox"].selected=a.vakata.array_remove_item(this._data[m?"core":"checkbox"].selected,h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(m?"jstree-clicked":"jstree-checked")}h=this.get_node(h.parent)}},this))},this._undetermined=function(){var b,c,d=this._model.data,e=this.settings.checkbox.tie_selection,f=this._data[e?"core":"checkbox"].selected,g=[],h=this;for(b=0,c=f.length;c>b;b++)d[f[b]]&&d[f[b]].parents&&(g=g.concat(d[f[b]].parents));for(this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function(){var a=h.get_node(this),e;if(a.state.loaded)for(b=0,c=a.children_d.length;c>b;b++)e=d[a.children_d[b]],!e.state.loaded&&e.original&&e.original.state&&e.original.state.undetermined&&e.original.state.undetermined===!0&&(g.push(e.id),g=g.concat(e.parents));else a.original&&a.original.state&&a.original.state.undetermined&&a.original.state.undetermined===!0&&(g.push(a.id),g=g.concat(a.parents))}),g=a.vakata.array_unique(g),g=a.vakata.array_remove_item(g,"#"),this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"),b=0,c=g.length;c>b;b++)d[g[b]].state[e?"selected":"checked"]||(f=this.get_node(g[b],!0),f&&f.length&&f.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined"))},this.redraw_node=function(b,d,e,f){if(b=c.redraw_node.apply(this,arguments)){var g,h,i=null;for(g=0,h=b.childNodes.length;h>g;g++)if(b.childNodes[g]&&b.childNodes[g].className&&-1!==b.childNodes[g].className.indexOf("jstree-anchor")){i=b.childNodes[g];break}i&&(!this.settings.checkbox.tie_selection&&this._model.data[b.id].state.checked&&(i.className+=" jstree-checked"),i.insertBefore(m.cloneNode(!1),i.childNodes[0]))}return e||-1===this.settings.checkbox.cascade.indexOf("undetermined")||(this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)),b},this.show_checkboxes=function(){this._data.core.themes.checkboxes=!0,this.get_container_ul().removeClass("jstree-no-checkboxes")},this.hide_checkboxes=function(){this._data.core.themes.checkboxes=!1,this.get_container_ul().addClass("jstree-no-checkboxes")},this.toggle_checkboxes=function(){this._data.core.themes.checkboxes?this.hide_checkboxes():this.show_checkboxes()},this.is_undetermined=function(b){b=this.get_node(b);var c=this.settings.checkbox.cascade,d,e,f=this.settings.checkbox.tie_selection,g=this._data[f?"core":"checkbox"].selected,h=this._model.data;if(!b||b.state[f?"selected":"checked"]===!0||-1===c.indexOf("undetermined")||-1===c.indexOf("down")&&-1===c.indexOf("up"))return!1;if(!b.state.loaded&&b.original.state.undetermined===!0)return!0;for(d=0,e=b.children_d.length;e>d;d++)if(-1!==a.inArray(b.children_d[d],g)||!h[b.children_d[d]].state.loaded&&h[b.children_d[d]].original.state.undetermined)return!0;return!1},this.activate_node=function(b,d){return this.settings.checkbox.tie_selection&&(this.settings.checkbox.whole_node||a(d.target).hasClass("jstree-checkbox"))&&(d.ctrlKey=!0),this.settings.checkbox.tie_selection||!this.settings.checkbox.whole_node&&!a(d.target).hasClass("jstree-checkbox")?c.activate_node.call(this,b,d):this.is_disabled(b)?!1:(this.is_checked(b)?this.uncheck_node(b,d):this.check_node(b,d),void this.trigger("activate_node",{node:this.get_node(b)}))},this.check_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.select_node(b,!1,!0,c);var d,e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.check_node(b[e],c);return!0}return b=this.get_node(b),b&&"#"!==b.id?(d=this.get_node(b,!0),void(b.state.checked||(b.state.checked=!0,this._data.checkbox.selected.push(b.id),d&&d.length&&d.children(".jstree-anchor").addClass("jstree-checked"),this.trigger("check_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.uncheck_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.deselect_node(b,!1,c);var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.uncheck_node(b[d],c);return!0}return b=this.get_node(b),b&&"#"!==b.id?(f=this.get_node(b,!0),void(b.state.checked&&(b.state.checked=!1,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,b.id),f.length&&f.children(".jstree-anchor").removeClass("jstree-checked"),this.trigger("uncheck_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.check_all=function(){if(this.settings.checkbox.tie_selection)return this.select_all();var a=this._data.checkbox.selected.concat([]),b,c;for(this._data.checkbox.selected=this._model.data["#"].children_d.concat(),b=0,c=this._data.checkbox.selected.length;c>b;b++)this._model.data[this._data.checkbox.selected[b]]&&(this._model.data[this._data.checkbox.selected[b]].state.checked=!0);this.redraw(!0),this.trigger("check_all",{selected:this._data.checkbox.selected})},this.uncheck_all=function(){if(this.settings.checkbox.tie_selection)return this.deselect_all();var a=this._data.checkbox.selected.concat([]),b,c;for(b=0,c=this._data.checkbox.selected.length;c>b;b++)this._model.data[this._data.checkbox.selected[b]]&&(this._model.data[this._data.checkbox.selected[b]].state.checked=!1);this._data.checkbox.selected=[],this.element.find(".jstree-checked").removeClass("jstree-checked"),this.trigger("uncheck_all",{selected:this._data.checkbox.selected,node:a})},this.is_checked=function(a){return this.settings.checkbox.tie_selection?this.is_selected(a):(a=this.get_node(a),a&&"#"!==a.id?a.state.checked:!1)},this.get_checked=function(b){return this.settings.checkbox.tie_selection?this.get_selected(b):b?a.map(this._data.checkbox.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.checkbox.selected},this.get_top_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_top_selected(b);var c=this.get_checked(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},this.get_bottom_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_bottom_selected(b);var c=this.get_checked(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},this.load_node=function(b,d){var e,f,g,h,i,j;if(!a.isArray(b)&&!this.settings.checkbox.tie_selection&&(j=this.get_node(b),j&&j.state.loaded))for(e=0,f=j.children_d.length;f>e;e++)this._model.data[j.children_d[e]].state.checked&&(i=!0,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,j.children_d[e]));return c.load_node.apply(this,arguments)},this.get_state=function(){var a=c.get_state.apply(this,arguments);return this.settings.checkbox.tie_selection?a:(a.checkbox=this._data.checkbox.selected.slice(),a)},this.set_state=function(b,d){var e=c.set_state.apply(this,arguments);if(e&&b.checkbox){if(!this.settings.checkbox.tie_selection){this.uncheck_all();var f=this;a.each(b.checkbox,function(a,b){f.check_node(b)})}return delete b.checkbox,this.set_state(b,d),!1}return e}},a.jstree.defaults.contextmenu={select_node:!0,show_at_node:!0,items:function(b,c){return{create:{separator_before:!1,separator_after:!0,_disabled:!1,label:"Create",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.create_node(d,{},"last",function(a){setTimeout(function(){c.edit(a)},0)})}},rename:{separator_before:!1,separator_after:!1,_disabled:!1,label:"Rename",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.edit(d)}},remove:{separator_before:!1,icon:!1,separator_after:!1,_disabled:!1,label:"Delete",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.delete_node(c.is_selected(d)?c.get_selected():d)}},ccp:{separator_before:!0,icon:!1,separator_after:!1,label:"Edit",action:!1,submenu:{cut:{separator_before:!1,separator_after:!1,label:"Cut",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.cut(c.is_selected(d)?c.get_top_selected():d)}},copy:{separator_before:!1,icon:!1,separator_after:!1,label:"Copy",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.copy(c.is_selected(d)?c.get_top_selected():d)}},paste:{separator_before:!1,icon:!1,_disabled:function(b){return!a.jstree.reference(b.reference).can_paste()},separator_after:!1,label:"Paste",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.paste(d)}}}}}}},a.jstree.plugins.contextmenu=function(c,d){this.bind=function(){d.bind.call(this);var b=0,c=null,e,f;this.element.on("contextmenu.jstree",".jstree-anchor",a.proxy(function(a,d){a.preventDefault(),b=a.ctrlKey?+new Date:0,(d||c)&&(b=+new Date+1e4),c&&clearTimeout(c),this.is_loading(a.currentTarget)||this.show_contextmenu(a.currentTarget,a.pageX,a.pageY,a)},this)).on("click.jstree",".jstree-anchor",a.proxy(function(c){this._data.contextmenu.visible&&(!b||+new Date-b>250)&&a.vakata.context.hide(),b=0},this)).on("touchstart.jstree",".jstree-anchor",function(b){b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(e=b.pageX,f=b.pageY,c=setTimeout(function(){a(b.currentTarget).trigger("contextmenu",!0)},750))}).on("touchmove.vakata.jstree",function(a){c&&a.originalEvent&&a.originalEvent.changedTouches&&a.originalEvent.changedTouches[0]&&(Math.abs(e-a.pageX)>50||Math.abs(f-a.pageY)>50)&&clearTimeout(c)}).on("touchend.vakata.jstree",function(a){c&&clearTimeout(c)}),a(i).on("context_hide.vakata.jstree",a.proxy(function(){this._data.contextmenu.visible=!1},this))},this.teardown=function(){this._data.contextmenu.visible&&a.vakata.context.hide(),d.teardown.call(this)},this.show_contextmenu=function(c,d,e,f){if(c=this.get_node(c),!c||"#"===c.id)return!1;var g=this.settings.contextmenu,h=this.get_node(c,!0),i=h.children(".jstree-anchor"),j=!1,k=!1;(g.show_at_node||d===b||e===b)&&(j=i.offset(),d=j.left,e=j.top+this._data.core.li_height),this.settings.contextmenu.select_node&&!this.is_selected(c)&&this.activate_node(c,f),k=g.items,a.isFunction(k)&&(k=k.call(this,c,a.proxy(function(a){this._show_contextmenu(c,d,e,a)},this))),a.isPlainObject(k)&&this._show_contextmenu(c,d,e,k)},this._show_contextmenu=function(b,c,d,e){var f=this.get_node(b,!0),g=f.children(".jstree-anchor");a(i).one("context_show.vakata.jstree",a.proxy(function(b,c){var d="jstree-contextmenu jstree-"+this.get_theme()+"-contextmenu";a(c.element).addClass(d)},this)),this._data.contextmenu.visible=!0,a.vakata.context.show(g,{x:c,y:d},e),this.trigger("show_contextmenu",{node:b,x:c,y:d})}},function(a){var b=!1,c={element:!1,reference:!1,position_x:0,position_y:0,items:[],html:"",is_visible:!1};a.vakata.context={settings:{hide_onmouseleave:0,icons:!0},_trigger:function(b){a(i).triggerHandler("context_"+b+".vakata",{reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}})},_execute:function(b){return b=c.items[b],b&&(!b._disabled||a.isFunction(b._disabled)&&!b._disabled({item:b,reference:c.reference,element:c.element}))&&b.action?b.action.call(null,{item:b,reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}}):!1},_parse:function(b,d){if(!b)return!1;d||(c.html="",c.items=[]);var e="",f=!1,g;return d&&(e+="<ul>"),a.each(b,function(b,d){return d?(c.items.push(d),!f&&d.separator_before&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>"),f=!1,e+="<li class='"+(d._class||"")+(d._disabled===!0||a.isFunction(d._disabled)&&d._disabled({item:d,reference:c.reference,element:c.element})?" vakata-contextmenu-disabled ":"")+"' "+(d.shortcut?" data-shortcut='"+d.shortcut+"' ":"")+">",e+="<a href='#' rel='"+(c.items.length-1)+"'>",a.vakata.context.settings.icons&&(e+="<i ",d.icon&&(e+=-1!==d.icon.indexOf("/")||-1!==d.icon.indexOf(".")?" style='background:url(\""+d.icon+"\") center center no-repeat' ":" class='"+d.icon+"' "),e+="></i><span class='vakata-contextmenu-sep'>&#160;</span>"),e+=(a.isFunction(d.label)?d.label({item:b,reference:c.reference,element:c.element}):d.label)+(d.shortcut?' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-'+d.shortcut+'">'+(d.shortcut_label||"")+"</span>":"")+"</a>",d.submenu&&(g=a.vakata.context._parse(d.submenu,!0),g&&(e+=g)),e+="</li>",void(d.separator_after&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>",f=!0))):!0}),e=e.replace(/<li class\='vakata-context-separator'\><\/li\>$/,""),d&&(e+="</ul>"),d||(c.html=e,a.vakata.context._trigger("parse")),e.length>10?e:!1},_show_submenu:function(c){if(c=a(c),c.length&&c.children("ul").length){var d=c.children("ul"),e=c.offset().left+c.outerWidth(),f=c.offset().top,g=d.width(),h=d.height(),i=a(window).width()+a(window).scrollLeft(),j=a(window).height()+a(window).scrollTop();b?c[e-(g+10+c.outerWidth())<0?"addClass":"removeClass"]("vakata-context-left"):c[e+g+10>i?"addClass":"removeClass"]("vakata-context-right"),f+h+10>j&&d.css("bottom","-1px"),d.show()}},show:function(d,e,f){var g,h,i,j,k,l,m,n,o=!0;switch(c.element&&c.element.length&&c.element.width(""),o){case!e&&!d:return!1;case!!e&&!!d:c.reference=d,c.position_x=e.x,c.position_y=e.y;break;case!e&&!!d:c.reference=d,g=d.offset(),c.position_x=g.left+d.outerHeight(),c.position_y=g.top;break;case!!e&&!d:c.position_x=e.x,c.position_y=e.y}d&&!f&&a(d).data("vakata_contextmenu")&&(f=a(d).data("vakata_contextmenu")),a.vakata.context._parse(f)&&c.element.html(c.html),c.items.length&&(c.element.appendTo("body"),h=c.element,i=c.position_x,j=c.position_y,k=h.width(),l=h.height(),m=a(window).width()+a(window).scrollLeft(),n=a(window).height()+a(window).scrollTop(),b&&(i-=h.outerWidth()-a(d).outerWidth(),i<a(window).scrollLeft()+20&&(i=a(window).scrollLeft()+20)),i+k+20>m&&(i=m-(k+20)),j+l+20>n&&(j=n-(l+20)),c.element.css({left:i,top:j}).show().find("a").first().focus().parent().addClass("vakata-context-hover"),c.is_visible=!0,a.vakata.context._trigger("show"))},hide:function(){c.is_visible&&(c.element.hide().find("ul").hide().end().find(":focus").blur().end().detach(),c.is_visible=!1,a.vakata.context._trigger("hide"))}},a(function(){b="rtl"===a("body").css("direction");var d=!1;c.element=a("<ul class='vakata-context'></ul>"),c.element.on("mouseenter","li",function(b){b.stopImmediatePropagation(),a.contains(this,b.relatedTarget)||(d&&clearTimeout(d),c.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(),a(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context","li").addBack().addClass("vakata-context-hover"),a.vakata.context._show_submenu(this))}).on("mouseleave","li",function(b){a.contains(this,b.relatedTarget)||a(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")}).on("mouseleave",function(b){a(this).find(".vakata-context-hover").removeClass("vakata-context-hover"),a.vakata.context.settings.hide_onmouseleave&&(d=setTimeout(function(b){return function(){a.vakata.context.hide()}}(this),a.vakata.context.settings.hide_onmouseleave))}).on("click","a",function(b){b.preventDefault(),a(this).blur().parent().hasClass("vakata-context-disabled")||a.vakata.context._execute(a(this).attr("rel"))===!1||a.vakata.context.hide()}).on("keydown","a",function(b){var d=null;switch(b.which){case 13:case 32:b.type="mouseup",b.preventDefault(),a(b.currentTarget).trigger(b);break;case 37:c.is_visible&&(c.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 38:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 39:c.is_visible&&(c.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 40:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 27:a.vakata.context.hide(),b.preventDefault()}}).on("keydown",function(a){a.preventDefault();var b=c.element.find(".vakata-contextmenu-shortcut-"+a.which).parent();b.parent().not(".vakata-context-disabled")&&b.click()}),a(i).on("mousedown.vakata.jstree",function(b){c.is_visible&&!a.contains(c.element[0],b.target)&&a.vakata.context.hide()}).on("context_show.vakata.jstree",function(a,d){c.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"),b&&c.element.addClass("vakata-context-rtl").css("direction","rtl"),c.element.find("ul").hide().end()})})}(a),a.jstree.defaults.dnd={copy:!0,open_timeout:500,is_draggable:!0,check_while_dragging:!0,always_copy:!1,inside_pos:0,drag_selection:!0,touch:!0,large_drop_target:!1,large_drag_target:!1},a.jstree.plugins.dnd=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("mousedown.jstree touchstart.jstree",this.settings.dnd.large_drag_target?".jstree-node":".jstree-anchor",a.proxy(function(b){if(this.settings.dnd.large_drag_target&&a(b.target).closest(".jstree-node")[0]!==b.currentTarget)return!0;if("touchstart"===b.type&&(!this.settings.dnd.touch||"selected"===this.settings.dnd.touch&&!a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").hasClass("jstree-clicked")))return!0;var c=this.get_node(b.target),d=this.is_selected(c)&&this.settings.dnd.drag_selection?this.get_top_selected().length:1,e=d>1?d+" "+this.get_string("nodes"):this.get_text(b.currentTarget);return this.settings.core.force_text&&(e=a.vakata.html.escape(e)),c&&c.id&&"#"!==c.id&&(1===b.which||"touchstart"===b.type)&&(this.settings.dnd.is_draggable===!0||a.isFunction(this.settings.dnd.is_draggable)&&this.settings.dnd.is_draggable.call(this,d>1?this.get_top_selected(!0):[c]))?(this.element.trigger("mousedown.jstree"),a.vakata.dnd.start(b,{jstree:!0,origin:this,obj:this.get_node(c,!0),nodes:d>1?this.get_top_selected():[c.id]},'<div id="jstree-dnd" class="jstree-'+this.get_theme()+" jstree-"+this.get_theme()+"-"+this.get_theme_variant()+" "+(this.settings.core.themes.responsive?" jstree-dnd-responsive":"")+'"><i class="jstree-icon jstree-er"></i>'+e+'<ins class="jstree-copy" style="display:none;">+</ins></div>')):void 0},this))}},a(function(){var b=!1,c=!1,d=!1,e=a('<div id="jstree-marker">&#160;</div>').hide();a(i).on("dnd_start.vakata.jstree",function(a,c){b=!1,c&&c.data&&c.data.jstree&&e.appendTo("body")}).on("dnd_move.vakata.jstree",function(f,g){if(d&&clearTimeout(d),g&&g.data&&g.data.jstree&&(!g.event.target.id||"jstree-marker"!==g.event.target.id)){var h=a.jstree.reference(g.event.target),i=!1,j=!1,k=!1,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;if(h&&h._data&&h._data.dnd)if(e.attr("class","jstree-"+h.get_theme()+(h.settings.core.themes.responsive?" jstree-dnd-responsive":"")),g.helper.children().attr("class","jstree-"+h.get_theme()+" jstree-"+h.get_theme()+"-"+h.get_theme_variant()+" "+(h.settings.core.themes.responsive?" jstree-dnd-responsive":"")).find(".jstree-copy").first()[g.data.origin&&(g.data.origin.settings.dnd.always_copy||g.data.origin.settings.dnd.copy&&(g.event.metaKey||g.event.ctrlKey))?"show":"hide"](),g.event.target!==h.element[0]&&g.event.target!==h.get_container_ul()[0]||0!==h.get_container_ul().children().length){if(i=h.settings.dnd.large_drop_target?a(g.event.target).closest(".jstree-node").children(".jstree-anchor"):a(g.event.target).closest(".jstree-anchor"),i&&i.length&&i.parent().is(".jstree-closed, .jstree-open, .jstree-leaf")&&(j=i.offset(),k=g.event.pageY-j.top,o=i.height(),r=o/3>k?["b","i","a"]:k>o-o/3?["a","i","b"]:k>o/2?["i","a","b"]:["i","b","a"],a.each(r,function(f,k){switch(k){case"b":m=j.left-6,n=j.top,p=h.get_parent(i),q=i.parent().index();break;case"i":y=h.settings.dnd.inside_pos,z=h.get_node(i.parent()),m=j.left-2,n=j.top+o/2+1,p=z.id,q="first"===y?0:"last"===y?z.children.length:Math.min(y,z.children.length);break;case"a":m=j.left-6,n=j.top+o,p=h.get_parent(i),q=i.parent().index()+1}for(s=!0,t=0,u=g.data.nodes.length;u>t;t++)if(v=g.data.origin&&(g.data.origin.settings.dnd.always_copy||g.data.origin.settings.dnd.copy&&(g.event.metaKey||g.event.ctrlKey))?"copy_node":"move_node",w=q,"move_node"===v&&"a"===k&&g.data.origin&&g.data.origin===h&&p===h.get_parent(g.data.nodes[t])&&(x=h.get_node(p),w>a.inArray(g.data.nodes[t],x.children)&&(w-=1)),s=s&&(h&&h.settings&&h.settings.dnd&&h.settings.dnd.check_while_dragging===!1||h.check(v,g.data.origin&&g.data.origin!==h?g.data.origin.get_node(g.data.nodes[t]):g.data.nodes[t],p,w,{dnd:!0,ref:h.get_node(i.parent()),pos:k,origin:g.data.origin,is_multi:g.data.origin&&g.data.origin!==h,is_foreign:!g.data.origin})),!s){h&&h.last_error&&(c=h.last_error());break}return"i"===k&&i.parent().is(".jstree-closed")&&h.settings.dnd.open_timeout&&(d=setTimeout(function(a,b){return function(){a.open_node(b)}}(h,i),h.settings.dnd.open_timeout)),s?(b={ins:h,par:p,pos:"i"!==k||"last"!==y||0!==q||h.is_loaded(z)?q:"last"},e.css({left:m+"px",top:n+"px"}).show(),g.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"),c={},r=!0,!1):void 0}),r===!0))return}else{for(s=!0,t=0,u=g.data.nodes.length;u>t;t++)if(s=s&&h.check(g.data.origin&&(g.data.origin.settings.dnd.always_copy||g.data.origin.settings.dnd.copy&&(g.event.metaKey||g.event.ctrlKey))?"copy_node":"move_node",g.data.origin&&g.data.origin!==h?g.data.origin.get_node(g.data.nodes[t]):g.data.nodes[t],"#","last",{dnd:!0,ref:h.get_node("#"),pos:"i",origin:g.data.origin,is_multi:g.data.origin&&g.data.origin!==h,is_foreign:!g.data.origin}),!s)break;if(s)return b={ins:h,par:"#",pos:"last"},e.hide(),void g.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok")}b=!1,g.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"),e.hide()}}).on("dnd_scroll.vakata.jstree",function(a,c){c&&c.data&&c.data.jstree&&(e.hide(),b=!1,c.helper.find(".jstree-icon").first().removeClass("jstree-ok").addClass("jstree-er"))}).on("dnd_stop.vakata.jstree",function(f,g){if(d&&clearTimeout(d),g&&g.data&&g.data.jstree){e.hide().detach();var h,i,j=[];if(b){for(h=0,i=g.data.nodes.length;i>h;h++)j[h]=g.data.origin?g.data.origin.get_node(g.data.nodes[h]):g.data.nodes[h];b.ins[g.data.origin&&(g.data.origin.settings.dnd.always_copy||g.data.origin.settings.dnd.copy&&(g.event.metaKey||g.event.ctrlKey))?"copy_node":"move_node"](j,b.par,b.pos,!1,!1,!1,g.data.origin)}else h=a(g.event.target).closest(".jstree"),h.length&&c&&c.error&&"check"===c.error&&(h=h.jstree(!0),h&&h.settings.core.error.call(this,c))}}).on("keyup.jstree keydown.jstree",function(b,c){c=a.vakata.dnd._get(),c&&c.data&&c.data.jstree&&c.helper.find(".jstree-copy").first()[c.data.origin&&(c.data.origin.settings.dnd.always_copy||c.data.origin.settings.dnd.copy&&(b.metaKey||b.ctrlKey))?"show":"hide"]()})}),function(a){a.vakata.html={div:a("<div />"),escape:function(b){return a.vakata.html.div.text(b).html()},strip:function(b){return a.vakata.html.div.empty().append(a.parseHTML(b)).text()}};var b={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1};a.vakata.dnd={settings:{scroll_speed:10,scroll_proximity:20,helper_left:5,helper_top:10,threshold:5,threshold_touch:50},_trigger:function(b,c){var d=a.vakata.dnd._get();d.event=c,a(i).triggerHandler("dnd_"+b+".vakata",d)},_get:function(){return{data:b.data,element:b.element,helper:b.helper}},_clean:function(){b.helper&&b.helper.remove(),b.scroll_i&&(clearInterval(b.scroll_i),b.scroll_i=!1),b={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1},a(i).off("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).off("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop)},_scroll:function(c){if(!b.scroll_e||!b.scroll_l&&!b.scroll_t)return b.scroll_i&&(clearInterval(b.scroll_i),b.scroll_i=!1),!1;if(!b.scroll_i)return b.scroll_i=setInterval(a.vakata.dnd._scroll,100),!1;
if(c===!0)return!1;var d=b.scroll_e.scrollTop(),e=b.scroll_e.scrollLeft();b.scroll_e.scrollTop(d+b.scroll_t*a.vakata.dnd.settings.scroll_speed),b.scroll_e.scrollLeft(e+b.scroll_l*a.vakata.dnd.settings.scroll_speed),(d!==b.scroll_e.scrollTop()||e!==b.scroll_e.scrollLeft())&&a.vakata.dnd._trigger("scroll",b.scroll_e)},start:function(c,d,e){"touchstart"===c.type&&c.originalEvent&&c.originalEvent.changedTouches&&c.originalEvent.changedTouches[0]&&(c.pageX=c.originalEvent.changedTouches[0].pageX,c.pageY=c.originalEvent.changedTouches[0].pageY,c.target=i.elementFromPoint(c.originalEvent.changedTouches[0].pageX-window.pageXOffset,c.originalEvent.changedTouches[0].pageY-window.pageYOffset)),b.is_drag&&a.vakata.dnd.stop({});try{c.currentTarget.unselectable="on",c.currentTarget.onselectstart=function(){return!1},c.currentTarget.style&&(c.currentTarget.style.MozUserSelect="none")}catch(f){}return b.init_x=c.pageX,b.init_y=c.pageY,b.data=d,b.is_down=!0,b.element=c.currentTarget,b.target=c.target,b.is_touch="touchstart"===c.type,e!==!1&&(b.helper=a("<div id='vakata-dnd'></div>").html(e).css({display:"block",margin:"0",padding:"0",position:"absolute",top:"-2000px",lineHeight:"16px",zIndex:"10000"})),a(i).on("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).on("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop),!1},drag:function(c){if("touchmove"===c.type&&c.originalEvent&&c.originalEvent.changedTouches&&c.originalEvent.changedTouches[0]&&(c.pageX=c.originalEvent.changedTouches[0].pageX,c.pageY=c.originalEvent.changedTouches[0].pageY,c.target=i.elementFromPoint(c.originalEvent.changedTouches[0].pageX-window.pageXOffset,c.originalEvent.changedTouches[0].pageY-window.pageYOffset)),b.is_down){if(!b.is_drag){if(!(Math.abs(c.pageX-b.init_x)>(b.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)||Math.abs(c.pageY-b.init_y)>(b.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)))return;b.helper&&(b.helper.appendTo("body"),b.helper_w=b.helper.outerWidth()),b.is_drag=!0,a.vakata.dnd._trigger("start",c)}var d=!1,e=!1,f=!1,g=!1,h=!1,j=!1,k=!1,l=!1,m=!1,n=!1;return b.scroll_t=0,b.scroll_l=0,b.scroll_e=!1,a(a(c.target).parentsUntil("body").addBack().get().reverse()).filter(function(){return/^auto|scroll$/.test(a(this).css("overflow"))&&(this.scrollHeight>this.offsetHeight||this.scrollWidth>this.offsetWidth)}).each(function(){var d=a(this),e=d.offset();return this.scrollHeight>this.offsetHeight&&(e.top+d.height()-c.pageY<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_t=1),c.pageY-e.top<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_t=-1)),this.scrollWidth>this.offsetWidth&&(e.left+d.width()-c.pageX<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_l=1),c.pageX-e.left<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_l=-1)),b.scroll_t||b.scroll_l?(b.scroll_e=a(this),!1):void 0}),b.scroll_e||(d=a(i),e=a(window),f=d.height(),g=e.height(),h=d.width(),j=e.width(),k=d.scrollTop(),l=d.scrollLeft(),f>g&&c.pageY-k<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_t=-1),f>g&&g-(c.pageY-k)<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_t=1),h>j&&c.pageX-l<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_l=-1),h>j&&j-(c.pageX-l)<a.vakata.dnd.settings.scroll_proximity&&(b.scroll_l=1),(b.scroll_t||b.scroll_l)&&(b.scroll_e=d)),b.scroll_e&&a.vakata.dnd._scroll(!0),b.helper&&(m=parseInt(c.pageY+a.vakata.dnd.settings.helper_top,10),n=parseInt(c.pageX+a.vakata.dnd.settings.helper_left,10),f&&m+25>f&&(m=f-50),h&&n+b.helper_w>h&&(n=h-(b.helper_w+2)),b.helper.css({left:n+"px",top:m+"px"})),a.vakata.dnd._trigger("move",c),!1}},stop:function(c){if("touchend"===c.type&&c.originalEvent&&c.originalEvent.changedTouches&&c.originalEvent.changedTouches[0]&&(c.pageX=c.originalEvent.changedTouches[0].pageX,c.pageY=c.originalEvent.changedTouches[0].pageY,c.target=i.elementFromPoint(c.originalEvent.changedTouches[0].pageX-window.pageXOffset,c.originalEvent.changedTouches[0].pageY-window.pageYOffset)),b.is_drag)a.vakata.dnd._trigger("stop",c);else if("touchend"===c.type&&c.target===b.target){var d=setTimeout(function(){a(c.target).click()},100);a(c.target).one("click",function(){d&&clearTimeout(d)})}return a.vakata.dnd._clean(),!1}}}(a),a.jstree.defaults.massload=null,a.jstree.plugins.massload=function(b,c){this.init=function(a,b){c.init.call(this,a,b),this._data.massload={}},this._load_nodes=function(b,d,e){var f=this.settings.massload;return e&&!a.isEmptyObject(this._data.massload)?c._load_nodes.call(this,b,d,e):a.isFunction(f)?f.call(this,b,a.proxy(function(a){if(a)for(var f in a)a.hasOwnProperty(f)&&(this._data.massload[f]=a[f]);c._load_nodes.call(this,b,d,e)},this)):"object"==typeof f&&f&&f.url?(f=a.extend(!0,{},f),a.isFunction(f.url)&&(f.url=f.url.call(this,b)),a.isFunction(f.data)&&(f.data=f.data.call(this,b)),a.ajax(f).done(a.proxy(function(a,f,g){if(a)for(var h in a)a.hasOwnProperty(h)&&(this._data.massload[h]=a[h]);c._load_nodes.call(this,b,d,e)},this)).fail(a.proxy(function(a){c._load_nodes.call(this,b,d,e)},this))):c._load_nodes.call(this,b,d,e)},this._load_node=function(b,d){var e=this._data.massload[b.id];return e?this["string"==typeof e?"_append_html_data":"_append_json_data"](b,"string"==typeof e?a(a.parseHTML(e)).filter(function(){return 3!==this.nodeType}):e,function(a){d.call(this,a),delete this._data.massload[b.id]}):c._load_node.call(this,b,d)}},a.jstree.defaults.search={ajax:!1,fuzzy:!1,case_sensitive:!1,show_only_matches:!1,close_opened_onclear:!0,search_leaves_only:!1,search_callback:!1},a.jstree.plugins.search=function(c,d){this.bind=function(){d.bind.call(this),this._data.search.str="",this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=!1,this.element.on("before_open.jstree",a.proxy(function(b,c){var d,e,f,g=this._data.search.res,h=[],i=a();if(g&&g.length&&(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(g,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.dom.children(".jstree-anchor").addClass("jstree-search"),this._data.search.som&&this._data.search.res.length)){for(d=0,e=g.length;e>d;d++)h=h.concat(this.get_node(g[d]).parents);h=a.vakata.array_remove_item(a.vakata.array_unique(h),"#"),i=h.length?a(this.element[0].querySelectorAll("#"+a.map(h,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))):a(),this.element.find(".jstree-node").hide().filter(".jstree-last").filter(function(){return this.nextSibling}).removeClass("jstree-last"),i=i.add(this._data.search.dom),i.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function(){a(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")})}},this)).on("search.jstree",a.proxy(function(b,c){this._data.search.som&&c.nodes.length&&(this.element.find(".jstree-node").hide().filter(".jstree-last").filter(function(){return this.nextSibling}).removeClass("jstree-last"),c.nodes.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function(){a(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")}))},this)).on("clear_search.jstree",a.proxy(function(a,b){this._data.search.som&&b.nodes.length&&this.element.find(".jstree-node").css("display","").filter(".jstree-last").filter(function(){return this.nextSibling}).removeClass("jstree-last")},this))},this.search=function(c,d,e,f,g){if(c===!1||""===a.trim(c.toString()))return this.clear_search();f=this.get_node(f),f=f&&f.id?f.id:null,c=c.toString();var h=this.settings.search,i=h.ajax?h.ajax:!1,j=this._model.data,k=null,l=[],m=[],n,o;return this._data.search.res.length&&!g&&this.clear_search(),e===b&&(e=h.show_only_matches),d||i===!1?(g||(this._data.search.str=c,this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=e),k=new a.vakata.search(c,!0,{caseSensitive:h.case_sensitive,fuzzy:h.fuzzy}),a.each(j[f?f:"#"].children_d,function(a,b){var d=j[b];d.text&&(h.search_callback&&h.search_callback.call(this,c,d)||!h.search_callback&&k.search(d.text).isMatch)&&(!h.search_leaves_only||d.state.loaded&&0===d.children.length)&&(l.push(b),m=m.concat(d.parents))}),l.length&&(m=a.vakata.array_unique(m),this._search_open(m),g?(this._data.search.dom=this._data.search.dom.add(a(this.element[0].querySelectorAll("#"+a.map(l,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #")))),this._data.search.res=a.vakata.array_unique(this._data.search.res.concat(l))):(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(l,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.res=l),this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")),void this.trigger("search",{nodes:this._data.search.dom,str:c,res:this._data.search.res,show_only_matches:e})):a.isFunction(i)?i.call(this,c,a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g)},!0)},this),f):(i=a.extend({},i),i.data||(i.data={}),i.data.str=c,f&&(i.data.inside=f),a.ajax(i).fail(a.proxy(function(){this._data.core.last_error={error:"ajax",plugin:"search",id:"search_01",reason:"Could not load search parents",data:JSON.stringify(i)},this.settings.core.error.call(this,this._data.core.last_error)},this)).done(a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g)},!0)},this)))},this.clear_search=function(){this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search"),this.settings.search.close_opened_onclear&&this.close_node(this._data.search.opn,0),this.trigger("clear_search",{nodes:this._data.search.dom,str:this._data.search.str,res:this._data.search.res}),this._data.search.str="",this._data.search.res=[],this._data.search.opn=[],this._data.search.dom=a()},this._search_open=function(b){var c=this;a.each(b.concat([]),function(d,e){if("#"===e)return!0;try{e=a("#"+e.replace(a.jstree.idregex,"\\$&"),c.element)}catch(f){}e&&e.length&&c.is_closed(e)&&(c._data.search.opn.push(e[0].id),c.open_node(e,function(){c._search_open(b)},0))})}},function(a){a.vakata.search=function(a,b,c){c=c||{},c.fuzzy!==!1&&(c.fuzzy=!0),a=c.caseSensitive?a:a.toLowerCase();var d=c.location||0,e=c.distance||100,f=c.threshold||.6,g=a.length,h,i,j,k;return g>32&&(c.fuzzy=!1),c.fuzzy&&(h=1<<g-1,i=function(){var b={},c=0;for(c=0;g>c;c++)b[a.charAt(c)]=0;for(c=0;g>c;c++)b[a.charAt(c)]|=1<<g-c-1;return b}(),j=function(a,b){var c=a/g,f=Math.abs(d-b);return e?c+f/e:f?1:c}),k=function(b){if(b=c.caseSensitive?b:b.toLowerCase(),a===b||-1!==b.indexOf(a))return{isMatch:!0,score:0};if(!c.fuzzy)return{isMatch:!1,score:1};var e,k,l=b.length,m=f,n=b.indexOf(a,d),o,p,q=g+l,r,s,t,u,v,w=1,x=[];for(-1!==n&&(m=Math.min(j(0,n),m),n=b.lastIndexOf(a,d+g),-1!==n&&(m=Math.min(j(0,n),m))),n=-1,e=0;g>e;e++){o=0,p=q;while(p>o)j(e,d+p)<=m?o=p:q=p,p=Math.floor((q-o)/2+o);for(q=p,s=Math.max(1,d-p+1),t=Math.min(d+p,l)+g,u=new Array(t+2),u[t+1]=(1<<e)-1,k=t;k>=s;k--)if(v=i[b.charAt(k-1)],u[k]=0===e?(u[k+1]<<1|1)&v:(u[k+1]<<1|1)&v|((r[k+1]|r[k])<<1|1)|r[k+1],u[k]&h&&(w=j(e,k-1),m>=w)){if(m=w,n=k-1,x.push(n),!(n>d))break;s=Math.max(1,2*d-n)}if(j(e+1,d)>m)break;r=u}return{isMatch:n>=0,score:w}},b===!0?{search:k}:k(b)}}(a),a.jstree.defaults.sort=function(a,b){return this.get_text(a)>this.get_text(b)?1:-1},a.jstree.plugins.sort=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("model.jstree",a.proxy(function(a,b){this.sort(b.parent,!0)},this)).on("rename_node.jstree create_node.jstree",a.proxy(function(a,b){this.sort(b.parent||b.node.parent,!1),this.redraw_node(b.parent||b.node.parent,!0)},this)).on("move_node.jstree copy_node.jstree",a.proxy(function(a,b){this.sort(b.parent,!1),this.redraw_node(b.parent,!0)},this))},this.sort=function(b,c){var d,e;if(b=this.get_node(b),b&&b.children&&b.children.length&&(b.children.sort(a.proxy(this.settings.sort,this)),c))for(d=0,e=b.children_d.length;e>d;d++)this.sort(b.children_d[d],!1)}};var n=!1;a.jstree.defaults.state={key:"jstree",events:"changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree",ttl:!1,filter:!1},a.jstree.plugins.state=function(b,c){this.bind=function(){c.bind.call(this);var b=a.proxy(function(){this.element.on(this.settings.state.events,a.proxy(function(){n&&clearTimeout(n),n=setTimeout(a.proxy(function(){this.save_state()},this),100)},this)),this.trigger("state_ready")},this);this.element.on("ready.jstree",a.proxy(function(a,c){this.element.one("restore_state.jstree",b),this.restore_state()||b()},this))},this.save_state=function(){var b={state:this.get_state(),ttl:this.settings.state.ttl,sec:+new Date};a.vakata.storage.set(this.settings.state.key,JSON.stringify(b))},this.restore_state=function(){var b=a.vakata.storage.get(this.settings.state.key);if(b)try{b=JSON.parse(b)}catch(c){return!1}return b&&b.ttl&&b.sec&&+new Date-b.sec>b.ttl?!1:(b&&b.state&&(b=b.state),b&&a.isFunction(this.settings.state.filter)&&(b=this.settings.state.filter.call(this,b)),b?(this.element.one("set_state.jstree",function(c,d){d.instance.trigger("restore_state",{state:a.extend(!0,{},b)})}),this.set_state(b),!0):!1)},this.clear_state=function(){return a.vakata.storage.del(this.settings.state.key)}},function(a,b){a.vakata.storage={set:function(a,b){return window.localStorage.setItem(a,b)},get:function(a){return window.localStorage.getItem(a)},del:function(a){return window.localStorage.removeItem(a)}}}(a),a.jstree.defaults.types={"#":{},"default":{}},a.jstree.plugins.types=function(c,d){this.init=function(a,c){var e,f;if(c&&c.types&&c.types["default"])for(e in c.types)if("default"!==e&&"#"!==e&&c.types.hasOwnProperty(e))for(f in c.types["default"])c.types["default"].hasOwnProperty(f)&&c.types[e][f]===b&&(c.types[e][f]=c.types["default"][f]);d.init.call(this,a,c),this._model.data["#"].type="#"},this.refresh=function(a,b){d.refresh.call(this,a,b),this._model.data["#"].type="#"},this.bind=function(){this.element.on("model.jstree",a.proxy(function(a,c){var d=this._model.data,e=c.nodes,f=this.settings.types,g,h,i="default";for(g=0,h=e.length;h>g;g++)i="default",d[e[g]].original&&d[e[g]].original.type&&f[d[e[g]].original.type]&&(i=d[e[g]].original.type),d[e[g]].data&&d[e[g]].data.jstree&&d[e[g]].data.jstree.type&&f[d[e[g]].data.jstree.type]&&(i=d[e[g]].data.jstree.type),d[e[g]].type=i,d[e[g]].icon===!0&&f[i].icon!==b&&(d[e[g]].icon=f[i].icon);d["#"].type="#"},this)),d.bind.call(this)},this.get_json=function(b,c,e){var f,g,h=this._model.data,i=c?a.extend(!0,{},c,{no_id:!1}):{},j=d.get_json.call(this,b,i,e);if(j===!1)return!1;if(a.isArray(j))for(f=0,g=j.length;g>f;f++)j[f].type=j[f].id&&h[j[f].id]&&h[j[f].id].type?h[j[f].id].type:"default",c&&c.no_id&&(delete j[f].id,j[f].li_attr&&j[f].li_attr.id&&delete j[f].li_attr.id,j[f].a_attr&&j[f].a_attr.id&&delete j[f].a_attr.id);else j.type=j.id&&h[j.id]&&h[j.id].type?h[j.id].type:"default",c&&c.no_id&&(j=this._delete_ids(j));return j},this._delete_ids=function(b){if(a.isArray(b)){for(var c=0,d=b.length;d>c;c++)b[c]=this._delete_ids(b[c]);return b}return delete b.id,b.li_attr&&b.li_attr.id&&delete b.li_attr.id,b.a_attr&&b.a_attr.id&&delete b.a_attr.id,b.children&&a.isArray(b.children)&&(b.children=this._delete_ids(b.children)),b},this.check=function(c,e,f,g,h){if(d.check.call(this,c,e,f,g,h)===!1)return!1;e=e&&e.id?e:this.get_node(e),f=f&&f.id?f:this.get_node(f);var i=e&&e.id?h&&h.origin?h.origin:a.jstree.reference(e.id):null,j,k,l,m;switch(i=i&&i._model&&i._model.data?i._model.data:null,c){case"create_node":case"move_node":case"copy_node":if("move_node"!==c||-1===a.inArray(e.id,f.children)){if(j=this.get_rules(f),j.max_children!==b&&-1!==j.max_children&&j.max_children===f.children.length)return this._data.core.last_error={error:"check",plugin:"types",id:"types_01",reason:"max_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(j.valid_children!==b&&-1!==j.valid_children&&-1===a.inArray(e.type||"default",j.valid_children))return this._data.core.last_error={error:"check",plugin:"types",id:"types_02",reason:"valid_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(i&&e.children_d&&e.parents){for(k=0,l=0,m=e.children_d.length;m>l;l++)k=Math.max(k,i[e.children_d[l]].parents.length);k=k-e.parents.length+1}(0>=k||k===b)&&(k=1);do{if(j.max_depth!==b&&-1!==j.max_depth&&j.max_depth<k)return this._data.core.last_error={error:"check",plugin:"types",id:"types_03",reason:"max_depth prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;f=this.get_node(f.parent),j=this.get_rules(f),k++}while(f)}}return!0},this.get_rules=function(a){if(a=this.get_node(a),!a)return!1;var c=this.get_type(a,!0);return c.max_depth===b&&(c.max_depth=-1),c.max_children===b&&(c.max_children=-1),c.valid_children===b&&(c.valid_children=-1),c},this.get_type=function(b,c){return b=this.get_node(b),b?c?a.extend({type:b.type},this.settings.types[b.type]):b.type:!1},this.set_type=function(c,d){var e,f,g,h,i;if(a.isArray(c)){for(c=c.slice(),f=0,g=c.length;g>f;f++)this.set_type(c[f],d);return!0}return e=this.settings.types,c=this.get_node(c),e[d]&&c?(h=c.type,i=this.get_icon(c),c.type=d,(i===!0||e[h]&&e[h].icon!==b&&i===e[h].icon)&&this.set_icon(c,e[d].icon!==b?e[d].icon:!0),!0):!1}},a.jstree.defaults.unique={case_sensitive:!1,duplicate:function(a,b){return a+" ("+b+")"}},a.jstree.plugins.unique=function(c,d){this.check=function(b,c,e,f,g){if(d.check.call(this,b,c,e,f,g)===!1)return!1;if(c=c&&c.id?c:this.get_node(c),e=e&&e.id?e:this.get_node(e),!e||!e.children)return!0;var h="rename_node"===b?f:c.text,i=[],j=this.settings.unique.case_sensitive,k=this._model.data,l,m;for(l=0,m=e.children.length;m>l;l++)i.push(j?k[e.children[l]].text:k[e.children[l]].text.toLowerCase());switch(j||(h=h.toLowerCase()),b){case"delete_node":return!0;case"rename_node":return l=-1===a.inArray(h,i)||c.text&&c.text[j?"toString":"toLowerCase"]()===h,l||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_01",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),l;case"create_node":return l=-1===a.inArray(h,i),l||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_04",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),l;case"copy_node":return l=-1===a.inArray(h,i),l||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_02",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),l;case"move_node":return l=c.parent===e.id&&(!g||!g.is_multi)||-1===a.inArray(h,i),l||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_03",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),l}return!0},this.create_node=function(c,e,f,g,h){if(!e||e.text===b){if(null===c&&(c="#"),c=this.get_node(c),!c)return d.create_node.call(this,c,e,f,g,h);if(f=f===b?"last":f,!f.toString().match(/^(before|after)$/)&&!h&&!this.is_loaded(c))return d.create_node.call(this,c,e,f,g,h);e||(e={});var i,j,k,l,m,n=this._model.data,o=this.settings.unique.case_sensitive,p=this.settings.unique.duplicate;for(j=i=this.get_string("New node"),k=[],l=0,m=c.children.length;m>l;l++)k.push(o?n[c.children[l]].text:n[c.children[l]].text.toLowerCase());l=1;while(-1!==a.inArray(o?j:j.toLowerCase(),k))j=p.call(this,i,++l).toString();e.text=j}return d.create_node.call(this,c,e,f,g,h)}};var o=i.createElement("DIV");if(o.setAttribute("unselectable","on"),o.setAttribute("role","presentation"),o.className="jstree-wholerow",o.innerHTML="&#160;",a.jstree.plugins.wholerow=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("ready.jstree set_state.jstree",a.proxy(function(){this.hide_dots()},this)).on("init.jstree loading.jstree ready.jstree",a.proxy(function(){this.get_container_ul().addClass("jstree-wholerow-ul")},this)).on("deselect_all.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")},this)).on("changed.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");var c=!1,d,e;for(d=0,e=b.selected.length;e>d;d++)c=this.get_node(b.selected[d],!0),c&&c.length&&c.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("open_node.jstree",a.proxy(function(a,b){this.get_node(b.node,!0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("hover_node.jstree dehover_node.jstree",a.proxy(function(a,b){"hover_node"===a.type&&this.is_disabled(b.node)||this.get_node(b.node,!0).children(".jstree-wholerow")["hover_node"===a.type?"addClass":"removeClass"]("jstree-wholerow-hovered")},this)).on("contextmenu.jstree",".jstree-wholerow",a.proxy(function(b){b.preventDefault();var c=a.Event("contextmenu",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey,pageX:b.pageX,pageY:b.pageY});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c)},this)).on("click.jstree",".jstree-wholerow",function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()}).on("click.jstree",".jstree-leaf > .jstree-ocl",a.proxy(function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()},this)).on("mouseover.jstree",".jstree-wholerow, .jstree-icon",a.proxy(function(a){return a.stopImmediatePropagation(),this.is_disabled(a.currentTarget)||this.hover_node(a.currentTarget),!1},this)).on("mouseleave.jstree",".jstree-node",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},this.teardown=function(){this.settings.wholerow&&this.element.find(".jstree-wholerow").remove(),c.teardown.call(this)},this.redraw_node=function(b,d,e,f){if(b=c.redraw_node.apply(this,arguments)){var g=o.cloneNode(!0);-1!==a.inArray(b.id,this._data.core.selected)&&(g.className+=" jstree-wholerow-clicked"),this._data.core.focused&&this._data.core.focused===b.id&&(g.className+=" jstree-wholerow-hovered"),b.insertBefore(g,b.childNodes[0])}return b}},i.registerElement&&Object&&Object.create){var p=Object.create(HTMLElement.prototype);p.createdCallback=function(){var b={core:{},plugins:[]},c;for(c in a.jstree.plugins)a.jstree.plugins.hasOwnProperty(c)&&this.attributes[c]&&(b.plugins.push(c),this.getAttribute(c)&&JSON.parse(this.getAttribute(c))&&(b[c]=JSON.parse(this.getAttribute(c))));for(c in a.jstree.defaults.core)a.jstree.defaults.core.hasOwnProperty(c)&&this.attributes[c]&&(b.core[c]=JSON.parse(this.getAttribute(c))||this.getAttribute(c));a(this).jstree(b)};try{i.registerElement("vakata-jstree",{prototype:p})}catch(q){}}}});
(function ($) {
  "use strict";

  var defaultOptions = {
    tagClass: function(item) {
      return 'label label-info';
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    freeInput: true,
    addOnBlur: true,
    maxTags: undefined,
    maxChars: undefined,
    confirmKeys: [13, 44],
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    },
    trimValue: false,
    allowDuplicates: false
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.after(this.$container);

    var inputWidth = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
    this.$input.get(0).style.cssText = "width: " + inputWidth + " !important;";
    this.build(options);
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Trim value
      if (typeof item === "string" && self.options.trimValue) {
        item = $.trim(item);
      }

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var items = item.split(',');
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal();
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing && !self.options.allowDuplicates) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // if length greater than limit
      if (self.items().toString().length + item.length + 1 > self.options.maxInputLength)
        return;

      // raise beforeItemAdd arg
      var beforeItemAddEvent = $.Event('beforeItemAdd', { item: item, cancel: false });
      self.$element.trigger(beforeItemAddEvent);
      if (beforeItemAddEvent.cancel)
        return;

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element
      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !$('option[value="' + encodeURIComponent(itemValue) + '"]',self.$element)[0]) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal();

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength)
        self.$container.addClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemAdded', { item: item }));
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } );
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } );

        item = item[item.length-1];
      }

      if (item) {
        var beforeItemRemoveEvent = $.Event('beforeItemRemove', { item: item, cancel: false });
        self.$element.trigger(beforeItemRemoveEvent);
        if (beforeItemRemoveEvent.cancel)
          return;

        $('.tag', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        if($.inArray(item, self.itemsArray) !== -1)
          self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal();

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal();
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.tag', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('tag ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element.
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val(val, true).trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionFunction(self.options, 'tagClass');
      
      // Typeahead Bootstrap version 2.3.2
      if (self.options.typeahead) {
        var typeahead = self.options.typeahead || {};

        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead($.extend({}, typeahead, {
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular callbacks
              data.success(processItems);
            } else if ($.isFunction(data.then)) {
              // support for Angular promises
              data.then(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        }));
      }

      // typeahead.js
      if (self.options.typeaheadjs) {
          var typeaheadjs = self.options.typeaheadjs || {};
          
          self.$input.typeahead(null, typeaheadjs).on('typeahead:selected', $.proxy(function (obj, datum) {
            if (typeaheadjs.valueKey)
              self.add(datum[typeaheadjs.valueKey]);
            else
              self.add(datum);
            self.$input.typeahead('val', '');
          }, self));
      }

      self.$container.on('click', $.proxy(function(event) {
        if (! self.$element.attr('disabled')) {
          self.$input.removeAttr('disabled');
        }
        self.$input.focus();
      }, self));

        if (self.options.addOnBlur && self.options.freeInput) {
          self.$input.on('focusout', $.proxy(function(event) {
              // HACK: only process on focusout when no typeahead opened, to
              //       avoid adding the typeahead text as tag
              if ($('.typeahead, .twitter-typeahead', self.$container).length === 0) {
                self.add(self.$input.val());
                self.$input.val('');
              }
          }, self));
        }
        

      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
             // ignore
         }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      self.$container.on('keypress', 'input', $.proxy(function(event) {
         var $input = $(event.target);

         if (self.$element.attr('disabled')) {
            self.$input.attr('disabled', 'disabled');
            return;
         }

         var text = $input.val(),
         maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
         if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
            self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
            $input.val('');
            event.preventDefault();
         }

         // Reset internal input's size
         var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
         $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        if (self.$element.attr('disabled')) {
          return;
        }
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');
      // Initialize a new tags input
      if (!tagsinput) {
          tagsinput = new TagsInput(this, arg1);
          $(this).data('tagsinput', tagsinput);
          results.push(tagsinput);

          if (this.tagName === 'SELECT') {
              $('option', $(this)).attr('selected', 'selected');
          }

          // Init tags from $(this).val()
          $(this).val($(this).val());
      } else if (!arg1 && !arg2) {
          // tagsinput already exists
          // no function, trying to init
          results.push(tagsinput);
      } else if(tagsinput[arg1] !== undefined) {
          // Invoke function on existing tags input
          var retVal = tagsinput[arg1](arg2);
          if (retVal !== undefined)
              results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;

  /**
   * Most options support both a string or number as well as a function as
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
    * Returns boolean indicates whether user has pressed an expected key combination. 
    * @param object keyPressEvent: JavaScript event object, refer
    *     http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    * @param object lookupList: expected key combinations, as in:
    *     [13, {which: 188, shiftKey: true}]
    */
  function keyCombinationInList(keyPressEvent, lookupList) {
      var found = false;
      $.each(lookupList, function (index, keyCombination) {
          if (typeof (keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
              found = true;
              return false;
          }

          if (keyPressEvent.which === keyCombination.which) {
              var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey,
                  shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey,
                  ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
              if (alt && shift && ctrl) {
                  found = true;
                  return false;
              }
          }
      });

      return found;
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);

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
/*! layer-v2.0 弹层组件 License LGPL  http://layer.layui.com/ By 贤心 */ ;
! function(a, b) {
	"use strict";
	var scrolltop;
	var c, d, e = {
			getPath: function() {
				var a = document.scripts,
					b = a[a.length - 1],
					c = b.src;
				if (!b.getAttribute("merge")) return c.substring(0, c.lastIndexOf("/") + 1)
			}(),
			enter: function(a) {
				13 === a.keyCode && a.preventDefault()
			},
			config: {},
			end: {},
			btn: ["&#x786E;&#x5B9A;", "&#x53D6;&#x6D88;"],
			type: ["dialog", "page", "iframe", "loading", "tips"]
		},
		f = {
			v: "2.0",
			ie6: !!a.ActiveXObject && !a.XMLHttpRequest,
			index: 0,
			path: e.getPath,
			config: function(a, b) {
				var d = 0;
				return a = a || {}, f.cache = e.config = c.extend(e.config, a), f.path = e.config.path || f.path, "string" == typeof a.extend && (a.extend = [a.extend]), f.use("skin/layer.css", a.extend && a.extend.length > 0 ? function g() {
					var c = a.extend;
					f.use(c[c[d] ? d : d - 1], d < c.length ? function() {
						return ++d, g
					}() : b)
				}() : b), this
			},
			use: function(a, b, d) {
				var e = c("head")[0],
					a = a.replace(/\s/g, ""),
					g = /\.css$/.test(a),
					h = document.createElement(g ? "link" : "script"),
					i = "layui_layer_" + a.replace(/\.|\//g, "");
				return f.path ? (g && (h.rel = "stylesheet"), h[g ? "href" : "src"] = /^http:\/\//.test(a) ? a : f.path + a, h.id = i, c("#" + i)[0] || e.appendChild(h), function j() {
					(g ? 1989 === parseInt(c("#" + i).css("width")) : f[d || i]) ? function() {
						b && b();
						try {
							g || e.removeChild(h)
						} catch (a) {}
					}() : setTimeout(j, 100)
				}(), this) : void 0
			},
			ready: function(a, b) {
				var d = "function" == typeof a;
				return d && (b = a), f.config(c.extend(e.config, function() {
					return d ? {} : {
						path: a
					}
				}()), b), this
			},
			alert: function(a, b, d) {
				var e = "function" == typeof b;
				return e && (d = b), f.open(c.extend({
					content: a,
					yes: d
				}, e ? {} : b))
			},
			confirm: function(a, b, d, g) {
				var h = "function" == typeof b;
				return h && (g = d, d = b), f.open(c.extend({
					content: a,
					btn: e.btn,
					yes: d,
					cancel: g
				}, h ? {} : b))
			},
			msg: function(a, d, g) {
				var i = "function" == typeof d,
					j = e.config.skin,
					k = (j ? j + " " + j + "-msg" : "") || "layui-layer-msg",
					l = h.anim.length - 1;
				return i && (g = d), f.open(c.extend({
					content: a,
					time: 3e3,
					shade: !1,
					skin: k,
					title: !1,
					closeBtn: !1,
					btn: !1,
					end: g
				}, i && !e.config.skin ? {
					skin: k + " layui-layer-hui",
					shift: l
				} : function() {
					return d = d || {}, (-1 === d.icon || d.icon === b && !e.config.skin) && (d.skin = k + " " + (d.skin || "layui-layer-hui")), d
				}()))
			},
			load: function(a, b) {
				return f.open(c.extend({
					type: 3,
					icon: a || 0,
					shade: .01
				}, b))
			},
			tips: function(a, b, d) {
				return f.open(c.extend({
					type: 4,
					content: [a, b],
					closeBtn: !1,
					time: 3e3,
					maxWidth: 210
				}, d))
			}
		},
		g = function(a) {
			var b = this;
			b.index = ++f.index, b.config = c.extend({}, b.config, e.config, a), b.creat()
		};
	g.pt = g.prototype;
	var h = ["layui-layer", ".layui-layer-title", ".layui-layer-main", ".layui-layer-dialog", "layui-layer-iframe", "layui-layer-content", "layui-layer-btn", "layui-layer-close"];
	h.anim = ["layui-anim", "layui-anim-01", "layui-anim-02", "layui-anim-03", "layui-anim-04", "layui-anim-05", "layui-anim-06"], g.pt.config = {
		type: 0,
		shade: .3,
		fix: !0,
		move: h[1],
		title: "&#x4FE1;&#x606F;",
		offset: "auto",
		area: "auto",
		closeBtn: 1,
		time: 0,
		zIndex: 19891014,
		maxWidth: 360,
		shift: 0,
		icon: -1,
		scrollbar: !0,
		tips: 2
	}, g.pt.vessel = function(a, b) {
		var c = this,
			d = c.index,
			f = c.config,
			g = f.zIndex + d,
			i = "object" == typeof f.title,
			j = f.maxmin && (1 === f.type || 2 === f.type),
			k = f.title ? '<div class="layui-layer-title" style="' + (i ? f.title[1] : "") + '">' + (i ? f.title[0] : f.title) + "</div>" : "";
		return f.zIndex = g, b([f.shade ? '<div class="layui-layer-shade" id="layui-layer-shade' + d + '" times="' + d + '" style="' + ("z-index:" + (g - 1) + "; background-color:" + (f.shade[1] || "#000") + "; opacity:" + (f.shade[0] || f.shade) + "; filter:alpha(opacity=" + (100 * f.shade[0] || 100 * f.shade) + ");") + '"></div>' : "", '<div class="' + h[0] + " " + (h.anim[f.shift] || "") + (" layui-layer-" + e.type[f.type]) + (0 != f.type && 2 != f.type || f.shade ? "" : " layui-layer-border") + " " + (f.skin || "") + '" id="' + h[0] + d + '" type="' + e.type[f.type] + '" times="' + d + '" showtime="' + f.time + '" conType="' + (a ? "object" : "string") + '" style="z-index: ' + g + "; width:" + f.area[0] + ";height:" + f.area[1] + (f.fix ? "" : ";position:absolute;") + '">' + (a && 2 != f.type ? "" : k) + '<div class="layui-layer-content' + (0 == f.type && -1 !== f.icon ? " layui-layer-padding" : "") + (3 == f.type ? " layui-layer-loading" + f.icon : "") + '">' + (0 == f.type && -1 !== f.icon ? '<i class="layui-layer-ico layui-layer-ico' + f.icon + '"></i>' : "") + (1 == f.type && a ? "" : f.content || "") + '</div><span class="layui-layer-setwin">' + function() {
			var a = j ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : "";
			return f.closeBtn && (a += '<a class="layui-layer-ico ' + h[7] + " " + h[7] + (f.title ? f.closeBtn : 4 == f.type ? "1" : "2") + '" href="javascript:;"></a>'), a
		}() + "</span>" + (f.btn ? function() {
			var a = "";
			"string" == typeof f.btn && (f.btn = [f.btn]);
			for (var b = 0, c = f.btn.length; c > b; b++) a += '<a class="' + h[6] + b + '">' + f.btn[b] + "</a>";
			return '<div class="' + h[6] + '">' + a + "</div>"
		}() : "") + "</div>"], k), c
	}, g.pt.creat = function() {
		var a = this,
			b = a.config,
			g = a.index,
			i = b.content,
			j = "object" == typeof i;
		scrolltop = $(window).scrollTop();
		switch ("string" == typeof b.area && (b.area = "auto" === b.area ? ["", ""] : [b.area, ""]), b.type) {
			case 0:
				b.btn = "btn" in b ? b.btn : e.btn[0], f.closeAll("dialog");
				break;
			case 2:
				var i = b.content = j ? b.content : [b.content || "http://sentsin.com?from=layer", "auto"];
				b.content = '<iframe scrolling="' + (b.content[1] || "auto") + '" allowtransparency="true" id="' + h[4] + g + '" name="' + h[4] + g + '" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + b.content[0] + '"></iframe>';
				break;
			case 3:
				b.title = !1, b.closeBtn = !1, -1 === b.icon && 0 === b.icon, f.closeAll("loading");
				break;
			case 4:
				j || (b.content = [b.content, "body"]), b.follow = b.content[1], b.content = b.content[0] + '<i class="layui-layer-TipsG"></i>', b.title = !1, b.shade = !1, b.fix = !1, b.tips = "object" == typeof b.tips ? b.tips : [b.tips, !0], b.tipsMore || f.closeAll("tips")
		}
		a.vessel(j, function(d, e) {
			c("body").append(d[0]), j ? function() {
				2 == b.type || 4 == b.type ? function() {
					c("body").append(d[1])
				}() : function() {
					i.parents("." + h[0])[0] || (i.show().addClass("layui-layer-wrap").wrap(d[1]), c("#" + h[0] + g).find("." + h[5]).before(e))
				}()
			}() : c("body").append(d[1]), a.layero = c("#" + h[0] + g), b.scrollbar || h.html.css("overflow", "hidden").attr("layer-full", g)
		}).auto(g), 2 == b.type && f.ie6 && a.layero.find("iframe").attr("src", i[0]), c(document).off("keydown", e.enter).on("keydown", e.enter), 4 == b.type ? a.tips() : a.offset(), b.fix && d.on("resize", function() {
			a.offset(), (/^\d+%$/.test(b.area[0]) || /^\d+%$/.test(b.area[1])) && a.auto(g), 4 == b.type && a.tips()
		}), b.time <= 0 || setTimeout(function() {
			f.close(a.index)
		}, b.time), a.move().callback()
	}, g.pt.auto = function(a) {
		function b(a) {
			a = g.find(a), a.height(i[1] - j - k - 2 * (0 | parseFloat(a.css("padding"))))
		}
		var e = this,
			f = e.config,
			g = c("#" + h[0] + a);
		"" === f.area[0] && f.maxWidth > 0 && (/MSIE 7/.test(navigator.userAgent) && f.btn && g.width(g.innerWidth()), g.outerWidth() > f.maxWidth && g.width(f.maxWidth));
		var i = [g.innerWidth(), g.innerHeight()],
			j = g.find(h[1]).outerHeight() || 0,
			k = g.find("." + h[6]).outerHeight() || 0;
		switch (f.type) {
			case 2:
				b("iframe");
				break;
			default:
				"" === f.area[1] ? f.fix && i[1] >= d.height() && (i[1] = d.height(), b("." + h[5])) : b("." + h[5])
		}
		return e
	}, g.pt.offset = function() {
		var a = this,
			b = a.config,
			c = a.layero,
			e = [c.outerWidth(), c.outerHeight()],
			f = "object" == typeof b.offset;
		a.offsetTop = (d.height() - e[1]) / 2, a.offsetLeft = (d.width() - e[0]) / 2, f ? (a.offsetTop = b.offset[0], a.offsetLeft = b.offset[1] || a.offsetLeft) : "auto" !== b.offset && (a.offsetTop = b.offset, "rb" === b.offset && (a.offsetTop = d.height() - e[1], a.offsetLeft = d.width() - e[0])), b.fix || (a.offsetTop = /%$/.test(a.offsetTop) ? d.height() * parseFloat(a.offsetTop) / 100 : parseFloat(a.offsetTop), a.offsetLeft = /%$/.test(a.offsetLeft) ? d.width() * parseFloat(a.offsetLeft) / 100 : parseFloat(a.offsetLeft), a.offsetTop += d.scrollTop(), a.offsetLeft += d.scrollLeft()), c.css({
			top: a.offsetTop,
			left: a.offsetLeft
		})
	}, g.pt.tips = function() {
		var a = this,
			b = a.config,
			e = a.layero,
			f = [e.outerWidth(), e.outerHeight()],
			g = c(b.follow);
		g[0] || (g = c("body"));
		var i = {
				width: g.outerWidth(),
				height: g.outerHeight(),
				top: g.offset().top,
				left: g.offset().left
			},
			j = e.find(".layui-layer-TipsG"),
			k = b.tips[0];
		b.tips[1] || j.remove(), i.autoLeft = function() {
			i.left + f[0] - d.width() > 0 ? (i.tipLeft = i.left + i.width - f[0], j.css({
				right: 12,
				left: "auto"
			})) : i.tipLeft = i.left
		}, i.where = [function() {
			i.autoLeft(), i.tipTop = i.top - f[1] - 10, j.removeClass("layui-layer-TipsB").addClass("layui-layer-TipsT").css("border-right-color", b.tips[1])
		}, function() {
			i.tipLeft = i.left + i.width + 10, i.tipTop = i.top, j.removeClass("layui-layer-TipsL").addClass("layui-layer-TipsR").css("border-bottom-color", b.tips[1])
		}, function() {
			i.autoLeft(), i.tipTop = i.top + i.height + 10, j.removeClass("layui-layer-TipsT").addClass("layui-layer-TipsB").css("border-right-color", b.tips[1])
		}, function() {
			i.tipLeft = i.left - f[0] - 10, i.tipTop = i.top, j.removeClass("layui-layer-TipsR").addClass("layui-layer-TipsL").css("border-bottom-color", b.tips[1])
		}], i.where[k - 1](), 1 === k ? i.top - (d.scrollTop() + f[1] + 16) < 0 && i.where[2]() : 2 === k ? d.width() - (i.left + i.width + f[0] + 16) > 0 || i.where[3]() : 3 === k ? i.top - d.scrollTop() + i.height + f[1] + 16 - d.height() > 0 && i.where[0]() : 4 === k && f[0] + 16 - i.left > 0 && i.where[1](), e.find("." + h[5]).css({
			"background-color": b.tips[1],
			"padding-right": b.closeBtn ? "30px" : ""
		}), e.css({
			left: i.tipLeft,
			top: i.tipTop
		})
	}, g.pt.move = function() {
		var a = this,
			b = a.config,
			e = {
				setY: 0,
				moveLayer: function() {
					var a = e.layero,
						b = parseInt(a.css("margin-left")),
						c = parseInt(e.move.css("left"));
					0 === b || (c -= b), "fixed" !== a.css("position") && (c -= a.parent().offset().left, e.setY = 0), a.css({
						left: c,
						top: parseInt(e.move.css("top")) - e.setY
					})
				}
			},
			f = a.layero.find(b.move);
		return b.move && f.attr("move", "ok"), f.css({
			cursor: b.move ? "move" : "auto"
		}), c(b.move).on("mousedown", function(a) {
			if (a.preventDefault(), "ok" === c(this).attr("move")) {
				e.ismove = !0, e.layero = c(this).parents("." + h[0]);
				var f = e.layero.offset().left,
					g = e.layero.offset().top,
					i = e.layero.outerWidth() - 6,
					j = e.layero.outerHeight() - 6;
				c("#layui-layer-moves")[0] || c("body").append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:' + f + "px; top:" + g + "px; width:" + i + "px; height:" + j + 'px; z-index:2147483584"></div>'), e.move = c("#layui-layer-moves"), b.moveType && e.move.css({
					visibility: "hidden"
				}), e.moveX = a.pageX - e.move.position().left, e.moveY = a.pageY - e.move.position().top, "fixed" !== e.layero.css("position") || (e.setY = d.scrollTop())
			}
		}), c(document).mousemove(function(a) {
			if (e.ismove) {
				var c = a.pageX - e.moveX,
					f = a.pageY - e.moveY;
				if (a.preventDefault(), !b.moveOut) {
					e.setY = d.scrollTop();
					var g = d.width() - e.move.outerWidth(),
						h = e.setY;
					0 > c && (c = 0), c > g && (c = g), h > f && (f = h), f > d.height() - e.move.outerHeight() + e.setY && (f = d.height() - e.move.outerHeight() + e.setY)
				}
				e.move.css({
					left: c,
					top: f
				}), b.moveType && e.moveLayer(), c = f = g = h = null
			}
		}).mouseup(function() {
			try {
				e.ismove && (e.moveLayer(), e.move.remove(), b.moveEnd && b.moveEnd()), e.ismove = !1
			} catch (a) {
				e.ismove = !1
			}
		}), a
	}, g.pt.callback = function() {
		function a() {
			var a = g.cancel && g.cancel(b.index);
			a === !1 || f.close(b.index)
		}
		var b = this,
			d = b.layero,
			g = b.config;
		b.openLayer(), g.success && (2 == g.type ? d.find("iframe")[0].onload = function() {
			this.className = "", g.success(d, b.index)
		} : g.success(d, b.index)), f.ie6 && b.IE6(d), d.find("." + h[6]).children("a").on("click", function() {
			var e = c(this).index();
			g["btn" + (e + 1)] && g["btn" + (e + 1)](b.index, d), 0 === e ? g.yes ? g.yes(b.index, d) : f.close(b.index) : 1 === e ? a() : g["btn" + (e + 1)] || f.close(b.index)
		}), d.find("." + h[7]).on("click", a), g.shadeClose && c("#layui-layer-shade" + b.index).on("click", function() {
			f.close(b.index)
		}), d.find(".layui-layer-min").on("click", function() {
			f.min(b.index, g), g.min && g.min(d)
		}), d.find(".layui-layer-max").on("click", function() {
			c(this).hasClass("layui-layer-maxmin") ? (f.restore(b.index), g.restore && g.restore(d)) : (f.full(b.index, g), g.full && g.full(d))
		}), g.end && (e.end[b.index] = g.end)
	}, e.reselect = function() {
		c.each(c("select"), function(a, b) {
			var d = c(this);
			d.parents("." + h[0])[0] || 1 == d.attr("layer") && c("." + h[0]).length < 1 && d.removeAttr("layer").show(), d = null
		})
	}, g.pt.IE6 = function(a) {
		function b() {
			a.css({
				top: f + (e.config.fix ? d.scrollTop() : 0)
			})
		}
		var e = this,
			f = a.offset().top;
		b(), d.scroll(b), c("select").each(function(a, b) {
			var d = c(this);
			d.parents("." + h[0])[0] || "none" === d.css("display") || d.attr({
				layer: "1"
			}).hide(), d = null
		})
	}, g.pt.openLayer = function() {
		var a = this;
		f.zIndex = a.config.zIndex, f.setTop = function(a) {
			var b = function() {
				f.zIndex++, a.css("z-index", f.zIndex + 1)
			};
			return f.zIndex = parseInt(a[0].style.zIndex), a.on("mousedown", b), f.zIndex
		}
	}, e.record = function(a) {
		var b = [a.outerWidth(), a.outerHeight(), a.position().top, a.position().left + parseFloat(a.css("margin-left"))];
		a.find(".layui-layer-max").addClass("layui-layer-maxmin"), a.attr({
			area: b
		})
	}, e.rescollbar = function(a) {
		h.html.attr("layer-full") == a && (h.html[0].style.removeProperty ? h.html[0].style.removeProperty("overflow") : h.html[0].style.removeAttribute("overflow"), h.html.removeAttr("layer-full"))
	}, f.getChildFrame = function(a, b) {
		return b = b || c("." + h[4]).attr("times"), c("#" + h[0] + b).find("iframe").contents().find(a)
	}, f.getFrameIndex = function(a) {
		return c("#" + a).parents("." + h[4]).attr("times")
	}, f.iframeAuto = function(a) {
		if (a) {
			var b = f.getChildFrame("body", a).outerHeight(),
				d = c("#" + h[0] + a),
				e = d.find(h[1]).outerHeight() || 0,
				g = d.find("." + h[6]).outerHeight() || 0;
			d.css({
				height: b + e + g
			}), d.find("iframe").css({
				height: b
			})
		}
	}, f.iframeSrc = function(a, b) {
		c("#" + h[0] + a).find("iframe").attr("src", b)
	}, f.style = function(a, b) {
		var d = c("#" + h[0] + a),
			f = d.attr("type"),
			g = d.find(h[1]).outerHeight() || 0,
			i = d.find("." + h[6]).outerHeight() || 0;
		(f === e.type[1] || f === e.type[2]) && (d.css(b), f === e.type[2] && d.find("iframe").css({
			height: parseFloat(b.height) - g - i
		}))
	}, f.min = function(a, b) {
		var d = c("#" + h[0] + a),
			g = d.find(h[1]).outerHeight() || 0;
		e.record(d), f.style(a, {
			width: 180,
			height: g,
			overflow: "hidden"
		}), d.find(".layui-layer-min").hide(), "page" === d.attr("type") && d.find(h[4]).hide(), e.rescollbar(a)
	}, f.restore = function(a) {
		var b = c("#" + h[0] + a),
			d = b.attr("area").split(",");
		b.attr("type");
		f.style(a, {
			width: parseFloat(d[0]),
			height: parseFloat(d[1]),
			top: parseFloat(d[2]),
			left: parseFloat(d[3]),
			overflow: "visible"
		}), b.find(".layui-layer-max").removeClass("layui-layer-maxmin"), b.find(".layui-layer-min").show(), "page" === b.attr("type") && b.find(h[4]).show(), e.rescollbar(a)
	}, f.full = function(a) {
		var b, g = c("#" + h[0] + a);
		e.record(g), h.html.attr("layer-full") || h.html.css("overflow", "hidden").attr("layer-full", a), clearTimeout(b), b = setTimeout(function() {
			var b = "fixed" === g.css("position");
			f.style(a, {
				top: b ? 0 : d.scrollTop(),
				left: b ? 0 : d.scrollLeft(),
				width: d.width(),
				height: d.height()
			}), g.find(".layui-layer-min").hide()
		}, 100)
	}, f.title = function(a, b) {
		var d = c("#" + h[0] + (b || f.index)).find(h[1]);
		d.html(a)
	}, f.close = function(a) {
		var b = c("#" + h[0] + a),
			d = b.attr("type");
		if (b[0]) {
			if (d === e.type[1] && "object" === b.attr("conType")) {
				b.children(":not(." + h[5] + ")").remove();
				for (var g = 0; 2 > g; g++) b.find(".layui-layer-wrap").unwrap().hide()
			} else {
				if (d === e.type[2]) try {
					var i = c("#" + h[4] + a)[0];
					i.contentWindow.document.write(""), i.contentWindow.close(), b.find("." + h[5])[0].removeChild(i)
				} catch (j) {}
				b[0].innerHTML = "", b.remove()
			}
			c("#layui-layer-moves, #layui-layer-shade" + a).remove(), f.ie6 && e.reselect(), e.rescollbar(a), c(document).off("keydown", e.enter), "function" == typeof e.end[a] && (e.end[a](),$(window).scrollTop(scrolltop)), delete e.end[a]
		}
	}, f.closeAll = function(a) {
		c.each(c("." + h[0]), function() {
			var b = c(this),
				d = a ? b.attr("type") === a : 1;
			d && f.close(b.attr("times")), d = null
		})
	}, e.run = function() {
		c = jQuery, d = c(a), h.html = c("html"), f.open = function(a) {
			var b = new g(a);
			return b.index
		}
	}, "function" == typeof define ? define(function() {
		return a.layer = f, e.run(), f
	}) : function() {
		a.layer = f, e.run(), f.use("skin/layer.css")
	}()
}(window);
/*! tooltipster v4.1.4 */!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof exports?module.exports=b(require("jquery")):b(jQuery)}(this,function(a){function b(a){this.$container,this.constraints=null,this.__$tooltip,this.__init(a)}function c(b,c){var d=!0;return a.each(b,function(a,e){return void 0===c[a]||b[a]!==c[a]?(d=!1,!1):void 0}),d}function d(b){var c=b.attr("id"),d=c?h.window.document.getElementById(c):null;return d?d===b[0]:a.contains(h.window.document.body,b[0])}function e(){if(!g)return!1;var a=g.document.body||g.document.documentElement,b=a.style,c="transition",d=["Moz","Webkit","Khtml","O","ms"];if("string"==typeof b[c])return!0;c=c.charAt(0).toUpperCase()+c.substr(1);for(var e=0;e<d.length;e++)if("string"==typeof b[d[e]+c])return!0;return!1}var f={animation:"fade",animationDuration:350,content:null,contentAsHTML:!1,contentCloning:!1,debug:!0,delay:300,delayTouch:[300,500],functionInit:null,functionBefore:null,functionReady:null,functionAfter:null,functionFormat:null,IEmin:6,interactive:!1,multiple:!1,parent:"body",plugins:["sideTip"],repositionOnScroll:!1,restoration:"none",selfDestruction:!0,theme:[],timer:0,trackerInterval:500,trackOrigin:!1,trackTooltip:!1,trigger:"hover",triggerClose:{click:!1,mouseleave:!1,originClick:!1,scroll:!1,tap:!1,touchleave:!1},triggerOpen:{click:!1,mouseenter:!1,tap:!1,touchstart:!1},updateAnimation:"rotate",zIndex:9999999},g="undefined"!=typeof window?window:null,h={hasTouchCapability:!(!g||!("ontouchstart"in g||g.DocumentTouch&&g.document instanceof g.DocumentTouch||g.navigator.maxTouchPoints)),hasTransitions:e(),IE:!1,semVer:"4.1.4",window:g},i=function(){this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__instancesLatestArr=[],this.__plugins={},this._env=h};i.prototype={__bridge:function(b,c,d){if(!c[d]){var e=function(){};e.prototype=b;var g=new e;g.__init&&g.__init(c),a.each(b,function(a,b){0!=a.indexOf("__")&&(c[a]?f.debug&&console.log("The "+a+" method of the "+d+" plugin conflicts with another plugin or native methods"):(c[a]=function(){return g[a].apply(g,Array.prototype.slice.apply(arguments))},c[a].bridged=g))}),c[d]=g}return this},__setWindow:function(a){return h.window=a,this},_getRuler:function(a){return new b(a)},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_plugin:function(b){var c=this;if("string"==typeof b){var d=b,e=null;return d.indexOf(".")>0?e=c.__plugins[d]:a.each(c.__plugins,function(a,b){return b.name.substring(b.name.length-d.length-1)=="."+d?(e=b,!1):void 0}),e}if(b.name.indexOf(".")<0)throw new Error("Plugins must be namespaced");return c.__plugins[b.name]=b,b.core&&c.__bridge(b.core,c,b.name),this},_trigger:function(){var a=Array.prototype.slice.apply(arguments);return"string"==typeof a[0]&&(a[0]={type:a[0]}),this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,a),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,a),this},instances:function(b){var c=[],d=b||".tooltipstered";return a(d).each(function(){var b=a(this),d=b.data("tooltipster-ns");d&&a.each(d,function(a,d){c.push(b.data(d))})}),c},instancesLatest:function(){return this.__instancesLatestArr},off:function(){return this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},origins:function(b){var c=b?b+" ":"";return a(c+".tooltipstered").toArray()},setDefaults:function(b){return a.extend(f,b),this},triggerHandler:function(){return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.tooltipster=new i,a.Tooltipster=function(b,c){this.__callbacks={close:[],open:[]},this.__closingTime,this.__Content,this.__contentBcr,this.__destroyed=!1,this.__destroying=!1,this.__$emitterPrivate=a({}),this.__$emitterPublic=a({}),this.__enabled=!0,this.__garbageCollector,this.__Geometry,this.__lastPosition,this.__namespace="tooltipster-"+Math.round(1e6*Math.random()),this.__options,this.__$originParents,this.__pointerIsOverOrigin=!1,this.__previousThemes=[],this.__state="closed",this.__timeouts={close:[],open:null},this.__touchEvents=[],this.__tracker=null,this._$origin,this._$tooltip,this.__init(b,c)},a.Tooltipster.prototype={__init:function(b,c){var d=this;if(d._$origin=a(b),d.__options=a.extend(!0,{},f,c),d.__optionsFormat(),!h.IE||h.IE>=d.__options.IEmin){var e=null;if(void 0===d._$origin.data("tooltipster-initialTitle")&&(e=d._$origin.attr("title"),void 0===e&&(e=null),d._$origin.data("tooltipster-initialTitle",e)),null!==d.__options.content)d.__contentSet(d.__options.content);else{var g,i=d._$origin.attr("data-tooltip-content");i&&(g=a(i)),g&&g[0]?d.__contentSet(g.first()):d.__contentSet(e)}d._$origin.removeAttr("title").addClass("tooltipstered"),d.__prepareOrigin(),d.__prepareGC(),a.each(d.__options.plugins,function(a,b){d._plug(b)}),h.hasTouchCapability&&a("body").on("touchmove."+d.__namespace+"-triggerOpen",function(a){d._touchRecordEvent(a)}),d._on("created",function(){d.__prepareTooltip()})._on("repositioned",function(a){d.__lastPosition=a.position})}else d.__options.disabled=!0},__contentInsert:function(){var a=this,b=a._$tooltip.find(".tooltipster-content"),c=a.__Content,d=function(a){c=a};return a._trigger({type:"format",content:a.__Content,format:d}),a.__options.functionFormat&&(c=a.__options.functionFormat.call(a,a,{origin:a._$origin[0]},a.__Content)),"string"!=typeof c||a.__options.contentAsHTML?b.empty().append(c):b.text(c),a},__contentSet:function(b){return b instanceof a&&this.__options.contentCloning&&(b=b.clone(!0)),this.__Content=b,this._trigger({type:"updated",content:b}),this},__destroyError:function(){throw new Error("This tooltip has been destroyed and cannot execute your method call.")},__geometry:function(){var b=this,c=b._$origin,d=b._$origin.is("area");if(d){var e=b._$origin.parent().attr("name");c=a('img[usemap="#'+e+'"]')}var f=c[0].getBoundingClientRect(),g=a(h.window.document),i=a(h.window),j=c,k={available:{document:null,window:null},document:{size:{height:g.height(),width:g.width()}},window:{scroll:{left:h.window.scrollX||h.window.document.documentElement.scrollLeft,top:h.window.scrollY||h.window.document.documentElement.scrollTop},size:{height:i.height(),width:i.width()}},origin:{fixedLineage:!1,offset:{},size:{height:f.bottom-f.top,width:f.right-f.left},usemapImage:d?c[0]:null,windowOffset:{bottom:f.bottom,left:f.left,right:f.right,top:f.top}}};if(d){var l=b._$origin.attr("shape"),m=b._$origin.attr("coords");if(m&&(m=m.split(","),a.map(m,function(a,b){m[b]=parseInt(a)})),"default"!=l)switch(l){case"circle":var n=m[0],o=m[1],p=m[2],q=o-p,r=n-p;k.origin.size.height=2*p,k.origin.size.width=k.origin.size.height,k.origin.windowOffset.left+=r,k.origin.windowOffset.top+=q;break;case"rect":var s=m[0],t=m[1],u=m[2],v=m[3];k.origin.size.height=v-t,k.origin.size.width=u-s,k.origin.windowOffset.left+=s,k.origin.windowOffset.top+=t;break;case"poly":for(var w=0,x=0,y=0,z=0,A="even",B=0;B<m.length;B++){var C=m[B];"even"==A?(C>y&&(y=C,0===B&&(w=y)),w>C&&(w=C),A="odd"):(C>z&&(z=C,1==B&&(x=z)),x>C&&(x=C),A="even")}k.origin.size.height=z-x,k.origin.size.width=y-w,k.origin.windowOffset.left+=w,k.origin.windowOffset.top+=x}}var D=function(a){k.origin.size.height=a.height,k.origin.windowOffset.left=a.left,k.origin.windowOffset.top=a.top,k.origin.size.width=a.width};for(b._trigger({type:"geometry",edit:D,geometry:{height:k.origin.size.height,left:k.origin.windowOffset.left,top:k.origin.windowOffset.top,width:k.origin.size.width}}),k.origin.windowOffset.right=k.origin.windowOffset.left+k.origin.size.width,k.origin.windowOffset.bottom=k.origin.windowOffset.top+k.origin.size.height,k.origin.offset.left=k.origin.windowOffset.left+k.window.scroll.left,k.origin.offset.top=k.origin.windowOffset.top+k.window.scroll.top,k.origin.offset.bottom=k.origin.offset.top+k.origin.size.height,k.origin.offset.right=k.origin.offset.left+k.origin.size.width,k.available.document={bottom:{height:k.document.size.height-k.origin.offset.bottom,width:k.document.size.width},left:{height:k.document.size.height,width:k.origin.offset.left},right:{height:k.document.size.height,width:k.document.size.width-k.origin.offset.right},top:{height:k.origin.offset.top,width:k.document.size.width}},k.available.window={bottom:{height:Math.max(k.window.size.height-Math.max(k.origin.windowOffset.bottom,0),0),width:k.window.size.width},left:{height:k.window.size.height,width:Math.max(k.origin.windowOffset.left,0)},right:{height:k.window.size.height,width:Math.max(k.window.size.width-Math.max(k.origin.windowOffset.right,0),0)},top:{height:Math.max(k.origin.windowOffset.top,0),width:k.window.size.width}};"html"!=j[0].tagName.toLowerCase();){if("fixed"==j.css("position")){k.origin.fixedLineage=!0;break}j=j.parent()}return k},__optionsFormat:function(){return"number"==typeof this.__options.animationDuration&&(this.__options.animationDuration=[this.__options.animationDuration,this.__options.animationDuration]),"number"==typeof this.__options.delay&&(this.__options.delay=[this.__options.delay,this.__options.delay]),"number"==typeof this.__options.delayTouch&&(this.__options.delayTouch=[this.__options.delayTouch,this.__options.delayTouch]),"string"==typeof this.__options.theme&&(this.__options.theme=[this.__options.theme]),"string"==typeof this.__options.parent&&(this.__options.parent=a(this.__options.parent)),"hover"==this.__options.trigger?(this.__options.triggerOpen={mouseenter:!0,touchstart:!0},this.__options.triggerClose={mouseleave:!0,originClick:!0,touchleave:!0}):"click"==this.__options.trigger&&(this.__options.triggerOpen={click:!0,tap:!0},this.__options.triggerClose={click:!0,tap:!0}),this._trigger("options"),this},__prepareGC:function(){var b=this;return b.__options.selfDestruction?b.__garbageCollector=setInterval(function(){var c=(new Date).getTime();b.__touchEvents=a.grep(b.__touchEvents,function(a,b){return c-a.time>6e4}),d(b._$origin)||b.destroy()},2e4):clearInterval(b.__garbageCollector),b},__prepareOrigin:function(){var a=this;if(a._$origin.off("."+a.__namespace+"-triggerOpen"),h.hasTouchCapability&&a._$origin.on("touchstart."+a.__namespace+"-triggerOpen touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen",function(b){a._touchRecordEvent(b)}),a.__options.triggerOpen.click||a.__options.triggerOpen.tap&&h.hasTouchCapability){var b="";a.__options.triggerOpen.click&&(b+="click."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.tap&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&a._open(b)})}if(a.__options.triggerOpen.mouseenter||a.__options.triggerOpen.touchstart&&h.hasTouchCapability){var b="";a.__options.triggerOpen.mouseenter&&(b+="mouseenter."+a.__namespace+"-triggerOpen "),a.__options.triggerOpen.touchstart&&h.hasTouchCapability&&(b+="touchstart."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){!a._touchIsTouchEvent(b)&&a._touchIsEmulatedEvent(b)||(a.__pointerIsOverOrigin=!0,a._openShortly(b))})}if(a.__options.triggerClose.mouseleave||a.__options.triggerClose.touchleave&&h.hasTouchCapability){var b="";a.__options.triggerClose.mouseleave&&(b+="mouseleave."+a.__namespace+"-triggerOpen "),a.__options.triggerClose.touchleave&&h.hasTouchCapability&&(b+="touchend."+a.__namespace+"-triggerOpen touchcancel."+a.__namespace+"-triggerOpen"),a._$origin.on(b,function(b){a._touchIsMeaningfulEvent(b)&&(a.__pointerIsOverOrigin=!1)})}return a},__prepareTooltip:function(){var b=this,c=b.__options.interactive?"auto":"";return b._$tooltip.attr("id",b.__namespace).css({"pointer-events":c,zIndex:b.__options.zIndex}),a.each(b.__previousThemes,function(a,c){b._$tooltip.removeClass(c)}),a.each(b.__options.theme,function(a,c){b._$tooltip.addClass(c)}),b.__previousThemes=a.merge([],b.__options.theme),b},__scrollHandler:function(b){var c=this;if(c.__options.triggerClose.scroll)c._close(b);else{if(b.target===h.window.document)c.__Geometry.origin.fixedLineage||c.__options.repositionOnScroll&&c.reposition(b);else{var d=c.__geometry(),e=!1;if("fixed"!=c._$origin.css("position")&&c.__$originParents.each(function(b,c){var f=a(c),g=f.css("overflow-x"),h=f.css("overflow-y");if("visible"!=g||"visible"!=h){var i=c.getBoundingClientRect();if("visible"!=g&&(d.origin.windowOffset.left<i.left||d.origin.windowOffset.right>i.right))return e=!0,!1;if("visible"!=h&&(d.origin.windowOffset.top<i.top||d.origin.windowOffset.bottom>i.bottom))return e=!0,!1}return"fixed"==f.css("position")?!1:void 0}),e)c._$tooltip.css("visibility","hidden");else if(c._$tooltip.css("visibility","visible"),c.__options.repositionOnScroll)c.reposition(b);else{var f=d.origin.offset.left-c.__Geometry.origin.offset.left,g=d.origin.offset.top-c.__Geometry.origin.offset.top;c._$tooltip.css({left:c.__lastPosition.coord.left+f,top:c.__lastPosition.coord.top+g})}}c._trigger({type:"scroll",event:b})}return c},__stateSet:function(a){return this.__state=a,this._trigger({type:"state",state:a}),this},__timeoutsClear:function(){return clearTimeout(this.__timeouts.open),this.__timeouts.open=null,a.each(this.__timeouts.close,function(a,b){clearTimeout(b)}),this.__timeouts.close=[],this},__trackerStart:function(){var a=this,b=a._$tooltip.find(".tooltipster-content");return a.__options.trackTooltip&&(a.__contentBcr=b[0].getBoundingClientRect()),a.__tracker=setInterval(function(){if(d(a._$origin)&&d(a._$tooltip)){if(a.__options.trackOrigin){var e=a.__geometry(),f=!1;c(e.origin.size,a.__Geometry.origin.size)&&(a.__Geometry.origin.fixedLineage?c(e.origin.windowOffset,a.__Geometry.origin.windowOffset)&&(f=!0):c(e.origin.offset,a.__Geometry.origin.offset)&&(f=!0)),f||(a.__options.triggerClose.mouseleave?a._close():a.reposition())}if(a.__options.trackTooltip){var g=b[0].getBoundingClientRect();g.height===a.__contentBcr.height&&g.width===a.__contentBcr.width||(a.reposition(),a.__contentBcr=g)}}else a._close()},a.__options.trackerInterval),a},_close:function(b,c){var d=this,e=!0;if(d._trigger({type:"close",event:b,stop:function(){e=!1}}),e||d.__destroying){c&&d.__callbacks.close.push(c),d.__callbacks.open=[],d.__timeoutsClear();var f=function(){a.each(d.__callbacks.close,function(a,c){c.call(d,d,{event:b,origin:d._$origin[0]})}),d.__callbacks.close=[]};if("closed"!=d.__state){var g=!0,i=new Date,j=i.getTime(),k=j+d.__options.animationDuration[1];if("disappearing"==d.__state&&k>d.__closingTime&&(g=!1),g){d.__closingTime=k,"disappearing"!=d.__state&&d.__stateSet("disappearing");var l=function(){clearInterval(d.__tracker),d._trigger({type:"closing",event:b}),d._$tooltip.off("."+d.__namespace+"-triggerClose").removeClass("tooltipster-dying"),a(h.window).off("."+d.__namespace+"-triggerClose"),d.__$originParents.each(function(b,c){a(c).off("scroll."+d.__namespace+"-triggerClose")}),d.__$originParents=null,a("body").off("."+d.__namespace+"-triggerClose"),d._$origin.off("."+d.__namespace+"-triggerClose"),d._off("dismissable"),d.__stateSet("closed"),d._trigger({type:"after",event:b}),d.__options.functionAfter&&d.__options.functionAfter.call(d,d,{event:b,origin:d._$origin[0]}),f()};h.hasTransitions?(d._$tooltip.css({"-moz-animation-duration":d.__options.animationDuration[1]+"ms","-ms-animation-duration":d.__options.animationDuration[1]+"ms","-o-animation-duration":d.__options.animationDuration[1]+"ms","-webkit-animation-duration":d.__options.animationDuration[1]+"ms","animation-duration":d.__options.animationDuration[1]+"ms","transition-duration":d.__options.animationDuration[1]+"ms"}),d._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"),d.__options.animationDuration[1]>0&&d._$tooltip.delay(d.__options.animationDuration[1]),d._$tooltip.queue(l)):d._$tooltip.stop().fadeOut(d.__options.animationDuration[1],l)}}else f()}return d},_off:function(){return this.__$emitterPrivate.off.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_on:function(){return this.__$emitterPrivate.on.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_one:function(){return this.__$emitterPrivate.one.apply(this.__$emitterPrivate,Array.prototype.slice.apply(arguments)),this},_open:function(b,c){var e=this;if(!e.__destroying&&d(e._$origin)&&e.__enabled){var f=!0;if("closed"==e.__state&&(e._trigger({type:"before",event:b,stop:function(){f=!1}}),f&&e.__options.functionBefore&&(f=e.__options.functionBefore.call(e,e,{event:b,origin:e._$origin[0]}))),f!==!1&&null!==e.__Content){c&&e.__callbacks.open.push(c),e.__callbacks.close=[],e.__timeoutsClear();var g,i=function(){"stable"!=e.__state&&e.__stateSet("stable"),a.each(e.__callbacks.open,function(a,b){b.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}),e.__callbacks.open=[]};if("closed"!==e.__state)g=0,"disappearing"===e.__state?(e.__stateSet("appearing"),h.hasTransitions?(e._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i)):e._$tooltip.stop().fadeIn(i)):"stable"==e.__state&&i();else{if(e.__stateSet("appearing"),g=e.__options.animationDuration[0],e.__contentInsert(),e.reposition(b,!0),h.hasTransitions?(e._$tooltip.addClass("tooltipster-"+e.__options.animation).addClass("tooltipster-initial").css({"-moz-animation-duration":e.__options.animationDuration[0]+"ms","-ms-animation-duration":e.__options.animationDuration[0]+"ms","-o-animation-duration":e.__options.animationDuration[0]+"ms","-webkit-animation-duration":e.__options.animationDuration[0]+"ms","animation-duration":e.__options.animationDuration[0]+"ms","transition-duration":e.__options.animationDuration[0]+"ms"}),setTimeout(function(){"closed"!=e.__state&&(e._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"),e.__options.animationDuration[0]>0&&e._$tooltip.delay(e.__options.animationDuration[0]),e._$tooltip.queue(i))},0)):e._$tooltip.css("display","none").fadeIn(e.__options.animationDuration[0],i),e.__trackerStart(),a(h.window).on("resize."+e.__namespace+"-triggerClose",function(a){e.reposition(a)}).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)}),e.__$originParents=e._$origin.parents(),e.__$originParents.each(function(b,c){a(c).on("scroll."+e.__namespace+"-triggerClose",function(a){e.__scrollHandler(a)})}),e.__options.triggerClose.mouseleave||e.__options.triggerClose.touchleave&&h.hasTouchCapability){e._on("dismissable",function(a){a.dismissable?a.delay?(m=setTimeout(function(){e._close(a.event)},a.delay),e.__timeouts.close.push(m)):e._close(a):clearTimeout(m)});var j=e._$origin,k="",l="",m=null;e.__options.interactive&&(j=j.add(e._$tooltip)),e.__options.triggerClose.mouseleave&&(k+="mouseenter."+e.__namespace+"-triggerClose ",l+="mouseleave."+e.__namespace+"-triggerClose "),e.__options.triggerClose.touchleave&&h.hasTouchCapability&&(k+="touchstart."+e.__namespace+"-triggerClose",l+="touchend."+e.__namespace+"-triggerClose touchcancel."+e.__namespace+"-triggerClose"),j.on(l,function(a){if(e._touchIsTouchEvent(a)||!e._touchIsEmulatedEvent(a)){var b="mouseleave"==a.type?e.__options.delay:e.__options.delayTouch;e._trigger({delay:b[1],dismissable:!0,event:a,type:"dismissable"})}}).on(k,function(a){!e._touchIsTouchEvent(a)&&e._touchIsEmulatedEvent(a)||e._trigger({dismissable:!1,event:a,type:"dismissable"})})}e.__options.triggerClose.originClick&&e._$origin.on("click."+e.__namespace+"-triggerClose",function(a){e._touchIsTouchEvent(a)||e._touchIsEmulatedEvent(a)||e._close(a)}),(e.__options.triggerClose.click||e.__options.triggerClose.tap&&h.hasTouchCapability)&&setTimeout(function(){if("closed"!=e.__state){var b="";e.__options.triggerClose.click&&(b+="click."+e.__namespace+"-triggerClose "),e.__options.triggerClose.tap&&h.hasTouchCapability&&(b+="touchend."+e.__namespace+"-triggerClose"),a("body").on(b,function(b){e._touchIsMeaningfulEvent(b)&&(e._touchRecordEvent(b),e.__options.interactive&&a.contains(e._$tooltip[0],b.target)||e._close(b))}),e.__options.triggerClose.tap&&h.hasTouchCapability&&a("body").on("touchstart."+e.__namespace+"-triggerClose",function(a){e._touchRecordEvent(a)})}},0),e._trigger("ready"),e.__options.functionReady&&e.__options.functionReady.call(e,e,{origin:e._$origin[0],tooltip:e._$tooltip[0]})}if(e.__options.timer>0){var m=setTimeout(function(){e._close()},e.__options.timer+g);e.__timeouts.close.push(m)}}}return e},_openShortly:function(a){var b=this,c=!0;if("stable"!=b.__state&&"appearing"!=b.__state&&!b.__timeouts.open&&(b._trigger({type:"start",event:a,stop:function(){c=!1}}),c)){var d=0==a.type.indexOf("touch")?b.__options.delayTouch:b.__options.delay;d[0]?b.__timeouts.open=setTimeout(function(){b.__timeouts.open=null,b.__pointerIsOverOrigin&&b._touchIsMeaningfulEvent(a)?(b._trigger("startend"),b._open(a)):b._trigger("startcancel")},d[0]):(b._trigger("startend"),b._open(a))}return b},_optionsExtract:function(b,c){var d=this,e=a.extend(!0,{},c),f=d.__options[b];return f||(f={},a.each(c,function(a,b){var c=d.__options[a];void 0!==c&&(f[a]=c)})),a.each(e,function(b,c){void 0!==f[b]&&("object"!=typeof c||c instanceof Array||null==c||"object"!=typeof f[b]||f[b]instanceof Array||null==f[b]?e[b]=f[b]:a.extend(e[b],f[b]))}),e},_plug:function(b){var c=a.tooltipster._plugin(b);if(!c)throw new Error('The "'+b+'" plugin is not defined');return c.instance&&a.tooltipster.__bridge(c.instance,this,c.name),this},_touchIsEmulatedEvent:function(a){for(var b=!1,c=(new Date).getTime(),d=this.__touchEvents.length-1;d>=0;d--){var e=this.__touchEvents[d];if(!(c-e.time<500))break;e.target===a.target&&(b=!0)}return b},_touchIsMeaningfulEvent:function(a){return this._touchIsTouchEvent(a)&&!this._touchSwiped(a.target)||!this._touchIsTouchEvent(a)&&!this._touchIsEmulatedEvent(a)},_touchIsTouchEvent:function(a){return 0==a.type.indexOf("touch")},_touchRecordEvent:function(a){return this._touchIsTouchEvent(a)&&(a.time=(new Date).getTime(),this.__touchEvents.push(a)),this},_touchSwiped:function(a){for(var b=!1,c=this.__touchEvents.length-1;c>=0;c--){var d=this.__touchEvents[c];if("touchmove"==d.type){b=!0;break}if("touchstart"==d.type&&a===d.target)break}return b},_trigger:function(){var b=Array.prototype.slice.apply(arguments);return"string"==typeof b[0]&&(b[0]={type:b[0]}),b[0].instance=this,b[0].origin=this._$origin?this._$origin[0]:null,b[0].tooltip=this._$tooltip?this._$tooltip[0]:null,this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate,b),a.tooltipster._trigger.apply(a.tooltipster,b),this.__$emitterPublic.trigger.apply(this.__$emitterPublic,b),this},_unplug:function(b){var c=this;if(c[b]){var d=a.tooltipster._plugin(b);d.instance&&a.each(d.instance,function(a,d){c[a]&&c[a].bridged===c[b]&&delete c[a]}),c[b].__destroy&&c[b].__destroy(),delete c[b]}return c},close:function(a){return this.__destroyed?this.__destroyError():this._close(null,a),this},content:function(a){var b=this;if(void 0===a)return b.__Content;if(b.__destroyed)b.__destroyError();else if(b.__contentSet(a),null!==b.__Content){if("closed"!==b.__state&&(b.__contentInsert(),b.reposition(),b.__options.updateAnimation))if(h.hasTransitions){var c=b.__options.updateAnimation;b._$tooltip.addClass("tooltipster-update-"+c),setTimeout(function(){"closed"!=b.__state&&b._$tooltip.removeClass("tooltipster-update-"+c)},1e3)}else b._$tooltip.fadeTo(200,.5,function(){"closed"!=b.__state&&b._$tooltip.fadeTo(200,1)})}else b._close();return b},destroy:function(){var b=this;return b.__destroyed?b.__destroyError():b.__destroying||(b.__destroying=!0,b._close(null,function(){b._trigger("destroy"),b.__destroying=!1,b.__destroyed=!0,b._$origin.removeData(b.__namespace).off("."+b.__namespace+"-triggerOpen"),a("body").off("."+b.__namespace+"-triggerOpen");var c=b._$origin.data("tooltipster-ns");if(c)if(1===c.length){var d=null;"previous"==b.__options.restoration?d=b._$origin.data("tooltipster-initialTitle"):"current"==b.__options.restoration&&(d="string"==typeof b.__Content?b.__Content:a("<div></div>").append(b.__Content).html()),d&&b._$origin.attr("title",d),b._$origin.removeClass("tooltipstered"),b._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")}else c=a.grep(c,function(a,c){return a!==b.__namespace}),b._$origin.data("tooltipster-ns",c);b._trigger("destroyed"),b._off(),b.off(),b.__Content=null,b.__$emitterPrivate=null,b.__$emitterPublic=null,b.__options.parent=null,b._$origin=null,b._$tooltip=null,a.tooltipster.__instancesLatestArr=a.grep(a.tooltipster.__instancesLatestArr,function(a,c){return b!==a}),clearInterval(b.__garbageCollector)})),b},disable:function(){return this.__destroyed?(this.__destroyError(),this):(this._close(),this.__enabled=!1,this)},elementOrigin:function(){return this.__destroyed?void this.__destroyError():this._$origin[0]},elementTooltip:function(){return this._$tooltip?this._$tooltip[0]:null},enable:function(){return this.__enabled=!0,this},hide:function(a){return this.close(a)},instance:function(){return this},off:function(){return this.__destroyed||this.__$emitterPublic.off.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},on:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.on.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},one:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.one.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this},open:function(a){return this.__destroyed||this.__destroying?this.__destroyError():this._open(null,a),this},option:function(b,c){return void 0===c?this.__options[b]:(this.__destroyed?this.__destroyError():(this.__options[b]=c,this.__optionsFormat(),a.inArray(b,["trigger","triggerClose","triggerOpen"])>=0&&this.__prepareOrigin(),"selfDestruction"===b&&this.__prepareGC()),this)},reposition:function(a,b){var c=this;return c.__destroyed?c.__destroyError():(d(c._$tooltip)||b)&&(b||c._$tooltip.detach(),c.__Geometry=c.__geometry(),c._trigger({type:"reposition",event:a,helper:{geo:c.__Geometry}})),c},show:function(a){return this.open(a)},status:function(){return{destroyed:this.__destroyed,destroying:this.__destroying,enabled:this.__enabled,open:"closed"!==this.__state,state:this.__state}},triggerHandler:function(){return this.__destroyed?this.__destroyError():this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic,Array.prototype.slice.apply(arguments)),this}},a.fn.tooltipster=function(){var b=Array.prototype.slice.apply(arguments),c="You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";if(0===this.length)return this;if("string"==typeof b[0]){var d="#*$~&";return this.each(function(){var e=a(this).data("tooltipster-ns"),f=e?a(this).data(e[0]):null;if(!f)throw new Error("You called Tooltipster's \""+b[0]+'" method on an uninitialized element');if("function"!=typeof f[b[0]])throw new Error('Unknown method "'+b[0]+'"');this.length>1&&"content"==b[0]&&(b[1]instanceof a||"object"==typeof b[1]&&null!=b[1]&&b[1].tagName)&&!f.__options.contentCloning&&f.__options.debug&&console.log(c);var g=f[b[0]](b[1],b[2]);return g!==f||"instance"===b[0]?(d=g,!1):void 0}),"#*$~&"!==d?d:this}a.tooltipster.__instancesLatestArr=[];var e=b[0]&&void 0!==b[0].multiple,g=e&&b[0].multiple||!e&&f.multiple,h=b[0]&&void 0!==b[0].content,i=h&&b[0].content||!h&&f.content,j=b[0]&&void 0!==b[0].contentCloning,k=j&&b[0].contentCloning||!j&&f.contentCloning,l=b[0]&&void 0!==b[0].debug,m=l&&b[0].debug||!l&&f.debug;return this.length>1&&(i instanceof a||"object"==typeof i&&null!=i&&i.tagName)&&!k&&m&&console.log(c),this.each(function(){var c=!1,d=a(this),e=d.data("tooltipster-ns"),f=null;e?g?c=!0:m&&(console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."),console.log(this)):c=!0,c&&(f=new a.Tooltipster(this,b[0]),e||(e=[]),e.push(f.__namespace),d.data("tooltipster-ns",e),d.data(f.__namespace,f),f.__options.functionInit&&f.__options.functionInit.call(f,f,{origin:this}),f._trigger("init")),a.tooltipster.__instancesLatestArr.push(f)}),this},b.prototype={__init:function(b){this.__$tooltip=b,this.__$tooltip.css({left:0,overflow:"hidden",position:"absolute",top:0}).find(".tooltipster-content").css("overflow","auto"),this.$container=a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo("body")},__forceRedraw:function(){var a=this.__$tooltip.parent();this.__$tooltip.detach(),this.__$tooltip.appendTo(a)},constrain:function(a,b){return this.constraints={width:a,height:b},this.__$tooltip.css({display:"block",height:"",overflow:"auto",width:a}),this},destroy:function(){this.__$tooltip.detach().find(".tooltipster-content").css({display:"",overflow:""}),this.$container.remove()},free:function(){return this.constraints=null,this.__$tooltip.css({display:"",height:"",overflow:"visible",width:""}),this},measure:function(){this.__forceRedraw();var a=this.__$tooltip[0].getBoundingClientRect(),b={size:{height:a.height||a.bottom,width:a.width||a.right}};if(this.constraints){var c=this.__$tooltip.find(".tooltipster-content"),d=this.__$tooltip.outerHeight(),e=c[0].getBoundingClientRect(),f={height:d<=this.constraints.height,width:a.width<=this.constraints.width&&e.width>=c[0].scrollWidth-1};b.fits=f.height&&f.width}return h.IE&&h.IE<=11&&(b.size.width=Math.ceil(b.size.width)+1),b}};var j=navigator.userAgent.toLowerCase();-1!=j.indexOf("msie")?h.IE=parseInt(j.split("msie")[1]):-1!==j.toLowerCase().indexOf("trident")&&-1!==j.indexOf(" rv:11")?h.IE=11:-1!=j.toLowerCase().indexOf("edge/")&&(h.IE=parseInt(j.toLowerCase().split("edge/")[1]));var k="tooltipster.sideTip";return a.tooltipster._plugin({name:k,instance:{__defaults:function(){return{arrow:!0,distance:6,functionPosition:null,maxWidth:null,minIntersection:16,minWidth:0,position:null,side:"top",viewportAware:!0}},__init:function(a){var b=this;b.__instance=a,b.__namespace="tooltipster-sideTip-"+Math.round(1e6*Math.random()),b.__previousState="closed",b.__options,b.__optionsFormat(),b.__instance._on("state."+b.__namespace,function(a){"closed"==a.state?b.__close():"appearing"==a.state&&"closed"==b.__previousState&&b.__create(),b.__previousState=a.state}),b.__instance._on("options."+b.__namespace,function(){b.__optionsFormat()}),b.__instance._on("reposition."+b.__namespace,function(a){b.__reposition(a.event,a.helper)})},__close:function(){this.__instance.content()instanceof a&&this.__instance.content().detach(),this.__instance._$tooltip.remove(),this.__instance._$tooltip=null},__create:function(){var b=a('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');this.__options.arrow||b.find(".tooltipster-box").css("margin",0).end().find(".tooltipster-arrow").hide(),this.__options.minWidth&&b.css("min-width",this.__options.minWidth+"px"),this.__options.maxWidth&&b.css("max-width",this.__options.maxWidth+"px"),this.__instance._$tooltip=b,this.__instance._trigger("created")},__destroy:function(){this.__instance._off("."+self.__namespace)},__optionsFormat:function(){var b=this;if(b.__options=b.__instance._optionsExtract(k,b.__defaults()),b.__options.position&&(b.__options.side=b.__options.position),"object"!=typeof b.__options.distance&&(b.__options.distance=[b.__options.distance]),b.__options.distance.length<4&&(void 0===b.__options.distance[1]&&(b.__options.distance[1]=b.__options.distance[0]),
void 0===b.__options.distance[2]&&(b.__options.distance[2]=b.__options.distance[0]),void 0===b.__options.distance[3]&&(b.__options.distance[3]=b.__options.distance[1]),b.__options.distance={top:b.__options.distance[0],right:b.__options.distance[1],bottom:b.__options.distance[2],left:b.__options.distance[3]}),"string"==typeof b.__options.side){var c={top:"bottom",right:"left",bottom:"top",left:"right"};b.__options.side=[b.__options.side,c[b.__options.side]],"left"==b.__options.side[0]||"right"==b.__options.side[0]?b.__options.side.push("top","bottom"):b.__options.side.push("right","left")}6===a.tooltipster._env.IE&&b.__options.arrow!==!0&&(b.__options.arrow=!1)},__reposition:function(b,c){var d,e=this,f=e.__targetFind(c),g=[];e.__instance._$tooltip.detach();var h=e.__instance._$tooltip.clone(),i=a.tooltipster._getRuler(h),j=!1;switch(a.each(["window","document"],function(d,k){var l=null;if(e.__instance._trigger({container:k,helper:c,satisfied:j,takeTest:function(a){l=a},results:g,type:"positionTest"}),1==l||0!=l&&0==j&&("window"!=k||e.__options.viewportAware))for(var d=0;d<e.__options.side.length;d++){var m={horizontal:0,vertical:0},n=e.__options.side[d];"top"==n||"bottom"==n?m.vertical=e.__options.distance[n]:m.horizontal=e.__options.distance[n],e.__sideChange(h,n),a.each(["natural","constrained"],function(a,d){if(l=null,e.__instance._trigger({container:k,event:b,helper:c,mode:d,results:g,satisfied:j,side:n,takeTest:function(a){l=a},type:"positionTest"}),1==l||0!=l&&0==j){var h={container:k,distance:m,fits:null,mode:d,outerSize:null,side:n,size:null,target:f[n],whole:null},o="natural"==d?i.free():i.constrain(c.geo.available[k][n].width-m.horizontal,c.geo.available[k][n].height-m.vertical),p=o.measure();if(h.size=p.size,h.outerSize={height:p.size.height+m.vertical,width:p.size.width+m.horizontal},"natural"==d?c.geo.available[k][n].width>=h.outerSize.width&&c.geo.available[k][n].height>=h.outerSize.height?h.fits=!0:h.fits=!1:h.fits=p.fits,"window"==k&&(h.fits?"top"==n||"bottom"==n?h.whole=c.geo.origin.windowOffset.right>=e.__options.minIntersection&&c.geo.window.size.width-c.geo.origin.windowOffset.left>=e.__options.minIntersection:h.whole=c.geo.origin.windowOffset.bottom>=e.__options.minIntersection&&c.geo.window.size.height-c.geo.origin.windowOffset.top>=e.__options.minIntersection:h.whole=!1),g.push(h),h.whole)j=!0;else if("natural"==h.mode&&(h.fits||h.size.width<=c.geo.available[k][n].width))return!1}})}}),e.__instance._trigger({edit:function(a){g=a},event:b,helper:c,results:g,type:"positionTested"}),g.sort(function(a,b){if(a.whole&&!b.whole)return-1;if(!a.whole&&b.whole)return 1;if(a.whole&&b.whole){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}if(a.fits&&!b.fits)return-1;if(!a.fits&&b.fits)return 1;if(a.fits&&b.fits){var c=e.__options.side.indexOf(a.side),d=e.__options.side.indexOf(b.side);return d>c?-1:c>d?1:"natural"==a.mode?-1:1}return"document"==a.container&&"bottom"==a.side&&"natural"==a.mode?-1:1}),d=g[0],d.coord={},d.side){case"left":case"right":d.coord.top=Math.floor(d.target-d.size.height/2);break;case"bottom":case"top":d.coord.left=Math.floor(d.target-d.size.width/2)}switch(d.side){case"left":d.coord.left=c.geo.origin.windowOffset.left-d.outerSize.width;break;case"right":d.coord.left=c.geo.origin.windowOffset.right+d.distance.horizontal;break;case"top":d.coord.top=c.geo.origin.windowOffset.top-d.outerSize.height;break;case"bottom":d.coord.top=c.geo.origin.windowOffset.bottom+d.distance.vertical}"window"==d.container?"top"==d.side||"bottom"==d.side?d.coord.left<0?c.geo.origin.windowOffset.right-this.__options.minIntersection>=0?d.coord.left=0:d.coord.left=c.geo.origin.windowOffset.right-this.__options.minIntersection-1:d.coord.left>c.geo.window.size.width-d.size.width&&(c.geo.origin.windowOffset.left+this.__options.minIntersection<=c.geo.window.size.width?d.coord.left=c.geo.window.size.width-d.size.width:d.coord.left=c.geo.origin.windowOffset.left+this.__options.minIntersection+1-d.size.width):d.coord.top<0?c.geo.origin.windowOffset.bottom-this.__options.minIntersection>=0?d.coord.top=0:d.coord.top=c.geo.origin.windowOffset.bottom-this.__options.minIntersection-1:d.coord.top>c.geo.window.size.height-d.size.height&&(c.geo.origin.windowOffset.top+this.__options.minIntersection<=c.geo.window.size.height?d.coord.top=c.geo.window.size.height-d.size.height:d.coord.top=c.geo.origin.windowOffset.top+this.__options.minIntersection+1-d.size.height):(d.coord.left>c.geo.window.size.width-d.size.width&&(d.coord.left=c.geo.window.size.width-d.size.width),d.coord.left<0&&(d.coord.left=0)),e.__sideChange(h,d.side),c.tooltipClone=h[0],c.tooltipParent=e.__instance.option("parent").parent[0],c.mode=d.mode,c.whole=d.whole,c.origin=e.__instance._$origin[0],c.tooltip=e.__instance._$tooltip[0],delete d.container,delete d.fits,delete d.mode,delete d.outerSize,delete d.whole,d.distance=d.distance.horizontal||d.distance.vertical;var k=a.extend(!0,{},d);if(e.__instance._trigger({edit:function(a){d=a},event:b,helper:c,position:k,type:"position"}),e.__options.functionPosition){var l=e.__options.functionPosition.call(e,e.__instance,c,k);l&&(d=l)}i.destroy();var m,n;"top"==d.side||"bottom"==d.side?(m={prop:"left",val:d.target-d.coord.left},n=d.size.width-this.__options.minIntersection):(m={prop:"top",val:d.target-d.coord.top},n=d.size.height-this.__options.minIntersection),m.val<this.__options.minIntersection?m.val=this.__options.minIntersection:m.val>n&&(m.val=n);var o;o=c.geo.origin.fixedLineage?c.geo.origin.windowOffset:{left:c.geo.origin.windowOffset.left+c.geo.window.scroll.left,top:c.geo.origin.windowOffset.top+c.geo.window.scroll.top},d.coord={left:o.left+(d.coord.left-c.geo.origin.windowOffset.left),top:o.top+(d.coord.top-c.geo.origin.windowOffset.top)},e.__sideChange(e.__instance._$tooltip,d.side),c.geo.origin.fixedLineage?e.__instance._$tooltip.css("position","fixed"):e.__instance._$tooltip.css("position",""),e.__instance._$tooltip.css({left:d.coord.left,top:d.coord.top,height:d.size.height,width:d.size.width}).find(".tooltipster-arrow").css({left:"",top:""}).css(m.prop,m.val),e.__instance._$tooltip.appendTo(e.__instance.option("parent")),e.__instance._trigger({type:"repositioned",event:b,position:d})},__sideChange:function(a,b){a.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-"+b)},__targetFind:function(a){var b={},c=this.__instance._$origin[0].getClientRects();if(c.length>1){var d=this.__instance._$origin.css("opacity");1==d&&(this.__instance._$origin.css("opacity",.99),c=this.__instance._$origin[0].getClientRects(),this.__instance._$origin.css("opacity",1))}if(c.length<2)b.top=Math.floor(a.geo.origin.windowOffset.left+a.geo.origin.size.width/2),b.bottom=b.top,b.left=Math.floor(a.geo.origin.windowOffset.top+a.geo.origin.size.height/2),b.right=b.left;else{var e=c[0];b.top=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil(c.length/2)-1]:c[0],b.right=Math.floor(e.top+(e.bottom-e.top)/2),e=c[c.length-1],b.bottom=Math.floor(e.left+(e.right-e.left)/2),e=c.length>2?c[Math.ceil((c.length+1)/2)-1]:c[c.length-1],b.left=Math.floor(e.top+(e.bottom-e.top)/2)}return b}}}),a});