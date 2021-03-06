
import React, { useState, useEffect } from 'react';

import { Container } from './styles'

import api from '../../api';

import Lottie from 'react-lottie';
import loading_loop from '../../Assets/loading_loop'

import { useParams } from 'react-router-dom';
import InvalidBar from '../InvalidBar';
import COLORS from '../../colors';

import { BiMoney, BiTrash } from 'react-icons/bi'
import { AiOutlineCreditCard, AiOutlineCheck } from 'react-icons/ai'

import { IoTicketOutline } from 'react-icons/io5'
import { MdDirectionsBike } from 'react-icons/md'

import NotValid from '../../Assets/notValid';
import { colors, InputBase } from '@material-ui/core';

import InputMask from 'react-input-mask'

import { IoMdArrowRoundBack } from 'react-icons/io'

import { Link } from 'react-router-dom'
import { useCount } from '../../Context/Count';
import ItemCarrinho from '../../Components/ItemCarrinho';
import EmptyCard from '../../Assets/emptyCart';

import graphicLoading from '../../Assets/graphicLoading';
import axios from 'axios';

const CarrinhoPage = () => {
  const { barname } = useParams<any>()

  const { carrinho, carrinhoPrice, handleEditCarrinhoEdit } = useCount()

  const [color, setColor] = useState('rgb(193, 89, 3)')

  const [textColor, setTextColor] = useState('#fff')
  const [title, setTitle] = useState('')

  const [mesaLength, setMesaLength] = useState<any>(null)

  const [barTelefone, setBarTelefone] = useState('')

  const [mesa, setMesa] = useState('')

  const [paymentMethod, setPaymentMethod] = useState<any>()
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [barId, setBarId] = useState('')

  const [troco, setTroco] = useState('')

  const [enviarWhatsapp, setEnviarWhatsapp] = useState(false)

  const [querEnviarMsg, setQuerEnviarMsg] = useState(false)

  const [isPremium, setIsPremium] = useState(false)

  const [isDouble, setIsDouble] = useState(false)

  const [pageLoading, setPageLoading] = useState('loading')
  const [update, setUpdate] = useState(0)

  const [isOrderLoading, setIsOrderLoading] = useState(false)
  const [isDelivery, setIsDelivery] = useState(false)

  const [address, setAddress] = useState('')
  const [cep, setCEP] = useState('')
  const [addressNum, setAddressNum] = useState('')
  const [compl, setCompl] = useState('')

  const [frete, setFrete] = useState(0)
  const [redirectBack, setRedirectBack] = useState(false)

  useEffect(() => {
    setIsOrderLoading(false)
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

        if (data.data.deliveryActive && data.data.isDelivery && data.data.isPremium && data.data.active) {
          setIsDelivery(false)
        } else {
          setIsDelivery(data.data.deliveryActive && data.data.isDelivery)
        }
        setIsPremium(data.data.isPremium && data.data.active)
        setIsDouble(data.data.deliveryActive && data.data.isDelivery && data.data.isPremium && data.data.active)

        setFrete(data.data.taxaDeEntrega)

        if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
          setTextColor('#000')
        } else {
          setTextColor('#fff')
        }
        setColor(data.data.color)

        setPageLoading('success')
        setBarId(data.data.id)
        setMesaLength(data.data.mesas)
        setTitle(data.data.title)

        if (data.data.telefone) {
          setEnviarWhatsapp(true)
          setBarTelefone(data.data.telefone)
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

    {/** LOCAL DATA : 

      nome: nome,
      telefone: telefone,
      cep: cep,
      address: address,
      numero: addressNum,
      complemento: compl,
      paymentMethod: paymentMethod,
      troco: paymentMethod == 0 ? troco ? troco : null : null

     */}
    const localData: any = (localStorage.getItem('@LocalData'))

    if (localData) {
      try {
        setNome(JSON.parse(localData).nome ? JSON.parse(localData).nome : '')
        setTelefone(JSON.parse(localData).telefone ? JSON.parse(localData).telefone : '')
        setCEP(JSON.parse(localData).cep ? JSON.parse(localData).cep : '')
        setAddress(JSON.parse(localData).address ? JSON.parse(localData).address : '')
        setAddressNum(JSON.parse(localData).numero ? JSON.parse(localData).numero : '')
        setCompl(JSON.parse(localData).complemento ? JSON.parse(localData).complemento : '')
      } catch {
        localStorage.removeItem('@LocalData')
      }
    }


    getSession()
    getEventInfo()
  }, [barname, update])


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: graphicLoading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },

  };
  const handleEnviarPedido = async () => {
    if (!isOrderLoading) {

      setIsOrderLoading(true)
      const sendToApi = async () => {
        let arrayCarrinho: any = []

        carrinho.map((item: any) => {
          let itemAdicional: string[] = []

          if (item.adicionais) {
            item.adicionais.map((item: any) => {
              itemAdicional.push(item.id)
            })
          }

          arrayCarrinho.push({
            id: item.id,
            obs: item.obs,
            quantity: item.quantity,
            adicionais: itemAdicional
          })
        })

        const dadosPessoais = {
          nome: nome,
          telefone: telefone
        }

        localStorage.setItem('@LocalData', JSON.stringify(dadosPessoais))



        const token = localStorage.getItem('@Session')

        await api.post('/order', {
          barId: barId,
          nome: nome,
          telefone: telefone.replace('(', '').replace(')', '').replaceAll(' ', '').replaceAll('-', ''),
          paymentMethod: String(paymentMethod),
          troco: String(troco.split('R$ ')[1]),
          carrinho: arrayCarrinho,
          mesa: mesaLength > 0 ? mesa : null
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then((data: any) => {
          if (enviarWhatsapp) {
            setQuerEnviarMsg(true)
            if (data.data.token) {
              localStorage.setItem('@Session', data.data.token)
            } else {
              console.log("nao enviou token de volta")
            }
          } else {
            document.location.href = `/${barname}/pedidos`
          }
        }).catch(() => {
          console.log("nao foi possivel fazer a compra")
        })

      }

      const Session = localStorage.getItem('@Session')
      if (!Session) {
        await api.post('/session').then((data) => {
          localStorage.setItem('@Session', data.data.token)
        }).then(() => {
          sendToApi()
        })
      } else {
        sendToApi()
      }
    }
  }

  const handleEnviarDelivery = async () => {
    localStorage.setItem('@LocalData', JSON.stringify(({
      nome: nome,
      telefone: telefone,
      cep: cep,
      address: address,
      numero: addressNum,
      complemento: compl,
      paymentMethod: paymentMethod,
      troco: paymentMethod == 0 ? troco ? troco : null : null
    })))



    console.log('enviando delivery!')
    // COMO VAI FUNCIONAR O DELIVERY?
    // NOVA TABELA!!!!, dai n vai me confundir e nem ngn 
    const token = localStorage.getItem('@Session')

    {/** PEGANDO OS DADOS DO CARRINHO << */ }
    let arrayCarrinho: any = []

    carrinho.map((item: any) => {
      let itemAdicional: string[] = []

      if (item.adicionais) {
        item.adicionais.map((item: any) => {
          itemAdicional.push(item.id)
        })
      }

      arrayCarrinho.push({
        id: item.id,
        obs: item.obs,
        quantity: item.quantity,
        adicionais: itemAdicional
      })
    })


    setIsOrderLoading(true)
    // DADOS > 
    await api.post('/orderDelivery', {
      nome: nome,
      telefone: telefone.replace('(', '').replace(')', '').replaceAll(' ', '').replaceAll('-', ''),
      carrinho: arrayCarrinho,
      barId: barId,
      cep: cep,
      address: address,
      number: addressNum,
      complemento: compl,
      paymentMethod: String(paymentMethod),
      troco: String(troco.split('R$ ')[1]),
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      setIsOrderLoading(false)


      console.log("comprado com sucesso!")
      if (barTelefone) {


        let itemsComprados = ''
        carrinho.map((item: any) => {
          console.log(item)
          let itemAdicional = ''
          if (item.adicionais) {
            item.adicionais.map((itemzinho: any) => {
              itemAdicional += (` - _${itemzinho.name}_ R$ ${Number(itemzinho.price).toFixed(2).replaceAll('.', ',')}_`)
            })
          }
          let observacao = ''
          if (item.obs) {
            observacao = `_obs:_ ${item.obs}`
          }

          itemsComprados += `*${item.quantity}x ${item.name} - R$${item.price}* %0A ${itemAdicional} ${observacao} %0A%0A`
        })

        let texto = ''
        setRedirectBack(true)
        texto = (`*Fiip Delivery* %0A--------------------------------%0A%0A ${itemsComprados} *Taxa de entrega*: R$ ${frete.toFixed(2).replace('.', ',')} %0A *Total: R$ ${carrinhoPrice + frete}* %0A%0A--------------------------------%0A%0A*${nome}*%0A${telefone}%0A%0A${address}, ${addressNum} - ${compl} %0A${cep}%0A%0A*Pagamento*:  ${paymentMethod == 1 ? 'Cart??o de cr??dito' : paymentMethod == 2 ? 'Cart??o de d??bito' : paymentMethod == 0 ? 'Dinheiro' : ''} %0A ${paymentMethod == 0 ? troco ? `*Troco para: *R$ ${Number(troco.split('R$ ')[1]).toFixed(2).replace('.', ',')}` : '' : ''}  `)


        document.location.href = (`https://api.whatsapp.com/send/?phone=55${barTelefone.replace('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll('-', '')}&text=${texto.replaceAll(' ', '%20')}`)

      }


    }).catch(() => {
      console.log("error ao comprar!")
    })



    console.log(arrayCarrinho)

    // criar nova tela com os dados passados!

    // MESMAS COISAS QUE OS PEDIDOS, SO Q COM UMA COISA A MAIS 
    // INCLUSIVE, CRIAR NOVA TABELA NO BAR PARA ( TAXA DE ENTREGA )



  }

  return (

    <div
    >
      {pageLoading === "success" && (
        <Container
        >

          {!redirectBack && (
            <div>

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
                >Carrinho
                </text>

                <div style={{ opacity: 0 }}>
                  <IoMdArrowRoundBack style={{ marginRight: 16 }} size={20} />
                </div>
              </div>

              {/** LISTA DOS ITEMS   */}

              {(isPremium || isDelivery) && carrinho.length > 0 && !querEnviarMsg && (
                <div
                  style={{
                    width: '100%',
                    padding: 12,
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 12
                    }}
                  >
                    <text
                      style={{
                        color: COLORS.Dark,
                        fontSize: 16,
                        fontWeight: 500,
                        width: '100%',
                      }}
                    >Seus itens</text>
                  </div>
                  {/* MAP CARRINHO */}
                  {carrinho.map((item: any, index: number) => (
                    <ItemCarrinho
                      item={item}
                      index={index}
                      color={color}
                      textColor={textColor}
                      update={() => {
                        setUpdate(update + 1)
                      }}
                    />
                  ))}
                </div>
              )}

              {/** SELECIONAR SE EH DELIVERY OU LOCAL */}

              {isDouble && carrinho.length > 0 && !querEnviarMsg && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    marginBottom: 24
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


              {/* isPremium condition*/}
              {isPremium && (
                <div>
                  {carrinho.length > 0 && (
                    <div>
                      {!querEnviarMsg && (

                        <div>                     <div>
                          {/* >> TOTAL <<  */}
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
                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: 'rgb(243, 245, 247)',
                              padding: 18,
                              paddingTop: 24
                            }}
                          >
                            <text
                              style={{
                                color: COLORS.Dark,
                                fontSize: 16,
                                fontWeight: 500
                              }}
                            >Total</text>
                            <text
                              style={{
                                color: COLORS.Dark,
                                fontSize: 16,
                                fontWeight: 500
                              }}
                            >R$ {Number(carrinhoPrice).toFixed(2).replace('.', ',')}</text>
                          </div>

                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              backgroundColor: 'rgb(243, 245, 247)',
                              padding: 18,
                              paddingTop: 12,
                              flexDirection: 'column'
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                              }}
                            >
                              <text
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: COLORS.Dark
                                }}
                              >Nome</text>
                              <InputBase
                                value={nome}
                                placeholder={"Insira seu nome completo"}
                                inputProps={{
                                  autoCorrect: 'off'
                                }}
                                style={{
                                  width: '100%',
                                  border: `solid 1px ${COLORS.LightPlusOne}`,
                                  backgroundColor: COLORS.Light,
                                  borderRadius: 5,
                                  padding: 8,
                                  marginTop: 8,
                                  fontWeight: 500
                                }}
                                onChange={(e) => {
                                  setNome(e.target.value)
                                }}
                              />
                            </div>

                            <div
                              style={{
                                width: '100%',
                                marginTop: 24
                              }}
                            >
                              <text
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: COLORS.Dark
                                }}
                              >Telefone</text>
                              <InputMask
                                mask="(99) 99999-9999"
                                maskChar={null}
                                inputMode={'decimal'}
                                value={telefone}
                                onChange={(e) => {
                                  setTelefone(e.target.value)
                                }}
                              >
                                {() =>
                                  <InputBase
                                    inputProps={{
                                      inputMode: 'numeric'
                                    }}
                                    placeholder={"(00) 00000-0000"}
                                    style={{
                                      width: '100%',
                                      border: `solid 1px ${COLORS.LightPlusOne}`,
                                      backgroundColor: COLORS.Light,
                                      borderRadius: 5,
                                      padding: 8,
                                      marginTop: 8,
                                      fontWeight: 500
                                    }}

                                  />
                                }
                              </InputMask>
                            </div>
                            {mesaLength != null && (

                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 24
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >Mesa</text>
                                <InputMask
                                  mask={mesaLength < 10 ? '9' : mesaLength < 100 ? '99' : '999'}
                                  maskChar={null}
                                  inputMode={'decimal'}
                                  value={mesa}
                                  onChange={(e) => {
                                    setMesa(e.target.value)
                                  }}
                                >
                                  {() =>
                                    <InputBase
                                      inputProps={{
                                        inputMode: 'numeric'
                                      }}
                                      placeholder={"Qual mesa voc?? est???"}
                                      style={{
                                        width: '100%',
                                        border: `solid 1px ${COLORS.LightPlusOne}`,
                                        backgroundColor: COLORS.Light,
                                        borderRadius: 5,
                                        padding: 8,
                                        marginTop: 8,
                                        fontWeight: 500
                                      }}

                                    />
                                  }
                                </InputMask>
                              </div>
                            )}


                          </div>

                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              backgroundColor: 'rgb(243, 245, 247)',
                              padding: 18,
                              paddingTop: 12,
                              flexDirection: 'column',
                              marginBottom: 180
                            }}
                          >
                            <text
                              style={{
                                color: COLORS.Dark,
                                fontSize: 14,
                                fontWeight: 500
                              }}
                            >M??todo de pagamento</text>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 12
                              }}
                            >
                              <div
                                style={{
                                  height: 80,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: COLORS.Light,
                                  width: 110,
                                  border: `solid 2px ${paymentMethod == 0 ? color : COLORS.LightPlusOne}`,
                                  borderRadius: 8,
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                                onClick={() => {
                                  setPaymentMethod(0)
                                }}
                              >
                                <BiMoney style={{ marginRight: 4 }} /> Dinheiro
                              </div>
                              <div
                                style={{
                                  height: 80,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: COLORS.Light,
                                  width: 110,
                                  border: `solid 2px ${paymentMethod == 1 ? color : COLORS.LightPlusOne}`,
                                  borderRadius: 8,
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                                onClick={() => {
                                  setPaymentMethod(1)
                                }}
                              >
                                <AiOutlineCreditCard style={{ marginRight: 4 }} /> Cr??dito
                              </div>
                              <div
                                style={{
                                  height: 80,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: COLORS.Light,
                                  width: 110,
                                  border: `solid 2px ${paymentMethod == 2 ? color : COLORS.LightPlusOne}`,
                                  borderRadius: 8,
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                                onClick={() => {
                                  setPaymentMethod(2)
                                }}
                              >
                                <AiOutlineCreditCard style={{ marginRight: 4 }} /> D??bito
                              </div>
                            </div>


                            {paymentMethod == 0 && (
                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 24
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >Troco para</text>
                                <InputMask
                                  mask="R$ 9999"
                                  value={troco}
                                  inputMode={'numeric'}
                                  maskChar={null}
                                  onChange={(e) => {
                                    setTroco(e.currentTarget.value)
                                  }}
                                >
                                  {() =>
                                    <InputBase
                                      placeholder={"R$"}
                                      style={{
                                        width: '100%',
                                        border: `solid 1px ${COLORS.LightPlusOne}`,
                                        backgroundColor: COLORS.Light,
                                        borderRadius: 5,
                                        padding: 8,
                                        marginTop: 8,
                                        fontWeight: 500
                                      }}

                                    />
                                  }
                                </InputMask>

                                {((Number(troco.split('R$ ')[1]) > 0) && troco.split('R$ ')[1] < carrinhoPrice) && (
                                  <text
                                    style={{
                                      color: COLORS.WarningRed,
                                      fontSize: 12,
                                      fontWeight: 500,
                                      marginLeft: 2,
                                      marginTop: 4
                                    }}
                                  >Informe um valor maior que o total do pedido</text>
                                )}


                              </div>
                            )}

                          </div>

                          {/* BOTAO DE CONFIRMAR COMPRA */}

                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'fixed',
                              bottom: 32,
                              transition: '.3s'
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: (nome.length > 3 && telefone.length == 15 && paymentMethod >= 0) ? (paymentMethod == 0 && (Number(troco.split('R$ ')[1]) >= carrinhoPrice) || (Number(troco.split('R$ ')[1]) == 0) || !Number(troco.split('R$ ')[1])) ? color : (paymentMethod > 0) ? color : COLORS.Inactive : COLORS.Inactive,
                                fontSize: 16,
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                width: '80%',
                                height: 48,
                                borderRadius: 5,
                                color: textColor,
                                boxShadow: '0px 1px 3px rgb(0 0 0 / .5)',
                                zIndex: 100,
                                transition: '.2s',
                                padding: '0px 12px',
                                opacity: (nome.length > 3 && telefone.length == 15 && paymentMethod >= 0 && ((mesaLength > 0 && Number(mesa) > 0) || !mesaLength)) ? (paymentMethod == 0 && (Number(troco.split('R$ ')[1]) >= carrinhoPrice) || (Number(troco.split('R$ ')[1]) == 0) || !Number(troco.split('R$ ')[1])) ? 1 : (paymentMethod > 0) ? 1 : 0 : 0
                              }}
                              onClick={(nome.length > 3 && telefone.length == 15 && paymentMethod >= 0 && ((mesaLength > 0 && Number(mesa) > 0) || !mesaLength)) ? (paymentMethod == 0 && (Number(troco.split('R$ ')[1]) >= carrinhoPrice) || (Number(troco.split('R$ ')[1]) == 0) || !Number(troco.split('R$ ')[1]))
                                ? handleEnviarPedido
                                : (paymentMethod > 0)
                                  ? handleEnviarPedido
                                  : () => { }
                                : () => { }}
                            >
                              <AiOutlineCheck size={isOrderLoading ? 0 : 18} style={{ marginRight: 8, opacity: isOrderLoading ? 0 : 1 }} />
                              {isOrderLoading ? 'Enviando pedido...' : 'Confirmar pedido'}
                            </div>

                          </div>
                        </div>
                        </div>
                      )}
                      {querEnviarMsg && (
                        <div
                          style={{
                            marginTop: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: 'rgb(243, 245, 247)',
                            padding: '24px 0px'
                          }}
                        >
                          <text
                            style={{
                              fontSize: 18,
                              fontWeight: 500,
                              color: COLORS.Inactive,
                              marginBottom: 12
                            }}
                          >Seu pedido foi enviado!</text>
                          <text
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                            }}
                          >Deseja enviar para o whatsapp do restaurante?</text>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              width: '100%',
                              marginTop: 32
                            }}
                          >

                            <div
                              onClick={() => {
                                document.location.href = `/${barname}/pedidos`
                              }}
                              style={{
                                fontSize: 16,
                                fontWeight: 500,
                                border: `solid 2px ${color}`,
                                padding: '12px 18px',
                                color: COLORS.Dark,
                                borderRadius: 5
                              }}
                            >
                              Nao, obrigado
                            </div>

                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 500,
                                padding: '12px 32px',
                                color: textColor,
                                backgroundColor: color,
                                borderRadius: 5
                              }}
                              onClick={() => {
                                let itemsComprados = ''
                                carrinho.map((item: any) => {
                                  console.log(item)
                                  let itemAdicional = ''
                                  if (item.adicionais) {
                                    item.adicionais.map((itemzinho: any) => {
                                      itemAdicional += (`*.* _${itemzinho.name}_ R$ ${Number(itemzinho.price).toFixed(2).replaceAll('.', ',')}`)
                                    })
                                  }
                                  let observacao = ''
                                  if (item.obs) {
                                    observacao = `%0A%0A _obs:_ ${item.obs}`
                                  }

                                  itemsComprados += `_${item.quantity}x_ - *${item.name}* - _R$${item.price}_ %0A ${itemAdicional} ${observacao} %0A%0A`
                                })

                                let texto = ''



                                if (paymentMethod == 0) {
                                  texto = (`Ol??, *${title}*! ???%0A???? *Meu carrinho*%0A%0A${itemsComprados} ???? ${nome}%0A???? ${telefone}%0A ${mesa ? `Mesa ${mesa} %0A` : ''}  %0A ???? Dinheiro %0A ${Number(troco.replaceAll('R$ ', '')) > 0 ? `Troco para ${troco}` : 'Sem troco'}`)
                                } else {
                                  texto = (`Ol??, *${title}*! ???%0A???? *Meu carrinho*%0A%0A${itemsComprados} ???? ${nome}%0A???? ${telefone}%0A ${mesa ? `Mesa ${mesa} %0A` : ''}  %0A ????  ${paymentMethod == 1 ? 'Cart??o de cr??dito' : 'Cart??o de d??bito'}`)
                                }

                                window.location.href = (`https://api.whatsapp.com/send/?phone=55${barTelefone.replace('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll('-', '')}&text=${texto.replaceAll(' ', '%20')}`)

                              }}
                            >
                              Sim!
                            </div>

                          </div>


                        </div>
                      )}

                    </div>
                  )}
                  {carrinho.length == 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 64,
                        flexDirection: 'column',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        opacity: .8
                      }}>
                        <EmptyCard color={color} />
                      </div>

                      <text style={{
                        color: COLORS.Inactive,
                        fontSize: 18,
                        fontWeight: 500,
                        marginTop: 32,
                        width: '100%',
                        textAlign: 'center'
                      }}>Seu carrinho est?? vazio! </text>

                      <Link to={`/${barname}`} style={{ width: '100%', textDecoration: 'none', alignItems: 'center', justifyContent: 'center', display: 'flex' }} >
                        <div
                          style={{
                            width: '60%',
                            borderRadius: 5,
                            border: `solid 2px ${color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 52,
                            marginTop: 32,
                            fontSize: 18,
                            fontWeight: 500,
                            color: color
                          }}
                        >
                          Ir para o menu
                        </div>

                      </Link>
                    </div>
                  )}
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
                  >{title} n??o aceita <br />pedidos pelo site {`:(`}</text>
                </div>
              )}

              {isDelivery && (
                <div>
                  {carrinho.length > 0 && (
                    <div>
                      {!querEnviarMsg && (

                        <div>
                          <div>
                            {/* >> TOTAL <<  */}
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
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'rgb(243, 245, 247)',
                                padding: '0px 18px',
                              }}
                            >
                              <text
                                style={{
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                              >Taxa de entrega: R$ {frete.toFixed(2).replace('.', ',')}</text>
                            </div>
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: 'rgb(243, 245, 247)',
                                padding: 18,
                                paddingTop: 12
                              }}
                            >
                              <text
                                style={{
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                              >Total</text>
                              <text
                                style={{
                                  color: COLORS.Dark,
                                  fontSize: 16,
                                  fontWeight: 500
                                }}
                              >R$ {Number(carrinhoPrice + frete).toFixed(2).replace('.', ',')}</text>
                            </div>

                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                backgroundColor: 'rgb(243, 245, 247)',
                                padding: 18,
                                paddingTop: 12,
                                flexDirection: 'column'
                              }}
                            >
                              <div
                                style={{
                                  width: '100%',
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >Nome *</text>
                                <InputBase
                                  value={nome}
                                  placeholder={"Insira seu nome completo"}
                                  inputProps={{
                                    autoCorrect: 'off'
                                  }}
                                  style={{
                                    width: '100%',
                                    border: `solid 1px ${COLORS.LightPlusOne}`,
                                    backgroundColor: COLORS.Light,
                                    borderRadius: 5,
                                    padding: 8,
                                    marginTop: 8,
                                    fontWeight: 500
                                  }}
                                  onChange={(e) => {
                                    setNome(e.target.value)
                                  }}
                                />
                              </div>

                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 24
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >Telefone *</text>

                                <InputMask
                                  mask="(99) 99999-9999"
                                  maskChar={null}
                                  inputMode={'decimal'}
                                  value={telefone}
                                  onChange={(e) => {
                                    setTelefone(e.target.value)
                                  }}
                                >
                                  {() =>
                                    <InputBase
                                      inputProps={{
                                        inputMode: 'numeric'
                                      }}
                                      placeholder={"(00) 00000-0000"}
                                      style={{
                                        width: '100%',
                                        border: `solid 1px ${COLORS.LightPlusOne}`,
                                        backgroundColor: COLORS.Light,
                                        borderRadius: 5,
                                        padding: 8,
                                        marginTop: 8,
                                        fontWeight: 500
                                      }}

                                    />
                                  }
                                </InputMask>
                              </div>

                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 24
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >CEP *</text>

                                <InputMask
                                  mask="99999-999"
                                  maskChar={null}
                                  autoCorrect={'none'}
                                  inputMode={'decimal'}
                                  value={cep}
                                  onChange={async (e) => {
                                    setCEP(e.target.value)
                                    if (e.target.value.length == 9) {
                                      console.log("terminou de escrever")
                                      await axios.get(`https://viacep.com.br/ws/${e.target.value.replace('-', '')}/json`).then((data) => {
                                        if (data.data.logradouro) {
                                          setAddress(data.data.logradouro)
                                        }
                                      }).catch(() => {
                                        // nao foi possivelachar o cep
                                      })
                                    }
                                  }}
                                >
                                  {() =>
                                    <InputBase
                                      inputProps={{
                                        inputMode: 'numeric',
                                        autoCorrect: 'none'
                                      }}
                                      placeholder={"00000-000"}
                                      style={{
                                        width: '100%',
                                        border: `solid 1px ${COLORS.LightPlusOne}`,
                                        backgroundColor: COLORS.Light,
                                        borderRadius: 5,
                                        padding: 8,
                                        marginTop: 8,
                                        fontWeight: 500
                                      }}

                                    />
                                  }
                                </InputMask>
                              </div>

                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 16
                                }}
                              >
                                <text
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: COLORS.Dark
                                  }}
                                >Endere??o*</text>
                                <InputBase
                                  value={address}
                                  placeholder={"Rua ..., 123"}
                                  inputProps={{
                                    autoCorrect: 'off'
                                  }}
                                  style={{
                                    width: '100%',
                                    border: `solid 1px ${COLORS.LightPlusOne}`,
                                    backgroundColor: COLORS.Light,
                                    borderRadius: 5,
                                    padding: 8,
                                    marginTop: 8,
                                    fontWeight: 500
                                  }}
                                  onChange={(e) => {
                                    setAddress(e.target.value)
                                  }}
                                />
                              </div>


                              <div
                                style={{
                                  width: '100%',
                                  marginTop: 16,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >

                                <div
                                  style={{
                                    width: '45%'
                                  }}
                                >
                                  <text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                      color: COLORS.Dark
                                    }}
                                  >N??mero *</text>
                                  <InputBase
                                    value={addressNum}
                                    placeholder={"000"}
                                    inputMode={'numeric'}
                                    inputProps={{
                                      autoCorrect: 'off',
                                      inputMode: 'numeric'
                                    }}
                                    style={{
                                      width: '100%',
                                      border: `solid 1px ${COLORS.LightPlusOne}`,
                                      backgroundColor: COLORS.Light,
                                      borderRadius: 5,
                                      padding: 8,
                                      marginTop: 8,
                                      fontWeight: 500
                                    }}
                                    onChange={(e) => {
                                      if (Number(e.target.value) >= 0) {
                                        setAddressNum(e.target.value)
                                      }
                                    }}
                                  />
                                </div>


                                <div
                                  style={{
                                    width: '45%'
                                  }}
                                >
                                  <text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                      color: COLORS.Dark
                                    }}
                                  >Complemento</text>
                                  <InputBase
                                    value={compl}
                                    placeholder={"Apto..."}
                                    inputProps={{
                                      autoCorrect: 'off'
                                    }}
                                    style={{
                                      width: '100%',
                                      border: `solid 1px ${COLORS.LightPlusOne}`,
                                      backgroundColor: COLORS.Light,
                                      borderRadius: 5,
                                      padding: 8,
                                      marginTop: 8,
                                      fontWeight: 500
                                    }}
                                    onChange={(e) => {
                                      setCompl(e.target.value)
                                    }}
                                  />
                                </div>

                              </div>


                            </div>

                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                backgroundColor: 'rgb(243, 245, 247)',
                                padding: 18,
                                paddingTop: 12,
                                flexDirection: 'column',
                                marginBottom: 180
                              }}
                            >
                              <text
                                style={{
                                  color: COLORS.Dark,
                                  fontSize: 14,
                                  fontWeight: 500
                                }}
                              >M??todo de pagamento</text>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  marginTop: 12
                                }}
                              >
                                <div
                                  style={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.Light,
                                    width: 110,
                                    border: `solid 2px ${paymentMethod == 0 ? color : COLORS.LightPlusOne}`,
                                    borderRadius: 8,
                                    color: COLORS.Dark,
                                    fontSize: 16,
                                    fontWeight: 500
                                  }}
                                  onClick={() => {
                                    setPaymentMethod(0)
                                  }}
                                >
                                  <BiMoney style={{ marginRight: 4 }} /> Dinheiro
                                </div>
                                <div
                                  style={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.Light,
                                    width: 110,
                                    border: `solid 2px ${paymentMethod == 1 ? color : COLORS.LightPlusOne}`,
                                    borderRadius: 8,
                                    color: COLORS.Dark,
                                    fontSize: 16,
                                    fontWeight: 500
                                  }}
                                  onClick={() => {
                                    setPaymentMethod(1)
                                  }}
                                >
                                  <AiOutlineCreditCard style={{ marginRight: 4 }} /> Cr??dito
                                </div>
                                <div
                                  style={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.Light,
                                    width: 110,
                                    border: `solid 2px ${paymentMethod == 2 ? color : COLORS.LightPlusOne}`,
                                    borderRadius: 8,
                                    color: COLORS.Dark,
                                    fontSize: 16,
                                    fontWeight: 500
                                  }}
                                  onClick={() => {
                                    setPaymentMethod(2)
                                  }}
                                >
                                  <AiOutlineCreditCard style={{ marginRight: 4 }} /> D??bito
                                </div>
                              </div>


                              {paymentMethod == 0 && (
                                <div
                                  style={{
                                    width: '100%',
                                    marginTop: 24
                                  }}
                                >
                                  <text
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 500,
                                      color: COLORS.Dark
                                    }}
                                  >Troco para</text>
                                  <InputMask
                                    mask="R$ 9999"
                                    value={troco}
                                    inputMode={'numeric'}
                                    maskChar={null}
                                    onChange={(e) => {
                                      setTroco(e.currentTarget.value)
                                    }}
                                  >
                                    {() =>
                                      <InputBase
                                        placeholder={"R$"}
                                        style={{
                                          width: '100%',
                                          border: `solid 1px ${COLORS.LightPlusOne}`,
                                          backgroundColor: COLORS.Light,
                                          borderRadius: 5,
                                          padding: 8,
                                          marginTop: 8,
                                          fontWeight: 500
                                        }}

                                      />
                                    }
                                  </InputMask>

                                  {((Number(troco.split('R$ ')[1]) > 0) && troco.split('R$ ')[1] < carrinhoPrice) && (
                                    <text
                                      style={{
                                        color: COLORS.WarningRed,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        marginLeft: 2,
                                        marginTop: 4
                                      }}
                                    >Informe um valor maior que o total do pedido</text>
                                  )}


                                </div>
                              )}

                            </div>

                            {/* BOTAO DE CONFIRMAR COMPRA */}

                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'fixed',
                                bottom: 32,
                                transition: '.3s'
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: (nome.length > 3 && telefone.length == 15 && address.length > 3 && cep.length == 9 && addressNum) ? (paymentMethod > 0 || (paymentMethod == 0 && Number(troco.split('R$ ')[1]) > Number(carrinhoPrice) || paymentMethod == 0 && !troco.split('R$ ')[1])) ? color : COLORS.Inactive : COLORS.Inactive,
                                  fontSize: 16,
                                  fontWeight: 500,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  width: '80%',
                                  height: 48,
                                  borderRadius: 5,
                                  color: textColor,
                                  boxShadow: '0px 1px 3px rgb(0 0 0 / .5)',
                                  zIndex: 100,
                                  transition: '.2s',
                                  padding: '0px 12px',
                                  opacity: (nome.length > 3 && telefone.length == 15 && address.length > 3 && cep.length == 9 && addressNum) ? (paymentMethod > 0 || (paymentMethod == 0 && Number(troco.split('R$ ')[1]) > Number(carrinhoPrice) || paymentMethod == 0 && !troco.split('R$ ')[1])) ? 1 : 0 : 0,
                                }}
                                onClick={(nome.length > 3 && telefone.length == 15 && address.length > 3 && cep.length == 9 && addressNum) ? (paymentMethod > 0 || (paymentMethod == 0 && Number(troco.split('R$ ')[1]) > Number(carrinhoPrice) || paymentMethod == 0 && !troco.split('R$ ')[1]))
                                  ? handleEnviarDelivery
                                  : () => { }
                                  : () => { }}
                              >
                                <AiOutlineCheck size={isOrderLoading ? 0 : 18} style={{ marginRight: 8, opacity: isOrderLoading ? 0 : 1 }} />
                                {isOrderLoading ? 'Enviando pedido...' : 'Confirmar pedido'}
                              </div>

                            </div>

                          </div>
                        </div>
                      )}
                      {querEnviarMsg && (
                        <div
                          style={{
                            marginTop: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: 'rgb(243, 245, 247)',
                            padding: '24px 0px'
                          }}
                        >
                          <text
                            style={{
                              fontSize: 18,
                              fontWeight: 500,
                              color: COLORS.Inactive,
                              marginBottom: 12
                            }}
                          >Seu pedido foi enviado!</text>
                          <text
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                            }}
                          >Deseja enviar para o whatsapp do restaurante?</text>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              width: '100%',
                              marginTop: 32
                            }}
                          >

                            <div
                              onClick={() => {
                                document.location.href = `/${barname}/pedidos`
                              }}
                              style={{
                                fontSize: 16,
                                fontWeight: 500,
                                border: `solid 2px ${color}`,
                                padding: '12px 18px',
                                color: COLORS.Dark,
                                borderRadius: 5
                              }}
                            >
                              Nao, obrigado
                            </div>

                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 500,
                                padding: '12px 32px',
                                color: textColor,
                                backgroundColor: color,
                                borderRadius: 5
                              }}
                              onClick={() => {
                                let itemsComprados = ''
                                carrinho.map((item: any) => {
                                  console.log(item)
                                  let itemAdicional = ''
                                  if (item.adicionais) {
                                    item.adicionais.map((itemzinho: any) => {
                                      itemAdicional += (`*.* _${itemzinho.name}_ R$ ${Number(itemzinho.price).toFixed(2).replaceAll('.', ',')}`)
                                    })
                                  }
                                  let observacao = ''
                                  if (item.obs) {
                                    observacao = `%0A%0A _obs:_ ${item.obs}`
                                  }

                                  itemsComprados += `_${item.quantity}x_ - *${item.name}* - _R$${item.price}_ %0A ${itemAdicional} ${observacao} %0A%0A`
                                })

                                let texto = ''



                                if (paymentMethod == 0) {
                                  texto = (`Ol??, *${title}*! ???%0A???? *Meu carrinho*%0A%0A${itemsComprados} ???? ${nome}%0A???? ${telefone}%0A ${mesa ? `Mesa ${mesa} %0A` : ''}  %0A ???? Dinheiro %0A ${Number(troco.replaceAll('R$ ', '')) > 0 ? `Troco para ${troco}` : 'Sem troco'}`)
                                } else {
                                  texto = (`Ol??, *${title}*! ???%0A???? *Meu carrinho*%0A%0A${itemsComprados} ???? ${nome}%0A???? ${telefone}%0A ${mesa ? `Mesa ${mesa} %0A` : ''}  %0A ????  ${paymentMethod == 1 ? 'Cart??o de cr??dito' : 'Cart??o de d??bito'}`)
                                }

                                window.location.href = (`https://api.whatsapp.com/send/?phone=55${barTelefone.replace('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll('-', '')}&text=${texto.replaceAll(' ', '%20')}`)

                              }}
                            >
                              Sim!
                            </div>

                          </div>


                        </div>
                      )}

                    </div>
                  )}
                  {carrinho.length == 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 64,
                        flexDirection: 'column',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        opacity: .8
                      }}>
                        <EmptyCard color={color} />
                      </div>

                      <text style={{
                        color: COLORS.Inactive,
                        fontSize: 18,
                        fontWeight: 500,
                        marginTop: 32,
                        width: '100%',
                        textAlign: 'center'
                      }}>Seu carrinho est?? vazio! </text>

                      <Link to={`/${barname}`} style={{ width: '100%', textDecoration: 'none', alignItems: 'center', justifyContent: 'center', display: 'flex' }} >
                        <div
                          style={{
                            width: '60%',
                            borderRadius: 5,
                            border: `solid 2px ${color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 52,
                            marginTop: 32,
                            fontSize: 18,
                            fontWeight: 500,
                            color: color
                          }}
                        >
                          Ir para o menu
                        </div>

                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
          }

          {
            redirectBack && (
              <div>
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
                  >Carrinho
                  </text>

                  <div style={{ opacity: 0 }}>
                    <IoMdArrowRoundBack style={{ marginRight: 16 }} size={20} />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 24,
                    flexDirection: 'column'
                  }}
                >
                  <text
                    style={{
                      color: COLORS.Dark,
                      fontSize: 24,
                    }}
                  >Pedido enviado</text>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 16,
                      backgroundColor: 'rgb(243, 245, 247)',
                      width: '100%',
                      padding: '32px 24px',
                    }}
                  >
                    <text
                      style={{
                        fontSize: 18,
                        fontWeight: 500
                      }}
                    >Nome:</text>
                    <text>{nome}</text>

                    <text
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        marginTop: 12,
                      }}
                    >Endere??o:</text>
                    <text>{address}, {addressNum}, {compl}</text>
                    <text
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        marginTop: 12,
                      }}
                    >Total:</text>
                    <text>R$ {Number(carrinhoPrice + frete).toFixed(2).replace('.', ',')}</text>

                  </div>



                  <div
                    style={{
                      marginTop: 32,
                      border: `solid 2px ${color}`,
                      borderRadius: 5,
                      padding: '12px 24px',
                      color: color,
                      fontSize: 18,
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      document.location.href = `/${barname}/pedidos`
                    }}
                  >
                    Ver pedidos
                  </div>
                </div>


              </div>
            )
          }


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
              <Link to={`/${barname}`} style={{ textDecoration: "none" }}>
                <IoMdArrowRoundBack style={{ marginLeft: 16 }} color={textColor} size={20} />
              </Link>

              <text
                style={{
                  color: COLORS.Light,
                  fontSize: 16,
                }}
              >Carrinho
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

export default CarrinhoPage;
