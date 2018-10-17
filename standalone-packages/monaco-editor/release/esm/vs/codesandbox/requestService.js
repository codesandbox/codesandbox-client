var CodeSandboxRequestService = /** @class */ (function () {
    function CodeSandboxRequestService() {
    }
    CodeSandboxRequestService.prototype.request = function (options, token) {
        var request = {
            url: options.url,
            headers: options.headers,
            cache: 'only-if-cached',
            credentials: 'same-origin',
            destination: 'document',
            integrity: undefined,
            isHistoryNavigation: false,
            isReloadNavigation: false,
            keepalive: true,
            method: 'GET',
            mode: 'same-origin',
            redirect: 'error',
            referrer: document.location.origin,
            referrerPolicy: 'origin-only',
        };
        return window.fetch(request).then(function (x) {
            var headers = {};
            x.headers.forEach(function (val, key) {
                headers[key] = val;
            });
            return {
                res: {
                    headers: headers,
                    statusCode: x.status,
                },
                stream: x.body.getReader(),
            };
        });
    };
    return CodeSandboxRequestService;
}());
export { CodeSandboxRequestService };
