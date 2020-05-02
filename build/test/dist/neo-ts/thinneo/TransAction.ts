///<reference path="helper.ts"/>
namespace ThinNeo
{
    export enum TransactionType
    {
        /// <summary>
        /// 用于分配字节费的特殊交易
        /// </summary>
        MinerTransaction = 0x00,
        /// <summary>
        /// 用于分发资产的特殊交易
        /// </summary>
        IssueTransaction = 0x01,
        /// <summary>
        /// 用于分配小蚁币的特殊交易
        /// </summary>
        ClaimTransaction = 0x02,
        /// <summary>
        /// 用于报名成为记账候选人的特殊交易
        /// </summary>
        EnrollmentTransaction = 0x20,
        /// <summary>
        /// 用于资产登记的特殊交易
        /// </summary>
        RegisterTransaction = 0x40,
        /// <summary>
        /// 合约交易，这是最常用的一种交易
        /// </summary>
        ContractTransaction = 0x80,
        /// <summary>
        /// Publish scripts to the blockchain for being invoked later.
        /// </summary>
        PublishTransaction = 0xd0,
        InvocationTransaction = 0xd1
    }
    export enum TransactionAttributeUsage
    {
        Url = 0x81,
        /// <summary>
        /// 外部合同的散列值
        /// </summary>
        ContractHash = 0x00,

        /// <summary>
        /// 用于ECDH密钥交换的公钥，该公钥的第一个字节为0x02
        /// </summary>
        ECDH02 = 0x02,
        /// <summary>
        /// 用于ECDH密钥交换的公钥，该公钥的第一个字节为0x03
        /// </summary>
        ECDH03 = 0x03,

        /// <summary>
        /// 用于对交易进行额外的验证
        /// </summary>
        Script = 0x20,

        Vote = 0x30,

        DescriptionUrl = 0x81,
        Description = 0x90,

        Hash1 = 0xa1,
        Hash2 = 0xa2,
        Hash3 = 0xa3,
        Hash4 = 0xa4,
        Hash5 = 0xa5,
        Hash6 = 0xa6,
        Hash7 = 0xa7,
        Hash8 = 0xa8,
        Hash9 = 0xa9,
        Hash10 = 0xaa,
        Hash11 = 0xab,
        Hash12 = 0xac,
        Hash13 = 0xad,
        Hash14 = 0xae,
        Hash15 = 0xaf,

        /// <summary>
        /// 备注
        /// </summary>
        Remark = 0xf0,
        Remark1 = 0xf1,
        Remark2 = 0xf2,
        Remark3 = 0xf3,
        Remark4 = 0xf4,
        Remark5 = 0xf5,
        Remark6 = 0xf6,
        Remark7 = 0xf7,
        Remark8 = 0xf8,
        Remark9 = 0xf9,
        Remark10 = 0xfa,
        Remark11 = 0xfb,
        Remark12 = 0xfc,
        Remark13 = 0xfd,
        Remark14 = 0xfe,
        Remark15 = 0xff
    }
    export class Attribute
    {
        public usage: TransactionAttributeUsage;
        public data: Uint8Array;
    }
    export class TransactionAttribute implements Neo.IO.ISerializable {

        public usage: TransactionAttributeUsage;
        public data: Uint8Array;

        deserialize(ms: Neo.IO.BinaryReader): void {
            this.usage = ms.readByte() as TransactionAttributeUsage;
            if (this.usage) {
                var buf = ms.readVarBytes(256)
                this.data = new Uint8Array(buf, 0, buf.byteLength);
            }
        }
        serialize(writer: Neo.IO.BinaryWriter): void {
            writer.writeByte(this.usage);
            writer.writeVarBytes(this.data.buffer);
        }
    }
    export class TransactionOutput
    {
        public assetId: Uint8Array;
        public value: Neo.Fixed8;
        public toAddress: Uint8Array;
    }
    export class TransactionInput
    {
        public hash: Uint8Array;
        public index: number;
    }
    export class Witness
    {
        public InvocationScript: Uint8Array;    // 设置参数脚本，通常是吧signdata push进去
        public VerificationScript: Uint8Array;  // 校验脚本，通常是 push 公钥, CheckSig 两条指令   验证的东西就是未签名的交易
        public scriptHash:Uint8Array;
        //这个就是地址的脚本
        public get Address(): string
        {
            // var hash = ThinNeo.Helper.GetScriptHashFromScript(this.VerificationScript);
            // return ThinNeo.Helper.GetAddressFromScriptHash(hash);
            if(this.scriptHash)
                return ThinNeo.Helper.GetAddressFromScriptHash(this.scriptHash);
            else
            {
                var hash = ThinNeo.Helper.GetScriptHashFromScript(this.VerificationScript);
                return ThinNeo.Helper.GetAddressFromScriptHash(hash);
            }
        }
        
    }



    export interface IExtData
    {
        Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void;
        Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void;
    }

