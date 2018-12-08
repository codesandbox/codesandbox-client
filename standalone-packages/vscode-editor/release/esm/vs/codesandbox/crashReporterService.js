var CodeSandboxCrashReporterService = /** @class */ (function () {
    function CodeSandboxCrashReporterService() {
    }
    CodeSandboxCrashReporterService.prototype.getChildProcessStartOptions = function (processName) {
        console.log('CrashReporter called', processName);
    };
    return CodeSandboxCrashReporterService;
}());
export { CodeSandboxCrashReporterService };
