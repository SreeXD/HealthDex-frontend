import React, { useState, useContext, useEffect } from "react";
import { Box, Button, TextField, Typography, Autocomplete } from "@mui/material"
import FirebaseContext from "../../contexts/FirebaseContext"
import CircularProgress from '@mui/material/CircularProgress'
import serverConfig from "../../config/server.config"

export default function PatientDocuments() {
    const [search, setSearch] = useState("")
    const [loading ,setLoading] = useState(false)
    const [options, setOptions] = useState([])
    const { user } = useContext(FirebaseContext)
    const [name, setName] = useState("")
    const [fetching, setFetching] = useState(false)
    const [patient, setPatient] = useState(null)
    const [patientFiles, setPatientFiles] = useState([])
    const [_token, setToken] = useState(null)

    useEffect(() => {
        const x = async () => {
            const token = await user.getIdToken()
            setToken(token)
        }

        x()
    }, [])

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

    const fetchDocs = async () => {
        setFetching(true)

        const token = await user.getIdToken()

        const patientFilesRes = await fetch(`${serverConfig.url}/patient/${patient.uid}/docs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(body => body.json())

        setPatientFiles(patientFilesRes)

        setFetching(false)
    }

    return (
        <Box style={{ maxWidth: '90%', width: '600px', padding: '40px 20px', borderRadius: '5px', boxShadow: '0px 0px 3px 0px #aaa' }}>
            <Typography align='center' sx={{ marginBottom: '40px', fontSize: '32px' }}>Get Patient Records</Typography>

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
       
            <Button onClick={fetchDocs} variant="contained" style={{ marginTop: '10px', padding: '10px 30px' }}>
                {fetching ? "Fetching.." : "Fetch"} 
               
                { fetching &&
                    <CircularProgress sx={{ marginLeft: '8px' }} color="inherit" size={20} />
                }
            </Button>

            <div>
                { _token && patientFiles.map(x => {
                    const filename = x.fileName
                    const url = `https://firebasestorage.googleapis.com/v0/b/hash-39f73.appspot.com/o/${filename}?alt=media&token=${_token}`
                
                    return (
                        <div key={filename}>
                            <a href={url}>{filename}</a>
                        </div>
                    )
                })}
            </div>
        </Box>
    )
}