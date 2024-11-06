import { arena, ctx, currentPlayer, cvs, setCameraState, currentGame } from "./general";
import { Item } from "./item";
import { Game } from "./main";
import { Player } from "./player";

export class Camera {
    public pos: any;
    public vel: any;
    public width: number;
    public height: number;

    constructor() {
        this.width = 1000;
        this.height = 500;
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
        ctx.fillStyle = 'rgba(0, 0, 255 , 0.3)';
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }


    public followPlayer() {
        this.pos = {
            x: currentPlayer.pos.x - (this.width / 2 - (currentPlayer.width / 2)),
            y: (currentPlayer.pos.y - (this.height/2))
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.width = 1000;
        this.height = 750;

        if(this.isCamTop() && !this.isCamBottom() && !currentPlayer.isJumping) {
            setCameraState('up');
            currentPlayer.pos.y = (currentPlayer.currentPlatform.pos.y - currentPlayer.height) - 10;
            arena.vel.y = arena.speed;

        } else if(!this.isCamTop() && this.isCamBottom() && !currentPlayer.isJumping) {
            setCameraState('down');
            arena.vel.y = -arena.speed;
            
        } else if(!this.isCamTop() && !this.isCamBottom()) {
            setCameraState('');
            arena.vel.y = 0;
        }
    }
}