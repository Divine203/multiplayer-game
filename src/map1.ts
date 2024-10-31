import { Tile } from "./tile";


export class Map1 {
    public tiles: any[] = [];

    constructor() {
        this.init();
    }

    init() {
        this.tiles = [
            new Tile({x: 40, y: 700, width: 1300, height: 100})
        ];
    }
}  
