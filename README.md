Smart Hostel Room Allocation System

A robust React-based application designed to manage hostel room inventory and intelligently allocate rooms to students based on capacity and specific facility requirements.

📋 Objective

The goal of this project is to automate the hostel room assignment process. It ensures that students are placed in rooms that meet their specific needs (AC/Attached Washroom) while optimizing hostel resources by selecting the smallest available room that fits the student group size.

✨ Features

Add Room: Dynamic form to register new rooms with unique room numbers, capacity, and facility tags.

Room Inventory: A centralized list to view all registered rooms with real-time badges for AC and Washroom status.

Advanced Filtering: Search and filter the inventory by minimum capacity or specific facility requirements.

Smart Allocation Engine: A dedicated interface to allocate rooms based on student group size and preferences.

Persistent Storage: Utilizes browser localStorage to ensure data remains available even after page refreshes.

Responsive UI: Built with Tailwind CSS for a premium, mobile-friendly experience.

🧠 Allocation Logic

The system follows a strict optimization algorithm as defined in the technical requirements:

Filtering: The engine first identifies all rooms that meet or exceed the student count and match the facility requirements (AC/Washroom) exactly.

Sorting: The subset of eligible rooms is sorted by capacity in ascending order.

Selection: The system selects the room with the lowest possible capacity from the filtered list. This prevents wasting large rooms on small groups.

Error Handling: If no room satisfies all criteria, the system displays a clear "No room available" message.

🛠️ Tech Stack

Frontend: React.js (Hooks & Functional Components)

Styling: Tailwind CSS (Responsive Design)

Icons: Lucide React

🗄️ Data Model

Each room object contains the following attributes:

roomNo: Unique identifier (String)

capacity: Maximum student count (Number)

hasAC: AC availability (Boolean)

hasAttachedWashroom: Washroom status (Boolean)

📦 Installation & Setup

Clone the repository:

git clone https://github.com/imprashantjha/SmartHostel.git

Install dependencies:

npm install

Run the development server:

npm start
