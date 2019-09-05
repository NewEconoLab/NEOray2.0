/**
 * 提示组件
 */
import * as React from 'react';
import './index.less';
import common from '@/store/common';
// import classnames from 'classnames';

export default class LoginToast extends React.Component<any>
{
    public render() {
        return (
            common.loginState > 0 &&
            <div className="toast-warp">
                <div className="comp-toast">
                    <div className="img-box">
                        {
                            common.loginState === 1 && <div className="alert-loading-icon"><img src={ require('@/img/loading.png') } /></div>
                        }
                        {
                            common.loginState === 2 && <img src={ require('@/img/right.png') } className="alert-success-icon" />
                        }
                        {
                            common.loginState === 3 && <img src={ require('@/img/attention.png') } className="alert-success-icon" />
                        }
                    </div>
                    {
                        common.loginState === 1 &&
                        <span className="text" dangerouslySetInnerHTML={ { '__html': "正在连接Teemo钱包，请确认NEOray的连接请求..." } } />
                    }
                    {
                        common.loginState === 2 &&
                        <span className="text" dangerouslySetInnerHTML={ { '__html': "登录成功！" } } />
                    }
                    {
                        common.loginState === 3 &&
                        <span className="text" dangerouslySetInnerHTML={ { '__html': "登录失败！您已拒绝连接请求。" } } />
                    }
                </div >
            </div>
        );
    }
}