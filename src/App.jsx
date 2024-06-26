import { useEffect, useState } from 'react';
import './App.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ReactContext } from "./context/ReactContext"
import { Mainpage } from './Components/Mainpage/Mainpage';
import { Header } from './Components/Header/Header';
import { FooterLine } from './Components/FooterLine/FooterLine';
import { Menu } from './Components/Menu/Menu';
import { Settings } from './Components/Menu/Settings/Settings';
import { Personalization } from './Components/Menu/Personalization/Personalization';
import { Grafik } from './Components/Menu/Grafik/Grafik';
import { Obmin } from './Components/Menu/Obmin/Obmin';
import { Garant } from './Components/Menu/Garant/Garant';
import { About } from './Components/Menu/About/About';
import { Delivery } from './Components/Menu/Delivery/Delivery';
import { Pay } from './Components/Menu/Pay/Pay';
import { Contacts } from './Components/Menu/Contacts/Contacts';
import { Katalog } from './Components/Menu/Katalog/Katalog';
import { Kategory } from './Components/Menu/Katalog/Kategory';
import { AddProduct } from './Components/AddProduct/AddProduct';
import { EditProduct } from './Components/AddProduct/EditProduct/EditProduct';
import { SearchResult } from './Components/Mainpage/Search/SearchResult/SearchResult';
import { Orders } from './Components/Menu/Orders/Orders';
import { ProductPage } from './Components/Product/ProductPage/ProductPage';
import { Import } from './Components/Menu/Import/Import';
import { NoTarif } from './Components/Mainpage/NoTarif/NoTarif';

const search = window.location.search
const tg = window.Telegram.WebApp;

function App() {
  const [dataDB, setDataDB] = useState([]);
  const [menu, setMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try{
      fetch(`https://tgbazar.com.ua/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({nameShop: search.substring(1), idUser: tg?.initDataUnsafe?.user?.id  })
      })//tg?.initDataUnsafe?.user?.id
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setDataDB(data);
      });
    } catch (e) {
      return false;
    }
  }, [])

  const backButton = window.Telegram.WebApp.BackButton;;

  if(window.location.hash.includes('#/?')){
    backButton.hide();
  } else {
    backButton.show()
  }

  backButton.onClick(() => {
    navigate(-1);
  });

  console.log(dataDB)
  let idAdmin
  let activShop = []
  let activShopes = []
  if(dataDB.length !== 0){
    idAdmin = dataDB?.listBot[0]?.idAdmin
  
    activShop = dataDB?.admins?.filter(e => e.idUser === idAdmin)
    activShopes = dataDB?.listBot?.filter(e => e.idAdmin === idAdmin && e.activ !== 'stop')
  }

  return (
    <div className="app">
      <ReactContext.Provider value={{ dataDB, setDataDB }}>
      {
            (activShop[0]?.activ === 'no' || activShopes.length === 0) ? <>
               <NoTarif/>
            </> :
              <>
       <div className='footerTop' style={menu ? {overflowY:'hidden'}:null}>
        <Header setMenu={setMenu}/>
        <Menu setMenu={setMenu} menu={menu}/>
            <Routes>      
            <Route path='/' exact element={<Mainpage/>}/>
            <Route path='/Settings' exact element={<Settings/>}/>
            <Route path='/Personalization' exact element={<Personalization/>}/>
            <Route path='/Product/:productId' exact element={<ProductPage/>}/>
            <Route path='/Grafik' exact element={<Grafik/>}/>
            <Route path='/Obmin' exact element={<Obmin/>}/>
            <Route path='/Garant' exact element={<Garant/>}/>
            <Route path='/About' exact element={<About/>}/>
            <Route path='/Delivery' exact element={<Delivery/>}/>
            <Route path='/Pay' exact element={<Pay/>}/>
            <Route path='/Contacts' exact element={<Contacts/>}/>
            <Route path='/Katalog' exact element={<Katalog/>}/>
            <Route path='/Import' exact element={<Import/>}/>
            <Route path='/AddProduct' exact element={<AddProduct/>}/>
            <Route path='/Orders' exact element={<Orders/>}/>
            <Route path='/SearchResult' exact element={<SearchResult/>}/>
            <Route path='/EditProduct/:productId' exact element={<EditProduct/>}/>
            <Route path="/Kategory/:catageryName" element={<Kategory />} />
            
          </Routes>
        </div>
      

      <FooterLine setMenu={setMenu}/>
      </>
        }
        
      </ReactContext.Provider>
    </div>
  );
}

export default App;
