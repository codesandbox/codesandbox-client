"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function doScaffoldComplete() {
    const topLevelCompletions = [
        {
            label: 'scaffold',
            documentation: 'Scaffold <template>, <script> and <style>',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<template>
\t\${0}
</template>

<script>
export default {

}
</script>

<style>

</style>
`
        },
        {
            label: 'template with html',
            documentation: 'Scaffold <template> with html',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<template>
\t\${0}
</template>
`
        },
        {
            label: 'template with pug',
            documentation: 'Scaffold <template> with pug',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<template lang="pug">
\t\${0}
</template>
`
        },
        {
            label: 'script with JavaScript',
            documentation: 'Scaffold <script> with JavaScript',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<script>
export default {
\t\${0}
}
</script>
`
        },
        {
            label: 'script with TypeScript',
            documentation: 'Scaffold <script> with TypeScript',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
\t\${0}
})
</script>
`
        },
        {
            label: 'style with CSS',
            documentation: 'Scaffold <style> with CSS',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style>
\${0}
</style>
`
        },
        {
            label: 'style with CSS (scoped)',
            documentation: 'Scaffold <style> with CSS (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style scoped>
\${0}
</style>
`
        },
        {
            label: 'style with scss',
            documentation: 'Scaffold <style> with scss',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="scss">
\${0}
</style>
`
        },
        {
            label: 'style with scss (scoped)',
            documentation: 'Scaffold <style> with scss (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="scss" scoped>
\${0}
</style>
`
        },
        {
            label: 'style with less',
            documentation: 'Scaffold <style> with less',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="less">
\${0}
</style>
`
        },
        {
            label: 'style with less (scoped)',
            documentation: 'Scaffold <style> with less (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="less" scoped>
\${0}
</style>
`
        },
        {
            label: 'style with sass',
            documentation: 'Scaffold <style> with sass',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="sass">
\${0}
</style>
`
        },
        {
            label: 'style with sass (scoped)',
            documentation: 'Scaffold <style> with sass (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="sass" scoped>
\${0}
</style>
`
        },
        {
            label: 'style with postcss',
            documentation: 'Scaffold <style> with postcss',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="postcss">
\${0}
</style>
`
        },
        {
            label: 'style with postcss (scoped)',
            documentation: 'Scaffold <style> with postcss (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="postcss" scoped>
\${0}
</style>
`
        },
        {
            label: 'style with stylus',
            documentation: 'Scaffold <style> with stylus',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="stylus">
\${0}
</style>
`
        },
        {
            label: 'style with stylus (scoped)',
            documentation: 'Scaffold <style> with stylus (scoped)',
            kind: vscode_languageserver_types_1.CompletionItemKind.Snippet,
            insertTextFormat: vscode_languageserver_types_1.InsertTextFormat.Snippet,
            insertText: `<style lang="stylus" scoped>
\${0}
</style>
`
        }
    ];
    return {
        isIncomplete: false,
        items: topLevelCompletions
    };
}
exports.doScaffoldComplete = doScaffoldComplete;
//# sourceMappingURL=scaffoldCompletion.js.map