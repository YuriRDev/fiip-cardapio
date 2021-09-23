import React from 'react';

import { useParams } from 'react-router-dom'

import { Container, TextContainer, TitleText, DescriptionText } from './styles';

import sky from '../../Assets/sky.svg'

const InvalidBar: React.FC = () => {

    const { barname } = useParams<any>()

    return (
        <Container>
            <img
                src={sky}
                alt=""
                style={{
                    width: '70%',
                    height: '80%',
                    marginTop: 64
                }}
            />
            <TextContainer>
                <TitleText>Oops, não encontramos esse cardapio</TitleText>
                <DescriptionText>"{String(barname).split('-').join(' ').toLowerCase()}" não é um local existente</DescriptionText>
            </TextContainer>
        </Container>
    );
}

export default InvalidBar;