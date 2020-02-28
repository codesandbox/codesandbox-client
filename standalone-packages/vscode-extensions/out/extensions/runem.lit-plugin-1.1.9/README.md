
<div align="center" markdown="1">

  <p align="center">
  <img src="https://user-images.githubusercontent.com/5372940/62078619-4d436880-b24d-11e9-92e0-5fcc43635b7c.png" alt="Logo" width="200" height="auto" />
</p>

  <p align="center">
  <b>Syntax highlighting, type checking and code completion for lit-html</b></br>
  <sub><sub>
</p>

<br />


[![](https://vsmarketplacebadge.apphb.com/version-short/runem.lit-plugin.svg)](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/runem.lit-plugin.svg)](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
[![](https://vsmarketplacebadge.apphb.com/rating-short/runem.lit-plugin.svg)](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green.svg" height="20"></img></a>
<a href="https://david-dm.org/runem/lit-analyzer"><img alt="Dependencies" src="https://img.shields.io/david/runem/lit-analyzer.svg?color=green" height="20"/></a>
<a href="https://github.com/runem/lit-analyzer/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/runem/lit-analyzer.svg" height="20"/></a>

  <img src="https://user-images.githubusercontent.com/5372940/62078476-02c1ec00-b24d-11e9-8de5-1322012cbde2.gif" alt="Lit plugin GIF"/>

</div>


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#installation)

## ➤ Installation

Simply search for [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin) in the vscode marketplace and install the extension.

**Note**: You can also run `code --install-extension runem.lit-plugin` to install it.

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#rules)

## ➤ Rules

The default severity of each rule depend on the `strict` [configuration option](#-configuration). Strict mode is disabled as default.

Each rule can have severity of `off`, `warning` or `error`. You can toggle rules as you like.

**Validating custom elements**

<!-- prettier-ignore -->
| Rule    | Description | Severity normal | Severity strict |
| :------ | ----------- | --------------- | --------------- |
| [no-unknown-tag-name](#-no-unknown-tag-name) | The existence of tag names are checked. Be aware that not all custom elements from libraries will be found out of the box. | off | warning |
| [no-missing-import](#-no-missing-import)    | When using custom elements in HTML it is checked if the element has been imported and is available in the current context. | off | warning |
| [no-unclosed-tag](#-no-unclosed-tag)         | Unclosed tags, and invalid self closing tags like custom elements tags, are checked. | warning | error |


**Validating binding names**

<!-- prettier-ignore -->
| Rule    | Description | Severity normal | Severity strict |
| :------ | ----------- | --------------- | --------------- |
| [no-unknown-attribute](#-no-unknown-attribute-no-unknown-property)<br> [no-unknown-property](#-no-unknown-attribute-no-unknown-property) | You will get a warning whenever you use an unknown attribute or property within your `lit-html` template. | off | warning |
| [no-unknown-event](#-no-unknown-event)       | When using event bindings it's checked that the event names are fired. | off | off |
| [no-unknown-slot](#-no-unknown-slot)         | Using the "@slot" jsdoc tag on your custom element class, you can tell which slots are accepted for a particular element. | off | warning |


**Validating binding types**

<!-- prettier-ignore -->
| Rule    | Description | Severity normal | Severity strict |
| :------ | ----------- | --------------- | --------------- |
| [no-invalid-boolean-binding](#-no-invalid-boolean-binding)       | Disallow boolean attribute bindings on non-boolean types. | error | error |
| [no-expressionless-property-binding](#-no-expressionless-property-binding) | Disallow property bindings without an expression. | error | error |
| [no-noncallable-event-binding](#-no-noncallable-event-binding)   | Disallow event listener bindings with a noncallable type. | error | error |
| [no-boolean-in-attribute-binding](#-no-boolean-in-attribute-binding) | Disallow attribute bindings with a boolean type. | error | error |
| [no-complex-attribute-binding](#-no-complex-attribute-binding)   | Disallow attribute bindings with a complex type. | error | error |
| [no-nullable-attribute-binding](#-no-nullable-attribute-binding) | Disallow attribute bindings with nullable types such as "null" or "undefined".  | error | error |
| [no-incompatible-type-binding](#-no-incompatible-type-binding)   | Disallow incompatible type in bindings.  | error | error |
| [no-invalid-directive-binding](#-no-invalid-directive-binding)   | Disallow using built-in directives in unsupported bindings. | error | error |
| [no-unintended-mixed-binding](#-no-unintended-mixed-binding)   | Disallow mixed value bindings where a character `'`, `"`, `}` or `/` is unintentionally included in the binding. | warn | warn |

**Validating LitElement**

<!-- prettier-ignore -->
| Rule    | Description | Severity normal | Severity strict |
| :------ | ----------- | --------------- | --------------- |
| [no-incompatible-property-type](#-no-incompatible-property-type) | When using the @property decorator in Typescript, the property option `type` is checked against the declared property Typescript type | error | error |
| [no-unknown-property-converter](#-no-unknown-property-converter) | LitElement provides default converters. For example 'Function' is not a valid default converter type for a LitElement-managed property. | error | error |
| [no-invalid-attribute-name](#-no-invalid-attribute-name)         | When using the property option `attribute`, the value is checked to make sure it's a valid attribute name. | error | error |
| [no-invalid-tag-name](#-no-invalid-tag-name)                     | When defining a custom element the tag name is checked to make sure it's valid. | error | error |

**Validating CSS**

<!-- prettier-ignore -->
| Rule    | Description | Severity normal | Severity strict |
| :------ | ----------- | --------------- | --------------- |
| [💅 no-invalid-css](#-no-invalid-css) | CSS within the tagged template literal `css` will be validated. | warning | error |


### Validating custom elements

All web components in your code are analyzed using [web-component-analyzer](https://github.com/runem/web-component-analyzer) which supports native custom elements and web components built with LitElement.

#### 🤷‍ no-unknown-tag-name

Web components defined in libraries need to either extend the global `HTMLElementTagNameMap` (typescript definition file) or include the "@customElement tag-name" jsdoc on the custom element class.

Below you will see an example of what to add to your library typescript definition files if you want type checking support for a given html tag name.

```typescript
declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

#### 📣 no-missing-import

When using custom elements in HTML it is checked if the element has been imported and is available in the current context. It's considered imported if any imported module (or their imports) defines the custom element.

The following example is considered a warning:
```js
// No import of "my-element"
html`<my-element></my-element>`
```

The following example is not considered a warning:
```js
import "my-element.js";
html`<my-element></my-element>`
```


#### ☯ no-unclosed-tag

Unclosed tags, and invalid self closing tags like custom elements tags, are checked.

The following examples are considered warnings:
```js
html`<div>`
html`<video />`
html`<custom-element />`
```

The following examples are not considered warnings:
```js
html`<div></div>`
html`<custom-element></custom-element>`
html`<video></video>`
html`<input />`
```

### Validating binding names

Attributes, properties and events are picked up on custom elements using [web-component-analyzer](https://github.com/runem/web-component-analyzer) which supports native custom elements and web components built with LitElement.

#### ✅ no-unknown-attribute, no-unknown-property

You will get a warning whenever you use an unknown attribute or property. This check is made on both custom elements and built in elements. 

**The following example is considered a warning:**
```js
html`<input .valuuue="${value}" unknownattribute="button" />`
```

**The following example is not considered a warning:**
```js
html`<input .value="${value}" type="button" />`
```

#### ⚡️ no-unknown-event

You can opt in to check for unknown event names. Using the `@fires` jsdoc or the statement `this.dispatch(new CustomElement("my-event))` will make the event name available. All event names are accepted globally because events bubble. 

The following example is considered a warning:
```js
html`<input @iinput="${console.log}" />`
```

The following example is not considered a warning:
```js
html`<input @input="${console.log}" />`
```

#### 📬 no-unknown-slot

Using the "@slot" jsdoc tag on your custom element class, you can tell which slots are accepted for a particular element. Then you will get warnings for invalid slot names and if you forget to add the slot attribute on elements without an unnamed slot.

```js
/**
 * @slot - This is a comment for the unnamed slot
 * @slot right - Right content
 * @slot left
 */
class MyElement extends HTMLElement {
}
customElements.define("my-element", MyElement);
```

The following example is considered a warning:
```js
html`
<my-element>
  <div slot="not a slot name"></div>
</my-element>
`
```

The following example is not considered a warning:
```js
html`
<my-element>
  <div></div>
  <div slot="right"></div>
  <div slot="left"></div>
</my-element>
`
```


### Validating binding types

Be aware that many checks involving analyzing bindings will work better in Typescript files because we have more information about the values being bound.

#### ❓ no-invalid-boolean-binding

It never makes sense to use the boolean attribute binding on a non-boolean type.

The following example is considered a warning:
```js
html`<input ?type="${"button"}" />`
```

The following example is not considered a warning:
```js
html`<input ?disabled="${isDisabled}" />`
```

#### ⚫️ no-expressionless-property-binding

Because of how `lit-html` [parses bindings internally](https://github.com/Polymer/lit-html/issues/843) you cannot use the property binding without an expression.

The following example is considered a warning:
```js
html`<input .value="text" />`
```

The following example is not considered a warning:
```js
html`<input .value="${text}" />`
```

#### 🌀 no-noncallable-event-binding

It's a common mistake to incorrectly call the function when setting up an event handler binding instead of passing a reference to the function. This makes the function call whenever the code evaluates. 

The following examples are considered warnings:
```js
html`<button @click="${myEventHandler()}">Click</button>`
html`<button @click="${{hannndleEvent: console.log()}}">Click</button>`
```

The following examples are not considered warnings:
```js
html`<button @click="${myEventHandler}">Click</button>`
html`<button @click="${{handleEvent: console.log}}">Click</button>`
```

#### 😈 no-boolean-in-attribute-binding

You should not be binding to a boolean type using an attribute binding because it could result in binding the string "true" or "false". Instead you should be using a **boolean** attribute binding.

This error is particular tricky, because the string "false" is truthy when evaluated in a conditional.

The following example is considered a warning:
```js
html`<input disabled="${isDisabled}" />`
```

The following example is not considered a warning:
```js
html`<input ?disabled="${isDisabled}" />`
```

#### ☢️ no-complex-attribute-binding

Binding an object using an attribute binding would result in binding the string "[object Object]" to the attribute. In this cases it's probably better to use a property binding instead.

The following example is considered a warning:
```js
html`<my-list listitems="${listItems}"></my-list>`
```

The following example is not considered a warning:
```js
html`<my-list .listItems="${listItems}"></my-list>`
```


#### ⭕️ no-nullable-attribute-binding 

Binding `undefined` or `null` in an attribute binding will result in binding the string "undefined" or "null". Here you should probably wrap your expression in the "ifDefined" directive.

The following examples are considered warnings:
```js
html`<input value="${maybeUndefined}" />`
html`<input value="${maybeNull}" />`
```

The following examples are not considered warnings:
```js
html`<input value="${ifDefined(maybeUndefined)}" />`
html`<input value="${ifDefined(maybeNull === null ? undefined : maybeNull)}" />`
```

#### 💔 no-incompatible-type-binding

Assignments in your HTML are typed checked just like it would be in Typescript.

The following examples are considered warnings:
```js
html`<input type="wrongvalue" />`
html`<input placeholder />`
html`<input max="${"hello"}" />`
html`<my-list .listItems="${123}"></my-list>`
```

The following examples are not considered warnings:
```js
html`<input type="button" />`
html`<input placeholder="a placeholder" />`
html`<input max="${123}" />`
html`<my-list .listItems="${listItems}"></my-list>`
```

#### 💥 no-invalid-directive-binding

Directives are checked to make sure that the following rules are met: 
* `ifDefined` is only used in an attribute binding.
* `class` is only used in an attribute binding on the 'class' attribute.
* `style` is only used in an attribute binding on the 'style' attribute.
* `unsafeHTML`, `cache`, `repeat`, `asyncReplace` and `asyncAppend` are only used within a text binding.

The directives already make these checks on runtime, so this will help you catch errors before runtime.

The following examples are considered warnings:
```js
html`<input value="${unsafeHTML(html)}" />`
html`<input .value="${ifDefined(myValue)}" />`
html`<div role="${class(classMap)}"></div>`
```

The following examples are not considered warnings:
```js
html`<button>${unsafeHTML(html)}</button>`
html`<input .value="${myValue}" />`
html`<input value="${myValue}" />`
html`<div class="${class(classMap)}"></div>`
```

#### 🕷 no-unintended-mixed-binding

Sometimes unintended characters sneak into bindings. This often indicates a typo such as `<input value=${"foo"}} />` where the expression is directly followed by a "}" which will be included in the value being bound, resulting in "foo}". Another example is self-closing tags without a space between the binding and "/" like `<input value=${"foo"}/>` which will result in binding the string "myvalue/".

This rule disallows mixed value bindings where a character `'`, `"`, `}` or `/` is unintentionally included in the binding.

The following examples are considered warnings:
```js
html`<input .value=${"myvalue"}" />`
html`<input value=${"myvalue"}} />`
html`<input value=${"myvalue"}/>`
html`<input ?required=${true}/>`
```

The following examples are not considered warnings:
```js
html`<input .value=${"myvalue"} />`
html`<input value="${"myvalue"}" />`
html`<input ?required=${true} />`
html`<input @input="${console.log}" />`
```


### Validating LitElement

#### 💞 no-incompatible-property-type

When using the @property decorator in Typescript, the property option `type` is checked against the declared property Typescript type.

The following examples are considered warnings:
```js
class MyElement extends LitElement {
  @property({type: Number}) text: string;
  @property({type: Boolean}) count: number;
  @property({type: String}) disabled: boolean;
  @property({type: Object}) list: ListItem[];
}
```

The following examples are not considered warnings:
```js
class MyElement extends LitElement {
  @property({type: String}) text: string;
  @property({type: Number}) count: number;
  @property({type: Boolean}) disabled: boolean;
  @property({type: Array}) list: ListItem[];
}
```

#### 👎 no-unknown-property-converter

The default converter in LitElement only accepts `String`, `Boolean`, `Number`, `Array` and `Object`, so all other values for `type` are considered warnings. This check doesn't run if a custom converter is used.

The following example is considered a warning:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      callback: {
        type: Function
      },
      text: {
        type: MyElement
      }
    }
  }
}
```

The following example is not considered a warning:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      callback: {
        type: Function,
        converter: myCustomConverter
      },
      text: {
        type: String
      }
    }
  }
}
```


#### ⁉️ no-invalid-attribute-name

When using the property option `attribute`, the value is checked to make sure it's a valid attribute name.

The following example is considered a warning:
```js
class MyElement extends LitElement {
  static get properties () {
    return {
      text: {
        attribute: "invald=name"
      }
    }
  }
}
```

#### ⁉️ no-invalid-tag-name

When defining a custom element, the tag name is checked to make sure it's a valid custom element name.

The following example is considered a warning:
```js
@customElement("wrongElementName")
class MyElement extends LitElement {
}

customElements.define("alsoWrongName", MyElement);
```

The following example is not considered a warning:
```js
@customElement("my-element")
class MyElement extends LitElement {
}

customElements.define("correct-element-name", MyElement);
```

### Validating CSS

`lit-analyzer` uses [vscode-css-languageservice](https://github.com/Microsoft/vscode-css-languageservice) to validate CSS.

#### 💅 no-invalid-css

CSS within the tagged template literal `css` will be validated. 

The following example is considered a warning:
```js
css`
  button
    background: red;
  }
`
```

The following example is not considered a warning:
```js
css`
  button {
    background: red;
  }
`
```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#configuration)

## ➤ Configuration

You can configure this plugin by going to `VS Code Settings` > `Extension` > `lit-plugin`.

**Note:** You can also configure the plugin using a `tsconfig.json` file (see [ts-lit-plugin](https://github.com/runem/lit-analyzer/blob/master/packages/ts-lit-plugin)).

### Available options

<!-- prettier-ignore -->
| Option | Description | Type | Default |
| :----- | ----------- | ---- | ------- |
| `strict` | Enabling strict mode will change which rules are applied as default (see list of [rules](https://github.com/runem/lit-analyzer/blob/master/docs/readme/rules.md)) | `boolean` | false |
| `rules` | Enable/disable individual rules or set their severity. Example: `{"no-unknown-tag-name": "off"}` | `{"rule-name": "off" \| "warn" \| "error"}` | The default rules enabled depend on the `strict` option |
| `disable` | Completely disable this plugin. | `boolean` | false |
| `dontShowSuggestions` | This option sets strict as  | `boolean` | false |
| `htmlTemplateTags` | List of template tags to enable html support in. | `string[]` | ["html", "raw"] | |
| `cssTemplateTags` | This option sets strict as | `string[]` | ["css"] |
| `globalTags` |  List of html tag names that you expect to be present at all times. | `string[]` | |
| `globalAttributes` | List of html attributes names that you expect to be present at all times. | `string[]` | |
| `globalEvents` | List of event names that you expect to be present at all times | `string[]` | |
| `customHtmlData` | This plugin supports the [custom vscode html data format](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support) through this setting. | [Vscode Custom HTML Data Format](https://github.com/Microsoft/vscode-html-languageservice/blob/master/docs/customData.md). Supports arrays, objects and relative file paths | |





[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#other-features)

## ➤ Other features

[Rules](#-rules) as described before, gives you diagnostics directly in your code. Features described in this section will give you super powers by making your lit-html templates come to life.

### 🚶Goto definition

`Cmd+Click (Mac)` / `Ctrl+Click (Windows)` on a tag, attribute, property or event name and goto the definition.

### ✏️ Code completions for css and html

<img src="https://user-images.githubusercontent.com/5372940/53271979-4f2e5c00-36f0-11e9-98a6-f9b7996d841c.gif" width="500" />

Press `Ctrl+Space` in an html or css context and to get code completions.


### 📖 Quick info on hover for html tags and attributes

Hover above a tag, attribute, property or event and see more information about the identifier such as type and jsdoc.

### 🚪 Auto close tags

When typing html inside a template tag `lit-plugin` auto-closes tags as you would expect.

### 🔍 Automatically finds custom elements

If you define a custom element somewhere in your code `lit-plugin` will automatically find it. Then it will provide auto-import functionality, type checking and code completion out of the box by analyzing the element. [web-component-analyzer](https://github.com/runem/web-component-analyzer) is the tool that takes care of analyzing components.

### 🌎 Support for dependencies that extend the global HTMLElementTagNameMap

<img src="https://user-images.githubusercontent.com/5372940/53271293-4fc5f300-36ee-11e9-9ed9-31f1e50f898c.gif" width="500" />

If a dependency with Typescript definitions extends the global `HTMLElementTagNameMap` this plugin will pick up on the map between the tag name and the class. Below you will see an example of what to add to your library typescript definition files if you want type checking support for a given html tag.

```typescript
declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

**Two limitations using this approach as of now**

-   By using this approach the plugin wont see detailed information about a given element as (e.g @property decorators and initializers) because it can only read public fields and their corresponding types. Therefore all properties on custom elements imported from libraries are optional and wont respect meta information in @property decorators.
-   `lit-plugin` will only be able two find your elements if you somewhere in the code imports the file. Before your import the file it will complain that the element is unknown not that it can be imported. This due to the constraint that Typescript only adds library files to the array of program files once the file has been imported.

This plugin already supports [custom vscode html data format](https://code.visualstudio.com/updates/v1_31#_html-and-css-custom-data-support) (see the configuration section) and I will of course work on supporting more ways of shipping metadata alongside custom elements.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#documenting-slots-events-attributes-and-properties)

## ➤ Documenting slots, events, attributes and properties

Code is analyzed using [web-component-analyzer](https://github.com/runem/web-component-analyzer) in order to find properties, attributes and events. Unfortunately, sometimes it's not possible to analyze these things by looking at the code, and you will have to document how your component looks using `jsdoc`like this:

```js
/**
 * This is my element
 * @attr size
 * @attr {red|blue} color - The color of my element
 * @prop {String} value
 * @prop {Boolean} myProp - This is my property
 * @fires change
 * @fires my-event - This is my own event
 * @slot - This is a comment for the unnamed slot
 * @slot right - Right content
 * @slot left
 */
class MyElement extends HTMLElement { 
}

customElements.define("my-element", MyElement);
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#feature-comparison)

## ➤ Feature comparison

This plugin is similar to [vscode-lit-html](https://github.com/mjbvz/vscode-lit-html) on many points. The power of `vscode-lit-html` is that it covers all the basic functionality of HTML in tagged templates, so it's a plugin that can be easily used with other libraries than `lit-html`. However `vscode-lit-plugin` (this one) aims to be a specialized plugin for working with `lit-element / lit-html`, so for example it supports `css` and discovers web components out of the box. 

Below is a comparison table of the two plugins:

| Feature                 | [vscode-lit-html](https://github.com/mjbvz/vscode-lit-html)   | [vscode-lit-plugin](https://github.com/runem/vscode-lit-plugin) |
|-------------------------|------------|------------|
| CSS support             | ❌         | ✅         |
| Goto definition         | ❌         | ✅         |
| Check missing imports   | ❌         | ✅         |
| Auto discover web components | ❌    | ✅         |
| Template type checking  | ❌         | ✅         |
| Report unknown tag names | ❌        | ✅         |
| Report unknown attrs    | ❌         | ✅         |
| Report unknown props    | ❌         | ✅         |
| Report unknown events   | ❌         | ✅         |
| Report unknown slots    | ❌         | ✅         |
| Support for vscode custom data format | ❌| ✅    |
| Refactor tag names      | ❌         | ✅         |
| Refactor attr names     | ❌         | ❌         |
| Auto close tags         | ✅         | ✅         |
| Syntax Highlighting     | ✅         | ✅         |
| Completions             | ✅         | ✅         |
| Quick info on hover     | ✅         | ✅         |
| Code folding            | ✅         | ⚠️ (disabled until problem with calling 'program.getSourceFile' is fixed) |
| Formatting              | ✅         | ⚠️ (disabled until problem with nested templates is fixed) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#how-does-this-plugin-work)

## ➤ How does this plugin work?

All features are provided by these three libraries:

-   **[ts-lit-plugin](https://github.com/runem/lit-analyzer)**: The typescript plugin that powers the logic through the typescript language service (code completion, type checking, eg.). Therefore issues regarding anything but syntax highlighting should be opened in `ts-lit-plugin` and not `vscode-lit-plugin`.
-   **[vscode-lit-html](https://github.com/mjbvz/vscode-lit-html)**: Provides highlighting for the html template tag.
-   **[vscode-styled-components](https://github.com/styled-components/vscode-styled-components)**: Provides highlighting for the css template tag.

This library couples it all together and synchronizes relevant settings between vscode and `ts-lit-plugin`.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#contributors)

## ➤ Contributors
	

| [<img alt="Rune Mehlsen" src="https://avatars2.githubusercontent.com/u/5372940?s=460&v=4" width="100">](https://twitter.com/runemehlsen) | [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) | [<img alt="You?" src="https://joeschmoe.io/api/v1/random" width="100">](https://github.com/runem/lit-analyzer/blob/master/CONTRIBUTING.md) |
|:--------------------------------------------------:|:--------------------------------------------------:|:--------------------------------------------------:|
| [Rune Mehlsen](https://twitter.com/runemehlsen)  | [Andreas Mehlsen](https://twitter.com/andreasmehlsen) | [You?](https://github.com/runem/lit-analyzer/blob/master/CONTRIBUTING.md) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).
