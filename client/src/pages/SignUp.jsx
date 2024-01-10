import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const FETCH_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error"
}

const initialState = {
  username: "",
  email: "",
  password: ""
}

const handleChange = (e, setFormData) => {
  setFormData((prev) => ({
    ...prev, 
    [e.target.id]: e.target.value
  }))
}

const handleSubmit = async (e, formData, setStatus, setError, navigate) => {
  e.preventDefault();

  try {
    setStatus(FETCH_STATUS.LOADING)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    
    if ("success" in data && !data.success) {
      setStatus(FETCH_STATUS.ERROR);
      setError(data.message);
      return;
    }
    setStatus(FETCH_STATUS.SUCCESS);
    navigate("/sign-in");

  } catch (error) {
    console.log("errorrrr", error)
    setStatus(FETCH_STATUS.ERROR)
    setError(error)
  }
}

export default function SignUp() {

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(FETCH_STATUS.IDLE);
  const navigate = useNavigate();

  const isLoading = useMemo(() => status === FETCH_STATUS.LOADING, [status]);
  const isSuccess = useMemo(() => status === FETCH_STATUS.SUCCESS, [status]);
  const isError = useMemo(() => status === FETCH_STATUS.ERROR, [status]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form
        onSubmit={(e) => handleSubmit(e, formData, setStatus, setError, navigate)}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={(e) => handleChange(e, setFormData)}
        />
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={(e) => handleChange(e, setFormData)}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={(e) => handleChange(e, setFormData)}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
           { isLoading ? "Loading ..." : "SignUp" }
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">
        { isError && `Something went wrong! and the error is ${error}`  }
      </p>
    </div>
  )
}
