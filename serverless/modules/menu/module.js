Wokhan.ServerLess.Modules.add(
    {
        name: "menu",
        type: Wokhan.ServerLess.Modules.Types.Global,
        friendlyName: "Page menu",
        icon: "",
        description: "",
        settingsKeys: ["caption", "static", "image"],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
            Wokhan.ServerLess.Actions.PageOpen.push(function (page, pageidx, cpageidx) {
                if (page.id === "menu") {
                    return true;
                } else {
                    Wokhan.ServerLess.Engine._openpagedefault(page, pageidx, cpageidx);
                }
            });
        },
        apply: function (container, parent, prvallmenu) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container, false)) {
                return;
            }

            const allmenu = [].slice.call(container.querySelectorAll("[data-modules-menu]"));
            if (!allmenu.length) {
                return;
            }

            let menuContainer = document.querySelector("ul[data-menu-for=" + container.id + "]");
            if (!menuContainer) {
                menuContainer = document.createElement("ul");
                menuContainer.setAttribute("data-menu-for", container.id);
                (parent || container).appendChild(menuContainer);
            }

            while (allmenu.length) {
                const marker = allmenu.shift();
                if (prvallmenu) {
                    delete prvallmenu[prvallmenu.indexOf(marker)];
                }

                if (marker === undefined) { continue; }
                const li = document.createElement("li");
                li.className = "menu";

                const mlnk = document.createElement("a");
                //mlnk.setAttribute("data-menu-linkid", marker.id);
                const img = marker.getAttribute("data-menu-image");
                if (img !== null) {
                    let xtimg;
                    if (typeof(img) === "string" && img.startsWith("fa")) {
                        xtimg = document.createElement("i");
                        xtimg.className = img;
                    } else {
                        xtimg = document.createElement("img");
                        xtimg.src = img;
                    }
                    mlnk.appendChild(xtimg);
                }
                mlnk.appendChild(document.createTextNode(marker.title));
                li.appendChild(mlnk);

                const title = marker.getAttribute("data-description");
                if (title !== null) {
                    mlnk.title = title;
                }

                menuContainer.appendChild(li);
                
                if (marker.className.indexOf("page") !== -1) {
                    li.addEventListener("click", (function () { var b = marker.id; return function () { document.location.hash = b; }; })(), true);
                }
                
                this.apply(marker, li, allmenu);
                
                /*
                if (marker.getAttribute("data-menu-static") !== null) {
                    // Copies a clone into the page (since the clone should move with the latter when turning page, keeping the original in place)
                    var clone = ms.cloneNode(true);
                    if (marker.className.indexOf("page") != -1) {
                        clone.addEventListener("click", function () { document.location.hash = this.getAttribute("data-menu-linkid"); }, true);
                    }
                    p.insertBefore(clone, p.firstChild);
                    ms.className += " shadow";
                }*/
            }
        }
    });