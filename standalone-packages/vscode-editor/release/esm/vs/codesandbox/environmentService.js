var CodeSandboxEnvironmentService = /** @class */ (function () {
    function CodeSandboxEnvironmentService() {
        this.args = {
            _: [],
        };
        this.appRoot = '/vscode';
        this.userHome = '/home/codesandbox';
        this.userDataPath = '/vscode/userdata';
        this.appNameLong = 'CodeSandbox';
        this.appQuality = 'Very Good';
        this.appSettingsHome = '/vscode';
        this.appSettingsPath = '/vscode/settings.json';
        this.appKeybindingsPath = '/vscode/keybindings.json';
        this.isExtensionDevelopment = false;
        this.extensionsPath = '/vscode/extensions';
        this.debugExtensionHost = {
            debugId: '',
            port: null,
            break: false,
        };
    }
    return CodeSandboxEnvironmentService;
}());
export { CodeSandboxEnvironmentService };
