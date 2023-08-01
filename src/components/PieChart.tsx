import React from "react";
import { Pie } from "@nivo/pie";
import { Severity, getSeveritySort } from "../db/data_utils";

type PieChartData = {
  id: string;
  label: string;
  value: string | number;
};

/**
 * A simple pie chart for showing the distribution of findings by Severity
 */
export function PieChart({
  data,
  onSectionClick = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: {
  data: PieChartData[];
  onSectionClick?: (severity: Severity, amount: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}): JSX.Element {
  return (
    <Pie
      data={data.sort(pieSorter)}
      height={350}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 50,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
      colors={{ datum: "data.color" }}
      arcLinkLabelsStraightLength={0}
      arcLinkLabelsDiagonalLength={36}
      margin={{
        bottom: 80,
        left: 120,
        right: 120,
        top: 80,
      }}
      width={900}
      onClick={(datum) => {
        onSectionClick(datum.label as Severity, datum.value);
      }}
    />
  );
}

function pieSorter(a: PieChartData, b: PieChartData): number {
  return getSeveritySort(a.label as Severity) <
    getSeveritySort(b.label as Severity)
    ? -1
    : 1;
}
