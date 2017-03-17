console.log("PbFx starting ...");

var { Class } = require('sdk/core/heritage');
var { Unknown, Service } = require('sdk/platform/xpcom');
var { Cc, Ci } = require('chrome');
var Ps = require("sdk/preferences/service");
var tabs = require("sdk/tabs");
var { notify } = require("sdk/notifications");

var contractId = '@parantapa.net/pbfx';

function openUrls(urls) {
    var i;

    tabs.activeTab.url = urls[0];
    for (i = 1; i < urls.length; i++) {
        tabs.open({url: urls[i], inBackground: true});
    }
}

function setKgpProxy() {
    console.log("Using KGP proxy server ...");
    notify({title: "PbFx", text: "Using KGP proxy"});

    let proxy_ip = "10.3.100.207";
    let proxy_port = 8080;

    Ps.set("network.proxy.http", proxy_ip);
    Ps.set("network.proxy.http_port", proxy_port);
    Ps.set("network.proxy.ssl", proxy_ip);
    Ps.set("network.proxy.ssl_port", proxy_port);
    Ps.set("network.proxy.ftp", proxy_ip);
    Ps.set("network.proxy.ftp_port", proxy_port);
    Ps.set("network.proxy.type", 1);
}

function setLocalSocksProxy() {
    console.log("Using local proxy server ...");
    notify({title: "PbFx", text: "Using local socks proxy"});

    let proxy_ip = "127.0.0.1";
    let proxy_port = 1080;

    Ps.set("network.proxy.http", "");
    Ps.set("network.proxy.ssl", "");
    Ps.set("network.proxy.ftp", "");
    Ps.set("network.proxy.socks", proxy_ip);
    Ps.set("network.proxy.socks_port", proxy_port);
    Ps.set("network.proxy.type", 1);
}

function disableProxy() {
    console.log("disabling proxy ...");
    notify({title: "PbFx", text: "Disabling proxy"});

    Ps.set("network.proxy.type", 0);
}

// Implement the service by subclassing Unknown
var PbFx = Class({
    extends: Unknown,
    get wrappedJSObject() this,
    log: function(from, message) {
        console.log("Message from: " + from + ": " + message);
    },
    openUrls: openUrls,
    setKgpProxy: setKgpProxy,
    setLocalSocksProxy: setLocalSocksProxy,
    disableProxy: disableProxy
});

// Register the service using the contract ID
var service = Service({
  contract: contractId,
  Component: PbFx
});

