const { colors } = require("@primer/primitives");

function getColors(style) {
  if (style === "dark") {
    /* The array of light to dark colors are reversed to auto-generate dark theme */
    const darkColors = {};
    Object.entries(colors).forEach(([name, val]) => {
      if (name === "black") {
        darkColors.white = val;
      } else if (name === "white") {
        darkColors.black = val;
      } else {
        darkColors[name] = [...val].reverse();
      }
    });
    return darkColors;
  } else {
    return colors;
  }
}

module.exports = {
  getColors,
};
