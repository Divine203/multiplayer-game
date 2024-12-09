import { arena, ctx, cvs, setCameraState, currentGame, currentMap, MAP_BASE } from "./general";
import { Player } from "./player";
import { Tile } from "./tile";

export class Camera {
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;
    public player: Player;

    public mapBase: number = MAP_BASE;

    public showCameraTimer = 0;

    constructor(player: Player) {
        this.player = player;
        this.width = cvs.width - (cvs.width / 5);
        this.height = 100;
        this.pos = {
            x: 0,
            y: 0
        };
        this.vel = {
            x: 0,
            y: 0
        };
    }

    public isCamLeft() {
        const cameraRight = this.pos.x + this.width;
        return (cameraRight >= cvs.width);
    }

    public isCamRight() {
        const cameraLeft = this.pos.x;
        return (cameraLeft <= 0);
    }

    public isCamTop() {
        const cameraTop = this.pos.y;
        return (cameraTop <= 0);
    }

    public isCamBottom() {
        const cameraBottom = this.pos.y + this.height;
        return (cameraBottom >= cvs.height);
    }

    public showCamera() {
        this.showCameraTimer++;

        if (this.showCameraTimer > 320) {
            ctx.fillStyle = 'rgba(255, 0, 0 , 0.2)';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }

    public followPlayer() {
        this.pos = {
            x: this.player.pos.x - (this.width / 2 - (this.player.width / 2)),
            y: (this.player.pos.y - (this.height / 2))
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.width = cvs.width - (cvs.width / 5);
        this.height = 700;

        // up down movement
        if (this.isCamTop() && !this.isCamBottom() && !this.player.isJumping) {
            setCameraState('up');
            if (this.player.currentPlatform) {
                this.player.pos.y = (this.player.currentPlatform.pos.y - this.player.height) - 10;
            }
            arena.vel.y = arena.speed;

        } else if (!this.isCamTop() && this.isCamBottom() && !this.player.isJumping) {
            setCameraState('down');
            arena.vel.y = -arena.speed;

        } else if (!this.isCamTop() && !this.isCamBottom()) {
            setCameraState('');
            arena.vel.y = 0;
        }

        // left right movement
        if (currentGame.keys.right.pressed) {
            this.player.vel.x = this.player.speed
            if (this.player.camera.isCamLeft()) {
                this.player.vel.x = 0;
                if (this.player.camera.pos.x + this.player.camera.width < arena.width) {
                    this.player.camera.vel.x = -(this.player.speed);
                }
            }
        } else if (currentGame.keys.left.pressed) {
            this.player.vel.x = -this.player.speed;
            if (this.player.camera.isCamRight()) {
                this.player.vel.x = 0;
                this.player.camera.vel.x = (this.player.speed);
            }

        } else {
            this.player.vel.x = 0;
        }

        if (this.player.shouldSlide) {
            if (this.player.camera.isCamLeft()) {
                if (this.player.camera.pos.x + this.player.camera.width < arena.width) {
                    this.player.camera.vel.x = -(this.player.speed);
                }
            }
            else if (this.player.camera.isCamRight()) {
                this.player.camera.vel.x = (this.player.speed);
            }
        }

        // calculate player's absolute position
        // i.e he/she's ACTUAL position in the game (at real time).
        currentMap.tiles.filter((t: Tile) => t.isIndicatorTile).forEach((tile: Tile) => {
            const yd = tile.pos.y - this.player.pos.y;
            this.player.absolutePos.y = this.mapBase - yd;
            this.player.absolutePos.x = this.player.pos.x - tile.pos.x;
        });

        // this.showCamera();
    }
}
