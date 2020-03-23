import { IDeployStore, IContractDeployInfo } from "./interface/deploy.interface";
import OutputStore from '@/containers/output/store/index.store';
import {
    getContractDeployInfoByHash, readOssFile,
    storageContractFile,
    compilePythonContractFile, compileContractFile, getContractCodeByHash, getCompilerVersions
} from "@/containers/code/store/api/common.api";
import { action } from "mobx";
import common from "@/store/common";
import { OutputType } from "@/containers/output/store/interface/index.interface";
import codeStore from "@/containers/code/store/code.store";
import { TransactionConfirm } from "@/utils/wallet";
// import fileStore from "@/containers/file/store/file.store";
import intl from "@/store/intl";
import fileStore from "@/containers/file/store/file.store";

class DeployStore implements IDeployStore {
    @action public getDeployInfo = async (hash: string) => {
        try {
            const result: IContractDeployInfo = (await getContractDeployInfoByHash(hash))[ 0 ];
            const manifest = await readOssFile(hash, 'manifest.json', false);
            const nef = await readOssFile(hash, 'nef', false);
            result.manifest = JSON.parse(manifest);
            result.nef = nef
            return result;
        } catch (error) {
            throw error;
        }
    }
    @action public compile = async () => {
        let result;
        const version = (await getCompilerVersions())[ 0 ];
        if (codeStore.language === "python") {
            result = await compilePythonContractFile(
                common.address,
                codeStore.code
            )
        }
        else {
            result = await compileContractFile(
                common.address,
                codeStore.code,
                version
            );
        }
        if (result && result[ 0 ].hash) {
            const scripthash = result[ 0 ].hash
            const coderesult = await getContractCodeByHash(scripthash, common.address);
            if (coderesult) {
                const nefhex = coderesult[ 0 ].nef;
                const manifest = JSON.parse(coderesult[ 0 ].manifest);
                OutputStore.addOutputMessage({ title: "", type: OutputType.default, value: { [ intl.message.output[ 5 ] ]: "hash：" + result[ 0 ].hash } })
                return {
                    scripthash,     // 合约hash
                    nefhex,         // avm hex字符串
                    manifest,
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

    @action public deploy = async (params: DeployContractArgs, payable, storage) => {
        const result = await Teemo.NEO.deployContract(params)
        if (result) {
            const name = codeStore.filename;
            const nef = Neo.SmartContract.NefFile.loadNef(params.nefhex);
            const version = (await getCompilerVersions())[ 0 ];

            storageContractFile(common.address, nef.scriptHash.toString(), codeStore.filename, version, payable, storage, codeStore.language === "python" ? "py" : "cs", result.txid)
            OutputStore.addOutputMessage({
                'title': `${intl.message.output[ 2 ]}：${intl.message.output[ 7 ]}：${codeStore.filename} TXID:${result.txid}`,
                'type': OutputType.tree,
                "value": {
                    "name": name,
                    "hash": nef.scriptHash.toString(),
                    "script": nef.script.toHexString(),
                    "Need storage": storage ? "Yes" : "No",
                    "Accept payment": payable ? "Yes" : "No"
                }
            });
            const id = codeStore.codeid;
            TransactionConfirm(result.txid, (data => {
                OutputStore.addOutputMessage({
                    'type': OutputType.message,
                    "title": `${intl.message.output[ 3 ]}：${intl.message.output[ 7 ]}：${name} TXID:${result.txid}`,
                    "value": {}
                })
                const code = codeStore.code;
                const codeid = codeStore.codeid;
                const language = codeStore.language;
                fileStore.deleteToCodeList(id);
                fileStore.initFileList();
                if (id === codeid) {
                    codeStore.initCode(nef.scriptHash.toString(), name, language, code, true);
                    fileStore.currentFile = { id: nef.scriptHash.toString(), deploy: false };
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