"use strict";
var os = require("os");
var fs = require("fs");
var path = require("path");
var Contracts = require("../Declarations/Contracts");
var Logging = require("./Logging");
var Context = (function () {
    function Context(packageJsonPath) {
        this.keys = new Contracts.ContextTagKeys();
        this.tags = {};
        this._loadApplicationContext();
        this._loadDeviceContext();
        this._loadInternalContext();
    }
    Context.prototype._loadApplicationContext = function (packageJsonPath) {
        // note: this should return the host package.json
        packageJsonPath = packageJsonPath || path.resolve(__dirname, "../../../../package.json");
        if (!Context.appVersion[packageJsonPath]) {
            Context.appVersion[packageJsonPath] = "unknown";
            try {
                var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                if (packageJson && typeof packageJson.version === "string") {
                    Context.appVersion[packageJsonPath] = packageJson.version;
                }
            }
            catch (exception) {
                Logging.info("unable to read app version: ", exception);
            }
        }
        this.tags[this.keys.applicationVersion] = Context.appVersion[packageJsonPath];
    };
    Context.prototype._loadDeviceContext = function () {
        this.tags[this.keys.deviceId] = "";
        this.tags[this.keys.cloudRoleInstance] = os && os.hostname();
        this.tags[this.keys.deviceOSVersion] = os && (os.type() + " " + os.release());
        this.tags[this.keys.cloudRole] = Context.DefaultRoleName;
        // not yet supported tags
        this.tags["ai.device.osArchitecture"] = os && os.arch();
        this.tags["ai.device.osPlatform"] = os && os.platform();
    };
    Context.prototype._loadInternalContext = function () {
        // note: this should return the sdk package.json
        var packageJsonPath = path.resolve(__dirname, "../../package.json");
        if (!Context.sdkVersion) {
            Context.sdkVersion = "unknown";
            try {
                var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                if (packageJson && typeof packageJson.version === "string") {
                    Context.sdkVersion = packageJson.version;
                }
            }
            catch (exception) {
                Logging.info("unable to read app version: ", exception);
            }
        }
        this.tags[this.keys.internalSdkVersion] = "node:" + Context.sdkVersion;
    };
    Context.DefaultRoleName = "Web";
    Context.appVersion = {};
    Context.sdkVersion = null;
    return Context;
}());
module.exports = Context;
//# sourceMappingURL=Context.js.map