'use strict';

const tinycolor = require('tinycolor2');
const fsp = require('./fsp');
const { loadYAML } = require('./yaml');

/**
 * On dev mode, sometimes when we read the file the return value of readFile
 * is an empty string. In those cases we need to read the file again
 */
async function readFileRetrying(yamlFilePath) {
    const standardThemeYAML = await fsp.readFile(yamlFilePath, 'utf8');
    if (!standardThemeYAML) {
        return readFileRetrying(yamlFilePath);
    }
    return standardThemeYAML;
}

async function loadTheme(yamlFilePath) {
    const standardThemeYAML = await readFileRetrying(yamlFilePath);
    const standardTheme = await loadYAML(standardThemeYAML);

    const softThemeYAML = getSoftThemeYAML(standardThemeYAML, standardTheme);
    const softTheme = await loadYAML(softThemeYAML);

    return { standardTheme, softTheme };
}

function getSoftThemeYAML(fileContent, standardTheme) {
    const brightColors = [
        ...standardTheme.dracula.ansi,
        ...standardTheme.dracula.brightOther,
    ];

    return fileContent.replace(/#[0-9A-F]{6}/g, color => {
        if (brightColors.includes(color)) {
            return tinycolor(color)
                .desaturate(20)
                .toHexString();
        }
        return color;
    });
}

module.exports = loadTheme;
