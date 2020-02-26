import { object as oldObject } from 'dot-object';

/**
 * Version of 'object' from 'dot-object' that doesn't mutate the existing variable.
 * It converts eg.
 *
 * ```js
 * { 'activityBar.background': '#ddd' }
 * to
 * { activityBar: { background: '#ddd' } }
 */
export const object = (obj: Parameters<typeof oldObject>[0]): any =>
  oldObject(JSON.parse(JSON.stringify(obj)));
