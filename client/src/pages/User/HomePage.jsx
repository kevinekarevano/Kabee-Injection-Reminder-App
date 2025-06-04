import InjectionHistory from "@/components/injectionHistory";
import Profile from "@/components/profile";
import InjectionSchedule from "@/components/injectionSchedule.jsx/index.jsx";
import ConfirmButton from "@/components/confirmedButton";

const HomePage = () => {
  return (
    <div className="bg-[#B8E3E9] pb-20 flex flex-col h-full">
      <ConfirmButton />

      <div className="container pt-5   mx-auto max-w-6xl">
        {/* Profile */}
        <section className="flex mx-5 items-center gap-2 sm:gap-3">
          <Profile />
        </section>

        {/* Injection Schedule */}
        <section className="md:flex px-2 w   gap-9  mt-10">
          <InjectionSchedule />
        </section>
        {/* Injection History Table */}
        <section className=" font-poppins h-full mx-2  bg-[#608286] mt-5 md:mt-10 pb-4  rounded-md">
          <InjectionHistory />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
