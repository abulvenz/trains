import m from 'mithril';
import tagl from 'tagl-mithril';
import debounce from './debounce';
import { Button } from './button';
import cache from './cache';
import fn from './fn';
import position from './position';
import { SingleTrack } from './singletrack';
import track from './track';
import uid from './uid';
import Grid from './grid';
import prototypes from './prototypes';
import GraphicsObjects from './graphics-objects';

// prettier-ignore
const { address, aside, footer, header, h1, h2, h3, h4, h5, h6, hgroup, main, nav, section, article, blockquote, dd, dir, div, dl, dt, figcaption, figure, hr, li, ol, p, pre, ul, a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kdm, mark, q, rb, rp, rt, rtc, ruby, s, samp, small, span, strong, sub, sup, time, tt, u, wbr, area, audio, img, map, video, embed, iframe, noembed, object, param, picture, source, canvas, noscript, script, del, ins, caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr, button, datalist, fieldset, form, formfield, input, label, legend, meter, optgroup, option, output, progress, select, textarea, details, dialog, menu, menuitem, summary, content, element, slot, template } = tagl(m);

const use = (v, f) => f(v);
const { min, max, cos, sin, PI, pow, sqrt } = Math;


console.log(prototypes);

const state = {};
const setCtx = ctx => state.ctx = ctx;

const canvasC = (vnode) => ({
    oncreate: vnode => setCtx(vnode.dom.getContext("2d")),
    view: vnode => canvas.$board(vnode.attrs)
});

const tra = track.instantiate(prototypes[2].track);

let gameIDs = [];

const loadIDs = () =>
    gameIDs = JSON.parse(localStorage.getItem("ids")) || [];

let grid = new Grid();

//grid.addTrack(tra);

const load = (id) =>
    grid = new Grid(id, JSON.parse(localStorage.getItem(id)));

const sync = () => {
    gameIDs = [...gameIDs.filter(id => id !== grid.id), grid.id];
    console.log(gameIDs);
    localStorage.setItem("ids", JSON.stringify(gameIDs));
    localStorage.setItem(grid.id, grid.toJson());
};

const newGame = () => {
    sync();
    grid = new Grid();
    gameIDs.push(grid.id);
};

const deleteGame = () => {
    const idToDelete = grid.id;
    gameIDs = [...gameIDs.filter(id => id !== idToDelete)];
    localStorage.setItem(idToDelete, undefined);
    localStorage.setItem("ids", JSON.stringify(gameIDs));
};

const when = (v, f, g) => v ? f(v) : g ? g() : undefined;

loadIDs();

console.log(gameIDs);

const buttons = [
    new Button(10, innerHeight - 100, "save", sync),
    new Button(70, innerHeight - 100, "delete", deleteGame),
    new Button(148, innerHeight - 100, "new", newGame),
    ...gameIDs.map((id, idx) => new Button(
        10 + idx * 60, innerHeight - 60, id, () => load(id),
        () => grid.id === id
    )),
    ...prototypes.map((prototype, idx) => new Button(10, idx * 35 + 10, prototype.name, () => {
        const track_ = track.instantiate(prototype.track);

        track_.position.x = innerWidth / 2;
        track_.position.y = innerHeight / 2;
        grid.addTrack(track_);

        if (state.selectedConnector != null) {
            prototype.connect(state.selectedConnector)
        }
    }))
];

const objects = new GraphicsObjects();

objects.add(...buttons);
console.log(objects.get())
const clear = ctx => {
    ctx.fillStyle = "#009A17";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
};

m.mount(document.body, {
    view: vnode => [
        m(canvasC, {
            width: innerWidth,
            height: innerHeight,
            onmouseup: debounce(200, (e) =>
                console.log("mouse") ||
                objects.get()
                    .filter(o => o.click !== undefined)
                    .forEach(o => o.click({ x: e.clientX, y: e.clientY }))
            )
        }),
        pre(JSON.stringify(tra, null, 2))
    ]
});

let lastTime = undefined;
let deltaT = 0;
let t = 0;
const run = () => {
    requestAnimationFrame((time) => {
        if (!state.ctx) return;
        const ctx = state.ctx;
        if (lastTime === undefined) {
            lastTime = time;
        } else {
            deltaT = time - lastTime;
            lastTime = time;
        }
        console.log(deltaT)
        t += 0.01;
        clear(ctx);
        [...objects.get(), ...grid.objects()]
            .forEach(e => e.draw(ctx, t));

        if (t > 1) t = 0;
        run();

    });
};

run();