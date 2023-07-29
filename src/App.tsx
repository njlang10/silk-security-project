import "./styles.css";
import React from "react";
import grouped from "./db/grouped_findings.json";
import raw from "./db/raw_findings.json";
import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";

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

/**
 * id INTEGER PRIMARY KEY, source_security_tool_name TEXT, source_security_tool_id TEXT, source_collaboration_tool_name TEXT, source_collaboration_tool_id TEXT, severity TEXT, finding_created TEXT, ticket_created TEXT, description TEXT, asset TEXT, status TEX, remediation_url TEXT, remediation_text TEXT, grouped_finding_id INTEGER)
 */
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

function getFilterForKey(
  key: keyof GroupedFinding
): ColumnType<GroupedFinding>["filters"] {
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
): ColumnType<GroupedFinding>["onFilter"] {
  switch (key) {
    case "severity":
      return (value: string | number | boolean, record: GroupedFinding) => {
        return record.severity === value;
      };
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
}));

function GroupedFindingTable({
  groupedFindings,
}: {
  groupedFindings: GroupedFinding[];
}): JSX.Element {
  const [rawFindings, setRawFindings] = useState<RawFinding[]>([]);
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
      dataSource={groupedFindings}
      columns={GROUPED_FINDING_TABLE_COLUMNS}
      rowKey={(record) => record.id}
      scroll={{ x: 1500 }}
      expandable={{
        expandedRowRender: RawExpansionTable,
        defaultExpandedRowKeys: ["0"],
      }}
    />
  );
}

export default function App() {
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>([]);

  useEffect(() => {
    setGroupedFindings(grouped);
  }, []);
  return (
    <div className="App">
      <h1>Grouped Findings Dashboard</h1>
      <GroupedFindingTable groupedFindings={groupedFindings} />
    </div>
  );
}
