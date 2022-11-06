import PatientDocuments from "../../components/PatientDocuments/PatientDocuments"
import { Box } from "@mui/material"
import FirebaseContext from "../../contexts/FirebaseContext"
import { useNavigate } from "react-router"
import { useContext } from "react"

export default function GetDocs() {
    const { user } = useContext(FirebaseContext)
    const navigate = useNavigate()

    if (!user) {
        navigate('/')
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <PatientDocuments />
        </Box>
    )
}