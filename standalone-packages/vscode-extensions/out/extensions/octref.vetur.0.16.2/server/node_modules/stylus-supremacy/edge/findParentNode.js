function findParentNode(inputNode, condition) {
	const workingNode = inputNode && inputNode.parent
	if (!workingNode) {
		return null

	} else if (condition(workingNode)) {
		return workingNode

	} else {
		return findParentNode(workingNode, condition)
	}
}

module.exports = findParentNode