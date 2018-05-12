export class Key {
    private _code: number;
    private _isDown: boolean;
    private _isUp: boolean;
    private _press: () => any;
    private _release: () => any;

    constructor(keyCode: number, press: () => any, release: () => any) {
        this._code = keyCode;
        this._isDown = false;
        this._isUp = true;
        this._press = press,
        this._release = release;

        window.addEventListener('keydown', event => this.downHandler(event), false);
        window.addEventListener('keyup', event => this.upHandler(event), false);
    }

    private downHandler(event: KeyboardEvent) {
        if (event.keyCode === this._code) {
            if (this._isUp) {
                this._press();
            }

            this._isDown = true;
            this._isUp = false;
        }

        event.preventDefault();
    }

    private upHandler(event: KeyboardEvent) {
        if (event.keyCode === this._code) {
            if (this._isDown) {
                this._release();
            }
            this._isDown = false;
            this._isUp = true;
        }

        event.preventDefault();
    }
}
