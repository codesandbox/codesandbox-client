"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IEntry {
}
exports.IEntry = IEntry;
// From https://msdn.microsoft.com/en-us/library/windows/desktop/ff471376(v=vs.85).aspx
exports.intrinsicfunctions = {
    abort: {
        description: "Submits an error message to the information queue and terminates the current draw or dispatch call being executed.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff728669(v=vs.85).aspx"
    },
    abs: {
        description: "Returns the absolute value of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509562(v=vs.85).aspx"
    },
    acos: {
        description: "Returns the arccosine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value. Each component should be a floating-point value within the range of -1 to 1." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509563(v=vs.85).aspx"
    },
    all: {
        description: "Determines if all components of the specified value are non-zero.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509564(v=vs.85).aspx"
    },
    AllMemoryBarrier: {
        description: "Blocks execution of all threads in a group until all memory accesses have been completed.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471350(v=vs.85).aspx"
    },
    AllMemoryBarrierWithGroupSync: {
        description: "Blocks execution of all threads in a group until all memory accesses have been completed and all threads in the group have reached this call.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471351(v=vs.85).aspx"
    },
    any: {
        description: "Determines if any components of the specified value are non-zero.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509565(v=vs.85).aspx"
    },
    asdouble: {
        description: "Reinterprets a cast value (two 32-bit values) into a double.",
        parameters: [
            { label: 'lowbits', documentation: "The low 32-bit pattern of the input value." },
            { label: 'highbits', documentation: "The high 32-bit pattern of the input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607357(v=vs.85).aspx"
    },
    asfloat: {
        description: "Interprets the bit pattern of the input value as a floating-point number.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509570(v=vs.85).aspx"
    },
    asin: {
        description: "Returns the arcsine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509571(v=vs.85).aspx"
    },
    asint: {
        description: "Interprets the bit pattern of the input value as an integer.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471353(v=vs.85).aspx"
    },
    asuint: {
        description: "Reinterprets the bit pattern of a 64-bit value as two unsigned 32-bit integers.",
        parameters: [
            { label: 'value', documentation: "The input value." },
            { label: 'lowbits', documentation: "The low 32-bit pattern of the input value." },
            { label: 'highbits', documentation: "The high 32-bit pattern of the input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471354(v=vs.85).aspx"
    },
    // asuint: {
    //     description: "Interprets the bit pattern of the input value as an unsigned integer.",
    //     parameters: [
    //         { label: 'value', documentation: "The input value." }
    //     ],
    //     link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509573(v=vs.85).aspx"
    // },
    atan: {
        description: "Returns the arctangent of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509574(v=vs.85).aspx"
    },
    atan2: {
        description: "Returns the arctangent of two values (x,y).",
        parameters: [
            { label: 'y', documentation: "The y value." },
            { label: 'x', documentation: "The x value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509575(v=vs.85).aspx"
    },
    ceil: {
        description: "Returns the smallest integer value that is greater than or equal to the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509577(v=vs.85).aspx"
    },
    CheckAccessFullyMapped: {
        description: "Determines whether all values from a Sample, Gather, or Load operation accessed mapped tiles in a tiled resource.",
        parameters: [
            { label: 'status', documentation: "The status value that is returned from a Sample, Gather, or Load operation. Because you can't access this status value directly, you need to pass it to CheckAccessFullyMapped." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dn292083(v=vs.85).aspx"
    },
    clamp: {
        description: "Clamps the specified value to the specified minimum and maximum range.",
        parameters: [
            { label: 'value', documentation: "A value to clamp." },
            { label: 'min', documentation: "The specified minimum range." },
            { label: 'max', documentation: "The specified maximum range." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb204824(v=vs.85).aspx"
    },
    clip: {
        description: "Discards the current pixel if the specified value is less than zero.",
        parameters: [
            { label: 'value', documentation: "The specified value" }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb204826(v=vs.85).aspx"
    },
    cos: {
        description: "Returns the cosine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509583(v=vs.85).aspx"
    },
    cosh: {
        description: "Returns the hyperbolic cosine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509584(v=vs.85).aspx"
    },
    countbits: {
        description: "Counts the number of bits (per component) in the input integer.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471355(v=vs.85).aspx"
    },
    cross: {
        description: "Returns the cross product of two floating-point, 3D vectors.",
        parameters: [
            { label: 'x', documentation: "The first floating-point, 3D vector." },
            { label: 'y', documentation: "The second floating-point, 3D vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509585(v=vs.85).aspx"
    },
    D3DCOLORtoUBYTE4: {
        description: "Converts a floating-point, 4D vector set by a D3DCOLOR to a UBYTE4.",
        parameters: [
            { label: 'value', documentation: "The floating-point vector4 to convert." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509586(v=vs.85).aspx"
    },
    ddx: {
        description: "Returns the partial derivative of the specified value with respect to the screen-space x-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509588(v=vs.85).aspx"
    },
    ddx_coarse: {
        description: "Computes a low precision partial derivative with respect to the screen-space x-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471361(v=vs.85).aspx"
    },
    ddx_fine: {
        description: "Computes a high precision partial derivative with respect to the screen-space x-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471362(v=vs.85).aspx"
    },
    ddy: {
        description: "Returns the partial derivative of the specified value with respect to the screen-space y-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509589(v=vs.85).aspx"
    },
    ddy_coarse: {
        description: "Computes a low precision partial derivative with respect to the screen-space y-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471364(v=vs.85).aspx"
    },
    ddy_fine: {
        description: "Computes a high precision partial derivative with respect to the screen-space y-coordinate.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471365(v=vs.85).aspx"
    },
    degrees: {
        description: "Converts the specified value from radians to degrees.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509590(v=vs.85).aspx"
    },
    determinant: {
        description: "Returns the determinant of the specified floating-point, square matrix.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509591(v=vs.85).aspx"
    },
    DeviceMemoryBarrier: {
        description: "Blocks execution of all threads in a group until all device memory accesses have been completed.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471366(v=vs.85).aspx"
    },
    DeviceMemoryBarrierWithGroupSync: {
        description: "Blocks execution of all threads in a group until all device memory accesses have been completed and all threads in the group have reached this call.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471367(v=vs.85).aspx"
    },
    distance: {
        description: "Returns a distance scalar between two vectors.",
        parameters: [
            { label: 'x', documentation: "The first floating-point vector to compare." },
            { label: 'y', documentation: "The second floating-point vector to compare." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509592(v=vs.85).aspx"
    },
    dot: {
        description: "Returns the dot product of two vectors.",
        parameters: [
            { label: 'x', documentation: "The first vector." },
            { label: 'y', documentation: "The second vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509594(v=vs.85).aspx"
    },
    dst: {
        description: "Calculates a distance vector.",
        parameters: [
            { label: 'x', documentation: "The first vector." },
            { label: 'y', documentation: "The second vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471368(v=vs.85).aspx"
    },
    errorf: {
        description: "Submits an error message to the information queue.",
        parameters: [
            { label: 'format', documentation: "The format string." },
            { label: 'argument ...', documentation: "Optional arguments." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff728750(v=vs.85).aspx"
    },
    EvaluateAttributeAtCentroid: {
        description: "Evaluates at the pixel centroid.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471394(v=vs.85).aspx"
    },
    EvaluateAttributeAtSample: {
        description: "Evaluates at the indexed sample location.",
        parameters: [
            { label: 'value', documentation: "The input value." },
            { label: 'sampleIndex', documentation: "The sample location." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471395(v=vs.85).aspx"
    },
    EvaluateAttributeSnapped: {
        description: "Evaluates at the pixel centroid with an offset.",
        parameters: [
            { label: 'value', documentation: "The input value." },
            { label: 'offset', documentation: "A 2D offset from the pixel center using a 16x16 grid." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471396(v=vs.85).aspx"
    },
    exp: {
        description: "Returns the base-e exponential, or e^x, of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509595(v=vs.85).aspx"
    },
    exp2: {
        description: "Returns the base 2 exponential, or 2^x, of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509596(v=vs.85).aspx"
    },
    f16tof32: {
        description: "Converts the float16 stored in the low-half of the uint to a float.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471397(v=vs.85).aspx"
    },
    f32tof16: {
        description: "Converts an input into a float16 type.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471399(v=vs.85).aspx"
    },
    faceforward: {
        description: "Flips the surface-normal (if needed) to face in a direction opposite to i; returns the result in n.",
        parameters: [
            { label: 'n', documentation: "The resulting floating-point surface-normal vector." },
            { label: 'i', documentation: "A floating-point, incident vector that points from the view position to the shading position." },
            { label: 'ng', documentation: "A floating-point surface-normal vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509598(v=vs.85).aspx"
    },
    firstbithigh: {
        description: "Gets the location of the first set bit starting from the highest order bit and working downward, per component.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471400(v=vs.85).aspx"
    },
    firstbitlow: {
        description: "Returns the location of the first set bit starting from the lowest order bit and working upward, per component.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471401(v=vs.85).aspx"
    },
    floor: {
        description: "Returns the largest integer that is less than or equal to the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509599(v=vs.85).aspx"
    },
    fma: {
        description: "Returns the double-precision fused multiply-addition of a * b + c.",
        parameters: [
            { label: 'a', documentation: "The first value in the fused multiply-addition." },
            { label: 'b', documentation: "The second value in the fused multiply-addition." },
            { label: 'c', documentation: "The third value in the fused multiply-addition." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/hh768893(v=vs.85).aspx"
    },
    fmod: {
        description: "Returns the floating-point remainder of x/y.",
        parameters: [
            { label: 'x', documentation: "The floating-point dividend." },
            { label: 'y', documentation: "The floating-point divisor." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509601(v=vs.85).aspx"
    },
    frac: {
        description: "Returns the fractional (or decimal) part of x; which is greater than or equal to 0 and less than 1.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509603(v=vs.85).aspx"
    },
    frexp: {
        description: "Returns the mantissa and exponent of the specified floating-point value.",
        parameters: [
            { label: 'x', documentation: "The specified floating-point value. If the x parameter is 0, this function returns 0 for both the mantissa and the exponent." },
            { label: 'exp', documentation: "The returned exponent of the x parameter." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509604(v=vs.85).aspx"
    },
    fwidth: {
        description: "Returns the absolute value of the partial derivatives of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509608(v=vs.85).aspx"
    },
    GetRenderTargetSampleCount: {
        description: "Gets the number of samples for a render target.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb943996(v=vs.85).aspx"
    },
    GetRenderTargetSamplePosition: {
        description: "Gets the sampling position (x,y) for a given sample index.",
        parameters: [
            { label: 'index', documentation: "A zero-based sample index." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb943997(v=vs.85).aspx"
    },
    GroupMemoryBarrier: {
        description: "Blocks execution of all threads in a group until all group shared accesses have been completed.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471403(v=vs.85).aspx"
    },
    GroupMemoryBarrierWithGroupSync: {
        description: "Blocks execution of all threads in a group until all group shared accesses have been completed and all threads in the group have reached this call.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471404(v=vs.85).aspx"
    },
    InterlockedAdd: {
        description: "Performs a guaranteed atomic add of value to the dest resource variable.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471406(v=vs.85).aspx"
    },
    InterlockedAnd: {
        description: "Performs a guaranteed atomic and.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471407(v=vs.85).aspx"
    },
    InterlockedCompareExchange: {
        description: "Atomically compares the destination with the comparison value. If they are identical, the destination is overwritten with the input value. The original value is set to the destination's original value.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'compareValue', documentation: "The comparison value." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "The original value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471409(v=vs.85).aspx"
    },
    InterlockedCompareStore: {
        description: "Atomically compares the destination to the comparison value. If they are identical, the destination is overwritten with the input value.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'compareValue', documentation: "The comparison value." },
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471410(v=vs.85).aspx"
    },
    InterlockedExchange: {
        description: "Assigns value to dest and returns the original value.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471411(v=vs.85).aspx"
    },
    InterlockedMax: {
        description: "Performs a guaranteed atomic max.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471412(v=vs.85).aspx"
    },
    InterlockedMin: {
        description: "Performs a guaranteed atomic min.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471413(v=vs.85).aspx"
    },
    InterlockedOr: {
        description: "Performs a guaranteed atomic or.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471414(v=vs.85).aspx"
    },
    InterlockedXor: {
        description: "Performs a guaranteed atomic xor.",
        parameters: [
            { label: 'dest', documentation: "The destination address." },
            { label: 'value', documentation: "The input value." },
            { label: 'originalValue', documentation: "Optional. The original input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471415(v=vs.85).aspx"
    },
    isfinite: {
        description: "Determines if the specified floating-point value is finite.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509612(v=vs.85).aspx"
    },
    isinf: {
        description: "Determines if the specified value is infinite.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509613(v=vs.85).aspx"
    },
    isnan: {
        description: "Determines if the specified value is NAN or QNAN.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509614(v=vs.85).aspx"
    },
    ldexp: {
        description: "Determines if the specified value is NAN or QNAN.",
        parameters: [
            { label: 'value', documentation: "The specified value." },
            { label: 'exp', documentation: "The specified exponent." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509616(v=vs.85).aspx"
    },
    length: {
        description: "Returns the length of the specified floating-point vector.",
        parameters: [
            { label: 'value', documentation: "The specified floating-point vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509617(v=vs.85).aspx"
    },
    lerp: {
        description: "Performs a linear interpolation.",
        parameters: [
            { label: 'x', documentation: "The first floating-point value." },
            { label: 'y', documentation: "The second floating-point value." },
            { label: 's', documentation: "A value that linearly interpolates between the x parameter and the y parameter." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509618(v=vs.85).aspx"
    },
    lit: {
        description: "Returns a lighting coefficient vector.",
        parameters: [
            { label: 'nDotL', documentation: "The dot product of the normalized surface normal and the light vector." },
            { label: 'nDotH', documentation: "The dot product of the half-angle vector and the surface normal." },
            { label: 'm', documentation: "A specular exponent." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509619(v=vs.85).aspx"
    },
    log: {
        description: "Returns the base-e logarithm of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509620(v=vs.85).aspx"
    },
    log10: {
        description: "Returns the base-10 logarithm of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509621(v=vs.85).aspx"
    },
    log2: {
        description: "Returns the base-2 logarithm of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509622(v=vs.85).aspx"
    },
    mad: {
        description: "Performs an arithmetic multiply/add operation on three values. Returns the result of x * y + a.",
        parameters: [
            { label: 'x', documentation: "The first multiplication value." },
            { label: 'y', documentation: "The second multiplication value." },
            { label: 'a', documentation: "The addition value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471418(v=vs.85).aspx"
    },
    max: {
        description: "Selects the greater of x and y.",
        parameters: [
            { label: 'x', documentation: "The x input value." },
            { label: 'y', documentation: "The y input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509624(v=vs.85).aspx"
    },
    min: {
        description: "Selects the lesser of x and y.",
        parameters: [
            { label: 'x', documentation: "The x input value." },
            { label: 'y', documentation: "The y input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509625(v=vs.85).aspx"
    },
    modf: {
        description: "Splits the value x into fractional and integer parts, each of which has the same sign as x.",
        parameters: [
            { label: 'x', documentation: "The x input value." },
            { label: 'ip', documentation: "The integer portion of x." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509627(v=vs.85).aspx"
    },
    msad4: {
        description: "Compares a 4-byte reference value and an 8-byte source value and accumulates a vector of 4 sums. Each sum corresponds to the masked sum of absolute differences of a different byte alignment between the reference value and the source value.",
        parameters: [
            { label: 'reference', documentation: "The reference array of 4 bytes in one uint value." },
            { label: 'source', documentation: "The source array of 8 bytes in two uint2 values." },
            { label: 'accum', documentation: "A vector of 4 values. msad4 adds this vector to the masked sum of absolute differences of the different byte alignments between the reference value and the source value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/hh768927(v=vs.85).aspx"
    },
    mul: {
        description: "Multiplies x and y using matrix math. The inner dimension x-columns and y-rows must be equal.",
        parameters: [
            { label: 'x', documentation: "The x input value. If x is a vector, it treated as a row vector." },
            { label: 'y', documentation: "The y input value. If y is a vector, it treated as a column vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509628(v=vs.85).aspx"
    },
    noise: {
        description: "Generates a random value using the Perlin-noise algorithm.",
        parameters: [
            { label: 'value', documentation: "A floating-point vector from which to generate Perlin noise." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509629(v=vs.85).aspx"
    },
    normalize: {
        description: "Normalizes the specified floating-point vector according to x / length(x).",
        parameters: [
            { label: 'value', documentation: "The specified floating-point vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509630(v=vs.85).aspx"
    },
    pow: {
        description: "Returns the specified value raised to the specified power.",
        parameters: [
            { label: 'x', documentation: "The specified value." },
            { label: 'y', documentation: "The specified power." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509636(v=vs.85).aspx"
    },
    printf: {
        description: "Submits a custom shader message to the information queue.",
        parameters: [
            { label: 'format', documentation: "The format string." },
            { label: 'argument ...', documentation: "Optional arguments." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff728755(v=vs.85).aspx"
    },
    Process2DQuadTessFactorsAvg: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471426(v=vs.85).aspx"
    },
    Process2DQuadTessFactorsMax: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471427(v=vs.85).aspx"
    },
    Process2DQuadTessFactorsMin: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471428(v=vs.85).aspx"
    },
    ProcessIsolineTessFactors: {
        description: "Generates the rounded tessellation factors for an isoline.",
        parameters: [
            { label: 'RawDetailFactor', documentation: "The desired detail factor." },
            { label: 'RawDensityFactor', documentation: "The desired density factor." },
            { label: 'RoundedDetailFactor', documentation: "The rounded detail factor clamped to a range that can be used by the tessellator." },
            { label: 'RoundedDensityFactor', documentation: "The rounded density factor clamped to a rangethat can be used by the tessellator." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471428(v=vs.85).aspx"
    },
    ProcessQuadTessFactorsAvg: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471430(v=vs.85).aspx"
    },
    ProcessQuadTessFactorsMax: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471431(v=vs.85).aspx"
    },
    ProcessQuadTessFactorsMin: {
        description: "Generates the corrected tessellation factors for a quad patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471432(v=vs.85).aspx"
    },
    ProcessTriTessFactorsAvg: {
        description: "Generates the corrected tessellation factors for a tri patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471433(v=vs.85).aspx"
    },
    ProcessTriTessFactorsMax: {
        description: "Generates the corrected tessellation factors for a tri patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471434(v=vs.85).aspx"
    },
    ProcessTriTessFactorsMin: {
        description: "Generates the corrected tessellation factors for a tri patch.",
        parameters: [
            { label: 'RawEdgeFactors', documentation: "The edge tessellation factors, passed into the tessellator stage." },
            { label: 'InsideScale', documentation: "The scale factor applied to the UV tessellation factors computed by the tessellation stage. The allowable range for InsideScale is 0.0 to 1.0." },
            { label: 'RoundedEdgeTessFactors', documentation: "The rounded edge-tessellation factors calculated by the tessellator stage." },
            { label: 'RoundedInsideTessFactors', documentation: "The rounded tessellation factors calculated by the tessellator stage for inside edges." },
            { label: 'UnroundedInsideTessFactors', documentation: "The tessellation factors calculated by the tessellator stage for inside edges." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471435(v=vs.85).aspx"
    },
    radians: {
        description: "Converts the specified value from degrees to radians.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509637(v=vs.85).aspx"
    },
    rcp: {
        description: "Calculates a fast, approximate, per-component reciprocal.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471436(v=vs.85).aspx"
    },
    reflect: {
        description: "Returns a reflection vector using an incident ray and a surface normal.",
        parameters: [
            { label: 'i', documentation: "A floating-point, incident vector." },
            { label: 'n', documentation: "A floating-point, normal vector." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509639(v=vs.85).aspx"
    },
    refract: {
        description: "Returns a refraction vector using an entering ray, a surface normal, and a refraction index.",
        parameters: [
            { label: 'i', documentation: "A floating-point, ray direction vector." },
            { label: 'n', documentation: "A floating-point, surface normal vector." },
            { label: 'η', documentation: "A floating-point, refraction index scalar." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509640(v=vs.85).aspx"
    },
    reversebits: {
        description: "Reverses the order of the bits, per component.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471437(v=vs.85).aspx"
    },
    round: {
        description: "Rounds the specified value to the nearest integer.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509642(v=vs.85).aspx"
    },
    rsqrt: {
        description: "Returns the reciprocal of the square root of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509643(v=vs.85).aspx"
    },
    saturate: {
        description: "Clamps the specified value within the range of 0 to 1.",
        parameters: [
            { label: 'value', documentation: "The specified value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509645(v=vs.85).aspx"
    },
    sign: {
        description: "Returns the sign of x.",
        parameters: [
            { label: 'value', documentation: "The input value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509649(v=vs.85).aspx"
    },
    sin: {
        description: "Returns the sine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509651(v=vs.85).aspx"
    },
    sincos: {
        description: "Returns the sine and cosine of x.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." },
            { label: 's', documentation: "Returns the sine of x." },
            { label: 'c', documentation: "Returns the cosine of x." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509652(v=vs.85).aspx"
    },
    sinh: {
        description: "Returns the hyperbolic sine of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509653(v=vs.85).aspx"
    },
    smoothstep: {
        description: "Returns a smooth Hermite interpolation between 0 and 1, if x is in the range [min, max].",
        parameters: [
            { label: 'min', documentation: "The minimum range of the x parameter." },
            { label: 'max', documentation: "The maximum range of the x parameter." },
            { label: 'x', documentation: "The specified value to be interpolated." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509658(v=vs.85).aspx"
    },
    sqrt: {
        description: "Returns the square root of the specified floating-point value, per component.",
        parameters: [
            { label: 'value', documentation: "The specified floating-point value." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509662(v=vs.85).aspx"
    },
    step: {
        description: "Compares two values, returning 0 or 1 based on which value is greater.",
        parameters: [
            { label: 'y', documentation: "The first floating-point value to compare." },
            { label: 'x', documentation: "The second floating-point value to compare." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509665(v=vs.85).aspx"
    },
    tan: {
        description: "Returns the tangent of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509670(v=vs.85).aspx"
    },
    tanh: {
        description: "Returns the hyperbolic tangent of the specified value.",
        parameters: [
            { label: 'value', documentation: "The specified value, in radians." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509671(v=vs.85).aspx"
    },
    tex1D: {
        description: "Samples a 1D texture.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509672(v=vs.85).aspx"
    },
    // tex1D: {
    //     description: "Samples a 1D texture using a gradient to select the mip level.",
    //     parameters: [
    //         { label: 's', documentation: "The sampler state." },
    //         { label: 't', documentation: "The texture coordinate." },
    //         { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
    //         { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
    //     ],
    //     link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471388(v=vs.85).aspx"
    // },
    tex1Dbias: {
        description: "Samples a 1D texture after biasing the mip level by t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509673(v=vs.85).aspx"
    },
    tex1Dgrad: {
        description: "Samples a 1D texture using a gradient to select the mip level.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." },
            { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
            { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509674(v=vs.85).aspx"
    },
    tex1Dlod: {
        description: "Samples a 1D texture with mipmaps. The mipmap LOD is specified in t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509675(v=vs.85).aspx"
    },
    tex1Dproj: {
        description: "Samples a 1D texture using a projective divide; the texture coordinate is divided by t.w before the lookup takes place.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509676(v=vs.85).aspx"
    },
    tex2D: {
        description: "Samples a 2D texture.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509677(v=vs.85).aspx"
    },
    // tex2D: {
    //     description: "Samples a 2D texture using a gradient to select the mip level.",
    //     parameters: [
    //         { label: 's', documentation: "The sampler state." },
    //         { label: 't', documentation: "The texture coordinate." },
    //         { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
    //         { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
    //     ],
    //     link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471389(v=vs.85).aspx"
    // },
    tex2Dbias: {
        description: "Samples a 2D texture after biasing the mip level by t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509678(v=vs.85).aspx"
    },
    tex2Dgrad: {
        description: "Samples a 2D texture using a gradient to select the mip level.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." },
            { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
            { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509679(v=vs.85).aspx"
    },
    tex2Dlod: {
        description: "Samples a 2D texture with mipmaps. The mipmap LOD is specified in t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509680(v=vs.85).aspx"
    },
    tex2Dproj: {
        description: "Samples a 2D texture using a projective divide; the texture coordinate is divided by t.w before the lookup takes place.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509681(v=vs.85).aspx"
    },
    tex3D: {
        description: "Samples a 3D texture.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509682(v=vs.85).aspx"
    },
    // tex3D: {
    //     description: "Samples a 3D texture using a gradient to select the mip level.",
    //     parameters: [
    //         { label: 's', documentation: "The sampler state." },
    //         { label: 't', documentation: "The texture coordinate." },
    //         { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
    //         { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
    //     ],
    //     link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471391(v=vs.85).aspx"
    // },
    tex3Dbias: {
        description: "Samples a 3D texture after biasing the mip level by t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509683(v=vs.85).aspx"
    },
    tex3Dgrad: {
        description: "Samples a 3D texture using a gradient to select the mip level.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." },
            { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
            { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509684(v=vs.85).aspx"
    },
    tex3Dlod: {
        description: "Samples a 3D texture with mipmaps. The mipmap LOD is specified in t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509685(v=vs.85).aspx"
    },
    tex3Dproj: {
        description: "Samples a 3D texture using a projective divide; the texture coordinate is divided by t.w before the lookup takes place.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509686(v=vs.85).aspx"
    },
    texCUBE: {
        description: "Samples a cube texture.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509687(v=vs.85).aspx"
    },
    // texCUBE: {
    //     description: "Samples a cube texture using a gradient to select the mip level.",
    //     parameters: [
    //         { label: 's', documentation: "The sampler state." },
    //         { label: 't', documentation: "The texture coordinate." },
    //         { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
    //         { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
    //     ],
    //     link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471392(v=vs.85).aspx"
    // },
    texCUBEbias: {
        description: "Samples a cube texture after biasing the mip level by t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509688(v=vs.85).aspx"
    },
    texCUBEgrad: {
        description: "Samples a cube texture using a gradient to select the mip level.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." },
            { label: 'ddx', documentation: "Rate of change of the surface geometry in the x direction." },
            { label: 'ddy', documentation: "Rate of change of the surface geometry in the y direction." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509689(v=vs.85).aspx"
    },
    texCUBElod: {
        description: "Samples a cube texture with mipmaps. The mipmap LOD is specified in t.w.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509690(v=vs.85).aspx"
    },
    texCUBEproj: {
        description: "Samples a cube texture using a projective divide; the texture coordinate is divided by t.w before the lookup takes place.",
        parameters: [
            { label: 's', documentation: "The sampler state." },
            { label: 't', documentation: "The texture coordinate." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509691(v=vs.85).aspx"
    },
    transpose: {
        description: "Transposes the specified input matrix.",
        parameters: [
            { label: 'value', documentation: "The specified matrix." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509701(v=vs.85).aspx"
    },
    trunc: {
        description: "Truncates a floating-point value to the integer component.",
        parameters: [
            { label: 'value', documentation: "The specified input." }
        ],
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/cc308065(v=vs.85).aspx"
    },
};
exports.preprocessors = {
    DEFINE: {
        description: "Preprocessor directive that defines a constant or a macro.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607343(v=vs.85).aspx"
    },
    ERROR: {
        description: "Preprocessor directive that produces compiler-time error messages.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607346(v=vs.85).aspx"
    },
    IF: {
        description: "Preprocessor directives that control compilation of portions of a source file.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607347(v=vs.85).aspx"
    },
    ELIF: {
        description: "Preprocessor directives that control compilation of portions of a source file.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607347(v=vs.85).aspx"
    },
    ELSE: {
        description: "Preprocessor directives that control compilation of portions of a source file.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607347(v=vs.85).aspx"
    },
    ENDIF: {
        description: "Preprocessor directives that control compilation of portions of a source file.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607347(v=vs.85).aspx"
    },
    IFDEF: {
        description: "Preprocessor directives that determine whether a specific preprocessor constant or macro is defined.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607348(v=vs.85).aspx"
    },
    IFNDEF: {
        description: "Preprocessor directives that determine whether a specific preprocessor constant or macro is defined.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607348(v=vs.85).aspx"
    },
    INCLUDE: {
        description: "Preprocessor directive that inserts the contents of the specified file into the source program at the point where the directive appears.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607349(v=vs.85).aspx"
    },
    LINE: {
        description: "Preprocessor directive that sets the compiler's internally-stored line number and filename to the specified values.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607350(v=vs.85).aspx"
    },
    PRAGMA: {
        description: "Preprocessor directive that provides machine-specific or operating system-specific features while retaining overall compatibility with the C and C++ languages.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607351(v=vs.85).aspx"
    },
    UNDEF: {
        description: "Preprocessor directive that removes the current definition of a constant or macro that was previously defined using the #define directive.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/dd607356(v=vs.85).aspx"
    }
};
exports.semanticsNum = {
    BINORMAL: {
        description: "Binormal",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    BLENDINDICES: {
        description: "Blend indices",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    BLENDWEIGHT: {
        description: "Blend weights",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    COLOR: {
        description: "Diffuse and/or specular color",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    NORMAL: {
        description: "Normal vector",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    POSITION: {
        description: "Vertex position in object space.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    PSIZE: {
        description: "Point size",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    TANGENT: {
        description: "Tangent",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    TEXCOORD: {
        description: "Texture coordinates",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    TESSFACTOR: {
        description: "Tessellation factor",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    DEPTH: {
        description: "Output depth",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_CLIPDISTANCE: {
        description: "Clip distance data.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_CULLDISTANCE: {
        description: "Cull distance data.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_DEPTHGREATEREQUAL: {
        description: "Valid in any shader, tests whether the value is greater than or equal to the depth data value.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_DEPTHLESSEQUAL: {
        description: "Valid in any shader, tests whether the value is less than or equal to the depth data value.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_TARGET: {
        description: "The output value that will be stored in a render target. The index indicates which of the 8 possibly bound render targets to write to. The value is available to all shaders.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
};
exports.semantics = {
    POSITIONT: {
        description: "Transformed vertex position.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    FOG: {
        description: "Vertex fog",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    PSIZE: {
        description: "Point size",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    VFACE: {
        description: "Floating-point scalar that indicates a back-facing primitive. A negative value faces backwards, while a positive value faces the camera.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    VPOS: {
        description: "The pixel location (x,y) in screen space.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_COVERAGE: {
        description: "A mask that can be specified on input, output, or both of a pixel shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_DEPTH: {
        description: "Depth buffer data. Can be written or read by any shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_DISPATCHTHREADID: {
        description: "Defines the global thread offset within the Dispatch call, per dimension of the group. Available as input to compute shader. (read only)",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471566(v=vs.85).aspx"
    },
    SV_DOMAINLOCATION: {
        description: "Defines the location on the hull of the current domain point being evaluated. Available as input to the domain shader. (read only)",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471567(v=vs.85).aspx"
    },
    SV_GROUPID: {
        description: "Defines the group offset within a Dispatch call, per dimension of the dispatch call. Available as input to the compute shader. (read only)",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471568(v=vs.85).aspx"
    },
    SV_GROUPINDEX: {
        description: "Provides a flattened index for a given thread within a given group. Available as input to the compute shader. (read only)",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471569(v=vs.85).aspx"
    },
    SV_GROUPTHREADID: {
        description: "Defines the thread offset within the group, per dimension of the group. Available as input to the compute shader. (read only)",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471570(v=vs.85).aspx"
    },
    SV_GSINSTANCEID: {
        description: "Defines the instance of the geometry shader. Available as input to the geometry shader. The instance is needed as a geometry shader can be invoked up to 32 times on the same geometry primitive.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471571(v=vs.85).aspx"
    },
    SV_INNERCOVERAGE: {
        description: "Represents underestimated conservative rasterization information (i.e. whether a pixel is guaranteed-to-be-fully covered). Can be read or written by the pixel shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_INSIDETESSFACTOR: {
        description: "Defines the tessellation amount within a patch surface. Available in the hull shader for writing, and available in the domain shader for reading.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471572(v=vs.85).aspx"
    },
    SV_INSTANCEID: {
        description: "Per-instance identifier automatically generated by the runtime (see Using System-Generated Values (Direct3D 10)). Available to all shaders.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_ISFRONTFACE: {
        description: "Specifies whether a triangle is front facing. For lines and points, IsFrontFace has the value true. The exception is lines drawn out of triangles (wireframe mode), which sets IsFrontFace the same way as rasterizing the triangle in solid mode. Can be written to by the geometry shader, and read by the pixel shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_OUTPUTCONTROLPOINTID: {
        description: "Defines the index of the control point ID being operated on by an invocation of the main entry point of the hull shader. Can be read by the hull shader only.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471573(v=vs.85).aspx"
    },
    SV_POSITION: {
        description: "When SV_Position is declared for input to a shader, it can have one of two interpolation modes specified: linearNoPerspective or linearNoPerspectiveCentroid, where the latter causes centroid-snapped xyzw values to be provided when multisample antialiasing. When used in a shader, SV_Position describes the pixel location. Available in all shaders to get the pixel center with a 0.5 offset.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_PRIMITIVEID: {
        description: "Per-primitive identifier automatically generated by the runtime (see Using System-Generated Values (Direct3D 10)). Can be written to by the geometry or pixel shaders, and read by the geometry, pixel, hull or domain shaders.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_RENDERTARGETARRAYINDEX: {
        description: "Render-target array index. Applied to geometry shader output and indicates the render target array slice that the primitive will be drawn to by the pixel shader. SV_RenderTargetArrayIndex is only valid if the render target is an array resource. This semantic applies only to primitives, if a primitive has more than one vertex the value from the leading vertex will be used. This value also indicates which array slice of a depthstencilview is used for read/write purposes. Can be written from the geometry shader and read or written by the pixel shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_SAMPLEINDEX: {
        description: "Sample frequency index data. Available to be read or written to by the pixel shader only.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_STENCILREF: {
        description: "Represents the current pixel shader stencil reference value. Can be written by the pixel shader only.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_TESSFACTOR: {
        description: "Defines the tessellation amount on each edge of a patch. Available for writing in the hull shader and reading in the domain shader.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/ff471574(v=vs.85).aspx"
    },
    SV_VERTEXID: {
        description: "Per-vertex identifier automatically generated by the runtime (see Using System-Generated Values (Direct3D 10)). Available as the input to the vertex shader only.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    },
    SV_VIEWPORTARRAYINDEX: {
        description: "Viewport array index. Applied to geometry shader output and indicates which viewport to use for the primitive currently being written out. Can be read or written by the pixel shader. The primitive will be transformed and clipped against the viewport specified by the index before it is passed to the rasterizer. This semantic applies only to primitives, if a primitive has more than one vertex the value from the leading vertex will be used.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509647(v=vs.85).aspx"
    }
};
exports.datatypes = {
    bool: {
        description: "true or false.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    int: {
        description: "32-bit signed integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    int1: {
        description: "32-bit signed integer vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    int2: {
        description: "32-bit signed integer vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    int3: {
        description: "32-bit signed integer vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    int4: {
        description: "32-bit signed integer vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    int1x1: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int1x2: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int1x3: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int1x4: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int2x1: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int2x2: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int2x3: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int2x4: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int3x1: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int3x2: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int3x3: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int3x4: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int4x1: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int4x2: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int4x3: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    int4x4: {
        description: "32-bit signed integer matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    uint: {
        description: "32-bit unsigned integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    dword: {
        description: "32-bit unsigned integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    half: {
        description: "16-bit floating point value. This data type is provided only for language compatibility. Direct3D 10 shader targets map all half data types to float data types. A half data type cannot be used on a uniform global variable (use the /Gec flag if this functionality is desired).",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    half1: {
        description: "16-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    half2: {
        description: "16-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    half3: {
        description: "16-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    half4: {
        description: "16-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    float: {
        description: "32-bit floating point value.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    float1: {
        description: "32-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    float2: {
        description: "32-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    float3: {
        description: "32-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    float4: {
        description: "32-bit floating point vector.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    float1x1: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float1x2: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float1x3: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float1x4: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float2x1: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float2x2: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float2x3: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float2x4: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float3x1: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float3x2: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float3x3: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float3x4: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float4x1: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float4x2: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float4x3: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    float4x4: {
        description: "32-bit floating point matrix.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    double: {
        description: "64-bit floating point value. You cannot use double precision values as inputs and outputs for a stream. To pass double precision values between shaders, declare each double as a pair of uint data types. Then, use the asdouble function to pack each double into the pair of uints and the asuint function to unpack the pair of uints back into the double.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    min16float: {
        description: "minimum 16-bit floating point value.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    min10float: {
        description: "minimum 10-bit floating point value.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    min16int: {
        description: "minimum 16-bit signed integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    min12int: {
        description: "minimum 12-bit signed integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    min16uint: {
        description: "minimum 16-bit unsigned integer.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509646(v=vs.85).aspx"
    },
    //TODO: add parameters
    Buffer: {
        description: "Use to declare a buffer variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/cc308064(v=vs.85).aspx"
    },
    vector: {
        description: "A vector contains between one and four scalar components; every component of a vector must be of the same type.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509707(v=vs.85).aspx"
    },
    matrix: {
        description: "A matrix is a special data type that contains between one and sixteen components. Every component of a matrix must be of the same type.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509623(v=vs.85).aspx"
    },
    sampler: {
        description: "Use to declare sampler state as well as sampler-comparison state.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509644(v=vs.85).aspx"
    },
    SamplerState: {
        description: "Use to declare sampler state as well as sampler-comparison state.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509644(v=vs.85).aspx"
    },
    PixelShader: {
        description: "Declare a shader variable within an effect pass.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509648(v=vs.85).aspx"
    },
    VertexShader: {
        description: "Declare a shader variable within an effect pass.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509648(v=vs.85).aspx"
    },
    texture: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture1D: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture1DArray: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture2D: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture2DArray: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture2DMS: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture2DMSArray: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    Texture3D: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    TextureCube: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    TextureCubeArray: {
        description: "Use to declare a texture variable.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509692(v=vs.85).aspx"
    },
    struct: {
        description: "Use to declare a structure using HLSL.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509668(v=vs.85).aspx"
    },
    typedef: {
        description: "Use to declare a user-defined type.",
        link: "https://msdn.microsoft.com/en-us/library/windows/desktop/bb509702(v=vs.85).aspx"
    }
};
//TODO: descriptions and links
exports.keywords = {
    AppendStructuredBuffer: { description: "" },
    asm: { description: "" },
    asm_fragment: { description: "" },
    BlendState: { description: "" },
    bool: { description: "" },
    break: { description: "" },
    Buffer: { description: "" },
    ByteAddressBuffer: { description: "" },
    case: { description: "" },
    cbuffer: { description: "" },
    centroid: { description: "" },
    class: { description: "" },
    column_major: { description: "" },
    compile: { description: "" },
    compile_fragment: { description: "" },
    CompileShader: { description: "" },
    const: { description: "" },
    continue: { description: "" },
    ComputeShader: { description: "" },
    ConsumeStructuredBuffer: { description: "" },
    default: { description: "" },
    DepthStencilState: { description: "" },
    DepthStencilView: { description: "" },
    discard: { description: "" },
    do: { description: "" },
    double: { description: "" },
    DomainShader: { description: "" },
    dword: { description: "" },
    else: { description: "" },
    export: { description: "" },
    extern: { description: "" },
    false: { description: "" },
    float: { description: "" },
    for: { description: "" },
    fxgroup: { description: "" },
    GeometryShader: { description: "" },
    groupshared: { description: "" },
    half: { description: "" },
    Hullshader: { description: "" },
    if: { description: "" },
    in: { description: "" },
    inline: { description: "" },
    inout: { description: "" },
    InputPatch: { description: "" },
    int: { description: "" },
    interface: { description: "" },
    line: { description: "" },
    lineadj: { description: "" },
    linear: { description: "" },
    LineStream: { description: "" },
    matrix: { description: "" },
    min16float: { description: "" },
    min10float: { description: "" },
    min16int: { description: "" },
    min12int: { description: "" },
    min16uint: { description: "" },
    namespace: { description: "" },
    nointerpolation: { description: "" },
    noperspective: { description: "" },
    NULL: { description: "" },
    out: { description: "" },
    OutputPatch: { description: "" },
    packoffset: { description: "" },
    pass: { description: "" },
    pixelfragment: { description: "" },
    PixelShader: { description: "" },
    point: { description: "" },
    PointStream: { description: "" },
    precise: { description: "" },
    RasterizerState: { description: "" },
    RenderTargetView: { description: "" },
    return: { description: "" },
    register: { description: "" },
    row_major: { description: "" },
    RWBuffer: { description: "" },
    RWByteAddressBuffer: { description: "" },
    RWStructuredBuffer: { description: "" },
    RWTexture1D: { description: "" },
    RWTexture1DArray: { description: "" },
    RWTexture2D: { description: "" },
    RWTexture2DArray: { description: "" },
    RWTexture3D: { description: "" },
    sample: { description: "" },
    sampler: { description: "" },
    SamplerState: { description: "" },
    SamplerComparisonState: { description: "" },
    shared: { description: "" },
    snorm: { description: "" },
    stateblock: { description: "" },
    stateblock_state: { description: "" },
    static: { description: "" },
    string: { description: "" },
    struct: { description: "" },
    switch: { description: "" },
    StructuredBuffer: { description: "" },
    tbuffer: { description: "" },
    technique: { description: "" },
    technique10: { description: "" },
    technique11: { description: "" },
    texture: { description: "" },
    Texture1D: { description: "" },
    Texture1DArray: { description: "" },
    Texture2D: { description: "" },
    Texture2DArray: { description: "" },
    Texture2DMS: { description: "" },
    Texture2DMSArray: { description: "" },
    Texture3D: { description: "" },
    TextureCube: { description: "" },
    TextureCubeArray: { description: "" },
    true: { description: "" },
    typedef: { description: "" },
    triangle: { description: "" },
    triangleadj: { description: "" },
    TriangleStream: { description: "" },
    uint: { description: "" },
    uniform: { description: "" },
    unorm: { description: "" },
    unsigned: { description: "" },
    vector: { description: "" },
    vertexfragment: { description: "" },
    VertexShader: { description: "" },
    void: { description: "" },
    volatile: { description: "" },
    while: { description: "" }
};
//# sourceMappingURL=hlslGlobals.js.map