import {
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  LanguageClient
} from "vscode-languageclient";
import { workspace, OutputChannel } from "vscode";

const { version, referenceID } = require("../package.json");

export function getLanguageServerClient(
  serverModule: string,
  outputChannel: OutputChannel
) {
  const env = {
    APOLLO_CLIENT_NAME: "Apollo VS Code",
    APOLLO_CLIENT_VERSION: version,
    APOLLO_CLIENT_REFERENCE_ID: referenceID,
    NODE_TLS_REJECT_UNAUTHORIZED: 0
  };

  const debugOptions = {
    execArgv: ["--nolazy", "--inspect=6009"],
    env
  };

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        env
      }
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      "graphql",
      "javascript",
      "typescript",
      "javascriptreact",
      "typescriptreact",
      "vue",
      "python"
    ],
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher("**/.env"),
        workspace.createFileSystemWatcher("**/*.{graphql,js,ts,jsx,tsx,vue,py}")
      ]
    },
    outputChannel
  };

  return new LanguageClient(
    "apollographql",
    "Apollo GraphQL",
    serverOptions,
    clientOptions
  );
}
