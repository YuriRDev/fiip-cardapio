import styled from 'styled-components'
import COLORS from '../../colors'

export const Container = styled.div`
    background-color: ${COLORS.Light};
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 32px;
`

export const TitleText = styled.text`
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600
`

export const DescriptionText = styled.text`
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    margin-top: 8px;
`