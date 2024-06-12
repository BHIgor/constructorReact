import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Settings.scss';


export const Settings = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [name, setName] = useState('')
  const [link, setLink] = useState('')
  const [ status, setStatus ] = useState('no')

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleLink = (event) => {
    setLink(event.target.value);
  };

  const scrollToTop = () => {
    scroll.scrollToTop({duration:20});
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
          operation: 'Налаштування', 
          nameShop: dataDB.listBot[0].nameShop,
          name: name,
          link: link,
        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  listBot: prevState.listBot.map((item, i) =>
          i === 0 ? { ...item, name: name,linkShop: link } : item
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
    setName((dataDB.length === 0) ? '' : dataDB.listBot[0].name)
    setLink((dataDB.length === 0) ? '' : dataDB.listBot[0].linkShop)
   
  }, [dataDB.length, dataDB.listBot])
  console.log(name)
  console.log(link)

  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="settings">
        <div className="settings__title">
          Налаштування
        </div>

        {
          (status === 'ok') ? 
          <div className="settings__statusOk">
            Зміни застосовано
          </div> :  null 
        }
        {
          (status === 'err') ? 
          <div className="settings__statusFail">
            Помилка. Зверніться в тех. підтримку
          </div> :  null
        }
         

        <div className="settings__container">
          <div className="settings__body">
            <div className="settings__body--title">
              Назва магазину
            </div>

            <input
              className="settings__body--text"
              defaultValue={dataDB.listBot[0].name}
              onChange={handleName}
              maxLength={14}
              placeholder='Максимум 14 символів'
            />

            <div className="settings__body--title">
              Посилання на бота
            </div>

            <input
              className="settings__body--text"
              defaultValue={dataDB.listBot[0].linkShop}
              onChange={handleLink}
            />
          
            <button
              className="settings__body--submit"
              style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
              disabled={(dataDB.listBot[0].linkShop === link && dataDB.listBot[0].name === name)}
              onClick={() => sendChange()}
            >
              Застосувати
            </button>

            <div className="settings__podskazka">
              * Посилання на бота потрібне для того, щоб у Вашому магазині була можливість відправляти посилання на товар та замовлення.
            </div>
          </div>
        </div>


      </div>
    </>
    }
  </>
}