import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";
import useAppStore from "@/stores/useAppStore";

const LoginPage = () => {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAppStore((state) => state.setIsLoggedIn);
  const isAuthChecked = useAppStore((state) => state.isAuthChecked);
  const getAuthState = useAppStore((state) => state.getAuthState);
  const userData = useAppStore((state) => state.userData);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && isAuthChecked && userData) {
      if (userData.role === "admin") {
        navigate("/dashboard");
      } else if (userData.role === "user") {
        navigate("/");
      }
    }
  }, [isLoggedIn, isAuthChecked, userData, navigate]);

  if (!isAuthChecked) {
    return null;
  }

  if (isLoggedIn) {
    return null;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { username, password },
        {
          withCredentials: true, // Include cookies in the request

          validateStatus: (status) => {
            return status < 500; // Resolve only if the status code is less than 500
          },
        }
      );
      if (data.success) {
        toast.success(`👋 ${data.message}`, { icon: false });
        await getAuthState(); // Tunggu userData ke-update
        setIsLoggedIn(true); // Trigger useEffect untuk redirect sesuai role
      } else {
        toast.warning(`🥲 ${data.message}`, {
          icon: false,
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b dark from-[#B7E1E4] via-[#8DC1C1] to-[#4D7A7F]">
      <div className="fixed cursor-pointer top-5 left-5">
        <img className="w-24 lg:w-36" src="/logo.svg" alt="" />
      </div>
      <div className="flex  flex-col w-full  h-full justify-center  ">
        <div className="flex text-[#0B2E33] mt-5 font-poppins  font-medium  justify-center  items-center">
          <p className="text-2xl md:text-4xl  ">Welcome To </p>
          <img className="w-20 md:w-32 mx-2 sm:mx-4" src="/logo.svg" alt="" />
          <p className="text-2xl sm:text-4xl ">👋</p>
        </div>
        <form onSubmit={submitHandler} className="flex  flex-col justify-center items-center  px-5 mt-10">
          <div className="grid w-full font-inter mb-5 max-w-sm items-center gap-1.5">
            <Label className={"text-[#0B2E33]  font-bold"} htmlFor="username">
              Username
            </Label>
            <Input required onChange={(e) => setUsername(e.target.value)} value={username} className={"border-[#0B2E33] border-2 py-5  placeholder:text-[#455254]"} type="text" id="username" placeholder="Enter your username here.. " />
          </div>
          <div className="grid w-full font-inter max-w-sm mb-7 items-center gap-1.5">
            <Label className={"text-[#0B2E33]  font-bold"} htmlFor="password">
              Password
            </Label>
            <Input required onChange={(e) => setPassword(e.target.value)} value={password} className={"border-[#0B2E33] border-2  py-5  placeholder:text-[#455254]"} type="password" id="password" placeholder="Enter your password here.. " />
          </div>
          <div className="grid w-full font-inter max-w-sm items-center gap-1.5 ">
            <Button className={"font-inter font-bold py-5 hover:bg-[#0b2e33dc] cursor-pointer hover:text-[#b8e3e9] bg-[#0B2E33] text-lg text-[#B8E3E9]"}>{loading ? <Loader className={"w-6 h-6"} /> : "Login"}</Button>
            <p onClick={() => window.open("https://web.telegram.org", "_blank")} className="text-end underline-offset-1 underline text-sm cursor-pointer text-[#0B2E33] ">
              Forgot Password?{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
