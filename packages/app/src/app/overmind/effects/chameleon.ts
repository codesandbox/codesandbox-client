import { Reaction } from '..';

let _hasLoadedScript = false;

export default {
  initialize(reaction: Reaction) {
    reaction(
      state => state.user && state.user.id,
      userId => {
        if (!_hasLoadedScript && userId) {
          const script = document.createElement('script');
          script.innerHTML = `/* Chameleon - better user onboarding */!function(t,n,o){var a="chmln",e="adminPreview",c="setup identify alias track clear set show on off custom help _data".split(" ");if(n[a]||(n[a]={}),n[a][e]&&(n[a][e]=!1),!n[a].root){n[a].accountToken=o,n[a].location=n.location.href.toString(),n[a].now=new Date;for(var s=0;s<c.length;s++)!function(){var t=n[a][c[s]+"_a"]=[];n[a][c[s]]=function(){t.push(arguments)}}();var i=t.createElement("script");i.src="https://fast.trychameleon.com/messo/"+o+"/messo.min.js",i.async=!0,t.head.appendChild(i)}}(document,window,"SD8v1wAhTGvsMfAUSklVZC5ucKfiTB8uw73OJ9QOxIdiGn-1Ia9sN-BDlqTksEtFejdYPw");
          chmln.identify(${userId}, {});`;
          document.body.appendChild(script);
          _hasLoadedScript = true;
        }
      }
    );
  },
};