    export class InvokeTransData implements IExtData
    {
        public script: Uint8Array;
        public gas: Neo.Fixed8;
        public Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void
        {
            writer.writeVarBytes(this.script.buffer);
            if (trans.version >= 1)
            {
                writer.writeUint64(this.gas.getData());
            }
        }
        public Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void
        {
            var buf = reader.readVarBytes(10000000);
            this.script = new Uint8Array(buf, 0, buf.byteLength);
            if (trans.version >= 1)
            {
                this.gas = new Neo.Fixed8(reader.readUint64());
            }
        }

    }
    export class ClaimTransData implements IExtData
    {
        public claims: TransactionInput[];
        public Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void
        {
            writer.writeVarInt(this.claims.length);
            for (var i = 0; i < this.claims.length; i++)
            {
                writer.write(this.claims[i].hash, 0, 32);
                writer.writeUint16(this.claims[i].index);
            }
        }
        public Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void
        {
            var countClaims = reader.readVarInt();
            this.claims = [];//new TransactionInput[countInputs];
            for (var i = 0; i < countClaims; i++)
            {
                this.claims.push(new TransactionInput());
                //this.inputs[i] = new TransactionInput();
                var arr = reader.readBytes(32);
                this.claims[i].hash = new Uint8Array(arr, 0, arr.byteLength);
                this.claims[i].index = reader.readUint16();
            }
        }
    }
    export class MinerTransData implements IExtData
    {
        public nonce: number;
        public Serialize(trans: Transaction, writer: Neo.IO.BinaryWriter): void
        {
            writer.writeUint32(this.nonce);

        }
        public Deserialize(trans: Transaction, reader: Neo.IO.BinaryReader): void
        {
            this.nonce = reader.readUint32();
        }
    }

    export class Transaction
    {
        //public type: TransactionType;
        public version: number; // 版本
        public nonce: number; // 随机值
        public sender: Neo.Uint160; // 发送者
        public systemFee: Neo.Long;   // 系统费
        public networkFee: Neo.Long;  // 网络费
        public validUntilBlock: number;     // 有效的区块高度
        public attributes: TransactionAttribute[];     //
        //public inputs: TransactionInput[];    NEO3.0去除 input output
        //public outputs: TransactionOutput[];
        public witnesses: Witness[];//见证人
        public cosigners: Neo.Cosigner[];
        public script: Uint8Array;
        public static MaxTransactionSize = 102400;
        public static MaxValidUntilBlockIncrement = 2102400;
        /// <summary>
        /// Maximum number of attributes that can be contained within a transaction
        /// </summary>
        private static MaxTransactionAttributes = 16;
        /// <summary>
        /// Maximum number of cosigners that can be contained within a transaction
        /// </summary>
        private static MaxCosigners = 16;

        public SerializeUnsigned(writer: Neo.IO.BinaryWriter): void
        {
            //write type
            //writer.writeByte(this.type as number);
            //write version
            writer.writeByte(this.version);
            writer.writeUint32(this.nonce);
            writer.write(this.sender.toArray(), 0, 20) // 地址
            //writer.writeUint64(this.systemFee)     // 不知道对不对啊，把BigInteger转换成 int32传进去  应该不行，需要处理成 int64
            //writer.writeUint64(this.networkFee)    // 不知道对不对
            //console.log("sysfee", this.systemFee.toBytes(true))
            //writer.writeVarBytes(this.systemFee.toBytes(true));
            writer.writeInt64(this.systemFee);
            writer.writeInt64(this.networkFee)
            console.log("netfee", this.networkFee.toNumber())
            //writer.writeVarBytes(this.networkFee.toBytes(true));
            writer.writeUint32(this.validUntilBlock);
            writer.writeSerializableArray(this.attributes);
            writer.writeSerializableArray(this.cosigners);
            writer.writeVarBytes(this.script);
        }
        public Serialize(writer: Neo.IO.BinaryWriter): void
        {
            this.SerializeUnsigned(writer);

            var witnesscount = this.witnesses.length;
            writer.writeVarInt(witnesscount);
            for (var i = 0; i < witnesscount; i++)
            {
                var _witness = this.witnesses[i];
                writer.writeVarBytes(_witness.InvocationScript.buffer);
                writer.writeVarBytes(_witness.VerificationScript.buffer);
            }
        }
        public extdata: IExtData;

