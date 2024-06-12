import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';
import { HexColorPicker } from 'react-colorful';

import './Personalization.scss';


export const Personalization = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [ status, setStatus ] = useState('no')
  const [color, setColor] = useState("#aabbcc");
  
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

        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  listBot: prevState.listBot.map((item, i) =>
          i === 0 ? { ...item, name: '',linkShop: 'link' } : item
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
    setColor((dataDB.length === 0) ? '' : dataDB.settings[0].clHeader)
    
  }, [dataDB.length, dataDB.listBot, dataDB.settings])


  const handleColorHeader = (newColor) => {
    setColor(newColor);
    setDataDB(prevState => ({...dataDB,  settings: prevState.settings.map((item, i) =>
      i === 0 ? { ...item, clHeader: newColor } : item
    )}))

  };

  console.log(color)
  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="settings">
        <div className="settings__title">
          Персоналізація
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
              Основний колір
            </div>

            <input
              className="settings__body--text"
              defaultValue={dataDB.listBot[0].name}
              maxLength={14}
              placeholder='Максимум 14 символів'
            />

        <HexColorPicker color={color} onChange={handleColorHeader} />
        <div className="color-hash">{color}</div>
          
            <button
              className="settings__body--submit"
              style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
              disabled={(dataDB.listBot[0].linkShop === 'link' && dataDB.listBot[0].name === 'name')}
              onClick={() => sendChange()}
            >
              Застосувати
            </button>

          </div>
        </div>


      </div>
    </>
    }
  </>
}