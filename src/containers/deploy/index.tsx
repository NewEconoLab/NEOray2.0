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
import { IDebugStore } from '../debug/store/interface/debug.interface';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    code: ICodeStore,
    deploy: IDeployStore,
    intl: IIntl,
    debug: IDebugStore,
}

interface IState {
    scripthash: string    // 合约hash
    version: string,        // 版本
    name: string;           // 名称
    nefhex: string;         // avm hex字符串
    call: boolean;          // 是否动态调用
    storage: boolean;       // 是否存储区
    payment: boolean;       // 是否支持付费
    balance: number;        // 余额
    needfee: number;
    manifestJsonStr: string;
    downloads: Array<{ download: string, href: string }>;
    deploy: boolean;
    manifest: any;
}

@inject('common', 'code', 'deploy', 'intl', 'debug')
@observer
export default class Deploy extends React.Component<IProps, IState> {

    public state: IState = {
        scripthash: "",     // 合约hash
        version: "",        // 版本
        name: "",           // 名称
        nefhex: "",        // avm hex字符串
        manifest: "",
        manifestJsonStr: "",
        call: false,           // 是否动态调用
        storage: false,        // 是否存储区
        payment: false,        // 是否支持付费
        balance: 0,
        needfee: 0,
        downloads: [],
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
        this.props.debug.stopDebug();
    }

    public render() {
        return (
            <>
                <div className="header" >
                    { this.props.intl.message.deploy[ 1 ] }
                    <div className="network neo3">NEO3测试网</div>
                </div>

                <div className="sidebar-body">
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
                                    <div className="header-title">manifest</div>
                                    <Button text={ this.props.intl.message.button[ 10 ] } btnSize="sm-btn" onClick={ this.handleOnDownload } />
                                </div>
                                <textarea value={ this.state.manifest ? JSON.stringify(this.state.manifest, null, 3) : "" } className="avmbox" />
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
                                    {/* <Checkbox text={ this.props.intl.message.deploy[ 5 ] } onClick={ this.handleCallOnClick } value={ this.state.call } /> */ }
                                    <Checkbox text={ this.props.intl.message.deploy[ 6 ] } onClick={ this.handleStorageOnClick } value={ this.state.storage } />
                                    <Checkbox text={ this.props.intl.message.deploy[ 7 ] } onClick={ this.handlePaymentOnClick } value={ this.state.payment } />
                                    <Button text={ this.props.intl.message.button[ 11 ] } btnSize="bg-btn" onClick={ this.onDeploy } />
                                    {/* <div className="description">{ this.props.intl.message.deploy[ 8 ] }{ (this.state.call ? 500 : 0) + (this.state.storage ? 400 : 0) + 90 + 11 }GAS</div> */ }
                                    {/* <div className="description">{ this.props.intl.message.deploy[ 9 ] }{ this.props.common.gasBalance }GAS</div> */ }
                                </div>
                            </div>
                        </>
                    }
                </div>
            </>
        )
    }

    // private handleCallOnClick = (value: boolean) => {
    //     this.setState({ call: value })
    // }

    // private onJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     this.setState({ manifest: event.target.value })
    // }

    private handleStorageOnClick = (value: boolean) => {
        const manifest = this.state.manifest;
        manifest[ 'features' ][ 'storage' ] = value;
        this.setState({ storage: value, manifest })
    }

    private handlePaymentOnClick = (value: boolean) => {
        const manifest = this.state.manifest;
        manifest[ 'features' ][ 'payable' ] = value;
        this.setState({ payment: value, manifest })
    }

    private handleNameOnChange = (event) => {
        this.setState({ name: event })
    }

    private handleHashOnChange = (event) => {
        this.setState({ name: event })
    }

    private handleOnDownload = () => {
        const blob_nef = new Blob([ this.state.nefhex.hexToBytes() ]);
        const blob_manifest = new Blob([ ThinNeo.Helper.String2Bytes(this.state.manifest) ])
        const files = {
            ".nef": window.URL.createObjectURL(blob_nef),
            ".manifest.json": window.URL.createObjectURL(blob_manifest)
        } // 所有文件
        for (const name in files) {
            if (files.hasOwnProperty(name)) {
                const href = files[ name ];
                const a = document.createElement('a') // 创建a标签
                const e = document.createEvent('MouseEvents') // 创建鼠标事件对象
                e.initEvent('click', false, false) // 初始化事件对象
                a.href = href // 设置下载地址
                a.download = this.state.scripthash + name // 设置下载文件名
                a.dispatchEvent(e)
            }
        }
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
            const blob = new Blob([ result.nef.hexToBytes() ]);
            const href = URL.createObjectURL(blob);
            const downloads = new Array<{ download: string, href: string }>();
            // const blob_2 = new Blob([ ThinNeo.Helper.String2Bytes(result.manifest) ]);
            const href_2 = URL.createObjectURL(blob);
            downloads.push({ download: this.state.scripthash + ".nef", href });

            downloads.push({ download: this.state.scripthash + ".manifest.json", href: href_2 });
            this.setState({
                downloads,
                scripthash: result.scripthash,      // 合约hash
                version: result.version,            // 版本
                name: result.name,                  // 名称
                nefhex: result.nef,              // avm hex字符串
                manifest: result.manifest,
                storage: result.createStorage,        // 是否存储区
                payment: result.acceptablePayment,        // 是否支持付费
            },
            )
        }
    }

    private onCompile = async () => {
        try {
            const result = await this.props.deploy.compile();
            this.setState(result);
            this.setState({ storage: result.manifest[ 'features' ][ 'storage' ], payment: result.manifest[ 'features' ][ 'payable' ] })
        } catch (error) {
            notification.error({ message: this.props.intl.message.output[ 6 ], duration: 3 });
        }
    }

    private onDeploy = async () => {
        try {
            // const nef = Neo.SmartContract.NefFile.loadNef(this.state.nefhex);
            const param: DeployContractArgs = {
                "nefhex": this.state.nefhex,
                "mainfest": JSON.stringify(this.state.manifest),
                // contractHash: this.state.scripthash,
                // description: this.state.description,
                // email: this.state.email,
                // author: this.state.author,
                // version: this.state.version,
                // name: this.state.name,
                // nefhex: this.state.nefhex,
                // call: this.state.call,
                // storage: this.state.storage,
                // payment: this.state.payment
            }
            const result = await this.props.deploy.deploy(param, this.state.payment, this.state.storage)
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