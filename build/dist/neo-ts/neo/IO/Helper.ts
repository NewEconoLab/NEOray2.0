interface Uint8Array
{
    asSerializable(T: Function): Neo.IO.ISerializable;
}

interface Uint8ArrayConstructor
{
    fromSerializable(obj: Neo.IO.ISerializable): Uint8Array;
}

Uint8Array.prototype.asSerializable = function (T: Function): Neo.IO.ISerializable
{
    let ms = new Neo.IO.MemoryStream(this.buffer, false);
    let reader = new Neo.IO.BinaryReader(ms);
    return reader.readSerializable(T);
}

Uint8Array.fromSerializable = function (obj: Neo.IO.ISerializable): Uint8Array
{
    let ms = new Neo.IO.MemoryStream();
    let writer = new Neo.IO.BinaryWriter(ms);
    obj.serialize(writer);
    return new Uint8Array(ms.toArray());
}

namespace Neo.IO{
    export class Helper{
        static getVarSize(value: number): number;
        static getVarSize(value: string): number;
        static getVarSize(value: object): number;

        public static getVarSize(value: any): number{
            if (typeof value == "number") {

                if (value < 0xFD) {
                    return 1; // sizeof(byte);
                }
                else if (value <= 0xFFFF) {
                    return 1 + 2; // sizeof(byte) + sizeof(ushort);
                }
                else {
                    return 1 + 4; // sizeof(byte) + sizeof(uint);
                }
            }
            else if (typeof value == "string") {
                var size = ThinNeo.Helper.String2Bytes(value).byteLength;
                return this.getVarSize(size) + size;
            }
            else {
                if (value instanceof Enumerator) {

                }
            }
            //else if (value is strin) {
            //    var value_size;
            //    if (value is iserializable) {

            //    }
            //}
        }

        //public static getVarSize(value): number{
        //    var element_size;
        //    if (value instanceof Uint8Array) {
        //        element_size = 1;
        //    }
        //    else if (value instanceof Int16Array || value instanceof Uint16Array) {
        //        element_size = 2;
        //    }
        //    else if (value instanceof Number || value instanceof Uint32Array) {
        //        element_size = 4;
        //    }
        //    else {
        //        element_size = 8;
        //    }
            
        //    var value_size = Object.keys(value).length * element_size;
        //    return value_size
        //}
    }
}