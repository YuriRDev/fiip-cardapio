
import React, { useState, useEffect } from 'react';

import { Container } from './styles'


import Search from '../../Assets/search.svg'

import api from '../../api';
import { TextField, ThemeProvider, createTheme, InputBase } from '@material-ui/core';

import Lottie from 'react-lottie';
import loading_loop from '../../Assets/loading_loop'

import { useParams } from 'react-router-dom';
import InvalidBar from '../InvalidBar';
import COLORS from '../../colors';

import { BiArrowBack } from 'react-icons/bi'

import { IoMdArrowRoundBack } from 'react-icons/io'

import { Link } from 'react-router-dom'
import { useCount } from '../../Context/Count';

import graphicLoading from '../../Assets/graphicLoading';

import { BiCheck } from 'react-icons/bi'
import AdicionalContainer from '../../Components/AdicionalContainer';

const ItemInfoPage = () => {
  const { barname, item } = useParams<any>()

  const { handleAddCarrinho } = useCount()

  const [color, setColor] = useState('rgb(193, 89, 3)')

  const [textColor, setTextColor] = useState('#fff')

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [photo, setPhoto] = useState('')
  const [obs, setObs] = useState('')

  const [adicionais, setAdicionais] = useState([])

  const [isPremium, setIsPremium] = useState(false)
  const [allowObs, setAllowObs] = useState(false)

  const [quantidade, setQuantidade] = useState(1)

  const [pageLoading, setPageLoading] = useState('loading')

  const [adicionalList, setAdicionalList] = useState<any>([])
  const [adicionalTotalPrice, setAdicionalTotalPrice] = useState(0)

  const theme = createTheme({
    palette: {
      primary: {
        main: '#C4C4C4',
      },
      secondary: {
        main: COLORS.PrimaryMinusOne
      }
    },
    shape: {
      borderRadius: 5
    },

  })

  useEffect(() => {
    setPageLoading('loading')
    const nomeBar = String(barname).replaceAll('-', ' ')
    const getEventInfo = async () => {
      await api.post('/getBarByName', {
        name: nomeBar
      }).then(async (data: any) => {
        var result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.data.color);
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16)

        if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
          setTextColor('#000')
        } else {
          setTextColor('#fff')
        }
        setColor(data.data.color)
        
        setIsPremium((data.data.isPremium && data.data.active) || (data.data.deliveryActive && data.data.isDelivery))

        setPageLoading('success')
        setAllowObs(data.data.allowObs)
        // agora pegar dados do produto
        await api.post('/getById', {
          itemId: item,
          barId: data.data.id
        }).then((datinha: any) => {
          setName(datinha.data.name)
          setDescription(datinha.data.description)
          setPrice(datinha.data.price)
          setPhoto(datinha.data.photo_url)
          setId(datinha.data.id)

          setAdicionais(datinha.data.adicionais)

        }).catch(() => {
          console.log("nao foi possivel achar o item!")
        })


      }).catch(() => {
        setPageLoading('error')
      })
    }
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
  const handleAdicionarCarrinho = () => {
    handleAddCarrinho(id, name, price, quantidade, obs, adicionalList)
  }

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
            <Link to={`/${barname}`} style={{ textDecoration: "none" }}>
              <IoMdArrowRoundBack style={{ marginLeft: 16 }} color={textColor} size={20} />
            </Link>

            <text
              style={{
                color: textColor,
                fontSize: 16,
              }}
            >Sobre o produto
            </text>

            <div style={{ opacity: 0 }}>
              <IoMdArrowRoundBack style={{ marginRight: 16 }} size={20} />
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              padding: 12,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {photo && (
              <img
                src={photo}
                alt=""
                style={{
                  height: 120,
                  width: '100%',
                  borderRadius: 8,
                  objectFit: 'contain'
                }}

              />
            )}
            <text
              style={{
                color: COLORS.Dark,
                fontSize: 16,
                fontWeight: 600
              }}
            >{name}</text>
            <text
              style={{
                marginTop: 6,
                color: COLORS.Inactive,
                fontWeight: 400,
                fontSize: 15
              }}
            >
              {description}
            </text>

            <text
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: COLORS.Dark,
                marginTop: 12
              }}
            >R$ {price.toFixed(2).replace('.', ',')}</text>

          </div>

          {/* isPremium condition*/}
          {isPremium && allowObs && (
            <div
              style={{
                marginTop: 12
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 32,
                  content: '',
                  backgroundSize: '40px 40px',
                  zIndex: 20,
                }}
              />
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'rgb(243, 245, 247) ',
                  padding: 18
                }}
              >
                <text
                  style={{
                    color: COLORS.Dark,
                    fontSize: 16,
                    fontWeight: 500
                  }}
                >Informação adicional</text>
                <ThemeProvider
                  theme={theme}
                >
                  <InputBase
                    placeholder={"Ex: Por favor, tirar o picles..."}
                    style={{
                      width: '100%',
                      border: `solid 1px ${COLORS.LightPlusOne}`,
                      marginTop: 12,
                      backgroundColor: COLORS.Light,
                      borderRadius: 5,
                      padding: 8,
                    }}
                    value={obs}
                    multiline
                    minRows={3}
                    maxRows={3}
                    onChange={(e) => {
                      if (e.currentTarget.value.length <= 64) {
                        setObs(e.currentTarget.value)
                      }
                    }}
                  />
                </ThemeProvider>

              </div>

            </div>
          )}


          {adicionais && (
            <div
              style={{
                backgroundColor: 'rgb(243, 245, 247)',
                width: '100%',
                padding: '0px 24px',
                paddingTop: 16
              }}
            >
              <text
                style={{
                  color: COLORS.Dark,
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >Adicionais</text>
              {adicionais.map((item: any, index: number) => (
                <AdicionalContainer
                  isPremium={isPremium}
                  color={color}
                  index={index}
                  item={item}
                  onClick={(active: boolean) => {
                    console.log(active)
                    if (active) {
                      setAdicionalTotalPrice(adicionalTotalPrice + item.price)
                      let adicionalTotalList = adicionalList
                      adicionalTotalList.push({
                        id: item.id,
                        name: item.name,
                        price: item.price
                      })

                      setAdicionalList(adicionalTotalList)
                      console.log(adicionalTotalList)

                    } else {
                      setAdicionalTotalPrice(adicionalTotalPrice - item.price)
                      let adicionalTotalList = adicionalList

                      adicionalTotalList.map((itemzinho: any, index: number) => {
                        if (itemzinho.id == item.id) {
                          adicionalTotalList.splice(index, 1)
                        }
                      })
                      setAdicionalList(adicionalTotalList)
                      console.log(adicionalTotalList)


                    }
                  }}
                />
              ))}
            </div>
          )}

          <div
            style={{
              backgroundColor: 'rgb(243, 245, 247)',
              width: '100%',
              height: 15,
              content: '',
              backgroundSize: '40px 40px',
              zIndex: 20,
              transform: 'rotate(180deg)',
            }}
          />

          {isPremium && (
            <div style={{
              position: 'fixed',
              backgroundColor: COLORS.Light,
              color: textColor,
              height: 64,
              width: '100%',
              bottom: 0,
              borderTop: `solid 1px ${color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0px 12px'
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <div
                  style={{
                    backgroundColor: color,
                    width: 32,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 6,
                    fontSize: 18,
                    fontWeight: 600,
                    color: textColor,
                    boxShadow: '0px 1px 3px rgb(0 0 0 / .2)',
                  }}
                  onClick={() => {
                    if (quantidade > 1) {
                      setQuantidade(quantidade - 1)
                    }
                  }}
                >-</div>
                <div
                  style={{
                    color: '#000',
                    fontSize: 16,
                    margin: '0px 12px',
                    fontWeight: 500
                  }}
                >{quantidade}</div>
                <div
                  style={{
                    backgroundColor: color,
                    width: 32,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    fontSize: 24,
                    fontWeight: 600,
                    color: textColor,
                    boxShadow: '0px 1px 3px rgb(0 0 0 / .2)'
                  }}
                  onClick={() => {
                    setQuantidade(quantidade + 1)
                  }}
                >+</div>
              </div>

              <Link to={`/${barname}`} style={{ textDecoration: 'none' }}
                onClick={handleAdicionarCarrinho}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 180,
                    backgroundColor: color,
                    height: 40,
                    borderRadius: 5,
                    padding: '0px 8px'
                  }}
                >
                  <text
                    style={{
                      color: textColor,
                      fontWeight: 500,
                      fontSize: 14
                    }}
                  >Adicionar</text>
                  <text
                    style={{
                      color: textColor,
                      fontWeight: 500,
                      fontSize: 14
                    }}>R$ {((quantidade * price) + adicionalTotalPrice).toFixed(2).replace('.', ',')}</text>
                </div>
              </Link>

            </div>
          )}


        </Container >



      )}

      {pageLoading === "loading" && (
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
            <Link to={`/${barname}`} style={{ textDecoration: "none" }}>
              <IoMdArrowRoundBack style={{ marginLeft: 16 }} color={textColor} size={20} />
            </Link>

            <text
              style={{
                color: COLORS.Light,
                fontSize: 16,
              }}
            >Sobre o produto
            </text>

            <div style={{ opacity: 0 }}>
              <IoMdArrowRoundBack style={{ marginRight: 16 }} size={20} />
            </div>
          </div>

          <div>
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

export default ItemInfoPage;
