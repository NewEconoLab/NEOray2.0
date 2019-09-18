import { IDebugStore } from "@/containers/debug/store/interface/debug.interface";
import H from "history"
import { IIntl } from "@/store/interface/intl.interface";

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
    intl: IIntl
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

export interface ITreeView {
    title: string;
    value: string;
    items: ITreeView[];
}