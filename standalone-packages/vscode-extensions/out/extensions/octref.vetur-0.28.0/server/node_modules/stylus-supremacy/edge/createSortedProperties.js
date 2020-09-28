const _ = require('lodash')
const ordering = require('stylint/src/data/ordering.json')

module.exports = function () {
    const list = _.clone(ordering.grouped)

    function insert(/* props */) {
        const args = _.toArray(arguments)
        return {
            before: function (prop) {
                Array.prototype.splice.apply(list, [list.indexOf(prop), 0].concat(args))
            },
            after: function (prop) {
                Array.prototype.splice.apply(list, [list.indexOf(prop) + 1, 0].concat(args))
            }
        }
    }

    // https://github.com/tj/nib/blob/master/docs/README.md
    insert('fixed', 'absolute', 'relative').before('position')
    insert('clearfix').before('clear')
    insert('image').before('background')
    insert('shadow-stroke').before('text-shadow')
    insert('size').before('width')
    insert('whitespace').before('white-space')
    insert('ellipsis').before('overflow')
    insert('backface-visibility').before('opacity')
    insert('user-select').after('user-zoom')

    return _.uniq(list)
}