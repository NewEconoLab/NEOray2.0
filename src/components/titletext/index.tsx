/**
 * 小标题组件
 */
import * as React from 'react';
import './index.less';
import classnames from 'classnames';

interface IProps {
  text:string;
  isTableTitle?:boolean;
  isInfoTitle?:boolean;
  img?:string;
  isInline?:boolean;
}
export default class TitleText extends React.Component<IProps,any> {
  public render () {
    const titleClassName = classnames('title-text-wrapper', { 'info-title': this.props.isInfoTitle ? this.props.isInfoTitle : false,'table-title': this.props.isTableTitle ? this.props.isTableTitle : false});
    return (
      <div className={titleClassName}>
        <h3>
          {
            this.props.img && <img src={this.props.img} alt=""/>
          }
          {this.props.text}
        </h3>
        {
          !!!this.props.isInline && (
            <div className="right">
              {this.props.children}
            </div> 
          )
        }
        {
          this.props.isInline && (
            <div className="inline-select">
              {this.props.children}
            </div>
          )
        } 
      </div>
    )
  }
}