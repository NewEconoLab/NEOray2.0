import request from "@/utils/request";

export const invokescript = async (scripthex: string) => {
    const opts = {
        method: 'invokescript',
        params: [ scripthex ],
        baseUrl: "common"
    }
    return request(opts);
}

export const getcontractstate = (scriptHash: string) => {
    return request({
        method: 'getcontractstate',
        params: [ scriptHash ],
        baseUrl: 'common'
    })
}