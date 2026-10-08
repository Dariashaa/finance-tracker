import {AppBar, Toolbar, Button, Container} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
        <AppBar position='static'>
                <Toolbar>
                    <Button component = {NavLink} to="/" variant='contained' color='inherit' end>Главная</Button>
                    <Button component = {NavLink} to="/categories" variant='contained' color='inherit' >Категории и бюджеты</Button>
                    <Button component = {NavLink} to="/reports" variant='contained' color='inherit' >Отчёты</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
        
    )
}

export default Layout

