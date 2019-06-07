import { window, StatusBarAlignment } from "vscode";

interface LoadingInput {
  hasActiveTextEditor: boolean;
}

interface StateChangeInput extends LoadingInput {
  text: string;
  tooltip?: string;
}

export default class ApolloStatusBar {
  public statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);

  static loadingStateText = "Apollo GraphQL $(rss)";
  static loadedStateText = "ApolloGraphQL $(rocket)";
  static warningText = "Apollo GraphQL $(alert)";

  constructor({ hasActiveTextEditor }: LoadingInput) {
    this.showLoadingState({ hasActiveTextEditor });
    this.statusBarItem.command = "apollographql/showStats";
  }

  protected changeState({
    hasActiveTextEditor,
    text,
    tooltip
  }: StateChangeInput) {
    if (!hasActiveTextEditor) {
      this.statusBarItem.hide();
      return;
    }

    this.statusBarItem.text = text;
    this.statusBarItem.tooltip = tooltip;
    this.statusBarItem.show();
  }

  public showLoadingState({ hasActiveTextEditor }: LoadingInput) {
    this.changeState({
      hasActiveTextEditor,
      text: ApolloStatusBar.loadingStateText
    });
  }

  public showLoadedState({ hasActiveTextEditor }: LoadingInput) {
    this.changeState({
      hasActiveTextEditor,
      text: ApolloStatusBar.loadedStateText
    });
  }

  public showWarningState({
    hasActiveTextEditor,
    tooltip
  }: LoadingInput & { tooltip: string }) {
    this.changeState({
      hasActiveTextEditor,
      text: ApolloStatusBar.warningText,
      tooltip
    });
  }

  public dispose() {
    this.statusBarItem.dispose();
  }
}
