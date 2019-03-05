"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./../../../configuration/configuration");
const easymotion_1 = require("./easymotion");
class MarkerGenerator {
    constructor(matchesCount) {
        this.matchesCount = matchesCount;
        this.keyTable = this.getKeyTable();
        this.prefixKeyTable = this.createPrefixKeyTable();
    }
    generateMarker(index, markerPosition) {
        const keyTable = this.keyTable;
        const prefixKeyTable = this.prefixKeyTable;
        if (index >= keyTable.length - prefixKeyTable.length) {
            const remainder = index - (keyTable.length - prefixKeyTable.length);
            const currentStep = Math.floor(remainder / keyTable.length) + 1;
            if (currentStep > prefixKeyTable.length) {
                return null;
            }
            else {
                const prefix = prefixKeyTable[currentStep - 1];
                const label = keyTable[remainder % keyTable.length];
                return new easymotion_1.EasyMotion.Marker(prefix + label, markerPosition);
            }
        }
        else {
            const label = keyTable[index];
            return new easymotion_1.EasyMotion.Marker(label, markerPosition);
        }
    }
    createPrefixKeyTable() {
        const keyTable = this.keyTable;
        const totalRemainder = Math.max(this.matchesCount - keyTable.length, 0);
        const totalSteps = Math.ceil(totalRemainder / keyTable.length);
        const reversed = this.keyTable.slice().reverse();
        const count = Math.min(totalSteps, reversed.length);
        return reversed.slice(0, count);
    }
    /**
     * The key sequence for marker name generation
     */
    getKeyTable() {
        if (configuration_1.configuration.easymotionKeys) {
            return configuration_1.configuration.easymotionKeys.split('');
        }
        else {
            return 'hklyuiopnm,qwertzxcvbasdgjf;'.split('');
        }
    }
}
exports.MarkerGenerator = MarkerGenerator;

//# sourceMappingURL=markerGenerator.js.map
