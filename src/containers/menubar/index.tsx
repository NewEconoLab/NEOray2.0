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
import { IIntl } from '@/store/interface/intl.interface';
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
    intl: IIntl,
    history: History,
    common: ICommonStore,
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
                                this.props.history.location.pathname === "/file" ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'file') }>
                                        <Tooltip title={ this.props.intl.message.files[ 1 ] } placement="right">
                                            <Link to="/file"><img src={ require('@/img/liulan.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'file') }>
                                        <Tooltip title={ this.props.intl.message.files[ 1 ] } placement="right">
                                            <Link to="/file"><img src={ require('@/img/liulan-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.props.history.location.pathname === "/deploy" ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'deploy') }>
                                        <Tooltip title={ this.props.intl.message.deploy[ 1 ] } placement="right">
                                            <Link to="/deploy"><img src={ require('@/img/bushu.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'deploy') }>
                                        <Tooltip title={ this.props.intl.message.deploy[ 1 ] } placement="right">
                                            <Link to="/deploy"><img src={ require('@/img/bushu-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.props.history.location.pathname === "/invoke" ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'invoke') }>
                                        <Tooltip title={ this.props.intl.message.invoke[ 1 ] } placement="right">
                                            <Link to="/invoke"><img src={ require('@/img/diaoyong.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'invoke') }>
                                        <Tooltip title={ this.props.intl.message.invoke[ 1 ] } placement="right">
                                            <Link to="/invoke"><img src={ require('@/img/diaoyong-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.props.history.location.pathname === "/debug" ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'debug') }>
                                        <Tooltip title={ this.props.intl.message.debug[ 1 ] } placement="right">
                                            <Link to="/debug"><img src={ require('@/img/debug.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li> :
                                    <li className="" onClick={ this.onclick.bind(this, 'debug') }>
                                        <Tooltip title={ this.props.intl.message.debug[ 1 ] } placement="right">
                                            <Link to="/debug"><img src={ require('@/img/debug-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                            {
                                this.props.history.location.pathname === "/support"
                                    ?
                                    <li className="active" onClick={ this.onclick.bind(this, 'support') }>
                                        <Link to="/support">
                                            <Tooltip title={ this.props.intl.message.about[ 1 ] } placement="right">
                                                <img src={ require('@/img/zhichi.png') } alt="" />
                                            </Tooltip>
                                        </Link>
                                    </li>
                                    :
                                    <li className="" onClick={ this.onclick.bind(this, 'support') }>
                                        <Tooltip title={ this.props.intl.message.about[ 1 ] } placement="right">
                                            <Link to="/support"><img src={ require('@/img/zhichi-un.png') } alt="" /></Link>
                                        </Tooltip>
                                    </li>
                            }
                        </ul>
                    </div>
                    <div className="language-toggle" id="language">
                        <div style={ { marginBottom: "50px" } }>
                            <img
                                src={ require('@/img/back.png') }
                                onClick={ this.goBack }
                            />
                            <div className="language-info">Back To<br />V 1.0</div>
                        </div>
                        <img
                            src={
                                this.props.common.language === "en" ?
                                    require('@/img/lan-en.png') :
                                    require('@/img/lan-ch.png') }
                            onClick={ this.onClickLanguage }
                        />
                        <div className="language-info">
                            {
                                this.props.common.language === "en" ? "EN" : "CH"
                            }
                        </div>
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

    private goBack = () => {
        window.open("https://neoray.nel.group/1.0")

    }

    // 切换语言
    private onClickLanguage = () => {
        const lang = this.props.common.language === "en" ? "zh" : "en";
        sessionStorage.setItem('language', lang);
        this.props.common.setLanguage(lang);
    }
    // 一级菜单选择
    // private mapRouterUnderline = (path: string) => {
    //     if (path === this.props.history.location.pathname) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
}