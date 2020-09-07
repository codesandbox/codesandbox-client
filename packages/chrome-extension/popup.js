/* eslint-disable */
const query = { active: true, currentWindow: true };

function callback(tabs) {
  const currentTab = tabs[0]; // there will be only one in this array

  const url = currentTab.url;

  function addProtect() {
    const ul = document.getElementById('list');
    const liDevider = document.createElement('li');
    const li = document.createElement('li');
    const linkText = document.createTextNode('Stop Infinite Loop');
    const aTag = document.createElement('a');

    aTag.appendChild(linkText);
    aTag.title = 'Stop Infinite Loop';
    aTag.href = url + '?runonclick=1';
    document.body.appendChild(aTag);

    liDevider.appendChild(document.createElement('hr'));
    li.appendChild(aTag);
    ul.appendChild(liDevider);
    ul.appendChild(li);

    const hrefs = document.getElementsByTagName('a');

    function openLink() {
      const href = this.href;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        chrome.tabs.update(tab.id, { url: href });
      });
    }

    for (var i = 0, a; (a = hrefs[i]); ++i) {
      hrefs[i].addEventListener('click', openLink);
    }
  }

  if (url.indexOf('https://codesandbox.io/s/') > -1) {
    addProtect();
  }
}

chrome.tabs.query(query, callback);
/* eslint-disable */
