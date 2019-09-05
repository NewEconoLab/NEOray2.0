import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import Select from '@/components/select';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import { ICodeStore } from '../code/store/interface/code.interface';
import { IDeployStore } from './store/interface/deploy.interface';
import Toast from '@/components/Toast';
import { notification } from 'antd';
import { IIntl } from '@/store/interface/intl.interface';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    code: ICodeStore,
    deploy: IDeployStore,
    intl: IIntl,
}

interface IState {
    scripthash: string    // 合约hash
    description: string;    // 备注信息
    email: string;          // 邮件
    author: string;         // 作者
    version: string,        // 版本
    name: string;           // 名称
    avmhex: string;         // avm hex字符串
    call: boolean;          // 是否动态调用
    storage: boolean;       // 是否存储区
    payment: boolean;       // 是否支持付费
    balance: number;        // 余额
    needfee: number;
    download: string;
    deploy: boolean;
}

@inject('common', 'code', 'deploy', 'intl')
@observer
export default class Deploy extends React.Component<IProps, IState> {

    public state: IState = {
        scripthash: "",     // 合约hash
        description: "",     // 备注信息
        email: "",           // 邮件
        author: "",          // 作者
        version: "",        // 版本
        name: "",           // 名称
        avmhex: "",         // avm hex字符串
        call: false,           // 是否动态调用
        storage: false,        // 是否存储区
        payment: false,        // 是否支持付费
        balance: 0,
        needfee: 0,
        download: "",
        deploy: false
    }

    private selected = React.createRef<Select>();
    private options = [ { id: "cs", name: this.props.intl.message.deploy[ 2 ] }, { id: "py", name: this.props.intl.message.deploy[ 3 ] } ]
    // private checkCall = React.createRef<Checkbox>();
    // private checkStore = React.createRef<Checkbox>();
    // private checkPay = React.createRef<Checkbox>();

    public componentDidMount() {
        if (!this.props.common.address) {
            this.props.common.login();
        }
        this.initDeploy();
    }

    public render() {
        return (
            <>
                <div className="header" >
                    { this.props.intl.message.deploy[ 1 ] }
                </div>
                <div className="compile-box">
                    <div className="line">
                        <Select text="" ref={ this.selected } options={ this.options } placeholder="选择编译器" />
                    </div>
                    <Button text={ this.props.intl.message.button[ 1 ] } btnSize="bg-btn" onClick={ this.onCompile } />
                </div>
                { this.state.deploy &&
                    <>
                        <div className="result-box">
                            <div className="result-header">
                                <div className="header-title">avm(hex)</div>
                                <a download={ this.state.scripthash + ".avm" } href={ this.state.download }>
                                    <Button text={ this.props.intl.message.button[ 10 ] } btnSize="sm-btn" />
                                </a>
                            </div>
                            <div className="avmbox" >{ this.state.avmhex }</div>
                            <div className="result-header">hash</div>
                            <div className="copy-input">
                                <input className="copy-value" disabled={ true } value={ this.state.scripthash } onChange={ this.handleHashOnChange } />
                                <div className="copy-icon" onClick={ this.onCopyHash }><img src={ require("@/img/copy.png") } alt="" /></div>
                            </div>
                        </div>
                        <div className="deploy-box">
                            <div className="deploy-header">{ this.props.intl.message.deploy[ 4 ] }</div>
                            <Input type="text" value={ this.state.name } onChange={ this.handleNameOnChange } />
                            <div className="deploy-consloe">
                                <Checkbox text={ this.props.intl.message.deploy[ 5 ] } onClick={ this.handleCallOnClick } value={ this.state.call } />
                                <Checkbox text={ this.props.intl.message.deploy[ 6 ] } onClick={ this.handleStorageOnClick } value={ this.state.storage } />
                                <Checkbox text={ this.props.intl.message.deploy[ 7 ] } onClick={ this.handlePaymentOnClick } value={ this.state.payment } />
                                <Button text={ this.props.intl.message.button[ 11 ] } btnSize="bg-btn" onClick={ this.onDeploy } />
                                <div className="description">{ this.props.intl.message.deploy[ 8 ] }{ (this.state.call ? 500 : 0) + (this.state.storage ? 400 : 0) + 90 + 11 }GAS</div>
                                <div className="description">{ this.props.intl.message.deploy[ 9 ] }{ this.props.common.gasBalance }GAS</div>
                            </div>
                        </div>
                    </>
                }
            </>
        )
    }

    private handleCallOnClick = (value: boolean) => {
        this.setState({ call: value })
    }

    private handleStorageOnClick = (value: boolean) => {
        this.setState({ storage: value })
    }

    private handlePaymentOnClick = (value: boolean) => {
        this.setState({ payment: value })
    }

    private handleNameOnChange = (event) => {
        this.setState({ name: event })
    }

    private handleHashOnChange = (event) => {
        this.setState({ name: event })
    }

    // 复制地址
    private onCopyHash = () => {
        const oInput = document.createElement('input');
        oInput.value = this.state.scripthash;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        Toast(this.props.intl.message.toast[ 5 ]);
        oInput.remove();
    }

    /**
     * 初始化合约编译
     */
    private initDeploy = async () => {
        if (this.selected.current) {
            if (this.props.code.language === "python") {
                this.selected.current.onSelect(this.options[ 1 ])
            }
            if (this.props.code.language === "csharp") {
                this.selected.current.onSelect(this.options[ 0 ])
            }
        }
        if (this.props.code.deploy) {
            this.setState({ deploy: true })
            const result = await this.props.deploy.getDeployInfo(this.props.code.codeid)
            const blob = new Blob([ result.avmhex.hexToBytes() ]);
            const href = URL.createObjectURL(blob);
            this.setState({
                download: href,
                scripthash: result.scripthash,      // 合约hash
                description: result.desc,           // 备注信息
                email: result.email,                // 邮件
                author: result.author,              // 作者
                version: result.version,            // 版本
                name: result.name,                  // 名称
                avmhex: result.avmhex,              // avm hex字符串
                call: result.dynamicCall === '0' ? false : true,           // 是否动态调用
                storage: result.createStorage === '0' ? false : true,        // 是否存储区
                payment: result.acceptablePayment === '0' ? false : true,        // 是否支持付费
            },
            )
        }
    }

    private onCompile = async () => {
        try {
            const result = await this.props.deploy.compile();
            this.setState(result)
        } catch (error) {
            notification.error({ message: this.props.intl.message.output[ 6 ], duration: 3 });
        }
    }

    private onDeploy = async () => {
        try {
            const param: DeployContractArgs = {
                contractHash: this.state.scripthash,
                description: this.state.description,
                email: this.state.email,
                author: this.state.author,
                version: this.state.version,
                name: this.state.name,
                avmhex: this.state.avmhex,
                call: this.state.call,
                storage: this.state.storage,
                payment: this.state.payment
            }
            const result = await this.props.deploy.deploy(param)
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
}