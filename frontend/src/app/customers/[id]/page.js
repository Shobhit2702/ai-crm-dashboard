"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Linkedin,
  Plus,
  Download,
  Trash,
  Edit,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  UserCheck,
  Tag as TagIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerAvatar } from "@/features/customers/components/CustomerAvatar";
import { CustomerDetailsStats } from "@/features/customers/components/CustomerStats";
import { CustomerTimeline } from "@/features/customers/components/CustomerTimeline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import customersData from "@/features/customers/data/mockCustomers.json";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;

  // Retrieve customer by id, fallback to Alex Rivera if not found
  const initialCustomer = useMemo(() => {
    return (
      customersData.find((c) => c.id === customerId) ||
      customersData.find((c) => c.id === "alex-rivera")
    );
  }, [customerId]);

  const [customer, setCustomer] = useState(initialCustomer);
  const [activeTab, setActiveTab] = useState("Overview");
  
  // Note creation state
  const [notes, setNotes] = useState(customer.notes || []);
  const [newNoteText, setNewNoteText] = useState("");
  
  // Tag creation state
  const [tags, setTags] = useState(customer.tags || []);
  const [newTagText, setNewTagText] = useState("");
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: customer.name,
    jobTitle: customer.jobTitle,
    company: customer.company,
    email: customer.email,
    phone: customer.phone,
    linkedin: customer.linkedin,
    status: customer.status,
  });

  const handleDelete = () => {
    alert(`Deleted customer ${customer.name} (simulated)`);
    router.push("/customers");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCustomer({
      ...customer,
      ...editForm,
    });
    setEditModalOpen(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const note = {
      id: String(Date.now()),
      content: newNoteText,
      date: "Just now",
      author: "Alex Rivera", // current user placeholder
    };
    setNotes([note, ...notes]);
    setNewNoteText("");
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagText.trim()) return;
    if (!tags.includes(newTagText.trim())) {
      setTags([...tags, newTagText.trim()]);
    }
    setNewTagText("");
    setShowAddTagInput(false);
  };

  const tabsList = ["Overview", "History", "Notes", "Tags"];

  const rightActions = (
    <>
      <Button
        variant="outline"
        onClick={() => setEditModalOpen(true)}
        className="flex items-center gap-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <Edit className="h-4 w-4" />
        <span>Edit</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => setDeleteModalOpen(true)}
        className="flex items-center gap-1 border-red-200 bg-white text-red-650 hover:bg-red-50 dark:border-slate-850 dark:bg-slate-950 dark:text-red-400"
      >
        <Trash className="h-4 w-4" />
        <span>Delete</span>
      </Button>

      <Button
        onClick={() => alert("Exporting profile records (simulated)...")}
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      {/* breadcrumbs header */}
      <SectionHeader
        breadcrumbs={["Home", "Customers", customer.name]}
        title={customer.name}
        subtitle={`${customer.jobTitle} @ ${customer.company}`}
        actions={rightActions}
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Customer Profile Summary Card */}
        <div className="space-y-6 col-span-1">
          {/* Card 1: Main Avatar Card */}
          <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 shadow-xs flex flex-col items-center p-6 text-center">
            <CustomerAvatar
              avatar={customer.avatar}
              name={customer.name}
              status={customer.status}
              size="lg"
              showStatusBadge={true}
              className="mt-2 mb-4"
            />
            
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 mt-2">
              {customer.name}
            </h2>
            <span className="text-xs text-slate-450 dark:text-slate-400 font-medium">
              {customer.jobTitle} @ {customer.company}
            </span>

            {/* Profile Fields List */}
            <div className="w-full mt-6 space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/30 border border-slate-50 dark:bg-slate-900/10 dark:border-slate-850/60 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-semibold text-slate-750 dark:text-slate-200 truncate flex-1 text-left">
                  {customer.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-50/30 border border-slate-50 dark:bg-slate-900/10 dark:border-slate-850/60 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-semibold text-slate-750 dark:text-slate-200 truncate flex-1 text-left">
                  {customer.phone || "N/A"}
                </span>
              </div>

              {/* Linkedin */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50/30 border border-slate-50 dark:bg-slate-900/10 dark:border-slate-850/60 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Linkedin className="h-4 w-4" />
                </div>
                <a
                  href={`https://${customer.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400 truncate flex-1 text-left"
                >
                  {customer.linkedin || "N/A"}
                </a>
              </div>
            </div>
          </Card>

          {/* Card 2: Profile Tags Card */}
          <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tags
              </CardTitle>
              <button
                onClick={() => setShowAddTagInput(!showAddTagInput)}
                className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-900 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </CardHeader>
            <CardContent>
              {showAddTagInput && (
                <form onSubmit={handleAddTag} className="flex gap-2 mb-3">
                  <Input
                    size="sm"
                    placeholder="New tag..."
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    className="h-8 text-xs bg-transparent"
                  />
                  <Button type="submit" size="xs" className="h-8 bg-blue-600 text-white hover:bg-blue-700">
                    Add
                  </Button>
                </form>
              )}
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2.5 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Recent Imports CSV list */}
          <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Recent Imports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.recentImports && customer.recentImports.length > 0 ? (
                customer.recentImports.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 bg-slate-50/20 dark:border-slate-850/40 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors duration-150 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileSpreadsheet className="h-5 w-5 text-indigo-500 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {file.filename}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {file.date} • {file.size}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading CSV sheet ${file.filename}...`)}
                      className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Download className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic block">
                  No CSV import history found.
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabbed Information */}
        <div className="space-y-6 col-span-1 lg:col-span-2">
          {/* Tab Navigation header */}
          <div className="flex border-b border-slate-100 dark:border-slate-850 gap-6">
            {tabsList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-3 text-sm font-semibold relative transition-all duration-200",
                  activeTab === tab
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Render Tab Contents */}
          <div className="pt-2">
            {activeTab === "Overview" && (
              <div className="space-y-6">
                {/* Stats summary row */}
                <CustomerDetailsStats
                  ltv={customer.ltv}
                  lastInteraction={customer.lastInteraction}
                  lastInteractionMethod={customer.lastInteractionMethod}
                  health={customer.health}
                />

                {/* Timeline activity summary */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Activity History
                  </h3>
                  <CustomerTimeline history={customer.history} />
                </div>
              </div>
            )}

            {activeTab === "History" && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
                  Full Timeline History
                </h3>
                <CustomerTimeline history={customer.history} />
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="space-y-6">
                {/* Add new note form */}
                <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 p-4">
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Write a profile note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="w-full text-sm bg-transparent border border-slate-200 rounded-md p-3 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:text-slate-100"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        Add Note
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Notes List */}
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="border border-slate-100 dark:bg-slate-900/10 dark:border-slate-850 p-4 hover:shadow-xs transition-shadow">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-2 border-b border-slate-50 dark:border-slate-850 pb-1.5">
                        <span>Added by {note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                        {note.content}
                      </p>
                    </Card>
                  ))}
                  {notes.length === 0 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                      No profile notes saved yet.
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Tags" && (
              <div className="space-y-6">
                <Card className="border border-slate-100 dark:bg-slate-950 dark:border-slate-850 p-4">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                    <TagIcon className="h-4 w-4 text-slate-400" />
                    <span>Configure Customer Tags</span>
                  </h3>
                  
                  <form onSubmit={handleAddTag} className="flex gap-2 max-w-sm mb-4">
                    <Input
                      placeholder="Add tag label..."
                      value={newTagText}
                      onChange={(e) => setNewTagText(e.target.value)}
                      className="bg-transparent"
                    />
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                      Add
                    </Button>
                  </form>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>


      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {customer.name}? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-650 hover:bg-red-750 text-white font-semibold">
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <DialogDescription>
              Update {customer.name}'s contact fields.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Job Title</label>
              <Input
                value={editForm.jobTitle}
                onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
              <Input
                value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile</label>
              <Input
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full text-sm bg-transparent border border-slate-200 rounded-md px-3 py-2 text-slate-700 dark:border-slate-800 dark:text-slate-350 dark:bg-slate-900"
              >
                <option value="Active">Active</option>
                <option value="Lead">Lead</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
