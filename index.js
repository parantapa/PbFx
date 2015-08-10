console.log("PbFx starting ...");

// Get the preferences and components object
var prefs = require("sdk/preferences/service");
var tabs = require("sdk/tabs");
var { Cu } = require("chrome");

var vimfx_url = prefs.get("extensions.VimFx.api_url", null);
console.log("VimFx url:", vimfx_url);

Cu.import(vimfx_url, {}).getAPI(function (vimfx) {

    // Customize the existing keys
    vimfx.set("mode.normal.focus_search_bar", "s");
    vimfx.set("mode.normal.stop", "<c-c>");
    vimfx.set("mode.normal.stop_all", "a<c-c>");
    vimfx.set("mode.normal.scroll_half_page_down", "<c-d>");
    vimfx.set("mode.normal.scroll_half_page_up", "<c-u>");
    vimfx.set("mode.normal.history_back", "<c-o>");
    vimfx.set("mode.normal.history_forward", "<c-i>");
    vimfx.set("mode.normal.tab_close", "d");
    vimfx.set("mode.normal.tab_restore", "D");

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

    var addQuickOpenCmd = function (name, desc, key, urls) {
        vimfx.addCommand({
            name: name,
            description: desc,
        }, function (args) {
            tabs.activeTab.url = "http://" + urls[0];
            for (var i = 1; i < urls.length; i++) {
                tabs.open({
                    url: "http://" + urls[i],
                    inBackground: true
                });
            }
        });
        vimfx.set("custom.mode.normal." + name, key);
    };

    addQuickOpenCmd("open_gmail", "Open Gmail", ",m",
        ["gmail.com"]);
    addQuickOpenCmd("open_gcal", "Open Google Calendar", ",v",
        ["google.com/calendar"]);
    addQuickOpenCmd("open_gs", "Open Google Scholar", ",gs",
        ["google.com/scholar"]);
    addQuickOpenCmd("open_news", "Open News Sites", ",n",
        ["slashdot.org", "news.ycombinator.com", "telegraphindia.com"]);
    addQuickOpenCmd("open_social", "Open Social Network Sites", ",s",
        ["facebook.com", "twitter.com", "reddit.com"]);
    addQuickOpenCmd("open_blogs", "Open Blogs", ",b",
        ["lifehacker.com", "boingboing.net"]);
    addQuickOpenCmd("open_comics_a", "Open Comics", ",c1",
        ["dilbert.com", "xkcd.com", "phdcomics.com/comics.php"]);
    addQuickOpenCmd("open_comics_b", "Open Comics", ",c2",
        ["gocomics.com/calvinandhobbes",
         "gocomics.com/garfield",
         "gocomics.com/broomhilda",
         "gocomics.com/bc",
         "gocomics.com/wizardofid"]);
    addQuickOpenCmd("open_comics_c", "Open Comics", ",c3",
        ["arcamax.com/thefunnies/hagarthehorrible",
         "arcamax.com/thefunnies/beetlebailey",
         "arcamax.com/thefunnies/peanuts"]);
});

