var Wokhan = {
    ServerLess: {
        IsBundled: false,
        Pages: [],
        Actions: {
            PageLoad: null,
            PageUnload: null,
            PageOpen: []
        },
        Modules: {
            Count: 0,
            InitCount: 0,
            Types: { Global: "global", Local: "local" },
            innerlist: {},
            initAll: function () {
                for (var module in this.innerlist) {
                    this.innerlist[module].init();
                }
            },
            applyAll: function (container) {
                container = container || document.getElementById("container");//body;
                for (var module in this.innerlist) {
                    this.innerlist[module].apply(container);
                }
            },
            get: function (moduleName) {
                return this.innerlist[moduleName];
            },
            add: function (module) {
                this.innerlist[module.name] = module;
            },
            enabledirect: function (name) {
                var m = Wokhan.ServerLess.Modules.get(name);
                m.init();
                Wokhan.ServerLess.Modules.InitCount++;
                m.apply(document.getElementById("container"));
            },
            enable: function (name) {
                if (Wokhan.ServerLess.IsBundled) {
                    this.enabledirect(name);
                } else {
                    Wokhan.ServerLess.Engine.addJS("serverless/modules/" + name + "/module.js", function () { Wokhan.ServerLess.Modules.enabledirect(name); });
                }
            }
        },
        Engine: {
            _currentpage: null,
            _headsrc: null,
            init: function () {
                _headsrc = document.head.querySelector("script[data-serverless-script]");
                var modules = _headsrc.getAttribute("data-modules");
                Wokhan.ServerLess.IsBundled = _headsrc.getAttribute("data-serverless-script") === "bundled";

                if (modules !== null) {
                    modules.split(",").forEach(function (it, ix, ar) {
                        Wokhan.ServerLess.Modules.Count++;
                        Wokhan.ServerLess.Engine.log("Core", "Loading module: " + it);
                        Wokhan.ServerLess.Modules.enable(it);
                    });
                }

                window.setTimeout(this.subinit, 1);
            },
            subinit: function () {
                if (Wokhan.ServerLess.Modules.InitCount !== Wokhan.ServerLess.Modules.Count) {
                    Wokhan.ServerLess.Engine.log("Core", "Not ready (" + Wokhan.ServerLess.Modules.InitCount + "/" + Wokhan.ServerLess.Modules.Count + "), delaying...");
                    window.setTimeout(Wokhan.ServerLess.Engine.subinit, 1);
                    return;
                }

                var xp = document.querySelectorAll(".page");
                for (var i = 0; i < xp.length; i++) {
                    Wokhan.ServerLess.Pages.push(xp[i]);
                }

                Wokhan.ServerLess.Engine.openpage(location.hash !== "" ? location.hash.substr(1) : Wokhan.ServerLess.Pages[0]);

                window.addEventListener("hashchange", function (e) {
                    var pid = location.hash.substr(1);
                    if (Wokhan.ServerLess.Engine._currentpage === null || pid !== Wokhan.ServerLess.Engine._currentpage.id) {
                        Wokhan.ServerLess.Engine.openpage(pid);
                    }
                });
                //TODO: change
                window.addEventListener("beforeunload", function () {
                    Wokhan.ServerLess.Engine.openpage(Wokhan.ServerLess.Pages[0]);
                });
            },
            openpage: function (pageorid) {
                var page = pageorid.style ? pageorid : document.getElementById(pageorid);
                var pageidx = Wokhan.ServerLess.Pages.indexOf(page);
                var cpageidx = Wokhan.ServerLess.Pages.indexOf(this._currentpage);

                if (Wokhan.ServerLess.Actions.PageLoad) {
                    Wokhan.ServerLess.Actions.PageLoad(page, pageidx);
                }

                if (Wokhan.ServerLess.Actions.PageOpen.length) {
                    for (var i = 0; i < Wokhan.ServerLess.Actions.PageOpen.length; i++) {
                        if (!Wokhan.ServerLess.Actions.PageOpen[i](page, pageidx, cpageidx)) {
                            break;
                        }
                    }
                } else {
                    this._openpagedefault(page, pageidx, cpageidx);
                }

                this._currentpage = page;
            },
            _openpagedefault: function (page, pageidx, cpageidx) {
                var pagex;
                /*if (pageidx < cpageidx) {
                    for (var i = cpageidx; i >= pageidx; i--) {
                        pagex = Wokhan.ServerLess.Pages[i];
                        pagex.className = pagex.className.replace(" page_active", "");
                    }
                } else {*/
                for (var i = 0; i < Wokhan.ServerLess.Pages.length; i++) {
                    pagex = Wokhan.ServerLess.Pages[i];
                    if (i === pageidx) {
                        pagex.className += " page_active";
                    } else {
                        if (pagex.className.indexOf("page_active")) {
                            if (Wokhan.ServerLess.Actions.PageUnload) {
                                Wokhan.ServerLess.Actions.PageUnload(pagex, pageidx);
                            }

                            pagex.className = pagex.className.replace(" page_active", "");
                        }
                    }
                }
                //}
            },
            addJS: function (path, loadcallback, isasync) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = path;
                script.async = isasync;
                if (loadcallback) {
                    script.addEventListener("load", loadcallback);
                }
                document.getElementsByTagName("head")[0].appendChild(script);

            },
            addCSS: function (path) {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "serverless/modules/" + path;
                document.getElementsByTagName("head")[0].insertBefore(link, _headsrc);
            },
            CheckApplied: function (module, container, mark) {
                if (container.getAttribute("data-" + module.name + "-done") !== null) {
                    return true;
                }

                if (mark !== undefined) {
                    container.setAttribute("data-" + module.name + "-done", true);
                }
                return false;
            },
            log: function (source, msg) {
                console.log("[ServerLess] [" + source + "] " + msg);
            }
        }
    }
};

Wokhan.ServerLess.Engine.init();
