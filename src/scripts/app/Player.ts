import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorFactory } from 'app/ActorFactory';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Key } from 'app/Key';
import { KeyCode } from 'app/KeyCode';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Player extends ActorBase {
    private _actorFactory: ActorFactory;
    private _velocityMultiplier: number = 1;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);

        this._actorFactory = new ActorFactory(app);

        this.bindControls();
    }

    private bindControls() {
        this.bindSprint();
        this.bindUp();
        this.bindLeft();
        this.bindRight();
        this.bindDown();
        this.bindShoot();
    }

    private bindSprint() {
        const shift = new Key(KeyCode.SHIFT, () => {
            this._velocityMultiplier = 3;
        }, () => {
            this._velocityMultiplier = 1;
        });
    }

    private bindUp() {
        const up = new Key(KeyCode.KEY_W, () => {
            this._vy = -1;
        }, () => {
            this._vy = 0;
        });
    }

    private bindDown() {
        const down = new Key(KeyCode.KEY_S, () => {
            this._vy = 1;
        }, () => {
            this._vy = 0;
        });
    }

    private bindLeft() {
        const left = new Key(KeyCode.KEY_A, () => {
            this._vx = -1;
        }, () => {
            this._vx = 0;
        });
    }

    private bindRight() {
        const right = new Key(KeyCode.KEY_D, () => {
            this._vx = 1;
        }, () => {
            this._vx = 0;
        });
    }

    private bindShoot() {
        const space = new Key(KeyCode.SPACE, () => {
            this.shoot();
        }, () => {
            // nada
        });
    }

    private shoot() {
        const bullet = this._actorFactory.createActor(ActorType.Projectile, {
            texture: PIXI.loader.resources.bubble.texture,
            scale: new PIXI.Point(0.3, 0.3),
        });

        bullet.moveTo(this.x + this._sprite.width, this.y);
    }

    private setX(value: number) {
        this._sprite.position.set(value, this.y);
    }

    private setY(value: number) {
        this._sprite.position.set(this.x, value);
    }

    /** @override */
    get vx() {
        return this._vx * this._velocityMultiplier;
    }

    /** @override */
    get vy() {
        return this._vy * this._velocityMultiplier;
    }
}
