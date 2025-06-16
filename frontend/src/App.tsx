import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import "./App.css";
import { GetSerialPort, SelectMonitor, TestReult } from "../wailsjs/go/main/App";
import { EventsOn } from "../wailsjs/runtime";
import SerialPort from "./SerialPort";
const useGetSerialPort = () => {
  const [ports, setPorts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setPorts(await GetSerialPort());
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reload]);
  const refresh = () => {
    setReload((p) => !p);
  };
  return { ports, isLoading, refresh };
};

const useGetResult = () => {
  const [result, setResult] = useState<number[]>([]);

  useEffect(() => {
    (() => {
      EventsOn("result", (data) => setResult(data));
    })();
  }, []);

  return { result };
};

function App() {
  const { ports, isLoading, refresh } = useGetSerialPort();
  const { result } = useGetResult();
  const [port, setPort] = useState<string | null>(null);

  return (
    <>
      <button onClick={refresh} disabled={isLoading}>
        refresh
      </button>
      <hr />
      {JSON.stringify(result)}
      <hr />
      {isLoading && <p>loading...</p>}
      {ports?.map((port) => (
        <button onClick={() => setPort(port)}>{port}</button>
      ))}
      <hr />
      <SerialPort port={port} onCancel={() => setPort(null)} onSubmit={(port, mode) => SelectMonitor(port, mode)} />
      <hr />
      <button onClick={TestReult}>test result</button>
    </>
  );
}

export default App;
