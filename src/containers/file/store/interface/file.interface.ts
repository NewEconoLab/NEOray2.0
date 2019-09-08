export interface IFileStore {
    filelist: Array<{ id: string, name: string, language: string }>,
    loadList: IContract[],
    deployList: IContract[],
    currentFile: { id: string, deploy: boolean };
    createContract: (filename: string) => boolean
    addToCodeList: (filename: string) => string
    setToCodeList: (id: string, filename: string) => void,
    deleteToCodeList: (id: string) => void,
    initFileList: () => Promise<void>,
    openDeployCode: (code: IContract) => Promise<void>;
    initLoadCode: (hash: string) => Promise<boolean>;
    initFileCode: (filename: string, code: string) => string;
    openFileCode: (fileid: string) => void
    deleteLoadCode: (hash: string) => void;
    toCurrentFile: () => void
}
export interface IContract {
    name: string,
    scripthash: string,
    language: string
}