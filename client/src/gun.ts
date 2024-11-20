import { Bullet } from "./bullet";
import { GunType } from "./data.enum";
import { arena, cameraState, ctx, cvs, gunConfigurations, sprites } from "./general";
import { Vec2 } from "./interfaces.interface";
import { server } from "./main";
import { gravity } from "./physics";
import { Player } from "./player";
import { ISpriteData } from "./sprite";

export class Gun {
    public player: Player | any = null;
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;
    public gunType: GunType;
    public isPicked: boolean = false;

    public gunSprite: ISpriteData;
    public fireRate: number = 0;
    public damage: number = 0;

    public xCorrection: number = 0;
    public yCorrection: number = 0;

    public noGravity: boolean = false;
    public friction: number = 0.05;

    public posX: number = 0;
    public currentFrameOffsetX: number = 0;

    private lastShotTime: number = 0;

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
            ...sprites.createSprite(340, 1290, 150, 90),
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
            recommendedHeight: 25
        },
        bazuka: {
            ...sprites.createSprite(840, 1290, 240, 80),
            recommendedWidth: 115,
            recommendedHeight: 35
        }
    };

    public bulletsShot: any[] = [];


    constructor({ x, y, gunType, player }: IGun) {
        this.player = player;
        this.gunType = gunType;
        this.gunSprite = this.gunSprites[this.gunType];
        this.pos = {
            x,
            y,
        };
        this.vel = { x: 0, y: 0 } as Vec2;
        this.width = (this.gunSprite.recommendedWidth as number);
        this.height = (this.gunSprite.recommendedHeight as number);

        this.fireRate = gunConfigurations[gunType].fireRate;
        this.damage = gunConfigurations[gunType].damage;
    }

    draw() {
        this.currentFrameOffsetX = this.gunSprite.animate ? (this.gunSprite.animation as any).frameCut * (this.gunSprite.animation as any).frameX : 0;

        this.posX = this.pos.x;
        ctx.save();



        if (this.isPicked) {
            ctx.translate(this.player.width ,0);

            if (this.player.state.isRight) {
                ctx.scale(1, 1);
            } else {
                this.posX = this.posX * -1;
                ctx.scale(-1, 1); // Flip horizontally
            }

            if (this.gunType == GunType.BAZUKA) {
                this.xCorrection = this.player.state.isRight ? -80 : 17;
                this.yCorrection = -20;
            } else if (this.gunType == GunType.AK47) {
                this.xCorrection = this.player.state.isRight ? -30 : 30;
                this.yCorrection = -10;

                if (this.player.state.isSlide) {
                    this.xCorrection = this.player.state.isRight ? -14 : 20;
                }

            } else if (this.gunType == GunType.SMG) {
                this.xCorrection = this.player.state.isRight ? -8 : 60;
                this.yCorrection = -14;
            } else if (this.gunType == GunType.M14) {
                this.xCorrection = this.player.state.isRight ? -34 : 40;
                this.yCorrection = -20;

                if (this.player.state.isSlide) {
                    this.xCorrection = this.player.state.isRight ? -14 : 20;
                }
            } else if (this.gunType == GunType.PISTOL) {
                this.xCorrection = this.player.state.isRight ? -4 : 60;
                this.yCorrection = -14;

                if (this.player.state.isSlide) {
                    this.xCorrection = this.player.state.isRight ? 10 : 25;
                }
            } else if (this.gunType == GunType.SHOTGUN) {
                this.xCorrection = this.player.state.isRight ? -14 : 50;
                this.yCorrection = -14;

                if (this.player.state.isSlide) {
                    this.xCorrection = this.player.state.isRight ? 8 : 25;
                }
            }

            if((this.player.state.isDoubleJump && (this.gunType == GunType.PISTOL || this.gunType == GunType.SMG)) || !this.player.state.isActive) {
                this.width = 0; // dont show the gun
            } else {
                this.width = (this.gunSprite.recommendedWidth as number);
            }
        } else {
            this.yCorrection = 15;
        }


        // ctx.strokeStyle = 'red';
        // ctx.strokeRect(this.posX + this.xCorrection,this.pos.y + this.yCorrection,this.width, this.height);


        ctx.drawImage(sprites.sheet,
            this.gunSprite.sX + this.currentFrameOffsetX,
            this.gunSprite.sY,
            this.gunSprite.cropWidth,
            this.gunSprite.cropHeight,
            this.posX + this.xCorrection,
            this.pos.y + this.yCorrection,
            this.width,
            this.height
        );

        ctx.restore();
    }

    shoot() {
        const now = Date.now();
        const timeBetweenShots = 1000 / this.fireRate;

        if (now - this.lastShotTime >= timeBetweenShots) {
            this.lastShotTime = now;
            this.player.state.isActive = true;

            const bullet = new Bullet({
                x: (this.posX + this.xCorrection) + this.width,
                y: (this.pos.y + this.yCorrection) + 5,
                bulletType: `${this.gunType}_bullet`,
                gunType: this.gunType,
                isRight: this.player.state.isRight
            });
            bullet.vel.x = bullet.speed;
            this.bulletsShot.push(bullet);
    
            if (this.player.isYou) {
                server.host.emit('player-shoot', {
                    roomId: this.player.currentRoom
                });
            }
        } 
     
    }

    updateBullets() {
        this.player.state.isActive = !(this.player.idleCount <= 0);

        this.bulletsShot.forEach((bullet: Bullet, index: number) => {
            bullet.update();

            if (bullet.hasHitObject) {
                this.bulletsShot.splice(index, 1);
            }
        });
    }

    update() {
        if (!this.isPicked) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;

            this.pos.x += arena.pos.x;
            if (!this.noGravity) this.vel.y += gravity;

            this.vel.y += gravity;

            // fix bouncing effect as platform moves with camera
            if (cameraState == 'up') {
                this.pos.y += arena.speed;
                this.noGravity = true;

            } else if (cameraState == 'down') {
                this.pos.y -= arena.speed;
                this.noGravity = true;

            } else if (cameraState == '') {
                this.noGravity = false;
            }
        } else {
            this.pos.x = this.player.pos.x + this.width / 4;
            this.pos.y = this.player.pos.y + (this.player.height / 2);

            if (this.bulletsShot.length > 0) {
                this.updateBullets();
            }
        }
        this.vel.x *= 1 - this.friction;
        this.draw();
    }
}

export interface IGun {
    x: number,
    y: number,
    gunType: GunType,
    player?: Player | any
}