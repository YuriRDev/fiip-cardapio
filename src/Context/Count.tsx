import React, { createContext, useState, useContext } from 'react';

const CountContext = createContext<any>({});

const CountProvider: React.FC = ({ children }) => {
    const [count, setCount] = useState(0)

    const [carrinho, setCarrinho] = useState<any>([])
    const [carrinhoPrice, setCarrinhoPrice] = useState(0)

    // melhor jeito de salvar o carrinho > 
    // array[{id, nome, preco, adicional: [nome, preco]}, observacao] // assim eu posso listar o preco direitinho

    const handleAddCarrinho = (id: string, name: string, price: number, quantity: number, obs?: string, adicionais?: any) => {
        let carrinhoTotal: any = carrinho
        carrinhoTotal.push({
            id: id,
            name: name,
            price: price,
            quantity: quantity,
            obs,
            adicionais
        })

        let adicionaisPrice = 0

        if(adicionais){
            adicionais.map((item: any) => {
                console.log(item)
                adicionaisPrice += item.price
            })
        }

        setCarrinhoPrice(carrinhoPrice + (quantity * price) + adicionaisPrice)
        setCarrinho(carrinhoTotal)
        console.log(carrinhoTotal)
    }

    const handleEditCarrinhoEdit = (index: number, math: string) => {
        let carrinhoNovo = carrinho
        if (math === '+') {
            setCarrinhoPrice(carrinhoPrice + carrinhoNovo[index].price)
            carrinhoNovo[index].quantity = carrinhoNovo[index].quantity + 1
            setCarrinho(carrinhoNovo)
        }
        if (math === '-') {
            if (carrinhoNovo[index].quantity > 1) {
                setCarrinhoPrice(carrinhoPrice - carrinhoNovo[index].price)
                carrinhoNovo[index].quantity = carrinhoNovo[index].quantity - 1
                setCarrinho(carrinhoNovo)

            } else {
                setCarrinhoPrice(carrinhoPrice - carrinhoNovo[index].price)
                carrinhoNovo.splice(index, 1)
                setCarrinho(carrinhoNovo)
            }
        }
    }

    return (
        <CountContext.Provider
            value={{
                count,
                setCount,
                handleAddCarrinho,
                carrinho,
                carrinhoPrice,
                handleEditCarrinhoEdit
            }}
        >
            {children}
        </CountContext.Provider>
    );
}

export function useCount() {
    const context = useContext(CountContext)
    const { count, setCount, handleAddCarrinho, carrinho, carrinhoPrice, handleEditCarrinhoEdit } = context;
    return { count, setCount, handleAddCarrinho, carrinho, carrinhoPrice, handleEditCarrinhoEdit }
}

export default CountProvider;