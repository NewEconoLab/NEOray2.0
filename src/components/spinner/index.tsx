/**
 * 小标题组件
 */
import * as React from 'react';
import './index.less';

export default class Spinner extends React.Component {
  public render () {
    
    return (
        <div className="spinner">
        <div className="spinner-container container1">
          <div className="circle1"/>
          <div className="circle2"/>
          <div className="circle3"/>
          <div className="circle4"/>
        </div>
        <div className="spinner-container container2">
          <div className="circle1"/>
          <div className="circle2"/>
          <div className="circle3"/>
          <div className="circle4"/>
        </div>
        <div className="spinner-container container3">
          <div className="circle1"/>
          <div className="circle2"/>
          <div className="circle3"/>
          <div className="circle4"/>
        </div>
      </div>
    )
  }
}