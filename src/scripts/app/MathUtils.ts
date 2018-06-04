export class MathUtils {
    public static getDistanceBetweenPoints(one: PIXI.Point, two: PIXI.Point) {
        const a = one.x - two.x;
        const b = one.y - two.y;

        const c = Math.sqrt(a * a + b * b);

        return c;
    }

    public static getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
