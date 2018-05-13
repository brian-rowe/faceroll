import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorFactory } from 'app/ActorFactory';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { ClickHandler } from 'app/ClickHandler';
import { KeyCode } from 'app/KeyCode';
import { KeyHandler } from 'app/KeyHandler';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';
import { MouseCode } from 'app/MouseCode';

export class Player extends ActorBase {
    private _actorFactory: ActorFactory;
    private _velocityMultiplier: number = 500;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);

        this._actorFactory = new ActorFactory(app);

        this.bindControls();
        this.bindRotation();
    }

    public handleCollision(other: Actor) {
        this.dispose();
    }

    private bindControls() {
        this.bindSprint();
        this.bindUp();
        this.bindLeft();
        this.bindRight();
        this.bindDown();
        this.bindShoot();
    }

    private bindRotation() {
        this.app.ticker.add(() => {
            const mousePosition: PIXI.Point = this.app.renderer.plugins.interaction.mouse.global;
            this._sprite.rotation = this.rotateToPoint(mousePosition.x, mousePosition.y);
        });
    }

    private bindSprint() {
        const shift = new KeyHandler(KeyCode.SHIFT, () => {
            this._velocityMultiplier = 1000;
        }, () => {
            this._velocityMultiplier = 500;
        });
    }

    private bindUp() {
        const up = new KeyHandler(KeyCode.KEY_W, () => {
            this._vy = -1;
        }, () => {
            this._vy = 0;
        });
    }

    private bindDown() {
        const down = new KeyHandler(KeyCode.KEY_S, () => {
            this._vy = 1;
        }, () => {
            this._vy = 0;
        });
    }

    private bindLeft() {
        const left = new KeyHandler(KeyCode.KEY_A, () => {
            this._vx = -1;
        }, () => {
            this._vx = 0;
        });
    }

    private bindRight() {
        const right = new KeyHandler(KeyCode.KEY_D, () => {
            this._vx = 1;
        }, () => {
            this._vx = 0;
        });
    }

    private bindShoot() {
        const leftMouse = new ClickHandler(MouseCode.Primary, () => {
            this.shoot();
        }, () => {
            // nada
        });
    }

    private shoot() {
        const bullet = this._actorFactory.createActor(ActorType.Projectile, {
            parent: this,
            rotation: this._sprite.rotation,
            speed: 1000,
            texture: PIXI.loader.resources.bubble.texture,
            scale: new PIXI.Point(0.3, 0.3),
        });

        bullet.moveTo(this.x + this._sprite.width * 2, this.y);
    }

    private setX(value: number) {
        this._sprite.position.set(value, this.y);
    }

    private setY(value: number) {
        this._sprite.position.set(this.x, value);
    }

    get actorType() {
        return ActorType.Player;
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
