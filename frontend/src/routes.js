import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {AuthPage} from "./pages/auth/AuthPage";
import {MainPage} from "./pages/main/MainPage";


export const useRoutes = (isAuth) => {
    if (isAuth){
        return (
            <Switch>
                <Route exact path="/" children={()=><h2>OK 0</h2>}/>
                <Route exact path="/test1" children={()=><h2>OK 1</h2>}/>
                <Route exact path="/test2" children={()=><h2>OK 2</h2>}/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route exact path="/">
                <AuthPage/>
            </Route>
            <Route exact path="/main/">
                <MainPage/>
            </Route>
            <Redirect to="/"/>
        </Switch>
    )
}
