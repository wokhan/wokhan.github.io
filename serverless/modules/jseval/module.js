Wokhan.ServerLess.Modules.add(
    {
        name: "jseval",
        type: Wokhan.ServerLess.Modules.Types.Global,
        friendlyName: "Dynamic inline script evaluator",
        icon: "",
        description: "",
        settingsKeys: null,
        init: function () {

        },
        apply: function (container) {
            if (Wokhan.ServerLess.Engine.CheckApplied(this, container, false)) {
                return;
            }

            var allscripts = container.querySelectorAll("script[data-modules-jseval]");
            for (var i = 0; i < allscripts.length; i++) {
                eval(allscripts[i].innerHTML);
            }
        }
    });