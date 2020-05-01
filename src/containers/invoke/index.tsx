import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import q1 from '@/img/help.png';
// import Input from '@/components/Input';
import Select, { IOptions } from '@/components/select';
import Button from '@/components/Button';
import { ArgumentsTree } from './ArgumentsTree';
import { ICodeStore } from '../code/store/interface/code.interface';
import { IArgument, IInvokeStore, IParameter } from './store/interface/invoke.interface';
import { notification } from 'antd';
import { IIntl } from '@/store/interface/intl.interface';
import { IDebugStore } from '../debug/store/interface/debug.interface';
import { ParametersTree } from './ParametersTree';
import { IDeployStore } from '../deploy/store/interface/deploy.interface';
// import Input from '@/components/Input';
// import MonacoEditor from 'react-monaco-editor';
// import { editor } from 'monaco-editor';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    code: ICodeStore,
    debug: IDebugStore,
    invoke: IInvokeStore,
    deploy: IDeployStore,
    intl: IIntl,
}
// interface parameter {
//     name: string,
//     type: "String" | "Integer" | "Array" | ""
// }
interface IState {
    args: IArgument[],
    params: IParameter[],
    jsonStr: string,
    netfee: string,
    sysfee: string,
    attached: string,
    argmuntLabel: number,
    contractAbi: any,
    callState: string,
    methodsAbi: Array<{ name: string, parameters: Array<{ name: string, type: string, value: any }>, returnType: string }>,
    currentParameters: IParameter[],
    currentFunctionName: string,
}
@inject('common', 'code', 'invoke', 'intl', 'debug', 'deploy')
@observer
export default class Invoke extends React.Component<IProps, IState> {

    public state: IState = {
        args: [],
        params: [],
        jsonStr: "",
        netfee: "",
        sysfee: "",
        attached: "",
        argmuntLabel: 0,
        contractAbi: {},
        methodsAbi: [],
        currentParameters: [],
        callState: 'invokeRead',
        currentFunctionName: ''
    }

    private callOptions = [ { id: 'invokeRead', name: "在AVM虚拟机试运行" }, { id: 'invoke', name: "在测试网发交易" } ]

    public componentDidMount() {
        this.props.debug.stopDebug();
        this.props.invoke.initAbiArgs()
            .then(abi => {
                this.setState({ contractAbi: abi, methodsAbi: abi[ 'methods' ] })
            })
    }

    public render() {

        return (
            <>
                <div className="header" >
                    { this.props.intl.message.invoke[ 1 ] }
                    <a href={ this.props.intl.message.url.invoke } target="_bank">
                        <img src={ q1 } alt="" />
                    </a>
                    <div className="network neo3">{ this.props.intl.message.network.neo3test }</div>
                </div>
                { this.props.code.deploy ?
                    <div className="invoke-box">
                        <div className="invoke-title"> <div>{ this.props.intl.message.invoke[ 4 ] }：</div><div className="input">{ this.props.code.filename }</div></div>
                        <div className="invoke-arg">
                            <Select placeholder="选择运行环境" defaultValue={ this.callOptions[ 0 ].id } options={ this.callOptions } onCallback={ this.onCallbackState } text="" />
                        </div>
                        <div className="argument-label">
                            <div className={ this.state.argmuntLabel === 0 ? "active" : "" } onClick={ this.onLabelChange.bind(this, 0) }>使用ABI参数</div>
                            <div className={ this.state.argmuntLabel === 1 ? "active" : "" } onClick={ this.onLabelChange.bind(this, 1) }>手动填写参数</div>
                        </div>
                        <div className="argumentsBox">
                            {
                                this.state.argmuntLabel === 0 &&
                                <>
                                    <div className="invoke-arg">
                                        <div className="arg-title">
                                            调用方法
                                        </div>
                                        <Select
                                            text=""
                                            placeholder="选择调用的方法"
                                            onCallback={ this.onSlectMethod }
                                            options={ this.state.methodsAbi.map(m => ({ id: m.name, name: m.name })) }
                                        />
                                    </div>
                                    {
                                        <ParametersTree intl={ this.props.intl } title="" onChange={ this.onChange } arguments={ this.state.currentParameters } />
                                    }
                                    {/* <Input placeholder="调用方法" onChange={} value={}/> */ }
                                </>
                            }
                            {
                                this.state.argmuntLabel === 1 &&
                                <>
                                    <div className="invoke-arg">
                                        <Select options={ [ { id: 'main', name: this.props.intl.message.invoke[ 8 ] } ] } text="" />
                                    </div>
                                    <ArgumentsTree intl={ this.props.intl } title="" onChange={ this.onChange } arguments={ this.state.args } />
                                </>
                            }
                        </div>
                        <div className="invoke-button">
                            <Button text="试运行合约" btnSize="bg-btn" onClick={ this.state.callState === "invoke" ? this.invoke : this.testRun } />
                        </div>
                    </div> :

                    <div className="invoke-button message-top">
                        <div className="invoke-title"> { this.props.intl.message.invoke[ 2 ] }</div>
                        { this.props.intl.message.invoke[ 3 ] }
                    </div>
                }
            </>
        )
    }

    private onLabelChange = (label: number) => {
        this.setState({ currentParameters: [], args: [], argmuntLabel: label })
    }

    private onCallbackState = (option: IOptions) => {
        this.setState({ callState: option.id })
    }

    // private onSysFeeChange = (event: string) => {
    //     this.setState({ sysfee: event })
    // }

    // private onNetFeeChange = (event: string) => {
    //     this.setState({ netfee: event })
    // }

    // private onAttached = (event: string) => {
    //     this.setState({ attached: event })
    // }

    private onChange = (event: IArgument[]) => {
        const jsonstr = event.length > 0 ? JSON.stringify(event, null, 3) : "";
        this.setState({ args: event, jsonStr: jsonstr })
        console.log(event);
    }

    private onSlectMethod = (event: IOptions) => {
        console.log(event.id);
        const methodabi = this.state.methodsAbi.find(m => m.name === event.id);
        if (methodabi) {
            this.setState({ currentParameters: methodabi.parameters, currentFunctionName: event.id });
        }
    }

    // private onJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     this.setState({ jsonStr: event.target.value })
    // }

    private testRun = () => {
        if (this.state.argmuntLabel === 0) {
            this.props.invoke.invokescript({
                scriptHash: this.props.deploy.currentCompileContractHash.replace('0x', ''),
                operation: this.state.currentFunctionName,
                arguments: this.state.args as Argument[]
            })
        }
        else {
            this.props.invoke.invokeRead(this.state.args);
        }
    }

    private invoke = async () => {
        try {
            let result;
            if (this.state.argmuntLabel === 0) {
                result = await this.props.invoke.invokesend({
                    scriptHash: this.props.deploy.currentCompileContractHash.replace('0x', ''),
                    operation: this.state.currentFunctionName,
                    arguments: this.state.args as Argument[]
                });
            }
            else {
                result = await this.props.invoke.invoke(this.state.args as Argument[], this.state.netfee, this.state.sysfee, this.state.attached);
            }
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