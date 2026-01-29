# SecurityReport-Web 🔐

An interactive, client-side React application designed to transform raw MS365 security data (exported via PowerShell) into beautiful, actionable security reports. This project is an add-on to the existing Security Report PowerShell module.

## 🌟 Features

- **100% Client-Side**: Your security data never leaves your browser. All processing and rendering happen locally.
- **Interactive Dashboards**: Filter user metrics, compliance data, and security scores with a single click.
- **Detailed Insights**: Expandable table rows reveal the full JSON data structure for every entry.
- **High-Fidelity Export**: Save your findings as a professional PDF or a standalone, portable HTML file.
- **Modern UI**: Built with Tailwind CSS, React 19, and TanStack Table for a fast, polished experience.

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Tables**: [@tanstack/react-table](https://tanstack.com/table/v8)
- **Charts**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Validation**: [Zod](https://zod.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Local Development

1. **Navigate to the web project:**
   ```bash
   cd security-report-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build & Deployment

### 1. Configure Custom Subdomain (Option B)

Ensure the `security-report-web/public/CNAME` file contains your target subdomain:
```text
report.yourcompany.com
```

### 2. DNS Setup
In your domain provider's DNS settings, add a CNAME record:
- **Type**: `CNAME`
- **Name**: `report` (or your chosen prefix)
- **Value**: `your-github-username.github.io`

### 3. Deploy to GitHub Pages
Whenever you want to publish updates, run:
```bash
cd security-report-web
npm run deploy
```
*This command will automatically run the build process and push the results to the `gh-pages` branch.*

---

## 📝 Usage with PowerShell Module

1. Run your PowerShell security export script to generate a `.json` file.
2. Open the **SecurityReport-Web** application.
3. Drag and drop the `.json` file onto the upload zone.
4. Interact with the report and export to PDF when ready.

---

## 📄 License

This project is for internal use. All data remains private and local to the user's browser session.
