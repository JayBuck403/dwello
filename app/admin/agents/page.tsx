"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { getAuthToken } from "@/components/getToken";
import { getSocket } from "../../../lib/socket";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone_call: string;
  status: string;
  is_approved: boolean;
  created_at: string;
}

export default function AgentsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8000/api/admin/agents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAgents(data);
      } catch (e: any) {
        console.error("Could not fetch agents:", e);
        setError("Failed to load agents.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();

    // --- Real-time updates ---
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }
    const socket = socketRef.current;

    // Agent created
    socket.on("agentCreated", (agent: Agent) => {
      setAgents((prev) => {
        if (prev.some((a) => a.id === agent.id)) return prev;
        return [agent, ...prev];
      });
    });
    // Agent updated
    socket.on("agentUpdated", (agent: Agent) => {
      setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, ...agent } : a)));
    });
    // Agent deleted
    socket.on("agentDeleted", (id: string) => {
      setAgents((prev) => prev.filter((a) => a.id !== id));
    });
    return () => {
      socket.off("agentCreated");
      socket.off("agentUpdated");
      socket.off("agentDeleted");
    };
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAgents(agents.filter(agent => agent.id !== id));
        alert("Agent deleted successfully");
      } else {
        alert("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Error deleting agent");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/agents/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAgents(agents.map(agent => 
          agent.id === id 
            ? { ...agent, status: 'approved', is_approved: true }
            : agent
        ));
        alert("Agent approved successfully");
      } else {
        alert("Failed to approve agent");
      }
    } catch (error) {
      console.error("Error approving agent:", error);
      alert("Error approving agent");
    }
  };

  if (loading) {
    return <div>Loading agents...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <Link href="/admin/agents/new">
          <Button>Add New Agent</Button>
        </Link>
      </div>

      {agents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Phone
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="py-3 px-6 text-right font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray-200">
                  <td className="py-3 px-6 text-left">{agent.name}</td>
                  <td className="py-3 px-6 text-left">{agent.email}</td>
                  <td className="py-3 px-6 text-left">{agent.phone_call}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right relative">
                    <button
                      onClick={() => toggleDropdown(agent.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-2 rounded-md focus:outline-none focus:shadow-outline"
                    >
                      <EllipsisVertical className="h-5 w-5" />
                    </button>
                    {openDropdownId === agent.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-10">
                        <Link
                          href={`/admin/agents/edit/${agent.id}`}
                          className="block py-2 px-4 text-gray-700 hover:bg-gray-100 text-center"
                        >
                          Edit
                        </Link>
                        {!agent.is_approved && (
                          <button
                            onClick={() => handleApprove(agent.id)}
                            className="block py-2 px-4 text-green-600 hover:bg-gray-100 w-full focus:outline-none"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="block py-2 px-4 text-red-500 hover:bg-gray-100 w-full focus:outline-none"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No agents found.</p>
      )}
    </div>
  );
}
