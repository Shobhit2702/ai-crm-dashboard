# AI-Powered CRM Dashboard & Intelligent Data Importer

A high-performance, enterprise-grade CRM dashboard built to solve the real-world challenge of importing, cleaning, and mapping dirty customer contact lists. The application combines a modern **Next.js** frontend with an **Express.js** API backend, integrating **Google Gemini AI** to dynamically map arbitrary CSV structures to a standard CRM schema.

---

## 🌟 Resume & Interview Talking Points

If you are showcasing this project for internships, full-time roles, or portfolio reviews, highlight the following engineering challenges you solved:

1. **AI-Powered Dynamic Schema Mapping**: Built an integration with **Google Gemini (using `@google/genai`)** using structured output schemas (`responseSchema`) to map arbitrary, unstructured user CSV columns (e.g. `Ph. No.`, `work-email`, `Company Name`) to standardized CRM properties.
2. **Non-Blocking Background Job Pipeline**: Designed and implemented an asynchronous background worker flow for AI operations to avoid HTTP request timeouts during large imports. Triggered batch operations asynchronously and returned immediately with a tracking `jobId`.
3. **Real-time Status Polling**: Integrated a custom React polling mechanism using `setInterval` and React state trees to query backend job statuses, displaying detailed live process updates (e.g. `"AI processing: 40% complete (4/10 records mapped)..."`) without standard WebSockets overhead.
4. **Data Sanitization & Validation**: Crafted a multi-stage data engine. Raw CSV uploads are parsed in-memory using **Papa Parse**, locally validated for structure/format, filtered to ignore bad rows, and sent to Gemini only when they pass minimum requirements.
5. **Modern Dashboard Design**: Created an interactive user experience utilizing CSS custom properties for dark mode, animated with **Framer Motion**, containing real-time reports via **Recharts**, and built with responsive layout designs.

---

## 🛠️ Tech Stack & System Architecture

### Frontend (User Interface)
* **Framework**: React 19 / Next.js 16 (App Router)
* **Styling**: Tailwind CSS & Vanilla CSS (Fluid grids, glassmorphism, dynamic dark/light states)
* **State Management**: React Hooks & Context API
* **Charts/Analytics**: Recharts
* **Animations**: Framer Motion
* **Utilities**: Lucide Icons, React Hot Toast

### Backend (REST API Service)
* **Runtime & Framework**: Node.js & Express.js
* **AI Integration**: Google Gemini SDK (`@google/genai`)
* **CSV Processing**: Papa Parse
* **File Uploads**: Multer (configured with local disk storage and automatic disk cleanup)
* **Validator**: Express-validator (robust request payload schema validation)
* **Security & Loggers**: Helmet (HTTP security headers), CORS (cross-origin resource sharing), Morgan (request logs)

---

## 📂 Project Structure

```text
ai-crm-dashboard/
├── backend/                  # REST API Service
│   ├── src/
│   │   ├── config/           # Gemini, Multer, Environment configurations
│   │   ├── controllers/      # Route controllers (upload, import, jobs)
│   │   ├── middleware/       # Express validation, multer, and global error handling
│   │   ├── prompts/          # Gemini AI system prompts and schemas
│   │   ├── routes/           # Combined API router entrypoints
│   │   ├── services/         # Business logic (AI processing, PapaParse validation, Job Queue)
│   │   └── utils/            # AppError classes and helper utilities
│   ├── uploads/              # Temporary file storage (auto-cleaned)
│   ├── server.js             # API entrypoint (handles graceful shutdowns)
│   └── package.json
│
├── frontend/                 # Next.js Web App
│   ├── src/
│   │   ├── app/              # App Router pages (Dashboard, Customers, CSV Import)
│   │   ├── components/       # Core UI elements (SectionHeader, Sidebar, Buttons)
│   │   ├── context/          # Global application states
│   │   ├── features/         # Feature modules (customers view, csv-import views)
│   │   │   └── csv-import/
│   │   │       ├── components/ # CSVUploader, FileCard, Summary, PreviewTable, LoadingOverlay
│   │   │       └── CSVImportView.jsx # Core controller orchestrating upload, poll, and table displays
│   │   └── lib/              # Client utility functions
│   └── package.json
└── README.md
```

---

## 🚀 API Endpoint Documentation

