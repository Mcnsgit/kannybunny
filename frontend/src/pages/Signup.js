import { Box, Button, Container, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import authApi from '../api/authApi';
import LoadingButton from '@mui/lab/LoadingButton';

const Signup = () => {
    const navigate = useNavigate()
    
    const [loading, setLoading] = useState(false)

    const [usernameErrText, setUsernameErrText] = useState('')
    const [passwordErrText, setPasswordErrText] = useState('') //
    const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')    

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUsernameErrText('')
        setPasswordErrText('')
        setConfirmPasswordErrText('')

        const data = new FormData(e.target)
        const username = data.get('username').trim()            
        const password = data.get('password').trim()
        const confirmPassword = data.get('confirmPassword').trim()

        let err = false

        if (username === '') {
            err = true
            setUsernameErrText('Please fill this field')
        }
        if (password === '') {
            err = true
            setPasswordErrText('Please fill this field')
        }
        if (confirmPassword === '') {
            err = true
            setConfirmPasswordErrText('Please fill this field')
        }
        if (password !== confirmPassword) {     
            err = true
            setConfirmPasswordErrText('Confirm password not match')
        }

        if (err) return

        setLoading(true)

        try {
            const res = await authApi.signup({ 
                username, password, confirmPassword 
            }) 
            setLoading(false)
            navigate('/')
        } catch (err) {
            const errors = err.data.errors
            errors.forEach((error) => {
                if (error.param === 'username') {
                    setUsernameErrText(error.msg)
                }
                if (error.param === 'password') {
                    setPasswordErrText(error.msg)
                }
                if (error.param === 'confirmPassword') {
                    setConfirmPasswordErrText(error.msg)
                }
            })
            setLoading(false)
        }
    }

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1>Signup</h1>
                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        name='username'
                        autoComplete='username'
                        autoFocus
                        error={usernameErrText !== ''}
                        helperText={usernameErrText}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        error={passwordErrText !== ''}
                        helperText={passwordErrText}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='confirmPassword'
                        label='Confirm Password'
                        type='password'
                        id='confirmPassword'
                        autoComplete='current-password'
                        error={confirmPasswordErrText !== ''}
                        helperText={confirmPasswordErrText}
                    />
                    <LoadingButton
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        loading={loading}
                    >
                        Sign Up
                    </LoadingButton>
                    </Box>
                    <Button 
                    component={Link} 
                    to='/login' 
                    sx={{ mt: 3, mb: 2 }}
                    > Already Have An Account?? Login Here</Button>
            </Box>
        </Container>
    )
}    
export default Signup

    



