
import React, { useState, useEffect } from 'react';

import { Container } from './styles'

import ItemInfo from '../../Components/ItemInfo'
import CategoryName from '../../Components/CategoryHolder';


import Search from '../../Assets/search.svg'

import api from '../../api';

import DescriptionContainer from '../../Components/DescriptionContainer';
import Lottie from 'react-lottie';
import loading_loop from '../../Assets/loading_loop'

import CategoryList from '../../Components/CategoryList';
import VisibilitySensor from 'react-visibility-sensor'
import { useParams } from 'react-router-dom';
import InvalidBar from '../InvalidBar';
import COLORS from '../../colors';

import { IoTicketOutline, IoBookOutline } from 'react-icons/io5'

import FiipMenu from '../../Assets/fiipMenu.svg'
import FiipMenuPreto from '../../Assets/fiipMenuPreto.svg'

import graphicLoading from '../../Assets/graphicLoading';

import { Link } from 'react-router-dom'
import { useCount } from '../../Context/Count';

const Menu = () => {
  const { carrinhoPrice } = useCount()

  const { barname } = useParams<any>()
  const [showHeader, setShowHeader] = useState(false)
  const [showCategoria, setShowCategoria] = useState(false)

  const [color, setColor] = useState('rgb(193, 89, 3)')
  const [textColor, setTextColor] = useState('#fff')
  const [aberto, setAberto] = useState(true)
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [photo, setPhoto] = useState('')
  const [type, setType] = useState('')

  const [isPremium, setIsPremium] = useState(false)

  const [isItemsLoading, setIsItemLoading] = useState(true)

  const [items, setItems] = useState([])
  const [categorias, setCategorias] = useState([])

  const [categoriaSelected, setCategoriaSelected] = useState(0)

  const [pageLoading, setPageLoading] = useState('loading')


  useEffect(() => {
    setPageLoading('loading')
    setIsItemLoading(true)
    const nomeBar = String(barname).replaceAll('-', ' ')
    const getEventInfo = async () => {
      await api.post('/getBarByName', {
        name: nomeBar
      }).then(async (data: any) => {
        setAberto(data.data.open)
        setAddress(data.data.address)
        var result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.data.color);


        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16)

        if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
          setTextColor('#000')
        } else {
          setTextColor('#fff')
        }


        setTitle(data.data.title)
        setColor(data.data.color)
        setPhoto(data.data.photo_url)
        setType(data.data.type)


        setIsPremium((data.data.isPremium && data.data.active) || (data.data.deliveryActive && data.data.isDelivery))

        setPageLoading('success')
        await api.post('/listById', {
          "barId": data.data.id
        }).then((datazinha: any) => {
          setItems(datazinha.data)
          let categoriaTotal: any = []
          datazinha.data.map((item: any) => {
            categoriaTotal.push(item.categoria)
            return (0)
          })
          setCategorias(categoriaTotal)
          setIsItemLoading(false)
        }).catch(() => {

        })


      }).catch(() => {
        console.log("not found!")
        setPageLoading('error')
      })
    }
    const getSession = async () => {
      const session = localStorage.getItem('@Session')
      if (!session) {
        await api.post("/session").then((data) => {
          localStorage.setItem('@Session', data.data.token)
        })
      }
    }

    getSession()
    getEventInfo()
  }, [barname])

  window.addEventListener('scroll', (event) => {
    if (window.pageYOffset >= 80) {
      setShowHeader(true)
      if (window.pageYOffset >= 145) {
        setShowCategoria(true)
      } else {
        setShowCategoria(false)
      }
    } else {
      setShowHeader(false)
      setShowCategoria(false)
    }

  })

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: graphicLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },

  };
  return (

    <div>
      {pageLoading === "success" && (
        <Container>

          {/* HEADER */}
          <div>
            {/* TITULO */}
            <div
              style={{
                height: 50,
                width: '100%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <img
                alt=""
                src={textColor === '#fff' ? FiipMenu : FiipMenuPreto}
                style={{ marginTop: 15, height: 40, width: 90, marginLeft: 18 }}
              />
            </div>
            <div
              style={{
                width: '100%',
                position: 'relative'
              }}
            >
              {/* IMAGEM E TEXTO */}
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: 70,
                  backgroundColor: color,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  padding: '0px 28px 40px'
                }}
              >

                <div
                  style={{
                    position: 'absolute',
                    top: 10
                  }}
                >
                  <img
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: 'contain',
                      borderRadius: 100,
                      border: `solid ${COLORS.Light} 5px`
                    }}
                    alt=""
                    src={photo}
                  />
                </div>

              </div>
              {/* DESCRICAO */}
              <DescriptionContainer
                address={address}
                aberto={aberto}
                type={type}
              />
            </div>

            {/* CATEGORIAS */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 72,
                margin: '8px 0px 0px',
                overflow: 'scroll hidden',
                borderTop: '1px solid rgb(232, 234, 237)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'initial',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgb(255, 255, 255)'
              }}
            >
              {/* LISTA DE CATEGORIAS */}
              <CategoryList
                categoriaSelected={categoriaSelected}
                categorias={categorias}
                color={color}
                onClick={(e: number) => {
                  setCategoriaSelected(e)
                }}
              />
            </div>



          </div>

          {/* HEADER FIXADO*/}
          {showHeader && (
            <div
              style={{
                height: 48,
                width: '100%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                backgroundColor: color,
                zIndex: 100,
                top: 0
              }}
            >


              <text
                style={{
                  color: textColor,
                  fontWeight: 600,
                  fontSize: 14,
                  marginLeft: 16
                }}
              >{title}
              </text>


            </div>
          )}

          {/* CATEGORIA FIXADA*/}
          {showCategoria && (
            < div
              style={{
                width: '100%',
                height: 72,
                margin: '8px 0px 0px',
                overflow: 'scroll hidden',
                borderTop: '1px solid rgb(232, 234, 237)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'initial',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgb(255, 255, 255)',
                position: 'fixed',
                top: 40,
                left: 0,
                zIndex: 100,
              }}
            >

              {/* LISTA DE CATEGORIAS */}
              <CategoryList
                color={color}
                onHeader={true}
                categoriaSelected={categoriaSelected}
                categorias={categorias}
                onClick={(e: number) => {
                  setCategoriaSelected(e)
                }}
              />
            </div>
          )}

          {/* BOTTOM NAVBAR */}

          {isPremium && (
            <div
              style={{
                width: '100%',
                height: 58,
                backgroundColor: COLORS.Light,
                position: 'fixed',
                bottom: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderTop: `solid 2px ${color}`

              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <IoBookOutline size={24} color={color} />
                <text
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: color
                  }}
                >Cardápio</text>
              </div>

              <Link to={`/${barname}/pedidos`} style={{ textDecoration: 'none' }} >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <IoTicketOutline size={24} color={'#545454'} />
                  <text
                    style={{
                      fontSize: 14,
                      color: '#545454'
                    }}>Pedidos</text>
                </div>
              </Link>

            </div>
          )}

          {/* LISTA DE ITEMS*/}
          {!isItemsLoading &&
            items.map((item: any, index: number) => (
              <div
                key={item.categoriaId}
                style={{
                  marginTop: -16,
                  zIndex: 10,
                  position: 'relative'
                }}
              >



                {index === 0 && (
                  <div
                    style={{
                      backgroundColor: 'rgb(243, 245, 247)',
                      width: '100%',
                      height: 15,
                      content: '',
                      backgroundSize: '40px 40px',
                      zIndex: 20,
                    }}
                  />
                )}
                {index > 0 && (
                  <div
                    style={{ marginTop: 16 }}
                  />
                )}
                <div
                  id={item.categoria}
                >
                  <VisibilitySensor
                    offset={{
                      bottom: 400
                    }}
                    onChange={(e) => {
                      if (index === items.length - 1) {
                      } else {
                        if (e) {
                          setCategoriaSelected(index)
                          document.getElementById(`${item.categoria}c`)?.scrollIntoView()
                        }
                      }
                    }}
                  >
                    <CategoryName
                      name={item.categoria}
                    />
                  </VisibilitySensor>

                </div>
                {item.items.map((item: any, index: number) => (
                  <Link to={`/${barname}/item/${item.id}`} key={item.id} style={{ textDecoration: 'none' }} >
                    <ItemInfo
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      image={item.photo_url}
                    />
                  </Link>
                ))}

              </div>
            ))
          }

          {isItemsLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 32,
                flexDirection: 'column'
              }}
            >
              <Lottie
                options={defaultOptions}
                height={80}
                width={80}
                isClickToPauseDisabled={true}
                speed={2}
              />
              Carregando...
            </div>
          )}

          <div
            style={{
              height: 32,
              width: '100%',
              marginBottom: 32
            }}
          />


          {/* BOTAO DE CARRINHO */}
          <div style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            position: 'fixed',
            bottom: carrinhoPrice > 0 ? 70 : -50,
            zIndex: 100,
            display: 'flex',
            opacity: carrinhoPrice > 0 ? 1 : 0,
            transition: '.2s',
          }}>
            <Link to={`/${barname}/carrinho`} style={{ textDecoration: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  backgroundColor: color,
                  height: '100%',
                  width: '80%',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0px 16px',
                  boxShadow: '0px 1px 3px rgb(0 0 0 / .5)'
                }}
              >
                <text
                  style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >Carrinho</text>
                <text
                  style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >R$ {Number(carrinhoPrice).toFixed(2).replaceAll('.', ',')}</text>
              </div>
            </Link>

          </div>

        </Container >
      )
      }

      {
        pageLoading === "loading" && (
          <Container>
            {/* HEADER */}
            <div>
              {/* TITULO */}
              <div
                style={{
                  height: 50,
                  width: '100%',
                  backgroundColor: COLORS.Inactive,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <img
                  alt=""
                  src={FiipMenu}
                  style={{ marginTop: 15, height: 40, width: 90, marginLeft: 18 }}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  position: 'relative'
                }}
              >
                {/* IMAGEM E TEXTO */}
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: 70,
                    backgroundColor: COLORS.Inactive,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    padding: '0px 28px 40px'
                  }}
                >

                  <div
                    style={{
                      position: 'absolute',
                      top: 10
                    }}
                  >
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        objectFit: 'contain',
                        borderRadius: 100,
                        border: `solid ${COLORS.Light} 5px`
                      }}
                    />
                  </div>

                </div>
                {/* DESCRICAO */}
                <DescriptionContainer
                  address={'...'}
                  aberto={false}
                  type={'...'}
                />
              </div>

              {/* CATEGORIAS */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 72,
                  margin: '8px 0px 0px',
                  overflow: 'scroll hidden',
                  borderTop: '1px solid rgb(232, 234, 237)',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'initial',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'rgb(255, 255, 255)'
                }}
              >
                {/* LISTA DE CATEGORIAS */}


              </div>



            </div>

          </Container>
        )
      }

      {
        pageLoading === "error" && (
          <InvalidBar />
        )
      }

    </div >

  );
}

export default Menu;
