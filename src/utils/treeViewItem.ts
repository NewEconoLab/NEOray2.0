export class TreeViewItems {
    public div: HTMLDivElement;
    public ul: HTMLUListElement;
    constructor(div: HTMLDivElement) {
        this.div = div;
        this.ul = document.createElement("ul");
        this.div.appendChild(this.ul);
    }

    public showTree(pater: HTMLUListElement, data: TreeView, valueDiv: HTMLDivElement) {
        if (data.items.length > 0) {
            for (const tree of data.items) {
                if (tree.items.length > 0) {
                    const li = document.createElement("li");
                    const ul = document.createElement("ul");
                    li.textContent = tree.title + ":";
                    li.appendChild(ul)
                    pater.appendChild(li);
                    this.showTree(ul, tree, valueDiv);
                }
                else {
                    const li = document.createElement("li")
                    li.textContent = tree.value ? tree.title + ":" + tree.value : tree.title;
                    pater.appendChild(li);
                    if (tree.title === "ByteArray" && tree.value) {
                        const value = document.createElement("ul");
                        value.textContent = tree.value;
                        const bts = tree.value.hexToBytes();
                        const asstr = document.createElement("li");
                        let str = ""
                        try {
                            str = ThinNeo.Helper.Bytes2String(bts);
                        } catch (error) {
                            str = "不可转换 utf8字符串"
                        }
                        asstr.textContent = "asStr : " + str;
                        value.appendChild(asstr);
                        if (tree.value.length <= 8) {
                            const num = Neo.BigInteger.fromUint8Array(bts);
                            const asnum = document.createElement("li");
                            asnum.textContent = "asNum : " + num.toString();
                            value.appendChild(asnum);
                        }
                        if (tree.value.length === 40) {
                            const addr = ThinNeo.Helper.GetAddressFromScriptHash(bts);
                            const asaddr = document.createElement("li");
                            asaddr.textContent = "asAddr : " + addr;
                            value.appendChild(asaddr);
                        }
                        li.onclick = () => {
                            while (valueDiv.hasChildNodes()) // 当div下还存在子节点时 循环继续
                            {
                                if (valueDiv.firstChild) {
                                    valueDiv.removeChild(valueDiv.firstChild);
                                }
                            }
                            valueDiv.appendChild(value)
                        }
                    }
                }
            }
        }
    }

}

// tslint:disable-next-line:max-classes-per-file
export class TreeView {
    public title: string;
    public value: string;
    public items: TreeView[];
    constructor(title: string, value?: string) {
        this.title = title;
        this.value = value ? value : "";
        this.items = [];
    }
    public addChildren(treenode: TreeView) {
        this.items.push(treenode);
    }
}