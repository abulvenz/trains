import { BoundingBox } from "./boundingbox";

export class Button {
    constructor(x, y, text, cb, selected = () => false) {
        this.x = x;
        this.y = y;
        this.cb = cb;
        this.text = text;
        this.selected = selected;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.font = '20px serif';
        const textMetrics = ctx.measureText(this.text);
        this.boundingBox = new BoundingBox(this.x, this.y, textMetrics.width + 15, 30);
        ctx.fillRect(this.x, this.y, textMetrics.width + 15, 30)
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x + 7.5, this.y + textMetrics.actualBoundingBoxAscent + 7.5);
        if (this.selected()) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "white";
        }
        ctx.rect(this.x, this.y, textMetrics.width + 15, 30);
        ctx.stroke();
    }

    click(p) {
        if (this.boundingBox.contains(p)) {
            this.cb();
        }
    }
}