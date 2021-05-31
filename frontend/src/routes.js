import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {AuthPage} from "./pages/auth/AuthPage";
import {MainPage} from "./pages/main/MainPage";
import {ProfilePage} from "./pages/profile/ProfilePage";
import {SettingsPage} from "./pages/settings/SettingsPage";
import {ConstructorPage} from "./pages/constructor/ConstructorPage";


export const useRoutes = (isAuth) => {
    if (isAuth){
        return (
            <Switch>
                <Route exact path="/">
                    <MainPage/>
                </Route>
                <Route exact path="/profile">
                    <ProfilePage/>
                </Route>
                <Route exact path="/settings">
                    <SettingsPage/>
                </Route>
                <Route exact path="/build">
                    <ConstructorPage/>
                </Route>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route exact path="/">
                <AuthPage/>
            </Route>
        </Switch>
    )
}
