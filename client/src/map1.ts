import { GunType, ItemType } from "./data.enum";
import { MAP_BASE } from "./general";
import { Gun } from "./gun";
import { Item } from "./item";
import { Player } from "./player";
import { Tile } from "./tile";

export class Map1 {
    public tiles: Tile[] = [];
    public items: Item[] = [];
    public players: Player[] = [];
    public guns: Gun[] = [];
    
    constructor() {
        this.init();
    }

    init() {
        this.tiles = [
            new Tile({ x: 40, y: MAP_BASE, width: 10, height: 10, color: 'green', isIndicatorTile: true }), // the dummy tile used for calculations
            new Tile({ x: -5960, y: MAP_BASE, width: 7100, height: 300 }),
            new Tile({ x: -5960, y: MAP_BASE + 300, width: 15400, height: 300 }),
            new Tile({ x: 1580, y: MAP_BASE - 150, width: 300, height: 60 }), // 3 floating above
            new Tile({ x: 2080, y: MAP_BASE - 250, width: 300, height: 60 }),
            new Tile({ x: 2580, y: MAP_BASE - 350, width: 300, height: 60 }),
            new Tile({ x: 3000, y: MAP_BASE, width: 6200, height: 300 }),
            new Tile({ x: 3400, y: MAP_BASE - 1220, width: 240, height: 1000 }), // tower
            new Tile({ x: 5000, y: MAP_BASE - 300, width: 100, height: 300 }), // steps below
            new Tile({ x: 5100, y: MAP_BASE - 200, width: 100, height: 200 }),
            new Tile({ x: 5200, y: MAP_BASE - 100, width: 100, height: 100 }),
            new Tile({ x: 5600, y: MAP_BASE - 400, width: 300, height: 80 }),
            new Tile({ x: 6000, y: MAP_BASE - 700, width: 300, height: 80 }),
            new Tile({ x: 6500, y: MAP_BASE - 800, width: 600, height: 800 }),
            new Tile({ x: 7200, y: MAP_BASE - 600, width: 200, height: 80 }),
            new Tile({ x: 7600, y: MAP_BASE - 600, width: 300, height: 80 }),
            new Tile({ x: 8100, y: MAP_BASE - 400, width: 300, height: 80 }),

            // lava town
            new Tile({ x: 9200, y: MAP_BASE + 300, width: 15400, height: 300, color: '#161616' }),
            new Tile({ x: 9500, y: MAP_BASE, width: 1200, height: 300, color: '#161616' }),
            new Tile({ x: 10900, y: MAP_BASE - 300, width: 400, height: 80, color: '#161616' }),
            new Tile({ x: 11600, y: MAP_BASE - 400, width: 400, height: 80, color: '#161616' }),
            new Tile({ x: 12400, y: MAP_BASE - 500, width: 600, height: 900, color: '#161616' }),
            new Tile({ x: 13400, y: MAP_BASE - 400, width: 600, height: 900, color: '#161616' }),

            new Tile({ x: 14300, y: MAP_BASE - 50, width: 300, height: 80, color: '#161616' }),
            new Tile({ x: 15000, y: MAP_BASE - 50, width: 300, height: 80, color: '#161616' }),

            new Tile({ x: 15900, y: MAP_BASE, width: 5600, height: 900, color: '#161616' }),
        ];

        this.items = [
            new Item({ x: 2900, y: 0, width: 100, height: 100, itemType: ItemType.BARREL }),
            new Item({ x: 6400, y: 0, width: 100, height: 100, itemType: ItemType.BARREL }),
            new Item({ x: 9400, y: 0, width: 100, height: 100, itemType: ItemType.BARREL }),
            new Item({ x: 13300, y: 0, width: 100, height: 100, itemType: ItemType.BARREL }),
        ];

        this.guns = [
            new Gun({ x: -3500, y: 0, gunType: GunType.AK47 }),
            new Gun({ x: -3300, y: 0, gunType: GunType.BAZUKA }),
            new Gun({ x: -3100, y: 0, gunType: GunType.M14 }),
            new Gun({ x: -2900, y: 0, gunType: GunType.PISTOL }),
            new Gun({ x: -2700, y: 0, gunType: GunType.SHOTGUN }),
            new Gun({ x: -2500, y: 0, gunType: GunType.SHOTGUN })
        ]
    }
 
}  
