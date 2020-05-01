namespace Neo {

    export class Cosigner implements IO.ISerializable {
        public account: Neo.Uint160;
        public scopes: WitnessScope;
        public allowedContracts: Neo.Uint160[];
        public allowedGroups: Cryptography.ECPoint[];
        public maxSubitems: number = 16;
        //public get size() { return Uint160.Length + this.allowedContracts.length }

        constructor() {
            this.scopes = WitnessScope.Global;
        }

        public deserialize(reader: IO.BinaryReader): void {
            this.account = reader.readUint160();
            this.scopes = reader.readByte();
            this.allowedContracts = (this.scopes.endsWith(WitnessScope.CustomContracts) ? reader.readSerializableArray(Uint160, this.maxSubitems) : []) as Uint160[];
            this.allowedGroups = (this.scopes.endsWith(WitnessScope.CustomGroups) ? reader.readSerializableArray(Cryptography.ECPoint, this.maxSubitems) : []) as Cryptography.ECPoint[];
        }
        public serialize(writer: IO.BinaryWriter): void {
            writer.write(this.account.toArray(),0,20);
            writer.writeByte(this.scopes);
            if (this.scopes.endsWith(WitnessScope.CustomContracts))
                writer.writeSerializableArray(this.allowedContracts);
            if (this.scopes.endsWith(WitnessScope.CustomGroups))
                writer.writeSerializableArray(this.allowedGroups)
        }
    }
}

interface String {
    endsWith(str: string): boolean;
}
interface Number {
    endsWith(num: number): boolean;
}

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

Number.prototype.endsWith = function (suffix) {
    return this.toString(2).endsWith(suffix.toString(2));
}

interface Object {
    getVarSize<T>(): number;
}

// 其实没必要实现，只是想实现看看效果，装个逼
Object.prototype.getVarSize = function <T>() {
    var obj = this;
    return Object.keys(obj).length;
}