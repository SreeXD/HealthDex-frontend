import firebaseConfig from "./config/firebase.config"
import { getAuth, RecaptchaVerifier } from "firebase/auth"
import { initializeApp } from "firebase/app"
import AuthContext from "./contexts/AuthContext"
import { useEffect } from "react"

export default function App() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    return (
        <AuthContext.Provider value={{ app, auth }}>

        </AuthContext.Provider>
    )
}