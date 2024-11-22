import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx, currentGame, currentMap, arena, sprites, currentPhysics } from "./general";
import { gravity, Physics } from "./physics";
import { server } from "./main";
import { Tile } from "./tile";
import { Item } from "./item";
import { Camera } from "./camera";
import { ISpriteData } from "./sprite";
import { GunType } from "./data.enum";


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
    public canPick: boolean = true;

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

    public secondaryGun: any;
    public currentGun: any;
    public viewedGun: any; // [gun, index] => index is the gun's position in the world array!

    public throwProjectileAngle: number = 0;
    public initYPos: number = 0;
    public sprites: any = {
        idleRight: {
            ...sprites.createSprite(1970, 0, 50, 160),
            recommendedWidth: 37.5,
            recommendedHeight: 120
        },
        idleLeft: {
            ...sprites.createSprite(850, 380, 50, 160),
            recommendedWidth: 37.5,
            recommendedHeight: 120
        },
        runRight: {
            ...sprites.createSpriteAnimation(0, 0, 190, 160, true, 9, 5, 190),
            recommendedWidth: 140,
            recommendedHeight: 120
        },
        runLeft: {
            ...sprites.createSpriteAnimation(980, 380, 190, 160, true, 9, 5, 190),
            recommendedWidth: 140,
            recommendedHeight: 120
        },
        shootRight: {
            ...sprites.createSprite(2130, 20, 90, 140),
            recommendedWidth: 60,
            recommendedHeight: 100
        },
        shootLeft: {
            ...sprites.createSprite(650, 400, 90, 140),
            recommendedWidth: 60,
            recommendedHeight: 100
        },
        jumpRight: {
            ...sprites.createSprite(2310, 0, 100, 160),
            recommendedWidth: 75,
            recommendedHeight: 120,
        },
        jumpLeft: {
            ...sprites.createSprite(460, 380, 100, 160),
            recommendedWidth: 75,
            recommendedHeight: 120
        },
        doubleJumpRight: {
            ...sprites.createSpriteAnimation(0, 190, 190, 160, true, 4, 8, 190),
            recommendedWidth: 100,
            recommendedHeight: 120
        },
        doubleJumpLeft: {
            ...sprites.createSpriteAnimation(1960, 550, 190, 160, true, 4, 8, 190, true),
            recommendedWidth: 100,
            recommendedHeight: 120
        },
        slideLeft: {
            ...sprites.createSprite(250, 420, 130, 160),
            recommendedWidth: 90,
            recommendedHeight: 95
        },
        slideRight: {
            ...sprites.createSprite(2490, 40, 130, 160),
            recommendedWidth: 90,
            recommendedHeight: 95
        },
        throwingRight: {
            ...sprites.createSprite(970, 210, 110, 140),
            recommendedWidth: 80,
            recommendedHeight: 100
        },
        throwingLeft: {
            ...sprites.createSprite(1780, 590, 110, 140),
            recommendedWidth: 80,
            recommendedHeight: 100
        },
        thrownRight: {
            ...sprites.createSprite(1150, 210, 140, 140),
            recommendedWidth: 110,
            recommendedHeight: 100
        },
        thrownLeft: {
            ...sprites.createSprite(1590, 590, 120, 140),
            recommendedWidth: 95,
            recommendedHeight: 100
        }
    }

    public reverseAnimation: boolean = false;
    public loopAnimation: boolean = true;

    public state: any = {
        isRight: true,
        isLeft: false,
        isMoving: false,
        isJump: false,
        isDoubleJump: false,
        isSlide: false,
        isActive: false,
        isThrowing: false,
        isThrown: false
    }
    public currentSprite: ISpriteData = this.sprites.idleRight;
    public lastPos: any;

    public idleCount: number = 10;

    constructor(id: string | any, name: string) {
        this.init();
        this.id = id;
        this.name = name;
        this.physics = new Physics();

        this.camera = new Camera(this);
        this.width = 37.5;
        this.height = 120;
        this.defHeight = 120;
        this.lastPos = { x: 100, y: 0 };

        this.currentPlatform = null;
    }

    public init() {
        this.pos = { x: 100, y: 0 } as Vec2;
        this.absolutePos = { x: 100, y: 0 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public switchGuns() {
        let secondaryGun = this.secondaryGun;
        this.secondaryGun = this.currentGun;
        this.currentGun = secondaryGun;
    }

    private pickUtil = () => {
        this.viewedGun[0].isPicked = true;
        this.viewedGun[0].player = this;
        this.currentGun = this.viewedGun[0];
        currentMap.guns.splice(this.viewedGun[1], 1);
    }

    public pickGun(): void {
        if (this.canPick) {
            this.canPick = false;
            if (this.viewedGun) {
                if (this.currentGun && !this.secondaryGun) {
                    this.viewedGun[0].isPicked = true;
                    this.viewedGun[0].player = this;
                    this.secondaryGun = this.viewedGun[0];
                    currentMap.guns.splice(this.viewedGun[1], 1);
                } else if (!this.currentGun && !this.secondaryGun) {
                    this.pickUtil();
                } else {
                    this.dropGun();
                    this.pickUtil();
                }
            }
            setTimeout(() => { this.canPick = true }, 1000);
        }
    }

    public dropGun(replaceWithSecondary: boolean = false): void {
        const util = () => {
            if (this.currentGun && this.currentGun) {
                let gunToBeDropped = this.currentGun;
                gunToBeDropped.isPicked = false;
                gunToBeDropped.player = null;
                gunToBeDropped.vel.y -= 30;
                gunToBeDropped.vel.x = this.state.isRight ? 15 : -15;
                currentMap.guns.push(gunToBeDropped);

                if (replaceWithSecondary && this.secondaryGun) {
                    this.currentGun = this.secondaryGun;
                    this.secondaryGun = null;
                } else {
                    this.currentGun = null;
                    this.idleCount = 10;
                    this.state.isActive = false;
                }
            }
        }

        if (!this.state.isActive) {
            this.idleCount = 10;
            this.state.isActive = true;
            setTimeout(() => {
                util();
            }, 100);
        } else {
            util();
        }
    }

    public validateViewedGun() {
        // be 100% certain the player is within the gun's reach
        if (this.viewedGun) {
            if (!(['left', 'right', 'top', 'bottom'].some(side => currentPhysics[side](this, this.viewedGun[0])))) { // if the guns aren't colliding
                this.viewedGun = null;
            }
        }
    }

    public throwItem() {
        const currentThrowAngle = this.throwProjectileAngle;
        const item = new Item({
            x: this.state.isLeft ? this.pos.x : this.pos.x + this.width,
            y: this.pos.y + this.height / 2,
            width: 15,
            height: 15,
            isThrowable: true,
            throwRight: this.state.isRight
        });
        item.throw(this.state.isRight ? this.throwProjectileAngle * -1 : this.throwProjectileAngle, 30);
        this.throwProjectileAngle = 0;
        currentMap.items.push(item);

        if (this.isYou) {
            server.host.emit('player-throw', {
                roomId: this.currentRoom,
                throwAngle: currentThrowAngle,
            });
        }
    }

    public slide(): void {
        this.state.isSlide = true;
        this.canSlide = false;
        this.height = this.defHeight / 2;
        this.slideSpeed *= 1 - this.friction;
        if (this.state.isRight) {
            this.vel.x = this.slideSpeed;
        } else {
            this.vel.x = -this.slideSpeed;
        }

        if (this.slideSpeed < 1) {
            this.state.isSlide = false;
            this.canSlide = true;
            this.shouldSlide = false;
            this.slideSpeed = 20;

            // only push the player up to increase back their height IF they're on a platform
            if (this.vel.y == 1.5 || this.vel.y == 0) this.pos.y = this.pos.y - this.defHeight / 1.5;
            this.height = this.defHeight;
        };
    }

    // Helper function for setting the sprite
    private setSprite(sprite: any, reverse: boolean = false): void {
        this.currentSprite = sprite;
        this.reverseAnimation = reverse;
        this.loopAnimation = !this.state.isJump && !this.state.isDoubleJump && !this.state.isSlide;
    }

    public updateCurrentSprite(): void {
        // Reset animation properties
        this.loopAnimation = true;
        this.reverseAnimation = false;

        // Handle states
        if (this.state.isJump) {
            this.setSprite(this.state.isRight ? this.sprites.jumpRight : this.sprites.jumpLeft);
            return;
        }

        if (this.state.isDoubleJump) {
            this.setSprite(
                this.state.isRight ? this.sprites.doubleJumpRight : this.sprites.doubleJumpLeft,
                this.state.isLeft
            );
            return;
        }

        if (this.state.isSlide) {
            this.setSprite(this.state.isRight ? this.sprites.slideRight : this.sprites.slideLeft);
            return;
        }

        if (this.state.isThrowing) {
            this.setSprite(this.state.isRight ? this.sprites.throwingRight : this.sprites.throwingLeft);
            return;
        }

        if (this.state.isThrown) {
            this.setSprite(this.state.isRight ? this.sprites.thrownRight : this.sprites.thrownLeft);
            return;
        }

        // Default behavior: idle or running
        if (!this.state.isMoving) {
            this.setSprite(
                this.state.isRight
                    ? (!this.state.isActive ? this.sprites.idleRight : this.sprites.shootRight)
                    : (!this.state.isActive ? this.sprites.idleLeft : this.sprites.shootLeft)
            );
        } else {
            this.setSprite(
                this.state.isRight ? this.sprites.runRight : this.sprites.runLeft,
                this.state.isLeft
            );
        }
    }
    
    public updateProjectile() {
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

    public drawHealthBar() {
        const barWidth = this.healthBarWidth * (this.hp / 100);
        let color = 'lime';

        if (barWidth <= this.healthBarWidth / 2 && barWidth > 20) { color = 'yellow' }
        else if (barWidth <= 20) { color = 'red' }

        ctx.fillStyle = 'grey';
        ctx.fillRect(this.pos.x, this.pos.y - 60, this.healthBarWidth, 8);

        ctx.fillStyle = color;
        ctx.fillRect(this.pos.x, this.pos.y - 60, barWidth, 8);
    }

    public drawProjectileLine() {
        const angleInRadians = (this.state.isRight ? this.throwProjectileAngle : this.throwProjectileAngle + 180) * (Math.PI / 180);

        const x1 = this.state.isLeft ? this.pos.x : this.pos.x + this.width;
        const y1 = this.pos.y + this.height / 2;
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

    public drawIdleGun() {
        ctx.save();
        ctx.translate(this.state.isRight ? this.pos.x : this.pos.x + this.width * 2 - 10, this.pos.y + 20);
        ctx.rotate(90 * (Math.PI / 180));
        ctx.drawImage(sprites.sheet,
            this.currentGun.gunSprite.sX,
            this.currentGun.gunSprite.sY,
            this.currentGun.gunSprite.cropWidth,
            this.currentGun.gunSprite.cropHeight,
            0, 0,
            this.currentGun.gunSprite.recommendedWidth,
            this.currentGun.gunSprite.recommendedHeight
        );
        ctx.restore();
    }

    public drawSecondaryGun() {
        let xTrasnlate = this.state.isRight ? this.pos.x - 20 : this.pos.x + 20;
        let yTranslate = this.pos.y + 35;

        if (this.state.isSlide) {
            xTrasnlate = this.state.isRight ? this.pos.x - 20 : this.pos.x + 60;
            yTranslate = this.pos.y;
        }

        if (this.secondaryGun.gunType === GunType.PISTOL) {
            yTranslate = this.pos.y + 75;
            xTrasnlate = this.state.isRight ? this.pos.x + 20 : this.pos.x + 20;

            if (this.state.isSlide) {
                yTranslate = this.pos.y + 25;
            }
        }

        ctx.save();
        ctx.translate(xTrasnlate, yTranslate);
        ctx.rotate(45 * (Math.PI / 180));
        ctx.drawImage(sprites.sheet,
            this.secondaryGun.gunSprite.sX,
            this.secondaryGun.gunSprite.sY,
            this.secondaryGun.gunSprite.cropWidth,
            this.secondaryGun.gunSprite.cropHeight,
            0, 0,
            this.secondaryGun.gunSprite.recommendedWidth,
            this.secondaryGun.gunSprite.recommendedHeight
        );
        ctx.restore();
    }

    public draw() {
        const offsetX = this.currentSprite.animate ? (this.currentSprite.animation as any).frameCut * (this.currentSprite.animation as any).frameX : 0;
        let xCorrection = 0;
        let yCorrection = 0;

        if (this.currentSprite == this.sprites.runRight || this.currentSprite == this.sprites.runLeft) {
            xCorrection = -50;
        } else if (this.currentSprite == this.sprites.jumpRight) {
            xCorrection = -16;
        } else if (this.currentSprite == this.sprites.jumpLeft) {
            xCorrection = -20;
        } else if (
            this.currentSprite == this.sprites.shootRight ||
            this.currentSprite == this.sprites.shootLeft ||
            this.currentSprite == this.sprites.throwingLeft ||
            this.currentSprite == this.sprites.throwingRight ||
            this.currentSprite == this.sprites.thrownRight ||
            this.currentSprite == this.sprites.thrownLeft) {
            yCorrection = 20;
        } else if (this.currentSprite == this.sprites.slideRight || this.currentSprite == this.sprites.slideLeft) {
            yCorrection = -15;
        }

        ctx.drawImage(sprites.sheet,
            this.currentSprite.sX + offsetX,
            this.currentSprite.sY,
            this.currentSprite.cropWidth,
            this.currentSprite.cropHeight,
            this.pos.x + xCorrection,
            (this.pos.y + 10) + yCorrection, // add slight corrections (10 is for physics displacement)
            this.currentSprite.recommendedWidth ?? this.width,
            this.currentSprite.recommendedHeight ?? this.height,
        );

        if (this.currentSprite.animate) {
            sprites.animate(this.currentSprite, this.reverseAnimation, this.loopAnimation);
        }
    }


    public udpate() {
        this.updateCurrentSprite();

        if (this.currentGun) {
            if (this.idleCount > 0) {
                this.state.isActive = true;
                this.idleCount -= 0.05
            };
        } else {
            this.state.isActive = false;
            this.idleCount = 10;
        }

        if (this.idleCount <= 1) {
            this.state.isActive = false;

            if (this.currentGun) {
                this.drawIdleGun();
            }
        }

        if (this.isYou) {
            this.pos.y += this.vel.y;
            this.pos.x += this.vel.x;

            this.vel.y += gravity;

            this.camera.followPlayer(currentGame.keys as IKeys);
            this.updateProjectile();

            if (this.vel.y == 1.5 || this.vel.y == 0) {
                this.isJumping = false;
                this.jumpCount = 0;
                this.state.isJump = false;
                this.state.isDoubleJump = false;
                this.sprites.doubleJumpRight.animation.frameX = 0;
                this.sprites.doubleJumpLeft.animation.frameX = this.sprites.doubleJumpLeft.animation.frames;
            }

            // Check if the position has changed from the last position
            if (this.absolutePos.x !== this.lastPos.x || this.absolutePos.y !== this.lastPos.y) {
                server.host.emit('player-move', {
                    position: { x: this.absolutePos.x, y: this.absolutePos.y },
                    roomId: this.currentRoom,
                    jumpCount: this.jumpCount,
                    playerState: this.state
                });
                this.lastPos = { ...this.absolutePos };
            }

            this.validateViewedGun();


        } else if (!this.isYou && this.isEnemy) {
            this.pos.x += arena.pos.x;
            this.pos.y += arena.vel.y;

            this.drawName();
            this.drawHealthBar();
        }

        if (this.shouldSlide) {
            this.slide();
        }

        if (this.secondaryGun) {
            this.drawSecondaryGun();
        }

        if (this.currentPlatform) {
            console.log('yo!');
        }

        this.draw();


        if (this.currentGun) {
            this.currentGun.update();
        }
    }
}