import { useState } from 'react'
import firebaseConfig from './config/firebase.config'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import FirebaseContext from './contexts/FirebaseContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn'
import GetDocs from './pages/Doctor/GetDocs';
import UploadDoc from './pages/Doctor/UploadDoc';
import PatientHome from "./pages/Patient/Home"
import { Box, AppBar, Typography, Avatar, Button, CircularProgress } from "@mui/material"
import { Link } from "react-router-dom"

export default function App() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app);
    const [user, setUser] = useState(null)
    const [isDoctor, setIsDoctor] = useState(false)
    const [ userLoading, setUserLoading ] = useState(true)

    onAuthStateChanged(auth, (user) => {
        setUser(user)
        setUserLoading(false)

        if (user) {
            getAuth().currentUser.getIdTokenResult()
                .then(res => {
                    if (res) {                    
                        if (res.claims.doctor) {
                            setIsDoctor(true)  
                        }
        
                        else {
                            setIsDoctor(false)
                        }
                    }
                })
        }
    })

    return (
        <BrowserRouter>
            {!userLoading 
            ? <FirebaseContext.Provider value={{ user }}>
                <AppBar sx={{ padding: '15px 20px', margin: '0', display: 'flex', flexDirection: 'row', alignItems: 'center' }} position='static'>
                    <Typography variant="h5">HealthXD</Typography>

                    { user &&
                        <Box sx={{ marginLeft: '20px', display: 'flex' }}>
                            { isDoctor &&
                                <Link to="/doctor/uploadDoc" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>
                                    <Typography variant='h6' style={{ fontSize: '18px' }}>Upload Record</Typography>
                                </Link>
                            }

                            { isDoctor &&
                                <Link to="/doctor/getDocs" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>
                                    <Typography variant='h6' style={{ fontSize: '18px' }}>Get Patient Records</Typography>
                                </Link>
                            }

                            { !isDoctor &&
                                <Link to="/patient/home" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>
                                    <Typography variant='h6' style={{ fontSize: '18px' }}>Home</Typography>
                                </Link>
                            }
                        </Box>
                    }

                    { user && (
                        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                            <Typography onClick={() => signOut(getAuth())} variant='h6' sx={{ marginRight: '14px', fontSize: '16px' }}>Sign out</Typography>
                            
                            { user.avatarUrl 
                                ? <Avatar src={user.avatarUrl}></Avatar>
                                : <Avatar>{user.displayName[0]}</Avatar>
                            }
                        </Box>
                    )}
                </AppBar>

                <Routes>
                    <Route path='/patient/home' element={<PatientHome />} />
                    <Route path='/doctor/getDocs' element={<GetDocs />} />
                    <Route path='/doctor/uploadDoc' element={<UploadDoc />} />
                    <Route path='/' element={<SignIn />} />
                </Routes>
            </FirebaseContext.Provider>

            : <Box style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={30} color="inherit"></CircularProgress>
            </Box>}
        </BrowserRouter>
    )
}