### 1. CSV File Upload
* **Endpoint**: `POST /api/upload`
* **Content-Type**: `multipart/form-data`
* **Payload**: Form field `file` containing the `.csv` file.
* **Response (200 OK)**:
```json
{
  "preview": [
    {
      "name": "Jane Doe",
      "email": "jane@company.com",
      "company": "Acme Corp",
      "location": "Boston, MA",
      "isValid": true,
      "errors": {},
      "raw": { "Name": "Jane Doe", "Contact Email": "jane@company.com", ... }
    }
  ],
  "totalRows": 1,
  "columns": ["Name", "Contact Email", "Company", "City/State"],
  "validRows": 1,
  "invalidRows": 0
}
```

### 2. Initiate Import & Mapping (Asynchronous)
* **Endpoint**: `POST /api/import`
* **Content-Type**: `application/json`
* **Payload**:
```json
{
  "records": [
    { "Name": "Jane Doe", "Contact Email": "jane@company.com", "Company": "Acme Corp" }
  ],
  "runSync": false
}
```
* **Response (202 Accepted)**:
```json
{
  "statusCode": 202,
  "message": "Import process started",
  "data": {
    "jobId": "8f8bca12-b91b-4b13-8898-cd8ab1c3d142",
    "status": "pending",
    "progress": 0,
    "totalRecords": 1
  }
}
```

### 3. Check Job Status & Retrieve Mapped CRM Records
* **Endpoint**: `GET /api/import/status/:jobId`
* **Response (200 OK - Processing)**:
```json
{
  "statusCode": 200,
  "message": "Import job status retrieved successfully",
  "data": {
    "jobId": "8f8bca12-b91b-4b13-8898-cd8ab1c3d142",
    "status": "processing",
    "progress": 40,
    "processedRecords": 2,
    "totalRecords": 5,
    "result": null,
    "error": null
  }
}
```
* **Response (200 OK - Completed)**:
```json
{
  "statusCode": 200,
  "message": "Import job status retrieved successfully",
  "data": {
    "jobId": "8f8bca12-b91b-4b13-8898-cd8ab1c3d142",
    "status": "completed",
    "progress": 100,
    "processedRecords": 5,
    "totalRecords": 5,
    "result": {
      "imported": 4,
      "skipped": 1,
      "failed": 0,
      "records": [
        {
          "created_at": "2026-07-09T20:00:00.000Z",
          "name": "Jane Doe",
          "email": "jane@company.com",
          "country_code": "+1",
          "mobile_without_country_code": "5550192",
          "company": "Acme Corp",
          "city": "Boston",
          "state": "MA",
          "country": "USA",
          "lead_owner": "Sales Team",
          "crm_status": "GOOD_LEAD_FOLLOW_UP",
          "data_source": "leads_on_demand",
          "description": "Imported from CSV list"
        }
      ]
    },
    "error": null
  }
}
```

---

## 🛠️ Gemini AI Mapping Prompt Engineering

The backend uses a specialized system prompt mapping system found in `backend/src/prompts/crmPrompt.js`. It forces the Google Gemini model to return a structured JSON response corresponding to a strict schema array. 

### Key AI Processing Guidelines:
* Extract phone country codes and local digits separately (e.g. mapping `+91 9999999999` to country code `+91` and mobile `9999999999`).
* Match lead status values strictly against allowed database Enums: `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, or `SALE_DONE`.
* Match data sources against: `leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, or `sarjapur_plots`.
* Exclude and skip rows that do not contain **at least** an email address or mobile number.
* Use a low temperature configuration (`0.1`) to enforce deterministic mappings and prevent hallucinations.

---

## 🏁 Installation & Local Execution

### Prerequisites
* **Node.js** (v18.x or above recommended)
* **npm** (v9.x or above)
* **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 1. Set Up the Backend
Navigate to the backend directory, install packages, configure environment variables, and start the server:
```bash
cd backend
npm install
```
Create a `.env` file in the root of the `backend/` folder:
```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
Run the backend server in development mode:
```bash
npm run dev
```
The server will boot up at `http://localhost:5001`.

### 2. Set Up the Frontend
Open a new terminal window, navigate to the frontend directory, install packages, and start the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```
The Next.js web application will start at `http://localhost:3000`.

---

## 🤝 Verification & Production Builds
Ensure all code runs correctly and meets production constraints:
```bash
# Build NextJS Frontend for deployment
cd frontend
npm run build

# Run Backend Linter or startup check
cd backend
node server.js
```
The frontend build runs in Turbopack and yields clean, optimized static/dynamic pages with proper hydration and routing.
