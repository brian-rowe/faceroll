import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';

export class ActorBase implements Actor {
    protected _container: PIXI.Container;
    protected _sprite: PIXI.Sprite;
    protected _vx: number = 0;
    protected _vy: number = 0;

    constructor(
        protected options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
    }

    public setContainer(container: PIXI.Container) {
        this._container = container;
        container.addChild(this._sprite);
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
