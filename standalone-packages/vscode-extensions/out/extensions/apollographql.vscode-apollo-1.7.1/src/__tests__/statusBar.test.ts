import StatusBar from "../statusBar";

describe("statusBar", () => {
  it("only shows loaded state when it's supposed to", () => {
    const statusBar = new StatusBar({ hasActiveTextEditor: true });

    expect(statusBar.statusBarItem.text).toEqual(StatusBar.loadingStateText);
    statusBar.showLoadedState({ hasActiveTextEditor: true });
    expect(statusBar.statusBarItem.text).toEqual(StatusBar.loadedStateText);
  });
});
