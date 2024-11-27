import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authApi from '../api/authApi';
import LoadingButton from '@mui/lab/LoadingButton';


const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usernameErrText, setUsernameErrText] = useState('')
    const [passwordErrText, setPasswordErrText] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUsernameErrText('')
        setPasswordErrText('')

        const data = new FormData(e.target)
        const username = data.get('username').trim()
        const password = data.get('password').trim()

        let err = false

        if (username === '') {
            err = true
            setUsernameErrText('Please fill this field')
        }

        if (password === '') {
            err = true
            setPasswordErrText('Please fill this field')
        }

        if (err) return

        setLoading(true)

        try {

        const res = await authApi.login({ username, password })
            setLoading(false)
            localStorage.setItem('token', res.token)
            navigate('/')
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDemoLogin = async () => {
        setLoading(true)
        try {
            await authApi.login({ 
                username: 'demo_user', 
                password: 'demo123' 
            })
            navigate('/')
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        error={usernameErrText !== ''}
                        helperText={usernameErrText}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={passwordErrText !== ''}
                        helperText={passwordErrText}
                    />
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={loading}
                    >
                        Login
                    </LoadingButton>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, mb: 2 }}
                        onClick={handleDemoLogin}
                        disabled={loading}
                    >
                        Try Demo Version
                    </Button>
                </Box>
                <Button
                    component={Link}
                    to='/signup'
                    sx={{ textAlign: 'center' }}
                >
                    Don't have an account? Register
                </Button>
            </Box>
        </Container>
    )
}       

export default Login