import React from 'react'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Menu from './Pages/Menu'
import Pedidos from './Pages/Pedidos'
import ItemInfoPage from './Pages/ItemInfoPage'
import CarrinhoPage from './Pages/Carrinho'

function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/:barname" exact component={Menu} />
                <Route path="/:barname/pedidos" component={Pedidos} />
                <Route path="/:barname/item/:item" exact component={ItemInfoPage} />
                <Route path="/:barname/carrinho" exact component={CarrinhoPage} />
            </Switch>
        </Router>
    )
}

export default Routes;