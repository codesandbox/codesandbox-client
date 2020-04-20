import { object as oldObject } from 'dot-object';

/* eslint-disable */

/**
 * Version of 'object' from 'dot-object' that doesn't mutate the existing variable.
 * It converts eg.
 *
 * ```js
 * { 'activityBar.background': '#ddd' }
 * to
 * { activityBar: {background: '#ddd' } }
 */
export function object(obj: any) {
  return oldObject(JSON.parse(JSON.stringify(obj)));
}
