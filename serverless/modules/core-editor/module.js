Wokhan.ServerLess.Modules.add(
    {
        name: "core-editor",
        type: Wokhan.ServerLess.Modules.Types.Global,
        friendlyName: "Standard page editor",
        icon: "",
        description: "",
        settingsKeys: [],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
        },
        apply: function (container) {
            document.body.addEventListener("click", function (e) {
                if ("innerHTML" in e.srcElement) {
                    var dynamicEditor = document.getElementById("dynamicEditor");
                    if (dynamicEditor === null) {
                        dynamicEditor = document.createElement("div");
                        dynamicEditor.id = "dynamicEditor";

                        for (var it in Wokhan.ServerLess.Modules.innerlist) {
                            var moduleEntry = document.createElement("div");
                            dynamicEditor.appendChild(moduleEntry);

                            var moduleButton = document.createElement("a");
                            moduleButton.innerHTML = "X";
                            var minfo = Wokhan.ServerLess.Modules.get(it);
                            console.debug(minfo);
                            moduleButton.addEventListener("click", function (x) { return function () { console.debug(x.name); }; }(minfo));
                            var modulePic = document.createElement("img");
                            modulePic.src = minfo.icon;
                            moduleButton.appendChild(modulePic);
                            moduleEntry.appendChild(moduleButton);
                        }

                        document.body.appendChild(dynamicEditor);
                    }

                    var pos = e.srcElement.getBoundingClientRect();
                    dynamicEditor.style.top = pos.top + "px";
                    dynamicEditor.style.top = pos.left + "px";

                }
            });
        }
    });
