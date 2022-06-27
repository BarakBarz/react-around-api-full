import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onSubmit }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ values });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div className="non-authorized-zone">
      <h2 className="non-authorized-zone__title">Log in</h2>
      <form className="non-authorized-zone__form" onSubmit={handleSubmit}>
        <input
          className="non-authorized-zone__input"
          id="email"
          type="text"
          value={values.email}
          required
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="non-authorized-zone__input"
          id="password"
          type="password"
          value={values.password}
          required
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit" className="non-authorized-zone__button">
          Log in
        </button>
      </form>
      <Link to="/signup" className="non-authorized-zone__link link">
        Not a member yet? Sign up here!
      </Link>
    </div>
  );
};

export default Login;

