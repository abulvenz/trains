import position from "./position";
import track from "./track";

const { sin, cos } = Math;

export default prototypes = [{
    name: 'straight     ',
    track: track.create(
        null, [
        track.createConnector(track.gender.female, position.create(-50, 0, 0), track.createFixedConnection(1)),
        track.createConnector(track.gender.male, position.create(50, 0, 0), track.createFixedConnection(0))
    ])
},
{
    name: 'short      ',
    track: track.create(
        null, [
        track.createConnector(track.gender.female, position.create(-25, 0, 0), track.createFixedConnection(1)),
        track.createConnector(track.gender.male, position.create(25, 0, 0), track.createFixedConnection(0))
    ])
},
{
    name: 'male switch  ',
    track: track.create(
        null, [
        track.createConnector(track.gender.female, position.create(-25, 10, 0), track.createFixedConnection(2)),
        track.createConnector(track.gender.female, position.create(-25, -10, 0), track.createFixedConnection(2)),
        track.createConnector(track.gender.male, position.create(25, 0, 0), track.createSwitchConnection([0, 1]))
    ])
},
{
    name: 'female switch',
    track: track.create(
        null, [
        track.createConnector(track.gender.male, position.create(-25, 10, 0), track.createFixedConnection(2)),
        track.createConnector(track.gender.male, position.create(-25, -10, 0), track.createFixedConnection(2)),
        track.createConnector(track.gender.female, position.create(25, 0, 0), track.createSwitchConnection([0, 1]))
    ])
},
{
    name: 'left         ',
    track: track.create(
        null, [
        track.createConnector(track.gender.female, position.create(
            cos(position.rad(90)) * 25,
            sin(position.rad(90)) * 25,
            0
        ), track.createFixedConnection(1)),
        track.createConnector(track.gender.male, position.create(
            cos(position.rad(45)) * 25,
            sin(position.rad(45)) * 25,
            45
        ), track.createFixedConnection(0))
    ])
}, { name: 'right        ', track: track.create() },
];
