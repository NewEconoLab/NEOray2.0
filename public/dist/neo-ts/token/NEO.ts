namespace ThinSdk.Token {
    export class NEO extends BaseToken {
        constructor(sb: ThinNeo.ScriptBuilder) {
            super(Neo.Uint160.parse("0x9bde8f209c88dd0e7ca3bf0af0f476cdd8207789"),sb)
        }
    }
}