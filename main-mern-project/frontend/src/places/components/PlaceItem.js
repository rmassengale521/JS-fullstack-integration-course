import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceItem.css'

const PlaceItem = ({
    title,
    address,
    description,
    id,
    location,
    image,
    // creator
}) => {

    const [showMap, setShowMap] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)

    const openDeleteHandler = () => setShowDelete(true)
    const closeDeleteHandler = () => setShowDelete(false)
    const confirmDelete = () => {
        console.log('DELETING...');
        setShowDelete(false)
    }

    const authCtx = useContext(AuthContext)

    return (
        <>
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={address}
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={<Button onClick={closeMapHandler} >CLOSE</Button>}
            >
                <div className="map-container" >
                    <Map center={location} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showDelete}
                onCancel={closeDeleteHandler}
                header='Are you sure?'
                contentClass='place-item__modal-content'
                footerClass='place-item__modal-actions'
                footer={
                    <>
                        <Button inverse onClick={closeDeleteHandler} >CANCEL</Button>
                        <Button danger onClick={confirmDelete} >PROCEED</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this place? Please note that it can't be undone.</p>
            </Modal>
            <li className="place-item" >
                <Card className='place-item__content' >
                    <div className="place-item__image" >
                        <img src={image} alt={title} />
                    </div>
                    <div className="place-item__info" >
                        <h2>{title}</h2>
                        <h3>{address}</h3>
                        <p>{description}</p>
                    </div>
                    <div className="place-item__actions" >
                        <Button inverse onClick={openMapHandler} >VIEW ON MAP</Button>
                        {authCtx.isLoggedIn && <>
                            <Button to={`/places/${id}`} >EDIT</Button>
                            <Button danger onClick={openDeleteHandler} >DELETE</Button>
                        </>}
                    </div>
                </Card>
            </li>
        </>
    )
}

export default PlaceItem