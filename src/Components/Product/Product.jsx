import { useContext, } from 'react';
import { ReactContext } from "../../context/ReactContext"
//mport { animateScroll as scroll } from 'react-scroll';

import './Product.scss';

export const Product = ({ products }) => {
  const { dataDB } = useContext(ReactContext);

 /* const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };*/

  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="product">
        <div className='product__block'>

          <div className="product__container">
            {products.map(e => {
              const images = e.image.split(',')
              return (
                <div key={e.id} className='product__page'>
                  <div className='product__page--leftBlock'>
                    <div className='product__page--imgBlock'>
                      <img
                        src={images[0]}
                        alt='Нема фото'
                        className='product__page--image'
                      />
                    </div>

                    <div className="product__page--centerBlock">
                      <div className='product__page--title'>
                        {e.title}
                      </div>

                      <div className="product__page--info">
                        {(e.nayavno === 'yes') ? (<>
                          <div className='product__page--nalRegion product__page--nalBlock'>
                            <div className='product__page--nayavno'></div>
                            <div className='product__page--nal'>
                              Є в наявності
                            </div>
                          </div></>
                        ) : (<>
                          <div className='product__page--nalRegion product__page--noNalBlock'>
                            <div className='product__page--noNayavno'></div>
                            <div className='product__page--noNal'>
                              Немає в наявності
                            </div>
                          </div>
                        </>)}

                        <div className='product__review'>
                          Код: {e.id}
                        </div>
                      </div>


                      <div className="product__page--footer">
                        {
                          (e.price_discount === 0) ? (
                            <span className="product__page--priceDiscount">
                              {e.price} <span className="product__page--priceDiscount--simvol">₴</span>
                            </span>

                          ) : (<>
                            <span className="product__page--priceDiscount" style={{ color: 'red' }}>
                              {e.price_discount}
                              <span className="product__page--priceDiscount--simvol">
                                ₴
                              </span>
                            </span>
                            <span className="product__page--price" >
                              <span className="product__page--price--line">
                                {e.price}
                              </span>
                              <span className="product__page--price--simvol">
                                ₴
                              </span>
                              <span className="product__page--price--procent">-{Math.floor(100 - ((e.price_discount * 100) / e.price))}%</span>
                            </span>

                          </>)
                        }
                      </div>
                    </div>
                  </div>

                  <div className="product__page--rightBlock">
                    <div className="product__page--editBlock">
                      <div className="product__page--edit">

                      </div>
                    </div>

                    <div className="product__page--deleteBlock">
                      <div className="product__page--delete">
                        
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
    }
  </>
}