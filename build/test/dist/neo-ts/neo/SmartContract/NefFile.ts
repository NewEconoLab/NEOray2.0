///<reference path="../IO/MemoryStream.ts"/>
///<reference path="../IO/BinaryWriter.ts"/>
namespace Neo.SmartContract {
    /// <summary>
    /// +------------+-----------+------------------------------------------------------------+
    /// |   Field    |  Length   |                          Comment                           |
    /// +------------+-----------+------------------------------------------------------------+
    /// | Magic      | 4 bytes   | Magic header                                               |
    /// | Compiler   | 32 bytes  | Compiler used                                              |
    /// | Version    | 16 bytes  | Compiler version (Mayor, Minor, Build, Version)            |
    /// | ScriptHash | 20 bytes  | ScriptHash for the script                                  |
    /// +------------+-----------+------------------------------------------------------------+
    /// | Checksum   | 4 bytes   | Sha256 of the header (CRC)                                 |
    /// +------------+-----------+------------------------------------------------------------+
    /// | Script     | Var bytes | Var bytes for the payload                                  |
    /// +------------+-----------+------------------------------------------------------------+
    /// </summary>
    export class NefFile implements Neo.IO.ISerializable 
    {
        /// <summary>
        /// NEO Executable Format 3 (NEF3)
        /// </summary>
        private magic = 0x3346454E;

        /// <summary>
        /// Compiler
        /// </summary>
        public compiler: string;

        /// <summary>
        /// Version
        /// </summary>
        public version: Version;

        /// <summary>
        /// Script Hash
        /// </summary>
        public scriptHash: Uint160;

        /// <summary>
        /// Checksum
        /// </summary>
        public checkSum: number;

        /// <summary>
        /// Script
        /// </summary>
        public script: Uint8Array;

        private static headerSize: number =
            4 +              // Magic sizeof(uint)
            32 +                        // Compiler
            16 +         // Version (sizeof(int) * 4)
            20 +            // ScriptHash UInt160.Length
            4;               // Checksum sizeof(uint)

        private _size; 
        public get size() {
            return (
                NefFile.headerSize +              // Header
                this.script.length      // Script
            );

        }
        public set size(value) {
            this._size = value;
        }

        public serialize(writer: Neo.IO.BinaryWriter):void
        {
            writer.writeUint32(this.magic);
            writer.writeFixedString(this.compiler, 32);

            // Version
            writer.writeInt32(this.version.major);
            writer.writeInt32(this.version.minor);
            writer.writeInt32(this.version.build);
            writer.writeInt32(this.version.revision);

            writer.write(this.scriptHash.toArray(), 0, 20)
            writer.writeUint32(this.checkSum);
            writer.writeVarBytes(this.script ?? new Uint8Array[0]);
        }

        public deserialize(reader: Neo.IO.BinaryReader): void
        {
            if (reader.readUint32() != this.magic) {
                throw new ErrorEvent("FormatException", new Error("Wrong magic"));
            }

            this.compiler = reader.readFixedString(32);
            this.version = new Version(reader.readInt32(), reader.readInt32(), reader.readInt32(), reader.readInt32());
            //this.scriptHash = reader.readSerializable(Uint160) as Uint160;
            this.scriptHash = reader.readUint160();
            this.checkSum = reader.readUint32();

            //if (this.checkSum != NefFile.computeChecksum(this)) {
            //    throw new ErrorEvent("FormatException", new Error("CRC verification fail"));
            //}

            this.script = new Uint8Array(reader.readVarBytes(1024 * 1024));

            if (new Neo.Uint160(ThinNeo.Helper.Hash160(this.script)).equals(this.scriptHash)) {
                throw new ErrorEvent("FormatException", new Error("ScriptHash is different"));
            }
        }

        /// <summary>
        /// Compute checksum for a file
        /// </summary>
        /// <param name="file">File</param>
        /// <returns>Return checksum</returns>
        public static computeChecksum(file: NefFile)
        {
            var ms: Neo.IO.MemoryStream = new Neo.IO.MemoryStream(); 
            var wr: Neo.IO.BinaryWriter = new Neo.IO.BinaryWriter(ms)
            file.serialize(wr);

            //var buffer = new byte[HeaderSize - sizeof(uint)];
            var buffer = new Uint8Array(NefFile.headerSize-4)
            ms.seek(0, IO.SeekOrigin.Begin);
            ms.read(buffer, 0, buffer.length);
            return new BigInteger(Neo.Cryptography.Sha256.computeHash(buffer)).toInt32();
            //wr.
            //var data = ms.toArray();
            //var outstr = new Uint8Array(data, 0, data.byteLength).toHexString();
            //using(var ms = new MemoryStream())
            //    using (var wr = new BinaryWriter(ms))
            //        {
            //            file.Serialize(wr);
            //wr.Flush();

            //// Read header without CRC

            //var buffer = new byte[HeaderSize - sizeof(uint)];
            //ms.Seek(0, SeekOrigin.Begin);
            //ms.Read(buffer, 0, buffer.Length);

            //return BitConverter.ToUInt32(ThinSdk.Neo.Cryptography.Helper.Sha256.ComputeHash(buffer), 0);
        //}
        }

        public static loadNef(nefhex: string): NefFile
        {
            var buf = nefhex.hexToBytes();
            if (!nefhex || nefhex.length >= ThinNeo.Transaction.MaxTransactionSize) {
                throw new ErrorEvent("ArgumentException", new Error("this nefhex is undefined"))
            }
            var stream = new Neo.IO.BinaryReader(new Neo.IO.MemoryStream(buf.buffer, 0, buf.byteLength));

            var file: NefFile = stream.readSerializable(NefFile) as NefFile;
            return file;
        }
    }

    export class Version {
        public major: number
        public minor: number
        public build: number
        public revision: number
        constructor(major: number, minor: number, build: number, revision: number)
        {
            this.major = major;
            this.minor = minor;
            this.build = build;
            this.revision = revision;
        }
    }
}
