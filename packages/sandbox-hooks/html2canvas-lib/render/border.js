import { isBezierCurve } from './bezier-curve';
export const parsePathForBorder = (curves, borderSide) => {
    switch (borderSide) {
        case 0:
            return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftPaddingBox, curves.topRightBorderBox, curves.topRightPaddingBox);
        case 1:
            return createPathFromCurves(curves.topRightBorderBox, curves.topRightPaddingBox, curves.bottomRightBorderBox, curves.bottomRightPaddingBox);
        case 2:
            return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox);
        case 3:
        default:
            return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox, curves.topLeftBorderBox, curves.topLeftPaddingBox);
    }
};
const createPathFromCurves = (outer1, inner1, outer2, inner2) => {
    const path = [];
    if (isBezierCurve(outer1)) {
        path.push(outer1.subdivide(0.5, false));
    }
    else {
        path.push(outer1);
    }
    if (isBezierCurve(outer2)) {
        path.push(outer2.subdivide(0.5, true));
    }
    else {
        path.push(outer2);
    }
    if (isBezierCurve(inner2)) {
        path.push(inner2.subdivide(0.5, true).reverse());
    }
    else {
        path.push(inner2);
    }
    if (isBezierCurve(inner1)) {
        path.push(inner1.subdivide(0.5, false).reverse());
    }
    else {
        path.push(inner1);
    }
    return path;
};
