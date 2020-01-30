import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const FormikForm = ({ values, errors, touched,status }) => {
    const [users, setUsers] = useState([]);
    useEffect(() =>{
        console.log('status has changed');
        status && setUsers( animals => [...users,status])
    },[status])
    return (
      <div className="animal-form">
        <Form>
          <label htmlFor="name">
            Name:
            <Field id="name" type="text" name="name" />
            {touched.name && errors.name && (
              <p className="errors">{errors.name}</p>
            )}
          </label>
          <label htmlFor="email">
            Email:
            <Field id="email" type="text" name="email" />
            {touched.email && errors.email && (
              <p className="errors">{errors.email}</p>
            )}
          </label>
          <label htmlFor="password">
            Password:
            <Field id="password" type="password" name="password" />
            {touched.password && errors.password && (
              <p className="errors">{errors.password}</p>
            )}
          </label>
          <label htmlFor="terms" className="checkbox-container">
            Terms of Service:<span></span>
            <Field
              id="terms"
              type="checkbox"
              name="terms"
              check={values.terms}
            />
            {touched.terms && errors.terms && (
              <p className="errors">{errors.terms}</p>
            )}
            <span className="checkmark" />
          </label>
          <button type="submit">Submit!</button>
        </Form>
        {users.map(user => (
          <ul key={user.name}>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>Password: {passwordEncrypt(user.password)}</li>
          </ul>
        ))}
      </div>
    );
};
const FormikOnboardingForm = withFormik({
  mapPropsToValues({ name, email, password, terms }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required(),
    terms: Yup.boolean().oneOf([true],"Must accept the terms")
  }),
  handleSubmit(values,{setStatus}) {
      console.log("submitting",values)
      axios.post("https://reqres.in/api/Users", values)
      .then(res => {
          console.log('success',res);
          setStatus(res.data)
      })
      .catch(err => {
          console.log(err.response);
      })
  }
})(FormikForm);

function passwordEncrypt(pass) {
    let pw = ""
    for(let i=0;i<pass.length;i++){
        pw += "*";
    }
    return pw;
}
export default FormikOnboardingForm;
