import './task3.css';
import { useFormik } from "formik"
import axios from "axios";

export function Task3(){
       

    const formik = useFormik({
         initialValues:{
            userid:'',
            password:'',
            email:''
         },
         onSubmit : (user)=>{
            axios.post(`http://127.0.0.1:4040/users`,user).then(()=>{
                console.log('posted...');
            })
            alert('Registered Successfully..');
         }
    })

    return(
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2 className='fw-bold text-primary'>Task 3 Form</h2>
                <p className='text-muted'>Please fill the form below to register</p>
            </div>
            <div className="p-4 bg-light rounded shadow mx-auto" style={{maxWidth:'500px'}}>
                <form onSubmit={formik.handleSubmit}>
                    <dl>
                        <dt>User id</dt>
                        <dd><input   type="text" onChange={formik.handleChange} className="form-control" name="userid"/></dd>
                        <dt>Password</dt>
                        <dd><input  type="password" onChange={formik.handleChange} className="form-control" name="password"/></dd>
                        <dt>Email</dt>
                        <dd><input type="email" onChange={formik.handleChange} className="form-control" name="email" /></dd>
                    </dl>
                    <button className="btn btn-warning w-100" type="submit">Register</button>
                    
                </form>
            </div>
            <footer className='text-center mt-5 text-muted small'>
                &copy; 2025 Cognifying
            </footer>
        </div>
    );
}
