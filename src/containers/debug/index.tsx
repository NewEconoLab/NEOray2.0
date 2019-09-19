import * as React from 'react';
import './index.less';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';
import q1 from '@/img/help.png';
import Button from '@/components/Button';
import Search from '@/components/search';
import { IDebugProps } from './store/interface/debug.interface';
import MonacoEditor from 'react-monaco-editor';
import { editor } from 'monaco-editor';

@inject('common', 'debug', 'code', 'intl')
@observer
export default class Debug extends React.Component<IDebugProps> {

    public state = {
        txlist: [],
        start: false,
        label: "avm",
        currentTxid: "",
        currentLine: 0,
    }

    private editor: editor.IStandaloneCodeEditor;

    public componentDidMount() {
        this.initTxList();
    }

    public render() {
        const avmlabel = classnames("info-label", { active: this.state.label === "avm" })
        const carelabel = classnames("info-label", { active: this.state.label === "care" })
        const loglabel = classnames("info-label", "right", { active: this.state.label === "log" })

        return (
            <>
                <div className="header" >
                    { this.props.intl.message.debug[ 1 ] }
                    <a href={ this.props.intl.message.url.debug } target="_bank">
                        <img src={ q1 } alt="" />
                    </a>
                </div>
                <div className="debuginfo-box">
                    <div className="button-box">
                        <Search
                            options={ this.props.debug.txlist }
                            placeholder="Select Txid"
                            onChange={ this.onTxidChange }
                            value={ this.props.debug.currentTxid }
                            disable={ !!this.props.debug.isStart }
                            text="" />
                        { this.props.debug.isStart ?
                            <Button text={ this.props.intl.message.button[ 5 ] } btnSize="bg-btn" onClick={ this.debugOnStop } /> :
                            <Button text={ this.props.intl.message.button[ 4 ] } btnSize="bg-btn" onClick={ this.debugOnStart } />
                        }
                    </div>
                    { this.props.debug.isStart &&
                        <div className="info-box">
                            <div className="info-header">
                                <div className={ avmlabel } onClick={ this.toLabel.bind(this, "avm") }>AVM</div>
                                <div className={ carelabel } onClick={ this.toLabel.bind(this, "care") }>CareInfo</div>
                                <div className={ loglabel } onClick={ this.toLabel.bind(this, "log") }>log/notify</div>
                            </div>
                            <div className="info-value">
                                { this.state.label === "avm" &&
                                    <div id="fulllog-editor">
                                        <MonacoEditor
                                            language="json"
                                            // theme="hc-black"
                                            theme="vs-dark"
                                            value={ this.props.debug.dumpstr }
                                            options={ { selectOnLineNumbers: false, readOnly: true, minimap: { enabled: false }, renderLineHighlight: 'all' } }
                                            // onChange={ this.props.codeStore.onCodeChange }
                                            editorDidMount={ this.editorDidMount }
                                        />
                                    </div>
                                }
                                { this.state.label === "log" &&
                                    <div id="notify-editor">
                                        <MonacoEditor
                                            language="json"
                                            theme="vs-dark"
                                            value={ this.props.debug.notify }
                                            options={ { selectOnLineNumbers: false, readOnly: true, minimap: { enabled: false } } }
                                            // onChange={ this.props.codeStore.onCodeChange }
                                            editorDidMount={ this.notifyEditorDidMount }
                                        />
                                    </div>
                                }
                                <div id="careInfo-msg" hidden={ this.state.label !== "care" } />
                            </div>
                        </div>
                    }
                </div>
            </>
        )
    }

    // 编译器加载完毕事件
    private editorDidMount = (e: editor.IStandaloneCodeEditor, monaco: any) => {
        // console.log('editorDidMount', e);
        this.editor = e;
        e.focus();
        e.layout({ height: 0, width: 0 });
        e.layout();
        const model = e.getModel();
        if (this.state.currentLine > 0) {
            // e.setPosition({ "lineNumber": this.state.currentLine, "column": 1 });
            if (model) {
                const value: editor.IModelDeltaDecoration =
                {
                    range: new monaco.Range(this.state.currentLine, 1, this.state.currentLine, 1),
                    options: { marginClassName: 'debug-line', className: 'debug-line', isWholeLine: true }
                }
                model.deltaDecorations([], [ value ])
            }
            e.revealLineInCenter(this.state.currentLine);
        }
        e.onDidChangeCursorPosition(listener => {
            // e.revealLineInCenter(listener.position.lineNumber)
            const line = listener.position.lineNumber;
            this.removeBreakPoint(this.state.currentLine);
            if (model) {
                const value: editor.IModelDeltaDecoration =
                {
                    range: new monaco.Range(line, 1, line, 1),
                    options: { marginClassName: 'debug-line', className: 'debug-line', isWholeLine: true }
                }
                model.deltaDecorations([], [ value ])
            }
            // e.setPosition({ "lineNumber": line, "column": 1 });
            this.setState({ currentLine: line })
            // e.revealLineInCenter(line);
            this.props.debug.onDebug(line - 1)
        })
    }

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

    // 编译器加载完毕事件
    private notifyEditorDidMount = (e: editor.IStandaloneCodeEditor, monaco: any) => {
        // console.log('editorDidMount', e);
    }

    private onTxidChange = (txid: string) => {
        this.props.debug.onTxidChange(txid);
    }

    private toLabel = (label: string) => {
        this.setState({ label })
    }

    private initTxList = () => {
        this.props.debug.initTxList();
    }

    private debugOnStart = () => {
        if (this.props.debug.currentTxid) {
            this.props.debug.startDebug(this.props.debug.currentTxid);
        }
        else {
            console.log();
        }
    }

    private debugOnStop = () => {
        this.props.debug.stopDebug();
    }

}