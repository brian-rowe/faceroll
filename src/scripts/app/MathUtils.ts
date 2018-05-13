export class MathUtils {
    public static getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}
