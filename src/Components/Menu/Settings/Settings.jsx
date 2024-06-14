import { useContext, useEffect, useRef, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Settings.scss';


export const Settings = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [name, setName] = useState('')
  const [status, setStatus] = useState('no')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [telegram, setTelegram] = useState('')
  const [viber, setViber] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [slider, setSlider] = useState([])

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await uploadToImgBB(file);
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadToImgBB = async (file) => {

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=60cda1ca7c5538c9a8a026499beff8ad', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      await fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Слайдер',
          nameShop: dataDB.listBot[0].nameShop,
          slider: (slider[0] === '') ? data.data.url: [...slider, data.data.url].join(','),
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...dataDB, settings: prevState.settings.map((item, i) =>
              i === 0 ? { ...item, slider: (slider[0] === '') ? data.data.url : [...slider, data.data.url].join(',') } : item
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

    } else {
      throw new Error('Upload failed');
    }
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleInstagram = (event) => {
    setInstagram(event.target.value);
  };

  const handleFacebook = (event) => {
    setFacebook(event.target.value);
  };

  const handleViber = (event) => {
    setViber(event.target.value);
  };

  const handleTelegram = (event) => {
    setTelegram(event.target.value);
  };

  const handleTiktok = (event) => {
    setTiktok(event.target.value);
  };


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
          operation: 'Налаштування',
          nameShop: dataDB.listBot[0].nameShop,
          name: name,
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...dataDB, listBot: prevState.listBot.map((item, i) =>
              i === 0 ? { ...item, name: name } : item
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

  const sendSoc = () => {
    scrollToTop()

    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Соц. Мережі',
          nameShop: dataDB.listBot[0].nameShop,
          instagram: instagram,
          telegram: telegram,
          viber: viber,
          facebook: facebook,
          tiktok: tiktok
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...dataDB, settings: prevState.settings.map((item, i) =>
              i === 0 ? { ...item, instagram: instagram, telegram: telegram, viber: viber, facebook: facebook, tiktok: tiktok } : item
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
    setName((dataDB.length === 0) ? '' : dataDB.listBot[0].name)
    setInstagram((dataDB.length === 0) ? '' : dataDB.settings[0].instagram)
    setFacebook((dataDB.length === 0) ? '' : dataDB.settings[0].facebook)
    setViber((dataDB.length === 0) ? '' : dataDB.settings[0].viber)
    setTelegram((dataDB.length === 0) ? '' : dataDB.settings[0].telegram)
    setTiktok((dataDB.length === 0) ? '' : dataDB.settings[0].tiktok)
    setSlider((dataDB.length === 0) ? '' : dataDB.settings[0].slider.split(','))
  }, [dataDB.length, dataDB.listBot, dataDB.settings])

  const deleteSliderImg = async (index) => {

    await fetch(`https://tgconstructor.com.ua/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        operation: 'Слайдер',
        nameShop: dataDB.listBot[0].nameShop,
        slider: slider.filter((item, i) => i !== index).join(','),
      })
    })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({
          ...dataDB, settings: prevState.settings.map((item, i) =>
            i === 0 ? { ...item, slider: slider.filter((item, i) => i !== index).join(',') } : item
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
  }

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
                Назва магазину
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.listBot[0].name}
                onChange={handleName}
                maxLength={14}
                placeholder='Максимум 14 символів'
              />

              <button
                className="settings__body--submit"
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                disabled={(dataDB.listBot[0].name === name)}
                onClick={() => sendChange()}
              >
                Застосувати
              </button>
            </div>

            <div className="settings__body--border">
              <div className="settings__body--title">
                Слайдер
              </div>

              <div className="settings__slider">
                {
                  (dataDB.settings[0].slider !== '') ?
                  dataDB.settings[0].slider.split(',').map((e, index) => {
                    return (<div key={index}>
                      <div className="settings__slider--blockIcon" onClick={() => deleteSliderImg(index)}>
                        <div className="settings__slider--icon"></div>
                      </div>
                      <img src={e} alt="Фото слайдера" className='settings__slider--img' />

                    </div>
                    )
                  })
                  :null

                }
              </div>

              <div className="settings__slider--addPhotoBlock">
                <button
                  className="settings__slider--addPhoto"
                  style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                  onClick={handleButtonClick}
                  disabled={uploading}
                >
                  {uploading ? 'Завантаження...' : 'Додати фото'}
                </button>

                <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden-file-input"
              />
              </div>    
            </div>

            <div className="settings__body--border">
              <div className="settings__body--subTitle">
                Соц. мережі
              </div>

              <div className="settings__body--title">
                Instagram
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].instagram}
                onChange={handleInstagram}
                placeholder='Посилання на instagram'
              />

              <div className="settings__body--title">
                Facebook
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].facebook}
                onChange={handleFacebook}
                placeholder='Посилання на facebook'
              />

              <div className="settings__body--title">
                Telegram
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].telegram}
                onChange={handleTelegram}
                placeholder='Посилання на telegram'
              />

              <div className="settings__body--title">
                Viber
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].viber}
                onChange={handleViber}
                placeholder='Посилання на viber'
              />

              <div className="settings__body--title">
                Tiktok
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].tiktok}
                onChange={handleTiktok}
                placeholder='Посилання на tiktok'
              />

              <button
                className="settings__body--submit"
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                disabled={(dataDB.settings[0].instagram === instagram && dataDB.settings[0].telegram === telegram && dataDB.settings[0].facebook === facebook && dataDB.settings[0].viber === viber && dataDB.settings[0].tiktok === tiktok)}
                onClick={() => sendSoc()}
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