import { Tile } from "./tile";
import { currentGame, currentPlayer } from "./general";

export const gravity: number = 1.5;

export class Physics {
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

    public allSides(char: any, object: any) {
        return (
            char.pos.x < object.pos.x + object.width && // char's right edge is past object's left edge
            char.pos.x + char.width > object.pos.x && // char's left edge is before object's right edge
            char.pos.y < object.pos.y + object.height && // char's bottom edge is past object's top edge
            char.pos.y + char.height > object.pos.y // Rect1's top edge is before Rect2's bottom edge
        );
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

                if(char.state.isSlide) {
                    char.state.isRight = false;
                    char.state.isLeft = true;
                }
            }
        }
        if (this.right(char, platform)) {
            char.vel.x = 0;
            if (char.isPlayer) char.camera.vel.x = 0;
            if (char.isPlayer) {
                if (!this.bottom(char, platform)) char.pos.x = (platform.pos.x + platform.width) + 10;
                if (currentGame.keys.right.pressed && char == currentPlayer) currentPlayer.vel.x = 10;

                if(char.state.isSlide) {
                    char.state.isRight = true;
                    char.state.isLeft = false;
                }
            }
        }
        if (this.bottom(char, platform)) {
            char.vel.y += 45;
            if (char.isPlayer) char.camera.vel.y = 0;
        }
    }


}