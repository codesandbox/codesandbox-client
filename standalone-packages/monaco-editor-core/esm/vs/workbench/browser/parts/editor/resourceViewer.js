/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './media/resourceviewer.css';
import * as nls from '../../../../nls';
import * as mimes from '../../../../base/common/mime';
import * as DOM from '../../../../base/browser/dom';
import { LRUCache } from '../../../../base/common/map';
import { Schemas } from '../../../../base/common/network';
import { clamp } from '../../../../base/common/numbers';
import { Themable } from '../../../common/theme';
import { StatusbarItemDescriptor, Extensions } from '../statusbar/statusbar';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView';
import { Disposable, combinedDisposable } from '../../../../base/common/lifecycle';
import { IThemeService } from '../../../../platform/theme/common/themeService';
import { Registry } from '../../../../platform/registry/common/platform';
import { Action } from '../../../../base/common/actions';
import { IEditorService } from '../../../services/editor/common/editorService';
import { memoize } from '../../../../base/common/decorators';
import * as platform from '../../../../base/common/platform';
var BinarySize = /** @class */ (function () {
    function BinarySize() {
    }
    BinarySize.formatSize = function (size) {
        if (size < BinarySize.KB) {
            return nls.localize('sizeB', "{0}B", size);
        }
        if (size < BinarySize.MB) {
            return nls.localize('sizeKB', "{0}KB", (size / BinarySize.KB).toFixed(2));
        }
        if (size < BinarySize.GB) {
            return nls.localize('sizeMB', "{0}MB", (size / BinarySize.MB).toFixed(2));
        }
        if (size < BinarySize.TB) {
            return nls.localize('sizeGB', "{0}GB", (size / BinarySize.GB).toFixed(2));
        }
        return nls.localize('sizeTB', "{0}TB", (size / BinarySize.TB).toFixed(2));
    };
    BinarySize.KB = 1024;
    BinarySize.MB = BinarySize.KB * BinarySize.KB;
    BinarySize.GB = BinarySize.MB * BinarySize.KB;
    BinarySize.TB = BinarySize.GB * BinarySize.KB;
    return BinarySize;
}());
/**
 * Helper to actually render the given resource into the provided container. Will adjust scrollbar (if provided) automatically based on loading
 * progress of the binary resource.
 */
