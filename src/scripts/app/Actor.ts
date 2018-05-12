export interface Actor {
    x: number;
    y: number;
    vx: number;
    vy: number;
    moveTo(x: number, y: number): void;
    setContainer(container: PIXI.Container): void;
    setTicker(ticker: PIXI.ticker.Ticker): void;
}
