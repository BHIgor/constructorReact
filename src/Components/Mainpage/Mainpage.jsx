import { useContext } from 'react';
import { ReactContext } from "./../../context/ReactContext"

import './Mainpage.scss';

export const Mainpage = ({ setMenu }) =>{
  const { dataDB } = useContext(ReactContext);

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik">
        <div className="settings__title">
          Панель управління
        </div>


        <div className="settings__container">
          <div className="settings__body">
            <div className="settings__body--border">
              <div className="settings__body--title">
                Загальна кількість відвідувачів
              </div>

            
             
            </div>
          </div>
        </div>
      </div>
    </>
    }
  </>
}