import { useContext, useEffect, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"

import './Import.scss';
import { animateScroll as scroll } from 'react-scroll';

export const Import = ({ setMenu }) => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [value, setValue] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('');

  const imgbbApiKey = '60cda1ca7c5538c9a8a026499beff8ad'; // Замените на ваш API ключ imgbb


  console.log(value)
  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const handleValue = (event) => {
    setValue(event.target.value);
  };
  const sendChange = () => {
    scrollToTop()
    const maxId = dataDB.products.reduce((maxId, item) => (item.id > maxId ? item.id : maxId), 0);
    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Імпорт инста',
          nameShop: dataDB.listBot[0].nameShop,
          postCount: 10,
          username: 'naprocente'
        })
      })
        .then((response) => {

          return response.json();
        })
        .then((data) => {
          console.log(data)
          const importProduct = []

          data.map(async (e, index) => {
    
            try {
              // Загрузите изображение по ссылке
              const response = await fetch(e.img);
              const blob = await response.blob();
        
              // Створіть FormData для завантаження на imgbb
              const formData = new FormData();
              formData.append('image', blob);
        
              // Завантажте зображення на imgbb
              const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                mode: "no-cors",
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: formData,
              });
        
              const result = await imgbbResponse.json();
              setNewImageUrl(result.data.url);
            } catch (error) {
              console.error('Error uploading the image:', error);
            }

           return importProduct.push({
              id:maxId + 1 + index,
              title:e?.text?.substring(0, 20),
              image: newImageUrl,
              kategory:'Без категорії',
              description: e.text,
              nayavno:'yes',
              stars:5,
              top:'no',
              price:0,
              price_discount:0})
          })
          setStatus('ok')

          setTimeout(() => {
            setStatus('no')
          }, 5000)
        setDataDB(prevState => ({
            ...dataDB, products: [...prevState.products, ...importProduct] }))

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
    setValue((dataDB.length === 0) ? '' : dataDB.settings[0].grafik)

  }, [dataDB.length, dataDB.settings])


  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="grafik">
        <div className="settings__title">
          Імпорт товарів
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
                Графік роботи
              </div>

              <textarea
                className="settings__body--textArea"
                defaultValue={dataDB.settings[0].grafik}
                onChange={handleValue}
                placeholder='Потрібно описати свій графік роботи...'
              />

              <button
                className="settings__body--submit"
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                // disabled={(dataDB.settings[0].grafik === value)}
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