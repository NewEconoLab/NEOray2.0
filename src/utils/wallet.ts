import common from "@/store/common";
// import Toast from "@/components/Toast";

// tslint:disable-next-line:no-reference
/// <reference path="./inject.d.ts" />
// export function getBackground(){
//   window.addEventListener('Teemo.NEO.READY',()=>{})
// }
/**
 * 获得账户信息
 */
export function getAccount() {
  if (!window[ 'Teemo' ]) {
    common.isLoginFlag = 1;
    return;
  }
  return new Promise((resolve, reject) => {
    Teemo.NEO.getAccount()
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log(error);
        common.toLoginState('close');
        common.isLoginFlag = 2;
        return false;
      })
  })
}
/**
 * 获得余额信息
 */
export const getBalance = async (...assets: string[]) => {
  if (!window[ 'Teemo' ]) {
    throw new Error('未登陆钱包')
  }
  const params: BalanceRequest = {
    address: common.address,   // 你要查询的地址
    assets: assets, // 不填则默认查四个资产 NEO　GAS　NNC NNK 可能之后要改一下
    // fetchUTXO 可以不填的
  }
  // 获得余额的参数
  const data: GetBalanceArgs = {
    network: common.network,
    params: params
  }
  try {
    const result = await Teemo.NEO.getBalance(data);
    return result[ common.address ]
  } catch (error) {
    throw error;
  }
}

export function invoke(params: InvokeArgs) {
  return new Promise((resolve, reject) => {
    if (!window[ 'Teemo' ]) {
      alert('请登陆Teemo');
      reject(new Error('未登录钱包'));
    }
    Teemo.NEO.invoke(params)
      .then(result => {
        console.log(result);
        console.log("交易成功：" + result.txid);
        resolve(result);
      })
      .catch(error => {
        console.log("哎呀，交易失败了");
        console.log(error);
        // if(error.type==="CANCELED"){
        // if(common.language === 'zh'){
        // Toast('您拒绝了本次操作', "error");
        // }else{
        // Toast('You have rejected this operation', "error");
        // }
        // }
        reject(new Error('交易失败'));
      })
  })
}

export function invokeGroup(params: InvokeGroup) {
  return new Promise<InvokeOutput[]>((resolve, reject) => {
    if (!window[ 'Teemo' ]) {
      alert('请登陆Teemo');
      reject(new Error('未登录钱包'));
    }
    Teemo.NEO.invokeGroup(params)
      .then(result => {
        console.log(result);
        console.log("交易成功：" + result[ 0 ].txid);
        resolve(result);
      })
      .catch(error => {
        console.log("==============进入了异常流程");
        console.log(error);
        // if(error.type==="CANCELED"){
        //   if(common.language === 'zh'){
        //     Toast('您拒绝了本次操作', "error");
        //   }else{
        //     Toast('You have rejected this operation', "error");
        //   }
        // }

        // reject(error);
        reject(error);
      })
  })
}
/**
 * 检测网络变换
 * @param params 
 */
export function getApplicationLog(params: string) {
  if (!window[ 'Teemo' ]) {
    alert('请登陆Teemo');
    return;
  }
  const data: GetApplicationLogArgs = {
    network: "TestNet",
    txid: params
  }
  return new Promise((resolve, reject) => {
    Teemo.NEO.getApplicationLog(data) // 获得余额的方法
      .then(result => {
        console.log(result);
        // document.getElementById("getApplicationLog_R").innerText = JSON.stringify(result, null, 2);
        resolve();
      })
      .catch(error => {
        console.log(error);
        reject();
      })
  })
}

export function TransactionConfirm(txid: string, call: (result: any) => void) {

  // 交易成功通知
  window.addEventListener('Teemo.NEO.TRANSACTION_CONFIRMED', (data: CustomEvent) => {
    console.log("inject TRANSACTION_CONFIRMED ");
    console.log(data.detail);
    if (data.detail && (data.detail.TXID as string).includes(txid.replace('0x', ''))) {
      call(data.detail);
    }
  })
}