const { min, max, cos, sin, PI, pow, sqrt } = Math;

export class BoundingBox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains({ x, y }) {
        return x > this.x &&
            x < this.x + this.w &&
            y > this.y &&
            y < this.y + this.h;
    }

    draw(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    mergeInplace(other) {
        const x = min(this.x, other.x);
        const y = min(this.y, other.y);
        const x2 = max(this.x + this.w, other.x + other.w);
        const y2 = max(this.y + this.h, other.y + other.h);
        this.x = x;
        this.y = y;
        this.w = x2 - x;
        this.h = y2 - y;
    }

    static merge(one, other) {
        const result = new BoundingBox(one.x, one.y, one.w, one.h);
        result.mergeInplace(other);
        return result;
    }
}