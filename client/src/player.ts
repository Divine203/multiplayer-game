import { IKeys, Vec2, Vec4 } from "./interfaces.interface";
import { ctx, currentGame, currentMap, arena } from "./general";
import { gravity, Physics } from "./physics";
import { Game, server } from "./main";
import { Tile } from "./tile";
import { Item } from "./item";
import { GunType } from "./data.enum";
import { Gun } from "./gun";
import { Camera } from "./camera";
import { Controls } from "./controls";


export class Player {
    public id: string | any;
    public name: string = '';
    public isYou: boolean = false;
    public isEnemy: boolean = false;
    public isHost: boolean = false;
    public currentRoom: string = '';

    public pos: any;
    public absolutePos: any;
    public vel: any;
    public width: number;
    public height: number;
    public speed: number = 8;
    public physics: Physics;
    public isJumping: boolean = false;

    public isPlayer: boolean = true;

    public currentPlatform: Tile | any;

    public camera: any;
    public primaryGun: any;

    public throwProjectileAngle: number = 0;

    public initYPos:number = 0;

    public state: any = {
        isRight: true,
        isLeft: false
    }
    public lastPos: any;

    public horRay: any;
    public verRay: any;

    public controls: any;

    constructor(id: string | any, name: string) {
        this.init();
        this.id = id;
        this.name = name;
        this.physics = new Physics();
        this.primaryGun = new Gun(this, GunType.PISTOL);

        this.camera = new Camera(this);
        this.width = 60;
        this.height = 60;
        this.lastPos = { x: 100, y: 630 };
    }

    public init() {
        this.pos = { x: 100, y: 630 } as Vec2;
        this.absolutePos = { x: 100, y: 630 } as Vec2;
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
        item.throw(this.state.isRight ? this.throwProjectileAngle * -1 : this.throwProjectileAngle, 30);
        this.throwProjectileAngle = 0;
        currentMap.items.push(item);
    }

    updateProjectile() {
        const rotSpeed = 2;
        if (currentGame.keys.a.pressed || currentGame.keys.z.pressed) {
            this.drawProjectileLine();

            if (currentGame.keys.a.pressed) {
                if (this.state.isLeft) this.throwProjectileAngle += rotSpeed;
                else this.throwProjectileAngle -= rotSpeed;

            } else if (currentGame.keys.z.pressed) {
                if (this.state.isLeft) this.throwProjectileAngle -= rotSpeed;
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
        ctx.fillStyle = '#fff';
        ctx.font = `20px consolas`
        ctx.fillText(this.name, this.pos.x, this.pos.y - 22);

        ctx.fillStyle = this.isYou ? 'red' : 'pink';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    public udpate() {
        if (this.isYou) {
            this.pos.y += this.vel.y;
            this.pos.x += this.vel.x;

            this.vel.y += gravity;

            if (this.vel.y == 1.5 || this.vel.y == 0) this.isJumping = false;

            this.camera.followPlayer(currentGame.keys as IKeys);

            // Check if the position has changed from the last position
            if (this.absolutePos.x !== this.lastPos.x || this.absolutePos.y !== this.lastPos.y) {
                server.host.emit('player-move', {
                    position: { x: this.absolutePos.x, y: this.absolutePos.y },
                    roomId: this.currentRoom,
                    playerIsRight: this.state.isRight 
                });
                this.lastPos = { ...this.absolutePos };
            }
            
        } else if(!this.isYou && this.isEnemy) {
            this.pos.x += arena.pos.x;
            this.pos.y += arena.vel.y;
        }

        this.primaryGun.update();
        this.updateProjectile();
        this.draw();
    }
}