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
        }
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
    <div className="w-full">
       <BreadcrumbCustom pageName={'Chat'} />
      <h1 className="text-white font-bold text-xl">Chat with {username} </h1>
      <div className="bg-zinc-700 rounded-sm mt-3 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid w-full gap-1.5">
            <Label className={"font-medium  text-xl text-white "} htmlFor="message">
              Your message <span className="text-red-800">*</span>
            </Label>

            <Textarea required value={message} onChange={(e) => setMessage(e.target.value)} className={"bg-zinc-800 border-zinc-900 text-zinc-300"} placeholder="Type your message here..." id="message" />
          </div>
          <div className="md:flex  gap-2 mt-5">
            <Button disabled={isLoading} type="submit" className={"bg-emerald-300  w-full sm:w-1/4  text-emerald-900  hover:bg-emerald-400 hover:text-emerald-950 duration-500 font-bold cursor-pointer"}>
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
              className="bg-sky-200 text-sky-900 border-sky-900 border-2 hover:bg-sky-300 hover:text-sky-950 w-full mt-2 sm:mt-0 sm:w-1/5 cursor-pointer font-semibold px-3 py-1  mb-2"
            >
              Gunakan Template Resmi
            </Button>

            <Link className="" to={"/dashboard/users"}>
              <Button disabled={isLoading} className={"bg-red-300  text-red-900 w-full  hover:bg-red-400 hover:text-red-950 duration-500 font-bold cursor-pointer"}>
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
