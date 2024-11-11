import { currentMap, currentPlayer, roomId } from "./general";
import { server } from "./main";
import { UIEvent } from "./data.enum";

export class UI {
    public isMainMenuActive: boolean = true;
    public inRoom: boolean = false;

    public isShowingHelp: boolean = true;

    public currentPage: string = "";
    public prevPage: string = "";

    public pageKeys: any = ['home', 'joinRoom', 'createRoom', 'room'];
    public pages: any = {
        home: this.getEl('home'),
        joinRoom: this.getEl('joinRoom'),
        createRoom: this.getEl('createRoom'),
        room: this.getEl('room')
    };

    public views: any = {
        helper: this.getEl('helper'),
        player_list: this.getEl('player_list')
    }

    public inputs: any = {
        input_playerName_join: this.getEl('input_playerName_join'),
        input_roomId: this.getEl('input_roomId'),
        input_playerName_create: this.getEl('input_playerName_create'),
        input_displayRoomId: this.getEl('input_displayRoomId')
    }

    public buttons: any = {
        btn_createRoom: this.getEl('btn_createRoom'),
        btn_joinRoom: this.getEl('btn_joinRoom'),
        btn_joinWithRoomId: this.getEl('btn_joinWithRoomId'),
        btn_enter_createdRoom: this.getEl('btn_enter_createdRoom'),
        startGame: this.getEl('startGame')
    }


    constructor() {
        this.enterPage(this.pageKeys[0]);
        this.prevPage = this.pageKeys[0];
        this.listeners();
    }

    private closeMainUI() {
        this.pageKeys.forEach((pageKey: string) => {
            this.pages[pageKey].style.display = 'none';
        });
    }

    private enterPage(pageKey: string): void {

        this.prevPage = this.currentPage;
        this.pages[pageKey].style.display = 'flex';
        this.currentPage = pageKey;

        // hide other pages.
        this.pageKeys.filter((pk: string) => (pk !== pageKey)).forEach((pageKey: string, i: number) => {
            this.pages[pageKey].style.display = 'none';
        });
    }

    private backToPrevPage(): void {
        this.enterPage(this.prevPage);
    }

    private toggleHelper() {
        this.isShowingHelp = !this.isShowingHelp;

        if (this.isShowingHelp) this.views.helper.style.display = 'block';
        else this.views.helper.style.display = 'none';
    }

    listeners() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'h':
                    this.toggleHelper();
                    break;

                case 'z':
                    this.backToPrevPage();
                    break;
            }
        });

        this.buttons.btn_createRoom.addEventListener('click', () => {
            this.enterPage(this.pageKeys[2]);
        });

        this.buttons.btn_enter_createdRoom.addEventListener('click', () => {
            if (this.currentPage == this.pageKeys[2]) {
                const nickName: string = this.inputs.input_playerName_create.value;
                if (nickName.trim().length <= 0) {
                    alert('pls enter a valid name');
                } else {
                    server.host.emit('player-create-room', {
                        playerName: nickName
                    });
                }
            }
        });

        this.buttons.btn_joinRoom.addEventListener('click', () => {
            this.enterPage(this.pageKeys[1]);
            this.toggleHelper();
        })

        this.buttons.btn_joinWithRoomId.addEventListener('click', () => {
            if (this.currentPage == this.pageKeys[1]) {
                const nickName: string = this.inputs.input_playerName_join.value;
                const roomId: string = this.inputs.input_roomId.value;

                if (nickName.trim().length <= 0) {
                    alert('pls enter a valid name');
                } else if (roomId.trim().length <= 0) {
                    alert('pls enter a valid room ID');
                } else {
                    server.host.emit('check-and-join-room', {
                        playerName: nickName.trim(),
                        roomId: roomId
                    });
                }
            }
        });

        this.buttons.startGame.addEventListener('click', () => {
            if(this.currentPage == this.pageKeys[3] && currentPlayer.isHost) {
                server.host.emit('start-game', {
                    roomId: roomId
                });  
            } 
        }); 
    };

    public listenUIEvent(event: UIEvent) {
        if (event === UIEvent.CREATED_ROOM) {
            this.enterPage(this.pageKeys[3]);
            this.inputs.input_displayRoomId.value = roomId;

        } else if (event === UIEvent.JOINED_ROOM) {
            this.enterPage(this.pageKeys[3]);
            this.inputs.input_displayRoomId.value = roomId;
        }

        if (event === UIEvent.INITIALIZED_PLAYERS) {
            if (!currentPlayer.isHost) {
                this.buttons.startGame.disabled = true;
            }
        }

        if (event === UIEvent.START_GAME) {
            this.closeMainUI();
            this.isMainMenuActive = false;
            this.inRoom = false;
        }
    }

    update() {

    }

    public displayPlayersInRoom(): void {
        this.views.player_list.innerHTML = '';
        for (let player of currentMap.players) {
            let color = '#fff';
            if (player.isYou && !player.isHost) color = 'yellow';
            else if (player.isHost) color = 'red';

            const markup = `
            <div class="player">
                <p style="color: ${color}">${player.name}</p>
                <span class="profile"></span>
            </div>      
        `;
            this.views.player_list.insertAdjacentHTML('afterbegin', markup);
        };
    }

    private getEl(id: string | any): HTMLElement | any {
        return document.getElementById(id);
    }
}

export interface IAvailableButton {
    x: number,
    y: number,
    width: number,
    height: number,
    type: ButtonTypes,
}

export enum ButtonTypes {
    CREATE_ROOM = 'createRoom',
    ENTER_ROOM = 'enterRoom',
}


export const readableTextByButtonTypes: Record<ButtonTypes, string> = {
    [ButtonTypes.CREATE_ROOM]: "Create a room",
    [ButtonTypes.ENTER_ROOM]: "Enter a rooom"
};

