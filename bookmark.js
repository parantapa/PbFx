// Import Sdk modules
const tabs = require("sdk/tabs");
const { env } = require("sdk/system/environment");
const path = require("sdk/fs/path");
const fileIO = require("sdk/io/file");
const notifications = require("sdk/notifications");

// Import Chrome modules
const res_osfile = "resource://gre/modules/osfile.jsm";
const { Cu } = require("chrome");
const { TextEncoder, OS } = Cu.import(res_osfile, {});

// Append to file
function appendToFile(text, fname) {
    var mode;
    if (fileIO.exists(fname)) {
        mode = {write: true, append: true};
    } else {
        mode = {write: true, create: true};
    }
    var encoder = new TextEncoder();
    var barray = encoder.encode(text);

    // Do the writing
    // Promises are simultaniously ok and wierd.
    OS.File.open(fname, mode).then(function (fobj) {
        // console.log("Opened ...");
        fobj.write(barray).then(function () {
            // console.log("Written ...");
            fobj.flush().then(function () {
                // console.log("Flushed ...");
                fobj.close().then(function () {
                    // console.log("Closed ...");
                });
            });
        });
    });
}

// Get the bookmark filename and directory
var bookmark_fname_parts;
if ("HOME_QUICKREFS" in env) {
    bookmark_fname_parts = [env.HOME_QUICKREFS, "bookmark.yaml"];
} else {
    bookmark_fname_parts = [env.HOME, ".config", "pbapps", "pbfx", "bookmark.yaml"];
}
// console.log(bookmark_fname_parts);
const bookmark_fname = path.join.apply(this, bookmark_fname_parts);
// console.log(bookmark_fname);
const bookmark_dirname = path.dirname(bookmark_fname);
// console.log(bookmark_dirname);

// If the directory containing bookmarks doesn't exist create it.
if (!fileIO.exists(bookmark_dirname)) {
    console.log("Creating config directory ...");
    console.log(bookmark_dirname);
    fileIO.mkpath(bookmark_dirname);
}

function bookmarkCurrentPage(fname) {
    console.log("Bookmarking " + tabs.activeTab.url);
    notifications.notify({
        title: "PbFx Bookmark",
        text: "Bookmarking " + tabs.activeTab.url,
        iconURL: "./bookmark-64.png"
    });

    var bstr;
    bstr = "-\n";
    bstr += "  title: >\n    " + tabs.activeTab.title + "\n";
    bstr += "  url: >\n    " + tabs.activeTab.url + "\n";
    bstr += "  tags:\n  note:\n\n";

    appendToFile(bstr, fname);
}

function bookmark() {
    bookmarkCurrentPage(bookmark_fname);
}

exports.bookmark = bookmark;
