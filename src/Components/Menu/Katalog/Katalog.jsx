import { useContext } from 'react';
import { ReactContext } from "../../../context/ReactContext"

import './Katalog.scss'
import { Link } from 'react-router-dom';
import { Search } from '../../Mainpage/Search/Search';

export const Katalog = () =>{
  const { dataDB } = useContext(ReactContext);

  const allProducts = (dataDB.length === 0)? [] :dataDB.products

  const uniqueCategories = new Set(allProducts.map(product => product.kategory));
  const uniquArray = Array.from(uniqueCategories);

  const arrTag = [];

  for(let i = 0; i < uniquArray.length; i = i + 2){
      arrTag.push(<div className='katalog__block' key={i} >   
      { 
        (uniquArray[0] !== '') ?
        (uniquArray[i + 1] !== undefined) ?
          <div className="katalog__container">
            <Link  to={`/Kategory/${uniquArray[i]}?${dataDB.listBot[0].nameShop}`} className="katalog__item">
              {uniquArray[i]}  
            </Link>

            <Link to={`/Kategory/${uniquArray[i+1]}?${dataDB.listBot[0].nameShop}`}  className="katalog__item">
              {uniquArray[i + 1]}  
            </Link> 
          </div>  
        : 
        <div className="katalog__container" style={{gridTemplateColumns: '1fr'}}>
          <Link to={`/Kategory/${uniquArray[i]}?${dataDB.listBot[0].nameShop}`}  className="katalog__item">
            {uniquArray[i]}  
          </Link>
        </div> 
        :null 
      }
      
    </div>)
  }

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <Search/>
      <div className="titleText">Каталог</div>
      
      <div className='katalog'>
          <div className="katalog__allproduct">
            <Link  to={`/Kategory/Всі товари?${dataDB.listBot[0].nameShop}`} className="katalog__item katalog__item2">
                Всі товари
            </Link>
          </div>  
          
          {arrTag}
      </div>
    </>
    }
  </>
}