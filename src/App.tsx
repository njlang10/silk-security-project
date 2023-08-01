import "./styles.css";
import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Row, Typography } from "antd";
import { PieChart } from "./components/PieChart";
import { GroupedFindingTable } from "./components/GroupedFindingsTable";
import { Severity, GroupedFinding, getColorForSeverity } from "./db/data_utils";
import grouped from "./db/grouped_findings.json";
import logo from "./assets/silk.png";

/**
 * APP ENTRY POINT!
 */
export default function App() {
  // Local state
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(
    null
  );
  const [showPieDirections, setShowPieDirections] = useState<boolean>(false);
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>([]);

  // Derived State
  const findingsAnalyzed = useMemo(() => {
    const grouped = groupedFindings?.reduce<{ [key: string]: number }>(
      (accum, current) => {
        const existingNumber = accum?.[current.severity];
        if (existingNumber != null) {
          accum[current.severity] = existingNumber + 1;
        } else {
          accum[current.severity] = 1;
        }
        return accum;
      },
      {}
    );
    return Object.entries(grouped).map(([severity, amt]) => {
      return {
        id: severity,
        label: severity,
        value: amt,
        color: getColorForSeverity(severity as Severity),
      };
    });
  }, [groupedFindings]);

  // Effects
  useEffect(() => {
    setGroupedFindings(grouped);
  }, []);

  // Helpers
  function onPieSectionClicked(severity: Severity): void {
    if (selectedSeverity === severity) {
      setSelectedSeverity(null);
      return;
    }
    setSelectedSeverity(severity);
  }

  return (
    <div className="App">
      <Row justify={"space-between"}>
        <img
          src={logo}
          style={{ height: "50px", width: "100px", top: "25px" }}
        />
        <Typography.Title level={5} style={{ margin: 0, paddingTop: 10 }}>
          Grouped Findings Dashboard
        </Typography.Title>
      </Row>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <PieChart
            data={findingsAnalyzed}
            onSectionClick={onPieSectionClicked}
            onMouseEnter={() => setShowPieDirections(true)}
            onMouseLeave={() => setShowPieDirections(false)}
          />
          {(showPieDirections === true || selectedSeverity !== null) && (
            <Typography.Text
              italic
              style={{
                position: "absolute",
                top: "125px",
                left: "25px",
                transform: "",
              }}
            >
              {selectedSeverity === null
                ? "Click Pie to Filter"
                : `Filtered to ${selectedSeverity.toLocaleUpperCase()} \n. Click again to remove filter`}
            </Typography.Text>
          )}
        </div>
        <GroupedFindingTable
          groupedFindings={groupedFindings}
          filterToSeverity={selectedSeverity}
        />
      </div>
    </div>
  );
}
