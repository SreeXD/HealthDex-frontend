import "./UploadForm.css"
import React, { useState, useContext } from "react";
import FileUpload from 'react-material-file-upload'
import { Box, Button, TextField, Typography, Autocomplete } from "@mui/material"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid'
import FirebaseContext from "../../contexts/FirebaseContext"
import CircularProgress from '@mui/material/CircularProgress'
import serverConfig from "../../config/server.config"

export default function UploadForm({ props }) {
    const storage = getStorage()
    const firestore = getFirestore()
    const [files, setFiles] = useState([])
    const [search, setSearch] = useState("")
    const [loading ,setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const { user } = useContext(FirebaseContext)
    const [name, setName] = useState("")
    const [patient, setPatient] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadedMessage, setUploadedMessage] = useState("")

    const fetchEmails = async (value) => {
        setLoading(true)
        const token = await user.getIdToken()

        const emails = await fetch(`${serverConfig.url}/user/search/${value}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(body => body.json())

        setOptions(emails)
        setLoading(false)
    }

    const set = async () => {
        const token = await user.getIdToken()

        const patientData = await fetch(`${serverConfig.url}/user/get/${search}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(body => body.json())

        setName(patientData.displayName)
        setPatient(patientData)
    }

    const submit = async () => {
        setUploading(true)
        setUploadedMessage("uploading...")

        const file = files[0]
        const storageRef = ref(storage, uuidv4())

        const snapshot = await uploadBytes(storageRef, file)

        const name = snapshot.metadata.name
        const type = snapshot.metadata.contentType 
        const patientId = patient.uid

        await addDoc(collection(firestore, 'patientFiles'), {
            patient: patientId,
            patientName: patient.displayName,
            fileName: name,
            fileType: type
        }) 

        setUploading(false)
        setUploadedMessage("uploaded")
    }
    
    return (
        <Box style={{ maxWidth: '90%', width: '600px', padding: '40px 20px', borderRadius: '5px', boxShadow: '0px 0px 3px 0px #aaa' }}>
            <Typography align='center' sx={{ marginBottom: '40px', fontSize: '28px' }}>Upload Patient Record</Typography>

            <Box style={{ display: 'flex', marginBottom: '20px' }}>
                <Autocomplete 
                    loading={loading}

                    onOpen={() => {
                        fetchEmails("")
                    }}

                    onInputChange={(e, value) => {
                        setSearch(value)
                        fetchEmails(value)
                    }}

                    label = "Email"

                    style={{ width: '100%', marginRight: '10px' }} variant="outlined" 

                    options = {options}

                    renderInput = {(params) => (
                        <TextField {...params} InputProps={
                            {
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                )
                            }
                        }>

                        </TextField>
                    )}
                />

                <Button variant="contained" onClick={set}>Set</Button>
            </Box>

            <TextField disabled value={name} style={{ width: '100%', marginBottom: '20px' }} variant="outlined" label="Name" placeholder="Search by Email" />
            
            <FileUpload value={files} onChange={setFiles} accept='.pdf' />

            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={submit} variant="contained" style={{ marginTop: '20px', padding: '10px 30px' }}>
                    {uploading ? "Submitting.." : "Submit"} 
                
                    { uploading &&
                        <CircularProgress sx={{ marginLeft: '8px' }} color="inherit" size={20} />
                    }
                </Button>

                <Typography style={{ marginLeft: 'auto' }} color="primary">{uploadedMessage}</Typography>
            </Box>
        </Box>
    )
} 