/**
 * Firebase Cloud Function - API Proxy
 * Routes requests from https://ismeranket.web.app/api/* to AWS backend
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// Cost control
setGlobalOptions({ maxInstances: 10 });

const AWS_BACKEND = "http://13.60.37.212";

export const api = onRequest(async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "https://ismeranket.web.app");
    res.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.set("Access-Control-Allow-Credentials", "true");

    // Preflight OPTIONS
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    try {
        const targetUrl = `${AWS_BACKEND}${req.url}`;
        logger.info(`Proxying request to: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: req.method !== "GET" && req.method !== "HEAD" ?
                JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        logger.error("Proxy error:", error);
        res.status(500).json({ error: "Internal proxy error" });
    }
});
