import { useContext } from 'react';
import { ReactContext } from "../../context/ReactContext"

import './FooterLine.scss';
import { Link } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

export const FooterLine = ({ setMenu }) =>{
  const { dataDB } = useContext(ReactContext);


  const scrollToTop = () => {
    scroll.scrollToTop({duration:20});
  };

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="footerLine">
        <div className="footerLine--container">
         <div onClick={() => setMenu(true)} className="footerLine--menu footerLine--size"></div>
         <Link to={`/Katalog?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className="footerLine--catalog footerLine--size"></Link>
         <Link to={`/Cart?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className="footerLine--cart footerLine--size">{(dataDB.allCartCount > 0) ? <span className='footerLine--count'>{dataDB.allCartCount}</span> :null}</Link>
         <Link to={`/?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className="footerLine--home footerLine--size"></Link>
        </div>

      </div>
    </>
    }
  </>
}