import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";

export function Task5() {
    const [users, setUsers] = useState([]);
    const [editingUserid, setEditingUserid] = useState(null);

    const validationSchema = Yup.object({
        userid: Yup.string().required("User ID is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
    });

    const formik = useFormik({
        initialValues: {
            userid: '',
            password: '',
            email: ''
        },
        validationSchema: validationSchema,
        onSubmit: (user) => {
            if (editingUserid) {
                // Edit mode
                axios.put(`http://127.0.0.1:4040/edit-register/${editingUserid}`, user)
                    .then(() => {
                        alert('User Updated Successfully');
                        setEditingUserid(null);
                        formik.resetForm();
                        loadUsers();
                    })
                    .catch((err) => {
                        alert('Error updating user.');
                        console.error(err);
                    });
            } else {
                // Add mode
                axios.post(`http://127.0.0.1:4040/users`, user)
                    .then(() => {
                        alert('Registered Successfully');
                        formik.resetForm();
                        loadUsers();
                    })
                    .catch((err) => {
                        alert('Server Error. Try again.');
                        console.error(err);
                    });
            }
        }
    });

    function loadUsers() {
        axios.get("http://127.0.0.1:4040/users")
            .then(res => {
                setUsers(res.data);
            });
    }

    function handleDelete(userid) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios.delete(`http://127.0.0.1:4040/delete/${userid}`)
                .then(() => {
                    alert("User deleted");
                    loadUsers();
                })
                .catch((err) => {
                    alert("Failed to delete");
                    console.error(err);
                });
        }
    }

    function handleEdit(user) {
        formik.setValues({
            userid: user.userid,
            password: user.password,
            email: user.email
        });
        setEditingUserid(user.userid);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="container p-4">
            <div className="row">
                <div className="col-md-6">
                    <h3>{editingUserid ? "Edit User" : "Register User"}</h3>
                    <form onSubmit={formik.handleSubmit}>
                        <dl>
                            <dt>User ID</dt>
                            <dd>
                                <input type="text" name="userid" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.userid} className="form-control" />
                                {formik.touched.userid && formik.errors.userid && <span className="text-danger">{formik.errors.userid}</span>}
                            </dd>

                            <dt>Password</dt>
                            <dd>
                                <input type="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} className="form-control" />
                                {formik.touched.password && formik.errors.password && <span className="text-danger">{formik.errors.password}</span>}
                            </dd>

                            <dt>Email</dt>
                            <dd>
                                <input type="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} className="form-control" />
                                {formik.touched.email && formik.errors.email && <span className="text-danger">{formik.errors.email}</span>}
                            </dd>
                        </dl>
                        <button className="btn btn-primary" type="submit">
                            {editingUserid ? "Update" : "Register"}
                        </button>
                        {editingUserid && (
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                                formik.resetForm();
                                setEditingUserid(null);
                            }}>Cancel</button>
                        )}
                    </form>
                </div>

                <div className="col-md-6">
                    <h3>Registered Users</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userid}>
                                    <td>{user.userid}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.userid)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
