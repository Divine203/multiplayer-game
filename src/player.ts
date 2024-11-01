import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx } from "./general";
import { Physics } from "./physics";
import { Game } from "./main";
import { Camera } from "./camera";


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
    public camera: Camera;
    
    constructor(game: Game) {
        this.init();    
        this.game = game;
        this.keys = game.keys;
        this.physics = new Physics(game);   
        this.width = 60;
        this.height = 60;

        this.camera = new Camera(game);
    }

    public init() {
        this.pos = { x: 400, y: 30 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    
    public udpate() {
        this.pos.y += this.vel.y;
        this.pos.x += this.vel.x;

        this.vel.y += this.physics.gravity;

        if(this.vel.y == 0) this.isJumping = false;


        this.camera.followPlayer();
        this.draw();
    }
}