namespace ThinNeo.Debug {
    export class methodHelper {

        private static _Ins: methodHelper;
        public static get Ins(): methodHelper {
            if (this._Ins == undefined)
                this._Ins = new methodHelper();
            return this._Ins;
        }

        private dic = {};

        private methods =[
            "System.Enumerator.Create",
            "System.Enumerator.Next",
            "System.Enumerator.Value",
            "System.Enumerator.Concat",
            "System.Json.Serialize",
            "System.Json.Deserialize",
            "System.Runtime.Platform",
            "System.Runtime.GetTrigger",
            "System.Runtime.GetTime",
            "System.Runtime.GetScriptContainer",
            "System.Runtime.GetExecutingScriptHash",
            "System.Runtime.GetCallingScriptHash",
            "System.Runtime.GetEntryScriptHash",
            "System.Runtime.CheckWitness",
            "System.Runtime.GetInvocationCounter",
            "System.Runtime.Log",
            "System.Runtime.Notify",
            "System.Runtime.GetNotifications",
            "System.Storage.GetContext",
            "System.Storage.GetReadOnlyContext",
            "System.Storage.AsReadOnly",
            "System.Storage.Get",
            "System.Storage.Find",
            "System.Storage.Put",
            "System.Storage.PutEx",
            "System.Storage.Delete",
            "System.Contract.Create",
            "System.Contract.Update",
            "System.Contract.Destroy",
            "System.Contract.Call",
            "System.Contract.CallEx",
            "System.Contract.IsStandard",
            "System.Iterator.Create",
            "System.Iterator.Key",
            "System.Iterator.Keys",
            "System.Iterator.Values",
            "System.Iterator.Concat",
            "System.Blockchain.GetHeight",
            "System.Blockchain.GetBlock",
            "System.Blockchain.GetTransaction",
            "System.Blockchain.GetTransactionHeight",
            "System.Blockchain.GetTransactionFromBlock",
            "System.Blockchain.GetContract",
            "System.Binary.Serialize",
            "System.Binary.Deserialize",
            "Neo.Crypto.ECDsaVerify",
            "Neo.Crypto.ECDsaCheckMultiSig",
            "Neo.Native.Deploy",
            "Neo.Native.Tokens.NEO",
            "Neo.Native.Tokens.GAS",
            "Neo.Native.Policy"
        ];

        constructor() {
            for (var i = 0; i < this.methods.length; i++) {
                var method = this.methods[i];
                var api_bytes = ThinNeo.Helper.String2Bytes(method);
                var api = Neo.BigInteger.fromUint8Array(Uint8Array.fromArrayBuffer(Neo.Cryptography.Sha256.computeHash(api_bytes.buffer))).toUint64().toUint32();
                this.dic[api] = method;
            }
        }

        public getMethodName( _api:number)
        {
            return this.dic[_api] ? this.dic[_api] : "UNKONW";
        }
}
}
