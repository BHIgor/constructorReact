import { useContext } from 'react';
import { ReactContext } from "../../../../context/ReactContext"


import './SearchResult.scss';
import { Product } from '../../../Product/Product';
import { Search } from '../Search';



export const SearchResult = ( ) =>{
  const { dataDB } = useContext(ReactContext);

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="searchResult">
        
        <Search/>

        <div className="searchResult--title">
          Результат пошуку
        </div>
        <div className="searchResult--container">
        {
          dataDB.search.length > 0 ?
          <Product  products = {dataDB.search} />
           : <div className='searchResult--title'>Нічого не знайдено</div>
        }
        </div>
        
        
      </div>
    </>
    }
  </>
}