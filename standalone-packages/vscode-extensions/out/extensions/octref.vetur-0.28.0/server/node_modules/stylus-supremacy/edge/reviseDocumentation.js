const fs = require('fs')
const _ = require('lodash')

const schema = require('./schema')
const createFormattingOptions = require('./createFormattingOptions')
const createFormattingOptionsFromStylint = require('./createFormattingOptionsFromStylint')
const format = require('./format')
const stylintOptions = require('stylint/src/core/config')
const createCodeForFormatting = require('./createCodeForFormatting')
const createCodeForHTML = require('./createCodeForHTML')

let document = fs.readFileSync('docs/index.html', 'utf-8')
document = updateDocument(document, '<!-- formatting toggler placeholder -->', createFormattingTogglersForDemo)
document = updateDocument(document, '<!-- formatting option placeholder -->', createFormattingDescription)
document = updateDocument(document, '<!-- stylint option placeholder -->', createStylintConversionTable)

fs.writeFileSync('docs/index.html', document)

function updateDocument(document, placeholder, worker) {
	const chunks = document.split(placeholder)
	const output = worker()
	return _.first(chunks) + placeholder + output + placeholder + _.last(chunks)
}

function createFormattingTogglersForDemo() {
	return _.chain(schema)
		.omitBy(item => item.hideInDemo === true)
		.map((item, name) => {
			if (item.type === 'boolean') {
				return (
					`<label for="demo-${name}">` +
					`<span>${name}</span>` +
					`<input id="demo-${name}" type="checkbox" ${item.default === true ? 'checked' : ''}>` +
					`</label>`
				)

			} else if (item.type === 'string') {
				return (
					`<label for="demo-${name}">` +
					`<span>${name}</span>` +
					`<input id="demo-${name}" type="text" value="${getType(item.default)}" required>` +
					`</label>`
				)

			} else if (item.type === 'integer') {
				return (
					`<label for="demo-${name}">` +
					`<span>${name}</span>` +
					`<input id="demo-${name}" type="number" ${item.minimum !== undefined ? `min="${item.minimum}"` : ''} ${item.maximum !== undefined ? `max="${item.maximum}"` : ''} value="${item.default}">` +
					`</label>`
				)

			} else if (item.enum !== undefined) {
				return (
					`<label for="demo-${name}">` +
					`<span>${name}</span>` +
					`<select id="demo-${name}" value="${getType(item.default)}">` +
					_enum(item) +
					`</select>` +
					`</label>`
				)

			} else if (item.oneOf !== undefined) {
				return (
					`<label for="demo-${name}">` +
					`<span>${name}</span>` +
					`<select id="demo-${name}" value="${getType(item.default)}">` +
					item.oneOf.map(stub => stub.enum
						? _enum(stub)
						: `<option value="${getType(stub)}" ${_.isObject(stub) ? 'disabled' : ''}>${getType(stub)}</option>`
					) +
					`</select>` +
					`</label>`
				)
			}
		})
		.join('')
		.value()

	function _enum(item) {
		return item.enum.map(stub => `<option value="${getType(stub)}">${getType(stub)}</option>`).join('')
	}
}

