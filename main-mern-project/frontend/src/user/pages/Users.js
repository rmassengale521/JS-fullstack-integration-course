import React, { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {
    const [users, setUsers] = useState([])

    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await sendRequest(`${process.env.REACT_APP_API_URL}/users`)

                setUsers(data.users)
            } catch (error) {
            }
        }

        fetchUsers()
    }, [sendRequest])


    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className='center' >
                    <LoadingSpinner />
                </div>
            )}
            <UsersList items={users} />
        </>
    )
}

export default Users