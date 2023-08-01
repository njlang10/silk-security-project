import "./styles.css";
import React from "react";
import grouped from "./db/grouped_findings.json";
import raw from "./db/raw_findings.json";
import { useEffect, useState, useMemo } from "react";
import { Row, Table, Typography } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { Pie } from "@nivo/pie";
import logo from "./assets/silk.png";

export type PieChartData = {
  id: string;
  label: string;
  value: string | number;
};
export type Severity = "low" | "medium" | "high" | "critical";
export type GroupedFinding = {
  id: number;
  grouping_type: string;
  grouping_key: string;
  severity: string;
  grouped_finding_created: string;
  sla: string;
  description: string;
  security_analyst: string;
  workflow: string;
  status: string;
  progress: number;
};

export type RawFinding = {
  id: number;
  source_security_tool_name: string;
  source_security_tool_id: string;
  source_collaboration_tool_name: string;
  source_collaboration_tool_id: string;
  severity: string;
  finding_created: string;
  ticket_created: string;
  description: string;
  asset: string;
  status: string;
  remediation_url: string;
  remediation_text: string;
  grouped_finding_id: number;
};

function getSeveritySort(severity: Severity): number {
  switch (severity) {
    case "low":
      return 0;
    case "medium":
      return 1;
    case "high":
      return 2;
    case "critical":
      return 3;
  }
}

function pieSorter(a: PieChartData, b: PieChartData): number {
  return getSeveritySort(a.label as Severity) <
    getSeveritySort(b.label as Severity)
    ? -1
    : 1;
}

function tableDefaultSort(a: GroupedFinding, b: GroupedFinding): number {
  return getSeveritySort(a.severity as Severity) <
    getSeveritySort(b.severity as Severity)
    ? 1
    : -1;
}

function getFilterForKey(
  key: keyof GroupedFinding
): ColumnType<GroupedFinding>["filters"] | undefined {
  switch (key) {
    case "severity":
      return [
        { text: "low", value: "low" },
        { text: "medium", value: "medium" },
        { text: "high", value: "high" },
        { text: "critical", value: "critical" },
      ];
  }

  return undefined;
}

function getOnFilterForKey(
  key: keyof GroupedFinding
): ColumnType<GroupedFinding>["onFilter"] | undefined {
  switch (key) {
    case "severity":
      return (value: string | number | boolean, record: GroupedFinding) => {
        return record.severity === value;
      };
  }
  return undefined;
}

function UrlCellRenderer(value: string): React.ReactNode {
  return (
    <a href={value} target="_blank" rel="noreferrer">
      {"Link To Docs"}
    </a>
  );
}

function DescriptionCellRenderer(value: string): React.ReactNode {
  const splitText = value.split(":");
  const link = value.split("Remediation Group:")[1].trim();
  return (
    <a href={link} target="_blank" rel="noreferrer">
      {splitText[0]}
    </a>
  );
}

function getColorForSeverity(severity: Severity): React.CSSProperties["color"] {
  switch (severity) {
    case "low":
      return "#F2F3AE";
    case "medium":
      return "#EDD382";
    case "high":
      return "#FC9E4F";
    case "critical":
      return "#FF521B";
  }
}

function SeverityCellRenderer(value: Severity): React.ReactNode {
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

function getGroupedFindingCellRenderer(
  key: keyof GroupedFinding
): ColumnType<GroupedFinding>["render"] {
  switch (key) {
    case "severity":
      return SeverityCellRenderer;
    case "grouping_key":
      return UrlCellRenderer;
    case "description":
      return DescriptionCellRenderer;
  }

  return undefined;
}

function getRawFindingCellRenderer(
  key: keyof RawFinding
): ColumnType<RawFinding>["render"] {
  switch (key) {
    case "remediation_url":
      return UrlCellRenderer;
  }

  return undefined;
}

const GROUPED_FINDING_TABLE_COLUMNS: ColumnsType<GroupedFinding> = [
  "severity",
  "description",
  "grouped_finding_created",
  "sla",
  "status",
  "progress",
  "id",
  "grouping_type",
  "grouping_key",
  "security_analyst",
  "workflow",
].map((key) => ({
  title: key,
  dataIndex: key,
  key,
  filters: getFilterForKey(key as keyof GroupedFinding),
  onFilter: getOnFilterForKey(key as keyof GroupedFinding),
  render: getGroupedFindingCellRenderer(key as keyof GroupedFinding),
}));

const RAW_FINDINGS_TABLE_COLUMNS: ColumnsType<RawFinding> = [
  "id",
  "source_security_tool_name",
  "source_security_tool_id",
  "source_collaboration_tool_name",
  "source_collaboration_tool_id",
  "severity",
  "finding_created",
  "ticket_created",
  "description",
  "asset",
  "status",
  "remediation_url",
  "remediation_text",
  "grouped_finding_id",
].map((key) => ({
  title: key,
  dataIndex: key,
  key,
  render: getRawFindingCellRenderer(key as keyof RawFinding),
}));

function GroupedFindingTable({
  groupedFindings,
  filterToSeverity = null,
}: {
  groupedFindings: GroupedFinding[];
  filterToSeverity?: Severity | null;
}): JSX.Element {
  const [rawFindings, setRawFindings] = useState<RawFinding[]>([]);
  const filteredFindings = useMemo(() => {
    if (filterToSeverity !== null) {
      return groupedFindings.filter(
        (finding) => finding.severity === filterToSeverity
      );
    }
    return groupedFindings;
  }, [filterToSeverity, groupedFindings]);
  useEffect(() => {
    setRawFindings(raw);
  }, []);

  function RawExpansionTable(
    record: GroupedFinding & { [key: string]: unknown }
  ): React.ReactNode {
    const groupedId = record.id;

    const filtered = rawFindings.filter(
      (finding) => finding.grouped_finding_id === groupedId
    );
    return (
      <Table
        dataSource={filtered}
        columns={RAW_FINDINGS_TABLE_COLUMNS}
        pagination={false}
        rowKey={(record) => record.id}
      />
    );
  }

  return (
    <Table
      dataSource={filteredFindings.sort(tableDefaultSort)}
      columns={GROUPED_FINDING_TABLE_COLUMNS}
      rowKey={(record) => record.id}
      scroll={{ x: 1500, y: 500 }}
      expandable={{
        expandedRowRender: RawExpansionTable,
        defaultExpandedRowKeys: ["0"],
      }}
    />
  );
}

function PieChart({
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

export default function App() {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(
    null
  );
  const [showPieDirections, setShowPieDirections] = useState<boolean>(false);
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>([]);
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

  useEffect(() => {
    setGroupedFindings(grouped);
  }, []);

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
