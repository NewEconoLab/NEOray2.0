var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var WalletApi;
(function (WalletApi) {
    function $(tag, name, items, value, id) {
        var view = new View();
        view.tag = tag;
        view.element = document.createElement(tag);
        view.value = view.element.textContent = value;
        if (id)
            view.id = view.element.id = id;
        if (name)
            view.class = view.element.className = name;
        if (items)
            view.items = items;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var el = items_1[_i];
            view.element.appendChild(el.element);
        }
        return view;
    }
    WalletApi.$ = $;
    var View = (function () {
        function View() {
        }
        Object.defineProperty(View.prototype, "type", {
            get: function () {
                return this._type = this.element["type"];
            },
            set: function (v) {
                this._type = v;
                this.element["type"] = this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "id", {
            get: function () {
                this._id = this.element.id;
                return this.id;
            },
            set: function (v) {
                this._id = v;
                this.element.id = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "class", {
            get: function () {
                this._class = this.element.className;
                return this.class;
            },
            set: function (v) {
                this._class = v;
                this.element.className = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "value", {
            get: function () {
                if (this.tag === Tag.input)
                    this._value = this.element.value;
                else
                    this._value = this.element.textContent;
                return this._value;
            },
            set: function (v) {
                this._value = v;
                this.element.textContent = v;
            },
            enumerable: true,
            configurable: true
        });
        View.prototype.cleanChild = function () {
            while (this.element.hasChildNodes()) {
                this.element.removeChild(this.element.firstChild);
            }
        };
        View.prototype.show = function () {
            this.element.style.display = "";
        };
        View.prototype.hide = function () {
            this.element.style.display = "none";
        };
        View.prototype.click = function (call) {
            onclick = function () {
                call();
            };
        };
        return View;
    }());
    WalletApi.View = View;
    var Tag;
    (function (Tag) {
        Tag["a"] = "a";
        Tag["addr"] = "abbr";
        Tag["address"] = "address";
        Tag["applet"] = "applet";
        Tag["area"] = "area";
        Tag["article"] = "article";
        Tag["aside"] = "aside";
        Tag["audio"] = "audio";
        Tag["b"] = "b";
        Tag["base"] = "base";
        Tag["basefont"] = "basefont";
        Tag["bdo"] = "bdo";
        Tag["blockquote"] = "blockquote";
        Tag["body"] = "body";
        Tag["br"] = "br";
        Tag["button"] = "button";
        Tag["canvas"] = "canvas";
        Tag["caption"] = "caption";
        Tag["cite"] = "cite";
        Tag["code"] = "code";
        Tag["col"] = "col";
        Tag["colgroup"] = "colgroup";
        Tag["data"] = "data";
        Tag["datalist"] = "datalist";
        Tag["dd"] = "dd";
        Tag["del"] = "del";
        Tag["details"] = "details";
        Tag["dfn"] = "dfn";
        Tag["dialog"] = "dialog";
        Tag["dir"] = "dir";
        Tag["div"] = "div";
        Tag["dl"] = "dl";
        Tag["dt"] = "dt";
        Tag["em"] = "em";
        Tag["embed"] = "embed";
        Tag["fieldset"] = "fieldset";
        Tag["figcaption"] = "figcaption";
        Tag["figure"] = "figure";
        Tag["font"] = "font";
        Tag["footer"] = "footer";
        Tag["form"] = "form";
        Tag["frame"] = "frame";
        Tag["frameset"] = "frameset";
        Tag["h1"] = "h1";
        Tag["h2"] = "h2";
        Tag["h3"] = "h3";
        Tag["h4"] = "h4";
        Tag["h5"] = "h5";
        Tag["h6"] = "h6";
        Tag["head"] = "head";
        Tag["header"] = "header";
        Tag["hgroup"] = "hgroup";
        Tag["hr"] = "hr";
        Tag["html"] = "html";
        Tag["i"] = "i";
        Tag["iframe"] = "iframe";
        Tag["img"] = "img";
        Tag["input"] = "input";
        Tag["ins"] = "ins";
        Tag["kbd"] = "kbd";
        Tag["label"] = "label";
        Tag["legend"] = "legend";
        Tag["li"] = "li";
        Tag["link"] = "link";
        Tag["map"] = "map";
        Tag["mark"] = "mark";
        Tag["marquee"] = "marquee";
        Tag["menu"] = "menu";
        Tag["meta"] = "meta";
        Tag["meter"] = "meter";
        Tag["nav"] = "nav";
        Tag["noscript"] = "noscript";
        Tag["object"] = "object";
        Tag["ol"] = "ol";
        Tag["optgroup"] = "optgroup";
        Tag["option"] = "option";
        Tag["output"] = "output";
        Tag["p"] = "p";
        Tag["param"] = "param";
        Tag["picture"] = "picture";
        Tag["pre"] = "pre";
        Tag["progress"] = "progress";
        Tag["q"] = "q";
        Tag["rt"] = "rt";
        Tag["ruby"] = "ruby";
        Tag["s"] = "s";
        Tag["samp"] = "samp";
        Tag["script"] = "script";
        Tag["section"] = "section";
        Tag["select"] = "select";
        Tag["slot"] = "slot";
        Tag["small"] = "small";
        Tag["source"] = "source";
        Tag["span"] = "span";
        Tag["strong"] = "strong";
        Tag["style"] = "style";
        Tag["sub"] = "sub";
        Tag["sup"] = "sup";
        Tag["table"] = "table";
        Tag["tbody"] = "tbody";
        Tag["td"] = "td";
        Tag["template"] = "template";
        Tag["textarea"] = "textarea";
        Tag["tfoot"] = "tfoot";
        Tag["th"] = "th";
        Tag["thead"] = "thead";
        Tag["time"] = "time";
        Tag["title"] = "title";
        Tag["tr"] = "tr";
        Tag["track"] = "track";
        Tag["u"] = "u";
        Tag["ul"] = "ul";
        Tag["var"] = "var";
        Tag["video"] = "video";
        Tag["wbr"] = "wbr";
    })(Tag = WalletApi.Tag || (WalletApi.Tag = {}));
})(WalletApi || (WalletApi = {}));
var WalletApi;
(function (WalletApi) {
    var icon;
    (function (icon) {
        icon.nep2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAP1BMVEUAAAALf68HeqwIeqwIeqwIe6wJe60Ie6sIeqwHe6wIe6wIeq0IfKwIfK4agLMkkrYHeqv///+DvNW32Oa21+asvx7RAAAAEHRSTlMAF+7Hw6BxR9+zpnlAPgoHNJm0rwAAAS9JREFUSMel1+uSgyAMBeBwM1qUHnb3/Z91Zzp2bAUEk/P/G5zIJaF6EsfgZgvY2YXIiYZjJo9T/GSG6LagmmXr0tWjGb9eUvPAZR6mbdmiE8stO2EgU5U+A4YSnqU1DoNxplj3sH19XjvgRoKgVo2qMW6GD2vsXWyPon3vq998DvJPsdfedsVXcgWXet2x7+NS+/0Moo8renvhZQzn8/l+lRp9XI2p7Y/cSG2neCn2RAlSjEQsx0yxgbHnAkcKchzIyT/b0SzHM1k5tgQ5RhPjI01s5diqCqb7VUGOA0U5jsTygjElOU6ay0B7DRkpNmNXb25evbTJ8N6WeQn274dOgteLJ7bMX/HEyh93TVuhaWg0rZSqidO0j5rGVdEya5p1zZigHVD0o5F+KFONg/+EWLIfT4YUrAAAAABJRU5ErkJggg==";
        icon.wif = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAh1BMVEUAAAALf68He6wHe6sHeqwIeqwIeqwIe6wJe60Ie6sIeqwHe6wIe6wIeq0IfK4agLMkkrYIfKsIfq0Heqv////9/f5jq8r3+/ys0uNap8fh7/U1krsOfq3s9fmAu9R2ttG22OZrsM1WpMZNoMNHnMEni7bQ5e+Iv9ZRosQ+l70Vga/0+fuTxdq6WQXaAAAAE3RSTlMAF/v57sfDoHFH37OmeT4KB0BBXSJvyQAAActJREFUSMell9l6gyAQRl1wQWNs+msTzb4v7fs/X6uN8RNwxHBucnUCzgzDYKlJeRJ4EXNdFnlBwlNLGzv0XXRw/dDWUqexAwVOPB1UP3304s/oDU9AMiE2zxkGYLzPDR0M4oRK9SOAFsGH7NoeNPFsaV3BJW1x7QAjCIRYYRSdqHFnnOzw1rUZRsLaoE0wmknjzvAGTZ370GElnJLnGdQwv+Z5ji7TWo413DzL5ugS16F2aHH5syuzP77FdNka9bHPavIvqVI0wrVtXSlkqUuZ5/1+0ePCTS0OiqLdswy3ElI+EC6SgbO4JVwElkfnl3DhWREU3DfXTbEacBFZTLHeOqtYL2gXzJIytVpkDbQLV5ZFl5KZIrMtCxAwKWCXjrxeEXIkpupcb7Z82QUhe2KRHCt3icP8KW/I9p3In1xWf/K0r4SciAfjVBm3pqrplbl4JB/VivMTgLKW70SmUqkZ7LLKvmGZ19FGP77Uhp5SVv7/UDUSKhrgVrNGHFvVerf5y6VKJFY3/eWuztOlAMW077p5nIrjGSR+M7jhDWYmV6zR5W4yVpgMNCajlNEQZzI+mgyuBiOzybBu9EygmA0/UMyfRuaPMqPn4C8S1dM+jsduGgAAAABJRU5ErkJggg==";
    })(icon = WalletApi.icon || (WalletApi.icon = {}));
})(WalletApi || (WalletApi = {}));
var WalletApi;
(function (WalletApi) {
    var neotools = (function () {
        function neotools() {
        }
        neotools.verifyAddress = function (addr) {
            var verify = /^[a-zA-Z0-9]{34,34}$/;
            var res = verify.test(addr) ? neotools.verifyPublicKey(addr) : verify.test(addr);
            return res;
        };
        neotools.verifyPublicKey = function (publicKey) {
            var array = Neo.Cryptography.Base58.decode(publicKey);
            var check = array.subarray(21, 21 + 4);
            var checkdata = array.subarray(0, 21);
            var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);
            hashd = Neo.Cryptography.Sha256.computeHash(hashd);
            var hashd = hashd.slice(0, 4);
            var checked = new Uint8Array(hashd);
            var error = false;
            for (var i = 0; i < 4; i++) {
                if (checked[i] != check[i]) {
                    error = true;
                    break;
                }
            }
            return !error;
        };
        neotools.wifDecode = function (wif) {
            var result = new WalletApi.Result();
            var login = new WalletApi.LoginInfo();
            try {
                login.prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            try {
                login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            try {
                login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            result.info = login;
            return result;
        };
        neotools.nep2FromWif = function (wif, password) {
            var prikey;
            var pubkey;
            var address;
            var res = new WalletApi.Result();
            try {
                prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                var n = 16384;
                var r = 8;
                var p = 8;
                ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, function (info, result) {
                    res.err = false;
                    res.info.nep2 = result;
                    pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    var hexstr = pubkey.toHexString();
                    address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    res.info.address = address;
                    return res;
                });
            }
            catch (e) {
                res.err = true;
                res.info = e.message;
                return res;
            }
        };
        neotools.nep2ToWif = function (nep2, password) {
            return __awaiter(this, void 0, void 0, function () {
                var res, login, promise;
                return __generator(this, function (_a) {
                    res = new WalletApi.Result();
                    login = new WalletApi.LoginInfo();
                    promise = new Promise(function (resolve, reject) {
                        var n = 16384;
                        var r = 8;
                        var p = 8;
                        ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, function (info, result) {
                            if ("nep2 hash not match." == result)
                                reject(result);
                            login.prikey = result;
                            res.info = {};
                            if (login.prikey != null) {
                                login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
                                login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
                                res.err = false;
                                res.info = login;
                                resolve(res);
                            }
                            else {
                                res.err = true;
                                reject(res);
                            }
                        });
                    });
                    return [2, promise];
                });
            });
        };
        neotools.nep6Load = function (wallet, password) {
            return __awaiter(this, void 0, void 0, function () {
                var istart, res, arr, keyindex, account, result, error_1, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 9, , 10]);
                            istart = 0;
                            res = new WalletApi.Result();
                            arr = {};
                            if (!wallet.accounts) return [3, 7];
                            keyindex = 0;
                            _a.label = 1;
                        case 1:
                            if (!(keyindex < wallet.accounts.length)) return [3, 6];
                            account = wallet.accounts[keyindex];
                            if (account.nep2key == null) {
                                return [3, 5];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4, neotools.getPriKeyfromAccount(wallet.scrypt, password, account)];
                        case 3:
                            result = _a.sent();
                            arr[account.address] = (result.info);
                            return [2, arr];
                        case 4:
                            error_1 = _a.sent();
                            throw error_1;
                        case 5:
                            keyindex++;
                            return [3, 1];
                        case 6: return [3, 8];
                        case 7: throw console.error("The account cannot be empty");
                        case 8: return [3, 10];
                        case 9:
                            e_1 = _a.sent();
                            throw e_1.result;
                        case 10: return [2];
                    }
                });
            });
        };
        neotools.getPriKeyfromAccount = function (scrypt, password, account) {
            return __awaiter(this, void 0, void 0, function () {
                var res, promise;
                return __generator(this, function (_a) {
                    res = new WalletApi.Result();
                    promise = new Promise(function (resolve, reject) {
                        account.getPrivateKey(scrypt, password, function (info, result) {
                            if (info == "finish") {
                                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                                var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                                res.err = false;
                                res.info = { pubkey: pubkey, address: address, prikey: result };
                                resolve(res);
                            }
                            else {
                                reject({ err: true, result: result });
                            }
                        });
                    });
                    return [2, promise];
                });
            });
        };
        return neotools;
    }());
    WalletApi.neotools = neotools;
})(WalletApi || (WalletApi = {}));
var WalletApi;
(function (WalletApi) {
    var App = (function () {
        function App(div) {
            var _this = this;
            this.wallet = new ThinNeo.nep6wallet();
            this.reader = new FileReader();
            this.reader.onload = function () {
                var walletstr = _this.reader.result;
                var isotc = !walletstr.includes("accounts");
                if (isotc) {
                    _this.wallet.accounts = undefined;
                }
                else {
                    _this.wallet.fromJsonStr(walletstr);
                }
            };
            this.title = WalletApi.$('div', "title", [], "登陆钱包");
            this.fileInput = WalletApi.$('span', "wallet-input disable", [], "选择您的钱包文件");
            this.fileSelect = WalletApi.$('input', "select-file", []);
            this.passwordInput = WalletApi.$('input', "wallet-input", [], "输入您的密码");
            this.loginBtn = WalletApi.$("span", "wallet-button", [], "登陆");
            this.passwordInput.type = "password";
            this.fileSelect.type = "file";
            this.createHref = WalletApi.$('span', "foot-href", [], "我还没有钱包！点我创建！");
            this.nep2Btn = WalletApi.$('div', "icon-box", [
                WalletApi.$('img', "icon", []),
                WalletApi.$('span', "", [], "使用Nep2")
            ]);
            this.hideBtn = WalletApi.$('div', "close-login", []);
            this.nep2Btn.items[0].element.src = WalletApi.icon.nep2;
            this.wifBtn = WalletApi.$('div', "icon-box", [
                WalletApi.$('img', "icon", []),
                WalletApi.$('span', "", [], "使用Wif")
            ]);
            this.wifBtn.items[0].element.src = WalletApi.icon.wif;
            this.element = WalletApi.$("div", "login-wrap", [
                WalletApi.$('div', "walletLogin", [
                    this.hideBtn,
                    this.title,
                    WalletApi.$('div', "content", [
                        WalletApi.$('div', "con-box", [
                            this.fileInput,
                            WalletApi.$('span', "wallet-button", [], "选择文件"),
                            this.fileSelect
                        ]),
                        WalletApi.$('div', "con-box", [
                            this.passwordInput,
                            this.loginBtn
                        ]),
                        WalletApi.$('div', "hr", []),
                        WalletApi.$('div', "con-foot", [
                            WalletApi.$('span', "foot-title", [], "使用其他方式登陆"),
                            WalletApi.$('div', "foot-box", [
                                this.wifBtn,
                                this.nep2Btn
                            ]),
                            this.createHref
                        ])
                    ])
                ])
            ]);
            this.content = this.element.items[1];
            this.element.hide();
            div.appendChild(this.element.element);
        }
        App.prototype.init = function (call) {
            var _this = this;
            this.fileSelect.element.onchange = function (ev) {
                _this.fileChange(ev);
            };
            this.loginBtn.element.onclick = function () { return __awaiter(_this, void 0, void 0, function () {
                var res, obj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.loginNep6()];
                        case 1:
                            res = _a.sent();
                            if (res && !res.err) {
                                WalletApi.LoginInfo.info = res.info;
                                obj = {};
                                obj['addr'] = res.info.address;
                                obj['pubkey'] = res.info.pubkey.toHexString();
                                call(obj);
                            }
                            return [2];
                    }
                });
            }); };
        };
        App.queryState = function () {
            return WalletApi.LoginInfo.info;
        };
        App.prototype.sign = function (msg, addr) {
            var signdata = ThinNeo.Helper.Sign(msg.hexToBytes(), WalletApi.LoginInfo.info.prikey);
            return signdata.toHexString();
        };
        App.prototype.show = function () {
            var _this = this;
            this.element.show();
            this.hideBtn.element.onclick = function () {
                _this.element.hide();
            };
        };
        App.prototype.close = function () {
            this.element.hide();
        };
        App.prototype.fileChange = function ($event) {
            console.log($event);
            this.file = $event.target.files[0];
            this.fileInput.value = this.file.name;
            if (this.fileInput.value.includes(".json")) {
                this.reader.readAsText(this.file);
            }
        };
        App.prototype.loginNep6 = function () {
            return __awaiter(this, void 0, void 0, function () {
                var keyindex, account, arr, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.wallet.accounts) return [3, 7];
                            keyindex = 0;
                            _a.label = 1;
                        case 1:
                            if (!(keyindex < this.wallet.accounts.length)) return [3, 6];
                            account = this.wallet.accounts[keyindex];
                            if (account.nep2key == null) {
                                return [3, 5];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            arr = {};
                            return [4, WalletApi.neotools.getPriKeyfromAccount(this.wallet.scrypt, this.passwordInput.value, account)];
                        case 3:
                            result = _a.sent();
                            arr[account.address] = (result.info);
                            return [2, result];
                        case 4:
                            error_2 = _a.sent();
                            throw error_2;
                        case 5:
                            keyindex++;
                            return [3, 1];
                        case 6: return [3, 8];
                        case 7: throw console.error("The account cannot be empty");
                        case 8: return [2];
                    }
                });
            });
        };
        return App;
    }());
    WalletApi.App = App;
})(WalletApi || (WalletApi = {}));
var WalletApi;
(function (WalletApi) {
    var LoginInfo = (function () {
        function LoginInfo() {
        }
        return LoginInfo;
    }());
    WalletApi.LoginInfo = LoginInfo;
    var Result = (function () {
        function Result() {
        }
        return Result;
    }());
    WalletApi.Result = Result;
})(WalletApi || (WalletApi = {}));
//# sourceMappingURL=app.js.map