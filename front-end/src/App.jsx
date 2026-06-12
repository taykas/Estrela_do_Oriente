import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage } from './pages/main-page.jsx'
import { Products } from "./pages/products.jsx"
import { About } from "./pages/about.jsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/products' element={<Products/>}></Route>
          <Route path='/about' element={<About/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App