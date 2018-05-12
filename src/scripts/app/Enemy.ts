import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';

export class Enemy implements Actor {
    private _sprite: PIXI.Sprite;
    private _vx: number = 0;
    private _vy: number = 0;

    constructor(
        private options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
    }

    public addTo(container: PIXI.Container) {
        container.addChild(this._sprite);
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    get sprite() {
        return this._sprite;
    }

    get x() {
        return this._sprite.position.x;
    }

    get y() {
        return this._sprite.position.y;
    }

    get vx() {
        return this._vx;
    }

    get vy() {
        return this._vy;
    }
}