import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';

export class Projectile implements Actor {
    private _container: PIXI.Container;
    private _sprite: PIXI.Sprite;
    private _vx: number = 0;
    private _vy: number = 0;

    constructor(
        private options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
    }

    public setContainer(container: PIXI.Container) {
        this._container = container;
        this._container.addChild(this._sprite);
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
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
