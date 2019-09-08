import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import { Menu, Dropdown } from 'antd';
import { Tooltip } from 'antd';
import Alertbox from '@/components/Alertbox';
import Input from '@/components/Input';
import { ICodeStore } from '../code/store/interface/code.interface';
import FileTree from './filetree';
import { IContract, IFileStore } from './store/interface/file.interface';
import { IIntl } from '@/store/interface/intl.interface';
import { IDebugStore } from '../debug/store/interface/debug.interface';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    code: ICodeStore,
    file: IFileStore,
    intl: IIntl,
    debug: IDebugStore,
}
@inject('common', 'code', 'file', 'intl', 'debug')
@observer
export default class SelectFile extends React.Component<IProps> {

    public state = {
        showAlert: false,
        alertTitle: "",
        alertState: 0,      // 0：创建 1：重命名 2：载入 3：添加本地文件 4:删除
        notDeployed: [],
        deployed: [],
        loaded: [],
        filename: '',
        scripthash: '',
        delFileName: '',
        codeid: '',
    }

    public componentDidMount() {
        this.props.file.initFileList();
        this.props.debug.stopDebug();
    }

    public render() {
        return (
            <>
                <div className="header" >
                    <div className="header-box">
                        <div className="title-box">{ this.props.intl.message.files[ 1 ] }</div>
                        <div className="button-box">
                            <Tooltip title={ this.props.intl.message.files[ 2 ] } placement="bottom">
                                <div className="btn-icon">
                                    <img src={ require("@/img/bendi.png") } alt="" onClick={ this.addFile } />
                                    <input type="file" onChange={ this.onFileChange } />
                                </div>
                            </Tooltip>
                            <Tooltip title={ this.props.intl.message.files[ 3 ] } placement="bottom">
                                <img src={ require("@/img/create.png") } alt="" onClick={ this.createFile } />
                            </Tooltip>
                            <Tooltip title={ this.props.intl.message.files[ 4 ] } placement="bottom">
                                <img src={ require("@/img/jiazai.png") } alt="" onClick={ this.importFile } />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="selectfile-tree">
                    { this.props.file.filelist.length > 0 &&
                        <FileTree title={ this.props.intl.message.files[ 5 ] }>
                            { this.props.file.filelist.map((item, key) => {
                                return (
                                    <Dropdown key={ key } overlay={ this.newfilemenu.bind(this, item.id, item.name, item.language) } trigger={ [ 'contextMenu' ] }>
                                        <div className="select-value" onClick={ this.onFileClick.bind(this, item) }>
                                            { item.name + '.' + item.language }
                                        </div>
                                    </Dropdown>
                                )
                            }) }
                        </FileTree>
                    }
                    { this.props.file.loadList.length > 0 &&
                        <FileTree title={ this.props.intl.message.files[ 7 ] }>
                            { this.props.file.loadList.map((info, key) => {
                                return (
                                    <Dropdown key={ key } overlay={ this.importfilemenu.bind(this, info.scripthash) } trigger={ [ 'contextMenu' ] }>
                                        <div className="select-value" onClick={ this.props.file.openDeployCode.bind(this, info) }>
                                            { `${info.name}.${info[ 'language' ] ? info[ 'language' ] : 'cs'}` }
                                        </div>
                                    </Dropdown>
                                )
                            }) }
                        </FileTree>
                    }
                    { this.props.file.deployList.length > 0 &&
                        <FileTree title={ this.props.intl.message.files[ 6 ] }>
                            { this.props.file.deployList.map(info => {
                                return (
                                    <div className="select-value" key={ info.scripthash } onClick={ this.showDeployContract.bind(this, info) }>
                                        { `${info.name}.${info[ 'language' ] ? info[ 'language' ] : 'cs'}` }
                                    </div>
                                )
                            }) }
                        </FileTree>
                    }
                </div>
                { this.state.showAlert &&
                    <Alertbox title={ this.state.alertTitle } onCancel={ this.handleToCancel } onClose={ this.handleToClose } onConfirm={ this.handleToConfirm } >
                        <div className="children-box">
                            { (this.state.alertState === 0 || this.state.alertState === 1) &&
                                <>
                                    <div className="input-title">{ this.props.intl.message.files[ 8 ] }</div>
                                    <Input value={ this.state.filename } onChange={ this.onChangeFileName } type="text" />
                                </>
                            }
                            { this.state.alertState === 2 &&
                                <>
                                    <div className="input-title">{ this.props.intl.message.files[ 9 ] }</div>
                                    <Input value={ this.state.scripthash } onChange={ this.onChangeFileHash } type="text" />
                                </>
                            }
                            {
                                this.state.alertState === 3 &&
                                <>
                                    <div className="input-title">{ this.props.intl.message.files[ 10 ] }</div>
                                </>
                            }
                        </div>
                    </Alertbox>
                }
            </>
        )
    }

