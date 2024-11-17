import { Bullet } from "./bullet";
import { GunType } from "./data.enum";
import { ctx, currentPlayer } from "./general";
import { server } from "./main";
import { Player } from "./player";

export class Gun {
    public player: Player;
    public pos: any;
    public width: number;
    public height: number;
    public gunType: GunType;

    public bulletsShot: any[] = [];

    public idleCount: number = 10;


    constructor(player: Player, gunType: GunType) {
        this.player = player;
        this.gunType = gunType;
        this.pos = {
            x: this.player.pos.x,
            y: this.player.pos.y,
        };
        this.width = 30;
        this.height = 10;
    }

    position() {
        if (this.gunType === GunType.PISTOL) {
            this.pos.y = this.player.pos.y + this.player.height / 2;
            if (this.player.state.isRight) {
                this.pos.x = this.player.pos.x + this.player.width;
            } else {
                this.pos.x = this.player.pos.x - this.width;
            }
        }
    }

    draw() {
        ctx.fillStyle = 'PURPLE';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    shoot() {
        this.idleCount = 10;
        this.player.state.isShooting = true;
        const bullet = new Bullet({
            x: this.pos.x,
            y: this.pos.y,
            width: 20,
            height: 7
        });
        bullet.vel.x = this.player.state.isRight ? bullet.speed : -bullet.speed;
        this.bulletsShot.push(bullet);

        if (this.player.isYou) {
            server.host.emit('player-shoot', {
                roomId: this.player.currentRoom
            });
        }
    }

    updateBullets() {
        if(this.idleCount > 0) this.idleCount -= 0.05;

        this.player.state.isShooting = !(this.idleCount <= 0);
   
        this.bulletsShot.forEach((bullet: Bullet, index: number) => {
            bullet.update();

            if(bullet.hasHitObject) {
                this.bulletsShot.splice(index, 1);
            }
        });
    }

    update() {
        this.position();
        this.draw();
        this.updateBullets();
    }
}
