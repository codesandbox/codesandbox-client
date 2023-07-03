enum Arithmetic {
  infinity,
  minusInfinity,
  minusZero,
}

function isMinusZero(value) {
  return 1 / value === -Infinity
}

export default {
  type: 'Arithmetic',
  lookup: Number,
  shouldTransform(type: any, value: any) {
    return (
      type === 'number' &&
      (value === Infinity || value === -Infinity || isMinusZero(value))
    )
  },
  toSerializable(value): Arithmetic {
    return value === Infinity
      ? Arithmetic.infinity
      : value === -Infinity
      ? Arithmetic.minusInfinity
      : Arithmetic.minusZero
  },
  fromSerializable(data: Arithmetic) {
    if (data === Arithmetic.infinity) return Infinity
    if (data === Arithmetic.minusInfinity) return -Infinity
    if (data === Arithmetic.minusZero) return -0

    return data
  },
}
