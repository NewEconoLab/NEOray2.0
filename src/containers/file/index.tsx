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
// import FileTree from './filetree';
import { IFileStore } from './store/interface/file.interface';
import { IIntl } from '@/store/interface/intl.interface';
import { IDebugStore } from '../debug/store/interface/debug.interface';
import Select, { IOptions } from '@/components/select';
import { readFile } from '../code/store/api/common.api';

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
        showHistory: false,
        optionModel: [],
        modelUrl: ""
    }

    public componentDidMount() {
        this.props.file.initFileList();
        this.props.debug.stopDebug();
        this.initTemplateList();
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
                            <Tooltip title={ this.props.intl.message.files[ 16 ] } placement="bottom">
                                <img src={ require("@/img/model.png") } alt="" onClick={ this.importModel } />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="sidebar-body">
                    <div className="file-list">
                        { this.props.file.filelist.length > 0 &&
                            this.props.file.filelist.map((item, key) => {
                                return (
                                    <Dropdown key={ key } overlay={ this.newfilemenu.bind(this, item.id, item.name, item.language) } trigger={ [ 'contextMenu' ] }>
                                        <div className="select-value" onClick={ this.onFileClick.bind(this, item) }>
                                            { item.name + '.' + item.language }
                                        </div>
                                    </Dropdown>
                                )
                            })
                        }
                    </div>
                </div>
                { this.state.showAlert &&
                    <Alertbox intl={ this.props.intl } title={ this.state.alertTitle } onCancel={ this.handleToCancel } onClose={ this.handleToClose } onConfirm={ this.handleToConfirm } >
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
                                    <div className="history-hashlist">
                                        <Input value={ this.state.scripthash } onChange={ this.onChangeFileHash } onFocus={ this.onFocusHistory } onBlur={ this.onBlurHistory } type="text" />
                                        {
                                            this.state.showHistory && this.props.file.loadList && this.props.file.loadList.length > 0 &&
                                            <div className="history-box">
                                                {
                                                    this.props.file.loadList.map(contract =>
                                                        (
                                                            <div className="li">
                                                                <div className="text" onClick={ this.onChangeFileHash.bind(this, contract.scripthash) }>{ contract.name }.{ contract.language }({ contract.scripthash })</div>
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                                        }
                                    </div>
                                </>
                            }
                            {
                                this.state.alertState === 3 &&
                                <>
                                    <div className="input-title">{ this.props.intl.message.files[ 10 ] }</div>
                                </>
                            }
                            {
                                this.state.alertState === 4 &&
                                <>
                                    <div className="input-title">选择合约模板</div>
                                    <Select text="" options={ this.state.optionModel } onCallback={ this.onSelectFileModel } />
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
    // private importfilemenu = (hash: string) => {
    //     return (
    //         <Menu>
    //             <Menu.Item key="1" onClick={ this.props.file.deleteLoadCode.bind(this, hash) }>{ this.props.intl.message.files[ 12 ] }</Menu.Item>
    //         </Menu>
    //     );
    // }

    private onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[ 0 ];
            const fr = new FileReader();
            fr.readAsText(file);
            fr.onload = () => {
                // fr.readAsText(file);
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
            alertState: 2
        })
    }

    private importFile = () => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 14 ],
            alertState: 2,
            scripthash: ""
        })
    }

    private importModel = () => {
        this.setState({
            showAlert: true,
            alertTitle: "载入模板",
            alertState: 4,
        })
    }

    private handleToDeleteFromMenu = (filename: string) => {
        this.setState({
            showAlert: true,
            alertTitle: this.props.intl.message.files[ 15 ],
            alertState: 5,
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
            readFile(this.state.modelUrl)
                .then(code => {
                    this.props.file.initFileCode(this.state.filename, code);
                })
        }
        if (this.state.alertState === 5) {
            this.props.file.deleteToCodeList(this.state.delFileName);
        }
    }

    private handleToCancel = () => {
        this.setState({
            showAlert: false
        })
    }

    private onFocusHistory = () => {
        this.setState({ showHistory: true })
    }

    private onBlurHistory = () => {
        this.setState({ showHistory: false });
    }

    private onChangeFileHash = (event) => {
        this.setState({ scripthash: event })
    }

    private onChangeFileName = (event) => {
        this.setState({ filename: event })
    }

    private onSelectFileModel = (option: IOptions) => {
        this.setState({ filename: option.id, modelUrl: option.other });
    }

    private onFileClick = (file) => {
        this.props.file.openFileCode(file.id);
    }

    private initTemplateList = async () => {
        await this.props.file.initContractTemplateList();
        const list = this.props.file.contractTemplateList.map(item => ({
            id: item.filename,
            name: item.name,
            other: item.fileurl
        }));
        this.setState({ optionModel: list })
    }

}