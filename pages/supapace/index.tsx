import { NextPage } from "next";
import { Entry, MainTopBar } from "../../components/ui";

const Supapace: NextPage = () => {
  return (
    <div className="">
      <MainTopBar />

      <div className="min-h-screen bg-primary-50 pt-14 flex justify-around">
        <div className="mt-4 w-full max-w-[900px] flex">
          {/* <div className="w-[292px]">side</div> */}
          <div className="w-full flex flex-col gap-4">
            <Entry />
            <Entry />
            <Entry />
            <Entry />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supapace;
