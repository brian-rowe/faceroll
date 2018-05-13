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
import { ActorManager } from 'app/ActorManager';
import { ActorType } from 'app/ActorType';
import { MathUtils } from 'app/MathUtils';

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
        };

        this.app = new Wrapper(appOptions);
        this._actorFactory = new ActorFactory(this.app);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        /* Magic numbers */
        this.addFullscreenText(64, this.app.initialHeight - 24);

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

    private addGameOverText(x: number, y: number): void {
        const gameOverText = new PIXI.Text('YOU DIED', this.textStyle);
        gameOverText.anchor.set(0.5, 0.5);
        gameOverText.x = x;
        gameOverText.y = y;

        this.app.stage.addChild(gameOverText);
    }

    private onAssetsLoaded(): void {
        this.createPlayer();
        this.createEnemies();

        this.app.ticker.add(deltaTime => {
            if (ActorManager.getActorsByType(ActorType.Player).length === 0) {
                this.addGameOverText(this.app.screen.width / 2, this.app.screen.height / 2);
            }
        });
    }

    private createPlayer() {
        const player = this._actorFactory.createActor(ActorType.Player, {
            texture: PIXI.loader.resources.explorer.texture,
        });

        player.moveTo(this.app.screen.width / 2, this.app.screen.height / 2);
    }

    private createEnemies() {
        for (let i = 0; i < 30; i++) {
            const enemy = this._actorFactory.createActor(ActorType.Enemy, {
                speed: 100,
                texture: PIXI.loader.resources.bunny.texture,
            });

            const x = MathUtils.getRandomArbitrary(0, this.app.renderer.width);
            const y = MathUtils.getRandomArbitrary(0, this.app.renderer.height);

            enemy.moveTo(x, y);
        }
    }
}
