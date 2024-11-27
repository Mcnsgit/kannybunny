import { Container, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils.js'
import Loading from '../common/Loading'
import Funbunny from '../../assets/Funbunny.png'

const AuthLayout = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if (!isAuth) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    loading ? (
      <Loading fullHeight />
    ) : (
      <Container className='auth-layout' component='main' maxWidth='sm'>
        <Box sx={{
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',

        }}>
          <img src={Funbunny} style={{ width: '100%', height: '250px', objectFit: 'contain', }} alt='app logo' />
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout