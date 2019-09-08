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
        currentTxid: ""
    }

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
                        <Search options={ this.props.debug.txlist } placeholder="Select Txid" onChange={ this.onTxidChange } value={ this.props.debug.currentTxid } text="" />
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
        e.focus();
        e.layout({ height: 0, width: 0 });
        e.layout();
        e.onDidChangeCursorPosition(listener => {
            // e.revealLineInCenter(listener.position.lineNumber)
            this.props.debug.onDebug(listener.position.lineNumber - 1)
        })
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