import { Card } from 'primereact/card';
import { InputTextarea } from "primereact/inputtextarea";
import "./App.css"
import { useEffect, useRef, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import CryptoJS from "crypto-js";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";

const App = () => {
  type Modes = "encode" | "decode";

  interface Algorithm {
    value: string;
    label: string;
    description: string;
  }

  const modes: { value: Modes, label: string }[] = [
    {
      value: "encode",
      label: "Шифрование",
    },
    {
      value: "decode",
      label: "Дешифрование",
    }
  ]
  const algorithms = [
    {
      value: "AES",
      label: "AES",
      description: "Advanced Encryption Standard (AES) — государственный стандарт шифрования США с 2001 года. Симметричное блочное шифрование с ключами 128/192/256 бит. Самый популярный и надежный алгоритм, используемый правительствами, банками и военными по всему миру."
    },
    {
      value: "DES",
      label: "DES",
      description: "Data Encryption Standard (DES) — исторически первый стандарт шифрования, принятый в 1977 году. Симметричное блочное шифрование с коротким 56-битным ключом. На сегодня считается полностью устаревшим и небезопасным — взламывается современными компьютерами за несколько часов."
    },
    {
      value: "TripleDES",
      label: "Triple DES",
      description: "Triple Data Encryption Standard (3DES) — улучшенная версия DES с тройным применением шифрования (ключ 112/168 бит). Обеспечивает средний уровень безопасности, но значительно медленнее AES. Постепенно вытесняется более современными алгоритмами."
    },
    {
      value: "RC4",
      label: "RC4",
      description: "Rivest Cipher 4 (RC4) — простой и быстрый потоковый шифр с переменной длиной ключа. Ранее широко использовался в WEP, WPA и SSL/TLS, но сейчас считается небезопасным из-за множественных обнаруженных уязвимостей и криптографических атак."
    },
    {
      value: "Rabbit",
      label: "Rabbit",
      description: "Rabbit — современный высокоскоростной потоковый шифр с 128-битным ключом, оптимизированный для программной реализации. Обеспечивает высокий уровень безопасности при отличной производительности на обычных процессорах."
    },
  ]

  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Modes>(modes[0].value);
  const [key, setKey] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);

  const [isCopied, setCopied] = useState<boolean>(false);

  const algorithmOverlay = useRef<OverlayPanel>(null);
  const keyOverlay = useRef<OverlayPanel>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    document.title = mode === "encode"
      ? "Шифратор Supreme - Шифрование"
      : "ДЕШифратор Supreme - Дешифрование";
  }, [mode]);

  const computeOutput = () => {
    if (algorithm === null) return "Algorithm is not set";
    try {
      switch (algorithm.value) {
        case "AES":
          return mode === "encode"
            ? CryptoJS.AES.encrypt(input, key).toString()
            : CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        case "DES":
          return mode === "encode"
            ? CryptoJS.DES.encrypt(input, key).toString()
            : CryptoJS.DES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        case "TripleDES":
          return mode === "encode"
            ? CryptoJS.TripleDES.encrypt(input, key).toString()
            : CryptoJS.TripleDES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        case "RC4":
          return mode === "encode"
            ? CryptoJS.RC4.encrypt(input, key).toString()
            : CryptoJS.RC4.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        case "Rabbit":
          return mode === "encode"
            ? CryptoJS.Rabbit.encrypt(input, key).toString()
            : CryptoJS.Rabbit.decrypt(input, key).toString(CryptoJS.enc.Utf8);
        default:
          return "Unknown algorithm";
      }
    } catch (error: unknown) {
      console.error(error);
      const message = `Ошибка ${mode === "encode" ? "" : "де"}шифрования, проверьте ввод!`
      showError(message)
      return message
    }
  }

  const showError = (message: string) => {
    setError(message)
    toast.current?.show({
      severity: 'error',
      summary: 'Ошибка',
      detail: message,
      sticky: true,
    });
  }

  return (
    <div className="container">
      <Toast
        ref={toast}
        position="top-center"
      />
      <div className="info">
        <h2>
          <b
            hidden={mode === "encode"}
            style={{ color: "#c4b5fd"}}
          >ДЕ</b>
          Шифратор <i style={{ fontWeight: "normal" }}>Supreme</i>
        </h2>
        <p>Сервис для симметричного шифрования / дешифрования текста с указанием алгоритма и ключа шифрования
        </p>
      </div>
      <div className="controls">
        <SelectButton
          className="mode-select"
          value={mode}
          options={modes}
          onChange={(e) => {
            setMode(e.value)
            setError(null)
            setOutput("")
          }}
        />
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <Dropdown
            value={algorithm?.value}
            optionLabel="label"
            placeholder="Выберите алгоритм"
            onChange={(e) => {
              setAlgorithm(algorithms.find(alg => alg.value === e.value) ?? null)
              setError(null)
            }}
            options={algorithms}
          />
          <OverlayPanel
            className="overlay-panel"
            ref={algorithmOverlay}
          >
            <p>{
              algorithm !== null
                ? algorithm.description
                : "Алгоритм шифрования — это математический метод преобразования данных в зашифрованный вид для защиты информации. Выберите алгоритм из списка, чтобы увидеть его подробное описание."
            }</p>
          </OverlayPanel>
          <span
            onClick={(e) =>
              algorithmOverlay.current?.toggle(e)}
            className="p-inputgroup-addon"
          >
            <i className="pi pi-question"></i>
          </span>
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-key"></i>
          </span>
          <InputText
            value={key}
            placeholder="Введите ключ шифрования"
            onChange={(e) => {
              setKey(e.target.value)
              setError(null)
            }}
          />
          <OverlayPanel
            className="overlay-panel"
            ref={keyOverlay}
          >
            <p>Ключ шифрования — это секретная строка символов, используемая алгоритмом для преобразования данных в зашифрованный вид и обратно. Без правильного ключа расшифровать данные практически невозможно. Надежный ключ должен быть длинным, случайным и содержать буквы разного регистра, цифры и специальные символы.</p>
          </OverlayPanel>
          <span
            onClick={(e) =>
              keyOverlay.current?.toggle(e)}
            className="p-inputgroup-addon"
          >
            <i className="pi pi-question"></i>
          </span>
        </div>
      </div>
      <div className="text-fields">
        <Card className="card">
          <InputTextarea
            invalid={error !== null}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(null)
            }}
            placeholder="Ваш текст"
            id="input-text"
          />
        </Card>
        <Card className="card output">
          <InputTextarea
            value={output}
            disabled
            placeholder="Результат операции"
            id="output-text"
          />
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(output)
              setCopied(true)
            }}
            visible={!!output}
            disabled={isCopied}
            className="copy-output"
            icon={`pi pi-${isCopied ? "check" : "copy"}`}
          />
        </Card>
      </div>
      <Button
        onClick={() => {
          const data = computeOutput()
          console.log(data)
          if (data.length > 0) setOutput(data)
          else showError("Неверный ввод!")
          setCopied(false)
        }}
        type="submit"
        disabled={!algorithm || !input || !key || !!error}
        label={
          mode === "encode"
            ? "Зашифровать"
            : "Дешифровать"
        }
      />
    </div>
  );
}

export default App;