import { ctx, currentControls, currentMap, currentPlayer, cvs, gunConfigurations, roomId, setControls, setPhysics, spawn, sprites } from "./general";
import { server } from "./main";
import { GunType, ItemType, readableTextByGunType, UIEvent } from "./data.enum";
import { Controls } from "./controls";
import { Physics } from "./physics";
import { ISpriteData, Sprites } from "./sprite";

export class UI {
    public ping: number = 1;
    public isMainMenuActive: boolean = true;
    public inRoom: boolean = false;
    public bgColor: string = '#02020354';

    public isShowingHelp: boolean = true;

    public currentPage: string = "";
    public prevPage: string = "";

    public sprites = new Sprites();

    public profile: ISpriteData = {
        ...this.sprites.createSprite(1970, 0, 50, 70),
        recommendedWidth: 40,
        recommendedHeight: 50
    }

    public pageKeys: any = ['home', 'joinRoom', 'createRoom', 'room'];
    public pages: any = {
        home: this.getEl('home'),
        joinRoom: this.getEl('joinRoom'),
        createRoom: this.getEl('createRoom'),
        room: this.getEl('room')
    };

    public views: any = {
        helper: this.getEl('helper'),
        player_list: this.getEl('player_list'),
        ping: this.getEl('ping'),
        ping_val: this.getEl('ping_val')
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
        if (this.isMainMenuActive || this.inRoom) {
            this.listeners();
        }

        // setTimeout(() => {
        //     this.startAutomatically();
        // });
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

    // for development only...
    private startAutomatically(): void {
        server.host.emit('player-create-room', {
            playerName: 'Divine'
        });

        setTimeout(() => {
            server.host.emit('start-game', {
                roomId: roomId
            });

            spawn(500);
            currentPlayer.pos.x = cvs.width / 2;
        }, 500);
    }

    private toggleHelper() {
        this.isShowingHelp = !this.isShowingHelp;

        if (this.isShowingHelp) this.views.helper.style.display = 'block';
        else this.views.helper.style.display = 'none';
    }

    public listeners() {
        this.getEl('copy-id--btn').addEventListener('click', () => {
            const input = this.getEl('input_displayRoomId');
            input.select();
            input.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(input.value)
                .then(() => alert('Copied to clipboard!'))
                .catch(err => alert('Failed to copy text'));
        });

        document.addEventListener('keydown', (e) => {
            if (this.isMainMenuActive || this.inRoom) {
                switch (e.key) {
                    case 'h':
                        this.toggleHelper();
                        break;

                    case 'z':
                        this.backToPrevPage();
                        break;
                }
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
            if (this.currentPage == this.pageKeys[3] && currentPlayer.isHost) {
                server.host.emit('start-game', {
                    roomId: roomId
                });
            }
        });
    };

    public displayPing() {
        let color = 'lime';
        if (this.ping >= 100 && this.ping < 150) {
            color = 'yellow';
        } else if (this.ping >= 150) {
            color = 'red';
        }

        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, 350, 60);

        ctx.fillStyle = color;
        ctx.font = `18px consolas`;
        ctx.fillText(`${this.ping.toString()} ms`, 25, 35);
    }

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

            const controls = new Controls();
            setControls(controls);
            currentControls.initializeControls();

            const physics = new Physics();
            setPhysics(physics);
        }
    }

    public drawHealthBar() {
        const fullHealthBarWidth: number = 200;
        const barWidth = fullHealthBarWidth * (currentPlayer.hp / 100);
        let color = 'lime';

        if (barWidth <= fullHealthBarWidth / 2 && barWidth > 20) { color = 'yellow' }
        else if (barWidth <= 20) { color = 'red' }

        ctx.fillStyle = 'grey';
        ctx.fillRect(90, 100, fullHealthBarWidth, 8);

        ctx.fillStyle = color;
        ctx.fillRect(90, 100, barWidth, 8);
    }

    public drawArmorHealthBar() {
        if (currentPlayer.armorHp > 0) {
            const fullHealthBarWidth: number = 200;
            const barWidth = fullHealthBarWidth * (currentPlayer.armorHp / 100);
            let color = 'white';

            ctx.fillStyle = 'grey';
            ctx.fillRect(90, 120, fullHealthBarWidth, 8);

            ctx.fillStyle = color;
            ctx.fillRect(90, 120, barWidth, 8);
        }
    }

    public drawPlayerGrenades() {
        if (currentPlayer.grenadeAmount > 0) {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(0, 315, 350, 80);

            for (let i = 0; i < currentPlayer.grenadeAmount; i++) {
                let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = sprites.itemSprites[ItemType.GRENADE];
                ctx.drawImage(this.sprites.sheet,
                    sX,
                    sY,
                    cropWidth,
                    cropHeight,
                    (50 * i) + 30, 340,
                    recommendedWidth as number,
                    recommendedHeight as number
                );

            }
        }
    }

    public drawPlayerGuns() {
        if (currentPlayer.currentGun) {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(0, 165, 350, 150);

            let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = currentPlayer.currentGun.gunSprite;
            let ammo = currentPlayer.currentGun.ammo;
            ctx.drawImage(this.sprites.sheet,
                sX,
                sY,
                cropWidth,
                cropHeight,
                185, 202,
                recommendedWidth as number,
                recommendedHeight as number
            );

            ctx.fillStyle = '#fff';
            ctx.font = `17px consolas`
            ctx.fillText(readableTextByGunType[currentPlayer.currentGun.gunType as GunType], 185, 262);

            if (true) {
                let bulletType = `${currentPlayer.currentGun.gunType}_bullet`;
                let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = sprites.bulletSprites[bulletType];
                let color = '#fff';

                ctx.drawImage(sprites.sheet,
                    sX,
                    sY,
                    cropWidth,
                    cropHeight,
                    190,
                    280,
                    recommendedWidth,
                    recommendedHeight
                );
                color = ammo > 0 ? '#fff' : 'red';
                ctx.fillStyle = color;
                ctx.font = `18px consolas`
                ctx.fillText(ammo.toString(), 260, 290);
            }

        }

        if (currentPlayer.secondaryGun) {
            ctx.fillStyle = '#fff';
            ctx.font = `17px consolas`
            ctx.fillText(readableTextByGunType[currentPlayer.secondaryGun.gunType as GunType], 25, 262);

            if (true) {
                let color = '#fff';
                let ammo = currentPlayer.secondaryGun.ammo;
                let bulletType = `${currentPlayer.secondaryGun.gunType}_bullet`;
                let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = sprites.bulletSprites[bulletType];
                ctx.drawImage(sprites.sheet,
                    sX,
                    sY,
                    cropWidth,
                    cropHeight,
                    25,
                    280,
                    recommendedWidth,
                    recommendedHeight
                );
                color = ammo > 0 ? '#fff' : 'red';
                ctx.fillStyle = color;
                ctx.font = `18px consolas`
                ctx.fillText(ammo.toString(), 100, 290);
            }
            let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = currentPlayer.secondaryGun.gunSprite;

            ctx.drawImage(this.sprites.sheet,
                sX,
                sY,
                cropWidth,
                cropHeight,
                25, 202,
                recommendedWidth as number,
                recommendedHeight as number
            );
        }
    }

    public drawName() {
        ctx.fillStyle = '#fff';
        ctx.font = `17px consolas`
        ctx.fillText(currentPlayer.name, 18, 148);
    }

    public drawViewedGunDetails() {
        const width = 450;
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(cvs.width - width, 0, width, 150);

        if (currentPlayer.viewedGun) {
            const { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = currentPlayer.viewedGun[0].gunSprite;
            ctx.drawImage(this.sprites.sheet,
                sX,
                sY,
                cropWidth,
                cropHeight,
                cvs.width - (width - 40), 60,
                recommendedWidth * 1.4 as number,
                recommendedHeight * 1.4 as number
            );

            let gunType: GunType = currentPlayer.viewedGun[0].gunType;
            let gunName = readableTextByGunType[gunType];
            let { bulletSpeed, fireRate, damage } = gunConfigurations[gunType];

            ctx.fillStyle = '#fff';
            ctx.font = `18px consolas`
            ctx.fillText('Name:', cvs.width - 220, 30);
            ctx.fillText(gunName, cvs.width - 130, 30);
            ctx.fillText('Speed:', cvs.width - 220, 60);
            ctx.fillText(bulletSpeed.toString(), cvs.width - 130, 60);
            ctx.fillText('SPS:', cvs.width - 220, 90);
            ctx.fillText(fireRate.toString(), cvs.width - 130, 90);
            ctx.fillText('Damage:', cvs.width - 220, 120);
            ctx.fillText(damage.toString(), cvs.width - 130, 120);
        }
    }

    update() {
        this.displayPing();
        if (!this.isMainMenuActive && !this.inRoom && this.sprites) {
            ctx.fillStyle = this.bgColor;
            ctx.fillRect(0, 62, 350, 100);

            let { sX, sY, cropWidth, cropHeight, recommendedWidth, recommendedHeight } = this.profile;

            ctx.drawImage(this.sprites.sheet,
                sX,
                sY,
                cropWidth,
                cropHeight,
                25, 74,
                recommendedWidth as number,
                recommendedHeight as number
            );
            this.drawName();
            this.drawHealthBar();
            this.drawArmorHealthBar();
            this.drawPlayerGuns();
            this.drawPlayerGrenades();
            this.drawViewedGunDetails();
        }
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
                <div class="profile">
                    <img src="../assets/player.png"/>
                </div>
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

