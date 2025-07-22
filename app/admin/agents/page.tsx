"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { getAuthToken } from "@/components/getToken";
import { getSocket } from "../../../lib/socket";
import { toast } from "sonner";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone_call: string;
  status: string;
  is_approved: boolean;
  created_at: string;
  pending_profile_edits?: Record<string, any> | null;
}

export default function AgentsListPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

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
        setAgents(Array.isArray(data) ? data : data.agents);
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
        toast.error("Authentication required");
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
        toast.success("Agent deleted successfully");
      } else {
        toast.error("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Error deleting agent");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required");
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
        toast.success("Agent approved successfully");
      } else {
        toast.error("Failed to approve agent");
      }
    } catch (error) {
      console.error("Error approving agent:", error);
      toast.error("Error approving agent");
    }
  };

  // Approve pending profile edits
  const handleApproveEdits = async (id: string) => {
    setPendingAction(id + '-approve');
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      const response = await fetch(`/api/agents/${id}/approve-edits`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setAgents((prev) => prev.map((a) => a.id === id ? { ...a, ...a.pending_profile_edits, pending_profile_edits: null, status: 'approved' } : a));
        toast.success("Profile edits approved.");
      } else {
        toast.error("Failed to approve edits.");
      }
    } catch (error) {
      toast.error("Error approving edits.");
    } finally {
      setPendingAction(null);
    }
  };

  // Reject pending profile edits
  const handleRejectEdits = async (id: string) => {
    setPendingAction(id + '-reject');
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      const response = await fetch(`/api/agents/${id}/reject-edits`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setAgents((prev) => prev.map((a) => a.id === id ? { ...a, pending_profile_edits: null, status: 'approved' } : a));
        toast.success("Profile edits rejected.");
      } else {
        toast.error("Failed to reject edits.");
      }
    } catch (error) {
      toast.error("Error rejecting edits.");
    } finally {
      setPendingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Filter agents with pending edits
  const agentsWithPendingEdits = agents.filter(a => a.pending_profile_edits && Object.keys(a.pending_profile_edits).length > 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <Link href="/admin/agents/new">
          <Button>Add New Agent</Button>
        </Link>
      </div>

      {/* Pending Profile Edits Section */}
      {agentsWithPendingEdits.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-yellow-700 mb-4">Pending Profile Edits</h2>
          <div className="grid gap-6">
            {agentsWithPendingEdits.map(agent => (
              <div key={agent.id} className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-gray-800">Current Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><span className="font-medium">Name:</span> {agent.name}</div>
                    <div><span className="font-medium">Email:</span> {agent.email}</div>
                    <div><span className="font-medium">Phone:</span> {agent.phone_call}</div>
                    <div><span className="font-medium">Status:</span> {agent.status}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-gray-800">Pending Edits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(agent.pending_profile_edits || {}).map(([key, value]) => (
                      <div key={key}><span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}</div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={pendingAction === agent.id + '-approve'}
                      onClick={() => handleApproveEdits(agent.id)}
                    >
                      {pendingAction === agent.id + '-approve' ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pendingAction === agent.id + '-reject'}
                      onClick={() => handleRejectEdits(agent.id)}
                    >
                      {pendingAction === agent.id + '-reject' ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
