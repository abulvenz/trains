import m from 'mithril';
import { svg, rect, path, g, circle } from './tags';


const use = (v, f) => f(v);
const range = (S, E) => {
    const result = [];
    for (let i = S; i < E; i++)
        result.push(i);
    return result;
}

const toolbox = vnode => {
    return {
        view: vnode => rect({ width: 50, height: 500, x: 10, y: 10, stroke: 'green' })
    }
};

const connector = {
    FEMALE: 0,
    MALE: 1
}

const stdLength = 200;
const stdWidth = 20;

const trackType = {
    SHORT_STRAIGHT: 'Lange Gerade',
    LONG_STRAIGHT: 'Lange Gerade',
    CURVE_EIGHTH: 'Achtelkurve',
    CURVE_SIXTEENTH: 'Sechzehntelkurve',
    FEMALE_POINT: 'Weibliche Weiche',
    MALE_POINT: 'Männliche Weiche',
    CROSS: 'Kreuzung',
    ANCHOR: 'Ankerpunkt'
};

const trackTypes = () => [{
    type: trackType.LONG_STRAIGHT,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: stdLength,
        y: 0,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1],
        [1, 0],
    ]
}, {
    type: trackType.SHORT_STRAIGHT,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: .5 * stdLength,
        y: 0,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1],
        [1, 0],
    ]
}, {
    type: trackType.CURVE_EIGHTH,
    flippable: true,
    connectors: [{
        x: 0,
        y: 0,
        dx: -50,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: stdLength * (0 + Math.cos(Math.PI / 4)),
        y: stdLength * (1 - Math.sin(Math.PI / 4)),
        dx: Math.cos(Math.PI / 4) * 50,
        dy: Math.sin(Math.PI / 4) * 50,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1],
        [1, 0],
    ]
}, {
    type: trackType.CURVE_SIXTEENTH,
    flippable: true,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: .5 * stdLength * (0 - Math.cos(Math.PI / 8)),
        y: .5 * stdLength * (1 - Math.sin(Math.PI / 8)),
        dx: Math.cos(Math.PI / 8),
        dy: Math.sin(Math.PI / 8),
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1],
        [1, 0],
    ]
}, {
    type: trackType.FEMALE_POINT,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: .5 * stdLength,
        y: .5 * stdWidth,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, {
        x: .5 * stdLength,
        y: -.5 * stdWidth,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
    ]
}, {
    type: trackType.MALE_POINT,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -60,
        dy: 0,
        type: connector.MALE,
    }, {
        x: .5 * stdLength,
        y: .5 * stdWidth,
        dx: 60,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: .5 * stdLength,
        y: -.5 * stdWidth,
        dx: 60,
        dy: 0,
        type: connector.FEMALE,
    }, ],
    adjacency: [
        [0, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
    ]
}, {
    type: trackType.CROSS,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: .25 * stdLength,
        y: .25 * stdLength,
        dx: 0,
        dy: -1,
        type: connector.FEMALE,
    }, {
        x: .25 * stdLength,
        y: -.25 * stdLength,
        dx: 0,
        dy: 1,
        type: connector.MALE,
    }, {
        x: .5 * stdLength,
        y: 0,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [1, 0, 0, 0],
    ]
}, {
    type: trackType.ANCHOR,
    flippable: false,
    connectors: [{
        x: 0,
        y: 0,
        dx: -1,
        dy: 0,
        type: connector.FEMALE,
    }, {
        x: 0,
        y: 0,
        dx: 1,
        dy: 0,
        type: connector.MALE,
    }, ],
    adjacency: [
        [0, 1],
        [1, 0],
    ]
}];

const portfolio = {
    [trackType.ANCHOR]: 1,
    [trackType.CURVE_EIGHTH]: 8,
    [trackType.CURVE_SIXTEENTH]: 8,
    [trackType.LONG_STRAIGHT]: 8,
    [trackType.SHORT_STRAIGHT]: 8,
    [trackType.MALE_POINT]: 1,
    [trackType.FEMALE_POINT]: 1,
    [trackType.CROSS]: 1,
};

