import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorFactory } from 'app/ActorFactory';
import { ActorOptions } from 'app/ActorOptions';
import { ActorSpeed } from 'app/ActorSpeed';
import { ActorType } from 'app/ActorType';
import { ClickHandler } from 'app/ClickHandler';
import { KeyCode } from 'app/KeyCode';
import { KeyHandler } from 'app/KeyHandler';
import { MouseCode } from 'app/MouseCode';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Player extends ActorBase {
    private _actorFactory: ActorFactory;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        super(app, options);

        this._actorFactory = new ActorFactory(app);
        this.money = 1e6; // start with a small loan of a million dollars

        this.bindControls();
        this.bindRotation();
    }

    public handleCollision(other: Actor) {
        switch (other.actorType) {
            case ActorType.Powerup: {
                return;
            }

            default: {
                this.dispose();
            }
        }
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
            this.vy = -1;
        }, () => {
            this.vy = 0;
        });
    }

    private bindDown() {
        const down = new KeyHandler(KeyCode.KEY_S, () => {
            this.vy = 1;
        }, () => {
            this.vy = 0;
        });
    }

    private bindLeft() {
        const left = new KeyHandler(KeyCode.KEY_A, () => {
            this.vx = -1;
        }, () => {
            this.vx = 0;
        });
    }

    private bindRight() {
        const right = new KeyHandler(KeyCode.KEY_D, () => {
            this.vx = 1;
        }, () => {
            this.vx = 0;
        });
    }

    private bindShoot() {
        const primaryClickHandler = new ClickHandler(MouseCode.Primary, () => {
            this.shoot();
        }, () => {
            // nada
        });
    }

    private bindSkill() {
        const secondaryClickHandler = new ClickHandler(MouseCode.Secondary, (event: MouseEvent) => {
            return false;
        }, () => {
            // nada
        });
    }

    private shoot() {
        const bullet = this._actorFactory.createActor(ActorType.Projectile, {
            parent: this,
            rotation: this._sprite.rotation,
            speed: ActorSpeed.Fast,
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
}
