import uid from "./uid";

const create = (type = null, connectors = []) => ({
    id: uid.create(),
    type,
    position: { x: 0, y: 0, r: 0 },
    connectors,
});

const createConnector = (
    gender = 'female',
    position = { x: 0, y: 0, r: 0 },
    connections = null,
    id = uid.create()
) => ({
    id,
    position,
    gender,
    connections,
});

const createFixedConnection = (id = null) => ({
    type: 'fixed',
    id,
});

const createSwitchConnection = (ids = []) => ({
    type: 'switch',
    ids,
});

const deepCopy = (o) => JSON.parse(JSON.stringify(o));

const type = Object.freeze({ switch: "switch", fixed: "fixed" });

const instantiate = (prototype) => {
    const obj = deepCopy(prototype);

    obj.id = uid.create();

    obj.connectors.forEach((connector, idx) => {
        connector.id = uid.create();
    });

    obj.connectors.forEach((connector) => {
        if (connector.connections.type === type.fixed) {
            connector.connections.id = obj.connectors[connector.connections.id].id;
        } else if (connector.connections.type === type.switch) {
            connector.connections.ids = connector.connections.ids.map(
                id => obj.connectors[id].id);
        }
    });

    return obj;
};

export default Object.freeze({
    create,
    instantiate,
    createConnector,
    createFixedConnection,
    createSwitchConnection,
    gender: { male: "male", female: "female" },
    type,
});