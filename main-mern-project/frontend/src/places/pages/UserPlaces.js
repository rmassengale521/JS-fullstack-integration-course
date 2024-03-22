import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
    const [places, setPlaces] = useState()
    const { userId } = useParams()

    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    useEffect(() => {
        const fetchplaces = async () => {
            try {
                const data = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)

                setPlaces(data.places)
            } catch (error) { }
        }
        fetchplaces()

    }, [sendRequest, userId])

    const placeDeletedHandler = (id) => {
        setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== id))
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading ? (
                <div className='center' >
                    <LoadingSpinner />
                </div>
            ) : places &&
            <PlaceList items={places} onDelete={placeDeletedHandler} />
            }
        </>
    )
}

export default UserPlaces