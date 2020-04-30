Wokhan.ServerLess.Modules.add(
    {
        name: "book",
        friendlyName: "Book",
        icon: "",
        description: "",
        type: Wokhan.ServerLess.Modules.Types.Global,
        settingsKeys: [],
        init: function () {
            Wokhan.ServerLess.Actions.PageOpen.push(this.openpage);
        },
        apply: function (container) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container)) {
                return;
            }

            let fx = Wokhan.ServerLess.Pages.length * 2;
            let fy = Wokhan.ServerLess.Pages.length * 2;
            let zi = 100;
            for (let i = 0; i < Wokhan.ServerLess.Pages.length; i++) {
                Wokhan.ServerLess.Pages[i].style.zIndex = (zi--);
                Wokhan.ServerLess.Pages[i].style.bottom = (fx -= 2) + "px";
                Wokhan.ServerLess.Pages[i].style.right = (fy -= 2) + "px";
            }
        },
        openpage: function (page, pageidx, cpageidx) {
            let pagex;
            if (pageidx < cpageidx) {
                for (let i = cpageidx; i >= pageidx; i--) {
                    pagex = Wokhan.ServerLess.Pages[i];
                    pagex.style.zIndex = pagex.style.zIndex_bk;
                    pagex.style.transitionDelay = 0.1 * (cpageidx - i) + "s";
                    pagex.className = pagex.className.replace(" page_active", "");
                }
            } else {
                for (let i = cpageidx; i < pageidx; i++) {
                    pagex = Wokhan.ServerLess.Pages[i];
                    pagex.style.zIndex_bk = pagex.style.zIndex;
                    pagex.style.zIndex = 100;
                    pagex.style.transitionDelay = 0.1 * (cpageidx - i) + "s";
                    pagex.className += " page_active";
                }
            }
        }
    });