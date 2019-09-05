import * as React from 'react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
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
// @inject('home')
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
            <Button text="取消" onClick={ this.handleToCancel } />
            <Button text="确认" onClick={ this.handleToConfirm } btnColor="blue-btn" />
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

export default injectIntl(Alertbox)