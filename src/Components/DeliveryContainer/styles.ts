import styled from 'styled-components'
import COLORS from '../../colors'

export const Container = styled.div`
    background-color: ${COLORS.Light};
    padding: 12px;
    width: 100%;
    box-shadow: 0px 1px 3px rgb(0 0 0 / .2);
    border-radius: 6px;
    margin-bottom: 12px;
`

export const TopContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
`

export const RightTopContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const ItemInfoContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 4px;
`

export const ItemQuantityText = styled.text`
    font-size: 14px;
    color: ${COLORS.Inactive};
    margin-right: 8px;
`

export const ItemNameText = styled.text`
    font-size: 16px;
    color: ${COLORS.Dark};
    margin-right: 8px;
`

export const SquareColor = styled.div`
    height: 20px;
    width: 20px;
    border-radius: 5px;
    margin-right: 6px;
`

export const StatusText = styled.text`
    font-size: 14px;
    color: ${COLORS.Inactive};
`

export const BottomContainer = styled.div`
    margin-top: 10px;
    border-top: solid 1px ${COLORS.LightPlusOne};
    padding-top: 10px;
`

export const TotalText = styled.text`
    color: ${COLORS.Dark};
    font-size: 16px;
    font-weight: 500;
`

export const PaymentContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 6px;
`

export const PaymentText = styled.div`
    font-size: 14px;
    color: ${COLORS.Inactive};
    margin-left: 4px;
`