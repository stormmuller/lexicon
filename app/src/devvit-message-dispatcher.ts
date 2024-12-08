export class DevvitMessageDispatcher {
    private _handlerLookup: Map<string, (message: unknown) => void>;

    constructor() {
        this._handlerLookup = new Map();        
    }

    public register(messageType: string, handler: (message: any) => void): DevvitMessageDispatcher {
        this._handlerLookup.set(messageType, handler);
        return this;
    }

    public dispatch<T>(messageType: string, message: T) {
        this._handlerLookup.get(messageType)?.(message);
    }
}