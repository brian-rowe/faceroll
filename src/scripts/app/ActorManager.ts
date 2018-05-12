import { Actor } from 'app/Actor';

/** Singleton to keep track of all actors in memory */
export class ActorManager {
    public static addActor(actor: Actor) {
        this._actors.push(actor);
    }

    public static getActors() {
        return this._actors;
    }

    private static _actors: Actor[] = [];

    private constructor() {}
}
