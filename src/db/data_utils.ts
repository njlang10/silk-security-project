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

export function getSeveritySort(severity: Severity): number {
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

export function getColorForSeverity(
  severity: Severity
): React.CSSProperties["color"] {
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
