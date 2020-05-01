import Axios from 'axios';

interface IOpts {
  method: string, // 接口名
  params: any[], // 参数
  isGET?: boolean, // 是否是get 请求（默认请求是post）
  baseUrl?: string, // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
  getAll?: boolean, // 是否获取所有返回结果
}

// const network: string = process.env.REACT_APP_SERVER_ENV === 'DEV' ? 'testnet' : 'mainnet';
const network = 'testnet'
const baseCommonUrl: string = "https://apineo3dev.nel.group/api/testnet";
const baseUrl: string = "https://apidebugneo3dev.nel.group/api/" + network;
const rpcUrl: string = "http://47.99.35.147:20332";

const makeRpcPostBody = (method: string, params: any): {} => {

  const body = {};
  body[ "jsonrpc" ] = "2.0";
  body[ "id" ] = 1;
  body[ "method" ] = method;
  body[ "params" ] = params;
  return body;
}
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
}
export default function request(opts: IOpts): Promise<any> {
  let url = baseUrl;
  if (opts.baseUrl === 'common') {
    url = baseCommonUrl;
  }
  if (opts.baseUrl === 'rpc') {
    url = rpcUrl;
  }
  const params = makeRpcPostBody(opts.method, opts.params);
  const args = {
    url,
    method: opts.isGET ? 'GET' : 'POST',
    [ opts.isGET ? 'params' : 'data' ]: opts.method ? params : JSON.stringify(params),
    ...defaultConfig,
  }
  return new Promise((resolve, reject) => {
    Axios(args)
      .then((data: any) => {
        if (Array.isArray(data.data)) {
          resolve(data.data)
        }
        else if (data.data.result) {
          if (opts.getAll) {
            resolve(data.data);
            return;
          }
          resolve(data.data.result);
          return;
        }
        else if (data.data.error[ "code" ] === -1) {
          reject(data.data.error);
        }
        reject(data.data.error);
      })
      .catch((err: any) => { reject(err) });
  });
}
