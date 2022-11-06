import UploadForm from "../../components/UploadForm/UploadForm"
import { Box } from "@mui/material"

export default function UploadDoc() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <UploadForm />
        </Box>
    )
}