import React, { useState } from 'react';
import COLORS from '../../colors';

// import { Container } from './styles';

import { BiCheck } from 'react-icons/bi'

interface AdicionalInterface {
    color: string;
    index: number;
    item: any;
    onClick: any;
    isPremium: boolean;
}

const AdicionalContainer: React.FC<AdicionalInterface> = ({ color, index, item, onClick, isPremium }) => {
    const [isActive, setIsActive] = useState(false)

    return (
        <div
            style={{
                backgroundColor: 'rgb(243, 245, 247)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 8,
                color: COLORS.Dark,
                fontSize: 14,
                borderBottom: `solid 1px ${COLORS.LightPlusOne}`,
                paddingBottom: 8,
                marginTop: index === 0 ? 8 : 0
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    color: COLORS.Dark,
                }}
            >
                <text>{item.name}</text>
                <text style={{ marginLeft: 8 }} >R$ {Number(item.price).toFixed(2).replaceAll('.', ',')}</text>
            </div>

            {isPremium && (
                <div
                    style={{
                        height: 24,
                        width: 24,
                        border: `solid 2px ${color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                        color: color,
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        onClick(!isActive)
                        setIsActive(!isActive)
                    }}
                >
                    {isActive && (
                        <BiCheck size={20} />
                    )}
                </div>
            )}

        </div>
    );
}

export default AdicionalContainer;