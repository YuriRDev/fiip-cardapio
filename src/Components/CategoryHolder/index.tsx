import React from 'react';

interface CategoryInterface {
    name: string;
}

const CategoryName: React.FC<CategoryInterface> = ({ name }) => {
    return (
        <div
            style={{
                backgroundColor: 'rgb(243, 245, 247)',
                padding: '24px 20px',
            }}
        >
            <text
                style={{
                    color: 'rgb(72, 84, 96)',
                    fontSize: 16,
                    fontWeight: 600,
                    width: '100%'
                }}
            >{name}</text>
        </div>
    );
}

export default CategoryName;