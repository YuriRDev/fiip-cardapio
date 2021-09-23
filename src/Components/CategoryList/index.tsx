import React from 'react';
import { Link } from 'react-scroll';
import CategoriaContainer from '../CategoriaContainer';

interface ListInterface {
    categorias: any;
    categoriaSelected: number;
    onClick: any;
    color: string;
    onHeader?: boolean;
}

const CategoryList: React.FC<ListInterface> = ({ categorias, categoriaSelected, onClick, color, onHeader = false }) => {
    return (

        <div
            style={{
                marginLeft: 14,
                display: 'flex'
            }}
        >
            {categorias.map((item: string, index: number) => (
                <Link
                    key={index}
                    smooth={true}
                    to={item}
                    spy={true}
                    offset={-120}
                    onClick={() => {
                        onClick(index)
                    }}
                >
                    <CategoriaContainer
                        selected={index === categoriaSelected}
                        name={item}
                        color={color}
                        onHeader={onHeader}
                    />
                </Link>
            ))}

        </div>

    );
}

export default CategoryList;