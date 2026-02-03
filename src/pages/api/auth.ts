export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect, url }) => {
    // In production (Node.js), we use process.env to ensure variables are read at runtime.
    const client_id = process.env.OAUTH_CLIENT_ID || import.meta.env.OAUTH_CLIENT_ID;

    // Check if it's still the placeholder from the guide
    if (!client_id || client_id === 'tu_client_id_de_github' || client_id === 'Iv23liSrkKPczIIppzm2' && url.hostname === 'localhost') {
        console.error("[Auth] Missing or invalid OAUTH_CLIENT_ID:", client_id);
    }

    const scope = 'repo%20user'; // Use %20 instead of comma
    const state = Math.random().toString(36).substring(7);
    const redirect_uri = `${url.origin}/api/callback`;

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&state=${state}&redirect_uri=${redirect_uri}`;

    console.log("[Auth] Redirecting to GitHub with Client ID:", client_id);
    return redirect(authUrl);
};


