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

    private _actorFactory: ActorFactory;;

    constructor() {

        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>('app-canvas', 'canvas', document.getElementById('app-root'));

        // if no view is specified, it appends canvas to body
        const appOptions: WrapperOpts = {
            width: window.innerWidth,
            height: window.innerHeight,
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
        this._actorFactory = new ActorFactory(this.app);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        this.addFullscreenText(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);

        PIXI.loader
            .add('explorer', 'assets/gfx/explorer.png')
            .add('bunny', 'assets/gfx/bunny.png')
            .add('bubble', 'assets/gfx/Bubbles99.png')
            .add('play', 'assets/gfx/play.png')
            .add('stop', 'assets/gfx/stop.png')
            .load(() => this.onAssetsLoaded());
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
        this.createPlayer();
        this.createEnemies();
    }

    private createPlayer() {
        const player = this._actorFactory.createActor(ActorType.Player, {
            texture: PIXI.loader.resources.explorer.texture,
        });

        player.moveTo(300, 300);
    }

    private createEnemies() {
        const enemy = this._actorFactory.createActor(ActorType.Enemy, {
            texture: PIXI.loader.resources.bunny.texture,
        });

        enemy.moveTo(this.app.screen.right - 300, 300);
    }
}
