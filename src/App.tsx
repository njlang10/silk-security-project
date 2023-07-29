import "./styles.css";
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
  progress: string;
};
type GroupedFindingKeys = keyof GroupedFinding;

const TABLE_COLUMNS: ColumnsType<GroupedFinding> = [
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
  "progress"
].map((key) => ({
  title: key,
  dataIndex: key,
  key
}));
/**
 * {"id":1,"grouping_type":"remediation","grouping_key":"https://docs.aws.amazon.com/console/securityhub/Lambda.1/remediation","severity":"low","grouped_finding_created":"2022-03-05 15:25:23.341094","sla":"2022-04-04 15:25:23.341094","description":"Remediation Group: https://docs.aws.amazon.com/console/securityhub/Lambda.1/remediation","security_analyst":"Ron","owner":"Royce","workflow":"Default Workflow","status":"in_progress","progress":0.01702031415373828}
 */

function GroupedFindingTable({
  data
}: {
  data: GroupedFinding[];
}): JSX.Element {
  console.log("data", data);
  console.log("columns", TABLE_COLUMNS);
  return <Table dataSource={data} columns={TABLE_COLUMNS} />;
}

export default function App() {
  const [groupedFindings, setGroupedFindings] = useState<GroupedFinding[]>([]);

  useEffect(() => {
    setGroupedFindings(grouped as GroupedFinding[]);
  }, []);
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <GroupedFindingTable data={groupedFindings} />
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
