export interface IInvokeStore {
    buildScript: (args: IArgument[]) => Uint8Array;
    invoke: (args: Argument[], netfee: string, sysfee: string, attached: string) => Promise<InvokeOutput>;
    invokesend: (args: InvokeArgs) => Promise<InvokeOutput>;
    invokescript: (args: InvokeReadInput) => Promise<any>;
    invokeRead: (args: IArgument[]) => Promise<any>;
    initAbiArgs: () => Promise<any>;
}

export interface IArgument {
    type: string;
    value: any
}

export interface IParameter {
    name: string;
    type: string;
    value: any
}