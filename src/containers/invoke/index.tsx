import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import Hint from '@/components/hint';
import Input from '@/components/Input';
import Select from '@/components/select';
import Button from '@/components/Button';
import { ArgumentsTree } from './ArgumentsTree';
import { ICodeStore } from '../code/store/interface/code.interface';
import { IArgument, IInvokeStore } from './store/interface/invoke.interface';
import { notification } from 'antd';
import { IIntl } from '@/store/interface/intl.interface';
// import MonacoEditor from 'react-monaco-editor';
// import { editor } from 'monaco-editor';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    code: ICodeStore,
    invoke: IInvokeStore,
    intl: IIntl,
}
interface IState {
    args: IArgument[],
    jsonStr: string,
    netfee: string,
    sysfee: string,
    attached: string,
}
@inject('common', 'code', 'invoke', 'intl')
@observer
export default class Invoke extends React.Component<IProps, IState> {

    public state: IState = {
        args: [],
        jsonStr: "",
        netfee: "",
        sysfee: "",
        attached: ""
    }

    // private editor: editor.IStandaloneCodeEditor;

    public render() {
        return (
            <>
                <div className="header" >
                    { this.props.intl.message.invoke[ 1 ] } <Hint text="" />
                </div>
                { this.props.code.deploy ?
                    <div className="invoke-box">
                        <div className="invoke-title">{ this.props.intl.message.invoke[ 4 ] }：{ this.props.code.filename }</div>
                        <div className="invoke-arg">
                            <div className="arg-title">
                                { this.props.intl.message.invoke[ 5 ] }
                            </div>
                            <div className="arg-value">
                                <Input type="text" value={ this.state.sysfee } onChange={ this.onSysFeeChange } placeholder="" />
                            </div>
                        </div>
                        <div className="invoke-arg">
                            <div className="arg-title">
                                { this.props.intl.message.invoke[ 6 ] }
                            </div>
                            <div className="arg-value">
                                <Input type="text" value={ this.state.netfee } onChange={ this.onNetFeeChange } placeholder="" />
                            </div>
                        </div>
                        <div className="invoke-arg">
                            <div className="arg-title">
                                { this.props.intl.message.invoke[ 7 ] }
                            </div>
                            <div className="arg-value">
                                <Input type="text" value={ this.state.attached } onChange={ this.onAttached } placeholder="" />
                            </div>
                        </div>
                        <div className="invoke-arg">
                            <Select options={ [ { id: 'main', name: this.props.intl.message.invoke[ 8 ] } ] } text="" />
                        </div>
                        {/* 以下部分为invoke参数 */ }
                        <ArgumentsTree intl={ this.props.intl } title="" onChange={ this.onChange } arguments={ this.state.args } />
                        {/* 以上部分为invoke参数 */ }
                        {/* 
                        <div className="invoke-button">
                            <Button text="增加参数" btnSize="bg-btn" />
                        </div> 
                        */}
                        <div className="invoke-json">
                            <textarea rows={ 200 } cols={ 280 } value={ this.state.jsonStr } onChange={ this.onJsonChange } />
                            {/* <MonacoEditor
                            language="json"
                            theme="vs-dark"
                            value={ this.state.jsonStr }
                            options={ { selectOnLineNumbers: true, language: 'json' } }
                            onChange={ this.onCodeChange }
                            editorDidMount={ this.editorDidMount }
                        /> */}
                        </div>
                        <div className="invoke-button">
                            <div>
                                <Button text={ this.props.intl.message.button[ 7 ] } onClick={ this.invoke } />
                            </div>
                            <div className="button-right">
                                <Button text={ this.props.intl.message.button[ 8 ] } onClick={ this.testRun } />
                            </div>
                        </div>

                    </div> :

                    <div className="invoke-box">
                        <div className="invoke-title"> { this.props.intl.message.invoke[ 2 ] }</div>
                        { this.props.intl.message.invoke[ 3 ] }
                    </div>
                }
            </>
        )
    }

    private onSysFeeChange = (event: string) => {
        this.setState({ sysfee: event })
    }

    private onNetFeeChange = (event: string) => {
        this.setState({ netfee: event })
    }

    private onAttached = (event: string) => {
        this.setState({ attached: event })
    }

    private onChange = (event: IArgument[]) => {
        const jsonstr = event.length > 0 ? JSON.stringify(event, null, 3) : "";
        this.setState({ args: event, jsonStr: jsonstr })
        console.log(event);
    }

    private onJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ jsonStr: event.target.value })
    }

    private testRun = () => {
        this.props.invoke.invokeRead(this.state.args);
    }

    private invoke = async () => {
        try {
            const result = await this.props.invoke.invoke(this.state.args, this.state.netfee, this.state.sysfee, this.state.attached);
            if (result) {
                notification.success({ message: this.props.intl.message.toast[ 6 ], duration: 3 })
            }
        } catch (error) {
            if (error.type === "CANCELED") {
                notification.error({ message: this.props.intl.message.toast[ 7 ], duration: 3 })
            }
            else {
                notification.error({ message: this.props.intl.message.toast[ 8 ], duration: 3 })
            }
        }

    }

    // private onCodeChange = (value: string, event: editor.IModelContentChangedEvent) => {
    //     this.setState({
    //         jsonStr: value
    //     })
    // }

    // // 编译器加载完毕事件
    // private editorDidMount = (e: editor.IStandaloneCodeEditor, monaco: any) => {
    //     // console.log('editorDidMount', e);
    //     this.editor = e;
    //     this.editor.focus();
    //     this.editor.layout({ height: 200, width: 280 });
    // }

}