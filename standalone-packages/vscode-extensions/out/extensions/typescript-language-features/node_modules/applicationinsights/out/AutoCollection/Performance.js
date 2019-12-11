"use strict";
var os = require("os");
var Logging = require("../Library/Logging");
var AutoCollectPerformance = (function () {
    function AutoCollectPerformance(client) {
        if (!!AutoCollectPerformance.INSTANCE) {
            throw new Error("Performance tracking should be configured from the applicationInsights object");
        }
        AutoCollectPerformance.INSTANCE = this;
        this._isInitialized = false;
        this._client = client;
    }
    AutoCollectPerformance.prototype.enable = function (isEnabled) {
        var _this = this;
        this._isEnabled = isEnabled;
        if (this._isEnabled && !this._isInitialized) {
            this._isInitialized = true;
        }
        if (isEnabled) {
            if (!this._handle) {
                this._lastCpus = os.cpus();
                this._lastRequests = {
                    totalRequestCount: AutoCollectPerformance._totalRequestCount,
                    totalFailedRequestCount: AutoCollectPerformance._totalFailedRequestCount,
                    time: +new Date
                };
                if (typeof process.cpuUsage === 'function') {
                    this._lastAppCpuUsage = process.cpuUsage();
                }
                this._lastHrtime = process.hrtime();
                this._handle = setInterval(function () { return _this.trackPerformance(); }, 60000);
                this._handle.unref(); // Allow the app to terminate even while this loop is going on
            }
        }
        else {
            if (this._handle) {
                clearInterval(this._handle);
                this._handle = undefined;
            }
        }
    };
    AutoCollectPerformance.countRequest = function (request, response) {
        var _this = this;
        if (!AutoCollectPerformance.isEnabled()) {
            return;
        }
        var start = +new Date;
        if (!request || !response) {
            Logging.warn("AutoCollectPerformance.countRequest was called with invalid parameters: ", !!request, !!response);
            return;
        }
        // response listeners
        if (typeof response.once === "function") {
            response.once("finish", function () {
                var end = +new Date;
                _this._lastRequestExecutionTime = end - start;
                AutoCollectPerformance._totalRequestCount++;
                if (response.statusCode >= 400) {
                    AutoCollectPerformance._totalFailedRequestCount++;
                }
            });
        }
    };
    AutoCollectPerformance.prototype.isInitialized = function () {
        return this._isInitialized;
    };
    AutoCollectPerformance.isEnabled = function () {
        return AutoCollectPerformance.INSTANCE && AutoCollectPerformance.INSTANCE._isEnabled;
    };
    AutoCollectPerformance.prototype.trackPerformance = function () {
        this._trackCpu();
        this._trackMemory();
        this._trackNetwork();
    };
    AutoCollectPerformance.prototype._trackCpu = function () {
        // this reports total ms spent in each category since the OS was booted, to calculate percent it is necessary
        // to find the delta since the last measurement
        var cpus = os.cpus();
        if (cpus && cpus.length && this._lastCpus && cpus.length === this._lastCpus.length) {
            var totalUser = 0;
            var totalSys = 0;
            var totalNice = 0;
            var totalIdle = 0;
            var totalIrq = 0;
            for (var i = 0; !!cpus && i < cpus.length; i++) {
                var cpu = cpus[i];
                var lastCpu = this._lastCpus[i];
                var name = "% cpu(" + i + ") ";
                var model = cpu.model;
                var speed = cpu.speed;
                var times = cpu.times;
                var lastTimes = lastCpu.times;
                // user cpu time (or) % CPU time spent in user space
                var user = (times.user - lastTimes.user) || 0;
                totalUser += user;
                // system cpu time (or) % CPU time spent in kernel space
                var sys = (times.sys - lastTimes.sys) || 0;
                totalSys += sys;
                // user nice cpu time (or) % CPU time spent on low priority processes
                var nice = (times.nice - lastTimes.nice) || 0;
                totalNice += nice;
                // idle cpu time (or) % CPU time spent idle
                var idle = (times.idle - lastTimes.idle) || 0;
                totalIdle += idle;
                // irq (or) % CPU time spent servicing/handling hardware interrupts
                var irq = (times.irq - lastTimes.irq) || 0;
                totalIrq += irq;
            }
            // Calculate % of total cpu time (user + system) this App Process used (Only supported by node v6.1.0+)
            var appCpuPercent = undefined;
            if (typeof process.cpuUsage === 'function') {
                var appCpuUsage = process.cpuUsage();
                var hrtime = process.hrtime();
                var totalApp = ((appCpuUsage.user - this._lastAppCpuUsage.user) + (appCpuUsage.system - this._lastAppCpuUsage.system)) || 0;
                if (typeof this._lastHrtime !== 'undefined' && this._lastHrtime.length === 2) {
                    var elapsedTime = ((hrtime[0] - this._lastHrtime[0]) * 1e6 + (hrtime[1] - this._lastHrtime[1]) / 1e3) || 0; // convert to microseconds
                    appCpuPercent = 100 * totalApp / (elapsedTime * cpus.length);
                }
                // Set previous
                this._lastAppCpuUsage = appCpuUsage;
                this._lastHrtime = hrtime;
            }
            var combinedTotal = (totalUser + totalSys + totalNice + totalIdle + totalIrq) || 1;
            this._client.trackMetric({ name: "\\Processor(_Total)\\% Processor Time", value: ((combinedTotal - totalIdle) / combinedTotal) * 100 });
            this._client.trackMetric({ name: "\\Process(??APP_WIN32_PROC??)\\% Processor Time", value: appCpuPercent || ((totalUser / combinedTotal) * 100) });
        }
        this._lastCpus = cpus;
    };
    AutoCollectPerformance.prototype._trackMemory = function () {
        var freeMem = os.freemem();
        var usedMem = process.memoryUsage().rss;
        this._client.trackMetric({ name: "\\Process(??APP_WIN32_PROC??)\\Private Bytes", value: usedMem });
        this._client.trackMetric({ name: "\\Memory\\Available Bytes", value: freeMem });
    };
    AutoCollectPerformance.prototype._trackNetwork = function () {
        // track total request counters
        var lastRequests = this._lastRequests;
        var requests = {
            totalRequestCount: AutoCollectPerformance._totalRequestCount,
            totalFailedRequestCount: AutoCollectPerformance._totalFailedRequestCount,
            time: +new Date
        };
        var intervalRequests = (requests.totalRequestCount - lastRequests.totalRequestCount) || 0;
        var intervalFailedRequests = (requests.totalFailedRequestCount - lastRequests.totalFailedRequestCount) || 0;
        var elapsedMs = requests.time - lastRequests.time;
        var elapsedSeconds = elapsedMs / 1000;
        if (elapsedMs > 0) {
            var requestsPerSec = intervalRequests / elapsedSeconds;
            var failedRequestsPerSec = intervalFailedRequests / elapsedSeconds;
            this._client.trackMetric({ name: "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Requests/Sec", value: requestsPerSec });
            this._client.trackMetric({ name: "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Request Execution Time", value: AutoCollectPerformance._lastRequestExecutionTime });
        }
        this._lastRequests = requests;
    };
    AutoCollectPerformance.prototype.dispose = function () {
        AutoCollectPerformance.INSTANCE = null;
        this.enable(false);
        this._isInitialized = false;
    };
    AutoCollectPerformance._totalRequestCount = 0;
    AutoCollectPerformance._totalFailedRequestCount = 0;
    AutoCollectPerformance._lastRequestExecutionTime = 0;
    return AutoCollectPerformance;
}());
module.exports = AutoCollectPerformance;
//# sourceMappingURL=Performance.js.map