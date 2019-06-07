import URI from "vscode-uri";

const withUnixSeparator = (uriString: string) =>
  uriString.split(/[\/\\]/).join("/");

export const normalizeURI = (uriString: string) => {
  let parsed;
  if (uriString.indexOf("file:///") === 0) {
    parsed = URI.file(URI.parse(uriString).fsPath);
  } else if (uriString.match(/^[a-zA-Z]:[\/\\].*/)) {
    // uri with a drive prefix but not file:///
    parsed = URI.file(
      URI.parse("file:///" + withUnixSeparator(uriString)).fsPath
    );
  } else {
    parsed = URI.parse(withUnixSeparator(uriString));
  }
  return withUnixSeparator(parsed.fsPath);
};
