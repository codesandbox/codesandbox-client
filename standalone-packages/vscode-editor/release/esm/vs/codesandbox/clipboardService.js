function copyFromClipboard() {
    var inputEl = document.createElement('input');
    document.body.appendChild(inputEl);
    inputEl.focus();
    document.execCommand('paste');
    var pasteString = inputEl.value;
    document.body.removeChild(inputEl);
    return pasteString;
}
var CodeSandboxClipboardService = /** @class */ (function () {
    function CodeSandboxClipboardService() {
    }
    CodeSandboxClipboardService.prototype.writeText = function (text) {
        // @ts-ignore
        navigator.clipboard.writeText(text);
    };
    CodeSandboxClipboardService.prototype.readText = function () {
        return copyFromClipboard() || '';
    };
    CodeSandboxClipboardService.prototype.readFindText = function () {
        return '';
    };
    CodeSandboxClipboardService.prototype.writeFindText = function (text) { };
    CodeSandboxClipboardService.prototype.writeResources = function (resources) { };
    CodeSandboxClipboardService.prototype.readResources = function () {
        return [];
    };
    CodeSandboxClipboardService.prototype.hasResources = function () {
        return false;
    };
    return CodeSandboxClipboardService;
}());
export { CodeSandboxClipboardService };
