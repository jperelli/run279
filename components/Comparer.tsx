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
    <div className="bg-white border border-gray-500 rounded-lg p-2 flex flex-col gap-4">
      <div className="flex justify-around">
        <span className="border-b border-gray-500">{props.race.name}</span>
      </div>
      <div className="flex justify-around">
        <div>
          <div>
            <div>{Math.round((countAfter * 100) / countTotal)}%</div>
            <div>({countAfter})</div>
          </div>
        </div>
        <div>
          {distribution && (
            <LineChart width={200} height={100} data={distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket_floor" interval="preserveEnd" hide />
              <YAxis interval="preserveEnd" hide />
              <ReferenceLine x={props.myPace} stroke="red" />
              <Line dataKey="count" dot={false} />
            </LineChart>
          )}
        </div>
        <div>
          <div>
            <div>
              {Math.round(((countTotal - countAfter) * 100) / countTotal)}%
            </div>
            <div>({countTotal - countAfter})</div>
          </div>
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
      `0${Math.floor(myTime / 60)}:${(Math.floor((myTime % 60) / 1) * 1)
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
    <div className="bg-gray-50 min-h-screen text-gray-700">
      <div className="flex flex-col items-center justify-around p-5">
        <div className="text-2xl">Comparador 21k</div>
        <div className="text-gray-500">(mov&eacute; el slider)</div>
      </div>
      <div className="flex justify-around p-4 text-xl">
        <div className="text-center border border-blue-300 bg-blue-50 p-2 rounded-lg">
          <div>Tiempo total</div>
          <div>
            {Math.floor(myTime / 60)}h {myTime % 60}m
          </div>
        </div>
        <div className="text-center border border-blue-300 bg-blue-50 p-2 rounded-lg">
          <div>Paso</div>
          <div>
            {Math.floor((myTime / 21) % 60)}m{" "}
            {Math.floor(((myTime / 21) * 60) % 60)}s / km
          </div>
        </div>
      </div>
      <div className="p-5">
        <input
          className="w-full"
          type="range"
          min="55"
          max="190"
          value={myTime}
          onChange={(e) => setMyTime(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex justify-around">
          <div>Rapidos</div>
          <div className="w-[200px]"></div>
          <div>Lentos</div>
        </div>
        {races.map((r) => (
          <Race key={r.id} race={r} myTime={myTime} myPace={myPace} />
        ))}
      </div>
    </div>
  );
}
