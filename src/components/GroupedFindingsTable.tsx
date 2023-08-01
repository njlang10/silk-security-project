import React from "react";
import { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import {
  UrlCellRenderer,
  DescriptionCellRenderer,
  SeverityCellRenderer,
} from "./CellRenderers";
import {
  GroupedFinding,
  RawFinding,
  Severity,
  getSeveritySort,
} from "../db/data_utils";
import type { ColumnsType, ColumnType } from "antd/es/table";
import raw from "../db/raw_findings.json";

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

export function GroupedFindingTable({
  groupedFindings,
  filterToSeverity = null,
}: {
  groupedFindings: GroupedFinding[];
  filterToSeverity?: Severity | null;
}): JSX.Element {
  // Local State
  const [rawFindings, setRawFindings] = useState<RawFinding[]>([]);

  // Derived State
  const filteredFindings = useMemo(() => {
    if (filterToSeverity !== null) {
      return groupedFindings.filter(
        (finding) => finding.severity === filterToSeverity
      );
    }
    return groupedFindings;
  }, [filterToSeverity, groupedFindings]);

  // Effects
  useEffect(() => {
    setRawFindings(raw);
  }, []);

  // Helpers
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

// Utilities
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
