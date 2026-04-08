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

  // Allocation State
  const [allocationInput, setAllocationInput] = useState({
    students: "",
    needsAC: false,
    needsWashroom: false,
  });
  const [allocationResult, setAllocationResult] = useState(null);

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

  // --- Logic: Allocate Room (Core Requirement) ---
  const allocateRoom = (e) => {
    e.preventDefault();
    setAllocationResult(null);

    const students = parseInt(allocationInput.students);
    const needsAC = allocationInput.needsAC;
    const needsWashroom = allocationInput.needsWashroom;

    if (!students || students <= 0) {
      setAllocationResult({
        status: "error",
        message: "Please enter a valid number of students.",
      });
      return;
    }

    // Filter rooms by criteria and then pick the smallest capacity
    const suitableRooms = rooms.filter(
      (r) =>
        r.capacity >= students &&
        r.hasAC === needsAC &&
        r.hasAttachedWashroom === needsWashroom,
    );

    if (suitableRooms.length === 0) {
      setAllocationResult({ status: "fail", message: "No room available" });
    } else {
      // Sort by capacity (ascending) to find the SMALLEST possible room
      suitableRooms.sort((a, b) => a.capacity - b.capacity);
      const bestRoom = suitableRooms[0];
      setAllocationResult({ status: "success", data: bestRoom });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Header */}
      <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Bed className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">SmartHostel</h1>
          </div>
          <div className="flex bg-indigo-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === "add" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <PlusCircle size={18} /> Add Room
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === "list" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <List size={18} /> View Rooms
            </button>
            <button
              onClick={() => setActiveTab("allocate")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === "allocate" ? "bg-white text-indigo-700 shadow-sm" : "hover:bg-indigo-600"}`}
            >
              <Search size={18} /> Allocate Rooms
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
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100 cursor-pointer"
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
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      checked={searchFilter.needsWashroom}
                      onChange={(e) =>
                        setSearchFilter({
                          ...searchFilter,
                          needsWashroom: e.target.checked,
                        })
                      }
                    />{" "}
                    Attached Washroom
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
                    className="text-xs text-indigo-600 hover:underline cursor-pointer"
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
                        <th className="py-4 px-4 font-semibold">Room No.</th>
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
                                  Attached Washroom
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() =>
                                setRooms(rooms.filter((r) => r.id !== room.id))
                              }
                              className="text-red-400 hover:text-red-600 cursor-pointer p-1"
                              title="Delete Room"
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

        {/* SEARCH AND ALLOCATE SCREEN */}
        {activeTab === "allocate" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Allocation Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="text-indigo-600" /> Allocate Rooms
              </h2>
              <form onSubmit={allocateRoom} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    placeholder="Enter group size"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={allocationInput.students}
                    onChange={(e) =>
                      setAllocationInput({
                        ...allocationInput,
                        students: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-slate-600">Requires AC</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      checked={allocationInput.needsAC}
                      onChange={(e) =>
                        setAllocationInput({
                          ...allocationInput,
                          needsAC: e.target.checked,
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-slate-600">
                      Attached Washroom
                    </span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      checked={allocationInput.needsWashroom}
                      onChange={(e) =>
                        setAllocationInput({
                          ...allocationInput,
                          needsWashroom: e.target.checked,
                        })
                      }
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={18} /> Allocate Rooms
                </button>
              </form>
            </div>

            {/* Output Display Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                  Allocation Output
                </h3>

                {!allocationResult ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-3">
                    <Search size={48} strokeWidth={1} />
                    <p>
                      Enter requirements on the left to find the <br />
                      <strong>smallest possible matching room</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1">
                    {allocationResult.status === "success" ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={32} />
                        </div>
                        <h4 className="text-2xl font-bold text-emerald-900">
                          Room Allocated!
                        </h4>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-emerald-200 inline-block">
                          <p className="text-slate-500 text-sm mb-1 uppercase tracking-widest">
                            Selected Room
                          </p>
                          <p className="text-4xl font-black text-indigo-600">
                            {allocationResult.data.roomNo}
                          </p>
                          <div className="mt-4 flex justify-center gap-3">
                            <span className="px-3 py-1 bg-slate-100 rounded text-xs text-slate-600 font-bold">
                              {allocationResult.data.capacity} Capacity
                            </span>
                            {allocationResult.data.hasAC && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                                AC
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-emerald-700 text-sm">
                          Optimal match found based on capacity and facilities.
                        </p>
                      </div>
                    ) : allocationResult.status === "fail" ? (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                          <XCircle size={32} />
                        </div>
                        <h4 className="text-2xl font-bold text-red-900">
                          No room available
                        </h4>
                        <p className="text-red-700">
                          Try adjusting your requirements or adding more rooms
                          to inventory.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-8 text-center">
                        <p className="text-amber-700 font-medium">
                          {allocationResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 text-center text-slate-400 text-sm">
        Hostel Room Allocation System
      </footer>
    </div>
  );
};

export default App;
