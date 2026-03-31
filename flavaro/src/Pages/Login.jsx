import { Link, useNavigate } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import './Login.css'
import { login } from "../Redux/Slice/authSlice";

function Login(){

  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    console.log("API URL:", import.meta.env.VITE_API_URL);
    const username = e.target.username.value;
    const password = e.target.password.value;

    const result = await dispatch(login({
      username,
      password
    }));

    if(result.meta.requestStatus === "fulfilled"){
      navigate("/");
    }
  };

  return(
    <div className="auth-container">

      <form className="auth-box" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>

        {error && <p className="error-msg">{error}</p>}

        <p>
          Don't have an account?
          <Link to="/register"> Register here</Link>
        </p>

      </form>

    </div>
  )
}

export default Login;