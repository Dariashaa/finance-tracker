import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import CategoriesPage from "./pages/CategoriesPage"
import ReportsPage from "./pages/ReportsPage"


function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route element = {<Layout/>}>
              <Route path="/" element = {< HomePage/>} />
              <Route path="/categories" element = {<CategoriesPage />} />
              <Route path="/reports" element =  {<ReportsPage />}  />
            </Route>
          </Routes>
        </BrowserRouter> 
    </>
  )
}

export default App
