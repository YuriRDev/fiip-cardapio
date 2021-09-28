
import React, { useState, useEffect } from 'react';

import { Container } from './styles'

import ItemInfo from '../../Components/ItemInfo'
import CategoryName from '../../Components/CategoryHolder';

import { MdDirectionsBike } from 'react-icons/md'


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

import { Link } from 'react-router-dom'
import PedidoContainer from '../../Components/PedidoContainer';
import NotValid from '../../Assets/notValid';

import graphicLoading from '../../Assets/graphicLoading';
import DeliveryContainer from '../../Components/DeliveryContainer';

const Pedidos = () => {
  const { barname } = useParams<any>()

  const [color, setColor] = useState('rgb(193, 89, 3)')
  const [title, setTitle] = useState('')
  const [colorText, setTextColor] = useState('#fff')

  const [isPremium, setIsPremium] = useState(false)
  const [isDelivery, setIsDelivery] = useState(false)
  const [isDouble, setIsDouble] = useState(false)


  const [compraList, setCompraList] = useState([])
  const [deliveryList, setDeliveryList] = useState([])

  const [pageLoading, setPageLoading] = useState('loading')



  useEffect(() => {
    setPageLoading('loading')
    const nomeBar = String(barname).replaceAll('-', ' ')
    const getEventInfo = async () => {
      await api.post('/getBarByName', {
        name: nomeBar
      }).then(async (data: any) => {
        setTitle(data.data.title)
        setColor(data.data.color)

        setIsDelivery(data.data.isDelivery && data.data.deliveryActive)
        if (data.data.deliveryActive && data.data.isDelivery && data.data.isPremium && data.data.active) {
          setIsPremium(false)
        } else {
          setIsPremium(data.data.isPremium && data.data.active)
        }
        setIsDouble(data.data.deliveryActive && data.data.isDelivery && data.data.isPremium && data.data.active)

        setPageLoading('success')
        var result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.data.color);

        console.log(result)

        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16)

        if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
          setTextColor('#000')
          console.log("tem q ser preto")
        } else {
          setTextColor('#fff')
          console.log("tem q ser branco")
        }

        const token = localStorage.getItem('@Session')

        if (data.data.isPremium && data.data.active) {
          await api.post('/listOrders', {
            barId: data.data.id
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((datinha: any) => {
            setCompraList(datinha.data)
          }).catch(() => {
            console.log("nao foi possivel listar os items comprados!")
          })
        }

        if (data.data.isDelivery && data.data.deliveryActive) {
          await api.post('/deliveryList', {
            barId: data.data.id
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then((datinha: any) => {
            setDeliveryList(datinha.data)
            console.log(datinha.data)
          }).catch(() => {
            console.log("nao foi possivel listar os items comprados!")
          })
        }

      }).catch(() => {
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

          {/* HEADER FIXADO*/}
          <div
            style={{
              height: 48,
              width: '100%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: color,
            }}
          >


            <text
              style={{
                color: colorText,
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 16
              }}
            >{title}
            </text>

            <div
              style={{
                width: 18,
                height: 18,
                marginRight: 16
              }}
            />
          </div>


          {isDouble && (

            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginTop: 24
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `solid 2px ${isPremium ? color : COLORS.Inactive}`,
                  padding: '10px 20px',
                  borderRadius: 4,
                  color: isPremium ? color : COLORS.Dark,
                  flexDirection: 'column',
                  fontWeight: isPremium ? 500 : 400,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setIsDelivery(false)
                  setIsPremium(true)
                }}
              >
                <IoTicketOutline size={18} color={isPremium ? color : COLORS.Inactive} />
                No local
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `solid 2px ${isDelivery ? color : COLORS.Inactive}`,
                  padding: '10px 20px',
                  borderRadius: 4,
                  color: isDelivery ? color : COLORS.Dark,
                  flexDirection: 'column',
                  fontWeight: isDelivery ? 500 : 400,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setIsDelivery(true)
                  setIsPremium(false)
                }}
              >
                <MdDirectionsBike size={18} color={isDelivery ? color : COLORS.Inactive} />
                Delivery
              </div>
            </div>
          )}


          {/* BOTTOM NAVBAR */}
          {isPremium && (
            <div>
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
                <Link to={`/${barname}`} style={{ textDecoration: 'none' }} >

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <IoBookOutline size={24} color={'#545454'} />
                    <text
                      style={{
                        fontSize: 14,
                        color: '#545454'
                      }}
                    >Cardápio</text>
                  </div>
                </Link>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <IoTicketOutline size={24} color={color} />
                  <text
                    style={{
                      fontSize: 14,
                      color: color,
                      fontWeight: 500,

                    }}>Pedidos</text>
                </div>

              </div>

              {/* LISTA DE ITEMS*/}

              <div
                style={{
                  color: COLORS.Dark,
                  fontSize: 18,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 16,
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'column'

                }}
              >
                <div
                  style={{
                    display: 'flex'
                  }}
                >
                  <IoTicketOutline size={22} color={COLORS.Dark} style={{ marginRight: 8 }} />
                  Pedidos
                </div>
                <text
                  style={{
                    fontSize: 14,
                    color: COLORS.Inactive,
                    fontWeight: 400
                  }}
                >Ultimas 24 horas</text>
              </div>


              <div
                style={{
                  backgroundColor: 'rgb(243, 245, 247)',
                  width: '100%',
                  height: 15,
                  content: '',
                  backgroundSize: '40px 40px',
                  zIndex: 20,
                  marginTop: 8
                }}
              />

              <div
                style={{
                  width: '100%',
                  backgroundColor: ' rgb(243, 245, 247)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: 12,
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingBottom: 64
                }}
              >

                {compraList.map((item: any, index: number) => (
                  <PedidoContainer
                    items={item.items}
                    paymentMethod={(item.payment).toLowerCase()}
                    status={item.status}
                    total={item.total}
                    troco={item.troco}
                  />
                ))}

              </div>
            </div>
          )}

          {/* BOTTOM NAVBAR */}
          {isDelivery && (
            <div>
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
                <Link to={`/${barname}`} style={{ textDecoration: 'none' }} >

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <IoBookOutline size={24} color={'#545454'} />
                    <text
                      style={{
                        fontSize: 14,
                        color: '#545454'
                      }}
                    >Cardápio</text>
                  </div>
                </Link>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <IoTicketOutline size={24} color={color} />
                  <text
                    style={{
                      fontSize: 14,
                      color: color,
                      fontWeight: 500,

                    }}>Pedidos</text>
                </div>

              </div>

              {/* LISTA DE ITEMS*/}

              <div
                style={{
                  color: COLORS.Dark,
                  fontSize: 18,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: 16,
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'column'

                }}
              >
                <div
                  style={{
                    display: 'flex'
                  }}
                >
                  <IoTicketOutline size={22} color={COLORS.Dark} style={{ marginRight: 8 }} />
                  Delivery
                </div>
                <text
                  style={{
                    fontSize: 14,
                    color: COLORS.Inactive,
                    fontWeight: 400
                  }}
                >Ultimas 24 horas</text>
              </div>


              <div
                style={{
                  backgroundColor: 'rgb(243, 245, 247)',
                  width: '100%',
                  height: 15,
                  content: '',
                  backgroundSize: '40px 40px',
                  zIndex: 20,
                  marginTop: 8
                }}
              />

              <div
                style={{
                  width: '100%',
                  backgroundColor: ' rgb(243, 245, 247)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: 12,
                  paddingLeft: 24,
                  paddingRight: 24,
                  paddingBottom: 64
                }}
              >

                {deliveryList.map((item: any, index: number) => (
                  <DeliveryContainer
                    items={item.items}
                    paymentMethod={(item.payment).toLowerCase()}
                    status={item.status}
                    total={item.total + item.taxaDeEntrega}
                    troco={item.troco}
                    endereco={`${item.address}, ${item.number}, ${item.complemento}`}
                    taxaDeEntrega={item.taxaDeEntrega}
                  />
                ))}

              </div>
            </div>
          )}


          {!isPremium && !isDelivery && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 64,
                flexDirection: 'column'
              }}
            >
              <NotValid color={color} />
              <text
                style={{
                  marginTop: 24,
                  fontSize: 18,
                  color: COLORS.Inactive,
                  textAlign: 'center',
                }}
              >{title} não aceita <br />pedidos pelo site {`:(`}</text>
            </div>
          )}



        </Container >
      )
      }

      {
        pageLoading === "loading" && (
          <Container>
            {/* HEADER FIXADO*/}
            <div
              style={{
                height: 48,
                width: '100%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: COLORS.Inactive,
              }}
            >

              <text
                style={{
                  color: COLORS.Light,
                  fontWeight: 600,
                  fontSize: 14,
                  marginLeft: 16
                }}
              >{String(barname).replace('-', ' ')}
              </text>

              <div
                style={{
                  width: 18,
                  height: 18,
                  marginRight: 16
                }}
              />

            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                marginTop: 64,
                fontSize: 18,
                fontWeight: 500
              }}
            >
              <Lottie
                options={defaultOptions}
                height={80}
                width={80}
                isClickToPauseDisabled={true}
                speed={2}
                style={{
                  marginBottom: 24
                }}
              />
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

export default Pedidos;
