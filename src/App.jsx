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


  return (
    <div className="app">
      <ReactContext.Provider value={{ dataDB, setDataDB }}>
       <div className='footerTop' style={menu ? {overflowY:'hidden'}:null}>
        <Header setMenu={setMenu}/>
        <Menu setMenu={setMenu} menu={menu}/>
            <Routes>      
            <Route path='/' exact element={<Mainpage/>}/>
            <Route path='/Settings' exact element={<Settings/>}/>
            <Route path='/Personalization' exact element={<Personalization/>}/>
            <Route path='/Grafik' exact element={<Grafik/>}/>
            <Route path='/Obmin' exact element={<Obmin/>}/>
            <Route path='/Garant' exact element={<Garant/>}/>
            <Route path='/About' exact element={<About/>}/>
            <Route path='/Delivery' exact element={<Delivery/>}/>
            <Route path='/Pay' exact element={<Pay/>}/>
            <Route path='/Contacts' exact element={<Contacts/>}/>
           
            
          </Routes>
        </div>

      <FooterLine setMenu={setMenu}/>
      
        
      </ReactContext.Provider>
    </div>
  );
}

export default App;
