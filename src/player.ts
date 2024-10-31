import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx } from "./general";
import { Physics } from "./physics";
import { Game } from "./main";

export class Player {
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;
    public speed: number = 8;
    public keys: IKeys;
    public physics: Physics;
    
    constructor(game: Game) {
        this.init();    
        this.keys = game.keys;
        this.physics = new Physics(game);   
        this.width = 60;
        this.height = 60;
    }

    init() {
        this.pos = { x: 400, y: 30 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
    udpate() {
        // this.vel.x = 10

        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.vel.y += this.physics.gravity;

        this.draw();
    }
}