        public DeserializeUnsigned(ms: Neo.IO.BinaryReader): void
        {
            //参考源码来自
            //      https://github.com/neo-project/neo
            //      Transaction.cs
            //      源码采用c#序列化技术

            //参考源码2
            //      https://github.com/AntSharesSDK/antshares-ts
            //      Transaction.ts
            //      采用typescript开发

            //this.type = ms.readByte() as TransactionType;//读一个字节，交易类型
            this.version = ms.readByte();
            if (this.version > 0) throw new Error("Transaction Format Exception")
            this.nonce = ms.readUint32();
            this.sender = ms.readSerializable(Neo.Uint160) as Neo.Uint160;
            this.systemFee = Neo.Long.fromBytes(Uint8Array.fromArrayBuffer(ms.readBytes(8)));
            if (this.systemFee.comp(Neo.Long.ZERO) < 0) throw new Error("Transaction Format Exception")
            //if (SystemFee % BigInteger.Pow(10, 8) != 0) throw new FormatException();
            this.networkFee = Neo.Long.fromBytes(Uint8Array.fromArrayBuffer(ms.readBytes(8)));
            if (this.networkFee.comp(Neo.Long.ZERO) < 0) throw new Error("Transaction Format Exception");
            if (this.systemFee.add(this.networkFee).comp(this.systemFee) < 0) throw new Error("Transaction Format Exception");
            this.validUntilBlock = ms.readUint32();
            this.attributes = ms.readSerializableArray(TransactionAttribute, Transaction.MaxTransactionAttributes) as TransactionAttribute[];
            this.cosigners = ms.readSerializableArray(Neo.Cosigner, Transaction.MaxCosigners) as Neo.Cosigner[];
            //if (Cosigners.Select(u => u.Account).Distinct().Count() != Cosigners.Length) throw new FormatException();
            this.script = Uint8Array.fromArrayBuffer(ms.readVarBytes(0xffff));
        }
        public Deserialize(ms: Neo.IO.BinaryReader): void
        {
            this.DeserializeUnsigned(ms);
            if (ms.canRead()>0)
            {
                var witnesscount = ms.readVarInt();
                this.witnesses = [];
                for (var i = 0; i < witnesscount; i++)
                {
                    this.witnesses.push(new Witness());
                    this.witnesses[i].InvocationScript = new Uint8Array(ms.readVarBytes()).clone();
                    this.witnesses[i].VerificationScript = new Uint8Array(ms.readVarBytes()).clone();
                }
            }
        }
         

        public GetMessage(): Uint8Array
        {
            var ms = new Neo.IO.MemoryStream();
            var writer = new Neo.IO.BinaryWriter(ms);
            this.SerializeUnsigned(writer);
            var arr = ms.toArray();
            var msg = new Uint8Array(arr, 0, arr.byteLength);
            return msg;
        }
        public GetRawData(): Uint8Array
        {
            var ms = new Neo.IO.MemoryStream();
            var writer = new Neo.IO.BinaryWriter(ms);
            this.Serialize(writer);
            var arr = ms.toArray();
            var msg = new Uint8Array(arr, 0, arr.byteLength);
            return msg;
        }
        //增加个人账户见证人（就是用这个人的私钥对交易签个名，signdata传进来）
        public AddWitness(signdata: Uint8Array, pubkey: Uint8Array, addrs: string): void
        {
            {//额外的验证
                var msg = this.GetMessage();

                console.log(msg.toHexString())
                console.log("sign data",signdata.toHexString())
                var bsign = ThinNeo.Helper.VerifySignature(msg, signdata, pubkey);
                if (!bsign)
                    throw new Error("wrong sign");

                var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                if (addr != addrs)
                    throw new Error("wrong script");
            }

            var vscript = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey);

            console.log("vscript hex",vscript.toHexString())

            //iscript 对个人账户见证人他是一条pushbytes 指令

            var sb = new ThinNeo.ScriptBuilder();
            sb.EmitPushBytes(signdata);

            var iscript = sb.ToArray();

            this.AddWitnessScript(vscript, iscript);
        }

        //增加智能合约见证人
        public AddWitnessScript(vscript: Uint8Array, iscript: Uint8Array,scripthash?:Uint8Array): void
        {
            if (this.witnesses == null)
                this.witnesses = [];
            var newwit = new Witness();
            newwit.VerificationScript = vscript;
            newwit.InvocationScript = iscript;

            if(scripthash)
            {
                newwit.scriptHash = scripthash;
            }
            else
            {
                newwit.scriptHash = ThinNeo.Helper.GetScriptHashFromScript(vscript);
            }

            for (var i = 0; i < this.witnesses.length; i++)
            {
                if (this.witnesses[i].Address == newwit.Address)
                    throw new Error("alread have this witness");
            }

            var _witnesses;
            if (this.witnesses)
                _witnesses = this.witnesses;
            else
                _witnesses = [];
            _witnesses.push(newwit);
            _witnesses.sort((a, b) => {
                var hash_a = a.scriptHash
                var hash_b = b.scriptHash
                for (let i = (hash_a.length - 1); i >= 0; i--) {
                    if (hash_a[i] > hash_b[i])
                        return 1;
                    if (hash_a[i] < hash_b[i])
                        return -1;
                }
                return 0;
            });
            this.witnesses = _witnesses;
        }

        //TXID
        public GetHash(): Uint8Array
        {
            var msg = this.GetMessage();
            var data = Neo.Cryptography.Sha256.computeHash(msg);
            data = Neo.Cryptography.Sha256.computeHash(data);
            return new Uint8Array(data, 0, data.byteLength);

        }

        public GetTxid(): string
        {
            var tranhash = this.GetHash().clone().reverse().toHexString();
            return tranhash;
        }
    }
}
