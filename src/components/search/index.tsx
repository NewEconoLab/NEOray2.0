/**
 * 下拉组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import EventHandler from '@/utils/event';
import classnames from 'classnames';
import './index.less';
export interface IOptions {
	txid: string,
	time: string,
}
interface IProps {
	options: IOptions[],
	text: string,
	onCallback?: (event: IOptions) => void,
	big?: boolean,
	size?: string,
	style?: object,
	placeholder?: string,
	defaultValue?: string | number,
	current?: IOptions;
	value?: string;
	disable?: boolean;
	onChange?: (value: string) => void
}

interface IState {
	options: IOptions,
	expand: boolean,
	value: string
}

@observer
export default class Search extends React.Component<IProps, IState> {
	public state = {
		// 选择的项
		options: { txid: '', time: '' },
		expand: false,
		value: ""
	}
	public componentDidMount() {
		if (this.props.defaultValue) {
			this.setState({
				options: this.props.options.filter((item) => item.time === this.props.defaultValue)[ 0 ]
			}, () => {
				if (this.props.onCallback) {
					this.props.onCallback(this.state.options);
				}
			});
		} else if (!this.props.placeholder) {
			this.setState({
				options: this.props.options[ 0 ]
			});
			if (this.props.onCallback) {
				this.props.onCallback(this.props.options[ 0 ]);
			}
		}

		// 注册全局点击事件，以便点击其他区域时，隐藏展开的内容
		EventHandler.add(this.globalClick);
	}
	// 全局点击
	public globalClick = () => {
		this.setState({ expand: false });
	}
	// 选择选项
	public onSelect = (item) => {

		this.setState({ options: item, expand: false, value: item.txid });

		if (this.props.onCallback) {
			this.props.onCallback(item);
		}
		if (this.props.onChange) {
			this.props.onChange(item.txid)
		}
	}

	public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (this.props.onChange && !this.props.disable) {
			this.props.onChange(event.target.value ? event.target.value : "");
			this.setState({ value: event.target.value })
		}
	}

	// 展开
	public onExpand = (e) => {
		if (!this.props.disable) {
			// 取反
			const expand = !this.state.expand;

			this.setState({
				expand: expand
			});
		}

		e.stopPropagation();
	}
	public componentWillUnmount() {
		//  组件释放remove click处理
		EventHandler.remove(this.globalClick);
	}

	public render() {
		const selectBox = classnames('select-box', { 'disNone': !this.state.expand })
		const selectWrap = classnames('select-wrapper', this.props.size ? { [ this.props.size ]: true } : { 'big-box': this.props.big })
		const { options = [] } = this.props;
		// let showName: string = this.props.placeholder || (options.length > 0 ? options[ 0 ][ name ] : "");
		// // let iconstr: string = "";	
		// if (this.state.options && this.state.options.name) {
		// 	showName = this.state.options.name;
		// 	// iconstr = this.state.options.icon;
		// }
		// if (this.props.current) {
		// 	// this.setState({ options: this.props.current })
		// 	showName = this.props.current.name;
		// }
		return (
			<div className={ selectWrap }
				onClick={ this.onExpand }
			>
				{ this.props.text !== '' && (<div className="select-type">{ this.props.text }</div>) }
				<div className="selected-text" style={ this.props.style }>
					{/* <span><img src={ iconstr } alt="" /></span> */ }
					{/* <span>{ showName }</span> */ }
					<input type="text" placeholder={ this.props.placeholder } value={ this.props.value } onChange={ this.onChange } />
					<div className="triangle" >
						<img src={ require("@/img/xiala.png") } alt="" />
					</div>
				</div>
				<div className={ selectBox } style={ this.props.style }>
					<div className="ul">
						{
							options.map((item, index) => {
								return (
									<div className="li" key={ index } onClick={ this.onSelect.bind(this, item) }>
										{/* <div className={ `box-icon ${!!!item.icon ? 'noicon' : ''}` }>
											{ !!item.icon && <img src={ item.icon } alt="" /> }
										</div> */}
										<div className="box-text">
											<div style={ { float: "left" } }>
												{ item.txid.substr(0, 4) }...{ item.txid.substr(item.txid.length - 4, 4) }
											</div>
											<div style={ { float: "right" } }>
												{ item.time.toLocaleUpperCase() }
											</div>
										</div>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
}