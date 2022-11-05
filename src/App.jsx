import { useState } from 'react'
import firebaseConfig from './config/firebase.config'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'
import AuthContext from './contexts/AuthContext'

export default function App() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    const [user, setUser] = useState(null)

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
    }

    onAuthStateChanged(auth, (user) => {
        setUser(user)
    })

    return (
        <AuthContext.Provider value={{ user }}>
            <button onClick={loginWithGoogle}>login using google</button>
            <div>{user?.email}</div>
        </AuthContext.Provider>
    )
}