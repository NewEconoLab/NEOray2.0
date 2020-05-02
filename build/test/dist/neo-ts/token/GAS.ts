namespace ThinSdk.Token {
    export class GAS extends BaseToken {
        constructor(sb: ThinNeo.ScriptBuilder) {
            super(Neo.Uint160.parse("0x8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b"), sb)
        }
    }
}