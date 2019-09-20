import { observable, action } from 'mobx';
import { ICodeStore } from './interface/code.interface';
import { editor } from 'monaco-editor';
class CodeStore implements ICodeStore {
    @observable public codeid: string = "";          // 未部署合约的codeid是存入本地存储时，根据时间戳生成的。已部署合约的id是scripthash
    @observable public code: string = "";           // 代码
    @observable public filename: string = "";       // 文件名 xxx.cs xxx.py
    @observable public language: string = "python"  // 编译器语言 默认C#
    @observable public deploy: boolean = false;
    @observable public option: editor.IEditorConstructionOptions = { selectOnLineNumbers: true, language: 'python', readOnly: false };  // 编译器的配置
    @observable public editor: editor.IStandaloneCodeEditor;

    // 代码变更
    @action public onCodeChange = (codeValue: string, event: editor.IModelContentChangedEvent) => {
        this.code = codeValue;
        if (this.filename !== "" && !this.deploy) {
            localStorage.setItem(this.codeid, this.code);
        }
    }
    /**
     * 初始化代码框
     * @param id 合约hash，或者本地存储id 
     * @param filename 文件名
     * @param language 文件名后缀
     * @param code 代码
     * @param deploy 是否已经部署
     */
    @action public initCode = (id: string, filename: string, language: string, code: string, deploy: boolean) => {
        this.codeid = id;
        this.filename = filename;
        this.language = language === 'py' ? 'python' : 'csharp';
        this.code = code;
        this.deploy = deploy;
    }

    @action public initEditor = (e: editor.IStandaloneCodeEditor) => {
        this.editor = e;
    }

}
export default new CodeStore();