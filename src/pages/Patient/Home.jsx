import { getAuth, signOut } from "firebase/auth"
import { useContext, useEffect } from "react"
import serverConfig from "../../config/server.config"
import FirebaseContext from "../../contexts/FirebaseContext"
import { Box } from "@mui/material"
import { useState } from "react"
import { Document, Page, pdfjs } from 'react-pdf'
import { useNavigate } from "react-router-dom"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function GetDocs() {
    const [fetching, setFetching] = useState(false)
    const [files, setFiles] = useState([])
    const { user } = useContext(FirebaseContext)
    const [_token, setToken] = useState(null)
    const navigate = useNavigate()

    if (!user) {
        navigate('/')
    }

    useEffect(() => {
        const x = async () => {
            if (user) {
                const token = await user.getIdToken()
                setToken(token)
            }
        }

        x()
    }, [user])

    const fetchDocs = async () => {
        setFetching(true)

        const token = await user.getIdToken()

        const files = await fetch(`${serverConfig.url}/me/docs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(body => body.json())

        setFiles(files)

        setFetching(false)
    }

    useEffect(() => {
        if (user) {
            fetchDocs()
        }
    }, [user])

    return (
        <Box>
            { _token && files.map(x => {
                const filename = x.fileName
                const url = x.url
            
                return (
                    <a href={url} key={url}>
                        <Box key={filename} style={{ margin: '20px', display: 'inline-block', borderRadius: '5px', boxShadow: '0px 0px 3px 0px #aaa' }}>
                            <Document file={url}>
                                <Page height={400} pageNumber={1}></Page>
                            </Document>
                        </Box>
                    </a>
                )
            })}
        </Box>
    )
}