import { useContext } from 'react';
import { ReactContext } from "./../../context/ReactContext"

import './Mainpage.scss';

export const Mainpage = ({ setMenu }) =>{
  const { dataDB } = useContext(ReactContext);

  return <> 
    { (dataDB.length === 0) ? <div>Помилка</div> : <>
     fsdgdf
    </>
    }
  </>
}