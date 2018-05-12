import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorBase implements Actor {
    protected _sprite: PIXI.Sprite;
    protected _ticker: PIXI.ticker.Ticker;
    protected _vx: number = 0;
    protected _vy: number = 0;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
        this.addToContainer();
        this.trackMovement();
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    private trackMovement() {
        this.app.ticker.add(() => {
            const newX = this.x + this.vx;
            const newY = this.y + this.vy;

            this.moveTo(newX, newY);
        });
    }

    private addToContainer() {
        this.app.stage.addChild(this._sprite);
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
