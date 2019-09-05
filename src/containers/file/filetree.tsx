/**
 * 按钮组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';

interface IProps {
    title: string,
    view?: any
}
interface IState {
    isShow: boolean;
}

export default class FileTree extends React.Component<IProps, IState> {
    public state = { isShow: true }

    public render() {
        return (
            <div className="tree-select">
                <div className="tree-select-title" onClick={ this.onShowClick }>
                    { this.state.isShow ?
                        <span className="triangle" /> :
                        <span className="triangle-reverse" />
                    }
                    <span className="title-text">{ this.props.title }</span>
                </div>
                {
                    this.props.view
                }
                { this.state.isShow &&
                    <div className="tree-select-box">
                        { this.props.children }
                    </div>
                }
            </div>
        )
    }

    private onShowClick = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
}