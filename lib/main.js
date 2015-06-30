console.log("PbFx starting ...");

// Get the preferences and components object
var prefs = require("sdk/preferences/service");
var { Cu } = require("chrome");

var vimfx_url = prefs.get("extensions.VimFx.api_url", null);
console.log("VimFx url:", vimfx_url);

Cu.import(vimfx_url, {}).getAPI(function (vimfx) {

    // Set the keys
    vimfx.set("mode.normal.tab_close", "d");
    vimfx.set("mode.normal.focus_search_bar", "s");
    vimfx.set("mode.normal.stop", "<c-c>");

    // Create the new commands
    let { commands } = vimfx.modes.normal
    vimfx.addCommand({
        name: 'tab_new_and_focus_search_bar',
        description: 'Open new tab and focus Search Bar',
        category: 'tabs',
    }, function (args) {
        commands.tab_new.run(args)
        commands.focus_search_bar.run(args)
    });
    vimfx.set("custom.mode.normal.tab_new_and_focus_search_bar", "S");

});

