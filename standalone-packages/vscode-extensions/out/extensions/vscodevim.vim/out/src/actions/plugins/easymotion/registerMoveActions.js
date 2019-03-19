"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./../../base");
const easymotion_cmd_1 = require("./easymotion.cmd");
// EasyMotion n-char-move command
let EasyMotionNCharSearchCommand = class EasyMotionNCharSearchCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '/' }, new easymotion_cmd_1.SearchByNCharCommand());
    }
};
EasyMotionNCharSearchCommand = __decorate([
    base_1.RegisterAction
], EasyMotionNCharSearchCommand);
// EasyMotion char-move commands
let EasyMotionTwoCharSearchCommand = class EasyMotionTwoCharSearchCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '2s' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2 }));
    }
};
EasyMotionTwoCharSearchCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharSearchCommand);
let EasyMotionTwoCharFindForwardCommand = class EasyMotionTwoCharFindForwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '2f' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2, searchOptions: 'min' }));
    }
};
EasyMotionTwoCharFindForwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharFindForwardCommand);
let EasyMotionTwoCharFindBackwardCommand = class EasyMotionTwoCharFindBackwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '2F' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2, searchOptions: 'max' }));
    }
};
EasyMotionTwoCharFindBackwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharFindBackwardCommand);
let EasyMotionTwoCharTilCharacterForwardCommand = class EasyMotionTwoCharTilCharacterForwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '2t' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2, searchOptions: 'min', labelPosition: 'before' }));
    }
};
EasyMotionTwoCharTilCharacterForwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharTilCharacterForwardCommand);
// easymotion-bd-t2
let EasyMotionTwoCharTilCharacterBidirectionalCommand = class EasyMotionTwoCharTilCharacterBidirectionalCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 'bd2t', leaderCount: 3 }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2, labelPosition: 'before' }));
    }
};
EasyMotionTwoCharTilCharacterBidirectionalCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharTilCharacterBidirectionalCommand);
let EasyMotionTwoCharTilBackwardCommand = class EasyMotionTwoCharTilBackwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: '2T' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 2, searchOptions: 'max', labelPosition: 'after' }));
    }
};
EasyMotionTwoCharTilBackwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTwoCharTilBackwardCommand);
let EasyMotionSearchCommand = class EasyMotionSearchCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 's' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1 }));
    }
};
EasyMotionSearchCommand = __decorate([
    base_1.RegisterAction
], EasyMotionSearchCommand);
let EasyMotionFindForwardCommand = class EasyMotionFindForwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 'f' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1, searchOptions: 'min' }));
    }
};
EasyMotionFindForwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionFindForwardCommand);
let EasyMotionFindBackwardCommand = class EasyMotionFindBackwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 'F' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1, searchOptions: 'max' }));
    }
};
EasyMotionFindBackwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionFindBackwardCommand);
let EasyMotionTilCharacterForwardCommand = class EasyMotionTilCharacterForwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 't' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1, searchOptions: 'min', labelPosition: 'before' }));
    }
};
EasyMotionTilCharacterForwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTilCharacterForwardCommand);
// easymotion-bd-t
let EasyMotionTilCharacterBidirectionalCommand = class EasyMotionTilCharacterBidirectionalCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 'bdt', leaderCount: 3 }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1, labelPosition: 'before' }));
    }
};
EasyMotionTilCharacterBidirectionalCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTilCharacterBidirectionalCommand);
let EasyMotionTilBackwardCommand = class EasyMotionTilBackwardCommand extends easymotion_cmd_1.EasyMotionCharMoveCommandBase {
    constructor() {
        super({ key: 'T' }, new easymotion_cmd_1.SearchByCharCommand({ charCount: 1, searchOptions: 'max', labelPosition: 'after' }));
    }
};
EasyMotionTilBackwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionTilBackwardCommand);
// EasyMotion word-move commands
let EasyMotionStartOfWordForwardsCommand = class EasyMotionStartOfWordForwardsCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'w' }, { searchOptions: 'min' });
    }
};
EasyMotionStartOfWordForwardsCommand = __decorate([
    base_1.RegisterAction
], EasyMotionStartOfWordForwardsCommand);
// easymotion-bd-w
let EasyMotionStartOfWordBidirectionalCommand = class EasyMotionStartOfWordBidirectionalCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'bdw', leaderCount: 3 });
    }
};
EasyMotionStartOfWordBidirectionalCommand = __decorate([
    base_1.RegisterAction
], EasyMotionStartOfWordBidirectionalCommand);
let EasyMotionLineForward = class EasyMotionLineForward extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'l' }, { jumpToAnywhere: true, searchOptions: 'min', labelPosition: 'after' });
    }
};
EasyMotionLineForward = __decorate([
    base_1.RegisterAction
], EasyMotionLineForward);
let EasyMotionLineBackward = class EasyMotionLineBackward extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'h' }, { jumpToAnywhere: true, searchOptions: 'max', labelPosition: 'after' });
    }
};
EasyMotionLineBackward = __decorate([
    base_1.RegisterAction
], EasyMotionLineBackward);
// easymotion "JumpToAnywhere" motion
let EasyMotionJumpToAnywhereCommand = class EasyMotionJumpToAnywhereCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'j', leaderCount: 3 }, { jumpToAnywhere: true, labelPosition: 'after' });
    }
};
EasyMotionJumpToAnywhereCommand = __decorate([
    base_1.RegisterAction
], EasyMotionJumpToAnywhereCommand);
let EasyMotionEndOfWordForwardsCommand = class EasyMotionEndOfWordForwardsCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'e' }, { searchOptions: 'min', labelPosition: 'after' });
    }
};
EasyMotionEndOfWordForwardsCommand = __decorate([
    base_1.RegisterAction
], EasyMotionEndOfWordForwardsCommand);
// easymotion-bd-e
let EasyMotionEndOfWordBidirectionalCommand = class EasyMotionEndOfWordBidirectionalCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'bde', leaderCount: 3 }, { labelPosition: 'after' });
    }
};
EasyMotionEndOfWordBidirectionalCommand = __decorate([
    base_1.RegisterAction
], EasyMotionEndOfWordBidirectionalCommand);
let EasyMotionBeginningWordCommand = class EasyMotionBeginningWordCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'b' }, { searchOptions: 'max' });
    }
};
EasyMotionBeginningWordCommand = __decorate([
    base_1.RegisterAction
], EasyMotionBeginningWordCommand);
let EasyMotionEndBackwardCommand = class EasyMotionEndBackwardCommand extends easymotion_cmd_1.EasyMotionWordMoveCommandBase {
    constructor() {
        super({ key: 'ge' }, { searchOptions: 'max', labelPosition: 'after' });
    }
};
EasyMotionEndBackwardCommand = __decorate([
    base_1.RegisterAction
], EasyMotionEndBackwardCommand);
// EasyMotion line-move commands
let EasyMotionStartOfLineForwardsCommand = class EasyMotionStartOfLineForwardsCommand extends easymotion_cmd_1.EasyMotionLineMoveCommandBase {
    constructor() {
        super({ key: 'j' }, { searchOptions: 'min' });
    }
};
EasyMotionStartOfLineForwardsCommand = __decorate([
    base_1.RegisterAction
], EasyMotionStartOfLineForwardsCommand);
let EasyMotionStartOfLineBackwordsCommand = class EasyMotionStartOfLineBackwordsCommand extends easymotion_cmd_1.EasyMotionLineMoveCommandBase {
    constructor() {
        super({ key: 'k' }, { searchOptions: 'max' });
    }
};
EasyMotionStartOfLineBackwordsCommand = __decorate([
    base_1.RegisterAction
], EasyMotionStartOfLineBackwordsCommand);
// easymotion-bd-jk
let EasyMotionStartOfLineBidirectionalCommand = class EasyMotionStartOfLineBidirectionalCommand extends easymotion_cmd_1.EasyMotionLineMoveCommandBase {
    constructor() {
        super({ key: 'bdjk', leaderCount: 3 });
    }
};
EasyMotionStartOfLineBidirectionalCommand = __decorate([
    base_1.RegisterAction
], EasyMotionStartOfLineBidirectionalCommand);

//# sourceMappingURL=registerMoveActions.js.map
