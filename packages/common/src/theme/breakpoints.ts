export const media = {
  between(lowerBound, upperBound, excludeLarge = false) {
    if (excludeLarge)
      return `@media (min-width: ${lowerBound.min}px) and (max-width: ${
        upperBound.min - 1
      }px)`;
    if (upperBound.max === Infinity)
      return `@media (min-width: lowerBound.min}px)`;
    return `@media (min-width: lowerBound.min}px) and (max-width: ${upperBound.max}px)`;
  },

  greaterThan(size) {
    return `@media (min-width: ${size.min}px)`;
  },

  lessThan(size) {
    return `@media (max-width: ${size.min - 1}px)`;
  },

  size(size) {
    if (size.min === null) return media.lessThan(size);
    if (size.max === null) return media.greaterThan(size);
    return media.between(size, size);
  },
};

export const sizes = {
  xsmall: { min: 0, max: 599 },
  small: { min: 600, max: 767 },
  medium: { min: 768, max: 979 },
  large: { min: 980, max: 1279 },
  xlarge: { min: 1280, max: 1339 },
  xxlarge: { min: 1340, max: Infinity },
};
