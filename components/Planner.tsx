import { useEffect, useRef, useState } from "react";

const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface Partial {
  km: number;
  pace: number;
  lock: boolean;
}

export default function ListMap() {
  const [length, setLength] = useState(21);
  const [partials, setPartials] = useState<Array<Partial>>(
    Array(length).fill({ km: 0, pace: 0 }).map((partial, i) => ({
      km: i + 1,
      pace: 5,
      lock: false,
    }))
  );
  const [totalLock, setTotalLock] = useState(false)
  const [total, setTotal] = useState(partials.reduce((acc, partial) => acc + partial.pace, 0))
  const prevPartials = usePrevious(partials);

  useEffect(() => {
    setPartials(
      Array(length).fill({ km: 0, pace: 0 }).map((partial, i) => ({
        km: i + 1,
        pace: 5,
        lock: false,
      }))
    );
  }, [length]);

  useEffect(() => {
    if (!totalLock) {
      setTotal(partials.reduce((acc, partial) => acc + partial.pace, 0));
    }
    if (totalLock) {
      const touchedPartialIndex = prevPartials?.findIndex((prevPartial, i) => prevPartial.pace !== partials[i].pace) || 0;
      if (touchedPartialIndex !== -1) {
        const diff = (prevPartials?.[touchedPartialIndex]?.pace || 0) - partials?.[touchedPartialIndex]?.pace;
        const partialAvg = diff / (length - 1);
        setPartials(
          partials.map((partial, i) => (i === touchedPartialIndex) ? partial : { ...partial, pace: partial.pace + partialAvg })
        );
      }
    }
  }, [partials, totalLock])

  useEffect(() => {
    if (!totalLock) {
      const diff = partials.reduce((acc, partial) => acc + partial.pace, 0) - total;
      const partialAvg = diff / length;
      setPartials(
        partials.map(partial => ({ ...partial, pace: partial.pace + partialAvg }))
      );
    }
  }, [total])

  return (
    <>
      <label htmlFor="length">
        Distancia
      </label>
      <input id="length" type="number" value={length} onChange={e => setLength(Number(e.target.value))} />
      <table>
        <thead>
          <tr>
            <td>km</td>
            <td>pace</td>
            <td>lock</td>
          </tr>
        </thead>
        <tbody>
          {partials.map(partial => (
            <tr key={partial.km}>
              <td>{partial.km}</td>
              <td>
                <input type="range" min="0" max="600" value={partial.pace * 60} onChange={e => setPartials(partials.map((p, i) => i === partial.km - 1 ? { ...p, pace: Number(e.target.value) / 60 } : p))} />
                {Math.floor(partial.pace)}m {Math.floor(((partial.pace - Math.floor(partial.pace)) * 60) % 60)}s
              </td>
              <td>
                <input type="checkbox" checked={partial.lock} onChange={e => setPartials(partials.map((p, i) => i === partial.km - 1 ? { ...p, lock: e.target.checked } : p))} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{
              totalLock ?
                Math.floor(partials.reduce((a, b) => a + b.pace, 0)) :
                (
                  <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} />
                )
            } minutos</td>
            <td><input type="checkbox" checked={totalLock} onChange={e => setTotalLock(e.target.checked)} /></td>
          </tr>
          <tr>
            <td></td>
            <td>{Math.floor(total / 60)}h {Math.floor(total % 60)}m</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
