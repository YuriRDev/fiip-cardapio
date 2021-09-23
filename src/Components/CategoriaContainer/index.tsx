import React from 'react';

interface CategoriaInterface {
    name: string;
    onPress?: any;
    selected?: boolean;
    color: string;
    onHeader?: boolean;
}

const CategoriaContainer: React.FC<CategoriaInterface> = ({ name, onHeader, color, selected }) => {
    return (
        <div>
            {onHeader && (
                <div
                    id={`${name}c`}
                    style={{
                        margin: '10px 4px',
                        padding: '6px 16px',
                        borderRadius: 1,
                        fontWeight: 500,
                        paddingBottom: 8,
                        borderBottom: selected ? `2px solid ${color} ` : '',
                        color: selected ? color : 'rgb(72, 84, 96)',
                    }}
                >
                    {name}
                </div>
            )}
            {!onHeader && (
                <div
                    style={{
                        margin: '10px 4px',
                        padding: '6px 16px',
                        borderRadius: 1,
                        fontWeight: 500,
                        paddingBottom: 8,
                        borderBottom: selected ? `2px solid ${color} ` : '',
                        color: selected ? color : 'rgb(72, 84, 96)',
                    }}
                >
                    {name}
                </div>
            )}
        </div>
    );
}

export default CategoriaContainer;