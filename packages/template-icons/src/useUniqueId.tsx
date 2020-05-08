import { useMemo } from 'react';

/* Template icons use <linearGradient/>, <radialGradient/>, <filter/>,
 * <clipPath/> and potentially other svg definitions which require
 * a global identifier that is referenced through `"url(#defId)"`
 *
 * We need a unique global identifier to avoid name collision when
 * an icon is rendered more than once.
 * https://github.com/codesandbox/codesandbox-templates/issues/4
 */

let counter = 0;

/** Renerate a unique identifier on every mount of a component
 *
 * That is achieved by the useMemo's second argument [] which says, execute
 * the function and return new value on every mount
 */
export const useUniqueId = () => useMemo(() => ++counter, []);
