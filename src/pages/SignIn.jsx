import { Box, Button, Switch, Typography } from "@mui/material"
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import FirebaseContext from "../contexts/FirebaseContext"
import { useNavigate } from "react-router"
import serverConfig from "../config/server.config"

export default function SignIn() {
    const [isDoctor, setIsDoctor] = useState(false)
    const { user } = useContext(FirebaseContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            getAuth().currentUser.getIdTokenResult()
                .then(res => {
                    if (res) {                    
                        if (res.claims.doctor) {
                            navigate('/doctor/getDocs')
                        }
        
                        else {
                            navigate('/patient/home')
                        }
                    }
                })
        }
    }, [user])

    const signin = () => {
        signInWithPopup(getAuth(), new GoogleAuthProvider())
            .then(async (user) => {
                const token = await user.user.getIdToken()

                if (isDoctor) {
                    await fetch(`${serverConfig.url}/registerAsDoctor`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                }
            })
    }

    return (
        <Box style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box style={{ width: '300px', padding: '40px 20px', borderRadius: '5px', boxShadow: '0px 0px 3px 0px #aaa', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Typography align='center' sx={{ marginBottom: '20px', fontSize: '32px' }}>Sign in</Typography>
            
                <Button onClick={signin} variant="contained">Login using Google</Button>

                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                    <Switch sx={{ marginRight: '4px' }} onChange={(e, checked) => setIsDoctor(checked)}></Switch>
                    <Typography>I am a doctor </Typography>
                </Box>
            </Box>
        </Box>
    )
}