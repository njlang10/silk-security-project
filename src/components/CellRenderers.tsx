import React from "react";
import { Severity, getColorForSeverity } from "../db/data_utils";

export function UrlCellRenderer(value: string): React.ReactNode {
  return (
    <a href={value} target="_blank" rel="noreferrer">
      {"Link To Docs"}
    </a>
  );
}

export function DescriptionCellRenderer(value: string): React.ReactNode {
  const splitText = value.split(":");
  const link = value.split("Remediation Group:")[1].trim();
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {splitText[0]}
    </a>
  );
}

export function SeverityCellRenderer(value: Severity): React.ReactNode {
  return (
    <span
      style={{
        background: getColorForSeverity(value),
        width: "100%",
        height: "100%",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {value.toLocaleUpperCase()}
    </span>
  );
}
