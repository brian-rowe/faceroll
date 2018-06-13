import { Actor } from 'app/Actor';
import { ActorManager } from 'app/ActorManager';
import { ActorOptions } from 'app/ActorOptions';
import { ActorSpeed } from 'app/ActorSpeed';
import { ActorType } from 'app/ActorType';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorBase implements Actor {
    protected _sprite: PIXI.Sprite;
    protected _ticker: PIXI.ticker.Ticker;
    protected _velocityMultiplier: ActorSpeed = ActorSpeed.Normal;

    private _lastUpdate: number = new Date().getTime();
    private _money: number = 1; // default
    private _multiplier: number = 0.001; // The timestamps used for movement will be in ms

    /* The actor that caused this actor to spawn */
    private _parent: Actor;

    /* If actors were spawned in a chain reaction, the original spawner */
    private _rootParent: Actor;

    private _vx: number = 0;
    private _vy: number = 0;
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
        protected options: ActorOptions<{}>,
    ) {
        this.setParent();
        this.setRootParent();
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

        /** Find the center point of the target sprite */
        const targetCenter = target.getCenter();

        /* If the sprite covers the center of the other sprite, it hit it */
        return this._sprite.containsPoint(targetCenter);
    }

    public dispose() {
        this.app.stage.removeChild(this._sprite);

        this.removeMovementTracker();

        ActorManager.removeActor(this);
    }

    public getCenter(): PIXI.Point {
        const sprite = this._sprite;
        return new PIXI.Point(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
    }

    public handleCollision(other: Actor) {
        // Default = nothing happens
    }

    public handleCollided(other: Actor) {
        // Default = nothing happens
    }

    public handleOutOfBounds() {
        // Default = destroy
        this.dispose();
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

    protected bounce() {
        this.reverseXDirection();
        this.reverseYDirection();
    }

    protected damage(amount: number ) {
        this.money -= amount;

        if (this.money <= 0) {
            this.dispose();
        }
    }

    protected reverseXDirection() {
        this._vx = -this._vx;
    }

    protected reverseYDirection() {
        this._vy = -this._vy;
    }

    private addMovementTracker() {
        this.app.ticker.add(this.movementTracker);
    }

    private destroyIfOutOfBounds() {
        if (this.isOutOfBounds()) {
            this.handleOutOfBounds();
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
        const tolerance = 0;
        const right = screen.right + tolerance;
        const bottom = screen.bottom + tolerance;

        const result = this.x > right || this.x < -tolerance || this.y > bottom || this.y < -tolerance;

        return result;
    }

    private removeMovementTracker() {
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
                actor.handleCollided(this);
            }
        }
    }

    private setParent() {
        if (this.options.parent) {
            this._parent = this.options.parent;
        }
    }

    /** Recurse up the tree until the top is reached */
    private setRootParent() {
        if (this.parent) {
            let currentActor: Actor = this;

            while (currentActor.parent) {
                currentActor = currentActor.parent;
            }

            this._rootParent = currentActor;
        }
    }

    private setSpeed() {
        if (this.options.speed) {
            const rotation = this.options.rotation || 0;
            const speed = this.options.speed || 0;

            this._velocityMultiplier = speed;

            this._vx = Math.cos(rotation);
            this._vy = Math.sin(rotation);
        }
    }

    private updateLocation() {
        const now = new Date().getTime();
        const deltaTime = (now - this._lastUpdate);
        const delta = deltaTime * this._multiplier;
        this._lastUpdate = now;

        // the game is expected to run at 60fps at all times
        // if it slows down to below 4fps (paused), don't make movement
        if (delta > .25) {
            return;
        }

        const newX = this.x + (this.vx * delta);
        const newY = this.y + (this.vy * delta);

        this.moveTo(newX, newY);
    }

    get actorType() {
        return ActorType.Null;
    }

    get money() {
        return this._money;
    }

    set money(value: number) {
        this._money = value;
    }

    get height() {
        return this._sprite.height;
    }

    get parent() {
        return this._parent || null;
    }

    get rootParent() {
        return this._rootParent || null;
    }

    get x() {
        return this._sprite.position.x;
    }

    get y() {
        return this._sprite.position.y;
    }

    get vx() {
        return this._vx * this._velocityMultiplier;
    }

    set vx(value: ActorSpeed) {
        this._vx = value;
    }

    get vy() {
        return this._vy * this._velocityMultiplier;
    }

    set vy(value: ActorSpeed) {
        this._vy = value;
    }

    get width() {
        return this._sprite.width;
    }
}
