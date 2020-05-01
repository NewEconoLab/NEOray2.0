///<reference path="../neo/SmartContract/NefFile.ts"/>
namespace ThinSdk {
    export class Contract {
        public contractHash: Neo.Uint160;
        public scriptBuilder: ThinNeo.ScriptBuilder;
        public script: Uint8Array;
        public mainfest: string;
        constructor(_contractHash: Neo.Uint160, _scriptBuild: ThinNeo.ScriptBuilder) {
            this.contractHash = _contractHash;
            this.scriptBuilder = _scriptBuild;
        }

        public static newContract(nef: Neo.SmartContract.NefFile, mainfest: string, scriptBuild: ThinNeo.ScriptBuilder): Contract {
            const contract = new Contract(nef.scriptHash, scriptBuild);
            contract.script = nef.script;
            contract.mainfest = mainfest;
            return contract;
        }

        public Call(method: string, ...args: Argument[]) {
            Contract.emitAppCall(this.scriptBuilder, this.contractHash, method, ...args);
        }
        public static emitAppCall(sb: ThinNeo.ScriptBuilder, scriptHash: Neo.Uint160, operation: string, ...args: Argument[]) {
            //for (int i = args.Length - 1; i >= 0; i--)
            //this.scriptBuilder.EmitPush(args[i]);
            //this.scriptBuilder.EmitPush(args.Length);
            //this.scriptBuilder.Emit(OpCode.PACK);
            //this.scriptBuilder.EmitPush(operation);
            //this.scriptBuilder.EmitPush(scriptHash);
            //this.scriptBuilder.EmitSysCall("System.Contract.Call");
            if (args && args.length > 0) {
                sb.EmitArguments(args);
            }
            else {
                sb.EmitPushNumber(Neo.BigInteger.Zero);
                sb.Emit(ThinNeo.OpCode.NEWARRAY);
            }
            sb.EmitPushString(operation);
            sb.EmitPushBytes(new Uint8Array(scriptHash.bits.buffer));
            sb.EmitSysCall("System.Contract.Call");
            return sb;
        }

        public deploy() {
            if (this.script == null || this.script.length == 0)
                throw new Error("script is undefind");
            this.scriptBuilder.EmitPushString(this.mainfest);
            this.scriptBuilder.EmitPushBytes(this.script);
            this.scriptBuilder.EmitSysCall("System.Contract.Create");
        }
    }
    interface Argument {
        type: "String" | "Boolean" | "Hash160" | "Hash256" | "Integer" | "ByteArray" | "Array" | "Address";
        value: string | number | boolean | Array<Argument>
    }
}