import express from "express";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fetch from "node-fetch";

// Load .env from project root
try {
    const dotenv = await import("dotenv");
    dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), "..", ".env") });
} catch { /* dotenv is optional */ }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const app = express();
const PORT = 3001;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// ─── Instaloader (Primary Source) ────────────────────────────────────────────

function runInstaloader(username) {
    return new Promise((resolve) => {
        const scriptPath = join(ROOT, "scraper.py");
        let stdout = "";
        let stderr = "";

        const proc = spawn("python3", [scriptPath, username], {
            env: { ...process.env }
        });

        const timer = setTimeout(() => {
            proc.kill("SIGTERM");
            resolve({ error: "Instaloader timed out after 30 seconds." });
        }, 30000);

        proc.stdout.on("data", (data) => { stdout += data.toString(); });
        proc.stderr.on("data", (data) => { stderr += data.toString(); });

        proc.on("close", () => {
            clearTimeout(timer);
            try {
                const parsed = JSON.parse(stdout.trim());
                resolve(parsed);
            } catch {
                resolve({ error: stderr || "Failed to parse Instaloader output." });
            }
        });

        proc.on("error", (err) => {
            clearTimeout(timer);
            resolve({ error: `Could not start Python process: ${err.message}` });
        });
    });
}

// ─── Apify (Fallback Source) ──────────────────────────────────────────────────

async function runApify(username) {
    const token = process.env.VITE_APIFY_TOKEN;
    if (!token || token === "your_apify_token_here") {
        return { error: "No Apify token configured." };
    }

    try {
        const runRes = await fetch(
            `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${token}&waitForFinish=60`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernames: [username] }),
                signal: AbortSignal.timeout(70000),
            }
        );
        if (!runRes.ok) {
            const errBody = await runRes.text();
            return { error: `Cloud extractor (Apify) HTTP ${runRes.status}: ${errBody}` };
        }

        const runInfo = await runRes.json();
        const datasetId = runInfo?.data?.defaultDatasetId;
        if (!datasetId) return { error: "No Apify dataset returned." };

        const itemsRes = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`
        );
        if (!itemsRes.ok) return { error: "Failed to fetch Apify dataset." };

        const items = await itemsRes.json();
        if (!items?.length) return { error: "Apify returned no items." };

        const u = items[0];
        const rawPic = u.profilePicUrlHD ?? u.profilePicUrl ?? "";

        return {
            username: u.username ?? username,
            fullName: u.fullName ?? "",
            followers: u.followersCount ?? 0,
            following: u.followsCount ?? 0,
            posts: u.postsCount ?? 0,
            bio: u.biography ?? "",
            profilePic: rawPic ? `https://wsrv.nl/?url=${encodeURIComponent(rawPic)}` : "",
            isBusinessAccount: u.isBusinessAccount ?? false,
            businessCategoryName: u.businessCategoryName ?? "Digital Creator",
            dataSource: "cloud-extractor",
        };
    } catch (err) {
        return { error: `Apify error: ${err.message}` };
    }
}

// ─── API Route ────────────────────────────────────────────────────────────────

app.get("/api/profile", async (req, res) => {
    const username = (req.query.username || "").trim().replace(/^@/, "");
    if (!username) {
        return res.status(400).json({ error: "Username is required." });
    }

    console.log(`[API] Fetching profile: @${username}`);

    // 1. Try Instaloader first
    const instaloaderData = await runInstaloader(username);
    if (!instaloaderData.error) {
        console.log(`[API] ✅ Instaloader succeeded for @${username}`);
        return res.json(instaloaderData);
    }

    console.warn(`[API] ⚠️ Instaloader failed (${instaloaderData.error}), switching to cloud extractor...`);

    // 2. Fallback to Apify
    const apifyData = await runApify(username);
    if (!apifyData.error) {
        console.log(`[API] ✅ Cloud extractor succeeded for @${username}`);
        return res.json(apifyData);
    }

    console.error(`[API] ❌ Both sources failed for @${username}`);
    console.error(`      - Instaloader: ${instaloaderData.error}`);
    console.error(`      - Cloud: ${apifyData.error}`);
    return res.status(502).json({
        error: "Both data sources failed.",
        instaloaderError: instaloaderData.error,
        apifyError: apifyData.error,
    });
});

app.get("/api/health", (req, res) => res.json({ status: "ok", port: PORT }));

app.listen(PORT, () => {
    console.log(`\n🚀 InstaAura API Server running at http://localhost:${PORT}`);
    console.log(`   Primary:  Instaloader (Python)`);
    console.log(`   Fallback: Cloud Extractor\n`);
});
