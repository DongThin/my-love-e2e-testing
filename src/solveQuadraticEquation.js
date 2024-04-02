// module.exports = function solveQuadraticEquation(a, b, c) {
//     if (a == 0) {
//         console.log("Error: 'a' must not be zero.");
//         return;
//     }
//     var denta = b ** 2 - 4 * a * c;
//     var x1;
//     var x2;

//     if (denta > 0) {
//         x1 = (-b + Math.sqrt(denta)) / (2 * a);
//         x2 = (-b - Math.sqrt(denta)) / (2 * a);

//         console.log([x1, x2]);
//         return [x2, x1];

//     } else if (denta == 0) {
//         x1 = (-b) / 2 * a;

//         console.log([x1]);
//         return [x1];


//     } else {
//         console.log([]);
//         return [];
//     }

// }

const Big = require('big.js');

module.exports = function solveQuadraticEquation(a, b, c) {
    if (Big(a).eq(0)) {
        console.log("Error: 'a' must not be zero.");
        return;
    }
    
    const denta = Big(b).pow(2).minus(Big(4).times(a).times(c));
    const twoA = Big(2).times(a);
   
    const negB = Big(-b);

    if (denta.gt(0)) {
        const sqrtDenta = denta.sqrt();
        const x1 = negB.plus(sqrtDenta).div(twoA);
        const x2 = negB.minus(sqrtDenta).div(twoA);
        
        console.log([x1.toNumber(), x2.toNumber()]);
        return [x2.toNumber(), x1.toNumber()];

    } else if (denta.eq(0)) {
        const x1 = negB.div(twoA);

        console.log([x1.toNumber()]);
        return [x1.toNumber()];

    } else {
        console.log([]);
        return [];
    }
}
