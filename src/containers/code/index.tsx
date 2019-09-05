
import * as React from 'react';
import './index.less';
// import classnames from 'classnames';
import { observer } from 'mobx-react';
import MonacoEditor from 'react-monaco-editor';
import { editor } from 'monaco-editor';
import { ICodeProps } from './store/interface/code.interface';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import common from '@/store/common';
@observer
export default class CodeBox extends React.Component<ICodeProps> {

    // private editor_div = React.createRef()

    // public componentDidMount() {
    // }
    public editor: editor.IStandaloneCodeEditor;
    // public eventE1:EventEmitter

    // public componentWillUnMount(){
    //     event.removeListener(this.eventE1)
    // }

    public render() {
        return (
            <>
                <div className="code-header" >
                    { this.props.codeStore.filename !== "" ? `${this.props.codeStore.filename}.${this.props.codeStore.language === 'python' ? 'py' : 'cs'}` : '' }
                    { this.props.codeStore.filename !== "" && (this.props.codeStore.deploy ? "" : `(${this.props.intl.message.code[ 1 ]})`) }
                </div>
                <div className="code-main">
                    <MonacoEditor
                        id="code-editor"
                        language={ this.props.codeStore.language }
                        theme="vs-dark"
                        value={ this.props.codeStore.code }
                        options={ this.props.codeStore.option }
                        onChange={ this.props.codeStore.onCodeChange }
                        editorDidMount={ this.editorDidMount }
                    />
                </div>
            </>
        )
    }

    // 编译器自适应调整
    public editorLayout = () => {
        if (this.editor) {
            this.editor.layout({ height: 0, width: 0 });
            this.editor.layout();
        }
    }

    // 编译器加载完毕事件
    private editorDidMount = (e: editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
        // console.log('editorDidMount', e);
        this.editor = e;
        this.props.codeStore.initEditor(e);
        this.editor.focus();

        common.event.addListener('setPosition', (line) => {
            this.removeBreakPoint();
            const model = e.getModel();
            if (model) {
                const value: editor.IModelDeltaDecoration =
                {
                    range: new monaco.Range(line, 1, line, 1),
                    options: { marginClassName: 'debug-line', className: 'debug-line', isWholeLine: true }
                }
                model.deltaDecorations([], [ value ])
            }
            e.setPosition({ "lineNumber": line, "column": 1 });
            e.revealLineInCenter(line);
        })
        common.event.addListener('delPosition', (line) => {
            this.removeBreakPoint(line);
        })
        // setTimeout(() => {
        //     e.setPosition({ "lineNumber": 5, "column": 1 })
        // }, 10000);
        window.onresize = () => {
            this.editorLayout();
        };
    }

    // private addBreakPoint (line) {
    //     const model = this.editor.getModel()
    //     if (!model) {return}
    //     const value = {range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, linesDecorationsClassName: 'breakpoints' }}
    //     model.deltaDecorations([], [value])
    //   }

    private removeBreakPoint(line?: number) {
        const model = this.editor.getModel()
        if (!model) { return }
        let decorations: editor.IModelDecoration[];
        const ids: string[] = []
        if (line !== undefined) {
            const arr = this.editor.getLineDecorations(line)
            decorations = arr ? arr : [];
        } else {
            decorations = model.getAllDecorations();
        }
        for (const decoration of decorations) {
            if (decoration.options.marginClassName === 'debug-line') {
                ids.push(decoration.id)
            }
        }
        if (ids && ids.length) {
            model.deltaDecorations(ids, [])
        }
    }
}