import request from 'utils/request';

export const getContractRemarkByAddress = (address: string) => {
    const opts = {
        method: 'getContractRemarkByAddress',
        params: [ address ]
    }
    return request(opts);
}

export const getContractCodeByHash = (hash: string, address: string) => {
    const opts = {
        method: 'getContractCodeByHash',
        params: [ address, hash ]
    }
    return request(opts);
}

export const getContractDeployInfoByHash = (hash: string) => {
    const opts = {
        method: 'getContractDeployInfoByHash',
        params: [ hash ]
    }
    return request(opts);
}

export const readOssFile = async (name: string, filename: string, temp: boolean) => {
    try {

        const str = "https://online-debug-data.oss-cn-hangzhou.aliyuncs.com/" + (temp ? "_temp" : "") + name + "." + filename;
        const result = await fetch(str, { "method": "get" });
        if (result.status === 200) {
            const text = await result.text();
            return text;
        }
        else {
            return "";
        }
    } catch (error) {
        return "";
    }
}

export const compileContractFile = (address: string, code: string, version: string) => {
    const opts = {
        method: 'compileCsContractFile',
        params: [ address, code, version ]
    }
    return request(opts);
}

export const compilePythonContractFile = (address: string, code: string) => {
    const opts = {
        method: 'compilePythonContractFile',
        params: [ address, code ]
    }
    return request(opts);
}

/**
 * 存储部署信息
 */
export const storageContractFile = (address: string, hash: string, name: string, version: string, payable: string, storage: string, lange: string, txid: string) => {
    const opts = {
        method: "storageContractFile",
        params: [ address, hash, name, version, payable, storage, lange, txid ]
    }
    return request(opts);
}

/**
 * 获得 NEO3的编译器版本
 */
export const getCompilerVersions = () => {
    const opts = {
        method: 'getCompilerVersions',
        params: []
    }
    return request(opts);
}