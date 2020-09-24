/**
 * Indicates whether the attribute name is a Vue event binding
 *
 * ---
 *
 * Example event binding:
 * ```
 * v-btn(@click="doSomething") Do Something
 * ```
 *
 * In this case `name` is `@click`
 *
 * ---
 *
 * Checks for: `v-on`.
 *
 * Also shorthands like `@*` are checked.
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isVueEventBinding(name: string): boolean {
	return /^(v-on|@).*/.test(name);
}

/**
 * Indicates whether the attribute name is a Vue expression
 *
 * ---
 *
 * Example expression:
 * ```
 * v-text-field(v-model="value", :label="label") Do Something
 * ```
 *
 * In this case `name` is `v-model` and `:label`
 *
 * ---
 *
 * Checks for: `v-bind`, `v-slot`, `v-model`, `v-if`, `v-else-if`, `v-for`,
 * `v-text` and `v-html`.
 *
 * Also shorthands like `:*` are checked.
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isVueExpression(name: string): boolean {
	return /^((v-(bind|slot))?:|v-(model|if|for|else-if|text|html)).*/.test(name);
}
