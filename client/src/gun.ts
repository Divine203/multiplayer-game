import { Bullet } from "./bullet";
import { GunType } from "./data.enum";
import { arena, cameraState, ctx, cvs, gunConfigurations, sprites } from "./general";
import { Vec2 } from "./interfaces.interface";
import { server } from "./main";
import { gravity } from "./physics";
import { Player } from "./player";
import { ISpriteData } from "./sprite";

export class Gun {
    public shot: boolean = false;
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

    public gunFireSprites: any = {
        machinGunFire1: {
            ...sprites.createSprite(2510, 1150, 180, 260),
            recommendedWidth: 55,
            recommendedHeight: 75
        },
        machinGunFire2: {
            ...sprites.createSprite(2450, 1500, 240, 130),
            recommendedWidth: 95,
            recommendedHeight: 45
        },

        pistolFire: {
            ...sprites.createSprite(2850, 1240, 60, 70),
            recommendedWidth: 25,
            recommendedHeight: 30
        },

        shotGunFire: {
            ...sprites.createSprite(2460, 1750, 240, 110),
            recommendedWidth: 95,
            recommendedHeight: 35
        },

        smallExplosion: {
            ...sprites.createSprite(2830, 1500, 100, 100),
            recommendedWidth: 50,
            recommendedHeight: 50,
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
        this.posX = this.pos.x;
        ctx.save();

        if (this.isPicked) {
            ctx.translate(this.player.width, 0);

            // Flip horizontally if the player is facing left
            if (!this.player.state.isRight) {
                this.posX *= -1;
                ctx.scale(-1, 1);
            }

            // Apply position corrections based on gun type and state
            this.applyPositionCorrection();

            // Hide gun if conditions require it
            if (this.shouldHideGun()) {
                this.width = 0; // Don't show the gun
            } else {
                this.width = this.gunSprite.recommendedWidth as number;
            }

            // Draw gunfire effect if shooting
            if (this.shot) {
                this.drawGunFire();
            }
        } else {
            this.yCorrection = 15; // Default correction when not picked
        }

        // Draw the gun sprite
        ctx.drawImage(
            sprites.sheet,
            this.gunSprite.sX,
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

    // Helper function to apply position corrections
    private applyPositionCorrection(): void {
        const { isRight, isSlide } = this.player.state;

        const corrections = {
            [GunType.BAZUKA]: { x: isRight ? -80 : 17, y: -20 },
            [GunType.AK47]: { x: isSlide ? (isRight ? -14 : 20) : isRight ? -30 : 30, y: -10 },
            [GunType.SMG]: { x: isRight ? -8 : 60, y: -14 },
            [GunType.M14]: { x: isSlide ? (isRight ? -14 : 20) : isRight ? -34 : 40, y: -20 },
            [GunType.PISTOL]: { x: isSlide ? (isRight ? 10 : 25) : isRight ? -4 : 60, y: -14 },
            [GunType.SHOTGUN]: { x: isSlide ? (isRight ? 8 : 25) : isRight ? -14 : 50, y: -14 },
        };

        const correction = corrections[this.gunType] || { x: 0, y: 0 };
        this.xCorrection = correction.x;
        this.yCorrection = correction.y;
    }

    // Helper function to determine if the gun should be hidden
    private shouldHideGun(): boolean {
        const { isDoubleJump, isActive } = this.player.state;
        return (
            (isDoubleJump && (this.gunType === GunType.PISTOL || this.gunType === GunType.SMG)) ||
            !isActive
        );
    }
    drawGunFire() {
        let { machinGunFire1, machinGunFire2, pistolFire, shotGunFire, smallExplosion } = this.gunFireSprites;
        let sprite: ISpriteData = machinGunFire1;
        let xAdd = 75;
        let yAdd = -33;

        if (this.gunType === GunType.M14) {
            sprite = machinGunFire2;
            yAdd = -14;
        } else if (this.gunType === GunType.PISTOL) {
            sprite = pistolFire;
            xAdd = 40;
            yAdd = -14;
        } else if (this.gunType === GunType.SMG) {
            xAdd = 60;
            yAdd = -28;
        } else if (this.gunType === GunType.SHOTGUN) {
            sprite = shotGunFire;
            yAdd = -15;
        } else if (this.gunType === GunType.BAZUKA) {
            sprite = smallExplosion;
            xAdd = 115;
            yAdd = -15;
        }

        ctx.drawImage(sprites.sheet,
            sprite.sX,
            sprite.sY,
            sprite.cropWidth,
            sprite.cropHeight,
            this.posX + this.xCorrection + xAdd,
            this.pos.y + this.yCorrection + yAdd,
            sprite.recommendedWidth as number,
            sprite.recommendedHeight as number,
        );
    }


    shoot() {
        const now = Date.now();
        const timeBetweenShots = 1000 / this.fireRate;

        if (now - this.lastShotTime >= timeBetweenShots) {
            this.shot = true;
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

            setTimeout(() => { this.shot = false }, 100);

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