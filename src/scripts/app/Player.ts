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

    private _projectiles: number = 5;

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
                this.damage(1e4);
            }
        }
    }

    public handleCollided(other: Actor) {
        switch (other.actorType) {
            case ActorType.Powerup: {
                this._projectiles += 1;
            }

            default: {
                return;
            }
        }
    }

    /** @override */
    public handleOutOfBounds() {
        return;
    }

    private bindControls() {
        this.bindSprint();
        this.bindUp();
        this.bindLeft();
        this.bindRight();
        this.bindDown();
        this.bindShoot();
        this.bindSkill();
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
        const primaryClickHandler = new ClickHandler(MouseCode.Primary, (event: MouseEvent) => {
            this.shoot(event);
        }, () => {
            // nada
        });
    }

    private bindSkill() {
        const secondaryClickHandler = new ClickHandler(MouseCode.Secondary, (event: MouseEvent) => {
            // later
        }, () => {
            // nada
        });
    }

    private getBulletRotation(bulletIndex: number) {
        const totalBullets: number = this._projectiles;

        // If there is only one bullet, the rotation is zero.
        if (totalBullets === 1) {
            return 0;
        }

        /**
         * Bullets should 'fan out' based on the number of projectiles available to the player
         * If there are an odd number of bullets, the middle bullet should always go through the
         * tip of the mouse pointer
         * This means that the bullets before the middle index will end up with a negative rotation value
         */
        const oddBullets = totalBullets % 2 === 1;

        if (oddBullets) {
            const middleIndex = Math.ceil(totalBullets / 2) - 1;

            /**
             * Rewrite the indexes to be relative to the middle index.
             * For example, if the player has 5 projectiles,
             * the input would be [0, 1, 2, 3, 4],
             * and the output would be [-2, -1, 0, 1, 2]
             */
            const relativeIndex = bulletIndex - middleIndex;

            /**
             * Tighten the spread with a small multiplier for the angle
             */
            const spread = 0.25;

            return relativeIndex * spread;
        }

        return bulletIndex / totalBullets;
    }

    private shoot(event: MouseEvent) {
        for (let i = 0; i < this._projectiles; i++) {
            // If there is only 1 bullet, shoot straight. If multiple, fan them out.
            const rotationOffset = this.getBulletRotation(i);

            const bullet = this._actorFactory.createActor(ActorType.Projectile, {
                parent: this,
                rotation: this._sprite.rotation + rotationOffset,
                speed: ActorSpeed.Fast,
                texture: PIXI.loader.resources.bubble.texture,
                scale: new PIXI.Point(0.3, 0.3),
            });

            bullet.moveTo(this.x + this._sprite.width * 2, this.y);
        }
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
