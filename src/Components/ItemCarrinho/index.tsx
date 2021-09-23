import React, { useEffect, useState } from 'react';
import COLORS from '../../colors';

// import { Container } from './styles';
import { IoMdTrash } from 'react-icons/io'
import { useCount } from '../../Context/Count';

interface ItemCarrinhoInterface {
    item: any,
    index: number,
    color: string,
    textColor: string,
    update: any,
}

const ItemCarrinho: React.FC<ItemCarrinhoInterface> = ({ item, index, color, textColor, update }) => {

    const { carrinho, carrinhoPrice, handleEditCarrinhoEdit } = useCount()

    return (

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: 6,
                borderBottom: `solid 1px ${COLORS.LightPlusOne}`,
                paddingBottom: 6,
                flexDirection: 'column'
            }}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                }}>
                    <text
                        style={{
                            color: COLORS.Dark,
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 4
                        }}
                    >{item.name}</text>
                    <text
                        style={{
                            color: COLORS.Dark,
                            fontSize: 14,
                        }}
                    >R$ {Number(item.price * item.quantity).toFixed(2).replace('.', ',')}</text>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}>
                    {item.quantity > 1 && (
                        <div
                            style={{
                                backgroundColor: color,
                                color: textColor,
                                fontWeight: 500,
                                padding: '2px 8px',
                                borderRadius: 3,
                                zIndex: 200

                            }}
                            onClick={() => {
                                handleEditCarrinhoEdit(index, '-');
                                update()
                            }}
                        >
                            -
                        </div>
                    )}
                    {item.quantity == 1 && (

                        <div
                            onClick={() => {
                                handleEditCarrinhoEdit(index, '-');
                                update()
                            }}
                        >
                            <IoMdTrash color={color} size={24} style={{ marginTop: 3, marginRight: -4 }} />
                        </div>
                    )}

                    <text
                        style={{
                            color: COLORS.Inactive,
                            fontSize: 14,
                            fontWeight: 500,
                            margin: '0px 8px'
                        }}
                    >{item.quantity}x</text>
                    <div
                        style={{
                            backgroundColor: color,
                            color: textColor,
                            fontWeight: 500,
                            padding: '2px 6px',
                            borderRadius: 3
                        }}
                        onClick={() => {
                            handleEditCarrinhoEdit(index, '+')
                            update()
                        }}
                    >
                        +
                    </div>
                </div>

            </div>

            {item.obs && (
                <div style={{
                    width: '100%',
                    marginLeft: 36,
                    marginTop: 4
                }}>
                    <text
                        style={{
                            color: COLORS.Inactive,
                            fontSize: 14
                        }}
                    > - {item.obs}</text>
                </div>
            )}

            {item.adicionais.map((item: any) => (
                <div style={{
                    width: '100%',
                    marginLeft: 24,
                    marginTop: 4
                }}>
                    <text
                        style={{
                            color: COLORS.Inactive,
                            fontSize: 14
                        }}
                    > . {item.name} R$ {Number(item.price).toFixed(2).replaceAll('.', ',')}</text>
                </div>
            ))}

        </div>

    );
}

export default ItemCarrinho;