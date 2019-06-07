import { normalizeURI } from "../uri";

describe("Unix URIs", () => {
  // this is the format that `glob` returns on unix
  const uriToMatchForUnix = "/test/myFile.js";

  // single forward slash (unix)
  it("handles /Users/me URIs", () => {
    const uri = "/test/myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForUnix);
  });

  // single escaped backslash
  // treat these as forward slashes?
  it("handles \\Users\\me URIs", () => {
    const uri = "\\test\\myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForUnix);
  });
});

describe("Windows URIs", () => {
  // this is the format that `glob` returns for windows
  const uriToMatchForWindows = "c:/test/myFile.js";

  // this format is sent by the native extension notification system on windows
  it("handles file:///c%3A/ URIs", () => {
    const uri = "file:///c%3A/test/myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForWindows);
  });

  // same as above without URI encoded :
  it("handles handles file:///c:/ URIs", () => {
    const uri = "file:///c:/test/myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForWindows);
  });

  // result of glob.sync
  it("handles c:/ URIs", () => {
    const uri = "c:/test/myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForWindows);
  });

  // from status bar notification
  // single (escaped) backslash
  it("handles c:\\ URIs", () => {
    const uri = "c:\\test\\myFile.js";
    const parsed = normalizeURI(uri);
    expect(parsed).toEqual(uriToMatchForWindows);
  });
});
