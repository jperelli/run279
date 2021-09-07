import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!);

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY)

export default function Comparer() {
  const [distribution, setDistribution] = useState<any>([]);
  const [myTime, setMyTime] = useState<any>(120);

  useEffect(() => {
    const fn = async () => {
      const { data, error } = await supabase.rpc('get_run_distribution')
      if (error) {
        console.error(error)
      } else {
        setDistribution(data)
      }
    }
    fn()
  }, [])

  const countAfter = distribution.filter((d: any) => d.bucket_floor_s <= myTime * 60).reduce((acc: number, cur: any) => acc + cur.count, 0)
  const countTotal = distribution.reduce((acc: number, cur: any) => acc + cur.count, 0)

  return (
    <>
      <div>My time {Math.floor(myTime / 60)}h {Math.floor(myTime % 60)}m</div>
      <input type="range" min="40" max="240" value={myTime} onChange={e => setMyTime(Number(e.target.value))} />
      <div>
        <div>{Math.round(countAfter * 100 / countTotal)}% ({countAfter}) corredores mas rapidos</div>
        <div>{Math.round((countTotal - countAfter) * 100 / countTotal)}% ({countTotal - countAfter}) corredores mas lentos</div>
      </div>
      <hr />
      <div>
        {distribution && distribution.map((d: any) => (
          <div key={d.bucket_floor_s}>
            <div style={{ borderBottom: (d.bucket_floor_s < myTime * 60 && myTime * 60 <= d.bucket_floor_s + 5 * 60) ? '1px solid red' : '1px solid white' }}>{d.bucket_floor} | {d.count}</div>
          </div>
        ))}
      </div>
    </>
  );
}
