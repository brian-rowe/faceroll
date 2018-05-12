import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';
import { Key } from 'app/Key';
import { KeyCode } from 'app/KeyCode';

export class Player implements Actor {
    private _sprite: PIXI.Sprite;
    private _vx: number = 0;
    private _vy: number = 0;

    constructor(
       private options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
        this.bindMovement();
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    private bindMovement() {
        const up = new Key(KeyCode.KEY_W, () => {
            this._vy = -1;
        }, () => {
            this._vy = 0;
        });

        const down = new Key(KeyCode.KEY_S, () => {
            this._vy = 1;
        }, () => {
            this._vy = 0;
        });

        const left = new Key(KeyCode.KEY_A, () => { 
            this._vx = -1;
        }, () => {
            this._vx = 0;
        });

        const right = new Key(KeyCode.KEY_D, () => {
            this._vx = 1;
        }, () => {
            this._vx = 0;
        });
    }

    get sprite() {
        return this._sprite;
    }

    /** x */

    get x() {
        return this._sprite.position.x;
    }

    private setX(value: number) {
        this._sprite.position.set(value, this.y);
    }

    /** y */

    get y() {
        return this._sprite.position.y;
    }

    private setY(value: number) {
        this._sprite.position.set(this.x, value);
    }

    /** vx */

    get vx() {
        return this._vx;
    }

    /** vy */

    get vy() {
        return this._vy;
    }
}
