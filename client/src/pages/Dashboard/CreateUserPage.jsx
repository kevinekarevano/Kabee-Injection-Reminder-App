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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contraceptiveMethod, setContraceptiveMethod] = useState("injection");
  const [dailyPillTime, setDailyPillTime] = useState("");
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
    setWeight("");
    setHeight("");
    setNumberOfChildren("");
    setBirthDate("");
    setAddress("");
    setReligion("");
    setPhoneNumber("");
    setContraceptiveMethod("injection");
    setDailyPillTime("");
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

    if (!username.trim() || !nik.trim() || !weight.trim() || !height.trim() || !numberOfChildren.trim() || !birthDate || !address.trim() || !religion || !phoneNumber.trim() || !password.trim() || !avatarFile) {
      toast.warning("Please provide all required fields");
      setIsLoading(false);
      return;
    }

    if (contraceptiveMethod === "pill" && !dailyPillTime) {
      toast.warning("Please provide daily pill time for pill method");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("nik", nik);
    formData.append("weight", weight);
    formData.append("height", height);
    formData.append("numberOfChildren", numberOfChildren);
    formData.append("birthDate", birthDate);
    formData.append("address", address);
    formData.append("religion", religion);
    formData.append("phoneNumber", phoneNumber);
    formData.append("password", password);
    formData.append("avatar", avatarFile);
    formData.append("contraceptiveMethod", contraceptiveMethod);
    if (contraceptiveMethod === "pill" && dailyPillTime) formData.append("dailyPillTime", dailyPillTime);

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
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Create User</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="username" placeholder="Enter username..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="nik">
              NIK <span className="text-red-500">*</span>
            </Label>
            <Input value={nik} onChange={(e) => setNik(e.target.value)} required className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="nik" placeholder="Enter NIK..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="birthDate">
              Birth Date <span className="text-red-500">*</span>
            </Label>
            <Input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="border-[#dde4db] bg-white text-[#24302b] [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-75"
              type="date"
              id="birthDate"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]">Method</Label>
            <Select onValueChange={(e) => setContraceptiveMethod(e)} value={contraceptiveMethod}>
              <SelectTrigger className="w-full border-[#dde4db] bg-white text-[#24302b]">
                <SelectValue placeholder="Choose method" />
              </SelectTrigger>
              <SelectContent className="border-[#dde4db] bg-white text-[#24302b]">
                <SelectItem value="injection">Suntik</SelectItem>
                <SelectItem value="pill">Pil (harian)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={contraceptiveMethod === "pill" ? "" : "hidden"}>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="dailyPillTime">
              Waktu Harian Pil <span className="text-red-500">*</span>
            </Label>
            <Input value={dailyPillTime} onChange={(e) => setDailyPillTime(e.target.value)} required={contraceptiveMethod === "pill"} className="border-[#dde4db] bg-white text-[#24302b]" type="time" id="dailyPillTime" />
          </div>

          <div />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="weight">
              Weight (kg) <span className="text-red-500">*</span>
            </Label>
            <Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"
              type="number"
              id="weight"
              placeholder="Enter weight..."
              min="1"
              step="0.1"
            />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="height">
              Height (cm) <span className="text-red-500">*</span>
            </Label>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"
              type="number"
              id="height"
              placeholder="Enter height..."
              min="1"
              step="0.1"
            />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="numberOfChildren">
              Number of Children <span className="text-red-500">*</span>
            </Label>
            <Input
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
              required
              className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"
              type="number"
              id="numberOfChildren"
              placeholder="Enter number of children..."
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="address" placeholder="Enter address..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]">
              Religion <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(e) => setReligion(e)} value={religion}>
              <SelectTrigger className="w-full border-[#dde4db] bg-white text-[#24302b]">
                <SelectValue placeholder="Choose religion" />
              </SelectTrigger>
              <SelectContent className="border-[#dde4db] bg-white text-[#24302b]">
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
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"
              type="tel"
              id="phoneNumber"
              placeholder="Enter phone number..."
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="relative">
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#dde4db] bg-white pr-10 text-[#24302b] placeholder:text-[#8b9a93]"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password..."
            />
            <Button type="button" onClick={togglePasswordVisibility} className="absolute right-0 top-6 cursor-pointer border-none bg-transparent text-[#72827a] hover:border-none hover:bg-transparent hover:text-[#24302b]">
              {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="mt-5 sm:w-1/3">
          <Label className="font-medium text-[#24302b]" htmlFor="avatar">
            Avatar Image <span className="text-red-500">*</span>
          </Label>

          <div className="flex items-center gap-2">
            <Input onChange={handleAvatarChange} accept=".jpg,.jpeg,.png" required className="border-[#dde4db] bg-white text-[#5d6f69] file:font-bold file:text-white" type="file" id="avatar" />

            <Avatar className="h-15 w-15 cursor-pointer border-2 border-[#dde4db] shadow-md">
              <AvatarImage className="object-cover" src={avatarPreview ? avatarPreview : "/no-image.png"} />
              <AvatarFallback className="bg-[#2f7c6d] font-poppins text-xl font-bold text-white">KB</AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-10 flex gap-2">
            <Button disabled={isLoading} type="submit" className={`${isLoading ? "bg-[#2f7c6d] hover:bg-[#2f7c6d]" : "bg-[#2f7c6d] hover:bg-[#275f55]"} mb-5 w-1/2 cursor-pointer font-bold text-white duration-500 sm:mb-0`}>
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
              <Button disabled={isLoading} className="cursor-pointer bg-[#c34a39] font-bold text-white duration-500 hover:bg-[#ab3e30]">
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
