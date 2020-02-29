/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const fs = require('fs')
const path = require('path')

/*---------------------------------------------------------------------------------------------
 * Tags
 *--------------------------------------------------------------------------------------------*/

const PREFIX =
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { ITagData } from '../../htmlLanguageTypes';

export const HTML5_TAGS: ITagData[] = `

const htmlTags = require('./htmlTags.json')
const htmlTagDescriptions = require('./mdnTagDescriptions.json')

/**
 * Temporary solution to convert MD to plain text to show in hover
 * Todo@Pine: Redo this after adding Markdown support
 */
function getMarkdownToTextConverter() {
	const remark = require('remark')
	const strip = require('strip-markdown')

	const converter = remark().use(strip)

	return (md) => String(converter.processSync(md))
}

const mdToText = getMarkdownToTextConverter()

htmlTagDescriptions.forEach(tag => {
	if (tag.description) {
		tag.description = mdToText(tag.description)

		if (tag.attributes) {
			tag.attributes.forEach(attr => {
				if (attr.description) {
					attr.description = mdToText(attr.description)
				}
			})
		}
	}
})

htmlTags.forEach(t => {
	const matchingTagDescription = htmlTagDescriptions.filter(td => td.name === t.name)
		? htmlTagDescriptions.filter(td => td.name === t.name)[0]
		: null

	if (matchingTagDescription) {
		t.attributes.forEach(a => {
			const matchingAttrDescription = matchingTagDescription.attributes.filter(ad => ad.name === a.name)
				? matchingTagDescription.attributes.filter(ad => ad.name === a.name)[0]
				: null
				
			if (matchingAttrDescription) {
				a.description = matchingAttrDescription.description
			}
		})
		
		const moreAttrs = []
		matchingTagDescription.attributes.forEach(ad => {
			if (t.attributes.filter(a => a.name === ad.name).length === 0) {
				moreAttrs.push(ad)
			}
		})
		t.attributes = t.attributes.concat(moreAttrs)
	}
})

const htmlDataSrc = `${PREFIX}${JSON.stringify(htmlTags, null, 2)};`

fs.writeFileSync(path.resolve(__dirname, '../src/languageFacts/data/html5Tags.ts'), htmlDataSrc)
console.log('Done writing html5Tags.ts')

/*---------------------------------------------------------------------------------------------
 * Events
 *--------------------------------------------------------------------------------------------*/

const EVENTS_PREFIX = 
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { IAttributeData } from '../../htmlLanguageTypes';

export const HTML5_EVENTS: IAttributeData[] = `

const htmlEvents = require('./htmlEvents.json')
/**
 * Todo@Pine Clean up new HTML events and drop the old events
 */
const oldEvents = require('./oldEvents.json')

oldEvents.forEach(e => {
	const match = htmlEvents.find(x => x.name === e.name)
	if (match) {
		e.description = match.description
	}
})

const htmlEventsSrc = `${EVENTS_PREFIX}${JSON.stringify(oldEvents, null, 2)};`

fs.writeFileSync(path.resolve(__dirname, '../src/languageFacts/data/html5Events.ts'), htmlEventsSrc)
console.log('Done writing html5Events.ts')

/*---------------------------------------------------------------------------------------------
 * Aria
 *--------------------------------------------------------------------------------------------*/

const ariaData = require('./ariaData.json')
const ariaSpec = require('./ariaSpec.json')

ariaSpec.forEach(ariaItem => {
	ariaItem.description = mdToText(ariaItem.description)
})

const ariaMap = {}

ariaData.forEach(ad => {
	ariaMap[ad.name] = {
		...ad
	}
})
ariaSpec.forEach(as => {
	if (!ariaMap[as.name]) {
		ariaMap[as.name] = {
			...as
		}
	} else {
		ariaMap[as.name] = {
			...ariaMap[as.name],
			...as
		}
	}
})

const ariaOut = []
for (let a in ariaMap) {
	ariaOut.push(ariaMap[a])
}

const ARIA_PREFIX = 
`/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { IAttributeData } from '../../htmlLanguageTypes';

export const ARIA_ATTRIBUTES: IAttributeData[] = `

const ariaDataSrc = `${ARIA_PREFIX}${JSON.stringify(ariaOut, null, 2)};`

fs.writeFileSync(path.resolve(__dirname, '../src/languageFacts/data/html5Aria.ts'), ariaDataSrc)
console.log('Done writing html5Aria.ts')