import * as React from 'react';
import './index.less';

interface IProps {
  rate: number,
  onChange: (rate: number) => void
}

export default class Slider extends React.Component<IProps> {
  public state = {
    isDown: false,
    rate: 0,
    width: 0,
    leftX: 0,
    text: 0,
  }
  private slideRef: React.RefObject<HTMLDivElement> = React.createRef();
  public componentDidMount() {
    this.setState({
      rate: this.props.rate,
      text: this.props.rate,
      width: this.slideRef.current && this.slideRef.current['offsetWidth'],
      leftX: this.slideRef.current && this.slideRef.current['offsetLeft']
    })
  }
  public componentDidUpdate() {
    // if (this.props.onChange) {
    //   this.props.onChange(Math.ceil(this.state.rate));
    // }
  }
  public getOffsetLeft = () => {
    const obj = this.slideRef.current && this.slideRef.current;
    if (!obj) {
      return 0;
    }
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while (val != null) {
      tmp += val['offsetLeft'];
      val = val['offsetParent'];
    }
    return tmp;
  }
  public handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    const width = this.slideRef.current && this.slideRef.current['offsetWidth'];
    const leftX = this.getOffsetLeft();
    const addPageX = (ev.pageX - leftX) / (this.state.width / 99);
    this.setState({
      isDown: true,
      width,
      leftX,
      rate: addPageX > 100 ? 100 : (addPageX < 1 ? 0 : addPageX),
    },()=>{
      if (this.props.onChange) {
        this.props.onChange(Math.ceil(this.state.rate));
      }
    })
    document.addEventListener('mousemove', this.handleMouseMove, false)
    document.addEventListener('mouseup', this.handleMouseUp, false)
  }
  public handleMouseMove = (ev: MouseEvent) => {
    if (!this.state.isDown) {
      return false;
    }
    const leftX = this.getOffsetLeft();
    const addPageX = (ev.pageX - leftX) / (this.state.width / 99);
    this.setState({
      rate: addPageX > 100 ? 100 : (addPageX < 0 ? 0 : addPageX),
    },()=>{
      if (this.props.onChange) {
        this.props.onChange(Math.ceil(this.state.rate));
      }
    })    
    return true;
  }
  public handleMouseUp = (ev: MouseEvent) => {
    this.setState({
      isDown: false,
    })
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
  public render() {
    return (
      <div className="comp-slider-container" onMouseDown={this.handleMouseDown}
      >
        <div className="slide-box"
          ref={this.slideRef}
        >
          <div className="slide" style={{ width: this.state.rate + '%' }}>
            <div className="block">
              {/* <img src={require('@/img/button.png')} alt=""/> */}
              {/* <div className="tips">{Math.ceil(this.state.rate)}</div> */}
            </div>
          </div>
          <span className="num">0</span>
          <span className="num">100%</span>
        </div>
      </div>
    )
  }
}