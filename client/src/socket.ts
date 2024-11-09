import { io } from "../node_modules/socket.io-client/build/esm/index";
import { Game } from "./main";
import { Player } from "./player";
import { currentGame, setGame, currentMap, setPlayer, currentPlayer, setMap } from "./general";
import { Map1 } from "./map1";
import { Tile } from "./tile";

class Socket {
    public host: any = io('http://localhost:3000');

    constructor() {
        this.initializeSocket();
    }

    public getPlayers(player: Player) {
        return { id: player.id, isYou: player.isYou };
    }

    public initializeSocket() {
        // unique to each player.
        this.host.on('connect', () => {
            this.host.emit('player-join', { playerId: this.host.id, position: { x: 0, y: 0 } });
            console.log('Connected to server with ID:', this.host.id);

            const newGame = new Game();
            setGame(newGame);

            const newPlayer = new Player(this.host.id);
            setPlayer(newPlayer);
            currentPlayer.isYou = true;
            currentPlayer.isEnemy = false;
            currentPlayer.pos = { x: 100, y: 630 };
            currentPlayer.absolutePos = { x: 100, y: 630 };

            const newMap = new Map1();
            setMap(newMap);
            currentMap.players.push(currentPlayer);

            console.log(currentMap.players.map(this.getPlayers));
        });


        // Initialize all existing players when the player joins
        this.host.on('initialize-players', (playersData: any) => {
            for (const [playerId, position] of Object.entries(playersData)) {
                if (playerId !== this.host.id) { // Avoid duplicating self
                    const player = new Player(playerId);
                    player.isYou = false;
                    player.isEnemy = true;
                    player.pos = position; // Initialize with correct position
                    player.absolutePos = position;
                    currentMap.players.push(player);
                }
            }
            console.log('Initialized players:', currentMap.players.map(this.getPlayers));
        });

        // Listen for other players joining
        this.host.on('player-join', (data: any) => {
            console.log('Another player joined:', data);

            const player = new Player(data.playerId);
            player.isYou = false;
            player.isEnemy = true;
            currentMap.players.push(player);

            console.log(currentMap.players.map(this.getPlayers));
        });

        // Listen for player movement updates
        this.host.on('player-move', (data: any) => {
            console.log('Player moved:');
            
            const player = currentMap.players.find((p: Player) => p.id === data.playerId);
            if (player && !player.isYou) {

                // we could just slap the data.position to player.pos and call it a day.
                // Turns out dat doesn't F-ing work for reasons i still don't understand.
                // so were going to be using our magic indicator tile as a form of 'relativity'
                // to correctly position other players in our instance of the map.
                currentMap.tiles.filter((t: Tile) => t.isIndicatorTile).forEach((tile: Tile) => {
                    player.pos = { y: tile.pos.y - (tile.initYPos - data.position.y), x: (tile.pos.x + (data.position.x - tile.initXPos) + 40)}; // +40 is simply correcting a slight displacement for more accuracy
                });
            }
        });

        // Listen for other players leaving
        this.host.on('player-leave', (data: any) => {
            console.log('Player left:', data);
            // Remove the player from the game
            const updatedPlayers = currentMap.players.filter((p: Player) => p.id !== data.id);
            currentMap.players = updatedPlayers;
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