console.log("PbFx starting ...");

var { Class } = require('sdk/core/heritage');
var { Unknown, Service } = require('sdk/platform/xpcom');
var { Cc, Ci } = require('chrome');
var contractId = '@parantapa.net/pbfx';

var tabs = require("sdk/tabs");

function openUrls(urls) {
    var i;

    tabs.activeTab.url = urls[0];
    for (i = 1; i < urls.length; i++) {
        tabs.open({url: urls[i], inBackground: true});
    }
}

// Implement the service by subclassing Unknown
var PbFx = Class({
    extends: Unknown,
    get wrappedJSObject() this,
    log: function(from, message) {
        console.log("Message from: " + from + ": " + message);
    },
    openUrls: openUrls
});

// Register the service using the contract ID
var service = Service({
  contract: contractId,
  Component: PbFx
});

