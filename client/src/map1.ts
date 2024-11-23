import { MAP_BASE } from "./general";
import { Gun } from "./gun";
import { Item } from "./item";
import { Player } from "./player";
import { Tile } from "./tile";
import { GunType, ItemType } from "./data.enum";

export class Map1 {
    public tiles: Tile[] = [];
    public items: Item[] = [];
    public players: Player[] = [];
    public guns: Gun[] = [];

    // map base is 700;

    constructor() {
        this.init();
    }

    init() {
        this.tiles = [
            new Tile({ x: 40, y: MAP_BASE, width: 10, height: 10, color: 'green', isIndicatorTile: true }), // the dummy tile used for calculations
            new Tile({ x: -5960, y: MAP_BASE, width: 7100, height: 300 }),
            new Tile({ x: -5960, y: MAP_BASE + 300, width: 15400, height: 300 }),
            new Tile({ x: 1580, y: MAP_BASE - 150, width: 300, height: 60 }), // 3 steps below
            new Tile({ x: 2080, y: MAP_BASE - 250, width: 300, height: 60 }),
            new Tile({ x: 2580, y: MAP_BASE - 350, width: 300, height: 60 }),
            new Tile({ x: 3000, y: MAP_BASE, width: 6200, height: 300 }),
            new Tile({ x: 3400, y: MAP_BASE - 1220, width: 240, height: 1000 }), // tower
            new Tile({ x: 5000, y: MAP_BASE - 300, width: 100, height: 300 }),
            new Tile({ x: 5100, y: MAP_BASE - 200, width: 100, height: 200 }),
            new Tile({ x: 5200, y: MAP_BASE - 100, width: 100, height: 100 }),
            new Tile({ x: 5600, y: MAP_BASE - 400, width: 300, height: 80 }),
            new Tile({ x: 6000, y: MAP_BASE - 700, width: 300, height: 80 }),
            new Tile({ x: 6500, y: MAP_BASE - 800, width: 600, height: 800 }),
            new Tile({ x: 7200, y: MAP_BASE - 600, width: 200, height: 80 }),
            new Tile({ x: 7600, y: MAP_BASE - 600, width: 300, height: 80 }),
            new Tile({ x: 8100, y: MAP_BASE - 400, width: 300, height: 80 }),

            // lava town
            new Tile({ x: 9200, y: MAP_BASE + 300, width: 15400, height: 300, color: 'pink' }),
            new Tile({ x: 9500, y: MAP_BASE, width: 1200, height: 300, color: 'pink' }),
            new Tile({ x: 10900, y: MAP_BASE - 300, width: 400, height: 80, color: 'pink' }),
            new Tile({ x: 11600, y: MAP_BASE - 500, width: 400, height: 80, color: 'pink' }),
            new Tile({ x: 12400, y: MAP_BASE - 500, width: 600, height: 900, color: 'pink' }),
            new Tile({ x: 13400, y: MAP_BASE - 400, width: 600, height: 900, color: 'pink' }),

            new Tile({ x: 14300, y: MAP_BASE - 50, width: 300, height: 80, color: 'pink' }),
            new Tile({ x: 15000, y: MAP_BASE - 50, width: 300, height: 80, color: 'pink' }),

            new Tile({ x: 15900, y: MAP_BASE - 400, width: 5600, height: 900, color: 'pink' }),
        ];
        
        this.items = [
            new Item({x: 1700, y: 0, width: 100, height: 100, itemType: ItemType.HEALTH}),
            new Item({x: 2000, y: 0, width: 100, height: 100, itemType: ItemType.ARMOR}),
            new Item({x: 2300, y: 0, width: 100, height: 100, itemType: ItemType.AMMO}),
            new Item({x: 2600, y: 0, width: 100, height: 100, itemType: ItemType.BARREL}),
            new Item({x: 2900, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 2900, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 3000, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 3100, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 3200, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 3300, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 3400, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 2800, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 2700, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
            new Item({x: 2600, y: 0, width: 100, height: 100, itemType: ItemType.GRENADE}),
        ];

        this.guns = [
            new Gun({ x: 100, y: 100, gunType: GunType.PISTOL }),
            new Gun({ x: 250, y: 100, gunType: GunType.AK47 }),
            new Gun({ x: 400, y: 100, gunType: GunType.SMG }),
            new Gun({ x: 550, y: 100, gunType: GunType.M14 }),
            new Gun({ x: 700, y: 100, gunType: GunType.BAZUKA }),
            new Gun({ x: 900, y: 100, gunType: GunType.SHOTGUN }),
        ];

        this.players = [];
    }
}  
