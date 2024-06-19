import { useContext } from 'react';
import { ReactContext } from "./../../context/ReactContext"

import './Mainpage.scss';
import { Search } from './Search/Search';
import { NavLink } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';

export const Mainpage = ({ setMenu }) => {
  const { dataDB } = useContext(ReactContext);

  const referenceDate = new Date();

  // Обчислюємо граничні дати
  const oneDayAgo = new Date(referenceDate.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(referenceDate.getTime() - 3 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(referenceDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const minus5MinutesDate = new Date(referenceDate.getTime() - (5 * 60 * 1000));
  const oneMonthAgo = new Date(referenceDate);
  oneMonthAgo.setMonth(referenceDate.getMonth() - 1);

  const minus3Hours = (date) => {
    return new Date(date.getTime() - 3 * 60 * 60 * 1000);
  };

  const filterDates = (dataArray, limitDate) => {

    return dataArray?.filter(item => {
      const visitedDate = new Date(item.visited);
      const adjustedVisitedDate = minus3Hours(visitedDate); // Зменшуємо дату на 3 години

      return adjustedVisitedDate > limitDate;
    });
  };

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const orderProducts = (dataDB.length !== 0) ? dataDB.allOrders.filter(e => e.status === 'Новий') : []
  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik main">
        <div className="settings__title">
          Панель управління
        </div>


        <div className="settings__container">
          <div className="settings__body">
            <div className="settings__body--border">
              <div className="main__statisBlock">
                <div className="main__body--title">
                  Загальна кількість відвідувачів
                </div>

                <div className="main__statisBlock--value">
                  {dataDB.allUsers.length}
                </div>
              </div>

              <hr className='orders__line main__line' />

              <div className="main__body--title">
                Активні відвідувачі
              </div>

              <div className="main__activ">
                <div className="main__activBlock">
                  <div className="main__activBlock--text">
                    За сьогодні
                  </div>

                  <div className="main__activBlock--value">
                    {filterDates(dataDB.allUsers, oneDayAgo).length}
                  </div>
                </div>

                <div className="main__activBlock main__activBlock--margin">
                  <div className="main__activBlock--text">
                    За 3 дні
                  </div>

                  <div className="main__activBlock--value">
                    {filterDates(dataDB.allUsers, threeDaysAgo).length}
                  </div>
                </div>
              </div>

              <div className="main__activ">
                <div className="main__activBlock">
                  <div className="main__activBlock--text">
                    За тиждень
                  </div>

                  <div className="main__activBlock--value">
                    {filterDates(dataDB.allUsers, oneWeekAgo).length}
                  </div>
                </div>

                <div className="main__activBlock ">
                  <div className="main__activBlock--text">
                    За місяць
                  </div>

                  <div className="main__activBlock--value">
                    {filterDates(dataDB.allUsers, oneMonthAgo).length}
                  </div>
                </div>
              </div>

              <hr className='orders__line main__line' />

              <div className="main__statisBlock">
                <div className="main__body--title">
                  Зараз магазин переглядає
                </div>

                <div className="main__statisBlock--value" style={{ color: 'red' }}>
                  {(filterDates(dataDB.allUsers, minus5MinutesDate).length) - 1}
                </div>
              </div>
            </div>

            <div className="main__searchMain">
              <Search />
            </div>


            <div>
              <div className="main__gridContainer main__gridContainer--top">
                <NavLink to={`/Katalog?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--katalog'></div>
                    <div className="menu__list main__listi">
                      Каталог
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/AddProduct?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem' >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--add'></div>
                    <div className="menu__list main__listi">
                      Додати товар
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/Import?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--import'></div>
                    <div className="menu__list main__listi">
                      Імпорт товарів
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/Orders?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item ">
                    <div className='menu__icon menu__icon--checkout'></div>
                    <div className="menu__list main__listi">
                      Замовлення
                    </div>
                    {
                      (orderProducts.length !== 0) ? <div className="menu__list--empty">
                        {orderProducts.length}
                      </div> : null
                    }
                  </li>
                </NavLink>
              </div>

              <div className="main__gridContainerOne">
                <NavLink to={`/Settings?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className='main__gridItemOne'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--cart'></div>
                    <div className="menu__list main__listi">
                      Налаштування
                    </div>
                  </li>
                </NavLink>

                <NavLink to={`/Personalization?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItemOne'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--like'></div>
                    <div className="menu__list main__listi">
                      Персоналізація
                    </div>
                  </li>
                </NavLink>
              </div>
              <div className="main__gridContainer">
                <NavLink to={`/Contacts?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--contacts'></div>
                    <div className="menu__list main__listi">
                      Контакти
                    </div>
                    {
                      (dataDB.settings[0].viberContact === '' && dataDB.settings[0].phoneOne === '' && dataDB.settings[0].instaContact === '' && dataDB.settings[0].phoneTwo === '' && dataDB.settings[0].email === '' && dataDB.settings[0].telegaContact === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>

                <NavLink to={`/About?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--about'></div>
                    <div className="menu__list main__listi">
                      Про нас
                    </div>
                    {
                      (dataDB.settings[0].about === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>



                <NavLink to={`/Delivery?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--delivery'></div>
                    <div className="menu__list main__listi">
                      Доставка
                    </div>
                    {
                      (dataDB.settings[0].delivery === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>

                <NavLink to={`/Pay?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className=' main__gridItem'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--pay'></div>
                    <div className="menu__list main__listi">
                      Оплата
                    </div>
                    {
                      (dataDB.settings[0].pay === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>
              </div>

              <div className="main__gridContainerOne main__gridContainerOne--bottom">
                <NavLink to={`/Garant?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className='main__gridItemOne'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--garant'></div>
                    <div className="menu__list main__listi">
                      Гарантійні умови
                    </div>
                    {
                      (dataDB.settings[0].garant === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>

                <NavLink to={`/Obmin?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className='main__gridItemOne'  >
                  <li className="menu__item ">
                    <div className='menu__icon menu__icon--obmin'></div>
                    <div className="menu__list main__listi">
                      Обмін і повернення
                    </div>
                    {
                      (dataDB.settings[0].obmin === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>

                <NavLink to={`/Grafik?${dataDB.listBot[0].nameShop}`} onClick={() => scrollToTop()} className='main__gridItemOne'  >
                  <li className="menu__item">
                    <div className='menu__icon menu__icon--time'></div>
                    <div className="menu__list main__listi">
                      Графік роботи
                    </div>
                    {
                      (dataDB.settings[0].grafik === '') ? <div className="menu__list--empty">
                        !
                      </div> : null
                    }
                  </li>
                </NavLink>
              </div>

            </div>
            <div className="main__footerPid">
              <div className="menu__list--empty main__footerPid--icon">
                !
              </div>
              <div className="main__footerPid--text">
                Oзначає що в цьому розділі є незаповнена інформація
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
    }
  </>
}