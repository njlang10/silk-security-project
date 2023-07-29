import "./styles.css";
import React from "react";
import grouped from "./db/grouped_findings.json";
import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
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
  grouped_finding_id: string;
};

const GROUPED_FINDING_TABLE_COLUMNS: ColumnsType<GroupedFinding> = [
  "id",
  "grouping_type",
  "grouping_key",
  "severity",
  "grouped_finding_created",
  "sla",
  "description",
  "security_analyst",
  "workflow",
  "status",
  "progress",
].map((key) => ({
  title: key,
  dataIndex: key,
  key,
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
  data,
}: {
  data: GroupedFinding[];
}): JSX.Element {
  console.log("data", data);
  console.log("columns", GROUPED_FINDING_TABLE_COLUMNS);
  return <Table dataSource={data} columns={GROUPED_FINDING_TABLE_COLUMNS} />;
}

export default function App() {
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>([]);

  useEffect(() => {
    setGroupedFindings(grouped);
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <GroupedFindingTable data={groupedFindings} />
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
