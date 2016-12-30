import getOffsetParent from './getOffsetParent';
import getScrollParent from './getScrollParent';
import getOffsetRect from './getOffsetRect';
import getPosition from './getPosition';
import getOffsetRectRelativeToCustomParent from './getOffsetRectRelativeToCustomParent';
import getTotalScroll from './getTotalScroll';
import isFixed from './isFixed';
import getWindowSizes from './getWindowSizes';

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {Object} data - Object containing the property "offsets" generated by `_getOffsets`
 * @param {Number} padding - Boundaries padding
 * @param {Element} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
export default function getBoundaries(popper, padding, boundariesElement) {
    // NOTE: 1 DOM access here
    let boundaries = { top: 0, left: 0 };
    const offsetParent = getOffsetParent(popper);
    const scrollParent = getScrollParent(popper);
    const html = window.document.documentElement;

    if (boundariesElement === 'window') {
        // WINDOW
        const { height, width } = getWindowSizes();
        boundaries = {
            top: 0,
            right: width,
            bottom: height,
            left: 0
        };
    } else if (boundariesElement === 'viewport') {
        // VIEWPORT
        const { left, top } = getOffsetRect(offsetParent);
        const { clientWidth: width, clientHeight: height } = html;

        if (getPosition(popper) === 'fixed') {
            boundaries.right = width;
            boundaries.bottom = height;
        } else {
            boundaries = {
                top: 0 - top,
                right: width - left,
                bottom: height - top,
                left: 0 - left
            };
        }
    } else if (boundariesElement === 'scrollParent' || scrollParent === boundariesElement) {
        // SCROLL PARENT IS BOUNDARIES ELEMENT
        if (scrollParent.nodeName === 'BODY') {
            const { height, width } = getWindowSizes();
            boundaries.right = width;
            boundaries.bottom = height;
        } else {
            boundaries = getOffsetRectRelativeToCustomParent(scrollParent, offsetParent, isFixed(popper));
        }
    } else {
        // BOUNDARIES ELEMENT
        boundaries = getOffsetRectRelativeToCustomParent(boundariesElement, offsetParent, isFixed(popper));
    }

    const scrollLeft = getTotalScroll(popper, 'left');
    const scrollTop = getTotalScroll(popper, 'top');
    boundaries.right += scrollLeft;
    boundaries.bottom += scrollTop;

    // Add paddings
    boundaries.left += padding;
    boundaries.top += padding;
    boundaries.right -= padding;
    boundaries.bottom -= padding;

    return boundaries;
}
