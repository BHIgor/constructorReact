import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './Contacts.scss';


export const Contacts = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [ status, setStatus ] = useState('no')
  const [phoneOne, setPhoneOne] = useState('')
  const [phoneTwo, setPhoneTwo] = useState('')
  const [email, setEmail] = useState('')
  const [telegaContact, setTelegaContact ] = useState('')
  const [viberContact, setViberContact] = useState('')
  const [instaContact, setInstaContact] = useState('')

  const handlePhoneOne = (event) => {
    setPhoneOne(event.target.value);
  };

  const handlePhoneTwo = (event) => {
    setPhoneTwo(event.target.value);
  };

  const handleInsta = (event) => {
    setInstaContact(event.target.value);
  };

  const handleViber = (event) => {
    setViberContact(event.target.value);
  };

  const handleTelegram = (event) => {
    setTelegaContact(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
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
          operation: 'Контакти', 
          nameShop: dataDB.listBot[0].nameShop,
          phoneOne:phoneOne,
          phoneTwo:phoneTwo,
          email:email,
          telegaContact:telegaContact,
          viberContact:viberContact,
          instaContact:instaContact

        })
      })
      .then((response) => {
        setStatus('ok')
        setDataDB(prevState => ({...dataDB,  listBot: prevState.listBot.map((item, i) =>
          i === 0 ? { ...item, phoneOne: phoneOne, phoneTwo:phoneTwo,email:email, telegaContact:telegaContact,viberContact:viberContact, instaContact:instaContact} : item
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
    setPhoneOne((dataDB.length === 0) ? '' : dataDB.settings[0].phoneOne)
    setPhoneTwo((dataDB.length === 0) ? '' : dataDB.settings[0].phoneTwo)
    setEmail((dataDB.length === 0) ? '' : dataDB.settings[0].email)
    setTelegaContact((dataDB.length === 0) ? '' : dataDB.settings[0].telegaContact)
    setViberContact((dataDB.length === 0) ? '' : dataDB.settings[0].viberContact)
    setInstaContact((dataDB.length === 0) ? '' : dataDB.settings[0].instaContact)

  }, [dataDB.length, dataDB.listBot, dataDB.settings])



  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="settings">
        <div className="settings__title">
          Контакти
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
                Номер телефону №1
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].phoneOne}
                onChange={handlePhoneOne}
                placeholder='Ваш номер телефону'
              />

              <div className="settings__body--title">
               Номер телефону №2
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].phoneTwo}
                onChange={handlePhoneTwo}
                placeholder='Ваш номер телефону'
              />

              <div className="settings__body--title">
                Email
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].email}
                onChange={handleEmail}
                placeholder='Ваш email'
              />

              <div className="settings__body--title">
                Viber
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].viberContact}
                onChange={handleViber}
                placeholder='Ваш номер для viber'
              />

              <div className="settings__body--title">
                Instagram
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].instaContact}
                onChange={handleInsta}
                placeholder='Посилання на Ваш instagram'
              />

              <div className="settings__body--title">
                Telegram
              </div>

              <input
                className="settings__body--text"
                defaultValue={dataDB.settings[0].telegaContact}
                onChange={handleTelegram}
                placeholder='Посилання на Ваш telegram'
              />
            
              <button
                className="settings__body--submit"
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                disabled={(dataDB.settings[0].phoneOne === phoneOne && dataDB.settings[0].phoneTwo === phoneTwo && dataDB.settings[0].email === email && dataDB.settings[0].telegaContact === telegaContact && dataDB.settings[0].viberContact === viberContact && dataDB.settings[0].instaContact === instaContact)}
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