import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";
import axios from "axios";
import BreadcrumbCustom from "@/components/breadcrumb";
import useAppStore from "@/stores/useAppStore";

const EditUserPage = () => {
  const getAllUser = useAppStore((state) => state.getAllUser);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [nik, setNik] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [password, setPassword] = useState("");
  const [injectionType, setInjectionType] = useState("");
  const [initialInjectionDate, setInitialInjectionDate] = useState("");
  const [isInitialInjectionDateSet, setIsInitialInjectionDateSet] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

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

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const getUserById = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/id/${id}`, {
        withCredentials: true,
      });

      const user = data.data;

      if (data.success) {
        setUsername(user.username || "");
        setNik(user.nik || "");
        setBirthDate(formatDateForInput(user.birthDate));
        setAddress(user.address || "");
        setReligion(user.religion || "");
        setPhoneNumber(user.phoneNumber || "");
        setPassword("");
        setInjectionType(user.injectionType || "");
        setAvatarPreview(user.avatar?.url || null);
        setOriginalName(user.username || "");

        if (user.initialInjectionDate) {
          setIsInitialInjectionDateSet(true);
        } else {
          setInitialInjectionDate("");
          setIsInitialInjectionDateSet(false);
        }
      }
    } catch (error) {
      toast.error("Something wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    // Validasi minimal satu field harus diisi
    if (!username.trim() && !nik.trim() && !birthDate && !address.trim() && !religion && !phoneNumber.trim() && !password.trim() && !injectionType && !avatarFile && !initialInjectionDate) {
      toast.warning("Please provide at least one field to update");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    // Hanya append field yang ada nilainya
    if (username.trim()) formData.append("username", username);
    if (nik.trim()) formData.append("nik", nik);
    if (birthDate) formData.append("birthDate", birthDate);
    if (address.trim()) formData.append("address", address);
    if (religion) formData.append("religion", religion);
    if (phoneNumber.trim()) formData.append("phoneNumber", phoneNumber);
    if (password.trim()) formData.append("password", password);
    if (injectionType) formData.append("injectionType", injectionType);
    if (avatarFile) formData.append("avatar", avatarFile);
    if (initialInjectionDate) formData.append("initialInjectionDate", initialInjectionDate);

    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/api/user/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        getUserById();
        setPassword("");
        setAvatarFile(null);
        toast.success(data.message);
        getAllUser();
      } else {
        toast.warning(data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.warning(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserById();
  }, [id]);

  return (
    <div className="w-full">
      <BreadcrumbCustom pageName={"Detail user"} />
      <h1 className="text-white font-bold text-xl">Edit User - {originalName}</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-3 bg-zinc-700 p-5 rounded-sm">
        {/* Row 1: Username, NIK, Birth Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="username">
              Username
            </Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="username" placeholder="Enter username..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="nik">
              NIK
            </Label>
            <Input value={nik} onChange={(e) => setNik(e.target.value)} className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="nik" placeholder="Enter NIK..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white" htmlFor="birthDate">
              Birth Date
            </Label>
            <Input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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
              Address
            </Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-zinc-800 border-zinc-900 text-zinc-300" type="text" id="address" placeholder="Enter address..." />
          </div>

          <div>
            <Label className="font-medium mb-2 text-white">Religion</Label>
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
              Phone Number
            </Label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-zinc-800 border-zinc-900 text-zinc-300" type="tel" id="phoneNumber" placeholder="Enter phone number..." />
          </div>
        </div>

        {/* Row 3: Password, Injection Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 ">
          <div className="relative">
            <Label className="font-medium mb-2 text-white" htmlFor="password">
              Password <span className="text-sm text-gray-400">(Leave empty to keep current)</span>
            </Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} className="bg-zinc-800 border-zinc-900 pr-10 text-zinc-300" type={showPassword ? "text" : "password"} id="password" placeholder="Enter new password..." />
            <Button type="button" onClick={togglePasswordVisibility} className="absolute border-none bg-transparent hover:border-none hover:bg-transparent cursor-pointer top-6 right-0 text-zinc-500 hover:text-zinc-300">
              {!showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>

          <div className={isInitialInjectionDateSet ? "hidden" : ""}>
            <div>
              <Label className="font-medium mb-2 text-white" htmlFor="initialInjectionDate">
                Initial Injection Date
              </Label>
              <Input
                value={initialInjectionDate}
                onChange={(e) => setInitialInjectionDate(e.target.value)}
                className="bg-zinc-800 border-zinc-900 text-zinc-300 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:filter"
                type="date"
                id="initialInjectionDate"
                min={new Date().toISOString().split("T")[0]} // <-- ini membatasi tanggal minimal hari ini
              />
              {!initialInjectionDate && <p className="text-xs text-red-400 mt-2 text-right">Please select an Initial Injection Date.</p>}
            </div>
          </div>

          <div>
            <Label className="font-medium mb-2 text-white">Injection Type</Label>
            <Select onValueChange={(e) => setInjectionType(e)} value={injectionType}>
              <SelectTrigger className="w-full bg-zinc-800 border-zinc-900 text-zinc-300">
                <SelectValue placeholder="Choose type of injection" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-zinc-200 border-none">
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_month">3 Month</SelectItem>
              </SelectContent>
            </Select>
            {!injectionType && <p className="text-xs text-red-400 mt-2 text-right">Please select an injection type.</p>}
          </div>
        </div>

        {/* Avatar Section */}
        <div className="sm:w-1/3 mt-5">
          <Label className="font-medium text-white" htmlFor="avatar">
            Avatar Image <span className="text-sm text-gray-400">(Leave empty to keep current)</span>
          </Label>

          <div className="flex items-center gap-2">
            <Input onChange={handleAvatarChange} accept=".jpg,.jpeg,.png" className="bg-zinc-800 file:text-white file:font-bold border-zinc-900 text-zinc-400" type="file" id="avatar" />

            <Avatar className="cursor-pointer w-15 h-15 border-zinc-800 shadow-md border-2">
              <AvatarImage className="object-cover" src={avatarPreview ? avatarPreview : "/no-image.png"} />
              <AvatarFallback className="font-poppins font-bold text-xl text-white bg-[#0B2E33]">KB</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex mt-10 gap-2">
            <Button disabled={isLoading} type="submit" className={`${isLoading ? "bg-sky-900 hover:bg-sky-900" : "bg-sky-300 hover:bg-sky-400"} w-1/2 text-sky-900 hover:text-sky-950 duration-500 font-bold cursor-pointer`}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Update
                  <Pencil className="w-4" />
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

export default EditUserPage;
