import React from "react";
import { Severity, getColorForSeverity } from "../db/data_utils";
import { Progress } from "antd";
import { format, parseISO } from "date-fns";
import { dbStringToHumanReadableString } from "../utils/StringUtils";

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

export function ProgressCellRenderer(value: string): React.ReactNode {
  const roundedNumber = Math.round(parseFloat(value) * 100);

  // <= 25% RED, > 25% <=50% ORANGE, >50% <=75% YELLOW, >75% GREEN
  let colorPicker = "red";
  if (roundedNumber > 25 && roundedNumber <= 50) {
    colorPicker = "orange";
  }

  if (roundedNumber > 50 && roundedNumber <= 75) {
    colorPicker = "yellow";
  }

  if (roundedNumber > 75) {
    colorPicker = "green";
  }

  return <Progress percent={roundedNumber} strokeColor={colorPicker} />;
}

export function SeverityCellRenderer(value: Severity): React.ReactNode {
  return (
    <span
      style={{
        background: getColorForSeverity(value),
        width: "100%",
        height: "100%",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {value.toLocaleUpperCase()}
    </span>
  );
}

export function DateCellRenderer(value: string): React.ReactNode {
  const formatted = format(parseISO(value), "MMMM d, yyyy");
  return <div>{formatted}</div>;
}

export function StatusCellRenderer(value: string): React.ReactNode {
  return dbStringToHumanReadableString(value);
}
