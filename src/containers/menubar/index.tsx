/**
 * 一级标题菜单
 */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history'
// import EventHandler from 'utils/event';
import zh from '@/img/lan-ch.png';
import en from '@/img/lan-en.png';
import store from "@/store";
import './index.less';
import { observer } from 'mobx-react';
import { ICommonStore } from '@/store/interface/common.interface';
import DownloadTeemo from '@/containers/download';
// import LoginToast from '../logintoast';
import { Tooltip } from 'antd';
// import routers from '@/routers';

interface IState {
    isShowLanguage: boolean        // 是否显示语言下拉框
    languageText: string,
    languageImg: ImageData,
    isShowOther: boolean, // 是否显示其他功能设置
    isShowMenu: boolean,
    loginText: string, // 登陆显示
    expand: boolean,
    currentPage: string,
    currentState: boolean,
}
interface IProps {
    history: History,
    locale: any,
    common: ICommonStore,
    btn: any,
    input: any,
    onChangeLanguage: (lang: string) => void;
    onSidebarChange: (state: boolean) => void;
}
@observer
export default class Menubar extends React.Component<IProps, IState>{
    public readonly state: IState = {
        isShowLanguage: false,
        languageText: store[ 'common' ].language === 'en' ? "En" : "中",
        languageImg: store[ 'common' ].language === 'en' ? en : zh,
        isShowOther: false,
        isShowMenu: false,
        loginText: 'Login',
        expand: false,
        currentPage: "",
        currentState: false,
    }
    // public options =[{id:'usd',name:'USD',icon:require('@/img/usd.png')},{id:'cny',name:'CNY',icon:require('@/img/cny.png')}];
    public componentDidMount() {
        // EventHandler.add(this.globalClick);
    }

    // 销毁
    public componentWillUnmount() {
        // EventHandler.remove(this.globalClick);
        this.setState({
            isShowLanguage: false,
            isShowOther: false
        })
    }

    // 展开
    public onExpand = (e) => {
        // 取反
        const expand = !this.state.expand;

        this.setState({
            expand: expand
        });

        e.stopPropagation();
    }

    public render() {
        return (
            <header className="menubar-wrap">
                <div className="menubar-box">
                    <div className="menubar-log"><img src={ require('@/img/icon.png') } alt="" /></div>
                    <div className="menubar-content">
                        <ul>
                            {
                                this.mapRouterUnderline("/file") ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'file') }>
                                        <Tooltip title="文件浏览" placement="right">
                                            <Link to="/file"><img src={ require('@/img/liulan.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'file') }>
                                        <Tooltip title="文件浏览" placement="right">
                                            <Link to="/file"><img src={ require('@/img/liulan-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.mapRouterUnderline("/deploy") ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'deploy') }>
                                        <Tooltip title="合约部署" placement="right">
                                            <Link to="/deploy"><img src={ require('@/img/bushu.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'deploy') }>
                                        <Tooltip title="合约部署" placement="right">
                                            <Link to="/deploy"><img src={ require('@/img/bushu-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.mapRouterUnderline("/invoke") ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'invoke') }>
                                        <Tooltip title="合约调用" placement="right">
                                            <Link to="/invoke"><img src={ require('@/img/diaoyong.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'invoke') }>
                                        <Tooltip title="合约调用" placement="right">
                                            <Link to="/invoke"><img src={ require('@/img/diaoyong-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.mapRouterUnderline("/debug") ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'debug') }>
                                        <Tooltip title="合约调试" placement="right">
                                            <Link to="/debug"><img src={ require('@/img/debug.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'debug') }>
                                        <Tooltip title="合约调试" placement="right">
                                            <Link to="/debug"><img src={ require('@/img/debug-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.mapRouterUnderline("/support")
                                    ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'support') }>
                                        <Link to="/support">
                                            <Tooltip title="支持" placement="right">
                                                <img src={ require('@/img/zhichi.png') } alt="" />
                                            </Tooltip>
                                        </Link>
                                    </li>
                                    :
                                    <li className="" onClick={ this.onclick.bind(this, 'support') }>
                                        <Tooltip title="支持" placement="right">
                                            <Link to="/support"><img src={ require('@/img/zhichi-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                        </ul>
                    </div>
                    <div className="language-toggle" id="language">
                        <img
                            src={
                                this.props.common.language === "en" ?
                                    require('@/img/lan-en.png') :
                                    require('@/img/lan-ch.png') }
                            width={ 20 }
                            height={ 20 }
                            onClick={ this.onClickLanguage }
                        />
                    </div>
                </div>
                {
                    this.props.common.isLoginFlag > 0 && <DownloadTeemo { ...this.props } />
                }
                {
                    // this.props.common.loginState > 0 && <LoginToast />
                }
            </header>
        );
    }

    private onclick = (page: string) => {
        if (this.state.currentPage !== page) {
            this.setState({ currentPage: page, currentState: true }, () => {
                this.props.onSidebarChange(true);
            })
        }
        else {
            this.setState({ currentPage: page, currentState: !this.state.currentState }, () => {
                this.props.onSidebarChange(this.state.currentState);
            })
        }
    }

    // 切换语言
    private onClickLanguage = () => {
        const lang = this.props.common.language === "en" ? "zh" : "en";
        sessionStorage.setItem('language', lang);
        this.props.common.setLanguage(lang);
    }
    // 一级菜单选择
    private mapRouterUnderline = (path: string) => {
        if (path === this.props.history.location.pathname) {
            return true;
        }
        else {
            return false;
        }
    }
}