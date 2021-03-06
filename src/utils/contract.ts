// tslint:disable-next-line:no-reference
/// <reference path="./inject.d.ts" />
import { IArgument } from "@/containers/invoke/store/interface/invoke.interface";

// tslint:disable-next-line:max-classes-per-file
export class ScriptBuild extends ThinNeo.ScriptBuilder {
    constructor() {
        super();
    }

    /**
     * 
     * @param argument 
     */
    public EmitArguments(param: IArgument): ThinNeo.ScriptBuilder {
        let hex: Uint8Array;
        switch (param.type) {
            case ArgumentDataType.STRING:
                this.EmitPushString(param.value as string);
                break;
            case ArgumentDataType.INTEGER:
                const num = new Neo.BigInteger(param.value as string);
                this.EmitPushNumber(num);
                break;
            case ArgumentDataType.HASH160:
                hex = (param.value as string).hexToBytes();
                if (hex.length !== 20) {
                    throw new Error("not a hex160");
                }
                this.EmitPushBytes(hex.reverse());
                break;
            case ArgumentDataType.HASH256:
                hex = (param.value as string).hexToBytes();
                if (hex.length !== 32) {
                    throw new Error("not a hex256");
                }
                this.EmitPushBytes(hex.reverse());
                break;
            case ArgumentDataType.BYTEARRAY:
                hex = (param.value as string).hexToBytes();
                this.EmitPushBytes(hex);
                break;
            case ArgumentDataType.ADDRESS:
                hex = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(param.value as string);
                this.EmitPushBytes(hex);
                break;
            case ArgumentDataType.ARRAY:
                const argument = param.value as Argument[];
                for (let i = argument.length - 1; i >= 0; i--) {
                    this.EmitArguments(argument[ i ]);
                }
                this.EmitPushNumber(new Neo.BigInteger(argument.length));
                this.Emit(ThinNeo.OpCode.PACK);
                break;
            default:
                throw new Error("No parameter of this type");
        }
        return this;
    }
}
