import { Bullet } from "./bullet";
import { GunType } from "./data.enum";
import { ctx } from "./general";
import { Game } from "./main";
import { Player } from "./player";

export class Gun {
    public pos: any;
    public width: number;
    public height: number;
    public game: Game;
    public gunType: GunType;
    public player: Player;

    public bulletsShot: any[] = [];

    constructor(game: Game, gunType: GunType) {
        this.game = game;
        this.player = this.game.player;
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
        const bullet = new Bullet({
            x: this.pos.x,
            y: this.pos.y,
            width: 20,
            height: 7
        });
        bullet.vel.x = this.player.state.isRight ? bullet.speed : -bullet.speed;
        this.bulletsShot.push(bullet);
    }

    updateBullets() {
        this.bulletsShot.forEach((bullet: Bullet) => {
            bullet.update();
        });
    }

    update() {
        this.position();
        this.draw();
        this.updateBullets();
    }
}
