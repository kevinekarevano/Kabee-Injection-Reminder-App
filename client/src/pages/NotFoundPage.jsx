import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-b dark from-[#B7E1E4]  flex justify-center items-center via-[#8DC1C1] to-[#78a6ab]">
      <div className="text-center text-[#27383a] font-poppins">
        <h1 className="text-9xl  font-bold">404</h1>
        <p className="text-3xl font-semibold mb-3">Not Found</p>
        <p className="italic text-sm">
          Oops! This page doesn’t exist🥲{" "}
          <Link to={"/"} className="font-semibold underline">
            Go back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
