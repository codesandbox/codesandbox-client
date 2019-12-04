export const CSB_PKG_PROTOCOL = /https:\/\/pkg(-staging)?\.csb.dev/;

export const formatVersion = (version: string) => {
  if (CSB_PKG_PROTOCOL.test(version)) {
    const commitSha = version.match(/commit\/([\w\d]*)\//);
    if (commitSha && commitSha[1]) {
      return `csb:${commitSha[1]}`;
    }
  }

  return version;
};
