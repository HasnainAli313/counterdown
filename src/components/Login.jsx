
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("User logged in successfully!");
      navigate("./taskboard")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
    
    <div className="credentials border  border-gray-500 p-5 rounded-xl flex justify-center text-center mt-10 flex-col w-[30%] m-auto">
      <h2 className="text-3xl font-semibold p-2 ">Login</h2>
      <input className="border border-black p-1 m-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="border border-black p-1 m-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="p-1 border m-auto  w-20 bg-blue-400 hover:bg-blue-500" onClick={handleLogin}>Login</button>
    </div>
   
    </>
  );
}

export default Login;
