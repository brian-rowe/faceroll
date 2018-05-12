import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorBase implements Actor {
    protected _sprite: PIXI.Sprite;
    protected _ticker: PIXI.ticker.Ticker;
    protected _vx: number = 0;
    protected _vy: number = 0;

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
        this.draw();
        this.addToContainer();
        this.trackMovement();
    }

    public moveTo(x: number, y: number) {
        this._sprite.position.set(x, y);
    }

    private draw() {
        this._sprite = new PIXI.Sprite(this.options.texture);
        this._sprite.anchor.set(0.5, 0.5);

        if (this.options.scale) {
            this._sprite.scale.set(this.options.scale.x, this.options.scale.y);
        }
    }

    private trackMovement() {
        this.app.ticker.add(() => {
            const newX = this.x + this.vx;
            const newY = this.y + this.vy;

            this.moveTo(newX, newY);
            this.detectCollisions();
        });
    }

    private addToContainer() {
        this.app.stage.addChild(this._sprite);
    }

    private detectCollision(host: PIXI.Sprite, target: PIXI.Sprite) {
        /** Find the center point of the target sprite */
        const targetCenter = this.getCenter(target);

        /**
         * If any part of the host sprite (projectile/attack) hits the center of the target sprite (player/enemy)
         * then that thing has been hit.
         */
        const targetCenterXIsInside = this.isPointInsideSprite(targetCenter, host);

        return targetCenterXIsInside;
    }

    private getCenter(sprite: PIXI.Sprite): PIXI.Point {
       return new PIXI.Point(sprite.x + sprite.width / 2, sprite.y + sprite.height / 2);
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
        const sprites: PIXI.Sprite[] = this.app.stage.children as PIXI.Sprite[];

        for (const sprite of sprites) {
            if (this._sprite.texture !== sprite.texture && this.detectCollision(this._sprite, sprite)) {
                const richText = new PIXI.Text('TOASTY', this.textStyle);
                richText.anchor.set(0.5, 0.5);
                richText.x = sprite.x;
                richText.y = sprite.y + 100;

                this.app.stage.addChild(richText);
            }
        }
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
