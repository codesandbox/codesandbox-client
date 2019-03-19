#!/usr/bin/env node
const { resolve } = require("path")
const { readFileSync, existsSync, writeFile } = require("fs")
const { kebabCase, noop } = require("lodash")
const EOL = require("os").EOL
const BV = require("bootstrap-vue/dist/bootstrap-vue")
const cache = Object.create(null)
cache.tags = {}
cache.attributes = {}
const PropTypeMap = new Map([
  [String, { description: "String value.", type: "string" }],
  [Boolean, { description: "Boolean value.", type: "boolean" }],
  [Number, { description: "Number value.", type: "number" }],
  [Array, { description: "Array value.", type: "array" }],
  [Object, { description: "Object value.", type: "object" }],
  [Function, { description: "Function value.", type: "function" }],
  [RegExp, { description: "RegExp value.", type: "RegExp" }],
  [Date, { description: "Date value.", type: "Date" }]
])

class JsonSet extends Set {
  toJSON() {
    return Array.from(this)
  }
}

function $writeFile(path, data, options) {
  return new Promise((resolve, reject) => {
    writeFile(path, data, options, err => {
      err ? reject(err) : resolve()
    })
  })
}

function reduceTags({ tagName, metaDoc }) {
  return function reducerFn(meta, prop) {
    meta.attributes.add(kebabCase(prop))
    meta.description = metaDoc.description || `Bootstrap-Vue component: <${tagName}>`

    if (metaDoc.components) {
      metaDoc.components.map(name => meta.subtags.add(kebabCase(name)))
    }
    if (metaDoc.events) {
      metaDoc.events.map(e => meta.attributes.add(e.event))
    }

    return meta
  }
}

function reduceAttrs({ props, tagName, metaDoc }) {
  return function reducerFn(meta, prop) {
    const kebabCaseProp = kebabCase(prop)
    const entry = {}
    // Namespace component props by component.
    const nsKey = `${tagName}/${kebabCaseProp}`
    const value = props[prop].type
    if (Array.isArray(value)) {
      const types = value.map(val => {
        const v = PropTypeMap.get(val)
        if (!PropTypeMap.has(val)) {
          console.error(nsKey, v)
        } else {
          return PropTypeMap.get(val).type
        }
      })
      const type = types.join("|")
      let description = "One of "
      if (types.length == 2) {
        description += `${types[0]} or ${types[1]}.`
      } else {
        for (let i = 0; i < types.length; i++) {
          if (i < types.length - 1) {
            description += `${types[i]}, `
          } else {
            description += `or ${types[i]}.`
          }
        }
      }
      entry[nsKey] = {
        description,
        type
      }
    } else {
      entry[nsKey] = PropTypeMap.get(value)
    }

    return Object.assign({}, meta, entry)
  }
}

const Vue = (function() {
  const v = Object.create(null)
  v.directive = noop
  v.use = plugin => plugin.install(v)
  v.component = (name, def) => {
    const tagName = kebabCase(name)
    const metapath = resolve(
      require.resolve("bootstrap-vue"),
      "/docs/components/",
      tagName
        .split("-")
        .filter(s => s !== "b")
        .join("-"),
      "meta.json"
    )
    let metaDoc = {}
    if (existsSync(metapath)) {
      metaDoc = JSON.parse(readFileSync(metapath))
    }
    cache.tags[tagName] = Object.keys(def.props || {}).reduce(reduceTags({ tagName, metaDoc }), {
      attributes: new JsonSet(),
      subtags: new JsonSet(),
      description: ""
    })
    Object.assign(
      cache.attributes,
      Object.keys(def.props || {}).reduce(reduceAttrs({ tagName, props: def.props, metaDoc }), cache.attributes)
    )
  }
  return v
})()

function cacheLibMeta() {
  BV.install(Vue)
}

function main() {
  cacheLibMeta()
  for (const basename in cache) {
    $writeFile(resolve(__dirname, "..", `${basename}.json`), JSON.stringify(cache[basename], null, 2) + EOL).catch(
      console.error
    )
  }
}

main()
