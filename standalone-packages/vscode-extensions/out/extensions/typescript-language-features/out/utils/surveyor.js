"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const nls = require("vscode-nls");
const dispose_1 = require("./dispose");
const memoize_1 = require("./memoize");
const localize = nls.loadMessageBundle();
const allSurveys = [
    {
        id: 'checkJs',
        prompt: localize('survey.checkJs.prompt', "Help improve VS Code's support for [checkJs](https://code.visualstudio.com/Docs/languages/javascript#_type-checking) in JavaScript! Since you have been using this feature, would you consider taking a short survey about your experience?"),
        globalTriggerThreshold: 10,
        url: vscode.Uri.parse('https://www.surveymonkey.com/r/FH8PZQ3'),
        remindLaterDelayInMilliseconds: 3 * 24 * 60 * 60 * 1000 // 3 days
    }
];
class Survey {
    constructor(data, memento) {
        this.data = data;
        this.memento = memento;
        this._hasShownInThisSession = false;
    }
    get id() { return this.data.id; }
    get prompt() { return this.data.prompt; }
    get isActive() {
        return !this._hasShownInThisSession && !this.memento.get(this.isCompletedMementoKey);
    }
    open() {
        this.markComplete();
        vscode.commands.executeCommand('vscode.open', this.data.url);
    }
    remindLater() {
        // Make sure we don't show again in this session (but don't persist as completed)
        this._hasShownInThisSession = true;
        // And save off prompt time.
        this.memento.update(this.lastPromptTimeMementoKey, Date.now());
    }
    trigger() {
        const triggerCount = this.triggerCount + 1;
        this.memento.update(this.triggerCountMementoKey, triggerCount);
        if (triggerCount >= this.data.globalTriggerThreshold) {
            const lastPromptTime = this.memento.get(this.lastPromptTimeMementoKey);
            if (!lastPromptTime || isNaN(+lastPromptTime)) {
                return true;
            }
            return (lastPromptTime + this.data.remindLaterDelayInMilliseconds < Date.now());
        }
        return false;
    }
    willShow() {
        this._hasShownInThisSession = true;
    }
    markComplete() {
        this._hasShownInThisSession = true;
        this.memento.update(this.isCompletedMementoKey, true);
    }
    get triggerCount() {
        const count = this.memento.get(this.triggerCountMementoKey);
        return !count || isNaN(+count) ? 0 : +count;
    }
    getMementoKey(part) {
        return `survey.v0.${this.id}.${part}`;
    }
    get isCompletedMementoKey() {
        return this.getMementoKey('isComplete');
    }
    get lastPromptTimeMementoKey() {
        return this.getMementoKey('lastPromptTime');
    }
    get triggerCountMementoKey() {
        return this.getMementoKey('globalTriggerCount');
    }
}
class Surveyor extends dispose_1.Disposable {
    constructor(memento, serviceClient) {
        super();
        this.memento = memento;
        this._register(serviceClient.onSurveyReady(e => this.surveyReady(e.surveyId)));
    }
    get surveys() {
        return new Map(allSurveys.map(data => [data.id, new Survey(data, this.memento)]));
    }
    surveyReady(surveyId) {
        const survey = this.tryGetActiveSurvey(surveyId);
        if (survey && survey.trigger()) {
            survey.willShow();
            this.showSurveyToUser(survey);
        }
    }
    async showSurveyToUser(survey) {
        let Choice;
        (function (Choice) {
            Choice[Choice["GoToSurvey"] = 1] = "GoToSurvey";
            Choice[Choice["RemindLater"] = 2] = "RemindLater";
            Choice[Choice["NeverAgain"] = 3] = "NeverAgain";
        })(Choice || (Choice = {}));
        const response = await vscode.window.showInformationMessage(survey.prompt, {
            title: localize('takeShortSurvey', "Take Short Survey"),
            choice: Choice.GoToSurvey
        }, {
            title: localize('remindLater', "Remind Me Later"),
            choice: Choice.RemindLater
        }, {
            title: localize('neverAgain', "Disable JS/TS Surveys"),
            choice: Choice.NeverAgain
        });
        switch (response && response.choice) {
            case Choice.GoToSurvey:
                survey.open();
                break;
            case Choice.NeverAgain:
                survey.markComplete();
                this.disableSurveys();
                break;
            case Choice.RemindLater:
            default: // If user just closes the notification, treat this as a remind later.
                survey.remindLater();
                break;
        }
    }
    tryGetActiveSurvey(surveyId) {
        const survey = this.surveys.get(surveyId);
        if (!survey) {
            return undefined;
        }
        if (this.areSurveysEnabled() && survey.isActive) {
            return survey;
        }
        return undefined;
    }
    areSurveysEnabled() {
        const config = vscode.workspace.getConfiguration('typescript');
        return config.get('surveys.enabled', true);
    }
    disableSurveys() {
        const config = vscode.workspace.getConfiguration('typescript');
        config.update('surveys.enabled', false);
    }
}
__decorate([
    memoize_1.memoize
], Surveyor.prototype, "surveys", null);
exports.Surveyor = Surveyor;
//# sourceMappingURL=surveyor.js.map