import {RotatingSprite} from 'app/rotating-sprite';
import {TweenLite} from 'gsap';
import 'howler';
import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from 'pixi-app-wrapper';

import { ActorFactory } from 'app/ActorFactory';
import { ActorType } from 'app/ActorType';

/**
 * Showcase for PixiAppWrapper class.
 */
export class SampleApp {
    private app: Wrapper;

    private textStyle = new PIXI.TextStyle({
        fontFamily: 'Verdana',
        fontSize: 18,
        fill: '#FFFFFF',
        wordWrap: true,
        wordWrapWidth: 440,
    });

    constructor() {

        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>('app-canvas', 'canvas', document.getElementById('app-root'));

        // if no view is specified, it appends canvas to body
        const appOptions: WrapperOpts = {
            width: 1280,
            height: 720,
            scale: 'keep-aspect-ratio',
            align: 'middle',
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x000000,
            view: canvas,
            showFPS: true,
            showMediaInfo: true,
        };

        this.app = new Wrapper(appOptions);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);
        this.addFullscreenText(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);

        PIXI.loader
            .add('explorer', 'assets/gfx/explorer.png')
            .add('bunny', 'assets/gfx/bunny.png')
            .add('bubble', 'assets/gfx/Bubbles99.png')
            .add('spineboy', 'assets/gfx/spineboy.json')
            .add('play', 'assets/gfx/play.png')
            .add('stop', 'assets/gfx/stop.png')
            .load(() => this.onAssetsLoaded());
    }

    public drawSquare(x = 0, y = 0, s = 50, r = 10): void {
        this.drawRoundedRectangle(x, y, s, s, r);
    }

    public drawRoundedRectangle(x = 0, y = 0, w = 50, h = 50, r = 10): void {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0xFF00BB, 0.25);
        graphics.drawRoundedRect(x, y, w, h, r);
        graphics.endFill();

        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.on('pointerup', () => {
            // pointerdown does not trigger a user event in chrome-android
            Wrapper.toggleFulscreen(document.getElementById('app-root'));
        });

        this.app.stage.addChild(graphics);
    }

    public drawScreenBorder(width = 4): void {
        const halfWidth = width / 2;

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(width, 0xFF00FF, 1);
        graphics.drawRect(halfWidth, halfWidth, this.app.initialWidth - width, this.app.initialHeight - width);

        this.app.stage.addChild(graphics);
    }

    private onResizeStart(): void {
        window.console.log('RESIZE STARTED!');
    }

    private onResizeEnd(args: any): void {
        window.console.log('RESIZE ENDED!', args);
    }

    private addFullscreenText(x: number, y: number): void {
        const richText = new PIXI.Text('faceroll.io', this.textStyle);
        richText.anchor.set(0.5, 0.5);
        richText.x = x;
        richText.y = y;

        this.app.stage.addChild(richText);

    }

    private onAssetsLoaded(): void {
        const actorFactory = new ActorFactory();
        const player = actorFactory.createActor(ActorType.Player, {
            texture: PIXI.loader.resources.explorer.texture,
        });

        this.app.stage.addChild(player.sprite);

        player.moveTo(this.app.initialWidth / 2, this.app.initialHeight / 2);
    }
}
