import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  List,
  Search,
  CheckCircle2,
  XCircle,
  Bed,
  Wind,
  Bath,
  Users,
  Hash,
  AlertCircle,
} from "lucide-react";

/**
 * COMMIT 2: Room Management & Inventory
 * Implements Add Room logic, Room Listing, Filtering, and LocalStorage persistence.
 */
const App = () => {
  // --- State Management ---
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("hostel_rooms");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState("add");

  // Form State for Adding Room
  const [newRoom, setNewRoom] = useState({
    roomNo: "",
    capacity: "",
    hasAC: false,
    hasAttachedWashroom: false,
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search/Filter State for the List View
  const [searchFilter, setSearchFilter] = useState({
    minCapacity: "",
    needsAC: false,
    needsWashroom: false,
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem("hostel_rooms", JSON.stringify(rooms));
  }, [rooms]);

  // --- Logic: Add Room ---
  const handleAddRoom = (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!newRoom.roomNo || !newRoom.capacity) {
      setFormError("Room number and capacity are required.");
      return;
    }

    if (rooms.some((r) => r.roomNo === newRoom.roomNo)) {
      setFormError("Room number already exists.");
      return;
    }

    const roomToAdd = {
      ...newRoom,
      capacity: parseInt(newRoom.capacity),
      id: Date.now(),
    };

    setRooms([...rooms, roomToAdd]);
    setNewRoom({
      roomNo: "",
      capacity: "",
      hasAC: false,
      hasAttachedWashroom: false,
    });
    setSuccessMessage(`Room ${roomToAdd.roomNo} added successfully!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // --- Logic: Search/Filter Rooms ---
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchCapacity =
        searchFilter.minCapacity === "" ||
        room.capacity >= parseInt(searchFilter.minCapacity);
      const matchAC = !searchFilter.needsAC || room.hasAC;
      const matchWashroom =
        !searchFilter.needsWashroom || room.hasAttachedWashroom;
      return matchCapacity && matchAC && matchWashroom;
    });
  }, [rooms, searchFilter]);

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

      <main className="max-w-5xl mx-auto p-4 mt-6">
        {/* ADD ROOM FORM */}
        {activeTab === "add" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <PlusCircle className="text-indigo-600" /> Register New Room
              </h2>
              {successMessage && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm border border-emerald-100 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={16} /> {successMessage}
                </div>
              )}
            </div>

            <form
              onSubmit={handleAddRoom}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Room Number
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="e.g. 101-A"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={newRoom.roomNo}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, roomNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Max Capacity
                </label>
                <div className="relative">
                  <Users
                    className="absolute left-3 top-3 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    placeholder="Number of students"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={newRoom.capacity}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, capacity: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={newRoom.hasAC}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, hasAC: e.target.checked })
                      }
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Air Conditioned
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={newRoom.hasAttachedWashroom}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          hasAttachedWashroom: e.target.checked,
                        })
                      }
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    Attached Washroom
                  </span>
                </label>
              </div>

              {formError && (
                <div className="md:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                  <AlertCircle size={16} /> {formError}
                </div>
              )}

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100"
                >
                  Save Room Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ROOM LIST SCREEN */}
        {activeTab === "list" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <List className="text-indigo-600" /> Hostel Room Inventory
              </h2>

              {/* Internal Filtering UI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Min Capacity
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="Filter by capacity..."
                    value={searchFilter.minCapacity}
                    onChange={(e) =>
                      setSearchFilter({
                        ...searchFilter,
                        minCapacity: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 pt-4 md:pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={searchFilter.needsAC}
                      onChange={(e) =>
                        setSearchFilter({
                          ...searchFilter,
                          needsAC: e.target.checked,
                        })
                      }
                    />{" "}
                    AC Rooms
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={searchFilter.needsWashroom}
                      onChange={(e) =>
                        setSearchFilter({
                          ...searchFilter,
                          needsWashroom: e.target.checked,
                        })
                      }
                    />{" "}
                    With Washroom
                  </label>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    onClick={() =>
                      setSearchFilter({
                        minCapacity: "",
                        needsAC: false,
                        needsWashroom: false,
                      })
                    }
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">No rooms found in inventory.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-sm">
                        <th className="py-4 px-4 font-semibold">Room No</th>
                        <th className="py-4 px-4 font-semibold">Capacity</th>
                        <th className="py-4 px-4 font-semibold">Features</th>
                        <th className="py-4 px-4 font-semibold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRooms.map((room) => (
                        <tr
                          key={room.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-4 font-mono font-bold text-slate-700">
                            {room.roomNo}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {room.capacity} Students
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              {room.hasAC && (
                                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">
                                  AC
                                </span>
                              )}
                              {room.hasAttachedWashroom && (
                                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded border border-emerald-100">
                                  Washroom
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() =>
                                setRooms(rooms.filter((r) => r.id !== room.id))
                              }
                              className="text-red-400 hover:text-red-600"
                            >
                              <XCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALLOCATION PLACEHOLDER FOR COMMIT 2 */}
        {activeTab === "allocate" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
              <Search className="text-indigo-600" /> Allocate Room
            </h2>
            <p className="text-slate-500 italic">
              The Smart Allocation algorithm and output panel will be
              implemented in the final commit.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 text-center text-slate-400 text-sm">
        Hostel Room Allocation System - Commit 2: Room Management
      </footer>
    </div>
  );
};

export default App;
