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
  const [nik, setNik] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
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

  const resetForm = () => {
    setUsername("");
    setNik("");
    setBirthDate("");
    setAddress("");
    setReligion("");
    setPhoneNumber("");
    setPassword("");
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    if (!username.trim() || !nik.trim() || !birthDate || !address.trim() || !religion || !phoneNumber.trim() || !password.trim() || !avatarFile) {
      toast.warning("Please provide all required fields");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("nik", nik);
    formData.append("birthDate", birthDate);
    formData.append("address", address);
    formData.append("religion", religion);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
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
        resetForm();
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
        {/* Row 1: Username, NIK, Birth Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="username">
              Username <span className="text-red-800">*</span>
            </Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="username" placeholder="Enter username..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="nik">
              NIK <span className="text-red-800">*</span>
            </Label>
            <Input value={nik} onChange={(e) => setNik(e.target.value)} required className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="nik" placeholder="Enter NIK..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="birthDate">
              Birth Date <span className="text-red-800">*</span>
            </Label>
            <Input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="bg-zinc-800 border-zinc-900 text-zinc-300 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter"
              type="date"
              id="birthDate"
              max={new Date().toISOString().split("T")[0]} // Membatasi maksimal hari ini
            />
          </div>
        </div>

        {/* Row 2: Address, Religion, Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="address">
              Address <span className="text-red-800">*</span>
            </Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="address" placeholder="Enter address..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white">
              Religion <span className="text-red-800">*</span>
            </Label>
            <Select onValueChange={(e) => setReligion(e)} value={religion}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-900 text-zinc-300">
                <SelectValue placeholder="Choose religion" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-zinc-200 border-none">
                <SelectItem value="Islam">Islam</SelectItem>
                <SelectItem value="Kristen">Kristen</SelectItem>
                <SelectItem value="Katolik">Katolik</SelectItem>
                <SelectItem value="Hindu">Hindu</SelectItem>
                <SelectItem value="Buddha">Buddha</SelectItem>
                <SelectItem value="Konghucu">Konghucu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="phoneNumber">
              Phone Number <span className="text-red-800">*</span>
            </Label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="bg-zinc-800 border-zinc-900 text-zinc-300" type="tel" id="phoneNumber" placeholder="Enter phone number..." />
          </div>

          <div className="relative">
            <Label className="font-medium mb-2 text-white" htmlFor="password">
              Password <span className="text-red-800">*</span>
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-zinc-800 border-zinc-900 pr-10 text-zinc-300"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password..."
            />
            <Button type="button" onClick={togglePasswordVisibility} className="absolute border-none bg-transparent hover:border-none hover:bg-transparent cursor-pointer top-6 right-0 text-zinc-500 hover:text-zinc-300">
              {!showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="sm:w-1/3 mt-5">
          <Label className="font-medium text-white" htmlFor="avatar">
            Avatar Image <span className="text-red-800">*</span>
          </Label>

          <div className="flex items-center gap-2">
            <Input onChange={handleAvatarChange} accept=".jpg,.jpeg,.png" required className="bg-zinc-800 file:text-white file:font-bold border-zinc-900 text-zinc-400" type="file" id="avatar" />

            <Avatar className="cursor-pointer w-15 h-15 border-zinc-800 shadow-md border-2">
              <AvatarImage className="object-cover" src={avatarPreview ? avatarPreview : "/no-image.png"} />
              <AvatarFallback className="font-poppins font-bold text-xl text-white bg-[#0B2E33]">KB</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex mt-10 gap-2">
            <Button disabled={isLoading} type="submit" className={`${isLoading ? "bg-sky-900 hover:bg-sky-900" : "bg-sky-300 hover:bg-sky-400"} sm:w-1/2 mb-5 sm:mb-0 text-sky-900 hover:text-sky-950 duration-500 font-bold cursor-pointer`}>
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
              <Button disabled={isLoading} className="bg-red-300 text-red-900 hover:bg-red-400 hover:text-red-950 duration-500 font-bold cursor-pointer">
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
