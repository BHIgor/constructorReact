import React,{ useContext, useEffect, useMemo, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { Link, useParams } from 'react-router-dom';
import { Product } from '../../../Components/Product/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { animateScroll as scroll } from 'react-scroll';


import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay } from 'swiper/modules';

export const Kategory = () =>{
  const { dataDB } = useContext(ReactContext);
  const { catageryName } = useParams();
  const [sortedItems, setSortedItems] = useState([]);
  const [sortType, setSortType] = useState('');

  const allProducts =  useMemo(() =>(dataDB.length ===0 ) ? []: dataDB.products, [dataDB.length, dataDB.products])


  const scrollToTop = () => {
    scroll.scrollToTop({duration:20});
  };

  useEffect(() => {
    const filtered = (catageryName === 'Всі товари') ? allProducts :allProducts.filter(e => e.kategory === catageryName);
    setSortedItems(filtered);

  },[dataDB.products, catageryName, allProducts]);

  const uniqueCategories = new Set(allProducts.map(product => product.kategory));
  const uniquArray = Array.from(uniqueCategories);
  
  const sortByPrice = (order) => {
    const sorted = sortedItems.slice().sort((a, b) => (order === 'desc' ? ((b.price_discount === 0) ? b.price: b.price_discount) - ((a.price_discount === 0) ? a.price: a.price_discount) : ((a.price_discount === 0) ? a.price: a.price_discount) - ((b.price_discount === 0) ? b.price: b.price_discount)));
    setSortType(order);
    setSortedItems(sorted);
    console.log(sorted)
  };

  const sortByRating = (order) => {
    const sorted = sortedItems.slice().sort((a, b) => (order === 'asc' ? a.stars - b.stars : b.stars - a.stars));
    setSortType(order);
    setSortedItems(sorted);
  };

  const handleSortChange = (e) => {
    const selectedSortType = e.target.value;
    if (selectedSortType === 'priceAsc' || selectedSortType === 'priceDesc') {
      setSortType(selectedSortType);
      sortByPrice(selectedSortType === 'priceAsc' ? 'asc' : 'desc');
    } else if (selectedSortType === 'ratingAsc' || selectedSortType === 'ratingDesc') {
      setSortType(selectedSortType);
      sortByRating(selectedSortType === 'ratingAsc' ? 'asc' : 'desc');
    }
  };

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="kategory">
        <div className="kategory__container">

          <div className="kategory__header">

            <div className="kategory__title">
              {catageryName}
            </div>
          </div>
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            modules={[Autoplay]} 
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="kategory__slider"
          > 
          
              <SwiperSlide className='kategory__slider--item' >
                <Link 
                  to={`/Kategory/Всі товари?${dataDB.listBot[0].nameShop}`} className='kategory__slider--link'
                  style={{border: `1px solid ${dataDB.settings[0].clHeader}`}}
                >
                  Всі товари
                </Link>
              </SwiperSlide>
              { uniquArray.map((e, index) =>{
                return (
                  <SwiperSlide className='kategory__slider--item' key={index}  >
                    <Link 
                      to={`/Kategory/${e}?${dataDB.listBot[0].nameShop}`} className='kategory__slider--link'
                      style={{border: `1px solid ${dataDB.settings[0].clHeader}`}}
                    >
                      {e}
                    </Link>
                  </SwiperSlide>
                )
              })
            }
          </Swiper>

          <div className="kategory__sort">
            <Link to={`/Katalog?${dataDB.listBot[0].nameShop}`}    onClick={() =>scrollToTop()}  className="kategory__back" style={{backgroundColor: `${dataDB.settings[0].clButtonProduct}`}}>
              Назад
            </Link>
           <select 
            defaultValue={sortType} 
            onChange={handleSortChange} 
            className="kategory__sort--selected"
            >
              <option value="" disabled>Сортувати</option>
              <option value="priceAsc">За зростанням ціни</option>
              <option value="priceDesc">За спаданням ціни</option>
              <option value="ratingAsc">За зростанням рейтингу</option>
              <option value="ratingDesc">За спаданням рейтинга</option>
            </select>
          </div>
          
          <div>
           <Product products = {sortedItems}/>
          </div>
        </div>      
      </div>
     
    </>
    }
  </>
}