import { useContext, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { animateScroll as scroll } from 'react-scroll';

import './ProductPage.scss';
import { Delivery } from '../../Menu/Delivery/Delivery';
import { Pay } from '../../Menu/Pay/Pay';
const tg = window.Telegram.WebApp;

export const ProductPage = () =>{
  const { dataDB} = useContext(ReactContext);
  const [desck, setDesck] = useState('opis')

  tg.ready()

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  }

  const { productId } = useParams();

  const selectedProduct = (dataDB.length === 0)? null :dataDB.products.filter(e => e.id === Number(productId))
  const images = (selectedProduct !== null)? selectedProduct[0].image.split(',') :[]

 

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className='productPage'>
        {
          selectedProduct.map(e => (
          <div key={e.id}>
            <div className='productPage__title'>{e.title}</div>
            <div className='productPage__titleInfo'>
              <div className="productPage__stars">
                <div className={`product__stars product__stars--star product__stars product__stars--star--${e.stars}`}></div>
                <div className={`product__stars product__stars--star product__stars product__stars--star--${e.stars}`}></div>
                <div className={`product__stars product__stars--star product__stars product__stars--star--${e.stars}`}></div>
                <div className={`product__stars product__stars--star product__stars product__stars--star--${e.stars}`}></div>
                <div className={`product__stars product__stars--star product__stars product__stars--star--${e.stars}`}></div>
              </div> 
              <div className="productPage__id">Код: {e.id}</div>
            </div>

            <div className="productPage__nal">
              {(e.nayavno === 'yes') ? (<>
                <div className='product__page--nalRegion product__page--nalBlock'>
                  <div className='product__page--nayavno'></div>
                  <div className='product__page--nal'>
                    Є в наявності
                  </div>
                </div></>
              ): (<>
                <div className='product__page--nalRegion product__page--noNalBlock'>
                  <div className='product__page--noNayavno'></div>
                  <div className='product__page--noNal'>
                    Немає в наявності
                  </div>
                </div>
              </>)}

             
            </div>

            <div className="productPage__image">
              <Swiper
                className='productPage__mySwipers' 
                pagination={true} 
                modules={[Pagination]} 
                >
                {images.map((e, index) => {
                  return (
                      <SwiperSlide key={index}><img src={e} alt='img-slider' style={{height: '255px',width:'auto'}} /></SwiperSlide>
                    )
                  })
                }
              </Swiper>
            </div>
            <div className="productPage__blockPrice">
              <div className="productPage__price">
              {
                (e.price_discount===0) ? (
                  <span className="productPage--priceDiscount">
                  {e.price}<span className="productPage--price--simvol">₴</span>
                  </span>

                ) : (<>
                    <span className="productPage--priceDiscount" style={{color: 'red'}}> 
                      {e.price_discount} 
                      <span className="productPage--priceDiscount--simvol">
                        ₴
                      </span>
                    </span>
                    <span className="productPage--price" >
                    <span className="productPage--price--line"> 
                      {e.price} 
                    </span>
                    <span className="productPage--price--simvol">
                      ₴
                    </span>
                    <span  className="productPage--price--procent">-{Math.floor(100 - ((e.price_discount * 100) / e.price))}%</span>
                    </span>

                </>)
                }
              </div> 

              <div className="productPage__buyBlock">
                <div 
                className="productPage__buy" 
                style={{backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}
                >
                  <Link  to={`/EditProduct/${e.id}?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className="productPage__buy--text">
                    Редагувати
                  </Link>
                </div>
                
              </div>
              
            </div>  

            <div className="productPage__description">
                <div className="productPage__description--titleBlock">
                  <div onClick={() => setDesck('opis')}
                  className="productPage__description--title"  style={(desck === 'opis') ?{borderBottom: `4px solid ${dataDB.settings[0].clHeader}`}:null}>
                    Опис
                  </div>

                  <div onClick={() => setDesck('dostavka')}
                  className="productPage__description--title"  style={(desck === 'dostavka') ?{borderBottom: `4px solid ${dataDB.settings[0].clHeader}`}:null}>
                    Доставка
                  </div>

                  <div onClick={() => setDesck('oplata')}
                  className="productPage__description--title" style={(desck === 'oplata') ?{borderBottom: `4px solid ${dataDB.settings[0].clHeader}`}:null}>
                    Оплата
                  </div>
                </div>
                
                <div className="productPage__description--text">
                  {
                    (desck === 'opis') ? <>
                    <div className="productPage__description--description">
                     {e.description}
                    </div>
                    </> : (desck === 'dostavka') ? <>
                      <div className="productPage__description--dostavka" >
                       <Delivery />
                      </div>
                    </> : (desck === 'oplata') ? <>
                    <div className="productPage__description--dostavka" >
                       <Pay />
                      </div>
                    </> : null
                  }
                </div> 


            </div>   

          </div>
          ))
        }
      </div>
    </>
    }
  </>
}