import { editor } from "monaco-editor";
import { IIntl } from "@/store/interface/intl.interface";
export interface ICodeStore {
    code: string;
    codeid: string;
    deploy: boolean;
    language: string;
    filename: string;
    option: editor.IEditorConstructionOptions;
    editor: editor.IStandaloneCodeEditor;
    initCode: (id: string, filename: string, language: string, code: string, deploy: boolean) => void;
    onCodeChange: (newValue: string, event: editor.IModelContentChangedEvent) => void;
    initEditor: (e: editor.IStandaloneCodeEditor) => void
}
export interface ICodeProps {
    codeStore: ICodeStore,
    intl: IIntl
}