import { useState } from "react";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("user"); // "user" or "admin"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${isSignup ? "Signup" : "Login"} as ${role}`, formData);
    // API Call here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignup ? "Sign Up" : "Login"} as {role === "user" ? "User" : "Admin"}
        </h2>

        {/* Role Selector */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("user")}
          >
            User
          </button>
          <button
            className={`px-4 py-2 rounded ${role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

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
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          {/* Submit Button */}
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle Button */}
        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-blue-500"
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
