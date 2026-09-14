import {Component} from 'react';
import {Header,Footer} from './Layout.jsx';
export class ErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){
    // Unmounting a failed photo dialog must not leave the fallback page locked.
    for(const name of ['lightbox-open','archive26-lock','fv-lock','store-overlay-open'])document.body.classList.remove(name);
  }
  render(){
    if(!this.state.failed)return this.props.children;
    return <><Header/><main className="container site-error" id="night-main-content" tabIndex={-1}><h1>페이지를 표시하지 못했습니다.</h1><p>일시적인 오류가 발생했습니다. 새로고침하거나 홈으로 이동해 주세요.</p><div><button className="btn" type="button" onClick={()=>window.location.reload()}>새로고침</button><a className="btn secondary" href="index.html">홈으로 이동</a></div></main><Footer/></>;
  }
}
