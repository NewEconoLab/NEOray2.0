/**
 * 分页组件
 */
import * as React from 'react';
import './index.less'
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { injectIntl } from 'react-intl';

interface IProps {
    totalCount: number,  // 总条数
    pageSize: number     // 每页大小
    currentPage: number, // 当前页数
    onChange: (index: number) => void,
    intl: any
}
interface IState {
    current: number, // 当前页数
    totalPage: number,    // 总页数
    inputValue: number,     // 页码的输入
    isShowPage: boolean      // 是否显示分页
}

@observer
class Page extends React.Component<IProps, IState>
{
    constructor(props: IProps) {
        super(props);
        this.state = {
            current: 1, // 当前页数
            totalPage: props.totalCount % props.pageSize === 0 ? props.totalCount / props.pageSize : Math.ceil((props.totalCount / props.pageSize)),
            inputValue: 0,
            isShowPage: props.totalCount > props.pageSize ? true : false
        }
    }
    public UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (nextProps.totalCount !== this.props.totalCount) {
            this.setState({
                totalPage: nextProps.totalCount % nextProps.pageSize === 0 ? nextProps.totalCount / nextProps.pageSize : Math.ceil((nextProps.totalCount / nextProps.pageSize)),
                isShowPage: nextProps.totalCount > this.props.pageSize ? true : false
            })
        }
    }
    // 上一页
    public onPrevClick = () => {
        const current = this.props.currentPage;
        if (current - 1 <= 0) {
            return;
        }
        this.pageTo(current - 1);
    }

    // 下一页
    public onNextClick = () => {
        const current = this.props.currentPage;
        if (current + 1 > this.state.totalPage) {
            return;
        }
        this.pageTo(current + 1);
    }

    // 跳转到指定页
    public pageTo = (current: number) => {
        current = parseInt('' + current, 10);

        // 如果跳转页码小于0或者跳转页码大于页面总数，则中断
        if (current < 0 || current > this.state.totalPage) {
            return;
        }
        // 如果跳转页码等于当前页码，则中断
        if (current === this.props.currentPage) {
            return;
        }
        this.setState({ current: current });

        // 父类事件
        if (this.props.onChange) {
            this.props.onChange(current);
        }
        this.setState({
            inputValue: 0
        })
    }
    public onInputChange = (event: any) => {
        if (event.target.value && isNaN(event.target.value)) {
            return;
        }
        // const num = parseInt(event.target.value, 10);
        // 如果跳转页码小于0或者跳转页码大于页面总数，则中断
        if (event.target.value <= 0) {
            this.setState({
                inputValue: 0
            })
            return
        }
        // 如果跳转页码小于0或者跳转页码大于页面总数，则中断
        if (event.target.value > this.state.totalPage) {
            this.setState({
                inputValue: this.state.totalPage
            })
            return
        }
        this.setState({
            inputValue: event.target.value
        })
        return true;
    }
    // 跳转页
    public goPage = () => {
        if (this.state.inputValue !== 0) {
            this.pageTo(this.state.inputValue);
        }
    }
    // 回车跳转页
    public onInputKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            this.pageTo(this.state.inputValue);
        }
    }
    public render() {
        if (!this.state.isShowPage) {
            return null;
        }
        const prevClassName = classnames('previous-btn', { 'active': this.props.currentPage !== 1 ? true : false });
        const nextClassName = classnames('next-btn', { 'active': this.props.currentPage !== this.state.totalPage ? true : false });
        return (

            <div className="page-wrapper">
                <div className="page-tips">
                    <span>{this.props.intl.messages.page.page} {this.props.currentPage}{this.props.intl.messages.page.total1} {this.state.totalPage} {this.props.intl.messages.page.total2}</span>
                </div>
                <div className="page-btn-wrapper">
                    <div className={prevClassName} onClick={this.onPrevClick}>
                        <img src={require('@/img/triangle.png')} alt="" />
                    </div>
                    <div className={nextClassName} onClick={this.onNextClick} >
                        <img src={require('@/img/triangle.png')} alt="" />
                    </div>
                    <div className="input-page">
                        {/* onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" */}
                        <input type="text" onChange={this.onInputChange} value={this.state.inputValue === 0 ? '' : this.state.inputValue} onKeyDown={this.onInputKeyDown} />
                    </div>
                    <div className="go-btn" onClick={this.goPage}>Go</div>
                </div>
            </div>
        );
    }
}

export default injectIntl(Page);
