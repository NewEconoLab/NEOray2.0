import { IContract, IFileStore } from "./interface/file.interface";
import { observable, action } from 'mobx';
import common from '@/store/common';
import { getContractRemarkByAddress, getContractDeployInfoByHash, readOssFile, getContractTemplateList } from "@/containers/code/store/api/common.api";
import codeStore from "@/containers/code/store/code.store";
class FileStore implements IFileStore {

    @observable public filelist: Array<{ id: string, name: string, language: string }> = [];
    @observable public deployList: IContract[] = [];
    @observable public loadList: IContract[] = [];
    @observable public currentFile: { id: string, deploy: boolean } = { id: "", deploy: false };
    @observable public contractTemplateList: Array<{ name: string, filename: string, fileurl: string }> = [];

    // 创建合约
    @action public createContract = (filename: string) => {
        this.addToCodeList(filename);
        return true;
    }

    /**
     * 添加新文件名
     */
    @action public addToCodeList = (filename: string) => {
        const index = filename.lastIndexOf("\.");
        let language = filename.substring(index + 1, filename.length);
        let name = filename.substring(0, index);
        if (language !== "py" && language !== "cs") {
            name = filename;
            language = 'cs';
        }
        const id = this.initFileCode(
            name + "." + language,
            `using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using System;
using System.Numerics;

// Replace Template with your project name
namespace Template
{
    public class Template : SmartContract
    {
        public static object Main(string method, object[] args)
        {
            if (Runtime.Trigger == TriggerType.Verification)
            {
                //Modify according to your specific needs
                return false;
            }
            else if (Runtime.Trigger == TriggerType.Application)
            {
                //Add the code associated with the contract invocation here
                
            }
            return false;
        }
    }
}
`);
        this.currentFile = { id, deploy: false };
        return id;
    }

