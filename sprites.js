const { cos, sin, random, trunc } = Math;
const { freeze, keys } = Object;
const PI_HALF = Math.PI / 2;

const sprite = (
    image,
    tilesX = 1, tilesY = 1,
    sizeX = image.width / tilesX, sizeY = image.height / tilesY,
    sOffsetX = 0, sOffsetY = 0,
    tOffsetX = -sizeX * 0.5, tOffsetY = -sizeY * 0.5
) => {
    return {
        draw: (ctx, idx, scale = 1.0) => {
            const srcX = (idx % tilesX) * sizeX + sOffsetX;
            const srcY = trunc(idx / tilesY) * sizeY + sOffsetY;
            ctx.scale(scale, scale);
            ctx.drawImage(image,
                srcX, srcY,
                sizeX, sizeY,
                tOffsetX, tOffsetY,
                sizeX, sizeY,
            );
        }
    };
};

export default Object.freeze({
    sprite
});