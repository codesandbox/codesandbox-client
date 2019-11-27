export interface Bounds {
  min: number;
  max: number;
}

export const media = {
  between(lowerBound: Bounds, upperBound: Bounds, excludeLarge = false) {
    if (excludeLarge)
      return `@media (min-width: ${
        lowerBound.min
      }px) and (max-width: ${upperBound.min - 1}px)`;
    if (upperBound.max === Infinity)
      return `@media (min-width: lowerBound.min}px)`;
    return `@media (min-width: lowerBound.min}px) and (max-width: ${upperBound.max}px)`;
  },

  greaterThan(size: Bounds) {
    return `@media (min-width: ${size.min}px)`;
  },

  lessThan(size: Bounds) {
    return `@media (max-width: ${size.min - 1}px)`;
  },

  size(size: Bounds) {
    if (size.min === null) return media.lessThan(size);
    if (size.max === null) return media.greaterThan(size);
    return media.between(size, size);
  },
};

export const sizes = {
  tiny: { min: 0, max: 575 },
  small: { min: 576, max: 767 },
  medium: { min: 768, max: 991 },
  large: { min: 992, max: 1199 },
  xlarge: { min: 1200, max: Infinity },
};
