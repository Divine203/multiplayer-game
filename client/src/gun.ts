import { Bullet } from "./bullet";
import { GunType } from "./data.enum";
import { ctx, currentPlayer, sprites } from "./general";
import { server } from "./main";
import { Player } from "./player";

export class Gun {
    public player: Player;
    public pos: any;
    public width: number;
    public height: number;
    public gunType: GunType;

    public bulletSprites: any = {
        pistol_bullet: {
            ...sprites.createSprite(90, 1450, 30, 10),
            recommendedWidth: 15,
            recommendedHeight: 5
        },
        ak47_bullet: {
            ...sprites.createSprite(260, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        smg_bullet: {
            ...sprites.createSprite(430, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        m14_bullet: {
            ...sprites.createSprite(610, 1450, 50, 10),
            recommendedWidth: 25,
            recommendedHeight: 5
        },
        shotgun_bullet: {
            ...sprites.createSprite(780, 1450, 40, 10),
            recommendedWidth: 20,
            recommendedHeight: 5
        },
        bazuka_bullet: {
            ...sprites.createSprite(970, 1440, 110, 30),
            recommendedWidth: 50,
            recommendedHeight: 15
        }
    }

    public gunSprites: any = {
        pistol: {
            ...sprites.createSprite(30, 1300, 90, 60),
            recommendedWidth: 40,
            recommendedHeight: 25
        },
        ak47: {
            ...sprites.createSprite(160, 1300, 160, 70),
            recommendedWidth: 75,
            recommendedHeight: 25
        },
        smg: {
            ...sprites.createSprite(340, 1300, 140, 90),
            recommendedWidth: 55,
            recommendedHeight: 35
        },
        m14: {
            ...sprites.createSprite(500, 1290, 160, 80),
            recommendedWidth: 75,
            recommendedHeight: 30
        },
        shotgun: {
            ...sprites.createSprite(680, 1310, 150, 50),
            recommendedWidth: 75,
            recommendedHeight: 30
        },
        bazuka: {
            ...sprites.createSprite(840, 1300, 240, 80),
            recommendedWidth: 115,
            recommendedHeight: 35
        }
    };

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
        // ctx.fillStyle = 'PURPLE';
        // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
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

