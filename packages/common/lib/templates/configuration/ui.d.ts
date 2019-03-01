export default function getUI(configType: string): {
    ConfigWizard: typeof import("./prettierRC/ui").ConfigWizard;
};
