/**
 * 域名交易
 */
import * as React from 'react';
import Button from '@/components/Button';
import './index.less';
import { observer, inject } from 'mobx-react';
import { ICommonProps } from '@/store/interface/common.interface';
import Alertbox from '@/components/Alertbox';

@inject('common', 'intl')
@observer
export default class DownloadTeemo extends React.Component<ICommonProps> {
    public render() {
        return (
            <Alertbox intl={ this.props.intl } title={ this.props.intl.message.toast[ 13 ] } onClose={ this.handleToCloseTeemoTips } >
                <div className="children-box">
                    {
                        this.props.common.isLoginFlag === 1 &&
                        <>
                            <div className="download-text">{ this.props.intl.message.toast[ 11 ] }</div>
                            <div className="download-href">
                                <a onClick={ this.handleToTeemo }>{ this.props.intl.message.toast[ 12 ] }</a>
                            </div>
                            <div className="download-btn-wrapper">
                                <Button text={ this.props.intl.message.button[ 12 ] } onClick={ this.handleToCloseTeemoTips } />
                            </div>
                        </>
                    }
                    {
                        this.props.common.isLoginFlag === 2 &&
                        <>
                            <div className="download-text">用户信息获取失败，请先登陆Teemo钱包</div>
                            <div className="download-btn-wrapper">
                                <Button text={ this.props.intl.message.button[ 12 ] } onClick={ this.handleToCloseTeemoTips } btnSize="bg-btn" />
                            </div>
                        </>
                    }
                </div>
            </Alertbox>
        )
        // return (
        //     <div className="download-wrapper">
        //         <div className="download-content">
        //             <div className="download-close" onClick={ this.handleToCloseTeemoTips }>
        //                 <img src={ require('@/img/close.png') } alt="" />
        //             </div>
        //             {
        //                 this.props.common.isLoginFlag === 1 &&
        //                 <>
        //                     <div className="download-text">未检测到Teemo钱包，请安装钱包后登陆使用NNSDEX。</div>
        //                     <div className="download-btn-wrapper">
        //                         <Button text="前往Teemo官网" onClick={ this.handleToTeemo } />
        //                     </div>
        //                 </>
        //             }
        //             {
        //                 this.props.common.isLoginFlag === 2 &&
        //                 <>
        //                     <div className="download-text">用户信息获取失败，请先登陆Teemo钱包</div>
        //                     <div className="download-btn-wrapper">
        //                         <Button text="关闭" onClick={ this.handleToCloseTeemoTips } btnSize="bg-btn" />
        //                     </div>
        //                 </>
        //             }
        //         </div>
        //     </div>
        // )
    }
    // 前往下载teemo钱包
    private handleToTeemo = () => {
        if (this.props.common.language === 'en') {
            window.open('https://teemo.nel.group/index-en.html')
        } else {
            window.open('https://teemo.nel.group/index.html')
        }

    }
    // 关闭
    private handleToCloseTeemoTips = () => {
        this.props.common.isLoginFlag = 0;
    }

}