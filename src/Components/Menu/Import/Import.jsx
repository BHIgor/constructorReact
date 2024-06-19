import { useContext, useRef, useState } from 'react';
import { ReactContext } from "../../../context/ReactContext"
import * as XLSX from 'xlsx';
import './Import.scss';
import { animateScroll as scroll } from 'react-scroll';

export const Import = ({ setMenu }) => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const [type, setType] = useState('Excel')
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [objKeys, setObjKeys] = useState([])
  const [excelData, setExcelData] = useState([]);

  const [title, setTitle] = useState('Без назви')
  const [image, setImage] = useState('Без фото')
  const [kategory, setKategory] = useState('Без категорії')
  const [description, setDescription] = useState('Без опису')
  const [nayavno, setNayavno] = useState('yes')
  const [price, setPrice] = useState('Без ціни')

  const handleSelectPrice = (event) => {
    setPrice(event.target.value)
  };

  const handleSelectNayavno = (event) => {
    setNayavno(event.target.value)
  };

  const handleSelectDescription = (event) => {
    setDescription(event.target.value)
  };

  const handleSelectKategory = (event) => {
    setKategory(event.target.value)
  };

  const handleSelectImage = (event) => {
    setImage(event.target.value)
  };

  const handleSelectTitle = (event) => {
    setTitle(event.target.value)
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };


  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };


  const sendChange = () => {
    scrollToTop()
    const maxId = dataDB.products.reduce((maxId, item) => (item.id > maxId ? item.id : maxId), 0);

    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Імпорт excel',
          nameShop: dataDB.listBot[0].nameShop,
          title: (title === 'Без назви') ? 'Без назви' : title,
          image: (image === 'Без фото') ? 'Без фото' : image,
          kategory: (kategory === 'Без категорії') ? 'Без категорії' : kategory,
          description: (description === 'Без опису') ? 'Без опису' : description,
          nayavno: nayavno,
          price: (price === 'Без ціни') ? 0 : price,
          excelData: excelData,

        })
      })
        .then((response) => {

          return response.json();
        })
        .then((data) => {

          excelData.map((e, index) => setDataDB(prevState => ({
            ...dataDB, products: [...prevState.products, {
              id: maxId + 1 + index,
              title: (title === 'Без назви') ? 'Без назви' : e[title],
              image: (image === 'Без фото') ? 'Без фото' : e[image],
              kategory: (kategory === 'Без категорії') ? 'Без категорії' : e[kategory],
              description: (description === 'Без опису') ? 'Без опису' : e[description],
              nayavno: nayavno,
              stars: 5,
              top: 'no',
              price: (price === 'Без ціни') ? 0 : Number(e[price]),
              price_discount: 0
            }]
          }))
          )

          setStatus('ok')
          setExcelData([]);
          setTimeout(() => {
            setStatus('no')
          }, 5000)


        })
        .catch(e => {
          setStatus('err')

          setTimeout(() => {
            setStatus('no')
          }, 5000)

          console.log(e)
          return false
        })

    } catch (e) {
      return false;
    }
  }

  /*
    const [xmlText, setXmlText] = useState('');
    const [parsedData, setParsedData] = useState(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const xml = e.target.result;
        setXmlText(xml);
        parseXML(xml);
      };
  
      reader.readAsText(file);
    };
  
    const parseXML = (xml) => {
      try {
        const parsed = new XMLParser().parseFromString(xml);
        setParsedData(parsed);
      } catch (error) {
        console.error('Error parsing XML:', error);
        setParsedData(null);
      }
    };
  */


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploading(true);
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Преобразование массива данных в объект
          if (jsonData.length > 1) {
            const headers = jsonData[0];
            const rows = jsonData.slice(1);

            const formattedData = rows.map(row => {
              let obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index];
              });
              return obj;
            });

            setExcelData(formattedData);
            setObjKeys(Object.keys(formattedData[0]))

          } else {
            // Если данных нет или они некорректны, сбросить excelData
            setExcelData([]);
          }
        };

        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setUploading(false);
      }

    }
  };

  console.log(kategory)
  console.log(title)
  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="import">
        <div className="settings__title">
          Імпорт товарів
        </div>

        {
          (status === 'ok') ?
            <div className="settings__statusOk">
              Імпорт успішно завершений
            </div> : null
        }
        {
          (status === 'err') ?
            <div className="settings__statusFail">
              Помилка. Зверніться в тех. підтримку
            </div> : null
        }

        <div className="settings__container">
          <div className="settings__body">
            <div className="import__body--border">
              <div className="settings__body--title import__subTitle">
                Завантажте excel файл
              </div>

              <div className="import__typeFileBlock">
                <div
                  className="import__typeFileBlock--typeFile"
                  style={(type === 'Excel') ? { backgroundColor: dataDB.settings[0].clButtonProduct, border: '2px solid black' } : { backgroundColor: dataDB.settings[0].clButtonProduct }}
                  onClick={() => setType('Excel')}
                >
                  Excel .xls .xlsx
                </div>

               
              </div>

              {
                (type === 'Excel') ?
                  <>
                    <div className="import__excel">
                

                      <div className="import__excel--button">
                        <button
                          className="addProduct__slider--addPhoto"
                          style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                          onClick={handleButtonClick}
                          disabled={uploading}
                        >
                          {uploading ? 'Завантаження...' : 'Вибрати файл'}
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".xls, .xlsx"
                          onChange={handleFileChange}
                          className="hidden-file-input"
                        />
                      </div>


                      {(excelData.length > 0) ?
                        <>
                          <div className="import__data">
                            <div className="import__data--count">
                              Знайдено {excelData.length} позицій
                            </div>

                            <div className="import__data--subtitle">
                              Встановіть відповідність колонок файлу
                            </div>

                            <div className="import__columns">
                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Назва товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={title}
                                      className="import__columns--select"
                                      onChange={handleSelectTitle}
                                    >
                                      <option value='Без назви'>
                                        Без назви
                                      </option>

                                      {objKeys.map((e, index) =>
                                        <option value={e} key={index}>{e}</option>

                                      )
                                      }

                                    </select>
                                  }
                                </div>
                              </div>

                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Фото товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={image}
                                      className="import__columns--select"
                                      onChange={handleSelectImage}
                                    >
                                      <option value='Без фото'>
                                        Без фото
                                      </option>

                                      {objKeys.map((e, index) =>
                                        <option value={e} key={index}>{e}</option>

                                      )
                                      }

                                    </select>
                                  }
                                </div>
                              </div>

                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Категорія товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={kategory}
                                      className="import__columns--select"
                                      onChange={handleSelectKategory}
                                    >
                                      <option value='Без категорії'>
                                        Без категорії
                                      </option>

                                      {objKeys.map((e, index) =>
                                        <option value={e} key={index}>{e}</option>

                                      )
                                      }

                                    </select>
                                  }
                                </div>
                              </div>

                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Опис товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={description}
                                      className="import__columns--select"
                                      onChange={handleSelectDescription}
                                    >
                                      <option value='Без опису'>
                                        Без опису
                                      </option>

                                      {objKeys.map((e, index) =>
                                        <option value={e} key={index}>{e}</option>

                                      )
                                      }

                                    </select>
                                  }
                                </div>
                              </div>

                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Наявність товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={nayavno}
                                      className="import__columns--select"
                                      onChange={handleSelectNayavno}
                                    >
                                      <option value='Є в наявності'>
                                        Є в наявності
                                      </option>

                                      <option value='Немає в наявності'>
                                        Немає в наявності
                                      </option>

                                    </select>
                                  }
                                </div>
                              </div>

                              <div className="import__columns--flex">
                                <div className="import__columns--text">
                                  Ціна товара
                                </div>

                                <div className="import__columns--value">
                                  {
                                    <select
                                      value={price}
                                      className="import__columns--select"
                                      onChange={handleSelectPrice}
                                    >
                                      <option value='Без ціни'>
                                        Без ціни
                                      </option>

                                      {objKeys.map((e, index) =>
                                        <option value={e} key={index}>{e}</option>

                                      )
                                      }

                                    </select>
                                  }
                                </div>
                              </div>

                            </div>
                          </div>


                          <button
                            className="settings__body--submit import__start"
                            style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                            onClick={() => sendChange()}
                          >
                            Застосувати
                          </button>
                        </>
                        : null
                      }
                    </div>
                  </> : null
              }







              {

            /*
         
              <input type="file" accept=".xml" onChange={handleFileChange} />
              <div style={{ marginTop: '20px' }}>
                <h2>XML Content:</h2>
                <pre>{xmlText}</pre>
              </div>
              <div style={{ marginTop: '20px' }}>
                <h2>Parsed Data:</h2>
                {parsedData ? (
                  <pre>{JSON.stringify(parsedData, null, 2)}</pre>
                ) : (
                  <p>No data parsed yet. Upload an XML file above.</p>
                )}
              </div>
  */}

            </div>
          </div>
        </div>
      </div>
    </>
    }
  </>
}