import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!
);

// console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY)

interface Race {
  id: string;
  name: string;
}

function Race(props: { race: Race; myTime: number; myPace: string }) {
  const [distribution, setDistribution] = useState<any>([]);

  useEffect(() => {
    const fn = async () => {
      const { data, error } = await supabase.rpc("get_run_distribution", {
        filter_race_id: props.race.id,
      });
      if (!data || error) {
        throw new Error(`No distribution found: ${props.race.id} ${error}`);
      }
      setDistribution(data);
    };
    if (props.race.id) {
      fn();
    }
  }, [props.race.id]);

  const countAfter = distribution
    .filter((d: any) => d.bucket_floor_s <= props.myTime * 60)
    .reduce((acc: number, cur: any) => acc + cur.count, 0);
  const countTotal = distribution.reduce(
    (acc: number, cur: any) => acc + cur.count,
    0
  );

  return (
    <div className="flex justify-around">
      <div className="w-4/12">
        <div>{props.race.name}</div>
        <div>
          {Math.round((countAfter * 100) / countTotal)}% ({countAfter})
          rapidos
        </div>
      </div>
      <div className="w-4/12">
        {distribution && (
          <LineChart width={200} height={100} data={distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket_floor" interval="preserveEnd" />
            <YAxis interval="preserveEnd" />
            <ReferenceLine x={props.myPace} stroke="red" />
            <Line dataKey="count" dot={false} />
          </LineChart>
        )}
      </div>
      <div className="w-4/12">
        <div>&nbsp;</div>
        <div>
          {Math.round(((countTotal - countAfter) * 100) / countTotal)}% (
          {countTotal - countAfter}) lentos
        </div>
      </div>
    </div>
  );
}

export default function Comparer() {
  const [races, setRaces] = useState<Array<Race>>([]);
  const [myTime, setMyTime] = useState<any>(120);
  const [myPace, setMyPace] = useState<string>("02:00:00");

  useEffect(() => {
    setMyPace(
      `0${Math.floor(myTime / 60)}:${(Math.floor((myTime % 60) / 5) * 5)
        .toString()
        .padStart(2, "0")}:00`
    );
  }, [myTime]);

  useEffect(() => {
    const fn = async () => {
      const { data: dataRaces, error: racesError } = await supabase
        .from<Race>("race")
        .select("*");
      if (!dataRaces || racesError) {
        throw new Error("No races found: " + racesError);
      }
      setRaces(dataRaces);
    };
    fn();
  }, []);

  return (
    <>
      <div className="flex justify-between text-lg">
        <div>
          Tiempo {Math.floor(myTime / 60)}h {myTime % 60}m
        </div>
        <div>
          Paso {Math.floor((myTime / 21) % 60)}m{" "}
          {Math.floor(((myTime / 21) * 60) % 60)}s / km
        </div>
      </div>
      <div className="p-5 backdrop-blur-sm bg-gray-100">
        <input
          className="w-full"
          type="range"
          min="55"
          max="190"
          value={myTime}
          onChange={(e) => setMyTime(Number(e.target.value))}
        />
      </div>
      <div>
        {races.map((r) => (
          <Race key={r.id} race={r} myTime={myTime} myPace={myPace} />
        ))}
      </div>
    </>
  );
}