function createFormattingDescription() {
	const defaultOptionJSON = createCodeForHTML(JSON.stringify(_.omitBy(createFormattingOptions(), (item, name) => schema[name].deprecated), null, '  '))

	const defaultOptionHTML = (
		'<code>' +
		defaultOptionJSON
			.replace(/<br>/g, '\n')
			.replace(/^&nbsp;&nbsp;&quot;(\w+)&quot;/gm, (full, part) => full.replace(part, `<a href="#option-${_.kebabCase(part)}">stylusSupremacy.${createBreakableWords(part)}</a>`))
			.replace(/\n/g, '<br>') +
		'</code>'
	)

	const formattingOptionDescription = _.chain(schema)
		.map((item, name) => [
			`<section id="option-${_.kebabCase(name)}">`,
			`<h2 class="${item.deprecated ? 'deprecated' : ''}">`,
			item.deprecated && '<b>DEPRECATED </b>',
			`<mark>${createBreakableWords(name)}</mark>`,
			`<wbr>`,
			`<code class="default-value">${createNonBreakableForFirstWord('= ', JSON.stringify(item.default))}</code>`,
			`<wbr>`,
			`<code>${createNonBreakableForFirstWord(': ', getType(item))}</code>`,
			`</h2>`,
			item.description && item.description.split('\n').map(line => `<p>${line}</p>`).join(''),
			item.hideInVSCE ? '<p>This option is not available in the Visual Studio Code extension.</p>' : '',
			item.example && _.chunk(item.example.values, 2).map(values =>
				createResponsiveTable(
					values.map(value => JSON.stringify(value, null, '\t').replace(/(\[|\{)\n\t+/g, '[').replace(/^\t+/gm, ' ').replace(/\n/g, '')),
					values.map(value => createCodeForHTML(format(createCodeForFormatting(item.example.code), { [name]: value })))
				)
			).join('') +
			`</section>`
		])
		.flatten()
		.compact()
		.join('')
		.value()

	return defaultOptionHTML + formattingOptionDescription
}

function createStylintConversionTable() {
	const validFormattingOptionNames = _.keys(schema)

	const stylintOptionMap = _.toPairs(createFormattingOptionsFromStylint.map)
		.reduce((temp, pair) => {
			const stylintOptionName = pair[0]
			const formattingOptionNames = _.chunk(pair[1], 2)
				.map(item => item[0])
				.filter(item => validFormattingOptionNames.includes(item))

			temp[stylintOptionName] = formattingOptionNames
			return temp
		}, {})

	return '<tbody>' + _.chain([stylintOptions, stylintOptionMap]).map(_.keys).flatten().uniq().sortBy().value().map(name =>
		'<tr>' +
		'<td><mark class="alt">' + createBreakableWords(name) + '</mark></td>' +
		'<td>' + (_.some(stylintOptionMap[name])
			? (stylintOptionMap[name].map(item => '<mark>' + createBreakableWords(item) + '</mark>').join(', '))
			: 'Not applicable') +
		'</td>' +
		'</tr>'
	).join('') + '</tbody>'
}

function getType(item) {
	if (_.isObject(item)) {
		if (item.type) {
			return item.type + (item.items ? ('&lt;' + getType(item.items) + '&gt;') : '')
		} else {
			return (item.enum || item.oneOf).map(item => getType(item)).join(' | ')
		}
	} else {
		return _.escape(JSON.stringify(item))
	}
}

function createNonBreakableForFirstWord(prefix, text) {
	let pivot = text.indexOf(' ')
	if (pivot === -1) {
		pivot = text.length
	}
	return '<span class="no-break">' + prefix + text.substring(0, pivot) + '</span>' + text.substring(pivot)
}

function createBreakableWords(text) {
	const pattern = _.camelCase(text)
	if (text === pattern) {
		return _.kebabCase(text)
			.split('-')
			.map((word, rank) => rank === 0 ? word : _.upperFirst(word))
			.join('<wbr>')

	} else {
		return text
	}
}

function createResponsiveTable(head, body) {
	return (
		'<div class="table">' +
		'<div class="table-head">' +
		head.map(cell =>
			'<div>' + cell + '</div>'
		).join('') +
		'</div>' +
		'<div class="table-body">' +
		body.map(cell =>
			'<div>' + cell + '</div>'
		).join('') +
		'</div>' +
		'</div>' +
		'<div class="table responsive">' +
		head.map((nope, rank) =>
			'<div class="table-head">' + '<div>' + head[rank] + '</div>' + '</div>' +
			'<div class="table-body">' + '<div>' + body[rank] + '</div>' + '</div>'
		).join('') +
		'</div>'
	)
}
