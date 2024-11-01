import { IKeys } from "./interfaces.interface";
import { Game } from "./main";
import { Player } from "./player";

export class Controls {
    public game: any;

    constructor(Game: Game) {
        this.game = Game;
        this.controls();
    }

    public controls(): void {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.game.player.isJumping = true;
                    this.game.player.vel.y -= 32;
                    break;
                case 'ArrowLeft':
                    if (this.game.keys.right.pressed === false) {
                        this.game.keys.left.pressed = true;
                    }
                    break;
                case 'ArrowRight':
                    if (this.game.keys.left.pressed === false) {
                        this.game.keys.right.pressed = true;
                    }
                    break;
            }
        });
    
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    break;
                case 'ArrowLeft':
                    if (this.game.keys.right.pressed === false) {
                        this.game.keys.left.pressed = false;
                    }
                    break;
                case 'ArrowRight':
                    if (this.game.keys.left.pressed === false) {
                        this.game.keys.right.pressed = false;
                    }
                    break;
            }
        });
    }
}