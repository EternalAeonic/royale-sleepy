import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// In-memory store for OTPs
const otpStore = new Map();

// Endpoint: Request OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // Generate 4-digit OTP (for testing, we can use 1234 or random)
  // Let's use a random 4-digit OTP but log it, or just use a fixed one for testing if desired.
  // We'll generate a random one to make it feel real.
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60000 }); // 5 min expiry
  
  console.log(`\n\n[SMS SIMULATOR] Sending OTP ${otp} to ${phone}\n\n`);

  // We return the OTP in the response ONLY because this is a simulated backend
  // In a real app, we would NEVER send the OTP back in the API response.
  res.json({ success: true, message: 'OTP sent successfully', simulatedOtp: otp });
});

// Endpoint: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

  const record = otpStore.get(phone);
  
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // OTP is correct. Clear it.
  otpStore.delete(phone);

  // Find or create user in database
  const db = readDB();
  let user = db.users.find(u => u.phone === phone);
  let isNew = false;
  
  if (!user) {
    isNew = true;
    user = {
      id: Date.now().toString(),
      phone,
      name: `User ${phone.slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDB(db);
  }

  // In a real app, generate a JWT. We'll simulate a token.
  const token = Buffer.from(JSON.stringify({ id: user.id, phone })).toString('base64');

  res.json({ success: true, token, user, isNew });
});

// Endpoint: Get Current User (using token)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  try {
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    const db = readDB();
    const user = db.users.find(u => u.id === payload.id);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: ${DB_FILE}\n`);
});
