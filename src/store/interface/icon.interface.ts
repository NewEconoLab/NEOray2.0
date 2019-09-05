// 主要用于传值
export interface ITokenInfo
{
    hash:string;
    decimal:number;
    amount?:string|number;
}
export function toTokenInteger(token:ITokenInfo,count:number|string)
{
    if(typeof count ==="number")
    {
        const amountStr = count.toFixed(token.decimal).replace(".", "");
        const amount = parseFloat(amountStr);
        return amount;
    }
    else
    {
        const amountStr = parseFloat(count).toFixed(token.decimal).replace(".", "");
        const amount = parseFloat(amountStr);
        return amount;
    }
}