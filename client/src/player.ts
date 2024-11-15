import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx, currentGame, currentMap, arena, roomId } from "./general";
import { gravity, Physics } from "./physics";
import { server } from "./main";
import { Tile } from "./tile";
import { Item } from "./item";
import { GunType } from "./data.enum";
import { Gun } from "./gun";
import { Camera } from "./camera";


export class Player {
    public id: string | any;
    public name: string = '';
    public isYou: boolean = false;
    public isEnemy: boolean = false;
    public isHost: boolean = false;
    public currentRoom: string = '';

    public jumpCount: number = 0;
    public canShoot: boolean = true;
    public canJump: boolean = true;
    public canSlide: boolean = true;

    public pos: any;
    public absolutePos: any;
    public vel: any;
    public width: number;
    public height: number;
    public defHeight: number;
    public speed: number = 10;
    public slideSpeed: number = 20;
    public shouldSlide: boolean = false;
    public friction: number = 0.05;
    

    public physics: Physics;
    public isJumping: boolean = false;

    public hp: number = 100;
    public healthBarWidth: number = 60;

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

    constructor(id: string | any, name: string) {
        this.init();
        this.id = id;
        this.name = name;
        this.physics = new Physics();
        this.primaryGun = new Gun(this, GunType.PISTOL);

        this.camera = new Camera(this);
        this.width = 60;
        this.height = 60;
        this.defHeight = 60;
        this.lastPos = { x: 100, y: 0 };
    }

    public init() {
        this.pos = { x: 100, y: 0 } as Vec2;
        this.absolutePos = { x: 100, y: 0 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public throwItem() {
        const currentThrowAngle =  this.throwProjectileAngle;
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

        if(this.isYou) {
            server.host.emit('player-throw', {
                roomId: this.currentRoom,
                throwAngle: currentThrowAngle,
            });
        } 
    }

    public slide(): void {
        this.canSlide = false;
        this.height = this.defHeight/2;
        this.slideSpeed *= 1 - this.friction;
        if(this.state.isRight) {
            this.vel.x = this.slideSpeed;
        } else {
            this.vel.x = -this.slideSpeed;
        }

        if(this.slideSpeed < 1) {
            this.canSlide = true;
            this.shouldSlide = false;
            this.slideSpeed = 20;
            this.pos.y = this.pos.y - this.defHeight/2;
            this.height = this.defHeight;
        };
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

    drawHealthBar() {
        const barWidth = this.healthBarWidth * (this.hp/100);
        let color = 'lime';

        if(barWidth <= this.healthBarWidth/2 && barWidth > 20) { color = 'yellow' }
        else if(barWidth <= 20) { color = 'red' } 
    
        ctx.fillStyle = 'grey';
        ctx.fillRect(this.pos.x, this.pos.y - 60, this.healthBarWidth, 8);

        ctx.fillStyle = color;
        ctx.fillRect(this.pos.x, this.pos.y - 60, barWidth, 8);
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

    public drawName() {
        ctx.fillStyle = '#fff';
        ctx.font = `20px consolas`
        ctx.fillText(this.name, this.pos.x, this.pos.y - 22);
    }

    public draw() {
        ctx.fillStyle = this.isYou ? 'red' : 'pink';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    public udpate() {
        if (this.isYou) {
            this.pos.y += this.vel.y;
            this.pos.x += this.vel.x;

            this.vel.y += gravity;

            this.camera.followPlayer(currentGame.keys as IKeys);
            this.updateProjectile();

            // Check if the position has changed from the last position
            if (this.absolutePos.x !== this.lastPos.x || this.absolutePos.y !== this.lastPos.y) {
                server.host.emit('player-move', {
                    position: { x: this.absolutePos.x, y: this.absolutePos.y },
                    roomId: this.currentRoom,
                    playerIsRight: this.state.isRight 
                });
                this.lastPos = { ...this.absolutePos };
            }

            if (this.vel.y == 1.5 || this.vel.y == 0){
                this.isJumping = false;
                this.jumpCount = 0;
            }

        } else if(!this.isYou && this.isEnemy) {
            this.pos.x += arena.pos.x;
            this.pos.y += arena.vel.y;
        }

        if(this.shouldSlide) {
            this.slide();
        }
        

      

        this.drawHealthBar();
        this.primaryGun.update();
        this.drawName();
        this.draw();
    }
}