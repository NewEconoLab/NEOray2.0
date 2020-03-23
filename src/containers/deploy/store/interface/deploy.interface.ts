export interface IDeployStore {
    getDeployInfo: (hash: string) => Promise<IContractDeployInfo>
    deploy: (params: DeployContractArgs, payable: boolean, storage: boolean) => Promise<InvokeOutput>
    compile: () => Promise<{
        scripthash: string,     // 合约hash
        nefhex: string,         // avm hex字符串
        // download: string,
        deploy: boolean,
        name: string,
        manifest: any,
    }>;
}

export interface IDeployInfo {
    description: string,     // 备注信息
    email: string,           // 邮件
    author: string,          // 作者
    version: string,        // 版本
    name: string,           // 名称
    avmhex: string,         // avm hex字符串
}
export interface IContractDeployInfo {
    address: string;
    scripthash: string;
    name: string;
    version: string;
    author: string;
    email: string;
    desc: string;
    avmhex: string;
    nef: string;
    manifest: string;
    acceptablePayment: any;
    createStorage: any;
    dynamicCall: any;
    txid: string;
    createTime: string;
    lastUpdateTime: string
}