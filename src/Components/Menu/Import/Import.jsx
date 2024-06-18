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
              const response = await fetch(`https://cors-anywhere.herokuapp.com/${e.img}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              console.log(response)
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const blob = await response.blob();

              // Створіть FormData для завантаження на imgbb
              const formData = new FormData();
              formData.append('image', blob);

              // Завантажте зображення на imgbb
              const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: 'POST',
                body: formData,
              });

              if (!imgbbResponse.ok) {
                throw new Error(`HTTP error! status: ${imgbbResponse.status}`);
              }

              const result = await imgbbResponse.json();

              setNewImageUrl(result.data.url);
            } catch (error) {
              console.error('Error uploading the image:', error);
            }

            return importProduct.push({
              id: maxId + 1 + index,
              title: e?.text?.substring(0, 20),
              image: newImageUrl,
              kategory: 'Без категорії',
              description: e.text,
              nayavno: 'yes',
              stars: 5,
              top: 'no',
              price: 0,
              price_discount: 0
            })
          })
          setStatus('ok')

          setTimeout(() => {
            setStatus('no')
          }, 5000)
          setDataDB(prevState => ({
            ...dataDB, products: [...prevState.products, ...importProduct]
          }))

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
                  <img src="https://scontent-iev1-1.cdninstagram.com/v/t51.29350-15/434587835_1103421521076934_5445111499790207990_n.jpg?stp=dst-jpg_e15_p360x360&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xMDgweDE5MjAuc2RyLmYyOTM1MCJ9&_nc_ht=scontent-iev1-1.cdninstagram.com&_nc_cat=110&_nc_ohc=zhwFS7JSjpYQ7kNvgEIceE6&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MzMzMzA5MTAyMDc0NzQzOTM4OA%3D%3D.2-ccb7-5&oh=00_AYCINT0hsz6cVhshp9PFEjc70Ee0MlZKuPsshCAZ8pVcSw&oe=66750BCC&_nc_sid=b41fef" alt="ss" crossOrigin="anonymous"/>
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