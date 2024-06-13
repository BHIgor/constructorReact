import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"

import { animateScroll as scroll } from 'react-scroll';

export const Garant = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [value, setValue] = useState('')

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const handleValue = (event) => {
    setValue(event.target.value);
  };
  const sendChange = () => {
    scrollToTop()

    try{
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Гарантійні умови', 
          nameShop: dataDB.listBot[0].nameShop,
          garant: value,
        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  settings: prevState.settings.map((item, i) =>
          i === 0 ? { ...item, garant: value} : item
        )}))

        setTimeout(() => {
          setStatus('no')
        }, 5000)
        return response.json();
      })
      .catch(e =>{
        setStatus('err')

        setTimeout(() => {
          setStatus('no')
        }, 5000)

        console.log(e)
        return false
      })

    } catch (e) {
      return false;
    }
  } 


  useEffect(() => {
    setValue((dataDB.length === 0) ? '' : dataDB.settings[0].garant)
    
  }, [dataDB.length, dataDB.settings])


  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik">
        <div className="settings__title">
          Гарантійні умови
        </div>

        {
          (status === 'ok') ?
            <div className="settings__statusOk">
              Зміни застосовано
            </div> : null
        }
        {
          (status === 'err') ?
            <div className="settings__statusFail">
              Помилка. Зверніться в тех. підтримку
            </div> : null
        }

        <div className="settings__container">
          <div className="settings__body">
            <div className="settings__body--border">
            <div className="settings__body--title">
            Гарантійні умови
              </div>

              <textarea
                className="settings__body--textArea"
                defaultValue={dataDB.settings[0].garant}
                onChange={handleValue}
                placeholder='Потрібно описати гарантійні умови...'
              />
            
              <button
                className="settings__body--submit"
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                disabled={(dataDB.settings[0].garant === value)}
                onClick={() => sendChange()}
              >
                Застосувати
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    }
  </>
}