
# 🚀 HostMaster AI - Deployment & Troubleshooting

## 🛑 FIX: "bash: npm: command not found"
This error happens because the cPanel terminal doesn't know where Node.js is located until you activate your specific environment.

**The Solution:**
1. Go to your cPanel Dashboard.
2. Open **"Setup Node.js App"**.
3. Look for the section: **"Command for entering to enter the virtual environment"**.
4. Copy that command (it starts with `source /home/checklistpoint/nodevenv/...`).
5. Paste it into your **Terminal** and press Enter.
6. Your prompt should now start with `(nodevenv:...)`.
7. **Now run:** `npm install`

---

## 🛠️ Production Configuration

### 1. Environment Variables (Environment Only)
Do NOT put your API key in the code. In cPanel:
- Go to **Setup Node.js App** -> **Environment Variables**.
- Add `API_KEY`.
- Paste your Google Gemini API Key.
- Restart the application.

### 2. File Permissions
- Ensure the `/public_html/hostmaster` folder has **755** permissions.
- The Node.js process needs permission to create `hostmaster.db`.

### 3. SMTP Delivery
- Go to the **Settings** tab inside the HostMaster web interface.
- Enter your SMTP details (host, port, user, pass).
- These are stored securely in your local SQLite database.

### 4. Restarting
Always click **"Restart"** in the cPanel Node.js interface after making changes to `server.js` or environment variables.
