import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export function Task6() {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);

  const loginFormik = useFormik({
    initialValues: { userid: "", password: "" },
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:4040/login", values);
        setToken(res.data.token);
        alert("Login successful!");
      } catch {
        alert("Invalid credentials");
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: { userid: "", password: "", email: "" },
    validationSchema: Yup.object({
      userid: Yup.string().required(),
      password: Yup.string().min(6).required(),
      email: Yup.string().email().required(),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:4040/register", values);
        alert("Registered successfully");
      } catch {
        alert("Error in registration");
      }
    },
  });

  async function loadUsers() {
    try {
      const res = await axios.get("http://localhost:4040/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch {
      alert("Unauthorized or error loading users");
    }
  }

  return (
    <div className="container mt-4">
      <h2>User Registration</h2>
      <form onSubmit={registerFormik.handleSubmit}>
        <input name="userid" placeholder="User ID" onChange={registerFormik.handleChange} className="form-control" />
        <input name="password" type="password" placeholder="Password" onChange={registerFormik.handleChange} className="form-control" />
        <input name="email" placeholder="Email" onChange={registerFormik.handleChange} className="form-control" />
        <button className="btn btn-success mt-2" type="submit">Register</button>
      </form>

      <hr />

      <h2>Login</h2>
      <form onSubmit={loginFormik.handleSubmit}>
        <input name="userid" placeholder="User ID" onChange={loginFormik.handleChange} className="form-control" />
        <input name="password" type="password" placeholder="Password" onChange={loginFormik.handleChange} className="form-control" />
        <button className="btn btn-primary mt-2" type="submit">Login</button>
      </form>

      <hr />
      <button className="btn btn-dark" onClick={loadUsers}>Get Users (Protected)</button>
      <ul>
        {users.map((user) => (
          <li key={user.userid}>{user.userid} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
