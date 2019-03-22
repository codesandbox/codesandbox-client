function createStringBuffer() {
	return {
		buffer: [],

		append(text) {
			if (arguments.length > 1) {
				throw new Error('Found too many arguments of', Array.prototype.slice.call(arguments))

			} else if (typeof text === 'object' && text !== null) {
				throw new Error('Found a non-string argument of', text)

			} else if (text !== '') {
				this.buffer.push(text)
			}

			return this
		},

		remove(text) {
			if (text === undefined) {
				this.buffer.pop()

			} else if (this.buffer.length > 0) {
				const last = this.buffer[this.buffer.length - 1]
				if (last === text) {
					this.buffer.pop()

				} else if (last.endsWith(text)) {
					this.buffer[this.buffer.length - 1] = last.substring(0, last.length - text.length)
				}
			}

			return this
		},

		toString() {
			return this.buffer.join('')
		}
	}
}

module.exports = createStringBuffer