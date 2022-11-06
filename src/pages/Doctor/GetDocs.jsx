import PatientDocuments from "../../components/PatientDocuments/PatientDocuments"
import { Box } from "@mui/material"

export default function GetDocs() {
    return (
        <Box sx={{ display: 'flex' }}>
            <PatientDocuments />
        </Box>
    )
}