import { useContext, useEffect, useMemo, useState, } from 'react';
import { ReactContext } from "../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';
import './Product.scss';
import { Link } from 'react-router-dom';

export const Product = ({ products }) => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [copyProducts, setCopyProducts ] = useState([])

  const allProducts =  useMemo(() =>(dataDB.length ===0 ) ? []: dataDB.products, [dataDB.length, dataDB.products])

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  }

  const sendChange = (id) => {

    const newProducts = copyProducts.filter(item => item.id !== id);
    setCopyProducts(newProducts);

    try{
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Видалення товару', 
          nameShop: dataDB.listBot[0].nameShop,
          id: id,
        })
      })
      .then((response) => {
        setDataDB(prevState => ({...dataDB,  products: newProducts}))
        return response.json();
      })
      .catch(e =>{
        console.log(e)
        return false
      })

    } catch (e) {
      return false;
    }
  } 


  useEffect(() => {
    setCopyProducts(allProducts)
    
  }, [dataDB.length, allProducts])


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
                      <Link  
                        to={`/Product/${e.id}?${dataDB.listBot[0].nameShop}`}
                        className='product__page--title'>
                        {e.title}
                      </Link>

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
                    <Link  to={`/EditProduct/${e.id}?${dataDB.listBot[0].nameShop}`} onClick={() =>scrollToTop()} className="product__page--editBlock">
                      <div className="product__page--edit">

                      </div>
                    </Link>

                    <div 
                      className="product__page--deleteBlock"
                      onClick={() => sendChange(e.id)}
                    >
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