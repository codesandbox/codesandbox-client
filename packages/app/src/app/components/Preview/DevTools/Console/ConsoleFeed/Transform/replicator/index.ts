// Const
const TRANSFORMED_TYPE_KEY = '@t'
const CIRCULAR_REF_KEY = '@r'
const KEY_REQUIRE_ESCAPING_RE = /^#*@(t|r)$/

const REMAINING_KEY = '__console_feed_remaining__'

const GLOBAL = (function getGlobal() {
  // NOTE: see http://www.ecma-international.org/ecma-262/6.0/index.html#sec-performeval step 10
  const savedEval = eval

  return savedEval('this')
})()

const ARRAY_BUFFER_SUPPORTED = typeof ArrayBuffer === 'function'
const MAP_SUPPORTED = typeof Map === 'function'
const SET_SUPPORTED = typeof Set === 'function'

const TYPED_ARRAY_CTORS = [
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
]

// Saved proto functions
const arrSlice = Array.prototype.slice

// Default serializer
const JSONSerializer = {
  serialize(val: any) {
    return JSON.stringify(val)
  },

  deserialize(val: any) {
    return JSON.parse(val)
  },
}

// EncodingTransformer
class EncodingTransformer {
  references: any
  transforms: any
  transformsMap: any
  circularCandidates: any
  circularCandidatesDescrs: any
  circularRefCount: any
  limit: number

  constructor(val: any, transforms: any, limit?: number) {
    this.references = val
    this.transforms = transforms
    this.transformsMap = this._makeTransformsMap()
    this.circularCandidates = []
    this.circularCandidatesDescrs = []
    this.circularRefCount = 0
    this.limit = limit ?? Infinity
  }

  static _createRefMark(idx: any) {
    const obj = Object.create(null)

    obj[CIRCULAR_REF_KEY] = idx

    return obj
  }

  _createCircularCandidate(val: any, parent: any, key: any) {
    this.circularCandidates.push(val)
    this.circularCandidatesDescrs.push({ parent, key, refIdx: -1 })
  }

  _applyTransform(val: any, parent: any, key: any, transform: any) {
    const result = Object.create(null)
    const serializableVal = transform.toSerializable(val)

    if (typeof serializableVal === 'object')
      this._createCircularCandidate(val, parent, key)

    result[TRANSFORMED_TYPE_KEY] = transform.type
    result.data = this._handleValue(() => serializableVal, parent, key)

    return result
  }

  _handleArray(arr: any): any {
    const result = [] as any
    const arrayLimit = Math.min(arr.length, this.limit)
    const remaining = arr.length - arrayLimit

    for (let i = 0; i < arrayLimit; i++)
      result[i] = this._handleValue(() => arr[i], result, i)

    result[arrayLimit] = REMAINING_KEY + remaining

    return result
  }

  _handlePlainObject(obj: any) {
    const result = Object.create(null)
    let counter = 0
    let total = 0
    for (const key in obj) {
      if (Reflect.has(obj, key)) {
        if (counter >= this.limit) {
          total++
          continue
        }
        const resultKey = KEY_REQUIRE_ESCAPING_RE.test(key) ? `#${key}` : key

        result[resultKey] = this._handleValue(() => obj[key], result, resultKey)
        counter++
        total++
      }
    }

    const remaining = total - counter

    const name = obj?.__proto__?.constructor?.name
    if (name && name !== 'Object') {
      result.constructor = { name }
    }

    if (remaining) {
      result[REMAINING_KEY] = remaining
    }

    return result
  }

  _handleObject(obj: any, parent: any, key: any) {
    this._createCircularCandidate(obj, parent, key)

    return Array.isArray(obj)
      ? this._handleArray(obj)
      : this._handlePlainObject(obj)
  }

  _ensureCircularReference(obj: any) {
    const circularCandidateIdx = this.circularCandidates.indexOf(obj)

    if (circularCandidateIdx > -1) {
      const descr = this.circularCandidatesDescrs[circularCandidateIdx]

      if (descr.refIdx === -1)
        descr.refIdx = descr.parent ? ++this.circularRefCount : 0

      return EncodingTransformer._createRefMark(descr.refIdx)
    }

    return null
  }

  _handleValue(getVal: () => any, parent: any, key: any) {
    try {
      const val = getVal()
      const type = typeof val
      const isObject = type === 'object' && val !== null

      if (isObject) {
        const refMark = this._ensureCircularReference(val)

        if (refMark) return refMark
      }

      const transform = this._findTransform(type, val)

      if (transform) {
        return this._applyTransform(val, parent, key, transform)
      }

      if (isObject) return this._handleObject(val, parent, key)

      return val
    } catch (e) {
      try {
        return this._handleValue(
          () => (e instanceof Error ? e : new Error(e)),
          parent,
          key
        )
      } catch {
        return null
      }
    }
  }

  _makeTransformsMap() {
    if (!MAP_SUPPORTED) {
      return
    }

    const map = new Map()
    this.transforms.forEach((transform) => {
      if (transform.lookup) {
        map.set(transform.lookup, transform)
      }
    })
    return map
  }

