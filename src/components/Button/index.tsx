/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
// import { injectIntl } from 'react-intl';
import './index.less';

interface IProps
{
	onClick?: () => void,
	style?: object,
	disabled?: boolean, // 按钮是否禁止点击
	text: string,
	btnSize?:'sm-btn'|'bg-btn', // 按钮大小
	btnColor?:'white-btn'|'gray-btn'|'blue-btn'|'' // 按钮颜色
	// intl:any
}

@observer
export default class Button extends React.Component<IProps, {}> {
	constructor(props: IProps)
	{
		super(props);	
	}
	// 监控输入内容
	public onClick = () =>
	{
		if(this.props.disabled){
			return false;
		}
		if (this.props.onClick)
		{
			this.props.onClick();
		}
		return true;
	}

	public render()
	{
		const btnClassName = classnames('normal-button',this.props.btnSize,this.props.btnColor)
		// this.props.smallbtn ? 'blue-btn' : 'button-group';
		
		return (
			<div className={btnClassName}
				onClick={this.onClick}
				style={this.props.style}
			>
				{this.props.text}
			</div>
		);
	}
}
