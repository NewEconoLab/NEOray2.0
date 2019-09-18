// 存储全局变量
import { observable, action } from 'mobx';
import * as Wallet from '@/utils/wallet';
import { ICommonStore } from './interface/common.interface';
import { HASH_CONFIG } from '@/config';
import { notification } from 'antd';
import { EventEmitter } from 'events';
import intl, { Language } from './intl';

let lang = navigator.language;
lang = lang.substr(0, 2);
class Common implements ICommonStore {
    @observable public isLoadTeemo: boolean = false; // 检测是否有Teemo钱包
    @observable public language: string = lang;  // 当前语言
    @observable public message: any | null = null;// 当前显示内容
    @observable public network: 'TestNet' | 'MainNet' = 'TestNet';  // 当前网络
    @observable public address: string = ''; // 当前地址
    @observable public gasBalance: string = '0';
    @observable public isSetedAddress: boolean = false;
    @observable public isLoginFlag: number = 0;// 默认不显示,1表示未检查到teemo钱包,2为未登录钱包
    @observable public loginState: number = 0;// 登陆状态，用于显示登陆使用的 toast 0==不显示，1==正在登录，2==登录成功，3==登录失败    
    @observable public event = new EventEmitter();

    // 用来变更登陆时候Toast的状态
    @action public toLoginState = (state: 'close' | 'succes' | 'fail' | 'login') => {
        if (state === 'close') {
            this.loginState = 0;
        }
        if (state === 'succes') {
            this.loginState = 2;
            const args = {
                message: intl.message.toast[ 1 ],
                duration: 5,
            };
            notification.success(args);
            setTimeout(() => {
                this.loginState = 0;
            }, 2000);
        }
        if (state === 'fail') {
            this.loginState = 3;
            const args = {
                message: intl.message.toast[ 2 ],
                duration: 5,
            };
            notification.error(args);
            setTimeout(() => {
                this.loginState = 0;
            }, 2000);
        }
        if (state === 'login') {
            this.loginState = 1;
            const args = {
                message: intl.message.toast[ 3 ],
                description:
                    intl.message.toast[ 4 ],
                duration: 5,
            };
            notification.info(args);
        }
    }

    // 初始化语言
    @action public initLanguage = () => {
        intl.initLanguage();
    }

    // 设置语言
    @action public setLanguage = (msg: string) => {
        if (msg === 'zh') {
            this.language = msg
            intl.changeLanguage(Language.CN)
        } else {
            this.language = 'en'
            intl.changeLanguage(Language.EN)
        }
    }

    // 获取登陆态
    @action public getSessionAddress = () => {
        const addr = sessionStorage.getItem('dexLogin');
        if (addr && addr !== '' && this.isLoadTeemo) {
            this.address = addr;
            this.initAccountBalance();
        }
    }

    // 登陆
    @action public login = async () => {
        if (this.isLoadTeemo) {
            this.toLoginState('login');
            const loginFlag: any = await Wallet.getAccount();
            if (!loginFlag) {
                this.address = '';
                this.isLoginFlag = 2;
                this.toLoginState('fail');
                return
            }
            this.address = loginFlag.address;
            this.toLoginState('succes');
            sessionStorage.setItem('dexLogin', this.address);
            this.initAccountBalance();
        } else {
            this.toLoginState('close');
            this.address = '';
            this.isLoginFlag = 1;
            this.loginState = 0;
            return
        }
        // this.login.show();
    }

    @action public initAccountBalance = async () => {
        console.log(this.address, HASH_CONFIG.ID_GAS);

        const result = await Wallet.getBalance(HASH_CONFIG.ID_GAS);
        if (result) {
            this.gasBalance = result[ 0 ].amount;
        }
    }

    // 登出
    // @action public loginOut = () =>
    // {  
    //   alert("测试：已登出")
    //   // WalletApi.LoginInfo.info = null;
    //   this.address = '';
    //   sessionStorage.removeItem('dexLogin');
    // }
}

// 外部使用require
export default new Common();
