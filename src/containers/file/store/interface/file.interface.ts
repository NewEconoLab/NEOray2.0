export interface IFileStore {
    filelist: Array<{ id: string, name: string, language: string }>,
    loadList: IContract[],
    deployList: IContract[],
    createContract: (filename: string) => boolean
    addToCodeList: (filename: string) => string
    setToCodeList: (id: string, filename: string) => void,
    deleteToCodeList: (id: string) => void,
    initFileList: () => Promise<void>,
    openDeployCode: (code: IContract) => Promise<void>;
    initLoadCode: (hash: string) => Promise<boolean>;
    initFileCode: (filename: string, code: string) => string;
    openFileCode: (file: {
        id: string;
        name: string;
        language: string;
    }) => void;
    deleteLoadCode: (hash: string) => void;
}
export interface IContract {
    name: string,
    scripthash: string,
    language: string
}