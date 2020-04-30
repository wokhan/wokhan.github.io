Wokhan.ServerLess.Modules.add(
    {
        name: "music",
        friendlyName: "Simple music player",
        icon: "",
        description: "",
        settingsKeys: ["trackid", "storeids", "albumids"],
        init: function () {
            Wokhan.ServerLess.Engine.addCSS(this.name + "/styles/default.css");
        },
        apply: function (container) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container)) {
                return;
            }

            var albums = container.querySelectorAll("[data-module-music]");
            for (var i = 0; i < albums.length; i++) {
                albums[i].className += " album";
                this.addStoreLinks(albums[i]);
                var tracks = albums[i].querySelectorAll("ul > li");
                for (var j = 0; j < tracks.length; j++) {
                    tracks[j].setAttribute("data-music-trackid", j + 1);
                    tracks[j].addEventListener("click", function () { Wokhan.ServerLess.Modules.get("music").playAudio(this); });
                }
            }
        },
        storesLinks: {
            deezer: "http://www.deezer.com/album/",
            emusic: "http://www.emusic.com/album/-/-/",
            spotify: "https://play.spotify.com/album/",
            itunes: "https://itunes.apple.com/fr/album/",
            amazon: "https://www.amazon.fr/dp/",
            qobuz: "http://www.qobuz.com/fr-fr/album/dummy/"
        },
        addStoreLinks: function (album) {
            var stores = album.getAttribute("data-music-storeids");
            if (stores) {
                var divStores = document.createElement("div");
                divStores.className = "albumstores";
                album.appendChild(divStores);
                var storespl = stores.split(';');
                for (var i = 0; i < storespl.length; i++) {
                    var storeval = storespl[i].split("=");
                    var astore = document.createElement("a");
                    astore.className = storeval[0];
                    astore.target = "_blank";
                    astore.href = this.storesLinks[storeval[0]] + storeval[1];
                    //astore.innerHTML = storeval[0];
                    divStores.appendChild(astore);
                }
            }
        },

        playAudio: function (owner) {
            var albumid = owner.parentNode.parentNode.getAttribute("data-music-albumid");
            var trackid = owner.getAttribute("data-music-trackid");
            var audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = "http://player.zimbalam.com/fulls/" + albumid + "-" + trackid + ".mp3";
            //audioPlayer.src = "content/mzic/" + albumid + "/" + trackid + ".mp3";
            audioPlayer.play();
        }
    });