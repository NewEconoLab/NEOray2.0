import { IContract, IFileStore } from "./interface/file.interface";
import { observable, action } from 'mobx';
import common from '@/store/common';
import { getContractRemarkByAddress, getContractDeployInfoByHash, readOssFile } from "@/containers/code/store/api/common.api";
import codeStore from "@/containers/code/store/code.store";
class FileStore implements IFileStore {

    @observable public filelist: Array<{ id: string, name: string, language: string }> = [];
    @observable public deployList: IContract[] = [];
    @observable public loadList: IContract[] = [];
    @observable public currentFile: { id: string, deploy: boolean } = { id: "", deploy: false };

    // 创建合约
    @action public createContract = (filename: string) => {
        this.addToCodeList(filename);
        return true;
    }

    /**
     * 添加新文件名
     */
    @action public addToCodeList = (filename: string) => {
        const time = new Date().getTime();
        const id = ThinNeo.Helper.String2Bytes(time + filename).toHexString();
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES');
        let arr: any[] = [];
        const index = filename.lastIndexOf("\.");
        console.log('index', index);

        let language = filename.substring(index + 1, filename.length);
        console.log('language', language);

        let name = filename.substring(0, index);
        console.log('name', name);

        if (language !== "py" && language !== "cs") {
            name = filename;
            language = 'cs';
        }

        if (files) {
            arr = JSON.parse(files);
        }
        arr.push({ id, name, language })
        this.filelist = arr;
        console.log('filelist', arr);

        localStorage.setItem("NEORAY_NOT_DEPLOYED_FILES", JSON.stringify(arr));
        codeStore.initCode(id, name, language, "", false);
        this.currentFile = { id, deploy: false };
        return id;
    }

    /**
     * 重命名
     */
    @action public setToCodeList = (id: string, filename: string) => {
        const index = filename.lastIndexOf("\.");
        console.log('index', index);

        const language = filename.substring(index + 1, filename.length);
        console.log('language', language);

        const name = filename.substring(0, index);
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
            arr = arr.map(item => {
                return item.id === id ? { id, name, language } : item;
            })
        }
        localStorage.setItem("NEORAY_NOT_DEPLOYED_FILES", JSON.stringify(arr));
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
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        arr = arr.filter((item) => {
            return item.id !== id;
        })
        this.filelist = arr;
        localStorage.setItem('NEORAY_NOT_DEPLOYED_FILES', JSON.stringify(arr))
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
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        this.filelist = arr;
        console.log(arr);

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
        const loadlist = localStorage.getItem('NEORAY_FILES_HASHLOAD');
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
        const loadlist = localStorage.getItem('NEORAY_FILES_HASHLOAD');
        let loads: IContract[] = [];
        let file: IContract = { "language": 'cs', "scripthash": fileid, "name": fileid };
        if (loadlist) {
            loads = JSON.parse(loadlist)
            const arr = loads.find(item => item.scripthash === fileid);
            if (arr) {
                file = arr[ 0 ];
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
            this.currentFile = { id: hash, deploy: true };
        }
        const files = localStorage.getItem('NEORAY_FILES_HASHLOAD');
        let arr: IContract[] = [];
        if (files) {
            arr = JSON.parse(files)
        }
        arr.push({ name: contractinfo.name, scripthash: hash, language: language });
        this.loadList = arr;
        // this.loadList=arr;
        // sessionStorage.setItem(hash, result);
        localStorage.setItem('NEORAY_FILES_HASHLOAD', JSON.stringify(arr));
        return true;
    }

    @action public initFileCode = (filename: string, code: string) => {
        const time = new Date().getTime();
        const id = ThinNeo.Helper.String2Bytes(time + filename).toHexString();
        const files = localStorage.getItem('NEORAY_NOT_DEPLOYED_FILES');
        let arr: any[] = [];
        const index = filename.lastIndexOf("\.");
        console.log('index', index);

        const language = filename.substring(index + 1, filename.length);
        console.log('language', language);

        const name = filename.substring(0, index);
        console.log('name', name);

        if (files) {
            arr = JSON.parse(files);
        }
        arr.push({ id, name, language })
        this.filelist = arr;
        console.log('filelist', arr);

        localStorage.setItem("NEORAY_NOT_DEPLOYED_FILES", JSON.stringify(arr));
        codeStore.initCode(id, name, language, code, false);
        this.currentFile = { id, deploy: false };
        return id;
    }

    @action public deleteLoadCode = (hash: string) => {
        const files = localStorage.getItem('NEORAY_FILES_HASHLOAD');
        let arr: any[] = [];
        if (files) {
            arr = JSON.parse(files);
        }
        arr = arr.filter((item) => {
            return item.scripthash !== hash;
        })
        this.loadList = arr;
        localStorage.setItem('NEORAY_FILES_HASHLOAD', JSON.stringify(arr))
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
}

export default new FileStore()