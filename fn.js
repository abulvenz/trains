const optional = value => {
    const isPresent = () => !!value;
    const map = fn => (isPresent() ? optional(fn(value)) : optional(null));
    const ifPresent = fn => (isPresent() ? fn(value) : null);
    return {
        isPresent,
        map,
        ifPresent
    };
};

const plus = (a, b) => a + b;

const range = (startInclusive, endExclusive) => {
    let result = [];
    for (let i = startInclusive; i < endExclusive; i++) {
        result.push(i);
    }
    return result;
};

const nFrom = (start, number) => {
    return range(start, start + number);
};

const interval = (startInclusive, endInclusive) => {
    return range(startInclusive, endInclusive + 1);
};

const zipWith = (fn, ...arrs) => {
    arguments.l;
    return range(0, Math.min(...arrs.map(arr => arr.length))).map(i =>
        fn(...arrs.map(arr => arr[i]))
    );
};

const tail = arr => {
    return arr[arr.length - 1];
};

const head = arr => {
    return arr[0];
};

const isEmpty = arr => {
    return arr.length === 0;
};

const withoutLast = (arr = []) => {
    return arr.length > 1 ? arr.slice(0, arr.length - 1) : [];
};

const flatten = (arr, depth = 100) => {
    const merged = [];
    for (let step = 0; step < depth; step++) {
        if (merged.length === 0) {
            merged = arr.slice(0);
        }
        let l1 = merged.length;
        merged = [].concat.apply([], merged);
        let l2 = merged.length;
        if (l1 === l2) break;
    }
    return merged;
};

const foldLeft = (arr, start, fn) => {
    return arr.reduce(fn, start);
};
const foldRight = (arr, start, fn) => {
    return arr.reverse().reduce(fn, start);
};

const and = (acc, curr) => acc && curr;
const not = fn => !fn;

const id = n => n;
const succ = n => n + 1;
const pred = n => n - 1;

const directions = [id, succ, pred];

const contains = (arr, e) => {
    return arr.indexOf(e) >= 0;
};

const without = (arr1, arr2) => {
    return arr1.filter(e => !contains(arr2, e));
};

const unique = arr => {
    let r = [];
    arr.forEach(e => (!contains(r, e) ? r.push(e) : 0));
    return r;
};

const reverse = arr =>
    range(0, arr.length)
    .map(i => arr.length - 1 - i)
    .map(i => arr[i]);

const flatMap = (arr, fn = e => e) => arr.reduce((acc, v) => acc.concat(fn(v)), []);

const pickRandomly = (arr) => arr && arr.length ? arr[Math.trunc(Math.random() * arr.length)] : undefined;

export default {
    flatten,
    foldLeft,
    foldRight,
    and,
    withoutLast,
    head,
    tail,
    nFrom,
    range,
    interval,
    optional,
    plus,
    id,
    succ,
    pred,
    zipWith,
    not,
    isEmpty,
    contains,
    without,
    unique,
    reverse,
    flatMap,
    pickRandomly
};