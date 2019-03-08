var _allData = JSON.parse(atob(self.allData));
var output = document.createElement('div');
document.body.appendChild(output);
var escape = document.createElement('textarea');
function escapeHTML(str) {
    str = str.replace(/\t/g, '    ');
    escape.textContent = str;
    return escape.innerHTML;
}
function renderTestCase(data) {
    var content = data.testContent;
    var output = [];
    var actual = data.actual;
    var expected = data.expected;
    var diff = data.diff;
    var actualIndex = 0, expectedIndex = 0, diffIndex = 0;
    var lines = content.split(/\r\n|\r|\n/g);
    for (var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i];
        var actualLineOutput = [];
        var actualLine = line;
        while (actualLine.length > 0) {
            var actualToken = actual[actualIndex++];
            actualLine = actualLine.substr(actualToken.content.length);
            actualLineOutput.push("<span style=\"color:" + actualToken.color.substring(0, 7) + "\" data-actual-index=\"" + (actualIndex - 1) + "\">" + escapeHTML(actualToken.content) + "</span>");
        }
        actualLineOutput.push('</div>');
        var expectedLineOutput = [];
        var expectedLine = line;
        while (expectedLine.length > 0) {
            var expectedToken = expected[expectedIndex++];
            expectedLine = expectedLine.substr(expectedToken.content.length);
            expectedLineOutput.push("<span style=\"color:" + expectedToken.color + "\" data-expected-index=\"" + (expectedIndex - 1) + "\">" + escapeHTML(expectedToken.content) + "</span>");
        }
        expectedLineOutput.push('</div>');
        var diffOutput = [];
        while (diffIndex < diff.length && diff[diffIndex].oldIndex < expectedIndex) {
            diffOutput.push('<tr><td style="width:500px">');
            diffOutput.push(escapeHTML(JSON.stringify(diff[diffIndex].newToken, null, '  ')));
            diffOutput.push('</td><td style="width:500px">');
            diffOutput.push(escapeHTML(JSON.stringify(diff[diffIndex].oldToken, null, '  ')));
            diffOutput.push('</td></tr>');
            diffIndex++;
        }
        if (diffOutput.length > 0) {
            actualLineOutput = ['<div class="actual-line with-diff">'].concat(actualLineOutput);
            expectedLineOutput = ['<div class="expected-line with-diff">'].concat(expectedLineOutput);
            diffOutput = ['<table class="diff collapsed">'].concat(diffOutput).concat('</table>');
        }
        else {
            actualLineOutput = ['<div class="actual-line the-same">'].concat(actualLineOutput);
            expectedLineOutput = ['<div class="expected-line the-same">'].concat(expectedLineOutput);
        }
        output = output.concat(actualLineOutput);
        output = output.concat(expectedLineOutput);
        output = output.concat(diffOutput);
    }
    var domNode = document.createElement('div');
    var title = document.createElement('h2');
    if (diff.length > 0) {
        title.className = 'title with-diff';
    }
    else {
        title.className = 'title the-same';
    }
    title.innerHTML = data.themeName;
    domNode.appendChild(title);
    var linesDomNode = document.createElement('div');
    if (diff.length === 0) {
        linesDomNode.className = 'collapsed';
    }
    linesDomNode.innerHTML = output.join('');
    linesDomNode.style.backgroundColor = data.backgroundColor;
    linesDomNode.style.fontFamily = 'Consolas';
    domNode.appendChild(linesDomNode);
    return domNode;
}
document.body.onclick = function (e) {
    var target = e.target;
    if (target.tagName === 'H2') {
        var targetContent = target.nextElementSibling;
        if (targetContent.className === 'collapsed') {
            targetContent.className = '';
        }
        else {
            targetContent.className = 'collapsed';
        }
        return;
    }
    if (target.tagName !== 'SPAN') {
        return;
    }
    var line = target.parentElement;
    var targetDiff = null;
    if (/^actual-line/.test(line.className)) {
        targetDiff = line.nextElementSibling.nextElementSibling;
    }
    else if (/^expected-line/.test(line.className)) {
        targetDiff = line.nextElementSibling;
    }
    if (!targetDiff) {
        return;
    }
    if (targetDiff.className === 'diff collapsed') {
        targetDiff.className = 'diff';
    }
    else {
        targetDiff.className = 'diff collapsed';
    }
};
var acceptDiffContent = (function () {
    var result = {};
    for (var i = 0, len = _allData.length; i < len; i++) {
        var data = _allData[i];
        if (!data.actual) {
            continue;
        }
        result[data.themeName] = data.diff.map(function (diffEntry) {
            return {
                index: diffEntry.oldIndex,
                content: diffEntry.oldToken.content,
                color: diffEntry.oldToken.color,
                newColor: diffEntry.newToken.color.substring(0, 7)
            };
        });
    }
    return JSON.stringify(result, null, '\t');
})();
var diffTA = document.createElement('textarea');
diffTA.value = acceptDiffContent;
document.body.appendChild(diffTA);
document.body.oncopy = function (e) {
    e.clipboardData.setData('text', acceptDiffContent);
};
var acceptBtn = document.createElement('button');
acceptBtn.innerHTML = 'Accept diff';
acceptBtn.style.position = 'fixed';
acceptBtn.style.top = '10px';
acceptBtn.style.right = '10px';
acceptBtn.style.fontSize = '150%';
document.body.appendChild(acceptBtn);
acceptBtn.onclick = function () {
    diffTA.select();
    console.log(acceptDiffContent);
};
var patchedBtn = document.createElement('button');
patchedBtn.innerHTML = 'View patched diff';
patchedBtn.style.position = 'fixed';
patchedBtn.style.top = '10px';
patchedBtn.style.right = '150px';
patchedBtn.style.fontSize = '150%';
document.body.appendChild(patchedBtn);
patchedBtn.onclick = renderPatchedDiff;
var originalBtn = document.createElement('button');
originalBtn.innerHTML = 'View original diff';
originalBtn.style.position = 'fixed';
originalBtn.style.top = '10px';
originalBtn.style.right = '360px';
originalBtn.style.fontSize = '150%';
document.body.appendChild(originalBtn);
originalBtn.onclick = renderOriginalDiff;
function renderOriginalDiff() {
    output.innerHTML = '';
    _allData.forEach(function (data) {
        if (!data.actual) {
            return;
        }
        output.appendChild(renderTestCase({
            testContent: data.testContent,
            themeName: data.themeName,
            backgroundColor: data.backgroundColor,
            actual: data.actual,
            expected: data.expected,
            diff: data.diff
        }));
    });
}
function renderPatchedDiff() {
    output.innerHTML = '';
    _allData.forEach(function (data) {
        if (!data.actual) {
            return;
        }
        output.appendChild(renderTestCase({
            testContent: data.testContent,
            themeName: data.themeName,
            backgroundColor: data.backgroundColor,
            actual: data.actual,
            expected: data.patchedExpected,
            diff: data.patchedDiff
        }));
    });
}
renderOriginalDiff();
