export default debounce = (t, cb, locked = false) =>
    (...args) =>
    locked ? null : [
        locked = true,
        cb(...args),
        setTimeout(() => locked = false, t)
    ];