import React from 'react';

import { Container } from './styles';

interface ItemInterface {
    name: string;
    description: string;
    price: number;
    image?: string;
}

const ItemInfo: React.FC<ItemInterface> = ({ name, image, description, price }) => {
    return (

        <Container>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <text
                    style={{
                        fontSize: 16,
                        color: '#000',
                        fontWeight: 600,
                    }}
                >{name}</text>
                <text
                    style={{
                        color: 'rgb(127, 143, 159)',
                        fontSize: 14,
                        fontWeight: 400,
                        marginTop: 8
                    }}
                >{description}</text>
                <text
                    style={{
                        color: '#000',
                        fontSize: 16,
                        fontWeight: 600,
                        marginTop: 12
                    }}
                >R$ {price.toFixed(2).replace('.', ',')}</text>
            </div>
            {image && (
                <img
                    alt=""
                    src={image}
                    style={{
                        width: 84,
                        height: 84,
                        marginLeft: 10,
                        borderRadius: 4,
                        backgroundColor: '#fff',
                        objectFit: 'contain'
                    }}
                />
            )}

        </Container>

    );
}

export default ItemInfo;