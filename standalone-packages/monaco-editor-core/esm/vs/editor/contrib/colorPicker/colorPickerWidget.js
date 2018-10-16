/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import './colorPicker.css';
import { Emitter } from '../../../base/common/event';
import { Widget } from '../../../base/browser/ui/widget';
import * as dom from '../../../base/browser/dom';
import { onDidChangeZoomLevel } from '../../../base/browser/browser';
import { Disposable } from '../../../base/common/lifecycle';
import { GlobalMouseMoveMonitor, standardMouseMoveMerger } from '../../../base/browser/globalMouseMoveMonitor';
import { Color, RGBA, HSVA } from '../../../base/common/color';
import { editorHoverBackground } from '../../../platform/theme/common/colorRegistry';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService';
var $ = dom.$;
var ColorPickerHeader = /** @class */ (function (_super) {
    __extends(ColorPickerHeader, _super);
    function ColorPickerHeader(container, model, themeService) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.domNode = $('.colorpicker-header');
        dom.append(container, _this.domNode);
        _this.pickedColorNode = dom.append(_this.domNode, $('.picked-color'));
        var colorBox = dom.append(_this.domNode, $('.original-color'));
        colorBox.style.backgroundColor = Color.Format.CSS.format(_this.model.originalColor);
        _this.backgroundColor = themeService.getTheme().getColor(editorHoverBackground) || Color.white;
        _this._register(registerThemingParticipant(function (theme, collector) {
            _this.backgroundColor = theme.getColor(editorHoverBackground) || Color.white;
        }));
        _this._register(dom.addDisposableListener(_this.pickedColorNode, dom.EventType.CLICK, function () { return _this.model.selectNextColorPresentation(); }));
        _this._register(dom.addDisposableListener(colorBox, dom.EventType.CLICK, function () {
            _this.model.color = _this.model.originalColor;
            _this.model.flushColor();
        }));
        _this._register(model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this._register(model.onDidChangePresentation(_this.onDidChangePresentation, _this));
        _this.pickedColorNode.style.backgroundColor = Color.Format.CSS.format(model.color);
        dom.toggleClass(_this.pickedColorNode, 'light', model.color.rgba.a < 0.5 ? _this.backgroundColor.isLighter() : model.color.isLighter());
        return _this;
    }
    ColorPickerHeader.prototype.onDidChangeColor = function (color) {
        this.pickedColorNode.style.backgroundColor = Color.Format.CSS.format(color);
        dom.toggleClass(this.pickedColorNode, 'light', color.rgba.a < 0.5 ? this.backgroundColor.isLighter() : color.isLighter());
        this.onDidChangePresentation();
    };
    ColorPickerHeader.prototype.onDidChangePresentation = function () {
        this.pickedColorNode.textContent = this.model.presentation ? this.model.presentation.label : '';
    };
    return ColorPickerHeader;
}(Disposable));
export { ColorPickerHeader };
var ColorPickerBody = /** @class */ (function (_super) {
    __extends(ColorPickerBody, _super);
    function ColorPickerBody(container, model, pixelRatio) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        _this.domNode = $('.colorpicker-body');
        dom.append(container, _this.domNode);
        _this.saturationBox = new SaturationBox(_this.domNode, _this.model, _this.pixelRatio);
        _this._register(_this.saturationBox);
        _this._register(_this.saturationBox.onDidChange(_this.onDidSaturationValueChange, _this));
        _this._register(_this.saturationBox.onColorFlushed(_this.flushColor, _this));
        _this.opacityStrip = new OpacityStrip(_this.domNode, _this.model);
        _this._register(_this.opacityStrip);
        _this._register(_this.opacityStrip.onDidChange(_this.onDidOpacityChange, _this));
        _this._register(_this.opacityStrip.onColorFlushed(_this.flushColor, _this));
        _this.hueStrip = new HueStrip(_this.domNode, _this.model);
        _this._register(_this.hueStrip);
        _this._register(_this.hueStrip.onDidChange(_this.onDidHueChange, _this));
        _this._register(_this.hueStrip.onColorFlushed(_this.flushColor, _this));
        return _this;
    }
    ColorPickerBody.prototype.flushColor = function () {
        this.model.flushColor();
    };
    ColorPickerBody.prototype.onDidSaturationValueChange = function (_a) {
        var s = _a.s, v = _a.v;
        var hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, s, v, hsva.a));
    };
    ColorPickerBody.prototype.onDidOpacityChange = function (a) {
        var hsva = this.model.color.hsva;
        this.model.color = new Color(new HSVA(hsva.h, hsva.s, hsva.v, a));
    };
    ColorPickerBody.prototype.onDidHueChange = function (value) {
        var hsva = this.model.color.hsva;
        var h = (1 - value) * 360;
        this.model.color = new Color(new HSVA(h === 360 ? 0 : h, hsva.s, hsva.v, hsva.a));
    };
    ColorPickerBody.prototype.layout = function () {
        this.saturationBox.layout();
        this.opacityStrip.layout();
        this.hueStrip.layout();
    };
    return ColorPickerBody;
}(Disposable));
export { ColorPickerBody };
var SaturationBox = /** @class */ (function (_super) {
    __extends(SaturationBox, _super);
    function SaturationBox(container, model, pixelRatio) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        _this._onDidChange = new Emitter();
        _this.onDidChange = _this._onDidChange.event;
        _this._onColorFlushed = new Emitter();
        _this.onColorFlushed = _this._onColorFlushed.event;
        _this.domNode = $('.saturation-wrap');
        dom.append(container, _this.domNode);
        // Create canvas, draw selected color
        _this.canvas = document.createElement('canvas');
        _this.canvas.className = 'saturation-box';
        dom.append(_this.domNode, _this.canvas);
        // Add selection circle
        _this.selection = $('.saturation-selection');
        dom.append(_this.domNode, _this.selection);
        _this.layout();
        _this._register(dom.addDisposableListener(_this.domNode, dom.EventType.MOUSE_DOWN, function (e) { return _this.onMouseDown(e); }));
        _this._register(_this.model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this.monitor = null;
        return _this;
    }
    SaturationBox.prototype.onMouseDown = function (e) {
        var _this = this;
        this.monitor = this._register(new GlobalMouseMoveMonitor());
        var origin = dom.getDomNodePagePosition(this.domNode);
        if (e.target !== this.selection) {
            this.onDidChangePosition(e.offsetX, e.offsetY);
        }
        this.monitor.startMonitoring(standardMouseMoveMerger, function (event) { return _this.onDidChangePosition(event.posx - origin.left, event.posy - origin.top); }, function () { return null; });
        var mouseUpListener = dom.addDisposableListener(document, dom.EventType.MOUSE_UP, function () {
            _this._onColorFlushed.fire();
            mouseUpListener.dispose();
            _this.monitor.stopMonitoring(true);
            _this.monitor = null;
        }, true);
    };
    SaturationBox.prototype.onDidChangePosition = function (left, top) {
        var s = Math.max(0, Math.min(1, left / this.width));
        var v = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.paintSelection(s, v);
        this._onDidChange.fire({ s: s, v: v });
    };
    SaturationBox.prototype.layout = function () {
        this.width = this.domNode.offsetWidth;
        this.height = this.domNode.offsetHeight;
        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        this.paint();
        var hsva = this.model.color.hsva;
        this.paintSelection(hsva.s, hsva.v);
    };
    SaturationBox.prototype.paint = function () {
        var hsva = this.model.color.hsva;
        var saturatedColor = new Color(new HSVA(hsva.h, 1, 1, 1));
        var ctx = this.canvas.getContext('2d');
        var whiteGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        var blackGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = Color.Format.CSS.format(saturatedColor);
        ctx.fill();
        ctx.fillStyle = whiteGradient;
        ctx.fill();
        ctx.fillStyle = blackGradient;
        ctx.fill();
    };
    SaturationBox.prototype.paintSelection = function (s, v) {
        this.selection.style.left = s * this.width + "px";
        this.selection.style.top = this.height - v * this.height + "px";
    };
    SaturationBox.prototype.onDidChangeColor = function () {
        if (this.monitor && this.monitor.isMonitoring()) {
            return;
        }
        this.paint();
    };
    return SaturationBox;
}(Disposable));
var Strip = /** @class */ (function (_super) {
    __extends(Strip, _super);
    function Strip(container, model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this._onDidChange = new Emitter();
        _this.onDidChange = _this._onDidChange.event;
        _this._onColorFlushed = new Emitter();
        _this.onColorFlushed = _this._onColorFlushed.event;
        _this.domNode = dom.append(container, $('.strip'));
        _this.overlay = dom.append(_this.domNode, $('.overlay'));
        _this.slider = dom.append(_this.domNode, $('.slider'));
        _this.slider.style.top = "0px";
        _this._register(dom.addDisposableListener(_this.domNode, dom.EventType.MOUSE_DOWN, function (e) { return _this.onMouseDown(e); }));
        _this.layout();
        return _this;
    }
    Strip.prototype.layout = function () {
        this.height = this.domNode.offsetHeight - this.slider.offsetHeight;
        var value = this.getValue(this.model.color);
        this.updateSliderPosition(value);
    };
    Strip.prototype.onMouseDown = function (e) {
        var _this = this;
        var monitor = this._register(new GlobalMouseMoveMonitor());
        var origin = dom.getDomNodePagePosition(this.domNode);
        dom.addClass(this.domNode, 'grabbing');
        if (e.target !== this.slider) {
            this.onDidChangeTop(e.offsetY);
        }
        monitor.startMonitoring(standardMouseMoveMerger, function (event) { return _this.onDidChangeTop(event.posy - origin.top); }, function () { return null; });
        var mouseUpListener = dom.addDisposableListener(document, dom.EventType.MOUSE_UP, function () {
            _this._onColorFlushed.fire();
            mouseUpListener.dispose();
            monitor.stopMonitoring(true);
            dom.removeClass(_this.domNode, 'grabbing');
        }, true);
    };
    Strip.prototype.onDidChangeTop = function (top) {
        var value = Math.max(0, Math.min(1, 1 - (top / this.height)));
        this.updateSliderPosition(value);
        this._onDidChange.fire(value);
    };
    Strip.prototype.updateSliderPosition = function (value) {
        this.slider.style.top = (1 - value) * this.height + "px";
    };
    return Strip;
}(Disposable));
var OpacityStrip = /** @class */ (function (_super) {
    __extends(OpacityStrip, _super);
    function OpacityStrip(container, model) {
        var _this = _super.call(this, container, model) || this;
        dom.addClass(_this.domNode, 'opacity-strip');
        _this._register(model.onDidChangeColor(_this.onDidChangeColor, _this));
        _this.onDidChangeColor(_this.model.color);
        return _this;
    }
    OpacityStrip.prototype.onDidChangeColor = function (color) {
        var _a = color.rgba, r = _a.r, g = _a.g, b = _a.b;
        var opaque = new Color(new RGBA(r, g, b, 1));
        var transparent = new Color(new RGBA(r, g, b, 0));
        this.overlay.style.background = "linear-gradient(to bottom, " + opaque + " 0%, " + transparent + " 100%)";
    };
    OpacityStrip.prototype.getValue = function (color) {
        return color.hsva.a;
    };
    return OpacityStrip;
}(Strip));
var HueStrip = /** @class */ (function (_super) {
    __extends(HueStrip, _super);
    function HueStrip(container, model) {
        var _this = _super.call(this, container, model) || this;
        dom.addClass(_this.domNode, 'hue-strip');
        return _this;
    }
    HueStrip.prototype.getValue = function (color) {
        return 1 - (color.hsva.h / 360);
    };
    return HueStrip;
}(Strip));
var ColorPickerWidget = /** @class */ (function (_super) {
    __extends(ColorPickerWidget, _super);
    function ColorPickerWidget(container, model, pixelRatio, themeService) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pixelRatio = pixelRatio;
        _this._register(onDidChangeZoomLevel(function () { return _this.layout(); }));
        var element = $('.colorpicker-widget');
        container.appendChild(element);
        var header = new ColorPickerHeader(element, _this.model, themeService);
        _this.body = new ColorPickerBody(element, _this.model, _this.pixelRatio);
        _this._register(header);
        _this._register(_this.body);
        return _this;
    }
    ColorPickerWidget.prototype.getId = function () {
        return ColorPickerWidget.ID;
    };
    ColorPickerWidget.prototype.layout = function () {
        this.body.layout();
    };
    ColorPickerWidget.ID = 'editor.contrib.colorPickerWidget';
    return ColorPickerWidget;
}(Widget));
export { ColorPickerWidget };
