import { io } from "../node_modules/socket.io-client/build/esm/index";
import { Game } from "./main";
import { Player } from "./player";
import { currentGame, setGame, currentMap, setPlayer, setMap, setUI, _ui, setRoomId } from "./general";
import { Map1 } from "./map1";
import { Tile } from "./tile";
import { UI } from "./ui";
import { Vec2 } from "./interfaces.interface";
import { UIEvent } from "./data.enum";

class Socket {
    public host: any = io('http://localhost:3000');

    constructor() {
        this.initializeSocket();
    }

    public initializeSocket() {
        this.host.on('connect', () => {
            console.log('Connected to server with ID:', this.host.id);
            const ui = new UI();
            setUI(ui);

            const newGame = new Game();
            setGame(newGame);
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
            const newMap = new Map1();
            setMap(newMap);
            room.players.forEach(({ id, name, isHost, roomId }: { id: string | any, name: string, isHost: boolean, roomId: string | any }) => {
                const notYou = (id !== this.host.id);

                const player = new Player(id, name);
                player.isYou = !notYou;
                player.isEnemy = notYou;
                player.isHost = isHost;
                player.currentRoom = roomId;

                if (!notYou) setPlayer(player);
                currentMap.players.push(player);
            });
            _ui.displayPlayersInRoom();
            _ui.listenUIEvent(UIEvent.INITIALIZED_PLAYERS);
            console.log(currentMap.players);
        });


        this.host.on('start-game', () => {
            _ui.listenUIEvent(UIEvent.START_GAME);
        }); 

        this.host.on('player-move', ({ playerId, position }: { playerId: string | any, position: Vec2 }) => {
            const player = currentMap.players.find((p: Player) => p.id === playerId);
            if (player && !player.isYou) {

                // we could have just slapped the data.position to player.pos and call it a day.
                // Turns out dat doesn't F-ing work for reasons i still don't understand.
                // so were going to be using our magic indicator tile as a form of 'relativity'
                // to correctly position other players in our instance of the map.
                currentMap.tiles.filter((t: Tile) => t.isIndicatorTile).forEach((tile: Tile) => {
                    player.pos = { y: tile.pos.y - (tile.initYPos - position.y), x: (tile.pos.x + (position.x - tile.initXPos) + 40) }; // +40 is simply correcting a slight displacement for more accuracy
                });
            }
        });

        this.host.on('player-leave', ({ playerId, name }: { playerId: string | any, name: string }) => {
            console.log(`Player ${name} left`);

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