import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage } from './pages/main-page.jsx'
import { ProdutosPage } from "./pages/products.jsx"
import { EstoquePage } from "./pages/estoque.jsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/products' element={<ProdutosPage/>}></Route>
          <Route path='/estoque' element={<EstoquePage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App