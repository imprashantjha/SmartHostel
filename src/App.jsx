import React, { useState } from "react";
import { Bed, PlusCircle, List, Search } from "lucide-react";

/**
 * COMMIT 1: Initial Scaffolding
 * Sets up the Data Model, Navigation, and Basic UI Shell.
 */
const App = () => {
  // 1. Data Model Setup
  // Each room will follow the structure: { id, roomNo, capacity, hasAC, hasAttachedWashroom }
  const [rooms, setRooms] = useState([]);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bed className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">HostelSmart</h1>
          </div>

          <div className="flex bg-indigo-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === "add" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <PlusCircle size={18} /> Add Room
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === "list" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <List size={18} /> View Rooms
            </button>
            <button
              onClick={() => setActiveTab("allocate")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeTab === "allocate" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <Search size={18} /> Allocate
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area (Placeholders for Commit 1) */}
      <main className="max-w-5xl mx-auto p-4 mt-6">
        {activeTab === "add" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Register New Room</h2>
            <p className="text-slate-500 italic">
              Form UI and room registration logic to be implemented in the next
              commit.
            </p>
            <div className="mt-4 border-2 border-dashed border-slate-100 rounded-lg py-12 text-slate-300">
              Form Placeholder
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Room Inventory</h2>
            <p className="text-slate-500 italic">
              Room listing and filter logic to be implemented in the next
              commit.
            </p>
            <div className="mt-4 border-2 border-dashed border-slate-100 rounded-lg py-12 text-slate-300">
              Inventory List Placeholder
            </div>
          </div>
        )}

        {activeTab === "allocate" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Search & Allocate</h2>
            <p className="text-slate-500 italic">
              Allocation algorithm and output panel to be implemented in the
              final commit.
            </p>
            <div className="mt-4 border-2 border-dashed border-slate-100 rounded-lg py-12 text-slate-300">
              Allocation Logic Placeholder
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 text-center text-slate-400 text-sm">
        Hostel Room Allocation System - Commit 1: Scaffolding
      </footer>
    </div>
  );
};

export default App;
