import React, {useContext} from "react";
import "./AuthPage.css";
import $ from "jquery";
import {AuthContext} from "./AuthContext";

//TODO Адаптивность приложения.

export const AuthPage = () => {
    const auth = useContext(AuthContext);

    const action_btn = () => {
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(this).removeClass("idle").addClass("active");
    }

    const action_btn_signup = () => {
        $(".nav").toggleClass("nav-up");
        $(".form-signup-left").toggleClass("form-signup-down");
        $(".success-signup").toggleClass("success-left-signup");
    }


    const action_btn_signin = () => {
        $(".btn-animate").toggleClass("btn-animate-grow");
        $(".frame").toggleClass("main-page");
        setTimeout(() => {
            $("#content").hide();
            $(".nav").hide();
            $(".success").toggleClass("success-left");
            $(".frame").toggleClass("content-center");
        }, 1000)
        setTimeout(() => {
            auth.login('token');
        }, 4000);
    }

    const action_btn_back_signin = () => {
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(".frame").toggleClass("frame-long");
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".nav").toggleClass("nav-up");
        $(".form-signup-left").toggleClass("form-signup-down");
        $(".success-signup").toggleClass("success-left-signup");
    }

    return (
        <div className="container">
            <div className="frame">
                <div className="nav">
                    <ul className="links">
                        <li className="signin-active"><a className="btn" onClick={() => action_btn()}>Sign in</a></li>
                        <li className="signup-inactive"><a className="btn" onClick={() => action_btn()}>Sign up </a></li>
                    </ul>
                </div>
                <div id="content" ng-app ng-init="checked = false">
                    <form className="form-signin" action="" method="post" name="form">
                        <label htmlFor="username">Username</label>
                        <input className="form-styling" type="text" name="username" placeholder=""/>
                        <label htmlFor="password">Password</label>
                        <input className="form-styling" type="text" name="password" placeholder=""/>
                        <input type="checkbox" id="checkbox"/>
                        <label htmlFor="checkbox"><span className="ui"/>Keep me signed in</label>
                        <div className="btn-animate">
                            <a className="btn-signin" onClick={() => action_btn_signin()}>Sign in</a>
                        </div>
                    </form>
                    <form className="form-signup" action="" method="post" name="form">
                        <label htmlFor="username">Username</label>
                        <input className="form-styling" type="text" name="fullname" placeholder=""/>
                        <label htmlFor="email">Email</label>
                        <input className="form-styling" type="text" name="email" placeholder=""/>
                        <label htmlFor="password">Password</label>
                        <input className="form-styling" type="text" name="password" placeholder=""/>
                        <label htmlFor="confirmpassword">Confirm password</label>
                        <input className="form-styling" type="text" name="confirmpassword" placeholder=""/>
                        <a ng-click="checked = !checked" className="btn-signup" onClick={() => {action_btn_signup()}}>Sign Up</a>
                    </form>
                    <div className="success-signup">
                        <div className="successtext-signup">
                            <p>You have successfully registered!</p>
                            <div className="btn-animate">
                                <a className="btn-back-signin" onClick={() => action_btn_back_signin()}>Back to sign in</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="success">
                    <div className="successtext">
                        <p>Welcome user!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}