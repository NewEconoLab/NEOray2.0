import { IDebugStore } from "./interface/debug.interface";
import { getTxidByAddressAndContract, getDumpInfoByTxid, getNotify } from "@/store/api/common.api";
import common from "@/store/common";
import codeStore from "@/containers/code/store/code.store";
import outputStore from "@/containers/output/store/index.store";
import { observable, action } from "mobx";
import { readOssFile, getContractDeployInfoByHash } from "@/containers/code/store/api/common.api";
import { TreeView, TreeViewItems } from "@/utils/treeViewItem";
import fileStore from "@/containers/file/store/file.store";
import { notification } from "antd";

class DebugStore implements IDebugStore {
    @observable public isStart: boolean = false;
    @observable public txlist: Array<{ txid: string, time: string }> = [];
    @observable public oplist: ThinNeo.Compiler.Op[] = [];
    @observable public addr: any;
    @observable public currentTxid: string = "";
    @observable public dumpstr: string = "";
    @observable public dumpinfo: string = "";
    @observable public notify: string = "";
    @observable public stackarr:
        Array<{
            script: ThinNeo.SmartContract.Debug.LogScript, op: ThinNeo.SmartContract.Debug.LogOp
        } | undefined> = [];
    public contractFiles: {} = {};
    public simVM: ThinNeo.Debug.SimVM;
    @action public initTxList = async () => {
        this.txlist = [];
        // this.currentTxid = "";
        if (common.address && codeStore.deploy) {
            try {
                const result = await getTxidByAddressAndContract(common.address, codeStore.codeid, 1, 20);
                this.txlist = result;
            } catch (error) {
                this.txlist = [];
            }
        }
        else {
            this.txlist = [];
        }
    }

    @action public onTxidChange = (txid: string) => {
        this.currentTxid = txid;
    }

    @action public startDebug = async (txid: string) => {
        try {
            const dumpResult = await getDumpInfoByTxid(txid);
            this.initNotify();
            if (dumpResult) {
                this.isStart = true;
                this.currentTxid = txid;
                outputStore.toPage("stack");
                const dumpinfostr = dumpResult[ 0 ][ 'dimpInfo' ];
                const lzma: nid.LZMA = new nid.LZMA();
                nid.utils.MEMORY.reset();
                const srcbytes = dumpinfostr.hexToBytes();
                let unpackjsonstr: string = "";
                let unpackjson: {};

                try {
                    const destbytes = lzma.decode(srcbytes);
                    // console.log("decode got: srcsize=" + srcbytes.length + " destsize=" + destbytes.length);
                    unpackjsonstr = ThinNeo.Helper.Bytes2String(destbytes);
                    // console.log("jsonstr =" + unpackjsonstr);
                    unpackjson = JSON.parse(unpackjsonstr);
                    // console.log("convert to json . log to console");
                }
                catch (e) {
                    console.log("decode error." + e);
                    return;
                }

                if (unpackjson != null) {
                    const dumpinfo = ThinNeo.SmartContract.Debug.DumpInfo.FromJson(unpackjson);
                    this.simVM = new ThinNeo.Debug.SimVM();
                    this.simVM.Execute(dumpinfo);
                    this.dumpinfo = "";
                    // 预先获得所有需要加载的 avm等信息
                    this.showCareInfo(this.simVM.careinfo)
                    // this.careInfo.setValue(careInfoStr)
                    // this.stackarr = [];
                    this.dumpScript(this.simVM.regenScript, 1);

                    // this.fulllogEditor.on("cursorActivity", (res) =>
                    // {
                    //     this.debug()
                    // })
                }
            }
            else {
                notification.error({ "message": "当前交易未收录" })
            }
        } catch (error) {
            notification.error({ "message": "当前交易未收录" })
        }
    }

