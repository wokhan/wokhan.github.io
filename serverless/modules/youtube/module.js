Wokhan.ServerLess.Modules.add(
    {
        name: "youtube",
        friendlyName: "Simple YouTube player",
        icon: "",
        description: "",
        settingsKeys: ["id", "picture"],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
        },
        apply: function (container) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container)) {
                return;
            }

            var divs = container.querySelectorAll("[data-module-youtube]");
            for (var i = 0; i < divs.length; i++) {
                var div = divs[i];
                div.className += " video";
                var youtubeId = div.getAttribute("data-youtube-id");
                var youtubePic = div.getAttribute("data-youtube-picture") || "0";
                var img = document.createElement("img");
                img.style.width = "100%";
                img.style.height = "100%";
                img.src = "http://img.youtube.com/vi/" + youtubeId + "/" + youtubePic + ".jpg";
                div.appendChild(img);
                div.className += " video";
                div.addEventListener("click", function () { Wokhan.ServerLess.Modules.get("youtube").play(this); });
            }
        },
        play: function (owner) {
            var playerFrame = document.createElement("iframe");
            var id = owner.getAttribute("data-youtube-id");
            playerFrame.style.border = "none";
            playerFrame.frameborder = "0";
            playerFrame.width = owner.style.width;
            playerFrame.height = owner.style.height;
            playerFrame.allowfullscreen = "true";
            playerFrame.src = "https://www.youtube.com/embed/" + id + "?rel=0&autoplay=1";
            owner.removeChild(owner.querySelector("img"));
            owner.appendChild(playerFrame);
            owner.className += " playing";
        }
    });
