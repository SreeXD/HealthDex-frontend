import UploadForm from "../../components/UploadForm/UploadForm"
import { Box } from "@mui/material"
import FirebaseContext from "../../contexts/FirebaseContext"
import { useNavigate } from "react-router"
import { useContext } from "react"

export default function UploadDoc() {
    const { user } = useContext(FirebaseContext)
    const navigate = useNavigate()

    if (!user) {
        navigate('/')
    }


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <UploadForm />
        </Box>
    )
}