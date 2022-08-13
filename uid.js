let currentID = 0;

export default Object.freeze({
    create() {
        currentID += 1;
        return "id" + currentID;
    },
    setUID(newId) {
        if (newId > currentID) {
            currentID = newId;
        }
    }
});