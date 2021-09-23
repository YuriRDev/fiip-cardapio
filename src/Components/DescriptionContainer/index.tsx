import React from 'react';


import Food from '../../Assets/food.svg'
import Hora from '../../Assets/hora.svg'
import Local from '../../Assets/local.svg'

interface DescriptionInterface {
    address: string;
    aberto: boolean;
    type: string;
}

const DescriptionContainer: React.FC<DescriptionInterface> = ({ address, type, aberto }) => {
    return (

        <div
            style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                minHeight: 30,
                padding: '22px 16px 0px',
                position: 'relative'
            }}
        >

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    alignSelf: 'center',
                    width: '100%'
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >

                    <img
                        alt=""
                        src={Hora}
                        style={{
                            height: 12,
                            width: 12
                        }}
                    />

                    <text
                        style={{
                            color: 'rgb(127, 143, 159)',
                            fontSize: 12,
                            fontWeight: 500,
                            marginLeft: 4,
                            lineHeight: '150%'
                        }}
                    >{aberto ? 'Aberto' : 'Fechado'}</text>
                </div>


            </div>


            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                }}
            >
                <img
                    alt=""
                    src={Local}
                    style={{
                        width: 16,
                        height: 16,
                        marginRight: 12
                    }}
                />
                <text
                    style={{
                        color: 'rgb(127, 143, 159)',
                        fontSize: 12,
                        fontWeight: 500,
                    }}
                >{address}</text>
            </div>


        </div>

    );
}

export default DescriptionContainer;