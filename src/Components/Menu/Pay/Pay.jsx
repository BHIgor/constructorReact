import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Pay.scss'

export const Pay = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [pay, setPay] = useState([])

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const sendChange = () => {
    scrollToTop()

    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Оплата',
          nameShop: dataDB.listBot[0].nameShop,
          pay: pay.join(','),
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...dataDB, settings: prevState.settings.map((item, i) =>
              i === 0 ? { ...item, pay: pay.join(',') } : item
            )
          }))

          setTimeout(() => {
            setStatus('no')
          }, 5000)
          return response.json();
        })
        .catch(e => {
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
    setPay((dataDB.length === 0) ? '' : dataDB.settings[0].pay.split(','))

  }, [dataDB.length, dataDB.settings])

  const handlePay = (value) => {
    setPay(prevArr => {
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
          Оплата
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
              <div className="settings__body--border pay__border">
                <div className="settings__body--title pay__title">
                  Оберіть варіанти оплати
                </div>

                <div className='pay'>
                  <div className="delivery__container">

                    <div className="delivery__block pay__flexBlock">
                      <div className="delivery__selectBlock" onClick={() => handlePay('Оплата при отриманні')}>
                        <div
                          className="delivery__selected"
                          style={(pay.includes('Оплата при отриманні')) ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                        >

                        </div>
                      </div>

                      <div className='pay__flex'>
                        <div className="delivery__blockIcon">
                          <div className="delivery__icon delivery__block--otr" ></div>
                        </div>

                        <div className="delivery__text">
                          Оплата при отриманні
                        </div>
                      </div>
                    </div>

                    <div className="delivery__block pay__flexBlock">
                      <div className="delivery__selectBlock" onClick={() => handlePay('Перевод по реквізитам')}>
                        <div
                          className="delivery__selected"
                          style={(pay.includes('Перевод по реквізитам')) ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                        >

                        </div>
                      </div>

                      <div className='pay__flex'>
                        <div className="delivery__blockIcon">
                          <div className="delivery__icon delivery__block--rekv" ></div>
                        </div>

                        <div className="delivery__text">
                          Перевод по реквізитам
                        </div>
                      </div>
                    </div>

                    <div className="delivery__block pay__flexBlock">
                      <div className="delivery__selectBlock" onClick={() => handlePay('Перевод на карту')}>
                        <div
                          className="delivery__selected"
                          style={(pay.includes('Перевод на карту')) ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}
                        >

                        </div>
                      </div>

                      <div className='pay__flex'>
                        <div className="delivery__blockIcon">
                          <div className="delivery__icon delivery__block--karta" ></div>
                        </div>

                        <div className="delivery__text">
                          Перевод на карту
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <button
                  className="settings__body--submit pay__submit settings__body--submit2"
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