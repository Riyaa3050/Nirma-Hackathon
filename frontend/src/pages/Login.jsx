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
    name: "",
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

      if (res.data.success) {
        dispatch(login(res.data.message));
        res.data.message.role === "ADMIN" ? navigate("/dashboard") : navigate("/user");
        toast.success(`Welcome ${res.data.message.name}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96 text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {isSignup && (
            <input
              type="text"
              name="phoneNumber"
              placeholder="Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-600"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
          <button
            className="text-indigo-500 font-semibold hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;