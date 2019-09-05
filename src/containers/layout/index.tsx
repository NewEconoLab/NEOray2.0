// 整体布局
import * as React from 'react';
import * as PropTypes from 'prop-types';
import store from '@/store/common';
import CommonStore from '@/store/common';
import OutputStore from '@/containers/output/store/index.store';
import ScrollToTop from '@/components/scrolltotop';
import './index.less';
import Menubar from '../menubar';
import OutputBox from '../output';
import CodeBox from '../code';
import codeStore from '../code/store/code.store';
import debugStore from '../debug/store/debug.store';
import intl from '@/store/intl';

export default class LayoutIndex extends React.Component<any, any> {
  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired
  }
  public state = {
    lang: store.language === 'en' ? 'en' : 'zh', // zh为中，en为英
    isSearch: false, // 是否在搜索中，默认false
    currentState: false,
  }
  private codeEditor = React.createRef<CodeBox>();
  public componentDidMount() {
    console.log();
  }

  public render() {
    return (
      <div className="layout-container">
        <ScrollToTop>
          <Menubar
            common={ CommonStore }
            history={ this.context.router.history }
            onSidebarChange={ this.onSidebarChange }
            onChangeLanguage={ this.onChangeLanguage }
          />
          <div className="sidebar" hidden={ !this.state.currentState }>
            { this.props.children }
          </div>
          <div className="code-container">
            <CodeBox codeStore={ codeStore } ref={ this.codeEditor } intl={ intl } />
            <OutputBox intl={ intl } debug={ debugStore } output={ OutputStore } onSizeChange={ this.onSizeChange } history={ this.context.router.history } />
          </div>
        </ScrollToTop>
      </div>
    );
  }
  // 切换语言
  public onChangeLanguage = (lang: string) => {
    if (lang === "zh") {
      store.setLanguage('zh');
      sessionStorage.setItem('language', 'zh');
      this.setState({
        lang: 'zh'
      })
    } else {
      store.setLanguage('en');
      sessionStorage.setItem('language', 'en');
      this.setState({
        lang: 'en'
      })
    }
  }
  public onSidebarChange = (state: boolean) => {
    this.setState({ currentState: state }, () => {
      if (this.codeEditor.current) {
        this.codeEditor.current.editorLayout();
      }
    });
  }
  private onSizeChange = () => {
    if (this.codeEditor.current) {
      this.codeEditor.current.editorLayout();
    }
  }

}