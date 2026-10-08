import {AppBar, Toolbar, Button, Container} from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
        <AppBar position='static' sx={{alignItems: 'center'}}>
                <Toolbar>
                    <Button
                        component={NavLink}
                        to="/"
                        color="inherit"
                        sx={{ '&.active': { backgroundColor: 'rgba(255,255,255,0.25)' } }}
                        >
                        Главная
                    </Button>
                    <Button
                        component={NavLink}
                        to="/categories"
                        color="inherit"
                        sx={{ '&.active': { backgroundColor: 'rgba(255,255,255,0.25)' } }}
                        >
                        Категории и бюджеты
                    </Button>
                    <Button
                        component={NavLink}
                        to="/reports"
                        color="inherit"
                        sx={{ '&.active': { backgroundColor: 'rgba(255,255,255,0.25)' } }}
                        >
                        Отчёты
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
        
    )
}

export default Layout

