import {
    IInvokeStore,
    // IArgument
} from "./interface/invoke.interface";
import OutputStore from '@/containers/output/store/index.store';
import { action } from "mobx";
// import { ScriptBuild } from "@/utils/contract";
import codeStore from "@/containers/code/store/code.store";
import { invokescript, getcontractstate } from "./api/index.api";
import { OutputType } from "@/containers/output/store/interface/index.interface";
import { TransactionConfirm } from "@/utils/wallet";
import { getNotify } from "@/store/api/common.api";
import intl from "@/store/intl";
import { HASH_CONFIG } from "@/config";
import deployStore from "@/containers/deploy/store/deploy.store";

class InvokeStore implements IInvokeStore {
    @action public buildScript = (args: Argument[]) => {
        const sb = new ThinNeo.ScriptBuilder();
        for (let i = args.length - 1; i >= 0; i--) {
            const arg = args[ i ];
            sb.EmitArgument(arg);
        }
        sb.EmitPushBytes(new Uint8Array(Neo.Uint160.parse(deployStore.currentCompileContractHash).bits.buffer));
        sb.EmitSysCall("System.Contract.Call");
        return sb.ToArray();
    }

    @action public invoke = async (args: Argument[], netfee: string, sysfee: string, attached: string) => {
        const argument: SendScriptArgs = {
            scriptHash: deployStore.currentCompileContractHash.replace('0x', ''),
            scriptArguments: args,
            description: "合约测试",
            sysfee,
            fee: netfee,
            attachedAssets: { [ HASH_CONFIG.ID_GAS ]: attached }
        }
        const result = await Teemo.NEO.sendScript(argument);
        const name = codeStore.filename;
        if (result) {
            OutputStore.addOutputMessage({
                "type": OutputType.tree,
                "title": `${intl.message.output[ 2 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                "value": {
                    // 'System Fee': sysfee ? sysfee + "GAS" : "0GAS",
                    // 'Network Fee': netfee ? netfee + "GAS" : "0GAS",
                    // 'Attached Gas': attached ? netfee + "GAS" : "0GAS",
                    "Invoke Argument": JSON.stringify(args, null, 3),
                    // 'Script hex': script.toHexString()
                }
            })
            TransactionConfirm(result.txid, (data => {
                getNotify(result.txid).then(res => {
                    OutputStore.addOutputMessage({
                        "type": OutputType.tree,
                        "title": `${intl.message.output[ 3 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                        "value": {},
                        "result": res ? res[ 0 ] : res,
                        "txid": result.txid
                    })
                })
            }))
            return result;
        }
        else {
            throw new Error("Transaction fail")
        }
    }
    @action public invokesend = async (args: InvokeArgs) => {
        const result = await Teemo.NEO.invoke(args);
        const name = codeStore.filename;
        if (result) {
            OutputStore.addOutputMessage({
                "type": OutputType.tree,
                "title": `${intl.message.output[ 2 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                "value": {
                    // 'System Fee': sysfee ? sysfee + "GAS" : "0GAS",
                    // 'Network Fee': netfee ? netfee + "GAS" : "0GAS",
                    // 'Attached Gas': attached ? netfee + "GAS" : "0GAS",
                    "Invoke Argument": JSON.stringify(args, null, 3),
                    // 'Script hex': script.toHexString()
                }
            })
            TransactionConfirm(result.txid, (data => {
                getNotify(result.txid).then(res => {
                    OutputStore.addOutputMessage({
                        "type": OutputType.tree,
                        "title": `${intl.message.output[ 3 ]}：${intl.message.output[ 4 ]}：${name} TXID：${result.txid}`,
                        "value": {},
                        "result": res ? res[ 0 ] : res,
                        "txid": result.txid
                    })
                })
            }))
            return result;
        }
        else {
            throw new Error("Transaction fail")
        }
    }

    @action public invokescript = async (args: InvokeReadInput) => {
        const result = await Teemo.NEO.invokeRead(args);
        const name = codeStore.filename;
        OutputStore.addOutputMessage(
            {
                "type": OutputType.tree,
                "title": `${intl.message.output[ 8 ]}：${name}`,
                "value": {
                    "Invoke Paramenters": JSON.stringify(args),
                    "Result Code": ""
                },
                "result": result
            }
        )
        return result
    }

    @action public invokeRead = async (args: Argument[]) => {
        const script = this.buildScript(args);
        const name = codeStore.filename;
        const result = await invokescript(script.toHexString())[ 0 ];
        OutputStore.addOutputMessage(
            {
                "type": OutputType.tree,
                "title": `${intl.message.output[ 8 ]}：${name}`,
                "value": {
                    "Invoke Paramenters": JSON.stringify(args),
                    "Result Code": ""
                },
                "result": result
            }
        )
        return result
    }

    @action public initAbiArgs = async () => {
        const result = await getcontractstate(deployStore.currentCompileContractHash);
        if (result && result.length > 0 && result[ 0 ][ 'manifest' ]) {
            const contract = result[ 0 ];
            // if (result && result.length > 0 && result[ 0 ][ 'manifest' ]) {
            const manifest = contract[ 'manifest' ];
            const abi = manifest[ 'abi' ];
            const parameters = abi[ "entryPoint" ][ "parameters" ];
            if (parameters.length === 2 && parameters[ 0 ][ "type" ] === "String" && parameters[ 1 ][ "type" ] === "Array" && abi[ "methods" ] && abi[ "methods" ].length > 0) {
                return abi;
            }
            throw new Error("Contract format error")
        }
        throw new Error("Undeployed contract")
    }

}

export default new InvokeStore();