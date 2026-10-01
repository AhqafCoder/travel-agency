"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Search, Eye, Trash2, Mail, Phone, Calendar, Users, MapPin, MessageSquare } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Detail Modal State
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Delete State
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
      if (search) params.search = search;
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await api.admin.leads.list(params);
      setLeads(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalLeads(res.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, pageSize, statusFilter, search]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await api.admin.leads.update(leadId, { status: newStatus });
      await fetchLeads();
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || "Failed to update lead status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async (leadId: string) => {
    try {
      setUpdatingStatus(true);
      await api.admin.leads.update(leadId, { notes: adminNotes });
      await fetchLeads();
      if (selectedLead) {
        setSelectedLead({ ...selectedLead, notes: adminNotes });
      }
      alert("Notes updated successfully");
    } catch (err: any) {
      alert(err.message || "Failed to update notes");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    try {
      setIsDeleting(true);
      await api.admin.leads.delete(leadToDelete._id);
      setLeadToDelete(null);
      await fetchLeads();
    } catch (err: any) {
      alert(err.message || "Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "CONTACTED":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "CONVERTED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CLOSED":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Enquiry Leads</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage customer enquiries submitted from website pop-up forms ({totalLeads} total)
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone or destination..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Travel Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No enquiry leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-400 flex items-center font-bold justify-center text-xs">
                          {lead.name?.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-xs text-zinc-500">ID: {lead._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" /> {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" /> {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-orange-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {lead.destination}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-0.5 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {lead.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-zinc-500" /> {lead.noOfPeople} {lead.noOfPeople === 1 ? "person" : "people"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeVariant(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-400">
                      {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setAdminNotes(lead.notes || "");
                            setIsDetailOpen(true);
                          }}
                          title="View Details"
                          className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLeadToDelete(lead)}
                          title="Delete Lead"
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-950/40 text-xs text-zinc-400">
            <div>
              Showing page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span> ({totalLeads} total enquiries)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail & Notes Modal */}
      {isDetailOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                  <p className="text-xs text-zinc-400">Enquiry submitted on {new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status Selector */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Update Enquiry Status</label>
                <div className="flex flex-wrap gap-2">
                  {["NEW", "CONTACTED", "CONVERTED", "CLOSED"].map((s) => (
                    <button
                      key={s}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(selectedLead._id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedLead.status === s
                          ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiry Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  <span className="text-xs text-zinc-500 block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-medium text-orange-400 hover:underline flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {selectedLead.email}
                  </a>
                </div>

                <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  <span className="text-xs text-zinc-500 block mb-1">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm font-medium text-orange-400 hover:underline flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> {selectedLead.phone}
                  </a>
                </div>

                <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  <span className="text-xs text-zinc-500 block mb-1">Destination</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" /> {selectedLead.destination}
                  </span>
                </div>

                <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  <span className="text-xs text-zinc-500 block mb-1">Travel Date & Group Size</span>
                  <div className="flex items-center gap-3 text-sm text-zinc-200">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-zinc-500" /> {selectedLead.date}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4 text-zinc-500" /> {selectedLead.noOfPeople} pax</span>
                  </div>
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Internal Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about customer conversation, follow-up calls, custom quote details..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                />
                <div className="flex justify-end">
                  <button
                    disabled={updatingStatus}
                    onClick={() => handleSaveNotes(selectedLead._id)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-800 bg-zinc-950">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {leadToDelete && (
        <ConfirmDialog
          open={!!leadToDelete}
          onOpenChange={(open) => !open && setLeadToDelete(null)}
          title="Delete Enquiry Lead"
          description={`Are you sure you want to delete the enquiry from ${leadToDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete Lead"
          loading={isDeleting}
          onConfirm={handleDeleteLead}
        />
      )}
    </div>
  );
}
