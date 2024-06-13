import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Settings.scss';


export const Settings = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [name, setName] = useState('')
  const [ status, setStatus ] = useState('no')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [telegram, setTelegram] = useState('')
  const [viber, setViber ] = useState('')
  const [tiktok, setTiktok] = useState('')

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
        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  listBot: prevState.listBot.map((item, i) =>
          i === 0 ? { ...item, name: name} : item
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

  const sendSoc = () => {
    scrollToTop()

    try{
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
        setDataDB(prevState => ({...dataDB,  settings: prevState.settings.map((item, i) =>
          i === 0 ? { ...item, instagram: instagram, telegram:telegram, viber: viber, facebook:facebook, tiktok:tiktok} : item
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
    setInstagram((dataDB.length === 0) ? '' : dataDB.settings[0].instagram)
    setFacebook((dataDB.length === 0) ? '' : dataDB.settings[0].facebook)
    setViber((dataDB.length === 0) ? '' : dataDB.settings[0].viber)
    setTelegram((dataDB.length === 0) ? '' : dataDB.settings[0].telegram)
    setTiktok((dataDB.length === 0) ? '' : dataDB.settings[0].tiktok)

  }, [dataDB.length, dataDB.listBot, dataDB.settings])
  console.log(name)

/*
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=60cda1ca7c5538c9a8a026499beff8ad', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setImageURL(data.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };
*/

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


        
        




        {

        /*<input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
     
      {imageURL && (
        <div>
          <p>Image URL:</p>
          <a href={imageURL} target="_blank" rel="noopener noreferrer">{imageURL}</a>
          <img src={imageURL} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}*/
      }

      </div>
    </>
    }
  </>
}