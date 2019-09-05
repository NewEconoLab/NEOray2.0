// 将数字转化为 1,234,567等形式
export function toThousands(num: string) {
    let result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

export function toFixed(number:number,fractionDigits:number)
{
    if(!isNaN(number))
    {
        const reg = new RegExp(`([0-9]+.[0-9]{${fractionDigits}})[0-9]*`);
        return parseFloat(number.toString().replace(reg,"$1"));
    }
    else
    {
        throw new Error("参数错误");
        
    }
}

/**
 * 快速将字符串转成对应的数组字符串
 * @param str 要转换的字符串
 * @param decimal 小数位数
 */
export function asNumber(str:string,decimal?:number)
{
    let value = str;
    // 先把非数字的都替换掉，除了数字和.

    value = value.replace(/[^\d.]/g,"");

    // 保证只有出现一个.而没有多个.

    value = value.replace(/\.{2,}/g,".");

    // 必须保证第一个为数字而不是.

    value = value.replace(/^\./g,"");

    // 保证.只出现一次，而不能出现两次以上

    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");

    if(decimal && value.includes('.'))
    {
        // const decstr = (new Array(decimal)).fill('\\d').join('');   // 快速创建对应含有多少个的\d 用于匹配位数
        // // 只能输入两个小数
        // const reg = new RegExp(`^(\-)*(\\d+)\.(${decstr}).*$`);
        // value = value.replace(reg,'$1$2.$3');
        const numarr = value.split('.');
        const intstr = numarr[0];
        let decimalstr = numarr[1];
        decimalstr = decimalstr.length>decimal?decimalstr.substr(0,decimal):decimalstr;
        value = [intstr,decimalstr].join('.');
    }
    
    return value;
}

export class BigNumber
{
    public value:number;
    
    constructor(value:string|number)
    {
        if(typeof value==="string")
        {
            this.value = parseFloat(value);
        }
        else
        {
            this.value = value;
        }
    }

    public toString(){
        return this.value.toString();
    }

    public toFixed(decimal:number)
    {        
        return toFixed(this.value,decimal);
    }

    public add(...arg) {
        // tslint:disable-next-line:one-variable-per-declaration
        let r1, r2, m, result = this.value;
        arg.forEach(value => {
            if(typeof value==="object")
            {
                value=value['value'];
            }
            try { r1 = result.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = value.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            result = Math.round(result * m + value * m) / m;
        });
        return new BigNumber(result);
    }
    public sub (...arg) {
        // tslint:disable-next-line:one-variable-per-declaration
        let r1, r2, m, result = this.value;
        arg.forEach(value => {
            if(typeof value==="object")
            {
                value=value['value'];
            }
            try { r1 = result.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = value.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));
            const n = (r1 >= r2) ? r1 : r2;
            result = parseFloat((Math.round(result * m - value * m) / m).toFixed(n));
        });
        return new BigNumber(result);
    };

    public mul(...arg) {
        let result = this.value;
        if(result===0)
        {
            return new BigNumber(0);
        }
        arg.forEach(value => {
            if(typeof value==="object")
            {
                value=value['value'];
            }
            let m = 0;
            const s1 = result.toString();
            const s2 = value.toString();
            try { m += s1.split(".")[1].length } catch (e) { m=0 }
            try { m += s2.split(".")[1].length } catch (e) { m=m }
            result = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        });
        return new BigNumber(result);
    };

    public div(...arg) {
        let result = this.value;
        if(result===0)
        {
            return new BigNumber(0);
        }
        arg.forEach(value => {
            let t1 = 0; let t2 = 0;let r1; let r2;
            try { t1 = result.toString().split(".")[1].length } catch (e) { t1=0 }
            try { t2 = value.toString().split(".")[1].length } catch (e) { t2=0 }
            r1 = Number(result.toString().replace(".", ""));
            r2 = Number(value.toString().replace(".", ""));
            result = (r1 / r2) * Math.pow(10, t2 - t1);
        });
        return new BigNumber(result);
    };

    /**
     * 平方
     */
    public sqr(){
        return this.mul(this.value);
    }

    /**
     * 开平方根
     */
    public sqrt(){
        return new BigNumber(Math.sqrt(this.value));
    }

    public compareTo(num:number|string|BigNumber){
        if(typeof num==="number")
        {
            return this.value-num<0?-1:(this.value-num>0?1:0)
        }
        if(typeof num==="string")
        {
            return this.compareTo(toBigNumber(num))
        }
        if(num instanceof BigNumber)
        {
            return this.value-num.value<0?-1:(this.value-num.value>0?1:0)
        }
    }

}


export const toBigNumber=(value:string|number)=>{
    return new BigNumber(value);
}


// tslint:disable-next-line:max-classes-per-file
export class BigInteger
{
    public value: bigint;
    
    constructor(value:string|number|bigint)
    {
        if(typeof value === "string")
        {
            this.value = BigInt(value.split('.')[0]);
        }
        else if(typeof value === "number")
        {
            this.value = BigInt(value.toString().split('.')[0]);
        }
        else
        {
            this.value = value;
        }
    }

    public toString(){
        return this.value.toString();
    }

    public toNumber(){
        return parseFloat(this.value.toString());
    }

    public toFloat(decimal:number)
    {
        return toBigNumber(this.toString()).div(Math.pow(10,decimal)).value;
    }

    public toFixed(decimal:number)
    {
        return toFixed(this.toNumber(),decimal);
    }

    public div(arg:bigint|BigInteger|number|string):BigInteger
    {
        if(this.value===BigInt(0))
        {
            return toBigIntger(0);
        }
        if( arg instanceof BigInteger)
        {
            return arg.value===BigInt(0)?toBigIntger(0):toBigIntger(this.value/arg.value);
        }
        else if(typeof arg==="bigint")
        {
            return arg===BigInt(0)?toBigIntger(0):toBigIntger(this.value/arg)
        }
        else
        {
            return this.div(toBigIntger(arg));
        }
    }

    public mul(arg:bigint|BigInteger|number|string):BigInteger
    {
        if( arg instanceof BigInteger)
        {
            return toBigIntger(this.value*arg.value);
        }
        else if(typeof arg==="bigint")
        {
            return toBigIntger(this.value*arg)
        }
        else
        {
            return this.mul(toBigIntger(arg));
        }
    }

    public add(arg:bigint|BigInteger|number|string):BigInteger
    {
        if( arg instanceof BigInteger)
        {
            return toBigIntger(this.value+arg.value);
        }
        else if(typeof arg==="bigint")
        {
            return toBigIntger(this.value+arg)
        }
        else
        {
            return this.add(toBigIntger(arg));
        }
    }

    public sub(arg:bigint|BigInteger|number|string):BigInteger
    {
        if( arg instanceof BigInteger)
        {
            return toBigIntger(this.value-arg.value);
        }
        else if(typeof arg==="bigint")
        {
            return toBigIntger(this.value-arg)
        }
        else
        {
            return this.sub(toBigIntger(arg));
        }
    }
}

export const toBigIntger=(value:string|number|bigint,decimal?)=>
{
    if(!decimal)
    {
        return new BigInteger(value);
    }
    if(typeof value ==="number")
    {
        return new BigInteger(value.toFixed(decimal).replace('.',''))
    }
    if(typeof value ==="string")
    {
        return new BigInteger(parseFloat(value).toFixed(decimal).replace('.',''));
    }
    return new BigInteger(value);
}