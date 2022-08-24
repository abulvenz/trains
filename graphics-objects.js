

export default class GraphicsObjects {

    constructor() {
        this.objects = [];
    }

    add(...newObjects) {
       this.objects = this.objects.concat(newObjects);
    }

    get() {
        return this.objects;
    }
}