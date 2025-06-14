import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export function Task2() {

    const validationSchema = Yup.object({
        userid: Yup.string()
            .required("User ID is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters long")
            .required("Password is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required")
    });

    const formik = useFormik({
        initialValues: {
            userid: '',
            password: '',
            email: ''
        },
        validationSchema: validationSchema,
        onSubmit: (user) => {
            axios.post(`http://127.0.0.1:4040/users`, user)
                .then(() => {
                    alert('Registered Successfully.');
                })
                .catch((err) => {
                    alert('Server Error. Try again.');
                    console.error(err);
                });
        }
    });

    return (
        <div className="container p-4 w-50 bg-light">
            <h3>Task 2 Form</h3>
            <form onSubmit={formik.handleSubmit}>
                <dl>
                    <dt>User ID</dt>
                    <dd>
                        <input type="text" name="userid" onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
                        {formik.touched.userid && formik.errors.userid && <span className="text-danger">{formik.errors.userid}</span>}
                    </dd>

                    <dt>Password</dt>
                    <dd>
                        <input type="password" name="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
                        {formik.touched.password && formik.errors.password && <span className="text-danger">{formik.errors.password}</span>}
                    </dd>

                    <dt>Email</dt>
                    <dd>
                        <input type="email" name="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" />
                        {formik.touched.email && formik.errors.email && <span className="text-danger">{formik.errors.email}</span>}
                    </dd>
                </dl>
                <button className="btn btn-warning" type="submit">Register</button>
            </form>
        </div>
    );
}
