import { MAP_BASE } from "./general";
import { Item } from "./item";
import { Player } from "./player";
import { Tile } from "./tile";

export class Map1 {
    public tiles: Tile[] = [];
    public items: Item[] = [];
    public players: Player[] = [];

    constructor() {
        this.init();
    }

    init() {
        this.tiles = [
            new Tile({ x: 1940, y: -200, width: 700, height: 60 }),
            new Tile({ x: 1440, y: 100, width: 700, height: 60 }),
            new Tile({ x: 940, y: 400, width: 700, height: 60 }),
            new Tile({ x: 40, y: MAP_BASE, width: 1300, height: 100 }),
            new Tile({ x: 40, y: MAP_BASE, width: 10, height: 10, color: 'green', isIndicatorTile: true }) // a dummy tile used for calculations
        ];
        
        this.items = [
            new Item({x: 400, y: 600, width: 100, height: 100, color: 'orange'})
        ];

        this.players = [];
    }
}  
