import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onSubmit }) => {
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
      <h2 className="non-authorized-zone__title">Sign up</h2>
      <form className="non-authorized-zone__form" onSubmit={handleSubmit}>
        <input
          className="non-authorized-zone__input"
          id="email"
          type="text"
          value={values.email || ''}
          required
          name="email"
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="non-authorized-zone__input"
          id="password"
          type="password"
          value={values.password || ''}
          required
          name="password"
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit" className="non-authorized-zone__button">
          Sign up
        </button>
      </form>
      <Link to="/signin" className="non-authorized-zone__link link">
        Already a member? Log in here!
      </Link>
    </div>
  );
};

export default Register;

