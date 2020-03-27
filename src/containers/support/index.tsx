import * as React from 'react';
import { History } from 'history'
import './index.less';
import { ICommonStore } from '@/store/interface/common.interface';
import { inject, observer } from 'mobx-react';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { notification } from 'antd';
import { ISupportStore } from './store/interface/support.interface';
import { IIntl } from '@/store/interface/intl.interface';
import { IDebugStore } from '../debug/store/interface/debug.interface';

interface IProps {
    route: {
        [ key: string ]: any
    };
    history: History,
    common: ICommonStore,
    support: ISupportStore,
    intl: IIntl,
    debug: IDebugStore,
}
@inject('common', 'support', 'intl', 'debug')
@observer
export default class Support extends React.Component<IProps> {

    public state = {
    }

    public componentDidMount() {
        if (!this.props.common.address) {
            this.props.common.login();
        }
        this.props.support.initClaimState();
        this.props.debug.stopDebug();
    }

    public render() {
        return (
            <>
                <div className="header" >
                    { this.props.intl.message.about[ 1 ] }
                    <div className="network neo3">{ this.props.intl.message.network.neo3test }</div>
                </div>
                <div className="line-group">
                    <div className="line-title">{ this.props.intl.message.about[ 2 ] }</div>
                    <div className="line-value">
                        { this.props.common.address ?
                            <a onClick={ this.onCopyAddress } >{ [ this.props.common.address.substring(0, 4), this.props.common.address.substring(30, 34) ].join('...') }</a>
                            : "--"
                        }
                    </div>
                </div>
                <div className="line-group">
                    <div className="line-title">{ this.props.intl.message.about[ 3 ] }</div>
                    <div className="line-value">{ this.props.common.gasBalance }</div>
                </div>
                <div className="line-btn">
                    {
                        this.props.support.claimState === "3010" &&
                        <Button text={ this.props.intl.message.button[ 2 ] } btnSize="bg-btn" btnColor="gray-btn" onClick={ this.onClaimGas } />
                    }
                    {
                        (this.props.support.claimState === "3011" || this.props.support.claimState === "3000") &&
                        <Button text={ this.props.intl.message.button[ 3 ] } btnSize="bg-btn" btnColor="gray-btn" />
                    }
                    {
                        (this.props.support.claimState === "3012" || this.props.support.claimState === "3003") &&
                        <Button text={ this.props.intl.message.button[ 12 ] } btnSize="bg-btn" btnColor="gray-btn" />
                    }
                </div>
                <div className="line-message">
                    { this.props.intl.message.about[ 4 ] }
                </div>
                <div className="about">
                    <div className="about-title">{ this.props.intl.message.about[ 5 ] }</div>
                    <div className="about-href" ><img src={ require("@/img/luntan.png") } alt="" /><a target="_bank" href="http://bbs.neldev.net/">{ this.props.intl.message.about[ 6 ] }</a></div>
                    <div className="about-href" ><img src={ require("@/img/github.png") } alt="" /><a target="_bank" href="https://github.com/NewEconoLab/NEOray2.0">GitHub</a></div>
                    <div className="about-href" ><img src={ require("@/img/liulanqi.png") } alt="" /><a target="_bank" href="https://scan.nel.group/">{ this.props.intl.message.about[ 7 ] }</a></div>
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
        Toast(this.props.intl.message.toast[ 5 ]);
        oInput.remove();
    }

    private onClaimGas = async () => {
        try {
            const result = await this.props.support.claimGas();
            if (result ? result[ 0 ] : false) {
                const args = {
                    message: this.props.intl.message.toast[ 9 ],
                    duration: 5,
                };
                notification.open(args);
            } else {
                const args = {
                    message: this.props.intl.message.toast[ 10 ],
                    duration: 5,
                };
                notification.open(args);
            }
        } catch (error) {
            const args = {
                message: this.props.intl.message.toast[ 10 ],
                duration: 5,
            };
            notification.open(args);
        }

    }

}