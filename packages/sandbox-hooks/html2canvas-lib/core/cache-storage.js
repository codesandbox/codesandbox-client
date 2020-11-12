import { FEATURES } from './features';
import { Logger } from './logger';
export class CacheStorage {
    static create(name, options) {
        return (CacheStorage._caches[name] = new Cache(name, options));
    }
    static destroy(name) {
        delete CacheStorage._caches[name];
    }
    static open(name) {
        const cache = CacheStorage._caches[name];
        if (typeof cache !== 'undefined') {
            return cache;
        }
        throw new Error(`Cache with key "${name}" not found`);
    }
    static getOrigin(url) {
        const link = CacheStorage._link;
        if (!link) {
            return 'about:blank';
        }
        link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }
    static isSameOrigin(src) {
        return CacheStorage.getOrigin(src) === CacheStorage._origin;
    }
    static setContext(window) {
        CacheStorage._link = window.document.createElement('a');
        CacheStorage._origin = CacheStorage.getOrigin(window.location.href);
    }
    static getInstance() {
        const current = CacheStorage._current;
        if (current === null) {
            throw new Error(`No cache instance attached`);
        }
        return current;
    }
    static attachInstance(cache) {
        CacheStorage._current = cache;
    }
    static detachInstance() {
        CacheStorage._current = null;
    }
}
CacheStorage._caches = {};
CacheStorage._origin = 'about:blank';
CacheStorage._current = null;
export class Cache {
    constructor(id, options) {
        this.id = id;
        this._options = options;
        this._cache = {};
    }
    addImage(src) {
        const result = Promise.resolve();
        if (this.has(src)) {
            return result;
        }
        if (isBlobImage(src) || isRenderable(src)) {
            this._cache[src] = this.loadImage(src);
            return result;
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match(src) {
        return this._cache[src];
    }
    async loadImage(key) {
        const isSameOrigin = CacheStorage.isSameOrigin(key);
        const useCORS = 
        // MODIFY: Use Boolean to check for either "true" or a function
        !isInlineImage(key) && Boolean(this._options.useCORS) && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;
        const useProxy = !isInlineImage(key) &&
            !isSameOrigin &&
            typeof this._options.proxy === 'string' &&
            FEATURES.SUPPORT_CORS_XHR &&
            !useCORS;
        if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key) && !useProxy && !useCORS) {
            return;
        }
        let src = key;
        if (useProxy) {
            src = await this.proxy(src);
        }
        Logger.getInstance(this.id).debug(`Added image ${key.substring(0, 256)}`);
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
            if (isInlineBase64Image(src) ||
                // MODIFY: Check for function and evaluate
                typeof this._options.useCORS === 'function' && this._options.useCORS(src, isSameOrigin) ||
                useCORS) {
                img.crossOrigin = 'anonymous';
            }
            img.src = src;
            if (img.complete === true) {
                // Inline XML images may fail to parse, throwing an Error later on
                setTimeout(() => resolve(img), 500);
            }
            if (this._options.imageTimeout > 0) {
                setTimeout(() => reject(`Timed out (${this._options.imageTimeout}ms) loading image`), this._options.imageTimeout);
            }
        });
    }
    has(key) {
        return typeof this._cache[key] !== 'undefined';
    }
    keys() {
        return Promise.resolve(Object.keys(this._cache));
    }
    proxy(src) {
        const proxy = this._options.proxy;
        if (!proxy) {
            throw new Error('No proxy defined');
        }
        const key = src.substring(0, 256);
        return new Promise((resolve, reject) => {
            const responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        resolve(xhr.response);
                    }
                    else {
                        const reader = new FileReader();
                        reader.addEventListener('load', () => resolve(reader.result), false);
                        reader.addEventListener('error', e => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                }
                else {
                    reject(`Failed to proxy resource ${key} with status code ${xhr.status}`);
                }
            };
            xhr.onerror = reject;
            xhr.open('GET', `${proxy}?url=${encodeURIComponent(src)}&responseType=${responseType}`);
            if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
                xhr.responseType = responseType;
            }
            if (this._options.imageTimeout) {
                const timeout = this._options.imageTimeout;
                xhr.timeout = timeout;
                xhr.ontimeout = () => reject(`Timed out (${timeout}ms) proxying ${key}`);
            }
            xhr.send();
        });
    }
}
const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;
const isRenderable = (src) => FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src);
const isInlineImage = (src) => INLINE_IMG.test(src);
const isInlineBase64Image = (src) => INLINE_BASE64.test(src);
const isBlobImage = (src) => src.substr(0, 4) === 'blob';
const isSVG = (src) => src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
