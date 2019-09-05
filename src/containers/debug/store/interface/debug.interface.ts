import { ICodeStore } from "@/containers/code/store/interface/code.interface";
import { ICommonStore } from "@/store/interface/common.interface";
import { IIntl } from "@/store/interface/intl.interface";

export interface IDebugStore {
    isStart: boolean;
    txlist: Array<{ txid: string, time: string }>;
    currentTxid: string;
    dumpstr: string;
    notify: string;
    initTxList: () => void;
    startDebug: (txid: string) => void;
    stopDebug: () => void;
    onDebug: (line: number) => void;
    initDebug: (txid: string) => Promise<boolean>
    onTxidChange: (txid: string) => void
}

export interface IDebugProps {
    debug: IDebugStore;
    code: ICodeStore;
    common: ICommonStore;
    intl: IIntl;
}