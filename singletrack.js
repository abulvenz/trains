import fn from "./fn";

const DEBUG = true;

const use = (v, f) => f(v);

const { min, max, cos, sin, PI, pow, sqrt } = Math;

const bezier_3 = (b0, b1, b2, b3) => {
    const a_3 = {
        x: -b0.x + 3 * b1.x - 3 * b2.x + b3.x,
        y: -b0.y + 3 * b1.y - 3 * b2.y + b3.y
    };
    const a_2 = {
        x: 3 * b0.x - 6 * b1.x + 3 * b2.x,
        y: 3 * b0.y - 6 * b1.y + 3 * b2.y
    };
    const a_1 = {
        x: -3 * b0.x + 3 * b1.x,
        y: -3 * b0.y + 3 * b1.y
    };
    return t => ({
        x: a_3.x * pow(t, 3) +
            a_2.x * pow(t, 2) +
            a_1.x * t + b0.x,
        y: a_3.y * pow(t, 3) +
            a_2.y * pow(t, 2) +
            a_1.y * t + b0.y,
    });
};

const blackCircle = (ctx, x, y, r = 5, color = "black") => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

export class SingleTrack {
    constructor(x1 = 0, y1 = 0, r1 = 0, x2 = 100, y2 = 0, r2 = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.x2 = x2;
        this.y2 = y2;
        this.r2 = r2;

        const length = sqrt(pow(this.x1 - this.x2, 2) + pow(this.y1 - this.y2, 2));
        const scale = 0.4;
        const cp1x = this.x1 + length * scale * cos(this.r1 / 180 * PI);
        const cp1y = this.y1 + length * scale * sin(this.r1 / 180 * PI);
        const cp2x = this.x2 - length * scale * cos(this.r2 / 180 * PI);
        const cp2y = this.y2 - length * scale * sin(this.r2 / 180 * PI);

        this.bezier = bezier_3({ x: x1, y: y1 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: x2, y: y2 })

        this.t = 0;
    }

    draw(ctx, time) {
        ctx.imageSmoothingQuality = "high"
        ctx.strokeStyle = "black";
        ctx.strokeStyle = "#0";
        ctx.beginPath();
        ctx.lineWidth = 10;
        ctx.setLineDash([1, 5]);
        ctx.moveTo(this.x1, this.y1);

        const length = sqrt(pow(this.x1 - this.x2, 2) + pow(this.y1 - this.y2, 2));
        const scale = 0.4;
        const cp1x = this.x1 + length * scale * cos(this.r1 / 180 * PI);
        const cp1y = this.y1 + length * scale * sin(this.r1 / 180 * PI);
        const cp2x = this.x2 - length * scale * cos(this.r2 / 180 * PI);
        const cp2y = this.y2 - length * scale * sin(this.r2 / 180 * PI);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, this.x2, this.y2);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        if (DEBUG) {
            blackCircle(ctx, cp1x, cp1y, 13);
            blackCircle(ctx, cp2x, cp2y, 13);
        }
        const offset = 3;
        const iOffset = 3;
        if (DEBUG) {
            blackCircle(ctx,
                cp1x + iOffset * sin(-this.r1 / 180 * PI),
                cp1y + iOffset * cos(-this.r1 / 180 * PI), 2,
                "red"
            );
            blackCircle(ctx,
                cp2x + iOffset * sin(-this.r2 / 180 * PI),
                cp2y + iOffset * cos(-this.r2 / 180 * PI), 2,
                "yellow"
            );

            blackCircle(ctx,
                cp1x - iOffset * sin(-this.r1 / 180 * PI),
                cp1y - iOffset * cos(-this.r1 / 180 * PI), 2,
                "red"
            );
            blackCircle(ctx,
                cp2x - iOffset * sin(-this.r2 / 180 * PI),
                cp2y - iOffset * cos(-this.r2 / 180 * PI), 2,
                "yellow"
            );
        }

        ctx.beginPath();
        ctx.moveTo(
            this.x1 + offset * sin(-this.r1 / 180 * PI),
            this.y1 + offset * cos(-this.r1 / 180 * PI)
        );
        ctx.bezierCurveTo(
            cp1x + iOffset * sin(-this.r1 / 180 * PI),
            cp1y + iOffset * cos(-this.r1 / 180 * PI),
            cp2x + iOffset * sin(-this.r2 / 180 * PI),
            cp2y + iOffset * cos(-this.r2 / 180 * PI),
            this.x2 + offset * sin(-this.r2 / 180 * PI),
            this.y2 + offset * cos(-this.r2 / 180 * PI),
        );
        ctx.stroke();
        ctx.strokeStyle = "white"
        ctx.beginPath();
        ctx.moveTo(
            this.x1 - offset * sin(-this.r1 / 180 * PI),
            this.y1 - offset * cos(-this.r1 / 180 * PI)
        );
        ctx.bezierCurveTo(
            cp1x - iOffset * sin(-this.r1 / 180 * PI),
            cp1y - iOffset * cos(-this.r1 / 180 * PI),
            cp2x - iOffset * sin(-this.r2 / 180 * PI),
            cp2y - iOffset * cos(-this.r2 / 180 * PI),
            this.x2 - offset * sin(-this.r2 / 180 * PI),
            this.y2 - offset * cos(-this.r2 / 180 * PI),
        );
        ctx.stroke();

        if (DEBUG) {
            blackCircle(ctx, this.x1, this.y1, 18);
            blackCircle(ctx, this.x2, this.y2, 20);
        }
        if (DEBUG) {
            fn.range(0, 10)
                .map(e => e * 0.1)
                .forEach(t => use(this.bezier(t), p => blackCircle(ctx, p.x, p.y, t * 10, "red")))
        }
        if (time) {
            this.t += time / 1000.0;
            use(
                this.bezier(time),
                p => blackCircle(ctx, p.x, p.y, 10, "red")
            );
            if (this.t > 0)
                this.t = 0;
        }
    }
}