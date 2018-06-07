export class VisibilityChangeDetector {
    private _hidden: string;
    private _visibilityChange: string;

    constructor(private onBlur: () => void, private onFocus: () => void) {
        this.vendorSpecificSetup();
        this.registerEventListeners();
    }

    private handleVisibilityChange() {
        if ((document as any)[this._hidden]) {
            this.onBlur();
        } else {
            this.onFocus();
        }
    }

    private registerEventListeners() {
        document.addEventListener(this._visibilityChange, () => this.handleVisibilityChange(), false);
    }

    private vendorSpecificSetup() {
        if (typeof document.hidden !== 'undefined') {
            this._hidden = 'hidden';
            this._visibilityChange = 'visibilitychange';
        } else if (typeof (document as any).msHidden !== 'undefined') {
            this._hidden = 'msHidden';
            this._visibilityChange = 'msvisibilitychange';
        } else if (typeof (document as any).webkitHidden !== 'undefined') {
            this._hidden = 'webkitHidden';
            this._visibilityChange = 'webkitvisibilitychange';
        }
    }
}
