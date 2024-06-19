import { useContext } from 'react';
import { ReactContext } from "./../../context/ReactContext"

import './Mainpage.scss';

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

  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik">
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
                  {filterDates(dataDB.allUsers, minus5MinutesDate).length}
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>
    </>
    }
  </>
}