export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ redirect }) => {
    const client_id = import.meta.env.OAUTH_CLIENT_ID;

    if (!client_id) {
        console.error("Missing OAUTH_CLIENT_ID environment variable");
        return new Response("Config Error: Missing OAUTH_CLIENT_ID", { status: 500 });
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&state=${Math.random().toString(36).substring(7)}`;

    return redirect(authUrl);
};

