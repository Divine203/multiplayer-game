import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx } from "./general";
import { gravity, Physics } from "./physics";
import { Game } from "./main";
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

    public throwProjectileAngle: number = 0;

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
            x: this.state.isLeft ? this.pos.x : this.pos.x + this.width,
            y: this.pos.y,
            width: 15,
            height: 15,
            isThrowable: true,
            throwRight: this.state.isRight
        });
        item.throw(Math.abs(this.throwProjectileAngle), 30);
        this.throwProjectileAngle = 0;
        this.game.map.items.push(item);
    }

    updateProjectile(){
        const rotSpeed = 2;
        if(this.game.keys.a.pressed || this.game.keys.z.pressed) {
            this.drawProjectileLine();

            if(this.game.keys.a.pressed) {
                if(this.state.isLeft) this.throwProjectileAngle += rotSpeed;
                else this.throwProjectileAngle -= rotSpeed;

            } else if(this.game.keys.z.pressed) {
                if(this.state.isLeft) this.throwProjectileAngle -= rotSpeed;
                else this.throwProjectileAngle += rotSpeed;
            }
        } 
    }

    drawProjectileLine() {
        const angleInRadians = (this.state.isRight ? this.throwProjectileAngle : this.throwProjectileAngle + 180) * (Math.PI / 180);

        const x1 = this.state.isLeft ? this.pos.x : this.pos.x + this.width;
        const y1 = this.pos.y;
        const length = 200;
        
        ctx.save();
        ctx.translate(x1, y1);  // Translate to the starting point of the line
        ctx.rotate(angleInRadians);
        ctx.setLineDash([15, 20]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore(); // Restore the canvas state so the rotation only affects this line
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

        this.updateProjectile();

        this.camera.followPlayer();
        this.primaryGun.update();
        this.draw();
    }
}