const availableElements = () =>
    Object.keys(portfolio).map(item => {
        return { type: item, number: portfolio[item] - tracks.filter(e => e.type === item).length };
    });

const tracks = [{
    type: trackType.ANCHOR,
    flipped: false,
    x: 300,
    y: 300,
    angle: 0
}];

const indexOf = (arr, pred) => use(arr.find(pred), item => arr.indexOf(item));

const nextAvailableType = initialType =>
    use(availableElements(), elements =>
        use(indexOf(elements, element => element.type === initialType),
            initialIdx => [...range(initialIdx + 1, elements.length), ...range(0, initialIdx)]
            .map(idx => elements[idx]).find(element => element.number > 0)
        )
    ).type;


const openconnectors = [];

console.log(availableElements())
console.log(nextAvailableType(tracks[0].type))

const form = track => trackTypes().find(category => category.type === track.type);

const track = vnode => {
    return {
        view: vnode => {
            const { track } = vnode.attrs;
            if (!track) return null;
            const form_ = form(track);
            let yFlip = track.flipped ? -1 : 1;
            return g({ transform: `translate(${track.x}, ${track.y})rotate(${track.angle})` },
                track.type === trackType.ANCHOR ? circle({ cx: 0, cy: 0, r: 30, fill: 'rgba(0,0,255,.1)' }) : null,
                form_.adjacency.map((row, rowidx) => {
                    let connectedTo = row.map((e, i) => e ? i : -1).filter(e => e > -1)
                    let me = form_.connectors[rowidx];
                    return connectedTo.map(
                        otherIdx => {
                            let to = form_.connectors[otherIdx];
                            let p = `
                              M ${me.x} ${yFlip * me.y}
                              C ${me.x - me.dx} ${yFlip * (me.y - me.dy)}, ${to.x - to.dx} ${yFlip * (to.y - to.dy)}, ${to.x} ${yFlip * to.y}
                          `;
                            return [
                                path({
                                    stroke: 'white',
                                    d: p,
                                    fill: 'rgba(0,0,0,0)',

                                }),
                                circle({ cx: me.x, cy: yFlip * me.y, stroke: 'yellow', r: 5 })
                            ]
                        }
                    );
                }),
                form_.connectors.map(connector_ =>
                    circle({
                        cx: connector_.x,
                        cy: yFlip * connector_.y,
                        stroke: connector_.type === connector.FEMALE ? 'green' : 'red',
                        fill: 'rgba(0,0,0,0)',
                        r: stdWidth * .5
                    })),
            );
        }
    }
};

let currentPart = use(tracks[tracks.length - 1],
    lastItem => {
        return {
            type: nextAvailableType(lastItem.type),
            x: lastItem.x,
            y: lastItem.y,
            angle: lastItem.angle
        }
    });

document.body.addEventListener('keyup', e => {
    switch (e.keyCode) {
        case 32:
            currentPart = {
                type: nextAvailableType(currentPart.type),
                x: currentPart.x,
                y: currentPart.y,
                angle: currentPart.angle
            };
            console.log(currentPart);
            break;
        case 13:
            tracks.push(currentPart)
            currentPart = {
                type: nextAvailableType(currentPart.type),
                x: 0,
                y: 0,
                angle: currentPart.angle
            };
            break;
        case 70:
            if (form(currentPart).flippable)
                currentPart.flipped = !currentPart.flipped;
        default:
            console.log('Unhandled keyCode', e.keyCode);
            break;
    }
    m.redraw();
});

m.mount(document.body, {
    view: vnode => svg({
            width: innerWidth - 4,
            height: innerHeight - 4,
        }, m(toolbox),
        path({
            d: "M 100 10 C 110 200, 140 200, 150 10",
            stroke: 'red'
        }),
        tracks.map(t => m(track, { track: t })),
        m(track, { track: currentPart, construction: true })
    )
});