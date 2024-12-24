import logo from "./logo.svg";
import "./App.css";
import xolor from "xolor";
import data from "./input.json";
import React, { useState } from "react";

function App() {
  const [mentionState, setMentionState] = useState({});
  const [clauseCount, setClauseCount] = useState(0);

  function textHelper(textChildren) {
    return textChildren.map((child) => {
      // Handle "mention" type
      if (child.type === "mention") {
        if (mentionState.hasOwnProperty(child.id)) {
          return mentionState[child.id];
        } else {
          return mentionHelper(child.color, child.title, child.id, child.value);
        }
      } else if (child.type === "clause") {
        return helper(child);
      }

      // Default case for non-mention type
      const splitChild = (child.text || "").split("\n");

      if (splitChild.length === 1) {
        return (
          <span className={child.bold ? "font-bold" : ""}>
            <span className={child.underline ? "underline" : ""}>
              {child.text}
            </span>
          </span>
        );
      } else {
        return (
          <span className={child.bold ? "font-bold" : ""}>
            <span className={child.underline ? "underline" : ""}>
              {(child.text || "").split("\n").map((line, index, array) => (
                <span key={index}>
                  <span className="inline-block">{line}</span>
                  {index < array.length - 1 && <br />}
                </span>
              ))}
            </span>
          </span>
        );
      }
    });
  }

  function helper(dataObj) {
    // Considered using switch case but didn't work for some reason
    if (dataObj.type === "block") {
      return (
        <div className="text-left" title={dataObj.title}>
          {dataObj.children.map((child) => helper(child))}
          <br />
        </div>
      );
    } else if (dataObj.type === "h1") {
      return <h1 title={dataObj.title}>{textHelper(dataObj.children)}</h1>;
    } else if (dataObj.type === "h4") {
      return <h4 title={dataObj.title}>{textHelper(dataObj.children)}</h4>;
    } else if (dataObj.type === "p") {
      return <p title={dataObj.title}>{textHelper(dataObj.children)}</p>;
    } else if (dataObj.type === "clause") {
      return (
        <div title={dataObj.title}>
          {dataObj.children.map((child) => clauseHelper(child))}
          <br />
        </div>
      );
    } else if (dataObj.type === "ul") {
      return (
        <ul title={dataObj.title}>
          {dataObj.children.map((child) => helper(child))}
        </ul>
      );
    } else if (dataObj.type === "li") {
      return (
        <li title={dataObj.title}>
          {dataObj.children.map((child) => helper(child))}
        </li>
      );
    } else if (dataObj.type === "lic") {
      return (
        <span title={dataObj.title}>• {textHelper(dataObj.children)}</span>
      );
    } else {
      return "ERROR: UNIMPLEMENTED TYPE";
    }
  }

  function mentionHelper(color, title, id, value) {
    function rgbToHex(rgb) {
      // Match the RGB value using a regular expression
      const result = rgb.match(/^rgb\((\d+), (\d+), (\d+)\)$/);

      if (!result) {
        throw new Error("Invalid RGB format");
      }

      console.log(result);

      // Extract the RGB values and convert each to a 2-digit hexadecimal string
      const r = parseInt(result[1]);
      const g = parseInt(result[2]);
      const b = parseInt(result[3]);

      function c(v) {
        var hex = v.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }
      console.log("#" + c(r) + c(g) + c(b));
      return "#" + c(r) + c(g) + c(b);
    }

    const hex = rgbToHex(color).toUpperCase();

    const mention = (
      <div title={title} className={`text-black inline-block bg-[` + hex + "]"}>
        {value}
      </div>
    );

    setMentionState((prevState) => ({
      ...prevState,
      [id]: mention,
    }));

    return mention;
  }

  function clauseHelper(child) {
    if (child.type === "h4") {
      return (
        <h4 title={child.title}>
          {clauseCount + 1}. {textHelper(child.children)}
        </h4>
      );
    } else if (child.type === "p") {
      return <p title={child.title}>• {textHelper(child.children)}</p>;
    } else {
      return <span>{helper(child)}</span>;
    }
  }

  return (
    <div className="App m-6">{data.map((dataObj) => helper(dataObj))}</div>
  );
}

export default App;
