import { currentGame, currentPlayer } from "./general";
import { server } from "./main";

export class Controls {
    public initializeControls(): void {
        document.addEventListener('keydown', (e) => {
            currentPlayer.idleCount = 10;
            switch (e.key) {
                case 'ArrowUp':
                    if (currentPlayer.canJump) {
                        if (currentPlayer.jumpCount < 2) {
                            currentPlayer.currentPlatform = null;
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
                    if (currentPlayer.canShoot && currentPlayer.currentGun) {
                        currentPlayer.idleCount = 10;
                        currentPlayer.currentGun.shoot();
                        currentPlayer.canShoot = false;
                    }
                    break

                case 'a':
                    if (currentPlayer.grenadeAmount > 0) {
                        if (currentPlayer.canSlide) {
                            if (!currentGame.keys.z.pressed) {
                                currentGame.keys.a.pressed = true;
                                currentPlayer.state.isThrowing = true;
                                currentPlayer.state.isThrown = false;

                                server.host.emit('player-throwing', {
                                    roomId: currentPlayer.currentRoom,
                                });
                            }
                        }
                    }
                    break

                case 'z':
                    if (currentPlayer.grenadeAmount > 0) {
                        if (currentPlayer.canSlide) {
                            if (!currentGame.keys.a.pressed) {
                                currentGame.keys.z.pressed = true;
                                currentPlayer.state.isThrowing = true;
                                currentPlayer.state.isThrown = false;
                            }
                        }
                    }
                    break
                case 't':
                    if (!currentGame.keys.y.pressed) {
                        currentGame.keys.t.pressed = true;
                        currentPlayer.pickGun();
                    }
                    break

                case 'y':
                    if (!currentGame.keys.t.pressed) {
                        currentGame.keys.y.pressed = true;
                        currentPlayer.dropGun(true);
                    }
                    break;

                case 'v':
                    if (!currentGame.keys.t.pressed && !currentGame.keys.y.pressed) {
                        if (currentPlayer.secondaryGun) {
                            currentPlayer.switchGuns();
                        }
                    }
                    break;

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
                    if (currentPlayer.grenadeAmount > 0) {
                        if (currentPlayer.canSlide) {
                            if (!currentGame.keys.z.pressed) {
                                currentPlayer.canSlide = false;
                                currentPlayer.canShoot = false;
                                currentGame.keys.a.pressed = false;
                                currentPlayer.throwItem();
                                currentPlayer.state.isThrowing = false;
                                currentPlayer.state.isThrown = true;

                                setTimeout(() => {
                                    currentPlayer.canSlide = true;
                                    currentPlayer.canShoot = true;
                                    currentPlayer.state.isThrown = false;
                                }, 500);
                            }
                        }
                    }

                    break

                case 'z':
                    if (currentPlayer.grenadeAmount > 0) {
                        if (currentPlayer.canSlide) {
                            if (!currentGame.keys.a.pressed) {
                                currentPlayer.canSlide = false;
                                currentPlayer.canShoot = false;
                                currentGame.keys.z.pressed = false;
                                currentPlayer.throwItem();
                            }
                        }
                    }
                    break

                case 't':
                    if (!currentGame.keys.y.pressed) {
                        currentGame.keys.t.pressed = false;
                    }
                    break

                case 'y':
                    if (!currentGame.keys.t.pressed) {
                        currentGame.keys.y.pressed = false;
                    }
                    break;
            }
        });
    }
}