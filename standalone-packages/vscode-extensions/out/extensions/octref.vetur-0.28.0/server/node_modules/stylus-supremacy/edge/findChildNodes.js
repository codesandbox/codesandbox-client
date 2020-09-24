const _ = require('lodash')

function findChildNodes(inputNode, condition, results = [] /* Internal */, visited = [] /* Internal */) {
	if (inputNode && visited.includes(inputNode) === false) {
		// Remember the visited nodes to prevent stack overflow
		visited.push(inputNode)

		if (condition(inputNode)) {
			results.push(inputNode)
		}

		Object.getOwnPropertyNames(inputNode).forEach(name => {
			const prop = inputNode[name]
			if (_.isArray(prop)) {
				_.forEach(prop, node => {
					findChildNodes(node, condition, results, visited)
				})
			} else if (_.isObject(prop)) {
				findChildNodes(prop, condition, results, visited)
			}
		})
	}
	return results
}

module.exports = findChildNodes