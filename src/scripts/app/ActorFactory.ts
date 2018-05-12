import { Actor } from 'app/Actor';
import { ActorManager } from 'app/ActorManager';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Enemy } from 'app/Enemy';
import { Player } from 'app/Player';
import { Projectile } from 'app/Projectile';
import { PixiAppWrapper as Wrapper } from 'pixi-app-wrapper';

export class ActorFactory {
    constructor(
        private app: Wrapper,
    ) {
    }

    public createActor(actorType: ActorType, options: ActorOptions): Actor {
        let result: Actor;

        switch (actorType) {
            case ActorType.Enemy:
                result = new Enemy(this.app, options);
                break;

            case ActorType.Player:
                result = new Player(this.app, options);
                break;

            case ActorType.Projectile:
                result = new Projectile(this.app, options);
                break;

            default:
                throw new Error('Invalid actor type!');
        }

        ActorManager.addActor(result);

        return result;
    }
}