var ResourceViewer = /** @class */ (function () {
    function ResourceViewer() {
    }
    ResourceViewer.show = function (descriptor, fileService, container, scrollbar, openInternalClb, openExternalClb, metadataClb) {
        // Ensure CSS class
        container.className = 'monaco-resource-viewer';
        // Images
        if (ResourceViewer.isImageResource(descriptor)) {
            return ImageView.create(container, descriptor, fileService, scrollbar, openExternalClb, metadataClb);
        }
        // Large Files
        if (descriptor.size > ResourceViewer.MAX_OPEN_INTERNAL_SIZE) {
            return FileTooLargeFileView.create(container, descriptor, scrollbar, metadataClb);
        }
        // Seemingly Binary Files
        else {
            return FileSeemsBinaryFileView.create(container, descriptor, scrollbar, openInternalClb, metadataClb);
        }
    };
    ResourceViewer.isImageResource = function (descriptor) {
        var mime = getMime(descriptor);
        // Chrome does not support tiffs
        return mime.indexOf('image/') >= 0 && mime !== 'image/tiff';
    };
    ResourceViewer.MAX_OPEN_INTERNAL_SIZE = BinarySize.MB * 200; // max size until we offer an action to open internally
    return ResourceViewer;
}());
export { ResourceViewer };
var ImageView = /** @class */ (function () {
    function ImageView() {
    }
    ImageView.create = function (container, descriptor, fileService, scrollbar, openExternalClb, metadataClb) {
        if (ImageView.shouldShowImageInline(descriptor)) {
            return InlineImageView.create(container, descriptor, fileService, scrollbar, metadataClb);
        }
        return LargeImageView.create(container, descriptor, openExternalClb);
    };
    ImageView.shouldShowImageInline = function (descriptor) {
        var skipInlineImage;
        // Data URI
        if (descriptor.resource.scheme === Schemas.data) {
            var base64MarkerIndex = descriptor.resource.path.indexOf(ImageView.BASE64_MARKER);
            var hasData = base64MarkerIndex >= 0 && descriptor.resource.path.substring(base64MarkerIndex + ImageView.BASE64_MARKER.length).length > 0;
            skipInlineImage = !hasData || descriptor.size > ImageView.MAX_IMAGE_SIZE || descriptor.resource.path.length > ImageView.MAX_IMAGE_SIZE;
        }
        // File URI
        else {
            skipInlineImage = typeof descriptor.size !== 'number' || descriptor.size > ImageView.MAX_IMAGE_SIZE;
        }
        return !skipInlineImage;
    };
    ImageView.MAX_IMAGE_SIZE = BinarySize.MB; // showing images inline is memory intense, so we have a limit
    ImageView.BASE64_MARKER = 'base64,';
    return ImageView;
}());
var LargeImageView = /** @class */ (function () {
    function LargeImageView() {
    }
    LargeImageView.create = function (container, descriptor, openExternalClb) {
        DOM.clearNode(container);
        var disposables = [];
        var label = document.createElement('p');
        label.textContent = nls.localize('largeImageError', "The image is not displayed in the editor because it is too large ({0}).", BinarySize.formatSize(descriptor.size));
        container.appendChild(label);
        if (descriptor.resource.scheme !== Schemas.data) {
            var link = DOM.append(label, DOM.$('a.embedded-link'));
            link.setAttribute('role', 'button');
            link.textContent = nls.localize('resourceOpenExternalButton', "Open image using external program?");
            disposables.push(DOM.addDisposableListener(link, DOM.EventType.CLICK, function () { return openExternalClb(descriptor.resource); }));
        }
        return combinedDisposable(disposables);
    };
    return LargeImageView;
}());
var FileTooLargeFileView = /** @class */ (function () {
    function FileTooLargeFileView() {
    }
    FileTooLargeFileView.create = function (container, descriptor, scrollbar, metadataClb) {
        DOM.clearNode(container);
        var size = BinarySize.formatSize(descriptor.size);
        var label = document.createElement('span');
        label.textContent = nls.localize('nativeFileTooLargeError', "The file is not displayed in the editor because it is too large ({0}).", size);
        container.appendChild(label);
        if (metadataClb) {
            metadataClb(size);
        }
        scrollbar.scanDomNode();
        return Disposable.None;
    };
    return FileTooLargeFileView;
}());
var FileSeemsBinaryFileView = /** @class */ (function () {
    function FileSeemsBinaryFileView() {
    }
    FileSeemsBinaryFileView.create = function (container, descriptor, scrollbar, openInternalClb, metadataClb) {
        DOM.clearNode(container);
        var disposables = [];
        var label = document.createElement('p');
        label.textContent = nls.localize('nativeBinaryError', "The file is not displayed in the editor because it is either binary or uses an unsupported text encoding.");
        container.appendChild(label);
        if (descriptor.resource.scheme !== Schemas.data) {
            var link = DOM.append(label, DOM.$('a.embedded-link'));
            link.setAttribute('role', 'button');
            link.textContent = nls.localize('openAsText', "Do you want to open it anyway?");
            disposables.push(DOM.addDisposableListener(link, DOM.EventType.CLICK, function () { return openInternalClb(descriptor.resource); }));
        }
        if (metadataClb) {
            metadataClb(BinarySize.formatSize(descriptor.size));
        }
        scrollbar.scanDomNode();
        return combinedDisposable(disposables);
    };
    return FileSeemsBinaryFileView;
}());
var ZoomStatusbarItem = /** @class */ (function (_super) {
    __extends(ZoomStatusbarItem, _super);
    function ZoomStatusbarItem(contextMenuService, editorService, themeService) {
        var _this = _super.call(this, themeService) || this;
        _this.contextMenuService = contextMenuService;
        ZoomStatusbarItem.instance = _this;
        _this._register(editorService.onDidActiveEditorChange(function () { return _this.onActiveEditorChanged(); }));
        return _this;
    }
    ZoomStatusbarItem.prototype.onActiveEditorChanged = function () {
        this.hide();
        this.onSelectScale = void 0;
    };
    ZoomStatusbarItem.prototype.show = function (scale, onSelectScale) {
        var _this = this;
        clearTimeout(this.showTimeout);
        this.showTimeout = setTimeout(function () {
            _this.onSelectScale = onSelectScale;
            _this.statusBarItem.style.display = 'block';
            _this.updateLabel(scale);
        }, 0);
    };
    ZoomStatusbarItem.prototype.hide = function () {
        this.statusBarItem.style.display = 'none';
    };
    ZoomStatusbarItem.prototype.render = function (container) {
        var _this = this;
        if (!this.statusBarItem && container) {
            this.statusBarItem = DOM.append(container, DOM.$('a.zoom-statusbar-item'));
            this.statusBarItem.setAttribute('role', 'button');
            this.statusBarItem.style.display = 'none';
            DOM.addDisposableListener(this.statusBarItem, DOM.EventType.CLICK, function () {
                _this.contextMenuService.showContextMenu({
                    getAnchor: function () { return container; },
                    getActions: function () { return Promise.resolve(_this.zoomActions); }
                });
            });
        }
        return this;
    };
    ZoomStatusbarItem.prototype.updateLabel = function (scale) {
        this.statusBarItem.textContent = ZoomStatusbarItem.zoomLabel(scale);
    };
    Object.defineProperty(ZoomStatusbarItem.prototype, "zoomActions", {
        get: function () {
            var _this = this;
            var scales = [10, 5, 2, 1, 0.5, 0.2, 'fit'];
            return scales.map(function (scale) {
                return new Action("zoom." + scale, ZoomStatusbarItem.zoomLabel(scale), void 0, void 0, function () {
                    if (_this.onSelectScale) {
                        _this.onSelectScale(scale);
                    }
                    return void 0;
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    ZoomStatusbarItem.zoomLabel = function (scale) {
        return scale === 'fit'
            ? nls.localize('zoom.action.fit.label', 'Whole Image')
            : Math.round(scale * 100) + "%";
    };
    __decorate([
        memoize
    ], ZoomStatusbarItem.prototype, "zoomActions", null);
    ZoomStatusbarItem = __decorate([
        __param(0, IContextMenuService),
        __param(1, IEditorService),
        __param(2, IThemeService)
    ], ZoomStatusbarItem);
    return ZoomStatusbarItem;
}(Themable));
Registry.as(Extensions.Statusbar).registerStatusbarItem(new StatusbarItemDescriptor(ZoomStatusbarItem, 1 /* RIGHT */, 101 /* to the left of editor status (100) */));
var InlineImageView = /** @class */ (function () {
    function InlineImageView() {
    }
    InlineImageView.create = function (container, descriptor, fileService, scrollbar, metadataClb) {
        var disposables = [];
        var context = {
            layout: function (dimension) { },
            dispose: function () { return combinedDisposable(disposables).dispose(); }
        };
        var cacheKey = descriptor.resource.toString();
        var ctrlPressed = false;
        var altPressed = false;
        var initialState = InlineImageView.imageStateCache.get(cacheKey) || { scale: 'fit', offsetX: 0, offsetY: 0 };
        var scale = initialState.scale;
        var image = null;
        function updateScale(newScale) {
            if (!image || !image.parentElement) {
                return;
            }
            if (newScale === 'fit') {
                scale = 'fit';
                DOM.addClass(image, 'scale-to-fit');
                DOM.removeClass(image, 'pixelated');
                image.style.minWidth = 'auto';
                image.style.width = 'auto';
                InlineImageView.imageStateCache.set(cacheKey, null);
            }
            else {
                var oldWidth = image.width;
                var oldHeight = image.height;
                scale = clamp(newScale, InlineImageView.MIN_SCALE, InlineImageView.MAX_SCALE);
                if (scale >= InlineImageView.PIXELATION_THRESHOLD) {
                    DOM.addClass(image, 'pixelated');
                }
                else {
                    DOM.removeClass(image, 'pixelated');
                }
                var _a = image.parentElement, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
                var dx = (scrollLeft + image.parentElement.clientWidth / 2) / image.parentElement.scrollWidth;
                var dy = (scrollTop + image.parentElement.clientHeight / 2) / image.parentElement.scrollHeight;
                DOM.removeClass(image, 'scale-to-fit');
                image.style.minWidth = (image.naturalWidth * scale) + "px";
                image.style.widows = (image.naturalWidth * scale) + "px";
                var newWidth = image.width;
                var scaleFactor = (newWidth - oldWidth) / oldWidth;
                var newScrollLeft = ((oldWidth * scaleFactor * dx) + scrollLeft);
                var newScrollTop = ((oldHeight * scaleFactor * dy) + scrollTop);
                scrollbar.setScrollPosition({
                    scrollLeft: newScrollLeft,
                    scrollTop: newScrollTop,
                });
                InlineImageView.imageStateCache.set(cacheKey, { scale: scale, offsetX: newScrollLeft, offsetY: newScrollTop });
            }
            ZoomStatusbarItem.instance.show(scale, updateScale);
            scrollbar.scanDomNode();
        }
        function firstZoom() {
            scale = image.clientWidth / image.naturalWidth;
            updateScale(scale);
        }
        disposables.push(DOM.addDisposableListener(container, DOM.EventType.KEY_DOWN, function (e) {
            if (!image) {
                return;
            }
            ctrlPressed = e.ctrlKey;
            altPressed = e.altKey;
            if (platform.isMacintosh ? altPressed : ctrlPressed) {
                DOM.removeClass(container, 'zoom-in');
                DOM.addClass(container, 'zoom-out');
            }
        }));
        disposables.push(DOM.addDisposableListener(container, DOM.EventType.KEY_UP, function (e) {
            if (!image) {
                return;
            }
            ctrlPressed = e.ctrlKey;
            altPressed = e.altKey;
            if (!(platform.isMacintosh ? altPressed : ctrlPressed)) {
                DOM.removeClass(container, 'zoom-out');
                DOM.addClass(container, 'zoom-in');
            }
        }));
        disposables.push(DOM.addDisposableListener(container, DOM.EventType.CLICK, function (e) {
            if (!image) {
                return;
            }
            if (e.button !== 0) {
                return;
            }
            // left click
            if (scale === 'fit') {
                firstZoom();
            }
            if (!(platform.isMacintosh ? altPressed : ctrlPressed)) { // zoom in
                var i = 0;
                for (; i < InlineImageView.zoomLevels.length; ++i) {
                    if (InlineImageView.zoomLevels[i] > scale) {
                        break;
                    }
                }
                updateScale(InlineImageView.zoomLevels[i] || InlineImageView.MAX_SCALE);
            }
            else {
                var i = InlineImageView.zoomLevels.length - 1;
                for (; i >= 0; --i) {
                    if (InlineImageView.zoomLevels[i] < scale) {
                        break;
                    }
                }
                updateScale(InlineImageView.zoomLevels[i] || InlineImageView.MIN_SCALE);
            }
        }));
        disposables.push(DOM.addDisposableListener(container, DOM.EventType.WHEEL, function (e) {
            if (!image) {
                return;
            }
            var isScrollWhellKeyPressed = platform.isMacintosh ? altPressed : ctrlPressed;
            if (!isScrollWhellKeyPressed && !e.ctrlKey) { // pinching is reported as scroll wheel + ctrl
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            if (scale === 'fit') {
                firstZoom();
            }
            var delta = e.deltaY < 0 ? 1 : -1;
            // Pinching should increase the scale
            if (e.ctrlKey && !isScrollWhellKeyPressed) {
                delta *= -1;
            }
            updateScale(scale * (1 - delta * InlineImageView.SCALE_PINCH_FACTOR));
        }));
        disposables.push(DOM.addDisposableListener(container, DOM.EventType.SCROLL, function () {
            if (!image || !image.parentElement || scale === 'fit') {
                return;
            }
            var entry = InlineImageView.imageStateCache.get(cacheKey);
            if (entry) {
                var _a = image.parentElement, scrollTop = _a.scrollTop, scrollLeft = _a.scrollLeft;
                InlineImageView.imageStateCache.set(cacheKey, { scale: entry.scale, offsetX: scrollLeft, offsetY: scrollTop });
            }
        }));
        DOM.clearNode(container);
        DOM.addClasses(container, 'image', 'zoom-in');
        image = DOM.append(container, DOM.$('img.scale-to-fit'));
        image.style.visibility = 'hidden';
        disposables.push(DOM.addDisposableListener(image, DOM.EventType.LOAD, function (e) {
            metadataClb(nls.localize('imgMeta', '{0}x{1} {2}', image.naturalWidth, image.naturalHeight, BinarySize.formatSize(descriptor.size)));
            scrollbar.scanDomNode();
            image.style.visibility = 'visible';
            updateScale(scale);
            if (initialState.scale !== 'fit') {
                scrollbar.setScrollPosition({
                    scrollLeft: initialState.offsetX,
                    scrollTop: initialState.offsetY,
                });
            }
        }));
        InlineImageView.imageSrc(descriptor, fileService).then(function (dataUri) {
            var imgs = container.getElementsByTagName('img');
            if (imgs.length) {
                imgs[0].src = dataUri;
            }
        });
        return context;
    };
    InlineImageView.imageSrc = function (descriptor, fileService) {
        if (descriptor.resource.scheme === Schemas.data) {
            return Promise.resolve(descriptor.resource.toString(true /* skip encoding */));
        }
        return fileService.resolveContent(descriptor.resource, { encoding: 'base64' }).then(function (data) {
            var mime = getMime(descriptor);
            return "data:" + mime + ";base64," + data.value;
        });
    };
    InlineImageView.SCALE_PINCH_FACTOR = 0.075;
    InlineImageView.MAX_SCALE = 20;
    InlineImageView.MIN_SCALE = 0.1;
    InlineImageView.zoomLevels = [
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.5,
        2,
        3,
        5,
        7,
        10,
        15,
        20
    ];
    /**
     * Enable image-rendering: pixelated for images scaled by more than this.
     */
    InlineImageView.PIXELATION_THRESHOLD = 3;
    /**
     * Store the scale and position of an image so it can be restored when changing editor tabs
     */
    InlineImageView.imageStateCache = new LRUCache(100);
    return InlineImageView;
}());
function getMime(descriptor) {
    var mime = descriptor.mime;
    if (!mime && descriptor.resource.scheme !== Schemas.data) {
        mime = mimes.getMediaMime(descriptor.resource.path);
    }
    return mime || mimes.MIME_BINARY;
}
