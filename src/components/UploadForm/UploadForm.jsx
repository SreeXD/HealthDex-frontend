import "./UploadForm.css"
import React, { useState, useContext } from "react";
import FileUpload from 'react-material-file-upload'
import { Box, Button, TextField, Typography, Autocomplete } from "@mui/material"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { v4 as uuidv4 } from 'uuid'
import FirebaseContext from "../../contexts/FirebaseContext"
import CircularProgress from '@mui/material/CircularProgress'
import serverConfig from "../../config/server.config"

export default function UploadForm({ props }) {
    const storage = getStorage()
    const [files, setFiles] = useState([])
    const [search, setSearch] = useState("")
    const [loading ,setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const { user } = useContext(FirebaseContext)

    const fetchEmails = async (value) => {
        setLoading(true)
        const token = await user.getIdToken()

        const emails = await fetch(`${serverConfig.url}/users/email/${value}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(body => body.json())

        setOptions(emails)
        setLoading(false)
    }

    const submit = async () => {
        files.forEach(file => {
            // const storageRef = ref(storage, uuidv4())

            // uploadBytes(storageRef, file).then((snapshot) => {
            //     console.log(snapshot);
            // }) 
        })
    }
    
    return (
        <Box style={{ maxWidth: '90%', width: '600px', padding: '40px 20px', borderRadius: '5px', boxShadow: '0px 0px 3px 0px #aaa' }}>
            <Typography align='center' variant='h4' color="primary" sx={{ marginBottom: '40px' }}>Upload Patient Record</Typography>

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

                <Button variant="contained">Search</Button>
            </Box>

            <TextField disabled style={{ width: '100%', marginBottom: '20px' }} variant="outlined" label="Name" placeholder="Search by Email" />
            
            <FileUpload value={files} onChange={setFiles} />

            <Button onClick={submit} variant="contained" style={{ marginTop: '20px', padding: '10px 30px' }}>Submit</Button>
        </Box>
    )
} 