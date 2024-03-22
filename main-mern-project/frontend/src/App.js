import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

function App() {
    const [isLoggedIn, setIsloggedIn] = useState(false)
    const [userId, setUserId] = useState(null)

    const login = useCallback((uid) => {
        setIsloggedIn(true)
        setUserId(uid)
    }, [])

    const logout = useCallback(() => {
        setIsloggedIn(false)
        setUserId(null)
    }, [])

    let routes

    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path='/' exact ><Users /></Route>
                <Route path='/:userId/places' exact ><UserPlaces /></Route>
                <Route path='/places/new' exact ><NewPlace /></Route>
                <Route path='/places/:placeId' exact ><UpdatePlace /></Route>
                <Redirect to='/' />
            </Switch>
        )
    } else {
        routes = (
            <Switch>
                <Route path='/' exact ><Users /></Route>
                <Route path='/:userId/places' exact ><UserPlaces /></Route>
                <Route path='/auth' exact ><Auth /></Route>
                <Redirect to='/auth' />
            </Switch>
        )
    }

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            userId,
            login,
            logout
        }} >
            <Router>
                <MainNavigation />
                <main>
                    {routes}
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;
