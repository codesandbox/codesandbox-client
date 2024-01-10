import { getAbsoluteValue } from '../css/types/length-percentage';
export const paddingBox = (element) => {
    const bounds = element.bounds;
    const styles = element.styles;
    return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));
};
export const contentBox = (element) => {
    const styles = element.styles;
    const bounds = element.bounds;
    const paddingLeft = getAbsoluteValue(styles.paddingLeft, bounds.width);
    const paddingRight = getAbsoluteValue(styles.paddingRight, bounds.width);
    const paddingTop = getAbsoluteValue(styles.paddingTop, bounds.width);
    const paddingBottom = getAbsoluteValue(styles.paddingBottom, bounds.width);
    return bounds.add(paddingLeft + styles.borderLeftWidth, paddingTop + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft + paddingRight), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop + paddingBottom));
};
