# Student Management System

A full-stack student management application built with ASP.NET Core (Backend) and React + Vite (Frontend).

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- SQL Server / LocalDB

---

## Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd "Backend/Student Management"
   ```

2. Update the connection string in `appsettings.json` if needed:
   ```json
   "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=StudentDB;Trusted_Connection=True;TrustServerCertificate=True;"
   ```

3. Apply migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

   API runs at `https://localhost:5001` (or as configured).

---

## Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd Frontend/studentmanagement
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and set the API base URL:
   ```env
   VITE_API_URL=https://localhost:5001
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | ASP.NET Core, Entity Framework Core, JWT Auth |
| Frontend | React 19, Vite, Bootstrap 5, Axios |
| Database | SQL Server / LocalDB              |
