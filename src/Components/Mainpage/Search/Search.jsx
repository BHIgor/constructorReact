import { useContext, useEffect, useRef, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import { Link, useNavigate } from 'react-router-dom';

import './Search.scss'

export const Search = ( ) =>{
  const { dataDB, setDataDB} = useContext(ReactContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isClickedOutside, setIsClickedOutside] = useState(false);
  const [key, setKey] = useState(0)
  const blockRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setKey(0)

    if (query === '') {
        setSearchResults([]);
        setDataDB({...dataDB, search: []})
    } else {
      setSearchResults(dataDB.products.filter(product =>
          product.title.toLowerCase().startsWith(query.toLowerCase()) ||
          product.id === Number(query)
      ));
      setDataDB({...dataDB, search: dataDB.products.filter(product =>
        product.title.toLowerCase().startsWith(query.toLowerCase()) ||
        product.id === Number(query)
    )} )
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {

      navigate('/SearchResult');
    }
  };

  useEffect(() => {

    const handleClickOutside = (event) => {
     
      if (blockRef.current && !blockRef.current.contains(event.target) && key === 0) {
        setIsClickedOutside(true);
      

      } else {
        setIsClickedOutside(false); 
      }
    };


    document.addEventListener('click', handleClickOutside);


    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [searchResults, key]); 

  const blockClass = isClickedOutside ? 'main__search--resultNone' :'main__search--result' ;
  
  console.log(searchResults)

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="main__search"> 
        <div className="main__search--flexBlock">
          <div className="main__search--icon"></div>
            <input 
            className="main__search--input"
            defaultValue={searchQuery}
            onChange={handleSearch}
            onClick={() => {
              setKey(1)
              setIsClickedOutside(false)
            } }
            onKeyPress={handleKeyPress}
            placeholder="Введіть назву або код товару ..."
            />

          <Link to={`/SearchResult?${dataDB.listBot[0].nameShop}`}
            className={searchResults.length === 0 ? "main__search--buttonNone": "main__search--button"}
            style={{color: `${dataDB.settings[0].clTitle}`, backgroundColor: `${dataDB.settings[0].clHeader}`}}
            >
            Пошук
          </Link>
        </div>
          
      <div  ref={blockRef} className={blockClass}>
        {

          searchResults.slice(0,5).map(e => {
            const images = e.image.split(',')
            return (
              <Link  to={`/SearchResult?${dataDB.listBot[0].nameShop}`}  className="main__search--resultFlex" key={e.id}>
                <div className="main__search--resultBlockImg">
                  <img src={images[0]} alt="Фото пошуку" className="main__search--resultImg"/>
                </div>

                <div className="main__search--resultItem">
                  {e.title}
                </div>
              </Link>
              
            )
          })
    
        }
      
        </div>
      </div>
    </>
    }
  </>
}