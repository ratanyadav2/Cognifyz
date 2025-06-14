import { useFormik } from "formik"
import axios from "axios";

export function Task1(){
       

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
        <div className="container p-4 w-50 bg-light">
            <h3>Normal Form</h3>
            <form onSubmit={formik.handleSubmit}>
                <dl>
                    <dt>User id</dt>
                    <dd><input   type="text" onChange={formik.handleChange} className="form-control" name="userid"/></dd>
                    <dt>Password</dt>
                    <dd><input  type="password" onChange={formik.handleChange} className="form-control" name="password"/></dd>
                    <dt>Email</dt>
                    <dd><input type="email" onChange={formik.handleChange} className="form-control" name="email" /></dd>
                </dl>
                <button className="btn btn-warning" type="submit">Register</button>
                
            </form>
        </div>
    )
}
//Server.cjs file in Views folder mae express or node js ki coding hai