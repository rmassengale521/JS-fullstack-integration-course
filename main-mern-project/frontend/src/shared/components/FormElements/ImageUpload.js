import React, { useEffect, useRef, useState } from 'react'

import './ImageUpload.css'
import Button from './Button'

const ImageUpload = ({
    id,
    center,
    onInput,
    errorText
}) => {
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)

    const filePickerRef = useRef()

    useEffect(() => {
        if (!file) {
            return
        }

        const fileReader = new FileReader()

        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }

        fileReader.readAsDataURL(file)

    }, [file])

    const pickImageHandler = () => {
        filePickerRef.current.click()
    }

    const pickHandler = (event) => {
        let pickedFile
        let fileIsValid = isValid

        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]

            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        } else {
            setIsValid(false)
            fileIsValid = false
        }

        onInput(id, pickedFile, fileIsValid)
    }

    return (
        <div className='form-control' >
            <input
                type='file'
                id={id}
                style={{ display: 'none' }}
                accept='.jpg,.png,jpeg'
                ref={filePickerRef}
                onChange={pickHandler}
            />
            <div className={`image-upload ${center && 'center'} `} >
                <div className='image-upload__preview' >
                    {previewUrl ?
                        <img src={previewUrl} alt='Preview' /> :
                        <p>Please pick an image.</p>
                    }
                </div>
                <Button type='button' onClick={pickImageHandler} >PICK IMAGE</Button>
            </div>
            {!isValid && <p>{errorText}</p>}
        </div>
    )
}

export default ImageUpload