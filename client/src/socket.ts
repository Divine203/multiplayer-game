import { io } from "../node_modules/socket.io-client/build/esm/index";
import { Game } from "./main";
import { Player } from "./player";
import { currentGame, setGame, currentMap, setPlayer, currentPlayer, setMap, setUI, _ui, setRoomId, roomId } from "./general";
import { Map1 } from "./map1";
import { Tile } from "./tile";
import { UI } from "./ui";

class Socket {
    public host: any = io('http://localhost:3000');

    constructor() {
        this.initializeSocket();
    }

    public initializeSocket() {
        // unique to each player.
        this.host.on('connect', () => {


            const ui = new UI();
            setUI(ui);

            const newGame = new Game();
            setGame(newGame);

            // this.host.on('can-join-room', (playerData: any) => {
            //     console.log('joining room...');
            //     console.log(playerData);
            //     const joiningPlayerData = { playerId: this.host.id, playerName: playerData.playerName, roomId: playerData.roomId };
            //     console.log(joiningPlayerData);
            //     this.host.emit('joined-room', joiningPlayerData);
            //     setRoomId(playerData.roomId);

            //     console.log('Connected to server with ID:', this.host.id);

            //     // const newPlayer = new Player(this.host.id, playerData.playerName);
            //     // setPlayer(newPlayer);
            //     // currentPlayer.isYou = true;
            //     // currentPlayer.isHost = false;
            //     // currentPlayer.isEnemy = false;

            //     // const newMap = new Map1();
            //     // setMap(newMap);
            //     // currentMap.players.push(currentPlayer);
            // });

            this.host.on('created-room', (data: any) => {
                console.log('Room has been created: ' + data.roomId);
                setRoomId(data.roomId);

                console.log('Connected to server with ID:', this.host.id);

                // const newPlayer = new Player(this.host.id, data.playerName);
                // setPlayer(newPlayer);
                // currentPlayer.isYou = true;
                // currentPlayer.isHost = true;
                // currentPlayer.isEnemy = false;

                // const newMap = new Map1();
                // setMap(newMap);

                // currentMap.players[0] = newPlayer;

                // _ui.displayPlayersInRoom();

                // console.log(currentMap.players);
            });
        });


        // Initialize all existing players when the player joins
        this.host.on('initialize-players', (room: any) => {
            const newMap = new Map1();
            setMap(newMap);
            room.players.forEach(({ id, name, isHost, roomId }: { id: string | any, name: string, isHost: boolean, roomId: string | any }) => {
                if (id !== this.host.id) {
                    const player = new Player(id, name);
                    player.isYou = false;
                    player.isEnemy = true;
                    player.isHost = isHost;
                    player.currentRoom = roomId;
                    setPlayer(player);
                    currentMap.players.push(player);
                } else {
                    const player = new Player(id, name);
                    player.isYou = true;
                    player.isEnemy = false;
                    player.isHost = isHost;
                    player.currentRoom = roomId;
                    currentMap.players.push(player);
                }
            });
            _ui.displayPlayersInRoom();
            console.log(currentMap.players);
        });

        // Listen for other players joining
        this.host.on('player-join', (data: any) => {

            if (data.roomId == roomId) {
                console.log('Another player joined:', data);

                // const player = new Player(data.playerId, data.playerName);
                // player.isYou = false;
                // player.isEnemy = true;
                // player.isHost = false;
                // currentMap.players.push(player);

                // console.log(currentMap.players);
            }
        });

        // Listen for player movement updates
        this.host.on('player-move', (data: any) => {
            const player = currentMap.players.find((p: Player) => p.id === data.playerId);
            if (player && !player.isYou) {

                // we could have just slapped the data.position to player.pos and call it a day.
                // Turns out dat doesn't F-ing work for reasons i still don't understand.
                // so were going to be using our magic indicator tile as a form of 'relativity'
                // to correctly position other players in our instance of the map.
                currentMap.tiles.filter((t: Tile) => t.isIndicatorTile).forEach((tile: Tile) => {
                    player.pos = { y: tile.pos.y - (tile.initYPos - data.position.y), x: (tile.pos.x + (data.position.x - tile.initXPos) + 40) }; // +40 is simply correcting a slight displacement for more accuracy
                });
            }
        });

        // Listen for other players leaving
        this.host.on('player-leave', (data: any) => {
            console.log('Player left:', data);
            // Remove the player from the game
            const updatedPlayers = currentMap.players.filter((p: Player) => p.id !== data.id);
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