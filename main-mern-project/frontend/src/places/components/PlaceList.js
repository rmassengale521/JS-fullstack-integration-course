import React, { useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

import './PlaceList.css'
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const PlaceList = (props) => {
    const authCtx = useContext(AuthContext);
    const { userId } = useParams();

    if (authCtx.isLoggedIn && authCtx.userId !== userId && props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>This user does not have any places.</h2>
                </Card>
            </div>
        );
    }

    if (props.items.length === 0) {
        return (
            <div className="place-list center" >
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <Button to='/places/new' >Share Place</Button>
                </Card>
            </div>
        )
    }

    return (
        <ul className="place-list" >
            {props.items.map(place => <PlaceItem key={place.id} {...place} onDelete={props.onDelete} />)}
        </ul>
    )
}

export default PlaceList