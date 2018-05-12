import { ActorOptions } from 'app/ActorOptions';
import { ActorType } from 'app/ActorType';
import { Player } from 'app/Player';

export class ActorFactory {
    public createActor(actorType: ActorType, options: ActorOptions) {
        switch (actorType) {
            case ActorType.Player:
                return new Player(options);

            default:
                throw new Error('Invalid actor type!');
        }
    }
}
