const Color = require("color");

/*
 * Generate color variant by inverting
 * luminance in the  HSL representation
 */
function getVariant(hex, style) {
  if (style === "dark") {
    const c = Color(hex);
    return c
      .hsl()
      .lightness(100 - c.lightness())
      .hex()
      .toLowerCase();
  } 
    return hex;
  
}

module.exports = {
  getVariant,
};
