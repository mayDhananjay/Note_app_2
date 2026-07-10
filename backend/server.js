import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import cors from 'cors';

dotenv.config();

// Ensure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "default_secret_for_ai_studio_preview";
}

// In-memory fallback
global.useMemoryDb = false;
global.memoryUsers = [];
global.memoryNotes = [];

const PORT = process.env.PORT || 5000;

const app = express();

// CORS
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://mern-notes-app-smcs.vercel.app",
            "https://mern-notes-app-kx7p.vercel.app",
            "https://mern-notes-app-z85c.vercel.app",
            "https://notes-app-gj5v.vercel.app",
            "https://note-app-2-pi.vercel.app",
            "https://note-app-2-o3wx.vercel.app"
            // Add your latest Vercel URL here if it's different
        ],
        credentials: true,
    })
);

app.use(express.json());

// API Routes
app.use("/api/users", authRoutes);
app.use("/api/notes", noteRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Notes API is running 🚀",
    });
});

// Database Error Middleware
app.use((err, req, res, next) => {
    if (
        err.name === "MongooseError" ||
        err.name === "MongoNetworkError" ||
        err.message?.includes("buffering timed out")
    ) {
        console.warn("Database unavailable. Switching to memory mode.");
        global.useMemoryDb = true;

        if (req.method === "GET") {
            return res.json([]);
        }

        return res.status(503).json({
            message: "Database unavailable",
        });
    }

    next(err);
});

// Connect Database
connectDb();

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});



// import express from 'express';
// import dotenv from 'dotenv';
// import { connectDb } from './config/db.js';
// import authRoutes from './routes/auth.js'
// import noteRoutes from './routes/notes.js'
// import cors from "cors";
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// // Ensure JWT_SECRET is set or fallback safely
// if (!process.env.JWT_SECRET) {
//     process.env.JWT_SECRET = "default_secret_for_ai_studio_preview";
// }

// // Initialize in-memory database fallback stores
// global.useMemoryDb = false;
// global.memoryUsers = [];
// global.memoryNotes = [];

// const PORT = process.env.PORT || 3000;

// const app = express();
// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "http://localhost:3000",
//         "https://mern-notes-app-smcs.vercel.app",
//         "https://mern-notes-app-kx7p.vercel.app",
//         "https://mern-notes-app-z85c.vercel.app",
//         "https://notes-app-gj5v.vercel.app",
//         "https://note-app-2-pi.vercel.app",
//         "https://note-app-2-o3wx.vercel.app"
//     ],
//     credentials: true
// }));

// app.use(express.json());

// const REMOTE_BACKEND_URL = "https://note-app-2-hbfx.onrender.com";

// // Option B: Server-side CORS Proxy to remote Render backend
// app.use("/api", async (req, res, next) => {
//     // If the user explicitly sets USE_LOCAL_BACKEND=true, bypass the proxy and use local routes
//     if (process.env.USE_LOCAL_BACKEND === 'true') {
//         return next();
//     }

//     const remoteUrl = `${REMOTE_BACKEND_URL}${req.originalUrl}`;
    
//     // Build headers to forward
//     const headers = {};
//     for (const [key, value] of Object.entries(req.headers)) {
//         // Skip host and other sensitive/system headers
//         if (['host', 'connection', 'content-length', 'accept-encoding'].includes(key.toLowerCase())) {
//             continue;
//         }
//         headers[key] = value;
//     }

//     try {
//         const fetchOptions = {
//             method: req.method,
//             headers: headers,
//         };

//         if (req.method !== 'GET' && req.method !== 'HEAD') {
//             fetchOptions.body = JSON.stringify(req.body);
//             // Ensure content-type is set to application/json if sending a body
//             fetchOptions.headers['content-type'] = fetchOptions.headers['content-type'] || 'application/json';
//         }

//         console.log(`[AI Studio CORS Proxy] Forwarding ${req.method} ${req.originalUrl} -> ${remoteUrl}`);
        
//         const response = await fetch(remoteUrl, fetchOptions);
        
//         // Copy response headers
//         response.headers.forEach((value, name) => {
//             if (!['content-encoding', 'transfer-encoding', 'connection'].includes(name.toLowerCase())) {
//                 res.setHeader(name, value);
//             }
//         });

//         res.status(response.status);

//         // Get response body
//         const contentType = response.headers.get('content-type') || '';
//         if (contentType.includes('application/json')) {
//             const data = await response.json();
//             res.json(data);
//         } else {
//             const text = await response.text();
//             res.send(text);
//         }
//     } catch (error) {
//         console.error(`[AI Studio CORS Proxy] Error proxying to remote server:`, error);
//         res.status(502).json({
//             error: "Bad Gateway",
//             message: "Failed to proxy request to remote server",
//             details: error.message
//         });
//     }
// });

// app.use("/api/users", authRoutes);
// app.use("/api/notes", noteRoutes);

// // Serve static assets from frontend build
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// // Serve index.html for SPA router fallback (MUST be after API routes)
// app.get('*all', (req, res, next) => {
//     // If the path starts with /api, let it handle as API (avoid returning index.html for 404 api requests)
//     if (req.path.startsWith('/api')) {
//         return next();
//     }
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// // Database Error / Timeout Middleware for offline/unconfigured database states
// app.use((err, req, res, next) => {
//     if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || err.message?.includes('buffering timed out')) {
//         console.warn('[AI Studio] Database offline or unconfigured — enabling memory database');
//         global.useMemoryDb = true;
        
//         if (req.method === 'GET') {
//             return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
//         }
//         return res.status(503).json({ error: 'Database offline. Please try registering or using in-memory mock fallback.' });
//     }
//     next(err);
// });

// connectDb();

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT} with host 0.0.0.0`);
// });