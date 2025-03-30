import BASEURL from "@/lib/Url";
import { login } from "@/store/userSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name : "",
    email: "",
    password: "",
    phoneNumber: "", 
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authRoute = isSignup ? "signup" : "login";

    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const res = await axios.post(`${BASEURL}/auth/${authRoute}`, payload, {
        withCredentials: true,
      });

      // console.log(res.data);

      if (res.data.success) {
        dispatch(login(res.data.message));
        res.data.message.role === "ADMIN" ? navigate('/dashboard') : navigate('/user')
        toast.success(`Welcome ${res.data.message.name}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {isSignup && (
            <>
            <input
            type="name"
            name="name"
            placeholder="UserName"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle Button */}
        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button className="text-blue-500" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
