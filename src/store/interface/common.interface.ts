import { IIntl } from "./intl.interface";
import { EventEmitter } from "events";


export interface ICommonStore {
  language: string,
  message: any,
  network: string,
  gasBalance: string;
  isLoadTeemo: boolean,// 检测是否有Teemo钱包
  isLoginFlag: number,// 默认不显示,1表示未检查到teemo钱包,2为未登录钱包
  loginState: number,  // 登陆状态，用于显示登陆使用的 toast 0==不显示，1==正在登录，2==登录成功，3==登录失败
  event: EventEmitter,
  toLoginState: (state: 'close' | 'succes' | 'fail' | 'login') => void, // 关闭登陆时的toast
  address: string, // 当前地址
  isSetedAddress: boolean; // 已经set 过address （有没有值不一定， 只是做过这个操作了）
  login: () => void,   // 显示登陆入口
  // loginOut: () => void, // 登出
  initLanguage: () => void;// 初始化语言
  setLanguage: (msg: string) => void;// 设置语言
  getSessionAddress: () => void // 获取登陆态
}
export interface ICommonProps {
  intl: IIntl;
  common: ICommonStore;
}
export interface ILoginParam {
  address: string,
  label: string
}