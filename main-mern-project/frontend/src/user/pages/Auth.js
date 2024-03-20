import React, { useContext, useState } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import './Auth.css'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            },
        },
        false
    )

    const authCtx = useContext(AuthContext)

    const switchModeHandler = () => {
        if (!isLogin) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            )
        }
        setIsLogin(prevMode => !prevMode)
    }

    const authSubmitHandler = (event) => {
        event.preventDefault()
        console.log(formState.inputs);
        authCtx.login()
    }

    return (
        <Card className='authentication' >
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler} >
                {
                    !isLogin &&
                    <Input
                        element='input'
                        id='name'
                        type='text'
                        label='Your Name'
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText='Please enter your name'
                        onInput={inputHandler}
                    />
                }
                <Input
                    element='input'
                    id='email'
                    type='email'
                    label='E-mail'
                    validators={[VALIDATOR_EMAIL()]}
                    errorText='Please enter a valid email address'
                    onInput={inputHandler}
                />
                <Input
                    element='input'
                    id='password'
                    type='password'
                    label='Password'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please enter a valid password (min 5 characters)'
                    onInput={inputHandler}
                />
                <Button type='submit' disabled={!formState.isValid} >Login</Button>
            </form>
            <Button inverse onClick={switchModeHandler} >{isLogin ? 'REGISTER' : 'LOG IN'}</Button>
        </Card>
    )
}

export default Auth