'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_TEMPLATE = `
<!DOCTYPE html>
<html>

<head>
    <STYLE type="text/css">
        body {
            padding: 10px 20px;
            line-height: 22px
        }

        img {
            max-width: 100%;
            max-height: 100%
        }

        a {
            text-decoration: none
        }

        a:focus,
        input:focus,
        select:focus,
        textarea:focus {
            outline: 1px solid -webkit-focus-ring-color;
            outline-offset: -1px
        }

        hr {
            border: 0;
            height: 2px;
            border-bottom: 2px solid
        }

        h1 {
            padding-bottom: .3em;
            line-height: 1.2;
            border-bottom-width: 1px;
            border-bottom-style: solid
        }

        h1,
        h2,
        h3 {
            font-weight: 400
        }

        a:hover {
            text-decoration: underline
        }

        table {
            border-collapse: collapse
        }

        table > thead > tr > th {
            text-align: left
        }

        table > thead > tr > th,
        table > thead > tr > td,
        table > tbody > tr > th,
        table > tbody > tr > td {
            padding: 5px 10px
        }

        blockquote {
            margin: 0 7px 0 5px;
            padding: 0 16px 0 10px;
            border-left: 5px solid
        }

        code {
            font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", "Courier New", monospace, "Droid Sans Fallback";
            font-size: 14px;
            line-height: 19px
        }

        .mac code {
            font-size: 12px;
            line-height: 18px
        }

        code > div {
            padding: 16px;
            border-radius: 3px;
            overflow: auto
        }

        .monaco-tokenized-source {
            white-space: pre
        }

        /** Theming */

        .vscode-light {
            color: #1e1e1e
        }

        .vscode-dark {
            color: #ddd
        }

        .vscode-high-contrast {
            color: #fff
        }

        .vscode-light code {
            color: #a31515
        }

        .vscode-dark code {
            color: #d7ba7d
        }

        .vscode-light code > div {
            background-color: rgba(220, 220, 220, .4)
        }

        .vscode-dark code > div {
            background-color: rgba(10, 10, 10, .4)
        }

        .vscode-high-contrast code > div {
            background-color: #000
        }

        .vscode-high-contrast h1 {
            border-color: #000
        }

        .vscode-light table > thead > tr > th {
            border-color: rgba(0, 0, 0, .69)
        }

        .vscode-dark table > thead > tr > th {
            border-color: rgba(255, 255, 255, .69)
        }

        .vscode-light h1,
        .vscode-light hr,
        .vscode-light table > tbody > tr + tr > td {
            border-color: rgba(0, 0, 0, .18)
        }

        .vscode-dark h1,
        .vscode-dark hr,
        .vscode-dark table > tbody > tr + tr > td {
            border-color: rgba(255, 255, 255, 0.18)
        }

        .vscode-light blockquote,
        .vscode-dark blockquote {
            background: rgba(127, 127, 127, .1);
            border-color: rgba(0, 122, 204, .5)
        }

        .vscode-high-contrast blockquote {
            background: transparent;
            border-color: #fff
        }

        .main-content {
            width: 65%;
            vertical-align: top
        }

        .sidebar {
            vertical-align: top
        }

        .footer {
            padding: 25px;
            text-align: center
        }

        .vscode-light table > tbody > tr > td.sidebar {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 10px
        }

        .vscode-dark table > tbody > tr > td.sidebar {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px
        }

        .vscode-light a {
            color: #4080D0
        }

        .vscode-dark a {
            color: #a2c1e8
        }

        .vscode-high-contrast .codeSnippetContainerCode div {
            color: black !important
        }

        .vscode-light .codeSnippetContainerCode div {
            color: black !important
        }

        .vscode-dark .codeSnippetContainerCode div {
            color: white !important
        }
    </STYLE>
</head>
<body>
{0}
</body>
</html>
`;
//# sourceMappingURL=html.js.map