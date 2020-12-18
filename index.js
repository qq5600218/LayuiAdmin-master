layui.define(["layer", "element", "jquery"], function (exports) {
    // 已知还未处理的问题
    // 1.字体定制
    // 2.iframe页面主题定制（目前处理了主框架主题切换时，只是向iframe注入了同等样式）
    // 3.侧边菜单栏收起点击会导致菜单底色都变色
    // 4.ie8下主题定制面板样式兼容问题
    var $ = layui.jquery,
        element = layui.element,
        layer = layui.layer,
        $body = $("body"),
        $root = $("#LAY_app"),
        $themeStyle = $('#LAY_layadmin_theme'),
        shrinkModeClass = "layadmin-side-shrink",
        spreadModeClass = "layadmin-side-spread-sm",
        iconfont = "layui-icon",
        $shrinkToggle = $("#LAY_app_flexible"),
        $shrinkToggleIcon = $("#LAY_app_flexible>.layui-icon"),
        shrinkIconClass = "layui-icon-spread-left",
        expandIconClass = "layui-icon-shrink-right",
        $fullScreenToggle = $("#LAY_app_fullscreen"),
        $fullScreenToggleIcon = $("#LAY_app_fullscreen>.layui-icon"),
        fullScreenIconClass = "layui-icon-screen-full",
        exitScreenIconClass = "layui-icon-screen-restore",
        menuTab = "layadmin-layout-tabs",
        $tabHeader = $("#LAY_app_tabsheader"),
        $tabContent = $("#LAY_app_content"),
        layuiShow = "layui-show",
        layuiThis = "layui-this",
        tabCurrentIndex = 0,
        smallSideWidth = 60,
        $window = $(window),
        $side = $("#LAY_app_side"),
        $right = $("#LAY_app_right"),
        $sideSplit = $("#LAY_app_side_split"),
        $sideMenuItem = $(".sf-nav-scroll-box>.layui-nav-tree"),
        $sideMenuShade = $(".sf-side-menu-shade"),
        $sideMenuShadeItem = $(".sf-side-menu-shade>.layui-nav-item"),
        $sideNavTree = $('[lay-filter="layadmin-side-nav"]'),
        SF = function () {
            var _self = this;
            // 主题ID
            this.themeID = 0;
            // 侧边栏宽度
            this.sidePageX = 220;
            // 字体大小
            this.fontSize = 14;
            // 侧边栏是否收起
            this.collapsed = 0;
            // 主题颜色
            this.themeList = [{
                    headerBgColor: '#1aa094',
                    headerColor: "#FFF",
                    logoBgColor: '#243346',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#FFF',
                    headerColor: "#333",
                    logoBgColor: '#243346',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#23262e',
                    headerColor: "#FFF",
                    logoBgColor: '#0c0c0c',
                    leftMenuBgColor: '#23262e',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#ffa4d1',
                    headerColor: "#FFF",
                    logoBgColor: '#e694bd',
                    leftMenuBgColor: '#1f1f1f',
                    leftMenuActiveBgColor: '#ffa4d1',
                    leftMenuHoverBgColor: '#1f1f1f',
                },
                {
                    headerBgColor: '#1aa094',
                    headerColor: "#FFF",
                    logoBgColor: '#0c0c0c',
                    leftMenuBgColor: '#23262e',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#1e9fff',
                    headerColor: "#FFF",
                    logoBgColor: '#0c0c0c',
                    leftMenuBgColor: '#1f1f1f',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },

                {
                    headerBgColor: '#ffb800',
                    headerColor: "#FFF",
                    logoBgColor: '#243346',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#e82121',
                    headerColor: "#FFF",
                    logoBgColor: '#0c0c0c',
                    leftMenuBgColor: '#1f1f1f',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#963885',
                    headerColor: "#FFF",
                    logoBgColor: '#243346',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#1e9fff',
                    headerColor: "#FFF",
                    logoBgColor: '#0069b7',
                    leftMenuBgColor: '#1f1f1f',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#ffb800',
                    headerColor: "#FFF",
                    logoBgColor: '#d09600',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#e82121',
                    headerColor: "#FFF",
                    logoBgColor: '#d91f1f',
                    leftMenuBgColor: '#1f1f1f',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                },
                {
                    headerBgColor: '#963885',
                    headerColor: "#FFF",
                    logoBgColor: '#772c6a',
                    leftMenuBgColor: '#2f4056',
                    leftMenuActiveBgColor: '#1aa094',
                    leftMenuHoverBgColor: '#3b3f4b',
                }
            ];
            // 子iframe
            this.iframeList = [];
            /**
             * 系统配置
             * @param key
             */
            this.config = function (key) {
                var configObj = {
                    themeID: 0,
                };
                return configObj[key];
            };
            // 用户习惯
            this.userHabit = {
                keys: ["themeID", "fontSize", "sidePageX", "collapsed"],
                clearAll: function () { // 只清除用户习惯
                    $.each(this.keys, function (index, key) {
                        localStorage.removeItem(key);
                    })
                },
                getAll: function () { // 获取所有
                    var self = this;
                    var res = {};
                    $.each(this.keys, function (index, key) {
                        res[key] = self[key].get();
                    })
                    return res;
                },
                themeID: { // 主题ID
                    get: function () {
                        return localStorage.getItem("themeID");
                    },
                    set: function (themeID) {
                        _self.themeID = themeID;
                        localStorage.setItem("themeID", themeID);
                    },
                    clear: function () {
                        localStorage.removeItem("themeID");
                    }
                },
                fontSize: { // 字体大小（显示模式）
                    get: function () {
                        return localStorage.getItem("fontSize");
                    },
                    set: function (fontSize) {
                        localStorage.setItem("fontSize", fontSize);
                    },
                    clear: function () {
                        localStorage.removeItem("fontSize");
                    }
                },
                sidePageX: { // 侧边栏宽度
                    get: function () {
                        return localStorage.getItem("sidePageX");
                    },
                    set: function (sidePageX) {
                        _self.sidePageX = sidePageX;
                        localStorage.setItem("sidePageX", sidePageX);
                    },
                    clear: function () {
                        localStorage.removeItem("sidePageX");
                    }
                },
                collapsed: { // 侧边栏是否折叠
                    get: function () {
                        return localStorage.getItem("collapsed");
                    },
                    set: function (collapsed) {
                        _self.collapsed = collapsed;
                        localStorage.setItem("collapsed", collapsed);
                    },
                    clear: function () {
                        localStorage.removeItem("collapsed");
                    }
                },
                tabs: { // tab页签
                    get: function () {
                        return localStorage.getItem("tabs");
                    },
                    set: function (tabId, href, title) {
                        var _tabs = this.get();
                        if (_tabs) {
                            _tabs = JSON.parse(_tabs);
                        } else {
                            _tabs = {};
                        }
                        _tabs[tabId] = {
                            tabId: tabId,
                            href: href,
                            title: title,
                            active: true,
                        }
                        localStorage.setItem("tabs", JSON.stringify(_tabs));
                    },
                    setActive: function (index) {
                        var _tabs = this.get();
                        if (_tabs) {
                            _tabs = JSON.parse(_tabs);
                            var i = 0;
                            for (var key in _tabs) {
                                if (i == index) {
                                    _tabs[key].active = true;
                                } else {
                                    _tabs[key].active = false;
                                }
                                i++;
                            }
                            localStorage.setItem("tabs", JSON.stringify(_tabs));
                        }
                    },
                    removeItem: function (index) {
                        var _tabs = this.get();
                        if (_tabs) {
                            _tabs = JSON.parse(_tabs);
                            var keys = [];
                            for (var key in _tabs) {
                                keys.push(key);
                            }
                            $.each(keys, function (i, key) {
                                if (i == index) {
                                    delete _tabs[key];
                                }
                                if (i == keys.length) {
                                    _tabs[key].active = true;
                                }
                                localStorage.setItem("tabs", JSON.stringify(_tabs));
                            })
                        }
                    },
                    clear: function () {
                        localStorage.removeItem("tabs");
                    }
                }
            }
            /**
             * 将iframe页面推入
             */
            this.subscribe = function (iframe) {
                var record = {
                    ref: iframe,
                    id: new Date().valueOf()
                };
                this.setIframeTheme([record]);
                this.iframeList.push(record);
            }
            /**
             * 左右侧分割拖动线
             */
            this.initSplit = function () {
                $sideSplit.css({
                    left: this.sidePageX
                });
                var placeHolder = $("<div></div>");
                placeHolder.css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                });
                $sideSplit.on("mousedown", function () {
                    $sideSplit.css({
                        backgroundColor: "#d1d1d1"
                    });
                    // fixed iframe鼠标拖动bug
                    $($tabContent.children()[tabCurrentIndex]).find("iframe").parent().append(placeHolder);
                    $(document).on("mousemove", function (e) {
                        $sideSplit.css({
                            left: e.pageX
                        });
                    }).on("mouseup", function (e) {
                        $sideSplit.css({
                            backgroundColor: ""
                        });
                        var pageX = e.pageX;
                        _self.userHabit.sidePageX.set(pageX);
                        $side.css({
                            width: pageX
                        });
                        $right.css({
                            left: pageX
                        });
                        $tabContent.css({
                            left: pageX
                        });
                        placeHolder.remove();
                        $(document).off("mousemove mouseup");
                    });
                });
            }
            /**
             * 模块初始化
             */
            this.init = function () {
                var habit = this.userHabit.getAll();
                this.themeID = habit.themeID || 0;
                this.sidePageX = habit.sidePageX ? Math.abs(parseFloat(habit.sidePageX)) : 220;
                this.fontSize = habit.fontSize > 0 ? habit.fontSize : 14;
                this.collapsed = habit.collapsed || 0;
                this.setTheme();
                this.initPageMode();
                this.initSplit();
                  // 添加首页
                  this.tabAdd("indexPage.html", "indexPage.html", '<i\
                  class="layui-icon layui-icon-home"></i><i\
                  class="layui-icon layui-unselect layui-tab-close"></i>');
                // 创建主题样式html片段
                this.themeSelectHtml = this.buildThemeSelectHtml();
                $window.on("resize", function () {
                    _self.setMode();
                    $tabHeader.css({
                        left: 0
                    })
                });

                // 初始化tabs （后面抽取）
                var tabs = this.userHabit.tabs.get();
                if (tabs) {
                    tabs = JSON.parse(tabs);
                    $.each(tabs, function (key, item) {
                        _self.tabAdd(item.tabId, item.href, item.title);
                        if (item.active) {
                            _self.tabChange(key);
                        }
                    })
                }
            }
            /**
             * 菜单初始化
             */
            this.initMenu = function (source, mapping) {
                mapping = mapping || {};
                var title = mapping.title || "title";
                var icon = mapping.icon || "icon";
                var url = mapping.url || "url";
                var children = mapping.child || "children";
                var leftMenuHtml = "";

                $.each(source, function (index, menu) {
                    leftMenuHtml += '<li class="layui-nav-item">\n';
                    if (menu[children] && menu[children].length) {
                        leftMenuHtml += '<a href="javascript:;"><i class="iconfont ' + menu[icon] + '"></i><cite> ' + menu[title] + '</cite></a>';
                        var buildChildHtml = function (html, child, level) {
                            var w = 38 + level * 18;
                            level++;
                            html += '<dl class="layui-nav-child">\n';
                            $.each(child, function (childIndex, childMenu) {
                                html += '<dd>\n';
                                if (childMenu[children] && childMenu[children].length) {
                                    html += '<a href="javascript:;" style="padding-left: ' + w + 'px"><i class="iconfont ' + childMenu[icon] + '"></i><cite> ' + childMenu[title] + '</cite></a>';
                                    html = buildChildHtml(html, childMenu[children], level);
                                } else {
                                    html += '<a href="javascript:;" style="padding-left: ' + w + 'px"  lay-href="' + childMenu[url] + '"><i class="iconfont ' + childMenu[icon] + '"></i><cite> ' + childMenu[title] + '</cite></a>\n';
                                }
                                html += '</dd>\n';
                            });
                            html += '</dl>\n';
                            return html;
                        };
                        leftMenuHtml = buildChildHtml(leftMenuHtml, menu[children], 0);
                    } else {
                        leftMenuHtml += '<a href="javascript:;" lay-href="' + menu[url] + '"><i class="iconfont ' + menu[icon] + '"></i><cite> ' + menu[title] + '</cite></a>\n';
                    }
                    leftMenuHtml += '</li>\n';
                });

                $sideNavTree.html(leftMenuHtml);
                element.render("nav", "layadmin-side-nav");
            }
            /**
             * 页面模式初始化
             */
            this.initPageMode = function () {
                if (this.isPcScreen()) {
                    if (this.collapsed == 1) {
                        $shrinkToggle.attr("title", "展开");
                        $shrinkToggleIcon.attr("class", iconfont + " " + shrinkIconClass);
                        $root.addClass(shrinkModeClass);
                        $side.css({
                            width: smallSideWidth
                        });
                        $right.css({
                            left: smallSideWidth
                        });
                        $tabContent.css({
                            left: smallSideWidth
                        });
                        this.shrinkSideMenu.on();
                    } else {
                        $side.css({
                            width: this.sidePageX
                        });
                        $right.css({
                            left: this.sidePageX
                        });
                        $tabContent.css({
                            left: this.sidePageX
                        });
                    }
                } else {
                    $shrinkToggle.attr("title", "展开");
                    $shrinkToggleIcon.attr("class", iconfont + " " + shrinkIconClass);
                }
            }
            /**
             * 设置页面模式
             */
            this.setMode = function () {
                if (this.isPcScreen()) {
                    $root.removeClass(spreadModeClass);
                    if (this.collapsed == 1) {
                        $shrinkToggle.attr("title", "展开");
                        $shrinkToggleIcon.attr("class", iconfont + " " + shrinkIconClass);
                        $root.addClass(shrinkModeClass);
                        $side.css({
                            width: smallSideWidth
                        });
                        $right.css({
                            left: smallSideWidth
                        });
                        $tabContent.css({
                            left: smallSideWidth
                        });
                    } else {
                        $shrinkToggle.attr("title", "收起");
                        $shrinkToggleIcon.attr("class", iconfont + " " + expandIconClass);
                        $side.css({
                            width: this.sidePageX
                        });
                        $right.css({
                            left: this.sidePageX
                        });
                        $tabContent.css({
                            left: this.sidePageX
                        });
                    }
                } else {
                    $shrinkToggle.attr("title", "展开");
                    $shrinkToggleIcon.attr("class", iconfont + " " + shrinkIconClass);
                    $side.attr("style", "");
                    $right.attr("style", "");
                    $tabContent.attr("style", "");
                    $root.attr("class", "");
                    this.shrinkSideMenu.off();
                }
            }
            /**
             * 是否为PC
             */
            this.isPcScreen = function () {
                return $window.width() >= 992;
            }
            /**
             * 设置iframe主题
             * @param list
             */
            this.setIframeTheme = function (list) {
                var styleHtml = this.joinThemeClass(this.themeID);
                $.each(list, function (index, item) {
                    var body;
                    if (item.ref.contentDocument) {
                        body = $(item.ref.contentDocument.body);
                    } else {
                        body = $(item.ref.document.body);
                    }
                    var styleEle = body.find("#" + item.id);
                    if (styleEle.length == 0) {
                        styleEle = $('<style id="' + item.id + '"></style>')
                    }
                    // ie8
                    if ("styleSheet" in styleEle[0]) {
                        styleEle[0].setAttribute('type', 'text/css');
                        styleEle[0].styleSheet.cssText = styleHtml;
                    } else {
                        styleEle.html(styleHtml);
                    }
                    body.append(styleEle);
                })
            }
            /**
             * 组装主题样式
             * @param themeID
             * @return styleHtml
             */
            this.joinThemeClass = function (themeID) {
                var themeData = this.getThemeData(themeID);
                var styleHtml = ".sf-layout-right-header{background-color: " + themeData.headerBgColor + " !important;}" +
                    ".sf-layout-right-header .layui-nav .layui-nav-item>a, .layui-layout-admin .layui-header .layui-nav .layui-nav-item>a cite{color:" + themeData.headerColor + " !important;}" +
                    ".sf-layout-right-header .sf-flexible{color:" + themeData.headerColor + " !important;}" +
                    ".sf-layout-right-header .layui-nav .layui-nav-more{border-top-color:" + themeData.headerColor + " !important;}" +
                    ".sf-layout-right-header .layui-nav .layui-nav-mored{border-color: transparent transparent " + themeData.headerColor + " !important;}" +
                    ".sf-layout-right-header .layui-nav .layui-nav-bar{background-color:" + themeData.headerColor + " !important;}" +
                    ".sf-logo{background-color:" + themeData.logoBgColor + " !important;}" +
                    ".sf-layout-left .sf-nav-scroll .layui-nav .layui-this, .sf-layout-left .sf-nav-scroll .layui-nav .layui-nav-bar, .sf-layout-left .sf-nav-scroll .layui-nav .layui-this a{background-color:" + themeData.headerBgColor + " !important;}" +
                    ".sf-layout-left .sf-nav-scroll, .sf-layout-left .sf-nav-scroll .layui-nav{background-color:" + themeData.leftMenuBgColor + " !important;}";
                return styleHtml;
            }
            /**
             * 设置主题
             * @param themeID
             */
            this.setTheme = function (themeID) {
                this.setIframeTheme(this.iframeList);
                var styles = this.joinThemeClass(themeID);
                // ie8
                if ("styleSheet" in $themeStyle[0]) {
                    $themeStyle[0].setAttribute('type', 'text/css');
                    $themeStyle[0].styleSheet.cssText = styles;
                } else {
                    $themeStyle.html(styles);
                }
            };
            /**
             * 获取主题ID
             * @param themeID
             * @return themeID
             */
            this.getThemeID = function (themeID) {
                var configThemeId = this.config("themeID");
                return themeID || this.themeID || configThemeId || 0;
            };
            /**
             * 获取主题颜色数据
             * @param themeID
             * @return {}
             */
            this.getThemeData = function (themeID) {
                return this.themeList[this.getThemeID(themeID)];
            };
            /**
             * 构建主题选择html片段
             * @return {string}
             */
            this.buildThemeSelectHtml = function () {
                var html = "";
                var themeID = this.getThemeID();
                $.each(this.themeList, function (key, val) {
                    if (key == themeID) {
                        html += '<li layadmin-event="selectTheme" class="sf-theme-active" data-theme-id="' + key + '">';
                    } else {
                        html += '<li layadmin-event="selectTheme" data-theme-id="' + key + '">';
                    }
                    html += '<ul>' +
                        '<li style="background-color: ' + val.logoBgColor + '"></li>' +
                        '<li style="background-color: ' + val.headerBgColor + '"></li>' +
                        '<li style="background-color: ' + val.leftMenuBgColor + '"></li></ul></li>';
                });
                return html;
            };
            /**
             * 添加新Tab
             * @param tabId
             * @param href
             * @param title
             */
            this.tabAdd = function (tabId, href, title) {
                var hadOpen = false;
                $.each($tabHeader.children(), function (index, item) {
                    if ($(item).attr("lay-id") === tabId) {
                        hadOpen = true;
                        return;
                    }
                });
                if (hadOpen) {
                    this.tabChange(tabId);
                } else {
                    element.tabAdd(menuTab, {
                        title: title,
                        content: '<div class="sf-anim-fadein"><iframe id="' + tabId + '" onload="layui.sf.subscribe(this)" width="100%" height="100%" frameborder="0" src="' + href + '"></iframe></div>',
                        id: tabId
                    });
                    // 缓存前台
                    this.userHabit.tabs.set(tabId, href, title);
                }
            };
            /**
             * 删除指定Tab项
             * @param tabId
             */
            this.tabDelete = function (tabId) {
                element.tabDelete(menuTab, tabId);
            };
            /**
             * 切换到指定Tab项
             * @param tabId
             */
            this.tabChange = function (tabId) {
                element.tabChange(menuTab, tabId);
            };
            /**
             * 标签页左右滚动
             * @param  
             */
            this.rollPage = function (direction) {
                var scrollWidth = $tabHeader.prop("scrollWidth");
                var outerWidth = $tabHeader.outerWidth();
                var oldLeft = Math.abs(parseFloat($tabHeader.css("left")));
                if (direction == "left") {
                    if (oldLeft > 0) {
                        oldLeft -= outerWidth;
                        if (oldLeft < 0) {
                            oldLeft = 0;
                        }
                        $tabHeader.css({
                            left: -oldLeft
                        })
                    }
                } else {
                    if (oldLeft < scrollWidth - outerWidth) {
                        oldLeft += outerWidth;
                        if (oldLeft > scrollWidth - outerWidth) {
                            oldLeft = scrollWidth - outerWidth;
                        }
                        $tabHeader.css({
                            left: -oldLeft
                        })
                    }
                }
            };
            // 缩略菜单 菜单查看处理
            this.shrinkSideMenu = {
                on: function () { // 事件绑定
                    var ele = null;
                    var flag = true;
                    $sideMenuItem.on("mouseenter", ".layui-nav-item>a", function () {
                        var self = $(this);
                        self = $(this);
                        $sideMenuShade.css({
                            top: self.offset().top
                        });
                        ele = self.siblings();
                        $sideMenuShadeItem.html(ele);
                        $sideMenuShade.on("mouseenter", function () {
                            flag = false;
                        });
                        $sideMenuShade.on("mouseleave", function () {
                            self.parent().append(ele);
                            element.render("nav", "layadmin-side-nav");
                        });
                    });
                    $sideMenuItem.on("mouseleave", ".layui-nav-item>a", function () {
                        var self = $(this);
                        (function (ele) {
                            setTimeout(function () {
                                if (flag) {
                                    self.parent().append(ele);
                                    element.render("nav", "layadmin-side-nav");
                                }
                                flag = true;
                            }, 20)
                        })(ele)
                    });
                },
                off: function () { // 事件解绑
                    $sideMenuShade.off("mouseenter mouseleave");
                    $sideMenuItem.off("mouseenter mouseleave");
                }
            }
        },
        sf = new SF(),
        // 事件处理
        events = {
            // 左侧菜单栏伸缩切换
            flexible: function () {
                if ($shrinkToggle.attr("title") == "展开") {
                    $shrinkToggle.attr("title", "收起");
                    $shrinkToggleIcon.removeClass(shrinkIconClass).addClass(expandIconClass);
                    if (sf.isPcScreen()) {
                        $root.removeClass(shrinkModeClass);
                        $side.css({
                            width: sf.sidePageX
                        });
                        $right.css({
                            left: sf.sidePageX
                        });
                        $tabContent.css({
                            left: sf.sidePageX
                        });
                        sf.shrinkSideMenu.off();
                    } else {
                        $root.addClass(spreadModeClass);
                        $side.css({
                            width: 200
                        });
                        $right.css({
                            left: 200
                        });
                        $tabContent.css({
                            left: 200
                        });
                    }
                    sf.userHabit.collapsed.set(0);
                } else {
                    $shrinkToggle.attr("title", "展开");
                    $shrinkToggleIcon.removeClass(expandIconClass).addClass(shrinkIconClass);
                    if (sf.isPcScreen()) {
                        $root.addClass(shrinkModeClass);
                        $side.css({
                            width: smallSideWidth
                        });
                        $right.css({
                            left: smallSideWidth
                        });
                        $tabContent.css({
                            left: smallSideWidth
                        });
                        sf.shrinkSideMenu.on();
                    } else {
                        $root.removeClass(spreadModeClass);
                        $side.css({
                            width: sf.sidePageX
                        });
                        $right.css({
                            left: 0
                        });
                        $tabContent.css({
                            left: 0
                        });
                    }
                    sf.userHabit.collapsed.set(1);
                }
            },
            // 主题色切换
            theme: function () {
                var html = '<div class="sf-theme">' +
                    '<div class="sf-theme-title">配色方案</div>' +
                    '<ul class="sf-theme-content">' + sf.themeSelectHtml + '</ul>' +
                    '</div>';
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shade: 0.1,
                    anim: -1,
                    shadeClose: true,
                    id: "sfThemeBox",
                    area: "300px",
                    offset: "r",
                    skin: "layui-anim sf-anim-rl sf-theme-layer",
                    content: html
                });
            },
            // 选择主题处理
            selectTheme: function (e) {
                var themeID = e.attr("data-theme-id");
                e.siblings().removeClass("sf-theme-active");
                e.addClass("sf-theme-active");
                sf.userHabit.themeID.set(themeID);
                sf.setTheme(themeID);
            },
            // 全屏切换
            fullscreen: function () {
                if ($fullScreenToggle.attr("title") === "开启全屏") {
                    var el = document.documentElement,
                        fsFn = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                    if (typeof fsFn != "undefined" && fsFn) {
                        fsFn.call(el);
                        $fullScreenToggle.attr("title", "取消全屏");
                        $fullScreenToggleIcon.removeClass(fullScreenIconClass).addClass(exitScreenIconClass);
                    }
                } else {
                    document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen();
                    $fullScreenToggle.attr("title", "开启全屏");
                    $fullScreenToggleIcon.removeClass(exitScreenIconClass).addClass(fullScreenIconClass);
                }
            },
            // 页面跳转链接
            pageLink: function (e) {
                var href = e.attr("lay-href");
                var text = e.text();
                sf.tabAdd(href, href, text);
                sf.tabChange(href);
            },
            // 关闭当前标签页
            closeThisTabs: function () {
                var ce = $tabHeader.children()[tabCurrentIndex];
                if (ce && tabCurrentIndex !== 0) {
                    sf.tabDelete($(ce).attr("lay-id"));
                }
            },
            // 关闭其它标签页
            closeOtherTabs: function () {
                $.each($tabHeader.children(), function (index, item) {
                    if (index !== 0 && index !== tabCurrentIndex) {
                        sf.tabDelete($(item).attr("lay-id"));
                    }
                });
                // 剩首页及当前页
                tabCurrentIndex = 1;
            },
            // 关闭全部标签页
            closeAllTabs: function () {
                $.each($tabHeader.children(), function (index, item) {
                    if (index !== 0) {
                        sf.tabDelete($(item).attr("lay-id"));
                    }
                });
                // 重置到首页
                tabCurrentIndex = 0;
            },
            // 遮罩层点击
            shade: function () {
                sf.setMode();
            },
            // 标签滚动(左)
            leftPage: function () {
                sf.rollPage("left")
            },
            // 标签滚动(右)
            rightPage: function () {
                sf.rollPage()
            },
            // 刷新当前标签iframe
            refresh: function () {
                $($tabContent.children()[tabCurrentIndex]).find("iframe")[0].contentWindow.location.reload();
            },
            // 在浏览器新页签中打开当前标签iframe
            openInNewTab: function () {
                window.open($($tabContent.children()[tabCurrentIndex]).find("iframe")[0].src);
            }
        };
    // 标签切换事件处理    
    element.on("tab(" + menuTab + ")", function (data) {
        tabCurrentIndex = data.index;
        sf.userHabit.tabs.setActive(data.index);
    });
    // 标签删除事件处理  
    element.on("tabDelete(" + menuTab + ")", function (data) {
        sf.userHabit.tabs.removeItem(data.index);
        if (data.index < tabCurrentIndex) {
            tabCurrentIndex -= 1;
        }
    });
    // 标签页操作nav事件处理
    element.on("nav(layadmin-pagetabs-nav)", function (elem) {
        var parent = elem.parent();
        parent.removeClass(layuiThis);
        parent.parent().removeClass(layuiShow);
    });
    // 点击事件代理及处理   
    $body.on("click", "*[layadmin-event]", function () { // 普通点击
        var e = $(this);
        var eventName = e.attr("layadmin-event");
        events[eventName] && events[eventName].call(this, e);
    }).on("click", "*[lay-href]", function () { // 页面链接
        var e = $(this);
        events.pageLink(e);
    });
    // 导出模块
    exports("sf", sf);
})