    private newfilemenu = (id: string, name: string, language: string) => {
        return (
            <Menu>
                <Menu.Item key="1" onClick={ this.handleToRename.bind(this, id, name + '.' + language) }>{ this.props.intl.message.files[ 11 ] }</Menu.Item>
                <Menu.Item key="2" onClick={ this.handleToDeleteFromMenu.bind(this, id) }>{ this.props.intl.message.files[ 12 ] }</Menu.Item>
            </Menu>
        );
    }
    private importfilemenu = (hash: string) => {
        return (
            <Menu>
                <Menu.Item key="1" onClick={ this.props.file.deleteLoadCode.bind(this, hash) }>{ this.props.intl.message.files[ 12 ] }</Menu.Item>
            </Menu>
        );
    }

    private onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[ 0 ];
            const fr = new FileReader();
            fr.readAsText(file);
            fr.onload = () => {
                // fr.readAsText(file);
                console.log(file.name, file.type);
                console.log('fileContent', fr.result);
                const code = fr.result;
                if (code && typeof code === "string") {
                    this.props.file.initFileCode(file.name, code);
                }
            };
        }
    }

    /**
     * 图标的监听事件
     */
    private createFile = () => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 13 ],
            alertState: 0,
            filename: 'untitled.cs'
        })
    }

    private addFile = () => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 2 ],
            alertState: 2,
        })
    }

    private importFile = () => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 14 ],
            alertState: 2,
        })
    }

    private handleToDeleteFromMenu = (filename: string) => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 15 ],
            alertState: 4,
            delFileName: filename
        })
    }

    private handleToRename = (id: string, filename: string) => {
        this.setState({
            codeid: id,
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 11 ],
            alertState: 1,
            filename: filename
        })
    }

    /**
     * 弹框的时间监听
     */
    private handleToClose = () => {
        this.setState({
            showAlert: false
        })
    }

    private handleToConfirm = () => {
        this.setState({
            showAlert: false
        })
        if (this.state.alertState === 0) {
            // 创建合约
            this.props.file.createContract(this.state.filename);
        }
        if (this.state.alertState === 1) {
            // 重命名
            this.props.file.setToCodeList(this.state.codeid, this.state.filename);
        }
        if (this.state.alertState === 2) {
            this.props.file.initLoadCode(this.state.scripthash)
                .then(res => {
                    if (res) {
                        this.setState({
                            scripthash: ""
                        })
                    }
                })
        }
        if (this.state.alertState === 4) {
            this.props.file.deleteToCodeList(this.state.delFileName);
        }
    }

    private handleToCancel = () => {
        this.setState({
            showAlert: false
        })
    }

    private onChangeFileHash = (event) => {
        this.setState({ scripthash: event })
    }

    private onChangeFileName = (event) => {
        this.setState({ filename: event })
    }

    private onFileClick = (file) => {
        this.props.file.openFileCode(file.id);
    }

    private showDeployContract = (code: IContract) => {
        this.props.file.openDeployCode(code);
    }

}