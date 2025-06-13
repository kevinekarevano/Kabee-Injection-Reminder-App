import useAppStore from "@/stores/useAppStore";
import dayjs from "dayjs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ConfirmButton = () => {
  const userData = useAppStore((state) => state.userData);
  const injectionConfirmation = useAppStore((state) => state.injectionConfirmation);

  const today = dayjs().startOf("day");
  const injectionDay = dayjs(userData?.nextInjectionDate).startOf("day");

  if (userData?.isConfirmed || injectionDay.isAfter(today) || !userData?.nextInjectionDate) {
    return null;
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              onClick={() => injectionConfirmation()}
              className={"mx-auto cursor-pointer px-3 py-1 rounded-md mt-2 border-2 bg-teal-200 text-teal-900 hover:bg-teal-200 shadow-[0px_-1px_79px_7px_rgba(0,_0,_0,_0.2)] border-teal-700 font-bold font-poppins text-lg  "}
            >
              Confirm Injection
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click this button to confirm your scheduled injection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default ConfirmButton;
