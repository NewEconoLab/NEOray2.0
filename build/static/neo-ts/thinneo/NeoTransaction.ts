namespace ThinSdk {
    export class NeoTransaction {
        public scriptBuilder:ThinNeo.ScriptBuilder;

        public tran:ThinNeo.Transaction;

        public contract:Contract;

        public gas:Token.GAS;

        public neo: Token.NEO;

        constructor(sender: Neo.Uint160, currentBlockIndex: number) {
            this.scriptBuilder = new ThinNeo.ScriptBuilder();
            this.gas = new Token.GAS(this.scriptBuilder);
            this.neo = new Token.NEO(this.scriptBuilder);
            this.tran = new ThinNeo.Transaction()
            this.tran.version = 0;
            const RANDOM_UINT8: Uint8Array = this.getWeakRandomValues(32);
            const RANDOM_INT: Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
            //this.tran.nonce = RANDOM_INT.toInt32();
            this.tran.nonce = 12121;
            this.tran.sender = sender;
            this.tran.validUntilBlock = currentBlockIndex + ThinNeo.Transaction.MaxValidUntilBlockIncrement-1;
            const cosigner = new Neo.Cosigner()
            cosigner.scopes = Neo.WitnessScope.CalledByEntry;
            cosigner.account = sender;
            this.tran.cosigners = [cosigner];
            this.tran.attributes = [];
            this.tran.systemFee = Neo.Long.ZERO;
            this.tran.networkFee = Neo.Long.ZERO;
        }

        public signAndPack(prikey: Uint8Array, sysFee: number,) {
            this.tran.script = this.scriptBuilder.ToArray();
            console.log("script",this.tran.script.toHexString());
            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
            var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            var witness_script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey);
            if (witness_script.isSignatureContract())// 判断是否为合约签名 现在默认都是 这里要重整下的
            {
                var networkFee = ThinSdk.ApplicationEngine[ThinNeo.OpCode.PUSHDATA1] + ApplicationEngine[ThinNeo.OpCode.PUSHNULL] + ThinSdk.ApplicationEngine[ThinNeo.OpCode.PUSHDATA1] + 1000000;
            }
            else {
                //We can support more contract types in the future.
            }
            
            // 记算网络费
            this.tran.networkFee = this.tran.networkFee.add(this.tran.GetMessage().length).add(110).mul(1000).add(networkFee);
            
            // 计算系统费  目前系统费取整 0.1就是1  1.1就是2
            this.tran.systemFee = Neo.Long.fromNumber(sysFee).div(100000000).add(1).mul(100000000);
            //console.log("Transaction Message ", this.tran.GetMessage().toHexString())
            //this.tran.networkFee = Neo.Long.fromNumber(1354390);
            //this.tran.systemFee = Neo.Long.fromNumber(100000000);
            console.log("Transaction SystemFee", this.tran.systemFee.toNumber())
            console.log("Transaction NetworkFee", this.tran.networkFee.toNumber())
            //var str = data.toHexString();
            //console.log("msg str",str)
            //var data2 = this.tran.GetMessage();
            //console.log("Transaction Message ", data2.toHexString())

            //console.log("GetMessage", this.tran.GetMessage().toHexString());
            var data = this.tran.GetMessage()
            console.log("Transaction Message",data.toHexString())
            //var signtest = ThinNeo.Helper.Sign(Neo.Long.fromNumber(10000).toBytes(true), prikey)
            //console.log("test sign",signtest.toHexString());
            var signData = ThinNeo.Helper.Sign(data, prikey);
            console.log("sign data", signData.toHexString());
            var b = ThinNeo.Helper.VerifySignature(data, signData, pubkey);
            if (!b) throw new Error("sign error")
            this.tran.AddWitness(signData, pubkey, address);
            var rawData = this.tran.GetRawData();
            return rawData;
        }

        public getTranMessage() {
            return this.tran.GetMessage().toHexString();
        }

        public getTranData() {
            return this.tran.GetRawData().toHexString();
        }

        public getWeakRandomValues(array: number | Uint8Array) {
            let buffer = typeof array === "number" ? new Uint8Array(array) : array;
            for (let i = 0; i < buffer.length; i++)
                buffer[i] = Math.random() * 256;
            return buffer;
        }
    }
}