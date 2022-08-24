import cache from "./cache";
import position from "./position";
import { SingleTrack } from "./singletrack";
import uid from "./uid";

export default class Grid {
    constructor(id = uid.create(), tracks = []) {
        this.id = id;
        this.tracks = tracks;
        this.graphics = cache(() => {
            console.log("Missed graphics cache", this.tracks)
            return this.tracks.map(track => {
                const p1 = position.global(track.position, track.connectors[0].position);
                const p2 = position.global(track.position, track.connectors[1].position);

                return new SingleTrack(
                    p1.x,
                    p1.y,
                    p1.r,
                    p2.x,
                    p2.y,
                    p2.r
                );
            });
        });
    }

    addTrack(track) {
        this.tracks.push(track);
        this.graphics.invalidate();
    }

    toJson() {
        return JSON.stringify(this.tracks);
    }

    isEmpty() {
        return this.tracks.length === 0;
    }

    objects() {
        return this.graphics.get();
    }
}
