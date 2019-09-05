import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { notification } from 'antd';
import { ISupportStore } from './store/interface/support.interface';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    support: ISupportStore,
}
@inject('common', 'support')
@observer
export default class Support extends React.Component<IProps> {

    public state = {
    }

    public componentDidMount() {
        if (!this.props.common.address) {
            this.props.common.login();
        }
        this.props.support.initClaimState();
    }

    public render() {
        return (
            <>
                <div className="header" >支持</div>
                <div className="line-group">
                    <div className="line-title">地址</div>
                    <div className="line-value">
                        { this.props.common.address ?
                            <a onClick={ this.onCopyAddress } >{ [ this.props.common.address.substring(0, 4), this.props.common.address.substring(30, 34) ].join('...') }</a>
                            : "--"
                        }
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-title">GAS余额</div>
                    <div className="line-value">{ this.props.common.gasBalance }</div>
                </div>
                <div className="line-btn">
                    {
                        this.props.support.claimState === "3010" &&
                        <Button text="索取GAS" btnSize="bg-btn" btnColor="gray-btn" onClick={ this.onClaimGas } />
                    }
                    {
                        (this.props.support.claimState === "3011" || this.props.support.claimState === "3000") &&
                        <Button text="排队中" btnSize="bg-btn" btnColor="gray-btn" />
                    }
                    {
                        (this.props.support.claimState === "3012" || this.props.support.claimState === "3003") &&
                        <Button text="已发放" btnSize="bg-btn" btnColor="gray-btn" />
                    }
                </div>
                <div className="line-message">
                    每个钱包每日可索取一次500gas，需要更多请在论坛留言索取。
                </div>
                <div className="about">
                    <div className="about-title">欢迎访问我们的社区</div>
                    <div className="about-href" ><img src={ require("@/img/luntan.png") } alt="" /><a target="_bank" href="https://bbs.neldev.net/">NEL开发者论坛</a></div>
                    <div className="about-href" ><img src={ require("@/img/github.png") } alt="" /><a target="_bank" href="">GitHub</a></div>
                    <div className="about-href" ><img src={ require("@/img/liulanqi.png") } alt="" /><a target="_bank" href="https://scan.nel.group/">区块链浏览器</a></div>
                </div>
            </>
        )
    }

    // 复制地址
    private onCopyAddress = () => {
        const oInput = document.createElement('input');
        oInput.value = this.props.common.address;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        Toast("复制成功");
        oInput.remove();
    }

    private onClaimGas = async () => {
        try {
            const result = await this.props.support.claimGas();
            if (result ? result[ 0 ] : false) {
                const args = {
                    message: '请求发送成功',
                    duration: 5,
                };
                notification.open(args);
            } else {
                const args = {
                    message: 'gas不足领取失败，请在论坛留言索取。',
                    duration: 5,
                };
                notification.open(args);
            }
        } catch (error) {
            const args = {
                message: 'gas不足领取失败，请在论坛留言索取。',
                duration: 5,
            };
            notification.open(args);
        }

    }

}