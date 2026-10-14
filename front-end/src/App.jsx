import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage } from './pages/main-page.jsx'
import { ProdutosPage } from "./pages/products.jsx"
import { Estoque } from "./pages/estoque.jsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/produtos' element={<ProdutosPage/>}></Route>
          <Route path='/estoque' element={<Estoque/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App