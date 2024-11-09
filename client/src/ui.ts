import { ctx, cvs } from "./general";

export class UI {
    public isMainMenuActive: boolean = true;

    public primaryBtnDim: number[] = [250, 70];

    public availableButtons: IAvailableButton[] = [];

    constructor() { 
        this.setData();
    }

    public setData() {
        this.availableButtons = [
            {
                x: cvs.width / 2 - 250 / 2,
                y: cvs.height / 2 - 70,
                width: this.primaryBtnDim[0],
                height: this.primaryBtnDim[1],
                type: ButtonTypes.CREATE_ROOM
            },
            {
                x: cvs.width / 2 - 250 / 2,
                y: cvs.height / 2 + 30,
                width: this.primaryBtnDim[0],
                height: this.primaryBtnDim[1],
                type: ButtonTypes.ENTER_ROOM
            }
        ];
    }

    drawBackground() {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
    }


    drawButton(x: number, y: number, text: string) {
        const [w, h] = this.primaryBtnDim;

        ctx.fillStyle = 'orange';
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = 'white';
        ctx.font = '16px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(text, x + w / 2, y + h / 2); // Centering text within the button
    }

    private isInsideRect(
        clickX: number,
        clickY: number,
        rectX: number,
        rectY: number,
        rectWidth: number,
        rectHeight: number): boolean {

        return (
            clickX >= rectX &&
            clickX <= rectX + rectWidth &&
            clickY >= rectY &&
            clickY <= rectY + rectHeight
        );
    }

    listeners() {
        cvs.addEventListener('click', (event) => {
            const rect = cvs.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
        });
    }

    update() {
        if (this.isMainMenuActive) {
            this.setData();
            this.drawBackground();
            
            this.availableButtons.forEach((btn: IAvailableButton) => {
                this.drawButton(btn.x, btn.y, readableTextByButtonTypes[btn.type]);
            });
        }
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

