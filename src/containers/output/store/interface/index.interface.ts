import { IDebugStore } from "@/containers/debug/store/interface/debug.interface";
import H from "history"

export interface IOutputStore {
    currentPage: string,
    outputList: IOutputMessage[],
    addOutputMessage: (message: any) => void;
    initOutputMessage: () => void;
    clearOutputMessage: () => void;
    toPage: (label: string) => void;
}

export interface IOutputProps {
    history: H.History
    output: IOutputStore,
    debug: IDebugStore,
    onSizeChange: () => void
}

export interface IOutputMessage {
    type: OutputType;
    txid?: string;
    result?: any;
    title: string;
    value: { [ key: string ]: any };
}

export enum OutputType {
    tree,
    default,
    message,
}