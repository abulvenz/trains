import { createVacuumImpedance } from 'mathjs/lib/factoriesAny';
import sprites from './sprites';
import fn from './fn';
import images from './images';

const use = (v, fn) => fn(v);

const { min, max, cos, sin, PI, pow, sqrt } = Math;

const DEBUG = false;

const smoke = sprites.sprite(images.smokeImage, 8, 5);

const blackCircle = (ctx, x, y, r = 5, color = "black") => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
};

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

class SingleTrack {
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
        console.log(this.bezier(0))

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
            const use = (v, fn) => fn(v);
            //        console.log(this.bezier(0))

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

class Track {
    constructor(female, male, connections) {
        this.female = female;
        this.male = male;
        this.connectors = [...female, ...male];
        this.connections = connections;
        this.showConnections = false;

        this.singles = [];
        const cache = {};
        this.connections.forEach((conn, idx) => {
            const fem = this.connectors[idx];
            conn.forEach(cidx => {
                if (cache["" + min(idx, cidx) + "" + max(idx, cidx)]) return;
                cache["" + min(idx, cidx) + "" + max(idx, cidx)] = 1;
                const mal = this.connectors[cidx];
                this.singles.push(new SingleTrack(fem.x, fem.y, fem.r, mal.x, mal.y, mal.r));
            });
        });

        this.boundingBox = new BoundingBox(this.connectors[0].x, this.connectors[0].y, 0, 0);
        [...this.female, ...this.male].forEach(fem => this.boundingBox.mergeInplace(fem.boundingBox));
    }
    draw(ctx, t) {
        this.female.forEach(connector => connector.draw(ctx));
        this.male.forEach(connector => connector.draw(ctx));
        this.singles.forEach(track => track.draw(ctx, t));
        if (this.showConnections) {
            ctx.fillText(JSON.stringify(this.connections), this.connectors[0].x, this.connectors[0].y);
        }
    }
    click(p) {
        if (this.boundingBox.contains(p)) {
            console.log("clicked track");
            this.showConnections = !this.showConnections;
        }
        this.connectors.forEach(e => e.click(p));
    }
}

class BoundingBox {
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

class Grid {
    constructor() {
        this.tracks = [];
    }
    draw(ctx, t) {
        this.tracks.forEach(track => track.draw(ctx, t))
    }
    add(track) {
        this.tracks.push(track);
    }
    click(p) {
        console.log("clicked grid");
        this.tracks.forEach(e => e.click(p));
    }
}

const grid = new Grid();

const gendern = (connectors, cb) => cb({ female: connectors.filter(c => c.type === "female"), male: connectors.filter(c => c.type === "male") });

class Recipe {
    constructor(name, connectors, connections = gendern(connectors, ({ female, male }) => [
        [...fn.range(0, male.length)],
        [...fn.range(0, female.length)]
    ])) {
        console.log(connections)
        gendern(connectors, ({ female, male }) => {
            this.female = female;
            this.male = male;
        });
        this.name = name;
        this.connections = connections;
    }
    connect(connector) {
        console.log("before", this.female, this.male)
        const validConnectors = connector.type === "male" ? this.female : this.male;
        const nextConnectors = connector.type === "male" ? this.male : this.female;

        const selectedIdx = 0;
        const selectedConnector = validConnectors[selectedIdx];

        const offsetX = selectedConnector.x;
        const offsetY = selectedConnector.y;
        const offsetR = selectedConnector.r;

        const cosA = cos(connector.r / 180 * PI);
        const sinA = -sin(connector.r / 180 * PI);

        const newConnectedConnectors =
            validConnectors.map((conn, idx) =>
                new Connector(
                    (conn.x - offsetX) * cosA + (conn.y - offsetY) * sinA + connector.x, -(conn.x - offsetX) * sinA + (conn.y - offsetY) * cosA + connector.y,
                    conn.r - offsetR + connector.r,
                    selectedConnector.type
                ));

        const newConnectingConnectors =
            nextConnectors.map((conn, idx) =>
                new Connector(
                    (conn.x - offsetX) * cosA + (conn.y - offsetY) * sinA + connector.x, -(conn.x - offsetX) * sinA + (conn.y - offsetY) * cosA + connector.y,
                    conn.r - offsetR + connector.r,
                    connector.type
                ));

        const newMale = connector.type === "male" ? newConnectingConnectors : newConnectedConnectors;
        const newFemale = connector.type === "female" ? newConnectingConnectors : newConnectedConnectors;

        selectConnector(newConnectingConnectors[0])

        grid.add(new Track(newFemale, newMale, deepCopy(this.connections)));
    }
}

const options = {
    drawConnectors: true
};

const state = {
    selectedConnector: null
};

const selectConnector = (connector) => state.selectedConnector = connector;

class Connector {
    constructor(x, y, r, type) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = type;
        this.radius = this.type === "male" ? 5 : 7;
        this.boundingBox = new BoundingBox(x - this.radius, y - this.radius, 2 * this.radius, 2 * this.radius)
    }

