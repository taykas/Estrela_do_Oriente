import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage } from './pages/main-page.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App