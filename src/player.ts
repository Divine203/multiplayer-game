import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx } from "./general";
import { gravity, Physics } from "./physics";
import { Game } from "./main";
import { Camera } from "./camera";
import { Gun } from "./gun";
import { GunType } from "./data.enum";
import { Tile } from "./tile";
import { Item } from "./item";


export class Player {
    public game: Game;
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;
    public speed: number = 8;
    public keys: IKeys;
    public physics: Physics;
    public isJumping: boolean = false;

    public isPlayer: boolean = true;

    public currentPlatform: Tile | any;

    public camera: any;
    public primaryGun: any;

    public state: any = {
        isRight: true,
        isLeft: false
    }
    
    constructor(game: Game) {
        this.init();    
        this.game = game;
        this.keys = game.keys;
        this.physics = new Physics(game);   
        this.width = 60;
        this.height = 60;
    }

    public init() {
        this.pos = { x: 400, y: 600 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public throwItem() {
        const item = new Item({
            x: this.pos.x,
            y: this.pos.y,
            width: 15,
            height: 15,
            isThrowable: true,
            throwRight: this.state.isRight
        });
        item.throw();
        this.game.map.items.push(item);
    }

    public draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
    public udpate() {
        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.vel.y += gravity;

        if(this.vel.y == 1.5 || this.vel.y == 0) this.isJumping = false;

        this.camera.followPlayer();
        this.primaryGun.update();
        this.draw();
    }
}