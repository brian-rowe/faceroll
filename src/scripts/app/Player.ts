import { Actor } from 'app/Actor';
import { ActorBase } from 'app/ActorBase';
import { ActorFactory } from 'app/ActorFactory';
import { ActorOptions } from 'app/ActorOptions';
import { ActorSpeed } from 'app/ActorSpeed';
import { ActorType } from 'app/ActorType';
import { ClickHandler } from 'app/ClickHandler';
import { KeyCode } from 'app/KeyCode';
import { KeyHandler } from 'app/KeyHandler';
import { MathUtils } from 'app/MathUtils';
import { MouseCode } from 'app/MouseCode';
import { ProjectileAttribute } from 'app/ProjectileAttribute';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class Player extends ActorBase {
    private _actorFactory: ActorFactory;

    private _projectiles: number = 4;
    private _projectilePierce: number = 0;

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions<{}>,
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
                this._projectilePierce += 1;
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
        this.bindPause();
        this.bindSprint();
        this.bindUp();
        this.bindLeft();
        this.bindRight();
        this.bindDown();
        this.bindShoot();
        this.bindSkill();
    }

    private bindPause() {
       const pause = new KeyHandler(KeyCode.ESCAPE, () => {
           this.app.togglePause();
        }, () => {
           // nada
       });
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

    private getBulletRotation(bulletIndex: number, spreadMultiplier: number) {
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

        // 5 projectiles -> index 2 [0, 1, >2<, 3, 4]
        // 4 projectiles -> index 1 [0, >1<, 2, 3]
        const middleIndex = Math.ceil(totalBullets / 2) - 1;

        /**
         * Rewrite the indexes to be relative to the middle index.
         * For example, if the player has 5 projectiles,
         * the input would be [0, 1, 2, 3, 4],
         * and the output would be [-2, -1, 0, 1, 2]
         * [0, 1, 2, 3, 4, 5]
         * ->
         * [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]
         */
        const relativeIndex = bulletIndex - middleIndex;

        const offset = oddBullets ? 0 : -0.5; // to make it not centered on the one before the middle

        return (relativeIndex + offset) * spreadMultiplier;
    }

    private shoot(event: MouseEvent) {
        for (let i = 0; i < this._projectiles; i++) {
            // Spread should be based on distance from character to mouse pointer. The closer to the character, the wider the spread.
            const distanceFromSpriteToCursor = MathUtils.getDistanceBetweenPoints(this.getCenter(), new PIXI.Point(event.clientX, event.clientY));

            const minSpread = 0.025;

            // Spread should be large when pointer is close to player, and small when pointer is far away
            const spreadMultiplier = (1 / distanceFromSpriteToCursor) * 2;

            const rotationOffset = this.getBulletRotation(i, spreadMultiplier > minSpread ? spreadMultiplier : minSpread);

            const bulletAttribute = new ProjectileAttribute();
            bulletAttribute.PIERCE = this._projectilePierce;

            const bullet = this._actorFactory.createActor(ActorType.Projectile, {
                attribute: bulletAttribute,
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
