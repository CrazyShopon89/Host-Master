
# 🚀 HostMaster AI - Deployment & Troubleshooting

## 🇧🇩 cPanel-এ লাইভ করার সহজ নিয়ম (Bengali Instructions)
এই অ্যাপটির জন্য কোনো **Build** কমান্ড চালানোর প্রয়োজন নেই। 

**ধাপসমূহ:**
1. **ফাইল আপলোড:** সব ফাইল cPanel-এ আপলোড করুন।
2. **Node.js App সেটআপ:** cPanel-এর "Setup Node.js App" থেকে `server.js` কে Startup file হিসেবে দিন।
3. **API Key:** Environment Variables-এ গিয়ে আপনার `API_KEY` যোগ করুন।
4. **ইন্সটলেশন:** টার্মিনাল ওপেন করে `source` কমান্ডটি রান করার পর `npm install` দিন।
5. **রিস্টার্ট:** অ্যাপটি একবার Restart দিন। ব্যাস! আপনার সাইট লাইভ হয়ে যাবে।

---

## 🛑 FIX: "bash: npm: command not found"
This error happens because the cPanel terminal doesn't know where Node.js is located until you activate your specific environment.

**The Solution:**
1. Go to your cPanel Dashboard.
2. Open **"Setup Node.js App"**.
3. Look for the section: **"Command for entering to enter the virtual environment"**.
4. Copy that command (it starts with `source /home/...`).
5. Paste it into your **Terminal** and press Enter.
6. Now run: `npm install`

---

## 🛠️ Production Configuration

### 1. Environment Variables
In cPanel or Vercel:
- Add `API_KEY`: Your Google Gemini API Key.
- Add `PORT`: Usually 8080 (optional).

### 2. SQLite on Vercel vs cPanel
- **cPanel:** Data **will persist** (স্থায়ী হবে) in the `hostmaster.db` file.
- **Vercel:** Data **will NOT persist** (মুছে যাবে) because Vercel is serverless. For Vercel, use a remote DB like MongoDB or PostgreSQL.

### 3. SMTP Delivery
Configure your SMTP details in the **Settings** tab of the app to send real emails.
