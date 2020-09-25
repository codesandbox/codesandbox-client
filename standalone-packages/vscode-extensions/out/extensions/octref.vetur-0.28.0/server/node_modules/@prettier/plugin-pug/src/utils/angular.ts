/**
 * Indicates whether the attribute name is an Angular binding
 *
 * ---
 *
 * Example binding:
 * ```
 * button([disabled]="isUnchanged") Save
 * ```
 *
 * In this case `name` is `[disabled]`
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isAngularBinding(name: string): boolean {
	return name.length >= 3 && name[0] === '[' && name[name.length - 1] === ']';
}

/**
 * Indicates whether the attribute name is an Angular event
 *
 * ---
 *
 * Example event:
 * ```
 * button((click)="onClickMe()") Click me!
 * ```
 *
 * In this case `name` is `(click)`
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isAngularAction(name: string): boolean {
	return name.length >= 3 && name[0] === '(' && name[name.length - 1] === ')';
}

/**
 * Indicates whether the attribute name is an Angular directive
 *
 * ---
 *
 * Example directive:
 * ```
 * li(*ngFor="let customer of customers") {{ customer.name }}
 * ```
 *
 * In this case `name` is `*ngFor`
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isAngularDirective(name: string): boolean {
	return name.length >= 2 && name[0] === '*';
}

/**
 * Indicates whether the attribute value is an Angular interpolation
 *
 * ---
 *
 * Example interpolation:
 * ```
 * img(src="{{ itemImageUrl }}")
 * ```
 *
 * In this case `val` is `"{{ itemImageUrl }}"`
 *
 * ---
 *
 * @param name Name of tag attribute
 */
export function isAngularInterpolation(val: string): boolean {
	return (
		val.length >= 5 &&
		((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'")) &&
		val[1] === '{' &&
		val[2] === '{' &&
		val[val.length - 2] === '}' &&
		val[val.length - 3] === '}' &&
		!val.includes('{{', 3)
	);
}
