import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import FormGroup from "components/forms/FormGroup";
import FormGeneralError from "components/forms/GeneralError";
import ButtonContainer from "components/forms/ButtonContainer";
import { REGISTER_FAILURE, REGISTER_SUCCESS } from "actions/auth/types";
import registerUser from "actions/auth/register";
import loginUser from "actions/auth/login";

export default function RegisterForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    clearError,
    setError,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
    },
  });
  const { isSubmitting } = formState;
  const currentPassword = watch("password", "");

  const onSubmit = async (data) => {
    clearError();
    try {
      const action = await dispatch(registerUser(data));
      if (action.type === REGISTER_FAILURE) {
        Object.keys(action.data).map((errorKey) => {
          return setError(errorKey, "general", action.data[errorKey][0]);
        });
      } else if (action.type === REGISTER_SUCCESS) {
        try {
          await dispatch(
            loginUser({ username: data.username, password: data.password }),
          );
          history.push("/dashboard/home");
        } catch (error) {
          console.log("Error...", error);
        }
      }
    } catch (error) {
      console.log("general error...", error);
      setError("form", "general", "Unable to register at this time.");
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <FormGroup
        name="username"
        label="Username"
        error={errors.username}
        inputProps={{
          ref: register({ required: "username is required" }),
        }}
      />
      <FormGroup
        name="email"
        label="Email"
        error={errors.email}
        inputProps={{
          ref: register({ required: "email is required" }),
        }}
      />
      <FormGroup
        name="firstName"
        label="First name"
        error={errors.firstName}
        inputProps={{
          ref: register({ required: "first name is required" }),
        }}
      />
      <FormGroup
        name="lastName"
        label="Last name"
        error={errors.lastName}
        inputProps={{
          ref: register,
        }}
      />
      <FormGroup
        name="password"
        label="Password"
        error={errors.password}
        inputProps={{
          type: "password",
          ref: register({
            required: "password is required",
            minLength: {
              value: 6,
              message: "password must be at least 6 characters",
            },
          }),
        }}
      />
      <FormGroup
        name="rePassword"
        label="Password (repeat)"
        error={errors.rePassword}
        inputProps={{
          type: "password",
          ref: register({
            validate: (value) =>
              value === currentPassword || "The passwords do not match",
          }),
        }}
      />
      <FormGeneralError error={errors.detail && errors.detail.message} />
      <ButtonContainer isSubmitting={isSubmitting}>Register</ButtonContainer>
    </Form>
  );
}
