declare global {
  interface Window {
    chmln: any;
    chmln_resolvers: {
      resolve: any;
      reject: any;
    };
  }
}

let _script;

function loadScript() {
  return new Promise((resolve, reject) => {
    window.chmln_resolvers = {
      resolve,
      reject,
    };
    const script = document.createElement('script');
    script.innerHTML = `/* Chameleon - better user onboarding */!function(t,n,o){var a="chmln",e="adminPreview",c="setup identify alias track clear set show on off custom help _data".split(" ");if(n[a]||(n[a]={}),n[a][e]&&(n[a][e]=!1),!n[a].root){n[a].accountToken=o,n[a].location=n.location.href.toString(),n[a].now=new Date;for(var s=0;s<c.length;s++)!function(){var t=n[a][c[s]+"_a"]=[];n[a][c[s]]=function(){t.push(arguments)}}();var i=t.createElement("script");i.src="https://fast.trychameleon.com/messo/"+o+"/messo.min.js",i.async=!0,i.onload = window.chmln_resolvers.resolve,i.onerror = window.chmln_resolvers.reject,t.head.appendChild(i)}}(document,window,"SD8v1wAhTGvsMfAUSklVZC5ucKfiTB8uw73OJ9QOxIdiGn-1Ia9sN-BDlqTksEtFejdYPw");`;
    document.body.appendChild(script);
  }).then(() => {
    const cmln = document.querySelector('#chmln-editor');

    if (cmln) {
      // @ts-ignore
      cmln.shadowRoot.childNodes[0].innerHTML +=
        '#chmln-toggle-item { top: auto !important; bottom: 100px !important; }';
    }
  });
}

export const setAnonymousUserId = userId => {
  if (!_script) {
    _script = loadScript();
  }

  let uid;
  try {
    uid = document.cookie.match(/\bvisitor-uid=([a-z0-9-]+)(;|$)/)[1];
  } catch (e) {
    document.cookie =
      'visitor-uid=' +
      (uid = userId) +
      '; expires=Tue, Oct 13 2037 04:24:07 UTC; path=/;';
  }

  return _script.then(() => {
    window.chmln.identify(uid, { visitor: true });
  });
};

export const setUserId = userId => {
  if (!_script) {
    _script = loadScript();
  }

  return _script.then(() => {
    window.chmln.identify(userId, {});
  });
};
