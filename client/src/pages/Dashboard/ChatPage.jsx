import BreadcrumbCustom from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getUserById = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/id/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        const user = data.data;
        setUsername(user.username);
      }
    } catch (error) {
      toast.error("Something wrong, please try again");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-message/${id}`,
        { message },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setMessage("");
        toast.success(data.message);
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

  useEffect(() => {
    getUserById();
  }, [id]);

  return (
    <div className="w-full text-[#24302b]">
      <BreadcrumbCustom pageName={"Chat"} />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Chat Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Chat with {username}</h1>
      </div>
      <div className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-6 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-1.5">
            <Label className={"text-xl font-medium text-[#24302b]"} htmlFor="message">
              Your message <span className="text-red-800">*</span>
            </Label>

            <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} className={"border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"} placeholder="Type your message here..." id="message" />
          </div>
          <div className="md:flex  gap-2 mt-5">
            <Button disabled={isLoading} type="submit" className={"w-full cursor-pointer rounded-full bg-[#2f7c6d] font-bold text-white duration-500 hover:bg-[#275f55] sm:w-1/4"}>
              {isLoading ? <Loader /> : "Send"}
            </Button>
            <Button
              type="button"
              onClick={() =>
                setMessage(`📩 Pesan dari Admin Kabee

Halo ${username},

[Silakan tulis isi pesan Anda di sini...]

Salam hormat,  
Tim Admin Kabee`)
              }
              className="mt-2 w-full cursor-pointer rounded-full border border-[#dde4db] bg-[#edf4ef] px-3 py-1 font-semibold text-[#2f7c6d] hover:bg-[#e3eee7] sm:mt-0 sm:w-1/5"
            >
              Gunakan Template Resmi
            </Button>

            <Link className="" to={"/dashboard/chat"}>
              <Button disabled={isLoading} className={"w-full cursor-pointer rounded-full bg-[#c34a39] font-bold text-white duration-500 hover:bg-[#ab3e30]"}>
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
