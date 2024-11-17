import { currentGame, currentPlayer } from "./general";

export class Controls {
    public initializeControls(): void {
        document.addEventListener('keydown', (e) => {
            currentPlayer.primaryGun.idleCount = 10;
            switch (e.key) {
                case 'ArrowUp':
                    if (currentPlayer.canJump) {
                        if (currentPlayer.jumpCount < 2) {
                            if (currentPlayer.jumpCount == 1) {
                                currentPlayer.state.isDoubleJump = true;
                                currentPlayer.state.isJump = false;
                                setTimeout(() => {
                                    currentPlayer.isJumping = true;
                                    currentPlayer.jumpCount++;
                                    currentPlayer.vel.y -= 42;
                                }, 50);
                            } else {
                                currentPlayer.state.isJump = true;
                                currentPlayer.isJumping = true;
                                currentPlayer.isDoubleJump = false;
                                currentPlayer.jumpCount++;
                                currentPlayer.vel.y -= 32;
                            }
                            
                        }
                        currentPlayer.canJump = false;
                    }
                    break;
                case 'ArrowDown':
                    currentPlayer.state.isSlide = true;
                    currentPlayer.shouldSlide = true;
                    
                    break;                
                case 'ArrowLeft':
                    if (!currentGame.keys.right.pressed) {
                        currentGame.keys.left.pressed = true;

                        currentPlayer.state.isMoving = true;
                        currentPlayer.state.isRight = false;
                        currentPlayer.state.isLeft = true;
                        
                    }
                    break;
                case 'ArrowRight':
                    if (!currentGame.keys.left.pressed) {
                        currentGame.keys.right.pressed = true;

                        currentPlayer.state.isMoving = true;
                        currentPlayer.state.isRight = true;
                        currentPlayer.state.isLeft = false;
                    }
                    break;

                case 'x':
                    if (currentPlayer.canShoot) {
                        currentPlayer.primaryGun.shoot();
                        currentPlayer.canShoot = false;
                    }
                    break

                case 'y':
                    currentPlayer.throwItem();
                    break

                case 'a':
                    if (!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = true;
                    }
                    break

                case 'z':
                    if (!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = true;
                    }
                    break

            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    currentPlayer.canJump = true;
                    break;
                case 'ArrowLeft':
                    if (!currentGame.keys.right.pressed) {
                        currentGame.keys.left.pressed = false;

                        currentPlayer.state.isMoving = false;
                    }
                    break;
                case 'ArrowRight':
                    if (!currentGame.keys.left.pressed) {
                        currentGame.keys.right.pressed = false;

                        currentPlayer.state.isMoving = false;
                    }
                    break;

                case 'x':
                    currentPlayer.canShoot = true;
                    break

                case 'a':
                    if (!currentGame.keys.z.pressed) {
                        currentGame.keys.a.pressed = false;
                        currentPlayer.throwItem();
                    }
                    break

                case 'z':
                    if (!currentGame.keys.a.pressed) {
                        currentGame.keys.z.pressed = false;
                        currentPlayer.throwItem();
                    }
                    break
            }
        });
    }
}