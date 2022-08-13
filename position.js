/**
 * A position is a lightweight object that only contains x,y,r,
 * where r is an angle in degree (for better human interpretation).
 */

const { cos, sin, trunc, max, min, PI } = Math;
const translated = (p, dx = 0, dy = 0, dr = 0) => ({ x: p.x + dx, y: p.y + dy, r: p.r + dr });
const create = (x, y, r) => ({ x, y, r });

const use = (v, f) => f(v);
const rad = (deg) => deg / 180 * PI;

const matrixify = (p) => use(
    rad(p.r),
    (r) => [cos(r), sin(r), -sin(r), cos(r), p.x, p.y]
);

const global = (parent, child) => use(rad(parent.r), dpr => ({
    x: parent.x + cos(dpr) * child.x - sin(dpr) * child.y,
    y: parent.y + sin(dpr) * child.x + cos(dpr) * child.y,
    r: parent.r + child.r
}));

const child = (parent, global) => use(
    rad(parent.r), dpr => ({
        x: (global.x - parent.x) * cos(-dpr) - (global.y - parent.y) * sin(-dpr),
        y: (global.x - parent.x) * sin(-dpr) + (global.y - parent.y) * cos(-dpr),
        r: (global.r - parent.r),
    })
);

export default Object.freeze({
    translated,
    create,
    rad,
    matrixify,
    child,
    global,
});