import { Actor } from 'app/Actor';
import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Enemy } from 'app/Enemy';
import { Player } from 'app/Player';

export class ActorFactory {
    public createActor(actorType: ActorType, options: ActorOptions): Actor {
        switch (actorType) {
            case ActorType.Enemy:
                return new Enemy(options);

            case ActorType.Player:
                return new Player(options);

            default:
                throw new Error('Invalid actor type!');
        }
    }
}
