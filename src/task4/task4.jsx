import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './task4.css'

export function Task4() {
  const navigate = useNavigate(); // for client-side routing
  const [passwordStrength, setPasswordStrength] = useState("");

  // Password strength check
  const checkStrength = (password) => {
    let strength = "Weak";
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      strength = "Strong";
    } else if (password.length >= 6) {
      strength = "Medium";
    }
    setPasswordStrength(strength);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.userid) {
      errors.userid = "User ID is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      userid: '',
      password: '',
      email: ''
    },
    validate,
    onSubmit: (user) => {
      axios.post(`http://127.0.0.1:4040/users`, user).then(() => {
        alert('Registered Successfully!');
        navigate("/thankyou"); // client-side routing after registration
      });
    }
  });

  return (
    <div className="container p-4 bg-light rounded shadow mt-4" style={{ maxWidth: '500px' }}>
      <h3 className="mb-3 text-center text-primary">Register</h3>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label">User ID</label>
          <input
            type="text"
            name="userid"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.userid}
          />
          {formik.errors.userid && <div className="text-danger">{formik.errors.userid}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={(e) => {
              formik.handleChange(e);
              checkStrength(e.target.value);
            }}
            value={formik.values.password}
          />
          {formik.errors.password && <div className="text-danger">{formik.errors.password}</div>}
          {formik.values.password && (
            <div className={`mt-1 text-${passwordStrength === "Strong" ? "success" : passwordStrength === "Medium" ? "warning" : "danger"}`}>
              Strength: {passwordStrength}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <div className="text-danger">{formik.errors.email}</div>}
        </div>

        <button type="submit" className="btn btn-warning w-100">Register</button>
      </form>
    </div>
  );
}