    /**
     * 重命名
     */
    @action public setToCodeList = (id: string, filename: string) => {
        const index = filename.lastIndexOf("\.");
        console.log('index', index);

        let language = filename.substring(index + 1, filename.length);
        console.log('language', language);

        let name = filename.substring(0, index);

        if (language !== "py" && language !== "cs") {
            name = filename;
            language = 'cs';
        }
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES_NEO3');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
            arr = arr.map(item => {
                return item.id === id ? { id, name: name ? name : "untitled", language } : item;
            })
        }
        localStorage.setItem("NEORAY_NOT_DEPLOYED_FILES_NEO3", JSON.stringify(arr));
        this.filelist = arr;
        if (codeStore.codeid === id) {
            codeStore.initCode(id, name, language, codeStore.code, false);
            this.currentFile = { id, deploy: false };
        }
    }

    /**
     * 删除代码
     */
    @action public deleteToCodeList = (id: string) => {
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES_NEO3');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        arr = arr.filter((item) => {
            return item.id !== id;
        })
        this.filelist = arr;
        localStorage.setItem('NEORAY_NOT_DEPLOYED_FILES_NEO3', JSON.stringify(arr))
        localStorage.removeItem(id);
        if (id === codeStore.codeid) {
            codeStore.initCode("", "", "py", "", false);
            this.currentFile = { id: "", deploy: false };
        }
    }


    /**
     * 初始化文件
     */
    @action public initFileList = async () => {
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES_NEO3');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        this.filelist = arr;
        this.deployList = [];
        try {
            const result = await getContractRemarkByAddress(common.address);
            if (result) {
                for (const item of result) {
                    const language = item[ 'language' ] ? item[ 'language' ] : 'cs';
                    this.deployList.push({ name: item.name, scripthash: item.scripthash, language: language })
                }
            }
        } catch (error) {
            this.deployList = [];
        }
        const loadlist = localStorage.getItem('NEORAY_FILES_HASHLOAD_NEO3');
        let loads: IContract[] = [];
        if (loadlist) {
            loads = JSON.parse(loadlist)
        }
        this.loadList = loads;
    }

    /**
     * 打开已部署合约
     */
    @action public openDeployCode = async (code: IContract) => {
        const result = await readOssFile(code.scripthash, code.language, false);
        if (result) {
            codeStore.initCode(code.scripthash, code.name, code.language, result, true);
            this.currentFile = { id: code.scripthash, deploy: true };
        }
    };

    @action public openFileCode = (fileid: string) => {
        const code = localStorage.getItem(fileid);
        const loadlist = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES_NEO3');
        let loads: any[] = [];
        let file: IContract = { "language": 'cs', "scripthash": fileid, "name": fileid };
        if (loadlist) {
            loads = JSON.parse(loadlist)
            const findfile = loads.find(item => item.id === fileid);
            if (findfile) {
                file = findfile;
            }
        }
        codeStore.initCode(fileid, file.name, file.language, code ? code : '', false);
        this.currentFile = { id: fileid, deploy: false };
    }

    /**
     * 初始化载入合约的代码
     */
    @action public initLoadCode = async (hash: string) => {
        const contractinfo = (await getContractDeployInfoByHash(hash))[ 0 ];
        const language = contractinfo.language === 'py' ? 'py' : 'cs';
        const result = await readOssFile(hash, language, false);
        if (result) {
            codeStore.initCode(hash, contractinfo.name, language, result, true);
            this.initFileCode(contractinfo.name + "." + language, result);
            this.currentFile = { id: hash, deploy: true };
        }
        const files = localStorage.getItem('NEORAY_FILES_HASHLOAD_NEO3');
        let arr: IContract[] = [];
        if (files) {
            arr = JSON.parse(files)
        }
        arr = arr.filter((value, index) => {
            return value.scripthash !== hash;
        })
        arr.push({ name: contractinfo.name, scripthash: hash, language: language });
        this.loadList = arr;
        // this.loadList=arr;
        // sessionStorage.setItem(hash, result);
        localStorage.setItem('NEORAY_FILES_HASHLOAD_NEO3', JSON.stringify(arr));
        return true;
    }

    @action public initFileCode = (filename: string, code: string) => {
        const time = new Date().getTime();
        const id = ThinNeo.Helper.String2Bytes(time + filename).toHexString();
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES_NEO3');
        let arr: any[] = [];
        const index = filename.lastIndexOf("\.");

        const language = filename.substring(index + 1, filename.length);

        const name = filename.substring(0, index);

        if (files) {
            arr = JSON.parse(files);
        }
        arr.push({ id, name, language })
        this.filelist = arr;

        localStorage.setItem("NEORAY_NOT_DEPLOYED_FILES_NEO3", JSON.stringify(arr));
        localStorage.setItem(id, code);
        codeStore.initCode(id, name, language, code, false);
        this.currentFile = { id, deploy: false };
        return id;
    }

    @action public deleteLoadCode = (hash: string) => {
        const files = localStorage.getItem('NEORAY_FILES_HASHLOAD_NEO3');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        arr = arr.filter((item) => {
            return item.scripthash !== hash;
        })
        this.loadList = arr;
        localStorage.setItem('NEORAY_FILES_HASHLOAD_NEO3', JSON.stringify(arr))
        if (hash === codeStore.codeid) {
            codeStore.initCode("", "", "py", "", false);
            this.currentFile = { id: hash, deploy: false };
        }
    }

    @action public toCurrentFile = async () => {
        if (this.currentFile.deploy) {
            const contractinfo = (await getContractDeployInfoByHash(this.currentFile.id))[ 0 ];
            const language = contractinfo.language === 'py' ? 'py' : 'cs';
            const result = await readOssFile(this.currentFile.id, language, false);
            if (result) {
                codeStore.initCode(this.currentFile.id, contractinfo.name, language, result, true);
                this.currentFile = { id: this.currentFile.id, deploy: true };
            }
        }
        else {
            this.openFileCode(this.currentFile.id);
        }
    }

    @action public initContractTemplateList = async () => {
        const result = await getContractTemplateList();
        if (result) {
            this.contractTemplateList = result[ 0 ][ 'list' ];
        }
    }
}

export default new FileStore()