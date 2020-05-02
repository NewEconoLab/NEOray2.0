///<reference path="UintVariable.ts"/>
namespace Neo

{
    let _zero: Uint160;

    export class Uint160 extends UintVariable implements Neo.IO.ISerializable
    {
        public static get Zero() { return _zero || (_zero = new Uint160()); }

        public static Length: number = 20;

        constructor(value?: ArrayBuffer)
        {
            if (value == null) value = new ArrayBuffer(20);
            if (value.byteLength != 20) throw new RangeError();
            super(new Uint32Array(value));
        }

        public static parse(str: string): Uint160
        {
            if (str.length == 42)
                str = str.replace("0x", "");
            if (str.length != 40) throw new RangeError();
            let x = str.hexToBytes();
            let y = new Uint8Array(x.length);
            for (let i = 0; i < y.length; i++)
                y[i] = x[x.length - i - 1];
            return new Uint160(y.buffer);
        }

        public serialize(writer: Neo.IO.BinaryWriter) {
            writer.writeVarBytes(this.toArray().buffer);
        }

        public deserialize(reader: Neo.IO.BinaryReader) {
            if (reader.read(this.toArray().buffer, 0, this.toArray().buffer.byteLength) != this.toArray().buffer.byteLength) {
                throw new Error("FormatException");
            }
        }
    }
}
