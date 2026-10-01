import {useState, useRef, useEffect} from 'react';
import {navigation} from '../components/layout.mjs';

export function Header({activeNav = 'HOME'}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  useEffect(() => {
    if (!open) return;
    const navigationElement=document.getElementById('night-navigation');
    const background=[document.getElementById('night-main-content'),...document.querySelectorAll('.detail-navigation'),document.querySelector('.site-footer')].filter(Boolean);
    background.forEach(element=>{element.inert=true;});
    document.body.classList.add('mobile-menu-open');
    navigationElement?.querySelector('a')?.focus();
    const close = event => {
      if (event.key === 'Escape') {event.preventDefault();setOpen(false);toggle.current?.focus();return;}
      if(event.key!=='Tab')return;
      const controls=[toggle.current,...(navigationElement?.querySelectorAll('a')??[])].filter(Boolean);
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',close);
    return () => {
      document.removeEventListener('keydown',close);
      document.body.classList.remove('mobile-menu-open');
      background.forEach(element=>{element.inert=false;});
    };
  },[open]);
  return <header className="site-header"><nav className="nav container">
    <a className="brand" href="index.html">N<span>I</span>GHT</a>
    <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="night-navigation" onClick={() => setOpen(!open)}>☰</button>
    <div id="night-navigation" className={'nav-links' + (open ? ' open' : '')}>
      {navigation.map(([label,href]) => <a key={label} href={href} aria-current={label === activeNav ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</a>)}
    </div>
  </nav></header>;
}
export function Footer() {
  return <footer className="site-footer"><div className="footer-inner container"><span>© CASTLE ENTERTAINMENT. ALL RIGHTS RESERVED.</span><a href="index.html">BACK TO HOME</a></div></footer>;
}
