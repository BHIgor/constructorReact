import { useContext } from 'react';
import { ReactContext } from "../../context/ReactContext"
import { NavLink } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

import './Menu.scss';

export const Menu = ({ 
  menu,
  setMenu
}) =>{
  const { dataDB } = useContext(ReactContext);

  const getLinkStyle = ({ isActive }) => ({backgroundColor: isActive ? `${dataDB.settings[0].clHeader}`: null}) 
  const scrollToTop = () => {
    setMenu(false)
    scroll.scrollToTop({duration:20});
  };
  
  return <>
      { (dataDB.length === 0) ? <div>Помилка</div> : <>   
        <aside className={menu ? "menu page__menu active-menu" : 'menu page__menu'}>
          <div onClick={() => setMenu(false)}  className='menu__close'> </div>
          <div className='menu__title' style={{color:`${dataDB.settings[0].clHeader}`,backgroundColor: `${dataDB.settings[0].clTitle}`}}>
            {dataDB.listBot[0].name}
          </div>
          <div className="container menu__container">
              <ul className="menu__nav">
                <NavLink 
                  to={`/?${dataDB.listBot[0].nameShop}#back`} 
                  onClick={() => scrollToTop()}  
                  className='menu__link' 
                  style={getLinkStyle}
               
                >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--main'></div>
                      <div className='menu__list' >
                        Головна
                      </div>
                  </li>
                </NavLink>
                
                <NavLink to={`/Katalog?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--katalog'></div>
                    <div className="menu__list">
                      Всі товари
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/AddProduct?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--add'></div>
                    <div className="menu__list">
                      Додати товар
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/Import?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--import'></div>
                    <div className="menu__list">
                      Імпорт товарів
                    </div>
                  </li>
                </NavLink>

                <hr className='menu__lineHorizont'></hr>
               
                <NavLink to={`/Orders?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item ">
                    <div className='menu__icon menu__icon--checkout'></div>
                    <div className="menu__list">
                      Мої замовлення
                    </div>
                  </li>
                </NavLink> 

                <NavLink  to={`/Settings?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--cart'></div>
                    <div className="menu__list">
                      Налаштування
                    </div>
                  </li>
                </NavLink>

                <NavLink  to={`/Personalization?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--like'></div>
                    <div className="menu__list">
                      Персоналізація
                    </div>
                  </li>
                </NavLink>

                <hr className='menu__lineHorizont'></hr>
     
                <NavLink to={`/Contacts?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--contacts'></div>
                    <div className="menu__list">
                      Контакти
                    </div>
                    {
                      (dataDB.settings[0].viberContact === '' && dataDB.settings[0].phoneOne === '' && dataDB.settings[0].instaContact === '' && dataDB.settings[0].phoneTwo === '' && dataDB.settings[0].email === '' && dataDB.settings[0].telegaContact === '') ? <div className="menu__list--empty">
                      !
                      </div> : null
                    }
                  </li>
                </NavLink>
            
                <NavLink to={`/About?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--about'></div>
                    <div className="menu__list">
                      Про нас
                    </div>
                    {
                      (dataDB.settings[0].about === '') ? <div className="menu__list--empty">
                      !
                      </div> : null
                    }
                  </li>
                </NavLink>
            
                <NavLink to={`/Garant?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--garant'></div>
                    <div className="menu__list">
                      Гарантійні умови
                    </div>
                    {
                      (dataDB.settings[0].garant === '') ? <div className="menu__list--empty">
                      !
                      </div> : null
                    }
                  </li>
                </NavLink>
            
                <NavLink to={`/Delivery?${dataDB.listBot[0].nameShop}`}onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--delivery'></div>
                    <div  className="menu__list">
                      Доставка
                    </div>
                    {
                      (dataDB.settings[0].delivery === '') ? <div className="menu__list--empty">
                      !
                      </div> : null
                    }
                  </li>
                </NavLink>
             
                <NavLink to={`/Pay?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--pay'></div>
                    <div className="menu__list">
                      Оплата
                    </div>
                    {
                      (dataDB.settings[0].pay === '') ? <div className="menu__list--empty">
                      !
                      </div> : null
                     }
                  </li>
                </NavLink>

                <NavLink to={`/Obmin?${dataDB.listBot[0].nameShop}`}onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item ">
                    <div className='menu__icon menu__icon--obmin'></div>
                    <div className="menu__list">
                      Обмін і повернення
                    </div>
                    {
                    (dataDB.settings[0].obmin === '') ? <div className="menu__list--empty">
                    !
                    </div> : null
                }
                  </li>
                </NavLink>
               
                <NavLink to={`/Grafik?${dataDB.listBot[0].nameShop}`}onClick={() =>scrollToTop()} className='menu__link' style={getLinkStyle}>
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--time'></div>
                    <div className="menu__list">
                      Графік роботи
                    </div>
                    {
                       (dataDB.settings[0].grafik === '') ? <div className="menu__list--empty">
                        !
                       </div> : null
                    }
                  </li>
                </NavLink>
            
              </ul>
          </div>       
        </aside>
      </>
    }
  </>
}