  _findTransform(type: string, val: any) {
    if (MAP_SUPPORTED) {
      if (val && val.constructor) {
        const transform = this.transformsMap.get(val.constructor)

        if (transform?.shouldTransform(type, val)) return transform
      }
    }

    for (const transform of this.transforms) {
      if (transform.shouldTransform(type, val)) return transform
    }
  }

  transform() {
    const references = [this._handleValue(() => this.references, null, null)]

    for (const descr of this.circularCandidatesDescrs) {
      if (descr.refIdx > 0) {
        references[descr.refIdx] = descr.parent[descr.key]
        descr.parent[descr.key] = EncodingTransformer._createRefMark(
          descr.refIdx
        )
      }
    }

    return references
  }
}

// DecodingTransform
class DecodingTransformer {
  references: any
  transformMap: any
  activeTransformsStack = [] as any
  visitedRefs = Object.create(null)

  constructor(references: any, transformsMap: any) {
    this.references = references
    this.transformMap = transformsMap
  }

  _handlePlainObject(obj: any) {
    const unescaped = Object.create(null)

    if ('constructor' in obj) {
      if (!obj.constructor || typeof obj.constructor.name !== 'string') {
        obj.constructor = {
          name: 'Object',
        }
      }
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        this._handleValue(obj[key], obj, key)

        if (KEY_REQUIRE_ESCAPING_RE.test(key)) {
          // NOTE: use intermediate object to avoid unescaped and escaped keys interference
          // E.g. unescaped "##@t" will be "#@t" which can overwrite escaped "#@t".
          unescaped[key.substring(1)] = obj[key]
          delete obj[key]
        }
      }
    }

    for (const unsecapedKey in unescaped)
      obj[unsecapedKey] = unescaped[unsecapedKey]
  }

  _handleTransformedObject(obj: any, parent: any, key: any) {
    const transformType = obj[TRANSFORMED_TYPE_KEY]
    const transform = this.transformMap[transformType]

    if (!transform)
      throw new Error(`Can't find transform for "${transformType}" type.`)

    this.activeTransformsStack.push(obj)
    this._handleValue(obj.data, obj, 'data')
    this.activeTransformsStack.pop()

    parent[key] = transform.fromSerializable(obj.data)
  }

  _handleCircularSelfRefDuringTransform(refIdx: any, parent: any, key: any) {
    // NOTE: we've hit a hard case: object reference itself during transformation.
    // We can't dereference it since we don't have resulting object yet. And we'll
    // not be able to restore reference lately because we will need to traverse
    // transformed object again and reference might be unreachable or new object contain
    // new circular references. As a workaround we create getter, so once transformation
    // complete, dereferenced property will point to correct transformed object.
    const references = this.references

    Object.defineProperty(parent, key, {
      // @ts-ignore
      val: void 0,
      configurable: true,
      enumerable: true,

      get() {
        if (this.val === void 0) this.val = references[refIdx]

        return (<any>this).val
      },

      set(value) {
        this.val = value
      },
    })
  }

  _handleCircularRef(refIdx: any, parent: any, key: any) {
    if (this.activeTransformsStack.includes(this.references[refIdx]))
      this._handleCircularSelfRefDuringTransform(refIdx, parent, key)
    else {
      if (!this.visitedRefs[refIdx]) {
        this.visitedRefs[refIdx] = true
        this._handleValue(this.references[refIdx], this.references, refIdx)
      }

      parent[key] = this.references[refIdx]
    }
  }

  _handleValue(val: any, parent: any, key: any) {
    if (typeof val !== 'object' || val === null) return

    const refIdx = val[CIRCULAR_REF_KEY]

    if (refIdx !== void 0) this._handleCircularRef(refIdx, parent, key)
    else if (val[TRANSFORMED_TYPE_KEY])
      this._handleTransformedObject(val, parent, key)
    else if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) this._handleValue(val[i], val, i)
    } else this._handlePlainObject(val)
  }

  transform() {
    this.visitedRefs[0] = true
    this._handleValue(this.references[0], this.references, 0)

    return this.references[0]
  }
}

