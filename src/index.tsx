declare var module: any

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import './reset.less';
import { unregister } from './registerServiceWorker';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import { LocaleProvider } from 'antd';
import storeCommon from '@/store/common';
import Intl from 'intl';
import common from '@/store/common';
import { observer } from 'mobx-react';

global.Intl = Intl;
window[ 'Intl' ] = Intl;
// common.setTimeGetBlock();

window.addEventListener('Teemo.NEO.READY', (data: CustomEvent) => {
    common.isLoadTeemo = true;
    common.getSessionAddress();
    common.isSetedAddress = true;
    const name = data.detail.name;
    const locations = window.location;
    if (!name.includes("NEO3")) {
        window.location.replace(`${location.origin}${locations.search}${locations.hash}`);
    }
    // common.initAccountBalance();
});

setTimeout(() => {
    if (!window[ 'Teemo' ]) {
        common.isSetedAddress = true;
    }
}, 1000)

// 网络切换
window.addEventListener('Teemo.NEO.NETWORK_CHANGED', (data: CustomEvent) => {
    console.log("inject NETWORK_CHANGED ");
    console.log(data.detail.networks[ 0 ]);
    // const base = data.detail.networks[ 0 ] === 'MainNet' ? '' : '/test';
    // const locations = window.location;
    // console.log(`${location.origin}${base || ''}${locations.pathname}${locations.search}${locations.hash}`)
    // window.location.replace(`${location.origin}${base || ''}${locations.pathname.replace('/test', '')}${locations.search}${locations.hash}`);
})
// 账户变更
window.addEventListener('Teemo.NEO.ACCOUNT_CHANGED', (data: CustomEvent) => {
    console.log("inject ACCOUNT_CHANGED ");
    console.log(data.detail.address);
    common.address = data.detail.address;
    sessionStorage.setItem('dexLogin', data.detail.address);
    // window.location.reload();
})
// 链接
window.addEventListener('Teemo.NEO.CONNECTED', (data: CustomEvent) => {
    console.log("inject CONNECTED ");
    console.log(data.detail);
    // window.location.reload();
})
// 断开链接
window.addEventListener('Teemo.NEO.DISCONNECTED', (data: CustomEvent) => {
    console.log("inject DISCONNECTED ");
    console.log(data.detail);
    sessionStorage.removeItem('dexLogin');
    common.address = '';
    window.location.reload();
})
// 交易成功通知
// window.addEventListener('Teemo.NEO.TRANSACTION_CONFIRMED', (data: CustomEvent) => {
//     console.log("inject TRANSACTION_CONFIRMED ");
//     console.log(data.detail);
// })
// 高度变化
// window.addEventListener('Teemo.NEO.BLOCK_HEIGHT_CHANGED',(data:CustomEvent)=>{
//   console.log("inject BLOCK_HEIGHT_CHANGED ");
//   console.log(data.detail);
// })

// 系统重载截断刷新 
// window.onbeforeunload = () => {
//     return false;
// }

// 初始化鼠标随机方法
// Neo.Cryptography.RandomNumberGenerator.startCollectors();

const ObserverRender = observer(() => {
    if (!common.isSetedAddress) {
        return <div />
    }

    return (
        <App />
    )
})

if (process.env.NODE_ENV === "development") {
    // common.initLoginInfo(document.getElementById("test")as HTMLElement);
    ReactDOM.render(
        <AppContainer>
            <LocaleProvider locale={ storeCommon.language === 'en' ? en_US : zh_CN }>
                <ObserverRender />
            </LocaleProvider>
        </AppContainer>,
        document.getElementById('root') as HTMLElement
    );
    if (module.hot) {
        module.hot.accept();
    }
}

// 初始化鼠标随机方法
// Neo.Cryptography.RandomNumberGenerator.startCollectors();

if (process.env.NODE_ENV === "production") {
    // common.getSessionAddress();
    // common.initLoginInfo(document.getElementById("root")as HTMLElement);
    ReactDOM.render(
        <LocaleProvider locale={ zh_CN }>
            <ObserverRender />
        </LocaleProvider>,
        document.getElementById('root') as HTMLElement
    );
}

unregister();
