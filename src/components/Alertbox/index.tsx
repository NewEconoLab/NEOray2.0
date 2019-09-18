import * as React from 'react';
import { observer, inject } from 'mobx-react';
import './index.less';
import Button from '../Button';
// import Borderbox from '@/components/Borderbox';
// import classnames from 'classnames';
// import { AlertType } from '@/store/interface/common.interface';
interface IProps {
  intl: any,
  type?: string, // alertb-wrapper为大弹窗，默认小窗口
  title: string,
  onClose?: () => void,
  imgFlag?: number,// 是否添加图片
  bgtype?: string, // 弹框背景颜色
  onConfirm?: () => void,
  onCancel?: () => void,
}
@inject('intl')
@observer
class Alertbox extends React.Component<IProps, any> {
  public render() {
    return (
      <div className="alert-wrapper">
        <div className="alert-content">
          <div className="alert-close" onClick={ this.handleToClose }>
            <img src={ require('@/img/close.png') } alt="" />
          </div>
          <div className="alert-text">{ this.props.title }</div>
          { this.props.children }
          <div className="alert-btn-wrapper">
            { this.props.onCancel && <Button text={ this.props.intl.message.button[ 13 ] } onClick={ this.handleToCancel } /> }
            { this.props.onConfirm && <Button text={ this.props.intl.message.button[ 12 ] } onClick={ this.handleToConfirm } btnColor="blue-btn" /> }
          </div>
        </div>
      </div>
    )
  }

  private handleToClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  private handleToConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
  private handleToCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
}

export default Alertbox