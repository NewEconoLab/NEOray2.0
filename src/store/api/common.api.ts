import request from 'utils/request';

export const getBlockHeight = async () => {
    return request({
        method: 'getblockcount',
        params: [],
        baseUrl: 'common'
    })
}

/**
 * 获得gas
 * @param address 
 * @param num 
 */
export const claimgas = (address: string, num: number) => {
    return request({
        method: 'claimgas',
        params: [ address, num ]
    })
}

export const hasClaimGas = (address: string) => {
    return request({
        method: "hasclaimgas",
        params: [ address ],
    })
}

/**
 * 
 * @param address 地址
 * @param hash 合约hash
 * @param pageindex 页数
 * @param pagesize 分页条数
 */
export const getTxidByAddressAndContract = (...params) => {
    return request({
        method: "getTxidByAddressAndContract",
        params: params
    })
}

/**
 * 根据交易id获得dumpinfo
 * @param txid 交易id
 */
export function getDumpInfoByTxid(txid: string) {
    return request({
        method: "getDumpInfoByTxid",
        params: [ txid ]
    })
}

/**
 * 获得notify通知
 * @param txid 
 */
export function getNotify(txid: string) {
    return request({
        method: 'getapplicationlog',
        params: [ txid ],
        baseUrl: "common"
    })
}