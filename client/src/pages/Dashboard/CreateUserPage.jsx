import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";
import axios from "axios";
import useAppStore from "@/stores/useAppStore";

const CreateUserPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [injectionType, setInjectionType] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const getAllUser = useAppStore((state) => state.getAllUser);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    if (!username.trim() || !password.trim() || !injectionType || !avatarFile) {
      toast.warning("Please provide all required fields");
      setIsLoading(false);

      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("injectionType", injectionType);
    formData.append("avatar", avatarFile);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message);
        setUsername("");
        setPassword("");
        setInjectionType("");
        setAvatarFile(null);
        setAvatarPreview(null);
        getAllUser();
      } else {
        toast.warning(`🥲 ${data.message}`, {
          icon: false,
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.warning(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan saat membuat pengguna, silakan coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-white font-bold text-xl">Create User</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-3 bg-zinc-700 p-5 rounded-sm">
        <div className="sm:flex gap-5">
          <div className="sm:w-1/2 mb-5 sm:mb-0">
            <Label className={"font-medium mb-2 text-white "} htmlFor="username">
              Username <span className="text-red-800">*</span>
            </Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required className={"bg-zinc-800 border-zinc-900 text-zinc-300"} type="text" id="username" placeholder="Enter the username... " />
          </div>

          <div className="sm:w-1/2 mb-5 sm:mb-0 relative">
            <Label className={"font-medium mb-2 text-white "} htmlFor="password">
              Password <span className="text-red-800">*</span>
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={"bg-zinc-800 border-zinc-900 pr-10 text-zinc-300"}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter the password... "
            />
            <Button type="button" onClick={togglePasswordVisibility} className="absolute border-none bg-transparent hover:border-none hover:bg-transparent cursor-pointer top-6 right-0 text-zinc-500 hover:text-zinc-300 ">
              {!showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>

          <div className="sm:w-1/2 mb-5 sm:mb-0">
            <Label className={"font-medium mb-2 text-white "}>
              Injection Type <span className="text-red-800">*</span>
            </Label>

            <Select onValueChange={(e) => setInjectionType(e)} value={injectionType}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-900 text-zinc-300">
                <SelectValue placeholder="Choose type of injection" />
              </SelectTrigger>
              <SelectContent className={"bg-zinc-800 text-zinc-200 border-none"}>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_month">3 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="sm:w-1/3 mt-5">
          <Label className={"font-medium text-white "} htmlFor="username">
            Avatar image <span className="text-red-800">*</span>
          </Label>

          <div className="flex items-center gap-2">
            <Input onChange={handleAvatarChange} accept=".jpg,.jpeg,.png" required className={"bg-zinc-800 file:text-white file:font-bold  border-zinc-900 text-zinc-400"} type="file" placeholder="Enter the username... " />

            <Avatar className=" cursor-pointer w-15 h-15  border-zinc-800 shadow-md border-2 ">
              <AvatarImage className={" object-cover"} src={avatarPreview ? avatarPreview : "/no-image.png"} />
              <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-[#0B2E33]"}>KB</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex mt-10  gap-2">
            <Button disabled={isLoading} type="submit" className={`${isLoading ? "bg-sky-900 hover:bg-sky-900" : "bg-sky-300 hover:bg-sky-400"} sm:w-1/2 mb-5 sm:mb-0 text-sky-900   hover:text-sky-950 duration-500 font-bold cursor-pointer`}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Create
                  <UserPlus />
                </>
              )}
            </Button>
            <Link className="block w-full" to={isLoading ? "" : "/dashboard/users"}>
              <Button disabled={isLoading} className={"bg-red-300  text-red-900  hover:bg-red-400 hover:text-red-950 duration-500 font-bold cursor-pointer"}>
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
