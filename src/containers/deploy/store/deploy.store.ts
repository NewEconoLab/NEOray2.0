import { IDeployStore, IContractDeployInfo } from "./interface/deploy.interface";
import OutputStore from '@/containers/output/store/index.store';
import { getContractDeployInfoByHash, readOssFile, storageContractFile, compilePythonContractFile, compileContractFile, getContractCodeByHash } from "@/containers/code/store/api/common.api";
import { action } from "mobx";
import common from "@/store/common";
import { OutputType } from "@/containers/output/store/interface/index.interface";
import codeStore from "@/containers/code/store/code.store";
import { TransactionConfirm } from "@/utils/wallet";
import fileStore from "@/containers/file/store/file.store";
import intl from "@/store/intl";

class DeployStore implements IDeployStore {
    @action public getDeployInfo = async (hash: string) => {
        try {
            const result: IContractDeployInfo = (await getContractDeployInfoByHash(hash))[ 0 ];
            const avmhex = await readOssFile(hash, 'avm', false);
            result.avmhex = avmhex;
            return result;
        } catch (error) {
            throw error;
        }
    }
    @action public compile = async () => {
        let result;
        if (codeStore.language === "python") {
            result = await compilePythonContractFile(
                common.address,
                codeStore.code
            )
        }
        else {
            result = await compileContractFile(
                common.address,
                codeStore.code
            );
        }
        if (result && result[ 0 ].hash) {
            const scripthash = result[ 0 ].hash
            const coderesult = await getContractCodeByHash(scripthash, common.address);
            if (coderesult) {
                const avmhex = coderesult[ 0 ].avm;
                const blob = new Blob([ avmhex.hexToBytes() ]);
                const download = URL.createObjectURL(blob);
                OutputStore.addOutputMessage({ title: "", type: OutputType.default, value: { [ intl.message.output[ 5 ] ]: "hash：" + result[ 0 ].hash } })
                return {
                    scripthash,     // 合约hash
                    avmhex,         // avm hex字符串
                    download,
                    deploy: true,
                    name: codeStore.filename
                }
            }
            else {
                throw new Error("编译信息获取失败")
            }
        }
        else {
            OutputStore.addOutputMessage({ title: result[ 0 ].message, type: OutputType.message, value: {} })
            throw new Error(result[ 0 ]);
        }
    }

    @action public deploy = async (params: DeployContractArgs) => {
        const result = await Teemo.NEO.deployContract(params)
        if (result) {
            if (process.env.REACT_APP_SERVER_ENV === "DEV") {
                storageContractFile(common.address, params.contractHash, params.name, params.version, params.author, params.email, params.description, params.payment ? 1 : 0, params.storage ? 1 : 0, params.call ? 1 : 0, result.txid, codeStore.language === "python" ? "py" : "cs")
            }
            OutputStore.addOutputMessage({
                'title': `${intl.message.output[ 2 ]}：${intl.message.output[ 7 ]}：${params.name} TXID:${result.txid}`,
                'type': OutputType.tree,
                "value": {
                    "name": params.name,
                    "hash": params.contractHash,
                    "AVM": params.avmhex,
                    "Dynamic call": params.call ? "Yes" : "No",
                    "Need storage": params.storage ? "Yes" : "No",
                    "Accept payment": params.payment ? "Yes" : "No"
                }
            });
            const id = codeStore.codeid;
            TransactionConfirm(result.txid, (data => {
                OutputStore.addOutputMessage({
                    'type': OutputType.message,
                    "title": `${intl.message.output[ 3 ]}：${intl.message.output[ 7 ]}：${params.name} TXID:${result.txid}`,
                    "value": {}
                })
                const code = codeStore.code;
                const codeid = codeStore.codeid;
                const language = codeStore.language;
                fileStore.deleteToCodeList(id);
                fileStore.initFileList();
                if (id === codeid) {
                    codeStore.initCode(params.contractHash, params.name, language, code, true);
                    fileStore.currentFile = { id: params.contractHash, deploy: false };
                }
            }))
            return result;
        }
        else {
            throw new Error("交易失败")
        }
    }
}

export default new DeployStore();