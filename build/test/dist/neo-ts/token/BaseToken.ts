namespace ThinSdk.Token{
    export class BaseToken extends Contract {
        constructor(_contractHash: Neo.Uint160, _scriptBuilder: ThinNeo.ScriptBuilder) {
            super(_contractHash, _scriptBuilder);
        }
        public transfer(from: string, to: string, amount: number) {
            this.Call("transfer", { type: "Address", value: from }, { type: "Address", value: to }, { type: "Integer", value: amount });
            this.scriptBuilder.Emit(ThinNeo.OpCode.THROWIFNOT);
        }

        public balanceOf(...accounts: string[]) {
            for (const account of accounts) {
                this.Call("balanceOf", { type: "Address", value: account })
            }
        }

        public balanceOf_Unite(...accounts: string[]) {
            this.scriptBuilder.EmitPushNumber(Neo.BigInteger.Zero);
            for (const account of accounts) {
                this.Call("balanceOf", { type: "Address", value: account }) 
                this.scriptBuilder.Emit(ThinNeo.OpCode.ADD);
            }
        }

        public decimals() {
            this.Call("decimals");
        }

        public symbol() {
            this.Call("symbol");
        }
    }    
}