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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [religion, setReligion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [password, setPassword] = useState("");
  const [injectionType, setInjectionType] = useState("");
  const [contraceptiveMethod, setContraceptiveMethod] = useState("injection");
  const [dailyPillTime, setDailyPillTime] = useState("");
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
        setWeight(user.weight ? user.weight.toString() : "");
        setHeight(user.height ? user.height.toString() : "");
        setNumberOfChildren(user.numberOfChildren ? user.numberOfChildren.toString() : "");
        setBirthDate(formatDateForInput(user.birthDate));
        setAddress(user.address || "");
        setReligion(user.religion || "");
        setPhoneNumber(user.phoneNumber || "");
        setPassword("");
        setInjectionType(user.injectionType || "");
        setContraceptiveMethod(user.contraceptiveMethod || "injection");
        setDailyPillTime(user.dailyPillTime || "");
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
    const shouldRequireInjectionFields = contraceptiveMethod !== "pill";

    if (
      !username.trim() &&
      !nik.trim() &&
      !weight.trim() &&
      !height.trim() &&
      !numberOfChildren.trim() &&
      !birthDate &&
      !address.trim() &&
      !religion &&
      !phoneNumber.trim() &&
      !password.trim() &&
      (shouldRequireInjectionFields ? !injectionType : false) &&
      !avatarFile &&
      !initialInjectionDate
    ) {
      toast.warning("Please provide at least one field to update");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    // Hanya append field yang ada nilainya
    if (username.trim()) formData.append("username", username);
    if (nik.trim()) formData.append("nik", nik);
    if (weight.trim()) formData.append("weight", weight);
    if (height.trim()) formData.append("height", height);
    if (numberOfChildren.trim()) formData.append("numberOfChildren", numberOfChildren);
    if (birthDate) formData.append("birthDate", birthDate);
    if (address.trim()) formData.append("address", address);
    if (religion) formData.append("religion", religion);
    if (phoneNumber.trim()) formData.append("phoneNumber", phoneNumber);
    if (password.trim()) formData.append("password", password);
    if (contraceptiveMethod !== "pill" && injectionType) formData.append("injectionType", injectionType);
    if (contraceptiveMethod) formData.append("contraceptiveMethod", contraceptiveMethod);
    if (contraceptiveMethod === "pill" && dailyPillTime) formData.append("dailyPillTime", dailyPillTime);
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
    <div className="w-full text-[#24302b]">
      <BreadcrumbCustom pageName={"Detail user"} />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Edit User - {originalName}</h1>
      </div>
      <div onSubmit={handleSubmit} className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="username">
              Username
            </Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="username" placeholder="Enter username..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="nik">
              NIK
            </Label>
            <Input value={nik} onChange={(e) => setNik(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="nik" placeholder="Enter NIK..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="birthDate">
              Birth Date
            </Label>
            <Input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-[#dde4db] bg-white text-[#24302b] [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-75"
              type="date"
              id="birthDate"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="weight">
              Weight (kg)
            </Label>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="number" id="weight" placeholder="Enter weight..." min="1" step="0.1" />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="height">
              Height (cm)
            </Label>
            <Input value={height} onChange={(e) => setHeight(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="number" id="height" placeholder="Enter height..." min="1" step="0.1" />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="numberOfChildren">
              Number of Children
            </Label>
            <Input
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(e.target.value)}
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
              Address
            </Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="text" id="address" placeholder="Enter address..." />
          </div>

          <div>
            <Label className="mb-2 font-medium text-[#24302b]">Religion</Label>
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
              Phone Number
            </Label>
            <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]" type="tel" id="phoneNumber" placeholder="Enter phone number..." />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="relative">
            <Label className="mb-2 font-medium text-[#24302b]" htmlFor="password">
              Password <span className="text-sm text-[#72827a]">(Leave empty to keep current)</span>
            </Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#dde4db] bg-white pr-10 text-[#24302b] placeholder:text-[#8b9a93]"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter new password..."
            />
            <Button type="button" onClick={togglePasswordVisibility} className="absolute right-0 top-6 cursor-pointer border-none bg-transparent text-[#72827a] hover:border-none hover:bg-transparent hover:text-[#24302b]">
              {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>

          <div className={isInitialInjectionDateSet || contraceptiveMethod === "pill" ? "hidden" : ""}>
            <div>
              <Label className="mb-2 font-medium text-[#24302b]" htmlFor="initialInjectionDate">
                Initial Injection Date
              </Label>
              <Input
                value={initialInjectionDate}
                onChange={(e) => setInitialInjectionDate(e.target.value)}
                className="border-[#dde4db] bg-white text-[#24302b] [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-75"
                type="date"
                id="initialInjectionDate"
                min={new Date().toISOString().split("T")[0]}
              />
              {!initialInjectionDate && contraceptiveMethod !== "pill" && <p className="mt-2 text-right text-xs text-red-500">Please select an Initial Injection Date.</p>}
            </div>
          </div>

          {contraceptiveMethod !== "pill" ? (
            <div>
              <Label className="mb-2 font-medium text-[#24302b]">Injection Type</Label>
              <Select onValueChange={(e) => setInjectionType(e)} value={injectionType}>
                <SelectTrigger className="w-full border-[#dde4db] bg-white text-[#24302b]">
                  <SelectValue placeholder="Choose type of injection" />
                </SelectTrigger>
                <SelectContent className="border-[#dde4db] bg-white text-[#24302b]">
                  <SelectItem value="1_month">1 Month</SelectItem>
                  <SelectItem value="3_month">3 Month</SelectItem>
                </SelectContent>
              </Select>
              {!injectionType && <p className="mt-2 text-right text-xs text-red-500">Please select an injection type.</p>}
            </div>
          ) : (
            <div>
              <Label className="mb-2 font-medium text-[#24302b]">Injection Type</Label>
              <div className="rounded-md border border-[#dde4db] bg-[#fbf8f1] px-3 py-2 text-[#5d6f69]">Tidak berlaku untuk metode pil</div>
            </div>
          )}
        </div>

        <div className="mt-5 sm:w-1/3">
          <Label className="font-medium text-[#24302b]" htmlFor="avatar">
            Avatar Image <span className="text-sm text-[#72827a]">(Leave empty to keep current)</span>
          </Label>

          <div className="flex items-center gap-2">
            <Input onChange={handleAvatarChange} accept=".jpg,.jpeg,.png" className="border-[#dde4db] bg-white text-[#5d6f69] file:font-bold file:text-white" type="file" id="avatar" />

            <Avatar className="h-15 w-15 cursor-pointer border-2 border-[#dde4db] shadow-md">
              <AvatarImage className="object-cover" src={avatarPreview ? avatarPreview : "/no-image.png"} />
              <AvatarFallback className="bg-[#2f7c6d] font-poppins text-xl font-bold text-white">KB</AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-10 flex gap-2">
            <Button disabled={isLoading} onClick={handleSubmit} className={`${isLoading ? "bg-[#2f7c6d] hover:bg-[#2f7c6d]" : "bg-[#2f7c6d] hover:bg-[#275f55]"} w-1/2 cursor-pointer font-bold text-white duration-500`}>
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
              <Button disabled={isLoading} className="cursor-pointer bg-[#c34a39] font-bold text-white duration-500 hover:bg-[#ab3e30]">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
