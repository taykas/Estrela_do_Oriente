import { HashRouter, Routes, Route } from "react-router-dom";
import { MainPage } from './pages/main-page.jsx'
import { ProdutosPage } from "./pages/products.jsx"
import { Estoque } from "./pages/estoque.jsx"
import { Vendas } from "./pages/vendas.jsx"
import { Fornecedores } from "./pages/fornecedores.jsx"
import { Relatorios } from "./pages/relatorios.jsx"

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/produtos' element={<ProdutosPage/>}></Route>
          <Route path='/estoque' element={<Estoque/>}></Route>
          <Route path='/vendas' element={<Vendas/>}></Route>
          <Route path='/fornecedores' element={<Fornecedores/>}></Route>
          <Route path='/relatorios' element={<Relatorios/>}></Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App