// Transforms
const builtInTransforms = [
  {
    type: '[[NaN]]',

    shouldTransform(type: any, val: any) {
      return type === 'number' && isNaN(val)
    },

    toSerializable() {
      return ''
    },

    fromSerializable() {
      return NaN
    },
  },

  {
    type: '[[undefined]]',

    shouldTransform(type: any) {
      return type === 'undefined'
    },

    toSerializable() {
      return ''
    },

    fromSerializable() {
      return void 0
    },
  },
  {
    type: '[[Date]]',

    lookup: Date,

    shouldTransform(type: any, val: any) {
      return val instanceof Date
    },

    toSerializable(date: any) {
      return date.getTime()
    },

    fromSerializable(val: any) {
      const date = new Date()

      date.setTime(val)
      return date
    },
  },
  {
    type: '[[RegExp]]',

    lookup: RegExp,

    shouldTransform(type: any, val: any) {
      return val instanceof RegExp
    },

    toSerializable(re: any) {
      const result = {
        src: re.source,
        flags: '',
      }

      if (re.global) result.flags += 'g'

      if (re.ignoreCase) result.flags += 'i'

      if (re.multiline) result.flags += 'm'

      return result
    },

    fromSerializable(val: any) {
      return new RegExp(val.src, val.flags)
    },
  },

  {
    type: '[[Error]]',

    lookup: Error,

    shouldTransform(type: any, val: any) {
      return val instanceof Error
    },

    toSerializable(err: any) {
      if (!err.stack) {
        ;(Error as any).captureStackTrace?.(err)
      }

      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
      }
    },

    fromSerializable(val: any) {
      const Ctor = GLOBAL[val.name] || Error
      const err = new Ctor(val.message)

      err.stack = val.stack
      return err
    },
  },

  {
    type: '[[ArrayBuffer]]',

    lookup: ARRAY_BUFFER_SUPPORTED && ArrayBuffer,

    shouldTransform(type: any, val: any) {
      return ARRAY_BUFFER_SUPPORTED && val instanceof ArrayBuffer
    },

    toSerializable(buffer: any) {
      const view = new Int8Array(buffer)

      return arrSlice.call(view)
    },

    fromSerializable(val: any) {
      if (ARRAY_BUFFER_SUPPORTED) {
        const buffer = new ArrayBuffer(val.length)
        const view = new Int8Array(buffer)

        view.set(val)

        return buffer
      }

      return val
    },
  },

  {
    type: '[[TypedArray]]',

    shouldTransform(type: any, val: any) {
      if (ARRAY_BUFFER_SUPPORTED) {
        return ArrayBuffer.isView(val) && !(val instanceof DataView)
      }

      for (const ctorName of TYPED_ARRAY_CTORS) {
        if (
          typeof GLOBAL[ctorName] === 'function' &&
          val instanceof GLOBAL[ctorName]
        )
          return true
      }

      return false
    },

    toSerializable(arr: any) {
      return {
        ctorName: arr.constructor.name,
        arr: arrSlice.call(arr),
      }
    },

    fromSerializable(val: any) {
      return typeof GLOBAL[val.ctorName] === 'function'
        ? new GLOBAL[val.ctorName](val.arr)
        : val.arr
    },
  },

  {
    type: '[[Map]]',

    lookup: MAP_SUPPORTED && Map,

    shouldTransform(type: any, val: any) {
      return MAP_SUPPORTED && val instanceof Map
    },

    toSerializable(map: any) {
      const flattenedKVArr: any = []

      map.forEach((val: any, key: any) => {
        flattenedKVArr.push(key)
        flattenedKVArr.push(val)
      })

      return flattenedKVArr
    },

    fromSerializable(val: any) {
      if (MAP_SUPPORTED) {
        // NOTE: new Map(iterable) is not supported by all browsers
        const map = new Map()

        for (var i = 0; i < val.length; i += 2) map.set(val[i], val[i + 1])

        return map
      }

      const kvArr = []

      // @ts-ignore
      for (let j = 0; j < val.length; j += 2) kvArr.push([val[i], val[i + 1]])

      return kvArr
    },
  },

  {
    type: '[[Set]]',

    lookup: SET_SUPPORTED && Set,

    shouldTransform(type: any, val: any) {
      return SET_SUPPORTED && val instanceof Set
    },

    toSerializable(set: any) {
      const arr: any = []

      set.forEach((val: any) => {
        arr.push(val)
      })

      return arr
    },

    fromSerializable(val: any) {
      if (SET_SUPPORTED) {
        // NOTE: new Set(iterable) is not supported by all browsers
        const set = new Set()

        for (let i = 0; i < val.length; i++) set.add(val[i])

        return set
      }

      return val
    },
  },
]

// Replicator
class Replicator {
  transforms = [] as any
  transformsMap = Object.create(null)
  serializer: any

  constructor(serializer?: any) {
    this.serializer = serializer || JSONSerializer

    this.addTransforms(builtInTransforms)
  }

  addTransforms(transforms: any) {
    transforms = Array.isArray(transforms) ? transforms : [transforms]

    for (const transform of transforms) {
      if (this.transformsMap[transform.type])
        throw new Error(
          `Transform with type "${transform.type}" was already added.`
        )

      this.transforms.push(transform)
      this.transformsMap[transform.type] = transform
    }

    return this
  }

  removeTransforms(transforms: any) {
    transforms = Array.isArray(transforms) ? transforms : [transforms]

    for (const transform of transforms) {
      const idx = this.transforms.indexOf(transform)

      if (idx > -1) this.transforms.splice(idx, 1)

      delete this.transformsMap[transform.type]
    }

    return this
  }

  encode(val: any, limit?: number) {
    const transformer = new EncodingTransformer(val, this.transforms, limit)
    const references = transformer.transform()

    return this.serializer.serialize(references)
  }

  decode(val: any) {
    const references = this.serializer.deserialize(val)
    const transformer = new DecodingTransformer(references, this.transformsMap)

    return transformer.transform()
  }
}

export default Replicator
