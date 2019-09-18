import { IInvokeStore, IArgument } from "./interface/invoke.interface";
import OutputStore from '@/containers/output/store/index.store';
import { action } from "mobx";
import { ScriptBuild } from "@/utils/contract";
import codeStore from "@/containers/code/store/code.store";
import { invokescript } from "./api/index.api";
import { OutputType } from "@/containers/output/store/interface/index.interface";
import { TransactionConfirm } from "@/utils/wallet";
import { getNotify } from "@/store/api/common.api";
import intl from "@/store/intl";
import { HASH_CONFIG } from "@/config";

class InvokeStore implements IInvokeStore {
    @action public buildScript = (args: IArgument[]) => {

        const sb = new ScriptBuild();
        // 生成随机数
        const random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(new Uint8Array(32));
        const random_int = Neo.BigInteger.fromUint8Array(random_uint8);
        // 塞入随机数
        sb.EmitPushNumber(random_int);
        sb.Emit(ThinNeo.OpCode.DROP);
        for (let i = args.length - 1; i >= 0; i--) {
            sb.EmitArguments(args[ i ]);
        }
        const appcall = Neo.Uint160.parse(codeStore.codeid);
        // let appcall = this.currentContract.scripthash.hexToBytes();
        sb.EmitAppCall(appcall);
        return sb.ToArray();
    }

    @action public invoke = async (args: Argument[], netfee: string, sysfee: string, attached: string) => {
        // const script = this.buildScript(args);
        const argument: SendScriptArgs = {
            scriptHash: codeStore.codeid.replace('0x', ''),
            scriptArguments: args,
            description: "合约测试",
            sysfee,
            fee: netfee,
            attachedAssets: { [ HASH_CONFIG.ID_GAS ]: attached }
        }
        const result = await Teemo.NEO.sendScript(argument);
        const name = codeStore.filename;
        if (result) {
            OutputStore.addOutputMessage(
                {
                    "type": OutputType.tree,
                    "title": `${intl.message.output[ 2 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                    "value": {
                        'System Fee': sysfee ? sysfee + "GAS" : "0GAS",
                        'Network Fee': netfee ? netfee + "GAS" : "0GAS",
                        'Attached Gas': attached ? netfee + "GAS" : "0GAS",
                        "Invoke Argument": JSON.stringify(args, null, 3),
                        // 'Script hex': script.toHexString()
                    }
                }
            )
            TransactionConfirm(result.txid, (data => {
                getNotify(result.txid)
                    .then(res => {
                        OutputStore.addOutputMessage(
                            {
                                "type": OutputType.tree,
                                "title": `${intl.message.output[ 3 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                                "value": {},
                                "result": res[ 0 ],
                                "txid": result.txid
                            }
                        )
                    })
            }))
            return result;
        }
        else {
            throw new Error("Transaction fail")
        }
    }

    @action public invokeRead = async (args: IArgument[]) => {
        const script = this.buildScript(args);
        const name = codeStore.filename;
        const result = await invokescript(script.toHexString());
        OutputStore.addOutputMessage(
            {
                "type": OutputType.tree,
                "title": `${intl.message.output[ 8 ]}：${name}`,
                "value": {
                    "Invoke Paramenters": JSON.stringify(args),
                    "Result Code": ""
                },
                "result": result[ 0 ]
            }
        )
        return result
    }
}

export default new InvokeStore();