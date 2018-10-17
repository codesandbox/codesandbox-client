/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var scanCodeIntToStr = [];
var scanCodeStrToInt = Object.create(null);
var scanCodeLowerCaseStrToInt = Object.create(null);
export var ScanCodeUtils = {
    lowerCaseToEnum: function (scanCode) { return scanCodeLowerCaseStrToInt[scanCode] || 0 /* None */; },
    toEnum: function (scanCode) { return scanCodeStrToInt[scanCode] || 0 /* None */; },
    toString: function (scanCode) { return scanCodeIntToStr[scanCode] || 'None'; }
};
/**
 * -1 if a ScanCode => KeyCode mapping depends on kb layout.
 */
export var IMMUTABLE_CODE_TO_KEY_CODE = [];
/**
 * -1 if a KeyCode => ScanCode mapping depends on kb layout.
 */
export var IMMUTABLE_KEY_CODE_TO_CODE = [];
var ScanCodeBinding = /** @class */ (function () {
    function ScanCodeBinding(ctrlKey, shiftKey, altKey, metaKey, scanCode) {
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.metaKey = metaKey;
        this.scanCode = scanCode;
    }
    ScanCodeBinding.prototype.equals = function (other) {
        return (this.ctrlKey === other.ctrlKey
            && this.shiftKey === other.shiftKey
            && this.altKey === other.altKey
            && this.metaKey === other.metaKey
            && this.scanCode === other.scanCode);
    };
    /**
     * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
     */
    ScanCodeBinding.prototype.isDuplicateModifierCase = function () {
        return ((this.ctrlKey && (this.scanCode === 157 /* ControlLeft */ || this.scanCode === 161 /* ControlRight */))
            || (this.shiftKey && (this.scanCode === 158 /* ShiftLeft */ || this.scanCode === 162 /* ShiftRight */))
            || (this.altKey && (this.scanCode === 159 /* AltLeft */ || this.scanCode === 163 /* AltRight */))
            || (this.metaKey && (this.scanCode === 160 /* MetaLeft */ || this.scanCode === 164 /* MetaRight */)));
    };
    return ScanCodeBinding;
}());
export { ScanCodeBinding };
(function () {
    function d(intScanCode, strScanCode) {
        scanCodeIntToStr[intScanCode] = strScanCode;
        scanCodeStrToInt[strScanCode] = intScanCode;
        scanCodeLowerCaseStrToInt[strScanCode.toLowerCase()] = intScanCode;
    }
    d(0 /* None */, 'None');
    d(1 /* Hyper */, 'Hyper');
    d(2 /* Super */, 'Super');
    d(3 /* Fn */, 'Fn');
    d(4 /* FnLock */, 'FnLock');
    d(5 /* Suspend */, 'Suspend');
    d(6 /* Resume */, 'Resume');
    d(7 /* Turbo */, 'Turbo');
    d(8 /* Sleep */, 'Sleep');
    d(9 /* WakeUp */, 'WakeUp');
    d(10 /* KeyA */, 'KeyA');
    d(11 /* KeyB */, 'KeyB');
    d(12 /* KeyC */, 'KeyC');
    d(13 /* KeyD */, 'KeyD');
    d(14 /* KeyE */, 'KeyE');
    d(15 /* KeyF */, 'KeyF');
    d(16 /* KeyG */, 'KeyG');
    d(17 /* KeyH */, 'KeyH');
    d(18 /* KeyI */, 'KeyI');
    d(19 /* KeyJ */, 'KeyJ');
    d(20 /* KeyK */, 'KeyK');
    d(21 /* KeyL */, 'KeyL');
    d(22 /* KeyM */, 'KeyM');
    d(23 /* KeyN */, 'KeyN');
    d(24 /* KeyO */, 'KeyO');
    d(25 /* KeyP */, 'KeyP');
    d(26 /* KeyQ */, 'KeyQ');
    d(27 /* KeyR */, 'KeyR');
    d(28 /* KeyS */, 'KeyS');
    d(29 /* KeyT */, 'KeyT');
    d(30 /* KeyU */, 'KeyU');
    d(31 /* KeyV */, 'KeyV');
    d(32 /* KeyW */, 'KeyW');
    d(33 /* KeyX */, 'KeyX');
    d(34 /* KeyY */, 'KeyY');
    d(35 /* KeyZ */, 'KeyZ');
    d(36 /* Digit1 */, 'Digit1');
    d(37 /* Digit2 */, 'Digit2');
    d(38 /* Digit3 */, 'Digit3');
    d(39 /* Digit4 */, 'Digit4');
    d(40 /* Digit5 */, 'Digit5');
    d(41 /* Digit6 */, 'Digit6');
    d(42 /* Digit7 */, 'Digit7');
    d(43 /* Digit8 */, 'Digit8');
    d(44 /* Digit9 */, 'Digit9');
    d(45 /* Digit0 */, 'Digit0');
    d(46 /* Enter */, 'Enter');
    d(47 /* Escape */, 'Escape');
    d(48 /* Backspace */, 'Backspace');
    d(49 /* Tab */, 'Tab');
    d(50 /* Space */, 'Space');
    d(51 /* Minus */, 'Minus');
    d(52 /* Equal */, 'Equal');
    d(53 /* BracketLeft */, 'BracketLeft');
    d(54 /* BracketRight */, 'BracketRight');
    d(55 /* Backslash */, 'Backslash');
    d(56 /* IntlHash */, 'IntlHash');
    d(57 /* Semicolon */, 'Semicolon');
    d(58 /* Quote */, 'Quote');
    d(59 /* Backquote */, 'Backquote');
    d(60 /* Comma */, 'Comma');
    d(61 /* Period */, 'Period');
    d(62 /* Slash */, 'Slash');
    d(63 /* CapsLock */, 'CapsLock');
    d(64 /* F1 */, 'F1');
    d(65 /* F2 */, 'F2');
    d(66 /* F3 */, 'F3');
    d(67 /* F4 */, 'F4');
    d(68 /* F5 */, 'F5');
    d(69 /* F6 */, 'F6');
    d(70 /* F7 */, 'F7');
    d(71 /* F8 */, 'F8');
    d(72 /* F9 */, 'F9');
    d(73 /* F10 */, 'F10');
    d(74 /* F11 */, 'F11');
    d(75 /* F12 */, 'F12');
    d(76 /* PrintScreen */, 'PrintScreen');
    d(77 /* ScrollLock */, 'ScrollLock');
    d(78 /* Pause */, 'Pause');
    d(79 /* Insert */, 'Insert');
    d(80 /* Home */, 'Home');
    d(81 /* PageUp */, 'PageUp');
    d(82 /* Delete */, 'Delete');
    d(83 /* End */, 'End');
    d(84 /* PageDown */, 'PageDown');
    d(85 /* ArrowRight */, 'ArrowRight');
    d(86 /* ArrowLeft */, 'ArrowLeft');
    d(87 /* ArrowDown */, 'ArrowDown');
    d(88 /* ArrowUp */, 'ArrowUp');
    d(89 /* NumLock */, 'NumLock');
    d(90 /* NumpadDivide */, 'NumpadDivide');
    d(91 /* NumpadMultiply */, 'NumpadMultiply');
    d(92 /* NumpadSubtract */, 'NumpadSubtract');
    d(93 /* NumpadAdd */, 'NumpadAdd');
    d(94 /* NumpadEnter */, 'NumpadEnter');
    d(95 /* Numpad1 */, 'Numpad1');
    d(96 /* Numpad2 */, 'Numpad2');
    d(97 /* Numpad3 */, 'Numpad3');
    d(98 /* Numpad4 */, 'Numpad4');
    d(99 /* Numpad5 */, 'Numpad5');
    d(100 /* Numpad6 */, 'Numpad6');
    d(101 /* Numpad7 */, 'Numpad7');
    d(102 /* Numpad8 */, 'Numpad8');
    d(103 /* Numpad9 */, 'Numpad9');
    d(104 /* Numpad0 */, 'Numpad0');
    d(105 /* NumpadDecimal */, 'NumpadDecimal');
    d(106 /* IntlBackslash */, 'IntlBackslash');
    d(107 /* ContextMenu */, 'ContextMenu');
    d(108 /* Power */, 'Power');
    d(109 /* NumpadEqual */, 'NumpadEqual');
    d(110 /* F13 */, 'F13');
    d(111 /* F14 */, 'F14');
    d(112 /* F15 */, 'F15');
    d(113 /* F16 */, 'F16');
    d(114 /* F17 */, 'F17');
    d(115 /* F18 */, 'F18');
    d(116 /* F19 */, 'F19');
    d(117 /* F20 */, 'F20');
    d(118 /* F21 */, 'F21');
    d(119 /* F22 */, 'F22');
    d(120 /* F23 */, 'F23');
    d(121 /* F24 */, 'F24');
    d(122 /* Open */, 'Open');
    d(123 /* Help */, 'Help');
    d(124 /* Select */, 'Select');
    d(125 /* Again */, 'Again');
    d(126 /* Undo */, 'Undo');
    d(127 /* Cut */, 'Cut');
    d(128 /* Copy */, 'Copy');
    d(129 /* Paste */, 'Paste');
    d(130 /* Find */, 'Find');
    d(131 /* AudioVolumeMute */, 'AudioVolumeMute');
    d(132 /* AudioVolumeUp */, 'AudioVolumeUp');
    d(133 /* AudioVolumeDown */, 'AudioVolumeDown');
    d(134 /* NumpadComma */, 'NumpadComma');
    d(135 /* IntlRo */, 'IntlRo');
    d(136 /* KanaMode */, 'KanaMode');
    d(137 /* IntlYen */, 'IntlYen');
    d(138 /* Convert */, 'Convert');
    d(139 /* NonConvert */, 'NonConvert');
    d(140 /* Lang1 */, 'Lang1');
    d(141 /* Lang2 */, 'Lang2');
    d(142 /* Lang3 */, 'Lang3');
    d(143 /* Lang4 */, 'Lang4');
    d(144 /* Lang5 */, 'Lang5');
    d(145 /* Abort */, 'Abort');
    d(146 /* Props */, 'Props');
    d(147 /* NumpadParenLeft */, 'NumpadParenLeft');
    d(148 /* NumpadParenRight */, 'NumpadParenRight');
    d(149 /* NumpadBackspace */, 'NumpadBackspace');
    d(150 /* NumpadMemoryStore */, 'NumpadMemoryStore');
    d(151 /* NumpadMemoryRecall */, 'NumpadMemoryRecall');
    d(152 /* NumpadMemoryClear */, 'NumpadMemoryClear');
    d(153 /* NumpadMemoryAdd */, 'NumpadMemoryAdd');
    d(154 /* NumpadMemorySubtract */, 'NumpadMemorySubtract');
    d(155 /* NumpadClear */, 'NumpadClear');
    d(156 /* NumpadClearEntry */, 'NumpadClearEntry');
    d(157 /* ControlLeft */, 'ControlLeft');
    d(158 /* ShiftLeft */, 'ShiftLeft');
    d(159 /* AltLeft */, 'AltLeft');
    d(160 /* MetaLeft */, 'MetaLeft');
    d(161 /* ControlRight */, 'ControlRight');
    d(162 /* ShiftRight */, 'ShiftRight');
    d(163 /* AltRight */, 'AltRight');
    d(164 /* MetaRight */, 'MetaRight');
    d(165 /* BrightnessUp */, 'BrightnessUp');
    d(166 /* BrightnessDown */, 'BrightnessDown');
    d(167 /* MediaPlay */, 'MediaPlay');
    d(168 /* MediaRecord */, 'MediaRecord');
    d(169 /* MediaFastForward */, 'MediaFastForward');
    d(170 /* MediaRewind */, 'MediaRewind');
    d(171 /* MediaTrackNext */, 'MediaTrackNext');
    d(172 /* MediaTrackPrevious */, 'MediaTrackPrevious');
    d(173 /* MediaStop */, 'MediaStop');
    d(174 /* Eject */, 'Eject');
    d(175 /* MediaPlayPause */, 'MediaPlayPause');
    d(176 /* MediaSelect */, 'MediaSelect');
    d(177 /* LaunchMail */, 'LaunchMail');
    d(178 /* LaunchApp2 */, 'LaunchApp2');
    d(179 /* LaunchApp1 */, 'LaunchApp1');
    d(180 /* SelectTask */, 'SelectTask');
    d(181 /* LaunchScreenSaver */, 'LaunchScreenSaver');
    d(182 /* BrowserSearch */, 'BrowserSearch');
    d(183 /* BrowserHome */, 'BrowserHome');
    d(184 /* BrowserBack */, 'BrowserBack');
    d(185 /* BrowserForward */, 'BrowserForward');
    d(186 /* BrowserStop */, 'BrowserStop');
    d(187 /* BrowserRefresh */, 'BrowserRefresh');
    d(188 /* BrowserFavorites */, 'BrowserFavorites');
    d(189 /* ZoomToggle */, 'ZoomToggle');
    d(190 /* MailReply */, 'MailReply');
    d(191 /* MailForward */, 'MailForward');
    d(192 /* MailSend */, 'MailSend');
})();
(function () {
    for (var i = 0; i <= 193 /* MAX_VALUE */; i++) {
        IMMUTABLE_CODE_TO_KEY_CODE[i] = -1;
    }
    for (var i = 0; i <= 112 /* MAX_VALUE */; i++) {
        IMMUTABLE_KEY_CODE_TO_CODE[i] = -1;
    }
    function define(code, keyCode) {
        IMMUTABLE_CODE_TO_KEY_CODE[code] = keyCode;
        if ((keyCode !== 0 /* Unknown */)
            && (keyCode !== 3 /* Enter */)
            && (keyCode !== 5 /* Ctrl */)
            && (keyCode !== 4 /* Shift */)
            && (keyCode !== 6 /* Alt */)
            && (keyCode !== 57 /* Meta */)) {
            IMMUTABLE_KEY_CODE_TO_CODE[keyCode] = code;
        }
    }
    // Manually added due to the exclusion above (due to duplication with NumpadEnter)
    IMMUTABLE_KEY_CODE_TO_CODE[3 /* Enter */] = 46 /* Enter */;
    define(0 /* None */, 0 /* Unknown */);
    define(1 /* Hyper */, 0 /* Unknown */);
    define(2 /* Super */, 0 /* Unknown */);
    define(3 /* Fn */, 0 /* Unknown */);
    define(4 /* FnLock */, 0 /* Unknown */);
    define(5 /* Suspend */, 0 /* Unknown */);
    define(6 /* Resume */, 0 /* Unknown */);
    define(7 /* Turbo */, 0 /* Unknown */);
    define(8 /* Sleep */, 0 /* Unknown */);
    define(9 /* WakeUp */, 0 /* Unknown */);
    // define(ScanCode.KeyA, KeyCode.Unknown);
    // define(ScanCode.KeyB, KeyCode.Unknown);
    // define(ScanCode.KeyC, KeyCode.Unknown);
    // define(ScanCode.KeyD, KeyCode.Unknown);
    // define(ScanCode.KeyE, KeyCode.Unknown);
    // define(ScanCode.KeyF, KeyCode.Unknown);
    // define(ScanCode.KeyG, KeyCode.Unknown);
    // define(ScanCode.KeyH, KeyCode.Unknown);
    // define(ScanCode.KeyI, KeyCode.Unknown);
    // define(ScanCode.KeyJ, KeyCode.Unknown);
    // define(ScanCode.KeyK, KeyCode.Unknown);
    // define(ScanCode.KeyL, KeyCode.Unknown);
    // define(ScanCode.KeyM, KeyCode.Unknown);
    // define(ScanCode.KeyN, KeyCode.Unknown);
    // define(ScanCode.KeyO, KeyCode.Unknown);
    // define(ScanCode.KeyP, KeyCode.Unknown);
    // define(ScanCode.KeyQ, KeyCode.Unknown);
    // define(ScanCode.KeyR, KeyCode.Unknown);
    // define(ScanCode.KeyS, KeyCode.Unknown);
    // define(ScanCode.KeyT, KeyCode.Unknown);
    // define(ScanCode.KeyU, KeyCode.Unknown);
    // define(ScanCode.KeyV, KeyCode.Unknown);
    // define(ScanCode.KeyW, KeyCode.Unknown);
    // define(ScanCode.KeyX, KeyCode.Unknown);
    // define(ScanCode.KeyY, KeyCode.Unknown);
    // define(ScanCode.KeyZ, KeyCode.Unknown);
    // define(ScanCode.Digit1, KeyCode.Unknown);
    // define(ScanCode.Digit2, KeyCode.Unknown);
    // define(ScanCode.Digit3, KeyCode.Unknown);
    // define(ScanCode.Digit4, KeyCode.Unknown);
    // define(ScanCode.Digit5, KeyCode.Unknown);
    // define(ScanCode.Digit6, KeyCode.Unknown);
    // define(ScanCode.Digit7, KeyCode.Unknown);
    // define(ScanCode.Digit8, KeyCode.Unknown);
    // define(ScanCode.Digit9, KeyCode.Unknown);
    // define(ScanCode.Digit0, KeyCode.Unknown);
    define(46 /* Enter */, 3 /* Enter */);
    define(47 /* Escape */, 9 /* Escape */);
    define(48 /* Backspace */, 1 /* Backspace */);
    define(49 /* Tab */, 2 /* Tab */);
    define(50 /* Space */, 10 /* Space */);
    // define(ScanCode.Minus, KeyCode.Unknown);
    // define(ScanCode.Equal, KeyCode.Unknown);
    // define(ScanCode.BracketLeft, KeyCode.Unknown);
    // define(ScanCode.BracketRight, KeyCode.Unknown);
    // define(ScanCode.Backslash, KeyCode.Unknown);
    // define(ScanCode.IntlHash, KeyCode.Unknown);
    // define(ScanCode.Semicolon, KeyCode.Unknown);
    // define(ScanCode.Quote, KeyCode.Unknown);
    // define(ScanCode.Backquote, KeyCode.Unknown);
    // define(ScanCode.Comma, KeyCode.Unknown);
    // define(ScanCode.Period, KeyCode.Unknown);
    // define(ScanCode.Slash, KeyCode.Unknown);
    define(63 /* CapsLock */, 8 /* CapsLock */);
    define(64 /* F1 */, 59 /* F1 */);
    define(65 /* F2 */, 60 /* F2 */);
    define(66 /* F3 */, 61 /* F3 */);
    define(67 /* F4 */, 62 /* F4 */);
    define(68 /* F5 */, 63 /* F5 */);
    define(69 /* F6 */, 64 /* F6 */);
    define(70 /* F7 */, 65 /* F7 */);
    define(71 /* F8 */, 66 /* F8 */);
    define(72 /* F9 */, 67 /* F9 */);
    define(73 /* F10 */, 68 /* F10 */);
    define(74 /* F11 */, 69 /* F11 */);
    define(75 /* F12 */, 70 /* F12 */);
    define(76 /* PrintScreen */, 0 /* Unknown */);
    define(77 /* ScrollLock */, 79 /* ScrollLock */);
    define(78 /* Pause */, 7 /* PauseBreak */);
    define(79 /* Insert */, 19 /* Insert */);
    define(80 /* Home */, 14 /* Home */);
    define(81 /* PageUp */, 11 /* PageUp */);
    define(82 /* Delete */, 20 /* Delete */);
    define(83 /* End */, 13 /* End */);
    define(84 /* PageDown */, 12 /* PageDown */);
    define(85 /* ArrowRight */, 17 /* RightArrow */);
    define(86 /* ArrowLeft */, 15 /* LeftArrow */);
    define(87 /* ArrowDown */, 18 /* DownArrow */);
    define(88 /* ArrowUp */, 16 /* UpArrow */);
    define(89 /* NumLock */, 78 /* NumLock */);
    define(90 /* NumpadDivide */, 108 /* NUMPAD_DIVIDE */);
    define(91 /* NumpadMultiply */, 103 /* NUMPAD_MULTIPLY */);
    define(92 /* NumpadSubtract */, 106 /* NUMPAD_SUBTRACT */);
    define(93 /* NumpadAdd */, 104 /* NUMPAD_ADD */);
    define(94 /* NumpadEnter */, 3 /* Enter */); // Duplicate
    define(95 /* Numpad1 */, 94 /* NUMPAD_1 */);
    define(96 /* Numpad2 */, 95 /* NUMPAD_2 */);
    define(97 /* Numpad3 */, 96 /* NUMPAD_3 */);
    define(98 /* Numpad4 */, 97 /* NUMPAD_4 */);
    define(99 /* Numpad5 */, 98 /* NUMPAD_5 */);
    define(100 /* Numpad6 */, 99 /* NUMPAD_6 */);
    define(101 /* Numpad7 */, 100 /* NUMPAD_7 */);
    define(102 /* Numpad8 */, 101 /* NUMPAD_8 */);
    define(103 /* Numpad9 */, 102 /* NUMPAD_9 */);
    define(104 /* Numpad0 */, 93 /* NUMPAD_0 */);
    define(105 /* NumpadDecimal */, 107 /* NUMPAD_DECIMAL */);
    // define(ScanCode.IntlBackslash, KeyCode.Unknown);
    define(107 /* ContextMenu */, 58 /* ContextMenu */);
    define(108 /* Power */, 0 /* Unknown */);
    define(109 /* NumpadEqual */, 0 /* Unknown */);
    define(110 /* F13 */, 71 /* F13 */);
    define(111 /* F14 */, 72 /* F14 */);
    define(112 /* F15 */, 73 /* F15 */);
    define(113 /* F16 */, 74 /* F16 */);
    define(114 /* F17 */, 75 /* F17 */);
    define(115 /* F18 */, 76 /* F18 */);
    define(116 /* F19 */, 77 /* F19 */);
    define(117 /* F20 */, 0 /* Unknown */);
    define(118 /* F21 */, 0 /* Unknown */);
    define(119 /* F22 */, 0 /* Unknown */);
    define(120 /* F23 */, 0 /* Unknown */);
    define(121 /* F24 */, 0 /* Unknown */);
    define(122 /* Open */, 0 /* Unknown */);
    define(123 /* Help */, 0 /* Unknown */);
    define(124 /* Select */, 0 /* Unknown */);
    define(125 /* Again */, 0 /* Unknown */);
    define(126 /* Undo */, 0 /* Unknown */);
    define(127 /* Cut */, 0 /* Unknown */);
    define(128 /* Copy */, 0 /* Unknown */);
    define(129 /* Paste */, 0 /* Unknown */);
    define(130 /* Find */, 0 /* Unknown */);
    define(131 /* AudioVolumeMute */, 0 /* Unknown */);
    define(132 /* AudioVolumeUp */, 0 /* Unknown */);
    define(133 /* AudioVolumeDown */, 0 /* Unknown */);
    define(134 /* NumpadComma */, 105 /* NUMPAD_SEPARATOR */);
    // define(ScanCode.IntlRo, KeyCode.Unknown);
    define(136 /* KanaMode */, 0 /* Unknown */);
    // define(ScanCode.IntlYen, KeyCode.Unknown);
    define(138 /* Convert */, 0 /* Unknown */);
    define(139 /* NonConvert */, 0 /* Unknown */);
    define(140 /* Lang1 */, 0 /* Unknown */);
    define(141 /* Lang2 */, 0 /* Unknown */);
    define(142 /* Lang3 */, 0 /* Unknown */);
    define(143 /* Lang4 */, 0 /* Unknown */);
    define(144 /* Lang5 */, 0 /* Unknown */);
    define(145 /* Abort */, 0 /* Unknown */);
    define(146 /* Props */, 0 /* Unknown */);
    define(147 /* NumpadParenLeft */, 0 /* Unknown */);
    define(148 /* NumpadParenRight */, 0 /* Unknown */);
    define(149 /* NumpadBackspace */, 0 /* Unknown */);
    define(150 /* NumpadMemoryStore */, 0 /* Unknown */);
    define(151 /* NumpadMemoryRecall */, 0 /* Unknown */);
    define(152 /* NumpadMemoryClear */, 0 /* Unknown */);
    define(153 /* NumpadMemoryAdd */, 0 /* Unknown */);
    define(154 /* NumpadMemorySubtract */, 0 /* Unknown */);
    define(155 /* NumpadClear */, 0 /* Unknown */);
    define(156 /* NumpadClearEntry */, 0 /* Unknown */);
    define(157 /* ControlLeft */, 5 /* Ctrl */); // Duplicate
    define(158 /* ShiftLeft */, 4 /* Shift */); // Duplicate
    define(159 /* AltLeft */, 6 /* Alt */); // Duplicate
    define(160 /* MetaLeft */, 57 /* Meta */); // Duplicate
    define(161 /* ControlRight */, 5 /* Ctrl */); // Duplicate
    define(162 /* ShiftRight */, 4 /* Shift */); // Duplicate
    define(163 /* AltRight */, 6 /* Alt */); // Duplicate
    define(164 /* MetaRight */, 57 /* Meta */); // Duplicate
    define(165 /* BrightnessUp */, 0 /* Unknown */);
    define(166 /* BrightnessDown */, 0 /* Unknown */);
    define(167 /* MediaPlay */, 0 /* Unknown */);
    define(168 /* MediaRecord */, 0 /* Unknown */);
    define(169 /* MediaFastForward */, 0 /* Unknown */);
    define(170 /* MediaRewind */, 0 /* Unknown */);
    define(171 /* MediaTrackNext */, 0 /* Unknown */);
    define(172 /* MediaTrackPrevious */, 0 /* Unknown */);
    define(173 /* MediaStop */, 0 /* Unknown */);
    define(174 /* Eject */, 0 /* Unknown */);
    define(175 /* MediaPlayPause */, 0 /* Unknown */);
    define(176 /* MediaSelect */, 0 /* Unknown */);
    define(177 /* LaunchMail */, 0 /* Unknown */);
    define(178 /* LaunchApp2 */, 0 /* Unknown */);
    define(179 /* LaunchApp1 */, 0 /* Unknown */);
    define(180 /* SelectTask */, 0 /* Unknown */);
    define(181 /* LaunchScreenSaver */, 0 /* Unknown */);
    define(182 /* BrowserSearch */, 0 /* Unknown */);
    define(183 /* BrowserHome */, 0 /* Unknown */);
    define(184 /* BrowserBack */, 0 /* Unknown */);
    define(185 /* BrowserForward */, 0 /* Unknown */);
    define(186 /* BrowserStop */, 0 /* Unknown */);
    define(187 /* BrowserRefresh */, 0 /* Unknown */);
    define(188 /* BrowserFavorites */, 0 /* Unknown */);
    define(189 /* ZoomToggle */, 0 /* Unknown */);
    define(190 /* MailReply */, 0 /* Unknown */);
    define(191 /* MailForward */, 0 /* Unknown */);
    define(192 /* MailSend */, 0 /* Unknown */);
})();
