/**
 * 小标题组件
 */
import * as React from 'react';
import './index.less';
// import classnames from 'classnames';

interface IProps {
  type:string
}
export default class Borderbox extends React.Component<IProps,any> {
  public render () {
    // const titleClassName = classnames('title-text-wrapper', { 'info-title': this.props.isInfoTitle ? this.props.isInfoTitle : false,'table-title': this.props.isTableTitle ? this.props.isTableTitle : false});
    return (
      <div className="border-wrapper">
        <div className={this.props.type}>
            {this.props.children}
        </div>        
      </div>
    )
  }
}