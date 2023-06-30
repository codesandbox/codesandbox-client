/**
 * Serialize a `bigint` to a string
 */
export default {
  type: 'BigInt',
  shouldTransform(_type: any, obj: any) {
    return typeof obj === 'bigint'
  },
  toSerializable(value: bigint) {
    return `${value}n`
  },
  fromSerializable(data: string) {
    return BigInt(data.slice(0, -1))
  },
}
