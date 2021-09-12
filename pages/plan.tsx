import dynamic from "next/dynamic";

const Planner = dynamic(() => import("../components/Planner"), { ssr: false });

export default function Home() {
  return (
    <>
      <div>Planner</div>
      <Planner />
    </>
  );
}