    @action public stopDebug = () => {
        if (this.isStart) {
            this.isStart = false;
            this.currentTxid = "";
            this.dumpstr = "";
            this.dumpinfo = "";
            this.notify = "";
            // this.txlist = []
            this.oplist = [];
            this.stackarr = [];
            const div = document.getElementById("calcstack-content") as HTMLDivElement;
            const div1 = document.getElementById("altstack-content") as HTMLDivElement;
            const div2 = document.getElementById("valuetool") as HTMLDivElement;
            if (div) {
                this.divClear(div)
            }
            if (div1) {
                this.divClear(div1)
            }
            if (div2) {
                this.divClear(div2)
            }
            common.event.emit('delPosition');
            outputStore.toPage("output");
            fileStore.toCurrentFile();
        }
    }

    @action public addAvmStr(str: string) {
        if (this.dumpinfo) {
            this.dumpinfo += "\n" + str;
        } else {
            this.dumpinfo += str;
        }
    }

    @action public dumpScript(script: ThinNeo.SmartContract.Debug.LogScript, level: number) {
        let space = "";
        // tslint:disable-next-line:no-shadowed-variable
        for (let i = 0; i < level; i++) {
            space += "\t";
        }
        if (level > 1) {
            this.addAvmStr(space + "hash : " + script.hash);
        }
        else {
            this.addAvmStr("hash : " + script.hash);
        }
        this.stackarr.push(undefined);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < script.ops.length; i++) {
            const str = script.ops[ i ].GetHeader();
            console.log(str);
            if (str === '13:PUSHBYTES1') {
                console.log(str);
            }
            this.addAvmStr(space + "op : " + str);
            if (script.ops[ i ].GetHeader().includes("APPCALL")) {
                const arr = [];
                // 预先获得所有需要加载的 avm等信息
                if (script.ops[ i ].subScript) {
                    script.ops[ i ].subScript.GetAllScriptName(arr)
                    this.initCode(arr);
                }
            }

            if (script.ops[ i ].subScript != null) {
                this.dumpScript(script.ops[ i ].subScript, level + 1);
            }
            this.stackarr.push({ script: script, op: script.ops[ i ] });
        }
        if (level === 1) {
            this.dumpstr = this.dumpinfo
        }
    }

    public async initCode(hasharr: string[]) {
        // this.cEditor.setValue("");
        for (const hash of hasharr) {
            const contractinfo = (await getContractDeployInfoByHash(hash))[ 0 ];
            const language = contractinfo.language === 'py' ? 'py' : 'cs';
            const name = contractinfo.name;
            // tslint:disable-next-line:one-variable-per-declaration
            let cs, py, avm, map = "";
            if (language === 'cs') {
                try {
                    cs = await readOssFile(hash, "cs", false);
                } catch (error) {
                    cs = "";
                }
            }
            else {
                try {
                    py = await readOssFile(hash, 'py', false);
                } catch (error) {
                    py = ""
                }
            }
            try {
                avm = await readOssFile(hash, "avm", false);
            } catch (error) {
                avm = "";
            }
            try {
                map = await readOssFile(hash, "map.json", false);
            } catch (error) {
                map = "";
            }
            this.contractFiles[ hash ] = {
                cs, py, avm, map, name, language
            }
        }
    }

    public showCode(hash: string) {
        try {
            const code = codeStore.code;
            if (codeStore.codeid !== hash || !code || !this.addr)   // 要提前判断是否是部署的合约
            {
                const coderesult = this.contractFiles[ hash ];
                if (coderesult) {
                    this.oplist = ThinNeo.Compiler.Avm2Asm.Trans(coderesult.avm.hexToBytes());
                    // console.log(JSON.parse(coderesult.map));

                    this.addr = ThinNeo.Debug.Helper.AddrMap.FromJson(JSON.parse(coderesult.map));
                    // this.cEditor.setValue(coderesult.cs);
                    const codestr = coderesult.cs ? coderesult.cs : coderesult.py;
                    const filename = coderesult.name ? coderesult.name : hash
                    codeStore.initCode(hash, filename, coderesult.language, codestr, true);
                }
                else {
                    codeStore.code = "";
                    codeStore.codeid = "";
                    codeStore.filename = "";
                }
            }
        }
        catch (error) {
            codeStore.code = "";
            this.addr = undefined;
        }
    }

    public async initNotify() {
        const result = await getNotify(this.currentTxid);
        this.notify = JSON.stringify(result[ 0 ], null, 2);
    }


    public showCareInfo(careArray: ThinNeo.Debug.CareItem[]) {
        const div = document.getElementById("careInfo-msg") as HTMLDivElement;
        const div2 = document.getElementById("valuetool") as HTMLDivElement;
        if (div) {
            this.divClear(div)
        }
        const tree = new TreeView("");
        for (const careInfo of careArray) {
            const careview = new TreeView(careInfo.name)
            tree.addChildren(careview);
            if (!careInfo.item) {
                careview.title = careInfo.name + "()";
            }
            else if (careInfo.item.type === "Array") {
                this.calcStackShow(careInfo.item.subItems, careview);
            } else {
                const chird = new TreeView(careInfo.item.type, careInfo.item.strvalue)
                tree.addChildren(chird);
            }
        }
        const view = new TreeViewItems(div);
        view.showTree(view.ul, tree, div2);
    }
    public showStack(op: ThinNeo.SmartContract.Debug.LogOp) {
        const div = document.getElementById("calcstack-content") as HTMLDivElement;
        const div1 = document.getElementById("altstack-content") as HTMLDivElement;
        const div2 = document.getElementById("valuetool") as HTMLDivElement;
        if (div) {
            this.divClear(div)
        }
        if (div1) {
            this.divClear(div1)
        }
        const stateid = this.simVM.mapState[ op.guid ];
        const state = this.simVM.stateClone[ stateid ];
        if (state) {
            const calcStack = state.CalcStack[ 'list' ];
            const altStack = state.AltStack[ 'list' ];
            const tree = new TreeView("");
            const tree1 = new TreeView("");

            const view = new TreeViewItems(div)
            const view1 = new TreeViewItems(div1)

            this.calcStackShow(calcStack, tree);
            this.calcStackShow(altStack, tree1)
            view.showTree(view.ul, tree, div2);
            view1.showTree(view1.ul, tree1, div2);

        } else {
            // console.log("state is undefined");
        }
    }

    public calcStackShow(item, tree: TreeView) {
        if (item) {
            for (const obj of item) {

                if (obj[ "type" ] === "Array") {
                    const view = new TreeView("Array");
                    tree.addChildren(view);
                    if (obj[ "subItems" ].length > 0) {
                        this.calcStackShow(obj[ "subItems" ], view)
                    } else {
                        view.value = "[]"
                    }
                }
                else if (obj[ "type" ]) {
                    const view = new TreeView(obj[ "type" ], obj[ "strvalue" ])
                    tree.addChildren(view);
                }
            }
        }
    }

    public divClear(div: HTMLDivElement) {
        while (div.hasChildNodes()) {
            if (div.firstChild) {
                div.removeChild(div.firstChild);
            }
        }
    }

    public onDebug(line: number) {
        // let codeline = this.fulllogEditor.getCursor().line;
        // this.fulllogEditor.removeLineClass(this.currentHighlightLine_avm, "background", "cursor-line-highight")
        // this.fulllogEditor.addLineClass(codeline, "background", "cursor-line-highight");
        // this.currentHighlightLine_avm = codeline;


        const stack = this.stackarr[ line ]
        if (stack) {
            const script = stack.script;
            const op = stack.op;
            this.showCode(script.hash);
            this.showStack(op);
            // console.log("script hash : " + script.hash);
            // let oldHightlightLine = this.currentHighlightLine;
            // this.cEditor.removeLineClass(this.currentHighlightLine, "background", "fixed-position")
            if (this.contractFiles[ script.hash ] && this.addr) {
                const codeline = this.addr.GetLineBack(op.addr);// 尽量倒着取到对应的代码 codemirro 塞入的时候多往下了
                if (codeline >= 0) {
                    common.event.emit('setPosition', codeline)
                }
                else {
                    common.event.emit('delPosition')
                }
            }
            else {
                common.event.emit('delPosition')
            }
        }
    }
}

export default new DebugStore();