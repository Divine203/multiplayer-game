import { io } from "../node_modules/socket.io-client/build/esm/index";
import { Game } from "./main";
import { Player } from "./player";
import { currentGame, setGame, currentMap, setPlayer, setMap, setUI, _ui, setRoomId, setSprites, spawn, cvs, MAP_BASE, setSound, setControls } from "./general";
import { Map1 } from "./map1";
import { Tile } from "./tile";
import { UI } from "./ui";
import { Vec2 } from "./interfaces.interface";
import { ItemType, UIEvent } from "./data.enum";
import { Sprites } from "./sprite";
import { Gun } from "./gun";
import { Item } from "./item";
import { Sound } from "./sound";

class Socket {
    public host: any = io('http://localhost:3000');

    constructor() {
        this.initializeSocket();
    }

    public initializeSocket() {

        const measurePing = () => {
            const startTime = Date.now();
            this.host.emit('ping', startTime);
        }

        this.host.on('connect', () => {
            alert('press h for help :)');
        
            const ui = new UI();
            setUI(ui);

            const newGame = new Game();
            setGame(newGame);

            const sprites = new Sprites();
            setSprites(sprites);
        });

        this.host.on('pong', (startTime: Date | any) => {
            const ping = Date.now() - startTime;
            _ui.ping = ping;
        });

        this.host.on('created-room', ({ roomId }: { roomId: string | any }) => {
            setRoomId(roomId);
            _ui.listenUIEvent(UIEvent.CREATED_ROOM);
        });

        this.host.on('player-joined', ({ roomId }: { roomId: string | any }) => {
            setRoomId(roomId);
            _ui.listenUIEvent(UIEvent.JOINED_ROOM);
        });

        this.host.on('initialize-players', (room: any) => {
            setInterval(measurePing, 3000);
            const newMap = new Map1();
            setMap(newMap);
            room.players.forEach(({ id, name, isHost, roomId }: { id: string | any, name: string, isHost: boolean, roomId: string | any }) => {
                const notYou = (id !== this.host.id);
                const player = new Player(id, name);

                player.isYou = !notYou;
                player.isEnemy = notYou;
                player.isHost = isHost;
                player.currentRoom = roomId;

                if (player.isYou) {
                    setPlayer(player);
                };
                currentMap.players.push(player);
            });
            _ui.displayPlayersInRoom();
            _ui.listenUIEvent(UIEvent.INITIALIZED_PLAYERS);
        });


        this.host.on('start-game', ({ playersSpawnLocations, gunSpawnLocations, itemSpawnLocations } : any) => {
            currentMap.players.forEach((p: Player, index: number) => {
                let spawnX = playersSpawnLocations[index];
                let d = spawnX - cvs.width/2;

                p.pos.x = spawnX;
                if(p.isYou) {

                    gunSpawnLocations.forEach((g: any) => {
                        const gun = new Gun({ x: g.x, y: MAP_BASE - 1130, gunType: g.type });
                        currentMap.guns.push(gun);
                    });

                    itemSpawnLocations.forEach((i: any) => {
                        const item = new Item({ x: i.x, y: MAP_BASE - 1130, width: 100, height: 100, itemType: i.type });
                        currentMap.items.push(item);
                    });

                    spawn(-d);
                    
                } 
            });
           
            _ui.listenUIEvent(UIEvent.START_GAME);
        });

        this.host.off('player-move').on('player-move', ({ playerId, position, playerState, jumpCount, idleCount }: { playerId: string | any, position: Vec2, playerState: boolean, jumpCount: number, idleCount: number }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);
            if (player && !player.isYou) {

                // we could have just slapped the data.position to player.pos and call it a day.
                // Turns out dat doesn't F-ing work for reasons i still don't understand.
                // so were going to be using our magic indicator tile as a form of 'relativity'
                // to correctly position other players in each client's instance of the map.
                currentMap.tiles.filter((t: Tile) => t.isIndicatorTile).forEach((tile: Tile) => {
                    player.state = playerState;
                    player.idleCount = idleCount;
                    player.jumpCount = jumpCount;
                    if (!player.state.isDoubleJump) {
                        player.sprites.doubleJumpRight.animation.frameX = 0;
                        player.sprites.doubleJumpLeft.animation.frameX = player.sprites.doubleJumpLeft.animation.frames;
                    }
                    player.updateCurrentSprite();
                    player.pos = { y: tile.pos.y - (tile.initYPos - position.y), x: (tile.pos.x + (position.x - tile.initXPos) + 40) }; // +40 is simply correcting a slight displacement for more accuracy
                });
            }
        });


        this.host.off('player-shoot').on('player-shoot', ({ playerId }: { playerId: string | any }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player.currentGun.shoot();
                player.idleCount = 10;
            }
        });

        this.host.off('player-pick-gun').on('player-pick-gun', ({ playerId, gunMapIndex, isToCurrentGun }: { playerId: string | any, gunMapIndex: number, isToCurrentGun: boolean }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player[isToCurrentGun ? 'currentGun' : 'secondaryGun'] = currentMap.guns[gunMapIndex];
                player[isToCurrentGun ? 'currentGun' : 'secondaryGun'].isPicked = true;
                player[isToCurrentGun ? 'currentGun' : 'secondaryGun'].player = player;
                currentMap.guns.splice(gunMapIndex, 1);
            }
        });

        this.host.off('player-switch-gun').on('player-switch-gun', ({ playerId }: any) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player.switchGuns();
            }
        });

        this.host.off('player-drop-gun').on('player-drop-gun', ({ playerId, replaceWithSecondary }: any) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player.dropGun(replaceWithSecondary);
            }
        });

        this.host.off('player-throw').on('player-throw', ({ playerId, throwAngle }: { playerId: string | any, throwAngle: number }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player.throwProjectileAngle = throwAngle;
                player.throwItem();
            }
        });

        this.host.off('player-throwing').on('player-throwing', ({ playerId }: { playerId: string | any }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);

            if (player && !player.isYou) {
                player.state.isThrowing = true;
                player.state.isThrown = false;
                player.idleCount = 10;
            }
        });

        this.host.off('player-cant-join').on('player-cant-join', () => {
            alert('room already has 10 players');
            return;
        });

        this.host.off('room-doesnt-exist').on('room-doesnt-exist', () => {
            alert('room doesnt exist');
            return;
        });

        this.host.off('player-death').on('player-death', ({ playerId }: { playerId: string | any }) => {
            const player: Player = currentMap.players.find((p: Player) => p.id === playerId);
            if(player) {
                player.state.isDead = true;

                if (player.isYou) {
                    player.showDeathAlert();
                    setControls(null);
                }
            }

        });

        this.host.off('barrel-explode').on('barrel-explode', ({ barrelIndex }: { barrelIndex: number }) => {
            currentMap.items.forEach((item: Item, index: number) => {
                if(index == barrelIndex && item.itemType == ItemType.BARREL) {
                    item.explodeCounter = 0;
                }
            });
        });


        this.host.on('player-leave', ({ playerId, name }: { playerId: string | any, name: string }) => {
            const updatedPlayers = currentMap.players.filter((p: Player) => p.id !== playerId);
            currentMap.players = updatedPlayers;
            _ui.displayPlayersInRoom();
        });
    }

    public update() {
        if (!currentGame) {
            return;
        }
        currentGame.update();
    }
}

export default Socket;