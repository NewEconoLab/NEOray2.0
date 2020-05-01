import { IDeployStore, IContractDeployInfo } from "./interface/deploy.interface";
import OutputStore from '@/containers/output/store/index.store';
import {
    getContractDeployInfoByHash, readOssFile,
    storageContractFile,
    compilePythonContractFile, compileContractFile, getContractCodeByHash, getCompilerVersions
} from "@/containers/code/store/api/common.api";
import { action, observable } from "mobx";
import common from "@/store/common";
import { OutputType } from "@/containers/output/store/interface/index.interface";
import codeStore from "@/containers/code/store/code.store";
import { TransactionConfirm } from "@/utils/wallet";
// import fileStore from "@/containers/file/store/file.store";
import intl from "@/store/intl";
import fileStore from "@/containers/file/store/file.store";
import { getcontractstate } from "@/containers/invoke/store/api/index.api";

class DeployStore implements IDeployStore {

    @observable public currentCompileContractHash: string = "";          // 未部署合约的codeid是存入本地存储时，根据时间戳生成的。已部署合约的id是scripthash

    @action public getDeployInfo = async (hash: string) => {
        try {
            let result = {};
            try {
                const contractstate = await getcontractstate(hash);
                if (contractstate && contractstate[ 0 ]) {
                    codeStore.deploy = true;
                    result = (await getContractDeployInfoByHash(hash))[ 0 ];
                }
                else {
                    codeStore.deploy = false;
                    result[ 'name' ] = codeStore.filename;
                    result[ 'scripthash' ] = hash;
                }
            } catch (error) {
                codeStore.deploy = false;
                result[ 'name' ] = codeStore.filename;
                result[ 'scripthash' ] = hash;
            }
            const manifest = await readOssFile(hash, 'manifest.json', !codeStore.deploy);
            const nef = await readOssFile(hash, 'nef', !codeStore.deploy);
            result[ 'manifest' ] = JSON.parse(manifest);
            result[ 'nef' ] = nef;
            return result as IContractDeployInfo;
        } catch (error) {
            throw error;
        }
    }

    @action public getVersion = async () => {
        return getCompilerVersions();
    }

    @action public compile = async (version) => {
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
                this.currentCompileContractHash = scripthash;
                try {

                    const contractstate = await getcontractstate(scripthash);
                    if (contractstate && contractstate[ 0 ]) {
                        codeStore.deploy = true;
                    }
                    else {
                        codeStore.deploy = false;
                    }
                } catch (error) {
                    codeStore.deploy = false;
                }
                return {
                    scripthash,     // 合约hash
                    nefhex,         // avm hex字符串
                    manifest,
                    deploy: codeStore.deploy,
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
                // fileStore.deleteToCodeList(id);
                fileStore.initFileList();
                if (id === codeid) {
                    codeStore.initCode(id, name, language, code, true);
                    fileStore.currentFile = { id, deploy: true };
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