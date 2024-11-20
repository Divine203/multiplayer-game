import { IKeys, Vec2 } from "./interfaces.interface";
import { ctx, currentGame, currentMap, arena, roomId, sprites, currentPhysics, cvs } from "./general";
import { gravity, Physics } from "./physics";
import { server } from "./main";
import { Tile } from "./tile";
import { Item } from "./item";
import { Camera } from "./camera";
import { ISpriteData } from "./sprite";


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

    public primaryGun: any;
    public secondaryGun: any;
    public currentGun: any;
    public viewedGun: any; // [gun, index] => index is the gun's position in the world!

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
        isShooting: false,
        isThrowing: false,
        isThrown: false
    }

    public currentSprite: ISpriteData = this.sprites.idleRight;

    public lastPos: any;

    public horRay: any;
    public verRay: any;

    public idleCount: number = 10;

    constructor(id: string | any, name: string) {
        this.init();
        this.id = id;
        this.name = name;
        this.physics = new Physics();
        this.primaryGun;

        this.camera = new Camera(this);
        this.width = 37.5;
        this.height = 120;
        this.defHeight = 120;
        this.lastPos = { x: 100, y: 0 };
    }

    public init() {
        this.pos = { x: 100, y: 0 } as Vec2;
        this.absolutePos = { x: 100, y: 0 } as Vec2;
        this.vel = { x: 0, y: 0 } as Vec2;
    }

    public pickGun(): void {
        if (this.canPick) {
            this.canPick = false;
            if (this.viewedGun) {
                if (this.currentGun) {
                    this.dropGun();
                }

                this.viewedGun[0].isPicked = true;
                this.viewedGun[0].player = this;
                this.primaryGun = this.viewedGun[0]; // [gun, index]
                this.currentGun = this.primaryGun;
                currentMap.guns.splice(this.viewedGun[1], 1);
            }

            setTimeout(() => {
                this.canPick = true;
            }, 1000);

        }
    }

    public dropGun(): void {
        if (this.currentGun && this.primaryGun) {
            let gunToBeDropped = this.currentGun;
            gunToBeDropped.isPicked = false;
            gunToBeDropped.player = null;
            gunToBeDropped.vel.y -= 30;
            gunToBeDropped.vel.x = this.state.isRight ? 15 : -15;
            currentMap.guns.push(gunToBeDropped);

            this.currentGun = null;
            this.primaryGun = null;
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

            // only push the player up to increase back he's height IF he's on a platform
            if (this.vel.y == 1.5 || this.vel.y == 0) this.pos.y = this.pos.y - this.defHeight / 2;
            this.height = this.defHeight;
        };
    }

    public updateCurrentSprite(): void {
        if (!this.state.isJump && !this.state.isDoubleJump && !this.state.isSlide && !this.state.isThrowing && !this.state.isThrown) {
            this.loopAnimation = true;
            if (!this.state.isMoving) {
                this.state.isSlide = false;
                if (this.state.isRight) {
                    this.currentSprite = !this.state.isShooting ? this.sprites.idleRight : this.sprites.shootRight;
                } else if (this.state.isLeft) {
                    this.currentSprite = !this.state.isShooting ? this.sprites.idleLeft : this.sprites.shootLeft;
                }
            } else {
                this.loopAnimation = true;
                this.state.isSlide = false;
                if (this.state.isRight) {
                    this.currentSprite = this.sprites.runRight;
                    this.reverseAnimation = false;
                } else if (this.state.isLeft) {
                    this.currentSprite = this.sprites.runLeft;
                    this.reverseAnimation = true;
                }
            }
        } else {
            this.loopAnimation = false;
            if (this.state.isJump) {
                this.state.isSlide = false;
                if (this.state.isRight) {
                    this.currentSprite = this.sprites.jumpRight;
                } else if (this.state.isLeft) {
                    this.currentSprite = this.sprites.jumpLeft;
                }
            }
            if (this.state.isThrowing) {
                if (this.state.isRight) {
                    this.currentSprite = this.sprites.throwingRight;
                } else if (this.state.isLeft) {
                    this.currentSprite = this.sprites.throwingLeft;
                }
            } else if (this.state.isThrown) {
                if (this.state.isRight) {
                    this.currentSprite = this.sprites.thrownRight;
                } else if (this.state.isLeft) {
                    this.currentSprite = this.sprites.thrownLeft;
                }
            } else if (this.state.isDoubleJump) {
                this.state.isSlide = false;
                if (this.state.isRight) {
                    this.reverseAnimation = false;
                    this.currentSprite = this.sprites.doubleJumpRight;
                } else if (this.state.isLeft) {
                    this.reverseAnimation = true;
                    this.currentSprite = this.sprites.doubleJumpLeft;
                }
            } else if (this.state.isSlide) {
                if (this.state.isRight) {
                    this.currentSprite = this.sprites.slideRight;
                } else if (this.state.isLeft) {
                    this.currentSprite = this.sprites.slideLeft;
                }
            }
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

        if (this.idleCount > 0) this.idleCount -= 0.05;

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



        this.draw();
        if (this.primaryGun) {
            this.primaryGun.update();
        }
    }
}