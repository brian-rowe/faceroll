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

    private _lastUpdate: number = new Date().getTime();
    private _multiplier: number = 0.001; // The timestamps used for movement will be in ms
    private _parent: Actor;
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
        this.setParent();
        this.movementTracker = () => this.trackMovement();

        this.draw();
        this.addToContainer();
        this.addMovementTracker();
        this.setSpeed();
        ActorManager.addActor(this);
    }

    public detectCollision(target: Actor) {
        /* No collisions between parents and children */
        if (this === target.parent || this.parent === target) {
            return false;
        }

        const interactionManager = this.app.renderer.plugins.interaction;

        /** Find the center point of the target sprite */
        const targetCenter = target.getCenter();

        return this._sprite.containsPoint(targetCenter);
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

    public handleCollision(other: Actor) {
        // Default = nothing happens
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    protected rotateToPoint(x: number, y: number) {
        const dy = y - this.y;
        const dx = x - this.x;

        const angle = Math.atan2(dy, dx);

        return angle;
    }

    private addMovementTracker() {
        this.app.ticker.add(this.movementTracker);
    }

    private destroyIfOutOfBounds() {
        if (this.isOutOfBounds()) {
            this.dispose();
        }
    }

    private draw() {
        this._sprite = new PIXI.Sprite(this.options.texture);
        this._sprite.anchor.set(0.5, 0.5);

        if (this.options.scale) {
            this._sprite.scale.set(this.options.scale.x, this.options.scale.y);
        }
    }

    private isOutOfBounds(): boolean {
        const screen = this.app.screen;

        // Leeway so objects can begin and end their life outside of the screen
        const tolerance = 100;
        const right = screen.right + tolerance;
        const bottom = screen.bottom + tolerance;

        const result = this.x > right || this.x < -tolerance || this.y > bottom || this.y < -tolerance;

        return result;
    }

    private removeTicker() {
        this.app.ticker.remove(this.movementTracker);
    }

    private trackMovement() {
        this.updateLocation();
        this.detectCollisions();
        this.destroyIfOutOfBounds();
    }

    private addToContainer() {
        this.app.stage.addChild(this._sprite);
    }

    private detectCollisions() {
        const actors: Actor[] = ActorManager.getActors().filter(actor => actor !== this);

        for (const actor of actors) {
            if (actor.detectCollision(this)) {
                this.handleCollision(actor);
            }
        }
    }

    private setParent() {
        if (this.options.parent) {
            this._parent = this.options.parent;
        }
    }

    private setSpeed() {
        if (this.options.speed) {
            const rotation = this.options.rotation || 0;
            const speed = this.options.speed || 0;

            this._vx = Math.cos(rotation) * speed;
            this._vy = Math.sin(rotation) * speed;
        }
    }

    private updateLocation() {
        const now = new Date().getTime();
        const delta = (now - this._lastUpdate) * this._multiplier;
        this._lastUpdate = now;

        const newX = this.x + (this.vx * delta);
        const newY = this.y + (this.vy * delta);

        this.moveTo(newX, newY);
    }

    get actorType() {
        return ActorType.Null;
    }

    get height() {
        return this._sprite.height;
    }

    get parent() {
        return this._parent || null;
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

    get width() {
        return this._sprite.width;
    }
}
