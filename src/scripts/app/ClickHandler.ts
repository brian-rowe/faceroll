export class ClickHandler {
    private _button: number;
    private _isDown: boolean;
    private _isUp: boolean;
    private _press: () => any;
    private _release: () => any;

    constructor(buttonCode: number, press: () => any, release: () => any) {
        this._button = buttonCode;
        this._isDown = false;
        this._isUp = true;
        this._press = press;
        this._release = release;

        window.addEventListener('mousedown', event => this.downHandler(event), false);
        window.addEventListener('mouseup', event => this.upHandler(event), false);
    }

    private downHandler(event: MouseEvent) {
        if (event.button === this._button) {
            if (this._isUp) {
                this._press();
            }

            this._isDown = true;
            this._isUp = false;
        }

        event.preventDefault();
    }

    private upHandler(event: MouseEvent) {
        if (event.button === this._button) {
            if (this._isDown) {
                this._release();
            }
            this._isDown = false;
            this._isUp = true;
        }

        event.preventDefault();
    }
}
