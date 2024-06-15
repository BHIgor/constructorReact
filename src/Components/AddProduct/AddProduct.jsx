import { useContext, useRef, useState } from 'react';
import { ReactContext } from "../../context/ReactContext"
import { animateScroll as scroll } from 'react-scroll';

import './AddProduct.scss';

export const AddProduct = () => {
  const { dataDB, setDataDB } = useContext(ReactContext);
  const [status, setStatus] = useState('no')
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [blockDiscount, setBlockDiscount] = useState(false)

  const [title, setTitle] = useState('')
  const [arrImg, setArrImg] = useState([])
  const [category, setCategory] = useState('Без категорії')
  const [description, setDescription] = useState('')
  const [nayav, setNayav] = useState('yes')
  const [star, setStar] = useState('5')
  const [top, setTop] = useState('yes')
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState(0)

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    setCategory(value)
    if (value === 'other') {
      setIsOtherCategory(true);
    } else {
      setIsOtherCategory(false);
    }
  };


  const handleOtherCategoryChange = (event) => {
    setOtherCategory(event.target.value);
    setCategory(event.target.value);

  };

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handlePrice = (event) => {
    setPrice(event.target.value);
  };

  const handleDiscount = (event) => {
    setDiscount(event.target.value);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await uploadToImgBB(file);
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadToImgBB = async (file) => {

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=60cda1ca7c5538c9a8a026499beff8ad', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setArrImg([...arrImg, data.data.url])

    } else {
      throw new Error('Upload failed');
    }
  };

  const deleteImg = (e) => {
    const newPhoto = arrImg.filter((item, i) => i !== e)
    setArrImg(newPhoto);
  }

  const allProducts = (dataDB.length === 0) ? [] : dataDB.products

  const uniqueCategories = new Set(allProducts.map(product => product.kategory));
  const uniquArray = Array.from(uniqueCategories);



  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 20 });
  };

  const sendChange = () => {
    scrollToTop()

    setTitle('')
    setArrImg([])
    setCategory('Без категорії')
    setDescription('')
    setNayav('yes')
    setStar('5')
    setTop('yes')
    setPrice(0)
    setDiscount(0)
   
  
    try {
      fetch(`https://tgconstructor.com.ua/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          operation: 'Додавання товару',
          nameShop: dataDB.listBot[0].nameShop,
          title:title,
          image: arrImg.join(','),
          category: category,
          description:description,
          nayav:nayav,
          star:star,
          top:top,
          price:price,
          discount:discount
        })
      })
        .then((response) => {
          setStatus('ok')
          setDataDB(prevState => ({
            ...dataDB, products: [...prevState.products, {id:dataDB.products.length,title:title,image:arrImg.join(','),kategory:category,description:description,nayavno:nayav,stars:star,top:top,price:price,price_discount:discount}]
          }))
          setTimeout(() => {
            setStatus('no')
          }, 5000)
          return response.json();
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


  return <>
    {(dataDB.length === 0) ? <div>Помилка</div> : <>
      <div className="addProduct">
        <div className="addProduct__title">
          Додавання товару
        </div>

        {
          (status === 'ok') ?
            <div className="settings__statusOk">
              Товар доданий
            </div> : null
        }
        {
          (status === 'err') ?
            <div className="settings__statusFail">
              Помилка. Зверніться в тех. підтримку
            </div> : null
        }


        <div className="addProduct__container">
          <div className="addProduct__body">

            <div className="addProduct__body--border">
              <div className="addProduct__body--title">
                Назва товару
              </div>

              <input
                className="addProduct__body--text"
                onChange={handleTitle}
                value={title}
                placeholder='Введіть назву товару'
              />

              <div className="addProduct__body--title">
                Фото товару
              </div>

              <div className="addProduct__slider" style={(arrImg.length === 0) ? { display: 'none' } : null}>
                {
                  arrImg.map((e, index) => {
                    return (<div key={index}>
                      <div className="addProduct__slider--block">
                        <div
                          className="addProduct__slider--blockIcon"
                          onClick={() => deleteImg(index)}
                        >
                          <div className="addProduct__slider--icon"></div>
                        </div>

                        <img src={e} alt="Фото слайдера" className='addProduct__slider--img' ></img>
                      </div>

                    </div>
                    )
                  })

                }
              </div>

              <div className="addProduct__slider--addPhotoBlock">
                <button
                  className="addProduct__slider--addPhoto"
                  style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                  onClick={handleButtonClick}
                  disabled={uploading}
                >
                  {uploading ? 'Завантаження...' : 'Додати фото'}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden-file-input"
                />
              </div>

              <div className="addProduct__body--title">
                Категорія
              </div>

              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="addProduct__body--select"
              >
                <option
                  value=""
                  disabled
                  className="addProduct__body--option"
                >Виберіть категорію</option>
                {uniquArray.map((category, index) => (
                  <option
                    style={{ cursor: 'pointer' }}
                    key={index}
                    value={category}
                    className="addProduct__body--option"
                  >{category}</option>
                ))}
                <option value="other" className="addProduct__body--option">Інша категорія</option>
              </select>
              {isOtherCategory && (
                <input
                  type="text"
                  value={otherCategory}
                  className="addProduct__body--text addProduct__body--marginT"
                  onChange={handleOtherCategoryChange}
                  placeholder="Введіть нову категорію"
                />
              )}

              <div className="addProduct__body--title">
                Опис товару
              </div>

              <textarea
                className="addProduct__body--textAr"
                onChange={handleDescription}
                value={description}
                placeholder='Введіть опис товару...'
              />

              <div className="addProduct__body--title">
                Наявність
              </div>

              <div className="addProduct__body--nayavBlock">
                <div className="addProduct__body--nayavFlex" onClick={() => setNayav('yes')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(nayav === 'yes') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--nayavText">
                    Є в наявності
                  </div>
                </div>

                <div className="addProduct__body--nayavFlex addProduct__body--noNayav" onClick={() => setNayav('no')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(nayav === 'no') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--noNayavText">
                    Немає в наявності
                  </div>
                </div>
              </div>

              <div className="addProduct__body--title">
                Рейтинг
              </div>

              <div className="addProduct__body--starBlock">
                <div className="addProduct__body--starFlex" onClick={() => setStar('5')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(star === '5') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                </div>

                <div className="addProduct__body--starFlex" onClick={() => setStar('4')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(star === '4') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                </div>

                <div className="addProduct__body--starFlex" onClick={() => setStar('3')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(star === '3') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                </div>

                <div className="addProduct__body--starFlex" onClick={() => setStar('2')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(star === '2') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--star"></div>
                  <div className="addProduct__body--star"></div>
                </div>

                <div className="addProduct__body--starFlex" onClick={() => setStar('1')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(star === '1') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--star"></div>
                </div>
              </div>

              <div className="addProduct__body--title">
                Топ продажу
              </div>

              <div className="addProduct__body--nayavBlock">
                <div className="addProduct__body--nayavFlex" onClick={() => setTop('yes')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(top === 'yes') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--nayavText">
                    Так
                  </div>
                </div>

                <div className="addProduct__body--nayavFlex addProduct__body--noNayav" onClick={() => setTop('no')}>
                  <div
                    className="addProduct__body--starInput"
                    style={(top === 'no') ? { backgroundColor: dataDB.settings[0].clButtonProduct } : null}

                  ></div>
                  <div className="addProduct__body--noNayavText">
                    Ні
                  </div>
                </div>
              </div>



              <div className="addProduct__body--title">
                Ціна (грн.)
              </div>

              <input
                className="addProduct__body--text"
                onChange={handlePrice}
                value={price}
                type='number'
                placeholder='Введіть ціну товара'
              />

              <div className="addProduct__body--discountBlock">
                <div
                  className="addProduct__body--discount"
                  style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                  onClick={() => setBlockDiscount(true)}
                >
                  Додати знижку
                </div>
              </div>

              {blockDiscount && (
                <>
                  <div className="addProduct__body--title">
                    Ціна зі знижкою (грн.)
                  </div>

                  <input
                    className="addProduct__body--text"
                    onChange={handleDiscount}
                    value={discount}
                    type='number'
                    placeholder='Введіть 0 якщо знижка не потрібна'
                  />
                </>
              )
              }
              <button
                className="addProduct__body--submit "
                style={{ backgroundColor: dataDB.settings[0].clButtonProduct }}
                disabled={(title === '') ? true : false}
                onClick={() => sendChange()}
              >
                Додати товар
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
    }
  </>
}