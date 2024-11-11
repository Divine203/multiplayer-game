import { ctx, currentMap, cvs, roomId } from "./general";
import { server } from "./main";
import Socket from "./socket";

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
                    this.enterPage(this.pageKeys[3]);
                    server.host.emit('player-create-room', {
                        playerName: nickName,
                        playerId: server.host.id,
                    });
                    setTimeout(() => {
                        this.inputs.input_displayRoomId.value = roomId;
                    }, 1000);

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
                    // join room with that roomId;
                    server.host.emit('check-and-join-room', {
                        playerName: nickName.trim(),
                        playerId: server.host.id.trim(),
                        roomId: roomId
                    });
                    this.enterPage(this.pageKeys[3]);
                }
            }
        });
    }

    update() {

    }

    public displayPlayersInRoom(): void {
        this.views.player_list.innerHTML = '';
        for (let player of currentMap.players) {
            const markup = `
                <div class="player">
                    <p style=${player.isHost ? "color: red;" : "color: yellow;"}>${player.name}</p>
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

