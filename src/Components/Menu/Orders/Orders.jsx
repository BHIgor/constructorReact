import { useContext, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import moment from 'moment';
import './Orders.scss'
import { Link } from 'react-router-dom';

export const Orders = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [activDetails, setActivDetails] = useState('')
  const [isOpen, setIsOpen] = useState('');

  const options = [
    { value: 'Новий', label: 'Новий' },
    { value: 'Прийнято', label: 'Прийнято' },
    { value: 'Виконано', label: 'Виконано' },
    { value: 'Скасовано', label: 'Скасовано' }
  ];


  const handleOptionClick = (value, index) => {
    const updatedOrders = dataDB.allOrders.map(order => {
      // Проверяем, если id равен 2, изменяем значение name
      if (order.ids === index) {
        return { ...order, status: value }; // Заменяем name на новое значение
      }
      return order; // Возвращаем неизмененный объект для других элементов
    });
    // Обновляем состояние
    setDataDB(prevState => ({
      ...prevState,
      allOrders: updatedOrders
    }));
    setIsOpen(0);
  };

  const allProducts = dataDB.products
  const orderProducts = (dataDB.length !== 0) ? dataDB.allOrders.filter(e => e.nameShop === dataDB.listBot[0].nameShop) : []
  const myProduct = []

  orderProducts?.forEach(e => {
    const product = allProducts.find(s => s.id === Number(e.idProduct))

    if (product) {
      return myProduct.push({ ...e, ...product })
    }

  })

  const detailsView = (id) => {
    if (activDetails === id) {
      setActivDetails(0)
    } else {
      setActivDetails(id)
    }

  }

  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className='orders'>
        {
          (myProduct.length === 0) ?
            <>
              <div className="orders__empty">
                <div className="orders__empty--block">
                  <div className="orders__empty--text">
                    У Вас немає замовлень
                  </div>
                </div>
                <div className="orders__empty--blockImg">
                  <div className="orders__empty--icon">

                  </div>
                </div>
              </div>
            </>
            :
            <>
              <div className="settings__title">
                Ваші замовлення
              </div>
              {myProduct.reverse().map(e => {
                const images = e.image.split(',')

                return (
                  <div className="orders__product" key={e.ids}>
                    <div className="orders__header">

                      <div className="orders__status">
                        <div>
                          <div className="orders__status--title subtitle">
                            Статус замовлення
                          </div>

                          <div className="orders__status--textBlock" onClick={() => setIsOpen(e.ids)}>
                            <div
                              className="orders__status--text"
                              style={
                                (e.status === 'Новий') ? { color: 'orange' } :
                                  (e.status === 'Прийнято') ? { color: 'black' } :
                                    (e.status === 'Виконано') ? { color: 'green' } :
                                      (e.status === 'Скасовано') ? { color: 'red' } : null}
                            >
                              {e.status}
                            </div>

                            <span className={`arrow ${isOpen ? 'up' : 'down'}`}>&#9660;</span>
                          </div>


                          {((Number(isOpen) === e.ids)) && (
                            <div className='orders__status--option'>
                              {
                                options.map((option) => (
                                  <div 
                                  key={option.value} 
                                  className='orders__status--optionText'
                                  onClick={() => handleOptionClick(option.value, e.ids)}
                                  style={
                                    (option.value === 'Новий') ? { color: 'orange' } :
                                      (option.value === 'Прийнято') ? { color: 'black' } :
                                        (option.value === 'Виконано') ? { color: 'green' } :
                                          (option.value === 'Скасовано') ? { color: 'red' } : null}
                                  >
                                    {option.label}
                                  </div>
                                ))
                              }
                            </div>
                            
                          )}
                        </div>

                        <div className="orders__status--date">
                          {moment(e.date).format('YYYY-MM-DD HH:mm:ss')}
                        </div>

                      </div>
                    </div>
                    <div className="orders__infoProduct">
                      <div className="orders__flexLeft">
                        <div className='orders__infoProduct--imgBlock'>
                          <img
                            src={images[0]}
                            alt='Нема фото'
                            className='orders__infoProduct--image'
                          />
                        </div>

                        <div className="orders__infoProduct--titleBlock" >
                          <Link
                            to={`/Product/${e.idProduct}?${dataDB.listBot[0].nameShop}`}
                            className="orders__infoProduct--title"
                          >
                            {e.title}
                          </Link>
                          <div className="orders__footerBlock">
                            <div className="orders__countProduct">
                              <div className="orders__countProduct--count">
                                {e.count} шт.
                              </div>

                              <div className="orders__countProduct--price">
                                {((e.price_discount === 0) ? e.price : e.price_discount) * e.count}<span className='orders__countProduct--simvol'>₴</span>
                              </div>
                            </div>

                            <div
                              className="orders__details"
                              style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                              onClick={() => detailsView(e.ids)}
                            >
                              {((Number(activDetails) === e.ids)) ? 'Закрити' : 'Детальніше'}
                            </div>
                          </div>

                        </div>
                      </div>


                    </div>


                    {
                      (Number(activDetails) === e.ids) && (
                        <>
                          <hr className='orders__line' />

                          <div className="orders__dostavka">
                            <div className="orders__dostavka--text">
                              Доставка
                            </div>

                            <div className="orders__dostavka--value">
                              за тарифами перевізника
                            </div>
                          </div>

                          <hr className='orders__line' />

                          <div className="orders__userName">
                            <div className="orders__userName--text subtitle">
                              Ім'я одержувача
                            </div>

                            <div className="orders__userName--value">
                              {e.nameUser}
                            </div>
                          </div>

                          <hr className='orders__line' />

                          <div className="orders__userPhone">
                            <div className="orders__userPhone--text subtitle">
                              Телефон одержувача
                            </div>

                            <div className="orders__userPhone--value">
                              {e.phoneUser}
                            </div>
                          </div>
                          {
                            (e.telegram !== 'undefined') ?
                              <>
                                <hr className='orders__line' />

                                <div className="orders__userPhone">
                                  <div className="orders__userPhone--text subtitle">
                                    Telegram одержувача
                                  </div>

                                  <div className="orders__userPhone--value">
                                    <a href={`https://t.me/${e.telegram}`}>
                                      https://t.me/{e.telegram}
                                    </a>
                                  </div>
                                </div>
                              </> : null
                          }

                          {
                            (e.insta !== '') ?
                              <>
                                <hr className='orders__line' />

                                <div className="orders__userPhone">
                                  <div className="orders__userPhone--text subtitle">
                                    Instagram одержувача
                                  </div>

                                  <div className="orders__userPhone--value">
                                    <a href={e.insta} >
                                      {e.insta}
                                    </a>
                                  </div>
                                </div>
                              </> : null
                          }
                          <hr className='orders__line' />

                          <div className="orders__oplata">
                            <div className="orders__oplata--text subtitle">
                              Спосіб оплати
                            </div>

                            <div className="orders__oplata--value">
                              {
                                (e.oplata === 'otriman') ? 'Оплата при отриманні' :
                                  (e.oplata === 'rekvizit') ? 'Перевод по реквізитам' :
                                    (e.oplata === 'karta') ? 'Перевод на карту' : null
                              }
                            </div>
                          </div>

                          <hr className='orders__line' />

                          <div className="orders__delivery">
                            <div className="orders__delivery--text subtitle">
                              Спосіб доставки
                            </div>

                            <div className="orders__delivery--value">
                              {
                                (e.dostavka === 'nova') ? 'Нова пошта' :
                                  (e.dostavka === 'ukr') ? 'Укр пошта' :
                                    (e.dostavka === 'meest') ? 'Meest пошта' :
                                      (e.dostavka === 'kurier') ? `Кур'єр` :
                                        (e.dostavka === 'rozetka') ? 'Магазини Rozetka' :
                                          (e.dostavka === 'sam') ? 'Самовивіз' : null
                              }
                            </div>
                          </div>

                          <hr className='orders__line' />

                          <div className="orders__adress">
                            <div className="orders__adress--text subtitle">
                              Адреса доставки
                            </div>

                            <div className="orders__adress--value">
                              {(e.dostavka === 'nova') ? <>{e.city} {e.viddilenya}</> : <>{e.adress}</>}
                            </div>
                          </div>
                          {
                            (e.coment !== '') ?
                              <>
                                <hr className='orders__line' />

                                <div className="orders__adress">
                                  <div className="orders__adress--text subtitle">
                                    Коментар
                                  </div>

                                  <div className="orders__adress--value">
                                    {e.coment}
                                  </div>
                                </div>
                              </> : null
                          }
                        </>
                      )
                    }
                  </div>
                )
              })}
            </>
        }
      </div>
    </>
    }

  </>
}