    draw(ctx) {
        if (options.drawConnectors) {
            blackCircle(ctx, this.x, this.y, this.radius, state.selectedConnector === this ? 'green' : 'red');
        }
    }

    click({ x, y }) {
        if (this.boundingBox.contains({ x, y })) {
            selectConnector(this);
        }
    }
}

class Button {
    constructor(x, y, text, cb) {
        this.x = x;
        this.y = y;
        this.cb = cb;
        this.text = text;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.font = '20px serif';
        const textMetrics = ctx.measureText(this.text);
        this.boundingBox = new BoundingBox(this.x, this.y, textMetrics.width + 15, 30);
        ctx.fillRect(this.x, this.y, textMetrics.width + 15, 30)
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x + 7.5, this.y + textMetrics.actualBoundingBoxAscent + 7.5);
    }

    click(p) {
        if (this.boundingBox.contains(p)) {
            this.cb();
        }
    }
}

const canvas = document.getElementById("field");
canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext("2d");

const clear = (ctx) => {
    ctx.fillStyle = "olive"
    ctx.fillRect(0, 0, innerWidth, innerHeight)
};

const length = 100;

const deepCopy = o => JSON.parse(JSON.stringify(o));

const recipies = [
    new Recipe("straight o1", [new Connector(-length, 10, 0, 'female'), new Connector(length, -10, 0, 'female')], [], [
        [1],
        [0]
    ]),
    new Recipe("straight o", [new Connector(-length, 10, 0, 'female')], [new Connector(length, -10, 0, 'male')], [
        [1],
        [0]
    ]),
    new Recipe("short", [new Connector(0, 0, 0, 'female')], [new Connector((1 - sin(PI / 4)) * length, 0, 0, 'male')], [
        [1],
        [0]
    ]),
    new Recipe("straight", [new Connector(0, 0, 0, 'female')], [new Connector(cos(PI / 4) * length, 0, 0, 'male')], [
        [1],
        [0]
    ]),
    new Recipe("right", [new Connector(0, 0, 0, 'female')], [new Connector(cos(PI / 4) * length, (1 - sin(PI / 4)) * length, 45, 'male')], [
        [1],
        [0]
    ]),
    new Recipe("left", [new Connector(0, 0, 0, 'female')], [new Connector(cos(PI / 4) * length, -(1 - sin(PI / 4)) * length, -45, 'male')], [
        [1],
        [0]
    ]),
    new Recipe("female switch", [new Connector(0, 0, 0, 'female')], [
        new Connector(cos(PI / 4) * length, -(1 - sin(PI / 4)) * length, 0, 'male'),
        new Connector(cos(PI / 4) * length, (1 - sin(PI / 4)) * length, 0, 'male')
    ], [
        [1, 2],
        [0],
        [0]
    ]),
    new Recipe("male switch", [
        new Connector(0, 0, 0, 'female'),
        new Connector(0, 2 * (1 - sin(PI / 4)) * length, 0, 'female'),
    ], [
        new Connector(cos(PI / 4) * length, (1 - sin(PI / 4)) * length, 0, 'male'),
    ], [
        [2],
        [2],
        [0, 1]
    ]),
];

const start = new Connector(innerWidth * .5, innerHeight * .5, 0, 'male');

const objects = [
    ...recipies.map((recipe, idx) => new Button(10, idx * 35 + 10, recipe.name, () => {
        if (state.selectedConnector != null) {
            recipe.connect(state.selectedConnector)
        }
    })),
    start,
    grid
];

selectConnector(start);

const debounce = (t, cb, locked = false) =>
    (...args) =>
    locked ? null : [
        locked = true,
        cb(...args),
        setTimeout(() => locked = false, t)
    ];

canvas.addEventListener("mouseup", debounce(200, (e) =>
    objects
    .filter(o => o.click !== undefined)
    .forEach(o => o.click({ x: e.clientX, y: e.clientY }))
));

const drawSmoke = (ctx, cnt, x, y, theta) => {
    ctx.save();

    ctx.transform(
        cos(theta), sin(theta), -sin(theta), cos(theta),
        x,
        y
    );
    smoke.draw(ctx, cnt)
    ctx.restore();
};

let lastTime = undefined;
let deltaT = 0;
let t = 0;
const run = () => {
    requestAnimationFrame((time) => {
        if (lastTime === undefined) {
            lastTime = time;
        } else {
            deltaT = time - lastTime;
            lastTime = time;
        }
        t += 0.01;
        clear(ctx);
        objects
            .forEach(e => e.draw(ctx, t));

        if (t > 1) t = 0;
        run();

    });
};

run();