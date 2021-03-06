import { RotatingSprite } from 'app/rotating-sprite';
import { TweenLite } from 'gsap';
import 'howler';
import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from 'pixi-app-wrapper';

import { Actor } from 'app/Actor';
import { ActorFactory } from 'app/ActorFactory';
import { ActorManager } from 'app/ActorManager';
import { ActorSpeed } from 'app/ActorSpeed';
import { ActorType } from 'app/ActorType';
import { ContextMenuDisabler } from 'app/ContextMenuDisabler';
import { MathUtils } from 'app/MathUtils';
import { Player } from 'app/Player';
import { Point } from 'pixi.js';

/**
 * Showcase for PixiAppWrapper class.
 */
export class Game {
    private app: Wrapper;

    private textStyle = new PIXI.TextStyle({
        fontFamily: 'Verdana',
        fontSize: 18,
        fill: '#FF0000',
        wordWrap: true,
        wordWrapWidth: 440,
    });

    private _actorFactory: ActorFactory;
    private _isGameOver: boolean;
    private _moneyText: PIXI.Text;

    constructor() {
        new ContextMenuDisabler().disable();

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
            backgroundColor: 0x111111,
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

    private drawPlayerMoney(player: Actor): void {
        // Destroy last time, if you can
        if (this._moneyText) {
            this._moneyText.destroy();
        }

        this._moneyText = new PIXI.Text(player.money.toString(), this.textStyle);
        this._moneyText.x = this.app.initialWidth - 128;
        this._moneyText.y = this.app.initialHeight - 24;

        this.app.stage.addChild(this._moneyText);
    }

    private onAssetsLoaded(): void {
        const desiredEnemyCount = 10;

        const player = this.createPlayer();
        this.createEnemies(desiredEnemyCount);

        this.app.ticker.add(deltaTime => {
            if (ActorManager.playerIsDead()) {
                this.addGameOverText(this.app.screen.width / 2, this.app.screen.height / 2);
                ActorManager.removeAllActors();
                this._isGameOver = true;
            }

            if (this._isGameOver) {
                this.app.ticker.stop();
            } else {
                this.drawPlayerMoney(player);

                const enemyCount = ActorManager.getActorsByType(ActorType.Enemy).length;

                if (enemyCount < desiredEnemyCount) {
                    this.createEnemy();
                }

                const powerupCount = ActorManager.getActorsByType(ActorType.Powerup).length;

                if (Math.random() < .01 && powerupCount < 10) {
                    this.createPowerup();
                }
            }
        });
    }

    private createPlayer() {
        const player = this._actorFactory.createActor(ActorType.Player, {
            attribute: {},
            speed: ActorSpeed.Stop,
            texture: PIXI.loader.resources.explorer.texture,
        });

        player.moveTo(this.app.screen.width / 2, this.app.screen.height / 2);

        return player;
    }

    private getPlayer(playerIndex: number) {
        return ActorManager.getActorsByType(ActorType.Player)[playerIndex];
    }

    private getRandomX() {
        return MathUtils.getRandomArbitrary(0, this.app.renderer.width);
    }

    private getRandomY() {
        return MathUtils.getRandomArbitrary(0, this.app.renderer.height);
    }

    /** When spawning enemies, we want there to be a range around the player where an enemy cannot spawn */
    private isInsidePlayerSafeZone(x: number, y: number) {
        const currentPlayer = this.getPlayer(0);

        if (!currentPlayer) {
            return false;
        }

        const safeZone = this.app.screen.width / 8;
        const minX = currentPlayer.x - safeZone;
        const maxX = currentPlayer.x + currentPlayer.width + safeZone;
        const minY = currentPlayer.y - safeZone;
        const maxY = currentPlayer.y + currentPlayer.height + safeZone;

        return x > minX && x < maxX && y > minY && y < maxY;
    }

    private createEnemy() {
        let x: number;
        let y: number;

        do {
            x = this.getRandomX();
            y = this.getRandomY();
        } while (this.isInsidePlayerSafeZone(x, y));

        const enemy = this._actorFactory.createActor(ActorType.Enemy, {
            attribute: {},
            rotation: Math.random(),
            speed: ActorSpeed.Slow,
            texture: PIXI.loader.resources.bunny.texture,
        });

        enemy.moveTo(x, y);
    }

    private createEnemies(amount: number) {
        for (let i = 0; i < amount; i++) {
            this.createEnemy();
        }
    }

    private createPowerup() {
        const x = this.getRandomX();
        const y = this.getRandomY();

        const powerup = this._actorFactory.createActor(ActorType.Powerup, {
            attribute: {},
            scale: new PIXI.Point(0.5, 0.5),
            speed: ActorSpeed.Stop,
            texture: PIXI.loader.resources.stop.texture,
        });

        powerup.moveTo(x, y);
    }
}
