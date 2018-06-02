export class ContextMenuDisabler {
    public disable() {
        document.oncontextmenu = () => false;
    }
}
