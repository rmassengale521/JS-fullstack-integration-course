import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

import './PlaceForm.css'

const UpdatePlace = () => {
    const { placeId } = useParams()
    const [chosenPlace, setChosenPlace] = useState()

    const history = useHistory()

    const authCtx = useContext(AuthContext)

    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        false
    )

    useEffect(() => {
        const fetchplace = async () => {
            try {
                const data = await sendRequest(`http://localhost:5000/api/places/${placeId}`)

                setChosenPlace(data.place)
                setFormData(
                    {
                        title: {
                            value: data.place.title,
                            isValid: true
                        },
                        description: {
                            value: data.place.description,
                            isValid: true
                        }
                    },
                    true
                )
            } catch (error) { }
        }
        fetchplace()

    }, [sendRequest, placeId, setFormData])


    const updatePlaceHandler = async (event) => {
        event.preventDefault()
        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json'
                }
            )

            history.push(`/${authCtx.userId}/places`)
        } catch (error) { }
    }


    if (isLoading) {
        return (
            <div className="center" >
                <LoadingSpinner />
            </div>
        )
    }

    if (!chosenPlace && !error) {
        return (
            <div className="center" >
                <Card>
                    <h2>Could not find place</h2>
                </Card>
            </div>
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {formState.inputs.title.value &&
                <form className="place-form" onSubmit={updatePlaceHandler} >
                    <Input
                        id='title'
                        element='input'
                        type='text'
                        label='Title'
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText='Please enter a valid title.'
                        onInput={inputHandler}
                        value={formState.inputs.title.value}
                        valid={formState.inputs.title.isValid}
                    />
                    <Input
                        id='description'
                        element='textarea'
                        label='Description'
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText='Please enter a valid description (at least 5 characters).'
                        onInput={inputHandler}
                        value={formState.inputs.description.value}
                        valid={formState.inputs.description.isValid}
                    />
                    <Button type='submit' disabled={!formState.isValid} >UPDATE PLACE</Button>
                </form>}
        </>
    )
}

export default UpdatePlace