export interface IInvokeStore {
    buildScript: (args: IArgument[]) => Uint8Array;
    invoke: (args: IArgument[], netfee: string, sysfee: string, attached: string) => Promise<InvokeOutput>;
    invokeRead: (args: IArgument[]) => Promise<any>;
}

export interface IArgument {
    type: string;
    value: any
}