import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { php } from "@codemirror/lang-php";
import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { oneDark } from "@codemirror/theme-one-dark";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
};

export default function DevEditor({ value, onChange, language }: Props) {
  const extensions = [];

  if (language === "php") {
    extensions.push(php());
  } else if (language === "linux" || language === "devops" || language === "git") {
    extensions.push(StreamLanguage.define(shell));
  } else {
    extensions.push(javascript());
  }

  const fileName =
    language === "php"
      ? "dev-note.php"
      : language === "linux" || language === "devops" || language === "git"
      ? "dev-note.sh"
      : "dev-note.js";

  return (
    <div className="devEditorShell">
      <div className="devEditorTopbar">
        <div className="devEditorDots">
          <span className="devEditorDot devEditorDotRed" />
          <span className="devEditorDot devEditorDotYellow" />
          <span className="devEditorDot devEditorDotGreen" />
        </div>

        <span className="devEditorFilename">{fileName}</span>
      </div>

      <div className="devEditorBody">
        <CodeMirror
          value={value}
          height="240px"
          theme={oneDark}
          extensions={extensions}
          onChange={(val) => onChange(val)}
          placeholder={`// Write your developer note here
// Example:
docker compose up -d

Use this to start containers in detached mode.`}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
          }}
        />
      </div>
    </div>
  );
}