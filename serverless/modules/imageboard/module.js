Wokhan.ServerLess.Modules.add(
    {
        name: "imageboard",
        friendlyName: "Images board",
        icon: "",
        description: "",
        settingsKeys: ["zoomable", "margin", "maxheight", "minheight"],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
        },
        apply: function (container) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container)) {
                return;
            }

            var imageboards = container.querySelectorAll("[data-module-imageboard]");
            var img;
            var imageboardimgs;
            var imageboard;
            for (var x = 0; x < imageboards.length; x++) {
                imageboard = imageboards[x];
                imageboard.className += " imageboard";
                imageboardimgs = imageboard.querySelectorAll("img");
                for (var i = 0; i < imageboardimgs.length; i++) {
                    img = imageboardimgs[i];
                    if (imageboard.getAttribute("data-imageboard-zoomable") !== null) {
                        img.addEventListener("click", function () { Wokhan.ServerLess.Modules.get("imageboard").zoomPicture(this); });
                    }
                    if (imageboard.getAttribute("data-imageboard-margin") !== null) {
                        img.style.margin = imageboard.getAttribute("data-imageboard-margin");
                    }
                    if (imageboard.getAttribute("data-imageboard-maxheight") !== null) {
                        img.style.maxHeight = imageboard.getAttribute("data-imageboard-maxheight");
                    }
                    if (imageboard.getAttribute("data-imageboard-minheight") !== null) {
                        img.style.minHeight = imageboard.getAttribute("data-imageboard-minheight");
                    }
                    if (img.getAttribute("title")) {
                        var rpl = document.createElement("div");
                        rpl.className = "imgcontainer";
                        img.parentNode.replaceChild(rpl, img);
                        var titler = document.createElement("div");
                        titler.innerHTML = img.getAttribute("title");
                        titler.className = "imgtitle";
                        rpl.appendChild(img);
                        rpl.appendChild(titler);
                    }
                }
            }
        },

        zoomPicture: function (im) {
            var zoomedImg = document.body.querySelector("#zoomedImg");

            if (!zoomedImg) {
                zoomedImg = document.createElement("img");
                zoomedImg.id = "zoomedImg";
                zoomedImg.className = "hidden";
                zoomedImg.onclick = function () {
                    //clone.className = "";
                    zoomedImg.className = "hidden";
                };
                document.body.appendChild(zoomedImg);
            }

            zoomedImg.src = im.src.replace("_mini", "");
            window.setTimeout(function () { zoomedImg.className = "zoomed" }, 1);
        }
    });