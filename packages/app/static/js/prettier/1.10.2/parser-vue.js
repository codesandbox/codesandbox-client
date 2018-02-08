var vue = (function () {
var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

function makeMap(e,t){const n=Object.create(null),a=e.split(",");for(let e=0;e<a.length;e++)n[a[e]]=!0;return t?e=>n[e.toLowerCase()]:e=>n[e]}function decodeAttr(e,t){const n=t?encodedAttrWithNewLines:encodedAttr;return e.replace(n,e=>decodingMap[e])}function parseHTML(e,t){function n(t){d+=t,e=e.substring(t);}function a(e,n,a){let o,s;if(null==n&&(n=d),null==a&&(a=d),e&&(s=e.toLowerCase()),e)for(o=r.length-1;o>=0&&r[o].lowerCasedTag!==s;o--);else o=0;if(o>=0){for(let s=r.length-1;s>=o;s--)"production"!==process.env.NODE_ENV&&(s>o||!e)&&t.warn&&t.warn(`tag <${r[s].tag}> has no matching end tag.`),t.end&&t.end(r[s].tag,n,a);r.length=o,l=o&&r[o-1].tag;}else"br"===s?t.start&&t.start(e,[],!0,n,a):"p"===s&&(t.start&&t.start(e,[],!1,n,a),t.end&&t.end(e,n,a));}const r=[],o=t.expectHTML,s=t.isUnaryTag||no,c=t.canBeLeftOpenTag||no;let i,l,d=0;for(;e;){if(i=e,l&&isPlainTextElement(l)){let n=0;const r=l.toLowerCase(),o=reCache[r]||(reCache[r]=new RegExp("([\\s\\S]*?)(</"+r+"[^>]*>)","i")),s=e.replace(o,(e,a,o)=>(n=o.length,isPlainTextElement(r)||"noscript"===r||(a=a.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g,"$1")),shouldIgnoreFirstNewline(r,a)&&(a=a.slice(1)),t.chars&&t.chars(a),""));d+=e.length-s.length,e=s,a(r,d-n,d);}else{let i=e.indexOf("<");if(0===i){if(comment.test(e)){const a=e.indexOf("--\x3e");if(a>=0){t.shouldKeepComment&&t.comment(e.substring(4,a)),n(a+3);continue}}if(conditionalComment.test(e)){const t=e.indexOf("]>");if(t>=0){n(t+2);continue}}const i=e.match(doctype);if(i){n(i[0].length);continue}const g=e.match(endTag);if(g){const e=d;n(g[0].length),a(g[1],e,d);continue}const h=function(){const t=e.match(startTagOpen);if(t){const a={tagName:t[1],attrs:[],start:d};n(t[0].length);let r,o;for(;!(r=e.match(startTagClose))&&(o=e.match(attribute));)n(o[0].length),a.attrs.push(o);if(r)return a.unarySlash=r[1],n(r[0].length),a.end=d,a}}();if(h){!function(e){const n=e.tagName,i=e.unarySlash;o&&("p"===l&&isNonPhrasingTag(n)&&a(l),c(n)&&l===n&&a(n));const d=s(n)||!!i,g=e.attrs.length,h=new Array(g);for(let a=0;a<g;a++){const r=e.attrs[a];IS_REGEX_CAPTURING_BROKEN&&-1===r[0].indexOf('""')&&(""===r[3]&&delete r[3],""===r[4]&&delete r[4],""===r[5]&&delete r[5]);const o=r[3]||r[4]||r[5]||"",s="a"===n&&"href"===r[1]?t.shouldDecodeNewlinesForHref:t.shouldDecodeNewlines;h[a]={name:r[1],value:decodeAttr(o,s)};}d||(r.push({tag:n,lowerCasedTag:n.toLowerCase(),attrs:h}),l=n),t.start&&t.start(n,h,d,e.start,e.end);}(h),shouldIgnoreFirstNewline(l,e)&&n(1);continue}}let g,h,u;if(i>=0){for(h=e.slice(i);!(endTag.test(h)||startTagOpen.test(h)||comment.test(h)||conditionalComment.test(h)||(u=h.indexOf("<",1))<0);)i+=u,h=e.slice(i);g=e.substring(0,i),n(i);}i<0&&(g=e,e=""),t.chars&&g&&t.chars(g);}if(e===i){t.chars&&t.chars(e),"production"!==process.env.NODE_ENV&&!r.length&&t.warn&&t.warn(`Mal-formatted tag at end of template: "${e}"`);break}}a();}function parse(e){const t={tag:"root",attrs:[],unary:!1,start:0,contentStart:0,contentEnd:e.length,end:e.length,children:[],comments:[]},n=[t];let a=t;return parseHTML(e,{start:function(e,t,r,o,s){const c={tag:e,attrs:t,unary:r,start:o,children:[]};a.children.push(c),r?c.end=s:(c.contentStart=s,n.push(c),a=c);},end:function(e,t,r){n.pop(),a.contentEnd=t,a.end=r,a=n[n.length-1];}}),t}const no=()=>!1; const isNonPhrasingTag=makeMap("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"); const attribute=/^\s*([^\s"'<>/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; const ncname="[a-zA-Z_][\\w\\-\\.]*"; const qnameCapture=`((?:${ncname}\\:)?${ncname})`; const startTagOpen=new RegExp(`^<${qnameCapture}`); const startTagClose=/^\s*(\/?)>/; const endTag=new RegExp(`^<\\/${qnameCapture}[^>]*>`); const doctype=/^<!DOCTYPE [^>]+>/i; const comment=/^<!--/; const conditionalComment=/^<!\[/;let IS_REGEX_CAPTURING_BROKEN=!1;"x".replace(/x(.)?/g,(e,t)=>{IS_REGEX_CAPTURING_BROKEN=""===t;});const isPlainTextElement=makeMap("script,style,textarea",!0); const reCache={}; const decodingMap={"&lt;":"<","&gt;":">","&quot;":'"',"&amp;":"&","&#10;":"\n","&#9;":"\t"}; const encodedAttr=/&(?:lt|gt|quot|amp);/g; const encodedAttrWithNewLines=/&(?:lt|gt|quot|amp|#10|#9);/g; const isIgnoreNewlineTag=makeMap("pre,textarea",!0); const shouldIgnoreFirstNewline=(e,t)=>e&&isIgnoreNewlineTag(e)&&"\n"===t[0];var parserVue=parse;var parserVue_1=parserVue;

return parserVue_1;

}());
