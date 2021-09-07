import dynamic from "next/dynamic";

const Comparer = dynamic(() => import("../components/Comparer"), { ssr: false });

export default function Home() {
  return (
    <>
      <Comparer />
    </>
  );
}
