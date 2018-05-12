import { Actor } from 'app/Actor';
import { ActorFactory } from 'app/ActorFactory';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Key } from 'app/Key';
import { KeyCode } from 'app/KeyCode';

export class Player implements Actor {
    private _actorFactory: ActorFactory = new ActorFactory();
    private _container: PIXI.Container;
    private _sprite: PIXI.Sprite;
    private _vx: number = 0;
    private _vy: number = 0;
    private _velocityMultiplier: number = 1;

    constructor(
       private options: ActorOptions,
    ) {
        this._sprite = new PIXI.Sprite(options.texture);
        this._sprite.anchor.set(0.5, 0.5);
        this.bindMovement();
    }

    public setContainer(container: PIXI.Container) {
        this._container = container;
        this._container.addChild(this._sprite);
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    private bindMovement() {
        const shift = new Key(KeyCode.SHIFT, () => {
            this._velocityMultiplier = 3;
        }, () => {
            this._velocityMultiplier = 1;
        });

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

        const space = new Key(KeyCode.SPACE, () => {
            this.shoot();
        }, () => {
            // nada
        });
    }

    private shoot() {
        const bullet = this._actorFactory.createActor(ActorType.Projectile, {
            texture: this._sprite.texture,
        });

        bullet.moveTo(this.x + 300, this.y);
        bullet.setContainer(this._container);
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
        return this._vx * this._velocityMultiplier;
    }

    /** vy */

    get vy() {
        return this._vy * this._velocityMultiplier;
    }
}
