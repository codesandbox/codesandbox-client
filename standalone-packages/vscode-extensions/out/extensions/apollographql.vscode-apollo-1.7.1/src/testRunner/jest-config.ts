// Config to be handed off to jest
// @see: https://jestjs.io/docs/en/configuration.html
import { resolve } from "path";

export const config = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js"],
  rootDir: resolve(__dirname, "..", "..", "src"),
  testEnvironment: resolve(__dirname, "jest-vscode-environment.js"),
  setupFilesAfterEnv: [resolve(__dirname, "jest-vscode-framework-setup.js")],
  globals: {
    "ts-jest": {
      tsConfig: resolve(__dirname, "..", "..", "tsconfig.test.json"),
      diagnostics: false
    }
  }
};
