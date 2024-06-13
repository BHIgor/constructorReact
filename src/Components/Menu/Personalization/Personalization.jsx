import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';
import { HexColorPicker } from 'react-colorful';

import './Personalization.scss';


export const Personalization = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [visible, setVisible] = useState('')
  const [clHeader, setClHeader] = useState('');
  const [clTitle, setClTitle] = useState('');
  const [clButtonProduct, setClButtonProduct] = useState('');
  const [clFooter, setClFooter] = useState('');
  const [clFooterTitle, setClFooterTitle] = useState('');
  

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const sendChange = (operation, newColor, nameColor) => {
    scrollToTop()

    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: operation,
          nameShop: dataDB.listBot[0].nameShop,
          [nameColor]: newColor,
        })
      })
        .then((response) => {
          setStatus('ok')

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
    setClHeader((dataDB.length === 0) ? '' : dataDB.settings[0].clHeader)
    setClTitle((dataDB.length === 0) ? '' : dataDB.settings[0].clTitle)
    setClButtonProduct((dataDB.length === 0) ? '' : dataDB.settings[0].clButtonProduct)
    setClFooter((dataDB.length === 0) ? '' : dataDB.settings[0].clFooter)
    setClFooterTitle((dataDB.length === 0) ? '' : dataDB.settings[0].clFooterTitle)
    
  }, [dataDB.length, dataDB.listBot, dataDB.settings])


  const handleColorHeader = (newColor) => {
    setClHeader(newColor);
    setDataDB(prevState => ({
      ...dataDB, settings: prevState.settings.map((item, i) =>
        i === 0 ? { ...item, clHeader: newColor } : item
      )
    }))
  };

  const handleColorTitle = (newColor) => {
    setClTitle(newColor);
    setDataDB(prevState => ({
      ...dataDB, settings: prevState.settings.map((item, i) =>
        i === 0 ? { ...item, clTitle: newColor } : item
      )
    }))
  };

  const handleColorButton = (newColor) => {
    setClButtonProduct(newColor);
    setDataDB(prevState => ({
      ...dataDB, settings: prevState.settings.map((item, i) =>
        i === 0 ? { ...item, clButtonProduct: newColor } : item
      )
    }))
  };

  const handleColorFooter = (newColor) => {
    setClFooter(newColor);
    setDataDB(prevState => ({
      ...dataDB, settings: prevState.settings.map((item, i) =>
        i === 0 ? { ...item, clFooter: newColor } : item
      )
    }))
  };

  const handleColorFooterTitle = (newColor) => {
    setClFooterTitle(newColor);
    setDataDB(prevState => ({
      ...dataDB, settings: prevState.settings.map((item, i) =>
        i === 0 ? { ...item, clFooterTitle: newColor } : item
      )
    }))
  };
  
  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="personaliz">
        <div className="settings__title">
          Персоналізація
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
            <div className="personaliz__body--title">
              Основний колір
            </div>

            <div className="personaliz__body--flex">
              <div className="personaliz__body--block" style={{ backgroundColor: `${dataDB.settings[0].clHeader}` }}>

              </div>
              <div
                className="personaliz__body--button"
                style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                onClick={() => setVisible((visible === 'header') ? '':'header')}
                >
                Змінити
              </div>
            </div>

            {
              (visible === 'header') && (
                <div className="personaliz__body--gamma">
                  <HexColorPicker color={clHeader} onChange={handleColorHeader} />

                  <button
                    className="personaliz__body--submit"
                    style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                    onClick={() => {
                      sendChange('Колір Header', clHeader, 'clHeader')
                      setVisible('')
                      }
                    }
                  >
                    Застосувати
                  </button>
                </div>
              )
            }

            <div className="personaliz__body--title">
              Допоміжний колір
            </div>

            <div className="personaliz__body--flex">
              <div className="personaliz__body--block" style={{ backgroundColor: `${dataDB.settings[0].clTitle}` }}>

              </div>
              <div
                className="personaliz__body--button"
                style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                onClick={() => setVisible((visible === 'title') ? '':'title')}
                >
                Змінити
              </div>
            </div>

            {
              (visible === 'title') && (
                <div className="personaliz__body--gamma">
                  <HexColorPicker color={clTitle} onChange={handleColorTitle} />

                  <button
                    className="personaliz__body--submit"
                    style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                    onClick={() => {
                      sendChange('Колір Title', clTitle, 'clTitle')
                      setVisible('')
                      }
                    }
                  >
                    Застосувати
                  </button>
                </div>
              )
            }

            <div className="personaliz__body--title">
              Колір кнопок
            </div>

            <div className="personaliz__body--flex">
              <div className="personaliz__body--block" style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}` }}>

              </div>
              <div
                className="personaliz__body--button"
                style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                onClick={() => setVisible((visible === 'button') ? '':'button')}
                >
                Змінити
              </div>
            </div>

            {
              (visible === 'button') && (
                <div className="personaliz__body--gamma">
                  <HexColorPicker color={clButtonProduct} onChange={handleColorButton} />

                  <button
                    className="personaliz__body--submit"
                    style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                    onClick={() => {
                      sendChange('Колір Button', clButtonProduct, 'clButtonProduct')
                      setVisible('')
                      }
                    }
                  >
                    Застосувати
                  </button>
                </div>
              )
            }
            
            <div className="personaliz__body--title">
              Колір блока соц. мережі
            </div>

            <div className="personaliz__body--flex">
              <div className="personaliz__body--block" style={{ backgroundColor: `${dataDB.settings[0].clFooter}` }}>

              </div>
              <div
                className="personaliz__body--button"
                style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                onClick={() => setVisible((visible === 'footer') ? '':'footer')}
                >
                Змінити
              </div>
            </div>

            {
              (visible === 'footer') && (
                <div className="personaliz__body--gamma">
                  <HexColorPicker color={clFooter} onChange={handleColorFooter} />

                  <button
                    className="personaliz__body--submit"
                    style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                    onClick={() => {
                      sendChange('Колір Footer', clFooter, 'clFooter')
                      setVisible('')
                      }
                    }
                  >
                    Застосувати
                  </button>
                </div>
              )
            }

            <div className="personaliz__body--title">
              Колір текста блока соц. мережі
            </div>

            <div className="personaliz__body--flex">
              <div className="personaliz__body--block" style={{ backgroundColor: `${dataDB.settings[0].clFooterTitle}` }}>

              </div>
              <div
                className="personaliz__body--button"
                style={{ backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                onClick={() => setVisible((visible === 'footerTitle') ? '':'footerTitle')}
                >
                Змінити
              </div>
            </div>

            {
              (visible === 'footerTitle') && (
                <div className="personaliz__body--gamma">
                  <HexColorPicker color={clFooterTitle} onChange={handleColorFooterTitle} />

                  <button
                    className="personaliz__body--submit"
                    style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                    onClick={() => {
                      sendChange('Колір FooterTitle', clFooterTitle, 'clFooterTitle')
                      setVisible('')
                      }
                    }
                  >
                    Застосувати
                  </button>
                </div>
              )
            }

          </div>
        </div>


      </div>
    </>
    }
  </>
}