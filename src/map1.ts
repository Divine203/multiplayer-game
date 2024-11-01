import { Tile } from "./tile";
import { PlatformElevation } from "./elevation.enum";

export class Map1 {
    public tiles: any[] = [];

    constructor() {
        this.init();
    }

    init() {
        this.tiles = [
            new Tile({ x: 1940, y: PlatformElevation.ELEVATION_3, width: 700, height: 60, elevation: PlatformElevation.ELEVATION_3 }),
            new Tile({ x: 1440, y: PlatformElevation.ELEVATION_2, width: 700, height: 60, elevation: PlatformElevation.ELEVATION_2 }),
            new Tile({ x: 940, y: PlatformElevation.ELEVATION_1, width: 700, height: 60, elevation: PlatformElevation.ELEVATION_1 }),
            new Tile({ x: 40, y: PlatformElevation.ELEVATION_0, width: 1300, height: 100, elevation: PlatformElevation.ELEVATION_0 }),
        ];
    }
}  
