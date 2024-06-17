import { useContext, useEffect, useMemo, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import moment from 'moment';
import './Orders.scss'
import { Link } from 'react-router-dom';

export const Orders = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [activDetails, setActivDetails] = useState('')
  const [status, setStatus] = useState('no')
  const [myProduct, setMyProduct] = useState([])
  const [allOrder, setAllOrder] = useState([])
  const [currentStatus, setCurrentStatus] = useState('Новий')


  const handleOptionClick = (e, index) => {
    setCurrentStatus(e.target.value)
    const updatedOrders = dataDB.allOrders.map(order => {

      if (order.ids === index) {
        return { ...order, status: e.target.value };
      }
      return order;
    });

    try {
      fetch(`https://tgbazar.com.ua/products/${dataDB.listBot[0].nameShop}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Зміна статуса',
          nameShop: dataDB.listBot[0].nameShop,
          status: e.target.value,
          ids: index
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...prevState,
            allOrders: updatedOrders
          }));

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
  };

  const allProducts = dataDB.products
  const orderProducts = useMemo(() => (dataDB.length !== 0) ? dataDB.allOrders.filter(e => e.nameShop === dataDB.listBot[0].nameShop) : [], [dataDB.allOrders, dataDB.length, dataDB.listBot])

  useEffect(() => {

    const prod = []

    orderProducts?.forEach(e => {
      const product = allProducts.find(s => s.id === Number(e.idProduct))

      if (product) {

        return prod.push({ ...e, ...product })
      }

    })

    setMyProduct(prod.filter(e => e.status === currentStatus))
    setAllOrder(prod)

  }, [allProducts, orderProducts, currentStatus])

  const detailsView = (id) => {
    if (activDetails === id) {
      setActivDetails(0)
    } else {
      setActivDetails(id)
    }

  }


  const filter = (value) => {
    setMyProduct(allOrder.filter(e => e.status === value))


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

              <div className="settings__subtitle">
                *Зверніть увагу на час замовлення. Якщо час замовлення співпадає з іншими замовленнями, то в такому випадку було замовлено декілька товарів в одному замовленні.
              </div>

              <div className="orders__filterFlex">
                <button
                  className="orders__filter orders__filter--noviy"
                  onClick={() => filter('Новий')}
                  disabled={(allOrder.filter(e => e.status === 'Новий').length === 0)}
                >
                  Новий {allOrder.filter(e => e.status === 'Новий').length}
                </button>

                <button
                  className="orders__filter orders__filter--prinyato"
                  onClick={() => filter('Прийнято')}
                  disabled={(allOrder.filter(e => e.status === 'Прийнято').length === 0)}
                >
                  Прийнято {allOrder.filter(e => e.status === 'Прийнято').length}
                </button>

                <button
                  className="orders__filter orders__filter--gotovo"
                  onClick={() => filter('Виконано')}
                  disabled={(allOrder.filter(e => e.status === 'Виконано').length === 0)}
                >
                  Виконано {allOrder.filter(e => e.status === 'Виконано').length}
                </button>

                <button
                  className="orders__filter orders__filter--cancel"
                  onClick={() => filter('Скасовано')}
                  disabled={(allOrder.filter(e => e.status === 'Скасовано').length === 0)}
                >
                  Скасовано {allOrder.filter(e => e.status === 'Скасовано').length}
                </button>
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

              {myProduct.reverse().map((e, index) => {
                const images = e?.image?.split(',')

                return (
                  <div className="orders__product" key={e.ids}>

                    <div className="orders__header">

                      <div className="orders__status">
                        <div>
                          <div className="orders__status--title subtitle">
                            Статус замовлення
                          </div>


                          <select
                            defaultValue={e.status}
                            onChange={(event) => handleOptionClick(event, e.ids)}
                            className="kategory__sort--selected"
                            style={
                              (e.status === 'Новий') ? { color: 'orange' } :
                                (e.status === 'Прийнято') ? { color: 'black' } :
                                  (e.status === 'Виконано') ? { color: 'green' } :
                                    (e.status === 'Скасовано') ? { color: 'red' } : null}
                          >
                            <option value="Новий" style={{color: 'orange'}}>Новий</option>
                            <option value="Прийнято" style={{color: 'black'}}>Прийнято</option>
                            <option value="Виконано" style={{color: 'green'}}>Виконано</option>
                            <option value="Скасовано" style={{color: 'red'}}>Скасовано</option>
                          </select>
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