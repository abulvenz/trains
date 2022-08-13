import * as math from 'mathjs';
const { cos, sin, sqrt } = Math;

const rotZ = a => [
    [cos(a), sin(a), 0],
    [-sin(a), cos(a), 0],
    [0, 0, 1, 0],
];

const translate = (x, y) => [
    [1, 0, 0],
    [0, 1, 0],
    [x, y, 1]
];

const use = (v, f) => f(v);

const normalize = v => use(math.norm(v), norm => math.multiply(v, 1 / norm));

const transpose = m => math.transpose(m);

const baseFrom2Points = (p0, p1) => {

    p0 = p0.slice(0, 2)
    p1 = p1.slice(0, 2)

    let p0p1 = normalize(math.subtract(p1, p0));

    let y = normalize(math.cross([...p0p1, 0], [0, 0, -1]));
    // let y = math.cross(z, p0p1);
    y = y.slice(0, 2)
    let x = p0p1;

    return [
        [...x, 0],
        [...y, 0],
        //   [...z, 0],
        [...p0, 1],
    ];
};

export default {
    rotZ,
    translate,
    baseFrom2Points,
    transpose,
    invert: m => math.inv(m),
}