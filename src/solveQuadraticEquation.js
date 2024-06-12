const Big = require('big.js');

module.exports = function solveQuadraticEquation(a, b, c) {
    if (Big(a).eq(0)) {
        throw new Error('Error: a must not be zero.');
    }

    const delta = Big(b).pow(2).minus(Big(4).times(a).times(c));
    const twoA = Big(2).times(a);
    const negB = Big(-b);

    const roots = [];

    if (delta.gt(0)) {
        const sqrtDelta = delta.sqrt();
        const x1 = negB.plus(sqrtDelta).div(twoA);
        const x2 = negB.minus(sqrtDelta).div(twoA);

        roots.push(x1.toNumber(), x2.toNumber());

    } else if (delta.eq(0)) {
        const x1 = negB.div(twoA);

        roots.push(x1.toNumber());
    }

    return roots;
}
