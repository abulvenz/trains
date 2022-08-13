import * as math from 'mathjs';
const { cos, sin, sqrt } = Math;

const rotZ = a => [
    [cos(a), sin(a), 0, 0],
    [-sin(a), cos(a), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
];

const rotY = a => [
    [cos(a), 0, sin(a), 0],
    [0, 1, 0, 0],
    [-sin(a), 0, cos(a), 0],
    [0, 0, 0, 1]
];

const rotX = a => [
    [1, 0, 0, 0],
    [0, cos(a), sin(a), 0],
    [0, -sin(a), cos(a), 0],
    [0, 0, 0, 1]
];

const translate = (x, y, z) => [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1]
];

const project = (w, h, far, near) => [
    [w, 0, 0, 0],
    [0, h, 0, 0],
    [0, 0, far / (near - far), -1],
    [0, 0, (near * far) / (near - far), 0]
];

const use = (v, f) => f(v);

const normalize = v => use(math.norm(v), norm => math.multiply(v, 1 / norm));

const baseFrom3Points = (p0, p1, p2) => {

    p0 = p0.slice(0, 3)
    p1 = p1.slice(0, 3)
    p2 = p2.slice(0, 3)

    let p0p1 = normalize(math.subtract(p1, p0));
    let p0p2 = normalize(math.subtract(p2, p0));

    let z = normalize(math.cross(p0p1, p0p2));
    let y = math.cross(z, p0p1);
    let x = p0p1;

    return [
        [...x, 0],
        [...y, 0],
        [...z, 0],
        [...p0, 1],
    ];
};

export default {
    rotX,
    rotY,
    rotZ,
    translate,
    project,
    baseFrom3Points
}