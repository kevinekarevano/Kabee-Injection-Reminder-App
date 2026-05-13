import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
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
        navigate("/user");
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
        },
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
    <div className="min-h-screen bg-[#f7f4ec] font-poppins text-[#24302b] flex items-center justify-center py-12 px-4">
      <div className="absolute top-6 left-6">
        <img src="/logo.svg" alt="Kabee" className="w-14 md:w-40" />
      </div>

      <div className="w-full max-w-lg">
        <div className="mx-auto rounded-2xl border border-[#dde4db] bg-white px-6 py-7 shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:px-8">
          <div className="mb-4 items-center text-center  gap-4">
            <h2 className="text-2xl font-semibold text-[#223530]">Welcome to Kabee</h2>
            <p className="text-sm text-[#5d6f69]">Login to access your dashboard and manage reminders.</p>
          </div>

          <form onSubmit={submitHandler} className="mx-auto grid max-w-md gap-4">
            <div className="w-full">
              <Label htmlFor="username" className="text-sm font-medium text-[#24352f]">
                Username
              </Label>
              <Input
                required
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="w-full rounded-md border border-[#e6ece6] bg-white px-3 py-2 text-sm text-[#24352f]"
                type="text"
                id="username"
                placeholder="Enter your username"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="password" className="text-sm font-medium text-[#24352f]">
                Password
              </Label>
              <Input
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full rounded-md border border-[#e6ece6] bg-white px-3 py-2 text-sm text-[#24352f]"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button className="inline-flex items-center gap-2 rounded-full bg-[#2f7c6d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#275f55]">{loading ? <Loader className="w-4 h-4" /> : "Login"}</Button>
              <Link to="/" className="text-sm cursor-pointer text-[#5d6f69] underline">
                Return to Homepage
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
