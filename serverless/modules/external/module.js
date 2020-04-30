Wokhan.ServerLess.Modules.add(
    {
        name: "external",
        type: Wokhan.ServerLess.Modules.Types.Global,
        friendlyName: "Deferred external content",
        icon: "",
        description: "",
        settingsKeys: ["contentid"],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
            Wokhan.ServerLess.Actions.PageLoad = function (page, pidx) {
                if (page.getAttribute("data-external-defer") !== null && !page.getAttribute("data-external-loaded")) {
                    page.setAttribute("data-external-loaded", true);
                    Wokhan.ServerLess.Modules.get("external")._loadContent(page);
                }
            };
            Wokhan.ServerLess.Actions.PageUnload = function (page, pidx) {
                if (page.getAttribute("data-external-defer") !== null && page.getAttribute("data-external-loaded")) {
                    page.innerHTML = "";
                    page.removeAttribute("data-external-loaded");
                }
            };
        },
        apply: function (container) {
            var allcnt = container.querySelectorAll("[data-external-contentid]");
            for (var i = 0; i < allcnt.length; i++) {
                var cnt = allcnt[i];
                if (Wokhan.ServerLess.Engine.CheckApplied(this, cnt)) {
                    return;
                }
                if (cnt.getAttribute("data-external-defer") === null) {
                    this._loadContent(cnt);
                }
            }
        },
        _loadContent: function (cnt) {
            /*cnt.innerHTML = "";*/
            var inner = document.createElement("div");
            inner.className = "page_content";
            cnt.appendChild(inner);
            var xhttp = new XMLHttpRequest();
            var contentid = cnt.getAttribute("data-external-contentid");
            xhttp.onreadystatechange = (function () {
                var cntx = inner;
                return function () {
                    if (this.readyState === 4 && (this.status === 200 || this.status === 304)) {
                        Wokhan.ServerLess.Engine.log("External", "Loaded " + cntx.parentNode.id);
                        cntx.innerHTML = this.responseText;
                        var scripts = cntx.querySelectorAll("script");
                        for (var x = 0; x < scripts.length; x++) {
                            var oscr = scripts[x];
                            var scr = document.createElement("script");
                            scr.src = oscr.src;
                            scr.async = oscr.async;
                            scr.type = oscr.type;
                            scr.defer = oscr.defer;
                            scr.innerHTML = oscr.innerHTML;
                            document.head.appendChild(scr);
                        }
                        Wokhan.ServerLess.Modules.applyAll(cntx.parentNode);
                    }
                };
            })();
            xhttp.open("GET", "content/" + contentid + ".html?rnd=" + new Date().getTime(), true);
            xhttp.send();
        },
        enableEditMode: function () {
            var allcnt = container.querySelectorAll("[data-external-contentid] .page_content");
            for (var i = 0; i < allcnt.length; i++) {
                Wokhan.ServerLess.Modules.get("external")._enableEditMode(allcnt[i]);
            }
        },
        _enableEditMode: function (container) {
            var ctnEdit = document.createElement("div");
            ctnEdit.className = "pagecontent_toolbar";
            ctnEdit.setAttribute("data-container", container);
            var posParent = container.parentNode.getBoundingClientRect();
            var pos = container.getBoundingClientRect();
            ctnEdit.style.top = (pos.top - posParent.top) + "px";
            ctnEdit.style.right = (pos.right - posParent.right) + "px";
            var editBtn = document.createElement("button");
            editBtn.className = "external_edit";
            editBtn.onclick = function () { var ctn = container; ctnEdit.setAttribute("data-external-previous", ctn.innerHTML); ctn.contentEditable = "true"; ctn.focus(); };
            var saveBtn = document.createElement("button");
            saveBtn.className = "external_save";
            saveBtn.onclick = function () { var ctn = container; Wokhan.ServerLess.Modules.get("external")._pushContent(ctn); };
            var cancelBtn = document.createElement("button");
            cancelBtn.className = "external_cancel";
            cancelBtn.onclick = function () { if (!confirm("Do you really want to revert your modifications?")) return; var ctn = container; ctn.contentEditable = "false"; ctn.innerHTML = ctnEdit.getAttribute("data-external-previous"); };
            ctnEdit.appendChild(editBtn);
            ctnEdit.appendChild(saveBtn);
            ctnEdit.appendChild(cancelBtn);

            container.parentNode.appendChild(ctnEdit);
        },
        _pushContent: function (container) {
            var contentid = container.parentNode.getAttribute("data-external-contentid");

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = (function () {
                var cnt = container;
                var xhttp = xhttp;
                return function () {
                    if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 304)) {
                        console.debug("Copied " + cnt.parentNode.getAttribute("data-external-contentid"));
                    }
                    console.debug(xhttp.responseText);
                };
            })();
            xhttp.overrideMimeType("text/html");
            xhttp.open("COPY", "/serverless/webdav/Wrapper.php?KEY=" + prompt("Please enter your authorization key.") + "&FILEPATH=/content/" + contentid + ".html");
            xhttp.setRequestHeader("Destination", "/content/history/" + contentid + "_" + new Date().valueOf() + ".bak");
            xhttp.send();

            var xhttpX = new XMLHttpRequest();
            xhttpX.onreadystatechange = (function () {
                var cnt = container;
                var xhttp = xhttpX;
                return function () {
                    if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 304)) {
                        console.debug("Saved " + cnt.parentNode.getAttribute("data-external-contentid"));
                    }
                    console.debug(xhttp.responseText);
                };
            })();
            xhttpX.overrideMimeType("text/html");
            xhttpX.open("PUT", "/serverless/webdav/Wrapper.php?KEY=" + prompt("Please enter your authorization key.") + "&FILEPATH=/content/" + contentid + "2.html");
            xhttpX.send(container.innerHTML);
        }
    });
