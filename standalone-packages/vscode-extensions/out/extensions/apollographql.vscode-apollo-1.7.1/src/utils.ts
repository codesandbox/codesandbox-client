import { LanguageClient } from "vscode-languageclient";

export const timeSince = (date: number) => {
  const seconds = Math.floor((+new Date() - date) / 1000);
  if (!seconds) return;
  let interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m`;

  return `${Math.floor(seconds)}s`;
};

export const printNoFileOpenMessage = (
  client: LanguageClient,
  extVersion: string
) => {
  client.outputChannel.appendLine("------------------------------");
  client.outputChannel.appendLine(`🚀 Apollo GraphQL v${extVersion}`);
  client.outputChannel.appendLine("------------------------------");
};

export interface TypeStats {
  service?: number;
  client?: number;
  total?: number;
}

export interface ProjectStats {
  type: string;
  loaded: boolean;
  serviceId?: string;
  types?: TypeStats;
  tag?: string;
  lastFetch?: number;
}

export const printStatsToClientOutputChannel = (
  client: LanguageClient,
  stats: ProjectStats,
  extVersion: string
) => {
  client.outputChannel.appendLine("------------------------------");
  client.outputChannel.appendLine(`🚀 Apollo GraphQL v${extVersion}`);
  client.outputChannel.appendLine("------------------------------");

  if (!stats || !stats.loaded) {
    client.outputChannel.appendLine(
      "❌ Service stats could not be loaded. This may be because you're missing an apollo.config.js file " +
        "or it is misconfigured. For more information about configuring Apollo projects, " +
        "see the guide here (https://bit.ly/2ByILPj)."
    );
    return;
  }

  // we don't support logging of stats for service projects currently
  if (stats.type === "service") {
    return;
  } else if (stats.type === "client") {
    client.outputChannel.appendLine("✅ Service Loaded!");
    client.outputChannel.appendLine(`🆔 Service ID: ${stats.serviceId}`);
    client.outputChannel.appendLine(`🏷 Schema Tag: ${stats.tag}`);

    if (stats.types)
      client.outputChannel.appendLine(
        `📈 Number of Types: ${stats.types.total} (${
          stats.types.client
        } client ${stats.types.client === 1 ? "type" : "types"})`
      );

    if (stats.lastFetch && timeSince(stats.lastFetch)) {
      client.outputChannel.appendLine(
        `🗓 Last Fetched ${timeSince(stats.lastFetch)} Ago`
      );
    }
    client.outputChannel.appendLine("------------------------------");
  }
};
