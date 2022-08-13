export default function(retrieval) {
    let value = undefined;
    let retrieved = false;

    const get = function() {
        if (!retrieved) {
            retrieved = true;
            value = retrieval();
        }
        return value;
    };

    const invalidate = function() {
        retrieved = false;
        value = undefined;
    };

    return {
        get,
        invalidate,
    };
}