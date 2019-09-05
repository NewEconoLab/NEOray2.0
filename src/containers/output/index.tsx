
import * as React from 'react';
import './index.less';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { IOutputProps, OutputType, IOutputMessage } from './store/interface/index.interface';
import FileTree from '../file/filetree';
import Button from '@/components/Button';
@inject('output', 'debug', 'intl')
@observer
export default class OutputBox extends React.Component<IOutputProps> {

    public state = {
        isShow: true,
        currentPage: "output",
        heightNumber: 300
    }

    // 记录鼠标相对于盒子X轴的位置
    private top = (document.getElementById('root') as HTMLElement)

    public componentDidMount() {
        this.props.output.initOutputMessage();
    }

    public render() {
        const outputtitle = classnames('header-title', { 'active': this.props.output.currentPage === "output" });
        const stacktitle = classnames('header-title', { 'active': this.props.output.currentPage === "stack" });

        const outputbox = classnames('output-message', { 'box-hide': this.props.output.currentPage !== "output" });
        const stackbox = classnames('stack-message', { 'box-hide': this.props.output.currentPage !== "stack" });
        return (
            <div className="output-box">
                <div className="box-border-top" onMouseDown={ this.onMouseDown } />
                <div className="output-hearder" >
                    <div className="btn-box">
                        <div className="btn-icon">
                            <img onClick={ this.onViewChange } src={ this.state.heightNumber > 0 ? require("@/img/shouqi.png") : require("@/img/zhankai.png") } />
                        </div>
                        <div className="btn-icon"><img onClick={ this.props.output.clearOutputMessage } src={ require("@/img/qingkong.png") } alt="" /></div>
                    </div>
                    <div className={ outputtitle } onClick={ this.onViewShow.bind(this, "output") }>{ this.props.intl.message.output[ 1 ] }</div>
                    <div className={ stacktitle } onClick={ this.onViewShow.bind(this, "stack") }>CalcStack&AltStack</div>
                </div>
                <div className="output-content" id="drag" style={ { height: this.state.heightNumber } }>
                    <div className={ outputbox }>
                        { this.props.output.outputList.map((item, index) => this.getOutputMessage(item, index)) }
                    </div>
                    <div className={ stackbox }>
                        <div className="stack-box">
                            <div className="calcStack-box">
                                <div className="box-header-title">CalcStack
                            </div>
                                <div id="calcstack-content" />
                            </div>
                            <div className="altStack-box">
                                <div className="box-header-title">AltStack
                            </div>
                                <div id="altstack-content" />
                            </div>
                        </div>
                        <div className="box-header-title">Value Tool
                        </div>
                        <div className="valuetool-box">
                            <div id="valuetool" />
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    private getOutputMessage = (item: IOutputMessage, index: number) => {
        if (item.type === OutputType.tree) {
            return (<>
                <FileTree title={ item.title } key={ index + OutputType[ item.type ] } view=
                    { item.txid &&
                        <Button
                            text={ this.props.intl.message.button[ 9 ] }
                            style={ { margin: '0 30px' } }
                            onClick={ this.toDebug.bind(this, item.txid) }
                            key={ index + OutputType[ item.type ] + "btn" }
                        /> }>
                    { item.value && <>
                        { Object.keys(item.value).map((key, n) => {
                            const value = item.value[ key ];
                            return (
                                <div className="output-item" key={ n + key + OutputType[ item.type ] + "msg" }>
                                    <div className="item-name">{ key }</div>
                                    <div className="item-value">{ (typeof value === "object" ? <pre>{ JSON.stringify(value, null, 3) }</pre> : value) }</div>
                                </div>
                            )
                        }) }
                        {
                            item.result &&
                            <pre className="output-json" key={ index + OutputType[ item.type ] + "result" }>{ JSON.stringify(item.result, null, 3) }</pre>
                        }
                    </>
                    }
                </FileTree>
            </>
            )
        }
        else if (item.type === OutputType.default) {
            return Object.keys(item.value).map((key, n) => {
                const value = item.value[ key ];
                return (
                    <div className="output-item" key={ n + key + OutputType[ OutputType.default ] + index + "default" }>
                        <div className="item-name">{ key }</div>
                        <div className="item-value">{ (typeof value === "object" ? JSON.stringify(value, null, 3) : value) }</div>
                    </div>
                )
            })
        }
        else {
            return <div className="output-item" key={ index + OutputType[ item.type ] + "title" }>{ item.title }</div>
        }
    }

    private onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        document.onmousemove = (e) => {
            this.mouseMove(e);
        }
        document.onmouseup = () => {
            this.mouseUp();
        };
    }

    // 鼠标移动事件
    private mouseMove(e: MouseEvent) {
        const top_height = this.top.offsetHeight - e.clientY - 35;// 可伸缩div的宽度
        if (top_height < (this.top.offsetHeight - 80)) {
            this.setState({ heightNumber: top_height }, () => {
                this.props.onSizeChange()
            })
        }
        // left_width = left_width < min_width ? min_width : left_width;
        // left_width = left_width > max_width ? max_width : left_width;
        // left.style.width = left_width + "px";
    }

    // 终止事件
    private mouseUp() {
        document.onmousemove = null;
        document.onmouseup = null;
    }

    private onViewChange = () => {
        this.setState({ heightNumber: this.state.heightNumber > 0 ? 0 : 300 }, () => {
            this.props.onSizeChange()
        })
    }

    private onViewShow = (title: string) => {
        this.props.output.toPage(title);
    }

    private toDebug = (txid: string) => {
        // this.props.
        this.props.debug.startDebug(txid)
        this.props.history.push("debug")
    }

}