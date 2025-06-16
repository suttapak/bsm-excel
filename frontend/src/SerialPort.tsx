import React, { useRef } from "react";

import { serial } from "../wailsjs/go/models";

type Props = {
  port: string | null;
  onSubmit?: (port: string, mode: serial.Mode) => void;
  onCancel?: () => void;
};

const SerialPort = (props: Props) => {
  const { port, onCancel, onSubmit } = props;
  const mode = useRef({
    BaudRate: 115200,
    DataBits: 8,
    Parity: 0,
    StopBits: 0,
  } as serial.Mode);

  if (!port) return null;
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <input
        placeholder="port"
        type="text"
        name="port"
        id="port"
        value={port}
      />
      <label htmlFor="BaudRate">Baud Rate:</label>
      <select
        onChange={(e) => (mode.current.BaudRate = parseInt(e.target.value))}
        name="BaudRate"
        id="BaudRate"
      >
        <option value="300">300</option>
        <option value="1200">1200</option>
        <option value="2400">2400</option>
        <option value="4800">4800</option>
        <option value="9600">9600</option>
        <option value="14400">14400</option>
        <option value="19200">19200</option>
        <option value="38400">38400</option>
        <option value="57600">57600</option>
        <option value="115200" selected>
          115200
        </option>
        <option value="128000">128000</option>
        <option value="256000">256000</option>
      </select>

      <label htmlFor="DataBits">Data Bits:</label>
      <select
        name="DataBits"
        onChange={(e) => (mode.current.DataBits = parseInt(e.target.value))}
        id="DataBits"
      >
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8" selected>
          8
        </option>
      </select>

      <label htmlFor="Parity">Parity:</label>
      <select
        name="Parity"
        onChange={(e) => (mode.current.Parity = parseInt(e.target.value))}
        id="Parity"
      >
        <option value="0" selected>
          None
        </option>
        <option value="1">Odd</option>
        <option value="2">Even</option>
        <option value="3">Mark</option>
        <option value="4">Space</option>
      </select>

      <label htmlFor="StopBits">Stop Bits:</label>
      <select
        name="StopBits"
        onChange={(e) => (mode.current.StopBits = parseInt(e.target.value))}
        id="StopBits"
      >
        <option value="0" selected>
          1
        </option>
        <option value="1">1.5</option>
        <option value="2">2</option>
      </select>
      <button disabled={!onCancel} onClick={() => onCancel?.()}>
        cancel
      </button>
      <button
        disabled={!onSubmit}
        onClick={() => onSubmit?.(port, mode.current)}
      >
        submit
      </button>
    </div>
  );
};

export default SerialPort;
