import React from 'react';
import COLORS from '../../colors';

import { BiMoney } from 'react-icons/bi'
import { AiOutlineCreditCard } from 'react-icons/ai';

import { Container, TopContainer, RightTopContainer, ItemInfoContainer, ItemQuantityText, PaymentContainer, PaymentText, TotalText, ItemNameText, SquareColor, StatusText, BottomContainer } from './styles'


interface DeliveryInterface {
    items: Object[],
    status: number,
    total: number,
    paymentMethod: string,
    troco?: number,
    endereco: string;
    taxaDeEntrega: number;
}


const DeliveryContainer: React.FC<DeliveryInterface> = ({ items, status, total, paymentMethod, troco, endereco, taxaDeEntrega }) => {
    const cores = [
        COLORS.Inactive,
        '#7A55CB',
        '#F2C94C',
        '#2F80ED',
        COLORS.Confirm,
        COLORS.WarningRed
    ]

    const texto = [
        'Pedido enviado',
        'Aceito',
        'Preparando',
        'Entregando',
        'Entregue',
        'Rejeitado'
    ]

    return (
        <Container
            style={{
                borderBottom: `solid 2px ${cores[status]}`,
            }}
        >
            {/* PARTE DE CIMA */}
            <TopContainer>

                <div>
                    {items.map((item: any) => {
                        return (
                            <div>
                                <ItemInfoContainer>
                                    <ItemQuantityText>{item.quantity}x</ItemQuantityText>
                                    <ItemNameText>{item.name}</ItemNameText>
                                </ItemInfoContainer>
                                {item.obs && (
                                    <div>
                                        <ItemQuantityText style={{
                                            marginLeft: 6
                                        }} >  - {item.obs}</ItemQuantityText>
                                    </div>
                                )}
                                {item.adicionais && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        {item.adicionais.map((itemzinho: any) => (
                                            <ItemQuantityText style={{
                                                marginLeft: 6
                                            }} >  . {itemzinho.name}</ItemQuantityText>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <text
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                        }}
                    >Taxa de entrega R${Number(taxaDeEntrega).toFixed(2).replace('.', ',')}</text>
                </div>

                <RightTopContainer>
                    <SquareColor style={{ backgroundColor: cores[status] }} />
                    <StatusText>{texto[status]}</StatusText>
                </RightTopContainer>
            </TopContainer>


            {/* PARTE DE BAIXO */}

            {paymentMethod === 'dinheiro' && (
                <BottomContainer>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '6px 0px'
                        }}
                    >
                        <text
                            style={{
                                color: COLORS.Inactive,
                                fontSize: 14,
                                width: '100%',
                            }}
                        >{endereco}</text>
                    </div>
                    <TotalText>R$ {Number(total).toFixed(2).replaceAll('.', ',')}</TotalText>
                    <PaymentContainer>
                        <BiMoney color={COLORS.Inactive} size={16} />
                        <PaymentText>Troco para R$ {troco?.toFixed(2).replaceAll('.', ',')}</PaymentText>
                    </PaymentContainer>
                </BottomContainer>
            )}

            {paymentMethod === 'credito' && (
                <BottomContainer>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '6px 0px'
                        }}
                    >
                        <text
                            style={{
                                color: COLORS.Inactive,
                                fontSize: 14,
                                width: '100%',
                            }}
                        >{endereco}</text>
                    </div>
                    <TotalText>R$ {total.toFixed(2).replaceAll('.', ',')}</TotalText>
                    <PaymentContainer>
                        <AiOutlineCreditCard color={COLORS.Inactive} />
                        <PaymentText>Cartão de crédito</PaymentText>
                    </PaymentContainer>
                </BottomContainer>
            )}

            {paymentMethod === 'debito' && (
                <BottomContainer>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            margin: '6px 0px'
                        }}
                    >
                        <text
                            style={{
                                color: COLORS.Inactive,
                                fontSize: 14,
                                width: '100%',
                            }}
                        >{endereco}</text>
                    </div>
                    <TotalText>R$ {total.toFixed(2).replaceAll('.', ',')}</TotalText>
                    <PaymentContainer>
                        <AiOutlineCreditCard color={COLORS.Inactive} />
                        <PaymentText>Cartão de débito</PaymentText>
                    </PaymentContainer>
                </BottomContainer>
            )}

        </Container>
    );

}

export default DeliveryContainer;