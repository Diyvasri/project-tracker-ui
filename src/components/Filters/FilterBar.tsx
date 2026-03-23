// src/components/Filters/FilterBar.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const statuses = ["To Do", "In Progress", "In Review", "Done"];
const priorities = ["Low", "Medium", "High", "Critical"];
const assignees = ["AD", "MK", "SN", "LR", "DV", "RS"];

export default function FilterBar() {
  // ✅ Step 2: State variables
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);

  // ✅ React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Step 4: Read filters from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    const priorityParam = params.get("priority");
    const assigneeParam = params.get("assignee");

    if (statusParam) setSelectedStatus(statusParam.split(","));
    if (priorityParam) setSelectedPriority(priorityParam.split(","));
    if (assigneeParam) setSelectedAssignee(assigneeParam.split(","));
  }, [location.search]);

  // ✅ Step 5: Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedStatus.length) params.set("status", selectedStatus.join(","));
    if (selectedPriority.length) params.set("priority", selectedPriority.join(","));
    if (selectedAssignee.length) params.set("assignee", selectedAssignee.join(","));
    navigate(`?${params.toString()}`);
  }, [selectedStatus, selectedPriority, selectedAssignee, navigate]);

  // ✅ Step 3: Toggle functions
  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const togglePriority = (priority: string) => {
    setSelectedPriority((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignee((prev) =>
      prev.includes(assignee) ? prev.filter((a) => a !== assignee) : [...prev, assignee]
    );
  };

  return (
    <div className="p-2 border rounded space-y-4">
      {/* Status Filter */}
      <div>
        <h3 className="font-bold mb-1">Status</h3>
        {statuses.map((status) => (
          <label key={status} className="mr-4">
            <input
              type="checkbox"
              checked={selectedStatus.includes(status)}
              onChange={() => toggleStatus(status)}
              className="mr-1"
            />
            {status}
          </label>
        ))}
      </div>

      {/* Priority Filter */}
      <div>
        <h3 className="font-bold mb-1">Priority</h3>
        {priorities.map((priority) => (
          <label key={priority} className="mr-4">
            <input
              type="checkbox"
              checked={selectedPriority.includes(priority)}
              onChange={() => togglePriority(priority)}
              className="mr-1"
            />
            {priority}
          </label>
        ))}
      </div>

      {/* Assignee Filter */}
      <div>
        <h3 className="font-bold mb-1">Assignee</h3>
        {assignees.map((assignee) => (
          <label key={assignee} className="mr-4">
            <input
              type="checkbox"
              checked={selectedAssignee.includes(assignee)}
              onChange={() => toggleAssignee(assignee)}
              className="mr-1"
            />
            {assignee}
          </label>
        ))}
      </div>
    </div>
  );
}