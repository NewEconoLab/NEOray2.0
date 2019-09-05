/**
 * 页面跳转定位到顶部组件
 */
import React from 'react';
import {withRouter} from 'react-router-dom';

class ScrollToTop extends React.Component<any> {
    public componentDidUpdate(prevProps) {
        if(this.props.history.location.pathname !== prevProps.location.pathname){
            window.scrollTo(0,0)
        }
    }
    public render(){
        return this.props.children;
    }
}
export default withRouter(ScrollToTop);