import { io } from "../node_modules/socket.io-client/build/esm/index";
import { Game } from "./main";
import { Player } from "./player";
import { currentGame, setGame, currentMap, setPlayer, currentPlayer, setMap } from "./general";
import { Map1 } from "./map1";

class Socket {
    public host: any = io('http://localhost:3000');

    constructor() {
        this.initializeSocket();
    }

    public getPlayers(player:Player) {
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
            currentPlayer.pos =  { x: 0, y: 0 };

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
            console.log('Player moved:', data);
            // Update player position in the game
        });

        // Listen for other players leaving
        this.host.on('player-leave', (data: any) => {
            console.log('Player left:', data);
            // Remove the player from the game
        });
    }

    public sendMovementUpdate(position: { x: number; y: number }) {
        this.host.emit('player-move', { playerId: this.host.id, position });
    }

    public update() {
        if(!currentGame) {
            return;
        }
        currentGame.update();
    }
}

export default Socket;