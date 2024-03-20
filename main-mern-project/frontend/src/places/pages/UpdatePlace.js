import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import './PlaceForm.css'
import Card from "../../shared/components/UIElements/Card";

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UpdatePlace = () => {
    const { placeId } = useParams()

    const [loading, setLoading] = useState(true)

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

    const chosenPlace = DUMMY_PLACES.find(place => place.id === placeId)

    useEffect(() => {
        if (chosenPlace) {
            setFormData(
                {
                    title: {
                        value: chosenPlace.title,
                        isValid: true
                    },
                    description: {
                        value: chosenPlace.description,
                        isValid: true
                    }
                },
                true
            )
        }

        setLoading(false)
    }, [setFormData, chosenPlace])


    const updatePlaceHandler = (event) => {
        event.preventDefault()
        console.log(formState.inputs);
    }

    if (!chosenPlace) {
        return (
            <div className="center" >
                <Card>
                    <h2>Could not find place</h2>
                </Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="center" >
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        formState.inputs.title.value &&
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
        </form>
    )
}

export default UpdatePlace