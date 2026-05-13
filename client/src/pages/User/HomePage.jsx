import InjectionHistory from "@/components/injectionHistory";
import Profile from "@/components/profile";
import InjectionSchedule from "@/components/injectionSchedule.jsx/index.jsx";
import ArticlePreviewSection from "@/components/article/ArticlePreviewSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ec] pb-20 text-[#24302b]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pt-6 md:px-8 md:pt-8">
        <section className="rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Profile />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-[2rem] border border-[#dde4db] bg-white p-4 shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:p-5">
            <InjectionSchedule />
          </div>

          <div className="rounded-[2rem] border border-[#dde4db] bg-[#fbf8f1] p-4 shadow-[0_18px_40px_rgba(34,53,48,0.04)] md:p-5">
            <InjectionHistory />
          </div>
        </section>

        <section>
          <ArticlePreviewSection
            theme="light"
            title="Artikel terbaru untuk anda"
            moreLink="/articles"
            moreLabel="See All Articles"
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
