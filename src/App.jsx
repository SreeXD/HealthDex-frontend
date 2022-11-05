import { useState } from 'react'
import firebaseConfig from './config/firebase.config'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, addDoc, collection } from "firebase/firestore";
import FirebaseContext from './contexts/FirebaseContext'
import UploadForm from "./components/UploadForm/UploadForm"
import { Box } from "@mui/material"
import { useEffect } from 'react';

export default function App() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider()
    const [user, setUser] = useState(null)

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
    }

    onAuthStateChanged(auth, (user) => {
        setUser(user)
    })

    return (
        <FirebaseContext.Provider value={{ user }}>
            <button onClick={loginWithGoogle}>login using google</button>
            
            {
                user 
                    ? <div>
                        <div>{user?.email}</div>

                        <Box style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                            <UploadForm />
                        </Box>
                    </div>

                    : <div>loading...</div>
            }
        </FirebaseContext.Provider>
    )
}