/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { asThenable } from '../../../base/common/async.js';
import { URI } from '../../../base/common/uri.js';
import * as extHostTypeConverter from './extHostTypeConverters.js';
import { MainContext } from './extHost.protocol.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
var ExtHostComments = /** @class */ (function () {
    function ExtHostComments(mainContext, _commandsConverter, _documents) {
        this._commandsConverter = _commandsConverter;
        this._documents = _documents;
        this._documentProviders = new Map();
        this._workspaceProviders = new Map();
        this._proxy = mainContext.getProxy(MainContext.MainThreadComments);
    }
    ExtHostComments.prototype.registerWorkspaceCommentProvider = function (extensionId, provider) {
        var _this = this;
        var handle = ExtHostComments.handlePool++;
        this._workspaceProviders.set(handle, provider);
        this._proxy.$registerWorkspaceCommentProvider(handle, extensionId);
        this.registerListeners(handle, provider);
        return {
            dispose: function () {
                _this._proxy.$unregisterWorkspaceCommentProvider(handle);
                _this._workspaceProviders.delete(handle);
            }
        };
    };
    ExtHostComments.prototype.registerDocumentCommentProvider = function (provider) {
        var _this = this;
        var handle = ExtHostComments.handlePool++;
        this._documentProviders.set(handle, provider);
        this._proxy.$registerDocumentCommentProvider(handle);
        this.registerListeners(handle, provider);
        return {
            dispose: function () {
                _this._proxy.$unregisterDocumentCommentProvider(handle);
                _this._documentProviders.delete(handle);
            }
        };
    };
    ExtHostComments.prototype.$createNewCommentThread = function (handle, uri, range, text) {
        var _this = this;
        var data = this._documents.getDocumentData(URI.revive(uri));
        var ran = extHostTypeConverter.Range.to(range);
        if (!data || !data.document) {
            return Promise.resolve(null);
        }
        var provider = this._documentProviders.get(handle);
        return asThenable(function () {
            return provider.createNewCommentThread(data.document, ran, text, CancellationToken.None);
        }).then(function (commentThread) { return commentThread ? convertToCommentThread(provider, commentThread, _this._commandsConverter) : null; });
    };
    ExtHostComments.prototype.$replyToCommentThread = function (handle, uri, range, thread, text) {
        var _this = this;
        var data = this._documents.getDocumentData(URI.revive(uri));
        var ran = extHostTypeConverter.Range.to(range);
        if (!data || !data.document) {
            return Promise.resolve(null);
        }
        var provider = this._documentProviders.get(handle);
        return asThenable(function () {
            return provider.replyToCommentThread(data.document, ran, convertFromCommentThread(thread), text, CancellationToken.None);
        }).then(function (commentThread) { return commentThread ? convertToCommentThread(provider, commentThread, _this._commandsConverter) : null; });
    };
    ExtHostComments.prototype.$editComment = function (handle, uri, comment, text) {
        var data = this._documents.getDocumentData(URI.revive(uri));
        if (!data || !data.document) {
            throw new Error('Unable to retrieve document from URI');
        }
        var provider = this._documentProviders.get(handle);
        return asThenable(function () {
            return provider.editComment(data.document, convertFromComment(comment), text, CancellationToken.None);
        });
    };
    ExtHostComments.prototype.$deleteComment = function (handle, uri, comment) {
        var data = this._documents.getDocumentData(URI.revive(uri));
        if (!data || !data.document) {
            throw new Error('Unable to retrieve document from URI');
        }
        var provider = this._documentProviders.get(handle);
        return asThenable(function () {
            return provider.deleteComment(data.document, convertFromComment(comment), CancellationToken.None);
        });
    };
    ExtHostComments.prototype.$provideDocumentComments = function (handle, uri) {
        var _this = this;
        var data = this._documents.getDocumentData(URI.revive(uri));
        if (!data || !data.document) {
            return Promise.resolve(null);
        }
        var provider = this._documentProviders.get(handle);
        return asThenable(function () {
            return provider.provideDocumentComments(data.document, CancellationToken.None);
        }).then(function (commentInfo) { return commentInfo ? convertCommentInfo(handle, provider, commentInfo, _this._commandsConverter) : null; });
    };
    ExtHostComments.prototype.$provideWorkspaceComments = function (handle) {
        var _this = this;
        var provider = this._workspaceProviders.get(handle);
        if (!provider) {
            return Promise.resolve(null);
        }
        return asThenable(function () {
            return provider.provideWorkspaceComments(CancellationToken.None);
        }).then(function (comments) {
            return comments.map(function (comment) { return convertToCommentThread(provider, comment, _this._commandsConverter); });
        });
    };
    ExtHostComments.prototype.registerListeners = function (handle, provider) {
        var _this = this;
        provider.onDidChangeCommentThreads(function (event) {
            _this._proxy.$onDidCommentThreadsChange(handle, {
                changed: event.changed.map(function (thread) { return convertToCommentThread(provider, thread, _this._commandsConverter); }),
                added: event.added.map(function (thread) { return convertToCommentThread(provider, thread, _this._commandsConverter); }),
                removed: event.removed.map(function (thread) { return convertToCommentThread(provider, thread, _this._commandsConverter); })
            });
        });
    };
    ExtHostComments.handlePool = 0;
    return ExtHostComments;
}());
export { ExtHostComments };
function convertCommentInfo(owner, provider, vscodeCommentInfo, commandsConverter) {
    return {
        threads: vscodeCommentInfo.threads.map(function (x) { return convertToCommentThread(provider, x, commandsConverter); }),
        commentingRanges: vscodeCommentInfo.commentingRanges ? vscodeCommentInfo.commentingRanges.map(function (range) { return extHostTypeConverter.Range.from(range); }) : []
    };
}
function convertToCommentThread(provider, vscodeCommentThread, commandsConverter) {
    return {
        threadId: vscodeCommentThread.threadId,
        resource: vscodeCommentThread.resource.toString(),
        range: extHostTypeConverter.Range.from(vscodeCommentThread.range),
        comments: vscodeCommentThread.comments.map(function (comment) { return convertToComment(provider, comment, commandsConverter); }),
        collapsibleState: vscodeCommentThread.collapsibleState
    };
}
function convertFromCommentThread(commentThread) {
    return {
        threadId: commentThread.threadId,
        resource: URI.parse(commentThread.resource),
        range: extHostTypeConverter.Range.to(commentThread.range),
        comments: commentThread.comments.map(convertFromComment),
        collapsibleState: commentThread.collapsibleState
    };
}
function convertFromComment(comment) {
    var userIconPath;
    if (comment.userIconPath) {
        try {
            userIconPath = URI.parse(comment.userIconPath);
        }
        catch (e) {
            // Ignore
        }
    }
    return {
        commentId: comment.commentId,
        body: extHostTypeConverter.MarkdownString.to(comment.body),
        userName: comment.userName,
        userIconPath: userIconPath,
        canEdit: comment.canEdit,
        canDelete: comment.canDelete
    };
}
function convertToComment(provider, vscodeComment, commandsConverter) {
    var canEdit = !!provider.editComment && vscodeComment.canEdit;
    var canDelete = !!provider.deleteComment && vscodeComment.canDelete;
    var iconPath = vscodeComment.userIconPath ? vscodeComment.userIconPath.toString() : vscodeComment.gravatar;
    return {
        commentId: vscodeComment.commentId,
        body: extHostTypeConverter.MarkdownString.from(vscodeComment.body),
        userName: vscodeComment.userName,
        userIconPath: iconPath,
        canEdit: canEdit,
        canDelete: canDelete,
        command: vscodeComment.command ? commandsConverter.toInternal(vscodeComment.command) : null
    };
}
