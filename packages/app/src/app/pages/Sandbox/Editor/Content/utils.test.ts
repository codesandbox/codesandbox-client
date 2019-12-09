import { moveDevToolsTab, addDevToolsTab } from './utils';

const BROWSER_FIXTURE = { id: 'codesandbox.browser' };
const TESTS_FIXTURE = { id: 'codesandbox.tests' };
const CONSOLE_FIXTURE = { id: 'codesandbox.console' };
const PROBLEMS_FIXTURE = { id: 'codesandbox.problems' };

describe('moveDevToolsTab', () => {
  it('can move a tab in same devtools', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const newTabs = moveDevToolsTab(
      tabs,
      { devToolIndex: 0, tabPosition: 0 },
      { devToolIndex: 0, tabPosition: 1 }
    );

    expect(newTabs).toMatchSnapshot();
  });

  it('can move a tab in same devtools and move the tab back', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const from = { devToolIndex: 0, tabPosition: 0 };
    const to = { devToolIndex: 0, tabPosition: 1 };
    const newTabs = moveDevToolsTab(tabs, from, to);

    expect(moveDevToolsTab(newTabs, to, from)).toMatchSnapshot();
  });

  it('can move the tab to the same position', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const from = { devToolIndex: 0, tabPosition: 0 };
    const to = { devToolIndex: 0, tabPosition: 0 };
    const newTabs = moveDevToolsTab(tabs, from, to);

    expect(newTabs).toMatchSnapshot();
  });

  it('can move a tab from one devtools to the other', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const from = { devToolIndex: 0, tabPosition: 0 };
    const to = { devToolIndex: 1, tabPosition: 1 };
    const newTabs = moveDevToolsTab(tabs, from, to);

    expect(newTabs).toMatchSnapshot();
  });

  it('can move a tab from one devtools to the other and move it back', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const from = { devToolIndex: 0, tabPosition: 0 };
    const to = { devToolIndex: 1, tabPosition: 1 };
    const newTabs = moveDevToolsTab(tabs, from, to);

    expect(moveDevToolsTab(newTabs, to, from)).toMatchSnapshot();
  });

  it('is immutable', () => {
    const tabs = [
      { views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] },
      { views: [{ ...CONSOLE_FIXTURE }, { ...PROBLEMS_FIXTURE }] },
    ];
    const from = { devToolIndex: 0, tabPosition: 0 };
    const to = { devToolIndex: 1, tabPosition: 1 };
    const newTabs = moveDevToolsTab(tabs, from, to);

    expect(newTabs).not.toBe(tabs);
  });
});

describe('addDevToolsTab', () => {
  it('can add a tab', () => {
    const tabs = [{ views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] }];

    expect(addDevToolsTab(tabs, BROWSER_FIXTURE)).toMatchSnapshot();
  });

  it('can add a tab on specific position', () => {
    const tabs = [{ views: [{ ...BROWSER_FIXTURE }, { ...TESTS_FIXTURE }] }];

    expect(
      addDevToolsTab(tabs, TESTS_FIXTURE, { devToolIndex: 0, tabPosition: 0 })
    ).toMatchSnapshot();
  });
});
