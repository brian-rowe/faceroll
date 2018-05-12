import { Actor } from 'app/Actor';
import { ActorManager } from 'app/ActorManager';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorBase implements Actor {
    protected _sprite: PIXI.Sprite;
    protected _ticker: PIXI.ticker.Ticker;
    protected _vx: number = 0;
    protected _vy: number = 0;

    /** Need to share one instance between the add/remove functions */
    private movementTracker: () => void;

    private textStyle = new PIXI.TextStyle({
        fontFamily: 'Verdana',
        fontSize: 18,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 440,
    });

    constructor(
        protected app: Wrapper,
        protected options: ActorOptions,
    ) {
        this.movementTracker = () => this.trackMovement();

        this.draw();
        this.addToContainer();
        this.addTicker();
        ActorManager.addActor(this);
    }

    public detectCollision(target: Actor) {
        /** Find the center point of the target sprite */
        const targetCenter = target.getCenter();

        /**
         * If any part of the host sprite (projectile/attack) hits the center of the target sprite (player/enemy)
         * then that thing has been hit.
         */
        const targetCenterXIsInside = this.isPointInsideSprite(targetCenter, this._sprite);

        return targetCenterXIsInside;
    }

    public dispose() {
        this.app.stage.removeChild(this._sprite);

        this.removeTicker();

        ActorManager.removeActor(this);
    }

    public getCenter(): PIXI.Point {
        const sprite = this._sprite;
        return new PIXI.Point(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
    }

    /** Override this. */
    public handleCollision(other: Actor) {
        // Default = nothing happens
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    private addTicker() {
        this.app.ticker.add(this.movementTracker);
    }

    private draw() {
        this._sprite = new PIXI.Sprite(this.options.texture);
        this._sprite.anchor.set(0.5, 0.5);

        if (this.options.scale) {
            this._sprite.scale.set(this.options.scale.x, this.options.scale.y);
        }
    }

    private removeTicker() {
        this.app.ticker.remove(this.movementTracker);
    }

    private trackMovement() {
        this.updateLocation();
        this.detectCollisions();
    }

    private addToContainer() {
        this.app.stage.addChild(this._sprite);
    }

    private isPointInsideSprite(point: PIXI.Point, sprite: PIXI.Sprite) {
        const boxLeft = sprite.x;
        const boxRight = sprite.x + sprite.width;
        const boxTop = sprite.y;
        const boxBottom = sprite.y + sprite.height;

        const isInsideXPlane = point.x > boxLeft && point.x < boxRight;
        const isInsideYPlane = point.y > boxTop && point.y < boxBottom;

        return isInsideXPlane && isInsideYPlane;
    }

    private detectCollisions() {
        const actors: Actor[] = ActorManager.getActors().filter(actor => actor !== this);

        for (const actor of actors) {
            if (actor.detectCollision(this)) {
                this.handleCollision(actor);
            }
        }
    }

    private updateLocation() {
        const newX = this.x + this.vx;
        const newY = this.y + this.vy;

        this.moveTo(newX, newY);
    }

    get actorType() {
        return ActorType.Null;
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
