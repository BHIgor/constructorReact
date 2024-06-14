import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Delivery.scss'

export const Delivery = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [delivery, setDelivery] = useState([])
  const [value, setValue] = useState('')

  const handleValue = (event) => {
    setValue(event.target.value);
  };
  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
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
          operation: 'Доставка', 
          nameShop: dataDB.listBot[0].nameShop,
          delivery: delivery.join(','),
          adress: value
        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  settings: prevState.settings.map((item, i) =>
          i === 0 ? { ...item, adress: value,delivery: delivery.join(',')} : item
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
    setDelivery((dataDB.length === 0) ? '' : dataDB.settings[0].delivery.split(','))
    setValue((dataDB.length === 0) ? '' : dataDB.settings[0].adress)
    
  }, [dataDB.length, dataDB.settings])

  const handleDelivery = (value) => {
    setDelivery(prevArr => {
      const index = prevArr.indexOf(value);
      if (index !== -1) {
        // Якщо елемент існує, видаляємо його
        return [...prevArr.slice(0, index), ...prevArr.slice(index + 1)];
      } else {
        // Якщо елемент не існує, додаємо його
        return [...prevArr, value];
      }
    });
  }

  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik">
        <div className="settings__title">
          Доставка
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
        <div className='deliveryMargin'>
  
          <div className="settings__container">
            <div className="settings__body settings__body2">
              <div className="settings__body--border">
                <div className="settings__body--title">
                Оберіть варіанти доставок
                </div>

          <div className='delivery'>
          <div className="delivery__container">
          
            <div className="delivery__block">
              <div className="delivery__selectBlock" onClick={() => handleDelivery('Нова пошта')}>
                <div 
                  className="delivery__selected"
                  style={(delivery.includes('Нова пошта'))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                >

                </div>
              </div>

              <div className='delivery__flex'>
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--nova" ></div>
                </div>
              
                <div className="delivery__text">
                  Нова пошта
                </div>
              </div>
            </div>

            <div className="delivery__block">
              <div className="delivery__selectBlock" onClick={() => handleDelivery('Укр пошта')}>
                <div 
                  className="delivery__selected"
                  style={(delivery.includes('Укр пошта'))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                >

                </div>
              </div>

              <div className='delivery__flex'>
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--ukr" ></div>
                </div>

                <div className="delivery__text">
                  Укр пошта
                </div>
              </div>
            </div>
        
            <div className="delivery__block">
              <div className="delivery__selectBlock"  onClick={() => handleDelivery('Meest пошта')}>
                <div 
                  className="delivery__selected"
                  style={(delivery.includes('Meest пошта'))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                >

                </div>
              </div>

              <div className='delivery__flex'>
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--meest" ></div>
                </div>

                <div className="delivery__text">
                  Meest пошта
                </div>
              </div>
            </div>
            
            <div className="delivery__block">
              <div className="delivery__selectBlock" onClick={() => handleDelivery('Магазини Rozetka')}>
                <div 
                  className="delivery__selected"
                  style={(delivery.includes('Магазини Rozetka'))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                >

                </div>
              </div>

              <div className='delivery__flex'> 
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--rozetka" ></div>
                </div>

                <div className="delivery__text">
                  Магазини Rozetka
                </div>
              </div>
            </div>

            <div className="delivery__block">
              <div className="delivery__selectBlock"  onClick={() => handleDelivery("Кур'єр")}>
                <div 
                  className="delivery__selected"
                  style={(delivery.includes("Кур'єр"))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                >

                </div>
              </div>

              <div className='delivery__flex'>
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--kurier" ></div>
                </div>

                <div className="delivery__text">
                  Кур'єр
                </div>
              </div>
            </div>

            <div className="delivery__block">
              <div className="delivery__selectBlock" onClick={() => handleDelivery('Самовивіз')}>
                <div 
                  style={(delivery.includes('Самовивіз'))? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                  className="delivery__selected"
                >

                </div>
              </div>

              <div className='delivery__flex'>
                <div className="delivery__blockIcon">
                  <div className="delivery__icon delivery__block--sam" ></div>
                </div>

                <div className="delivery__textBlock">
                  <div className="delivery__text">
                    Самовивіз
                  </div>
                </div>
              </div>
            </div>
        
            {
              (delivery.includes('Самовивіз')) && (
                
                <textarea
                  className="delivery__textArea"
                  defaultValue={dataDB.settings[0].adress}
                  onChange={handleValue}
                  placeholder='Напишіть точну адресу звідки забрати товар...'
                />
              )
            }  
      

            
          </div>
        </div>
                <button
                  className="settings__body--submit settings__body--submit2"
                  style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                  disabled={(dataDB.settings[0].about === 'value')}
                  onClick={() => sendChange()}
                >
                  Застосувати
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    }
  </>
}