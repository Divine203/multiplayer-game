import { Game } from "./main";
import { Item } from "./item";
import { Tile } from "./tile";

export const gravity: number = 1.5;

export class Physics {
    public game: Game;

    constructor(game: Game) {
        this.game = game;
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
        const result =  (
            this.topVar(char, object, 14) ||
            this.topVar(char, object, 13) ||
            this.topVar(char, object, 12) ||
            this.topVar(char, object, 11) ||
            this.topVar(char, object, 10) ||
            this.topVar(char, object, 9) ||
            this.topVar(char, object, 8) ||
            this.topVar(char, object, 7) ||
            this.topVar(char, object, 6) ||
            this.topVar(char, object, 5) ||
            this.topVar(char, object, 4) ||
            this.topVar(char, object, 3) ||
            this.topVar(char, object, 2) ||
            this.topVar(char, object, 1) ||
            this.topVar(char, object, 0)
        );
        return result;
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

    public add = (char: any, platform: Tile): any => {
        if (this.top(char, platform)) { 
            char.vel.y = 0;
            char.pos.y = (platform.pos.y - char.height) - 10;
            if(char.isPlayer) char.currentPlatform = platform;
            if(char.isPlayer) char.camera.vel.y = 0;
        } 
        if (this.left(char, platform)) {
            char.vel.x = 0;
            if(char.isPlayer) char.camera.vel.x = 0;
            if (!this.bottom(char, platform)) char.pos.x = (platform.pos.x - char.width) - 1;
            if (this.game.keys.left.pressed && char == this.game.player) this.game.player.vel.x = -10;
        }
        if (this.right(char, platform)) {
            char.vel.x = 0;
            if(char.isPlayer) char.camera.vel.x = 0;
            if (!this.bottom(char, platform)) char.pos.x = (platform.pos.x + platform.width) + 1;
            if (this.game.keys.right.pressed && char == this.game.player) this.game.player.vel.x = 10;
        }
        if (this.bottom(char, platform)) {
            char.vel.y = 0;
            if(char.isPlayer) char.camera.vel.y = 0;
        }
    }


}