import "ol/ol.css";
import { NextPage } from "next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiberManualRecord } from "@mui/icons-material";
import Link from "next/link";
import { MapTopBar } from "../../components/ui";

const TrackingMap = dynamic(() => import("../../components/TrackingMap"), {
  ssr: false,
});

const Track: NextPage = () => {
  return (
    <div className="flex flex-col">
      <MapTopBar />

      <div className="min-h-screen w-full bg-primary-50 pt-14 flex justify-around">
        <TrackingMap />
      </div>

      <div className="fixed bottom-0 w-full">
        <div className="flex justify-around">
          <div className="bg-gray-100 p-4 rounded-full">
            <FiberManualRecord />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
