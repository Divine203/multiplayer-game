import { Game } from "./main";
import { Item } from "./item";
import { Tile } from "./tile";
import { cameraState, currentGame, currentPlayer } from "./general";

export const gravity: number = 1.5;

export class Physics {

    constructor() {
    }

    public topVar(char: any, object: Tile, num: number): boolean {
        return (char.pos.y + char.height <= object.pos.y - num &&
            char.pos.y + char.height + char.vel.y >= object.pos.y - num &&
            char.pos.x + char.width >= object.pos.x &&
            char.pos.x <= object.pos.x + object.width);
    }

    public topVarNoXaxis(char: any, object: Tile, num: number): boolean {
        return (char.pos.y + char.height <= object.pos.y - num &&
            char.pos.y + char.height + char.vel.y >= object.pos.y - num);
    }


    public top(char: any, object: Tile): boolean | any {
        for (let i = 14; i >= 0; i--) {
            if (this.topVar(char, object, i)) {
                return true;
            }
        }
        return false;
    }

    public left(char: any, object: Tile): boolean {
        return (char.pos.x + char.width >= object.pos.x &&
            char.pos.x + char.width + char.vel.x <= object.pos.x + object.width &&
            char.pos.y + char.height >= object.pos.y &&
            char.pos.y <= object.pos.y + object.height);
    }

    public right(char: any, object: Tile): boolean {
        return (char.pos.x <= object.pos.x + object.width &&
            char.pos.x + char.vel.x >= object.pos.x &&
            char.pos.y + char.height >= object.pos.y &&
            char.pos.y <= object.pos.y + object.height);
    }

    public bottom(char: any, object: Tile): boolean {
        return (char.pos.y >= object.pos.y + object.height &&
            char.pos.y + char.vel.y <= object.pos.y + object.height &&
            char.pos.x + char.width >= object.pos.x &&
            char.pos.x <= object.pos.x + object.width);
    }

    public add = (char: any, platform: Tile | any): any => {
        if (this.top(char, platform)) {
            char.vel.y = 0;
            char.pos.y = (platform.pos.y - char.height) - 10;
            if (char.isPlayer) {
                char.currentPlatform = platform;
            }
        } else {
            if (char.isPlayer) {
                char.currentPlatform = null;
            }
        }
        if (this.left(char, platform)) {
            char.vel.x = 0;
            if (char.isPlayer) char.camera.vel.x = 0;
            if (char.isPlayer) {
                if (!this.bottom(char, platform)) char.pos.x = (platform.pos.x - char.width) - 10;
                if (currentGame.keys.left.pressed && char == currentPlayer) currentPlayer.vel.x = -10;
            }
        }
        if (this.right(char, platform)) {
            char.vel.x = 0;
            if (char.isPlayer) char.camera.vel.x = 0;
            if (char.isPlayer) {
                if (!this.bottom(char, platform)) char.pos.x = (platform.pos.x + platform.width) + 10;
                if (currentGame.keys.right.pressed && char == currentPlayer) currentPlayer.vel.x = 10;
            }
        }
        if (this.bottom(char, platform)) {
            char.vel.y += 45;
            if (char.isPlayer) char.camera.vel.y = 0;
        }
    }


}