export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        return new Response("No code provided", { status: 400 });
    }

    const client_id = import.meta.env.OAUTH_CLIENT_ID;
    const client_secret = import.meta.env.OAUTH_CLIENT_SECRET;

    if (!client_id || !client_secret) {
        return new Response("Missing OAUTH credentials", { status: 500 });
    }

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id,
                client_secret,
                code,
            }),
        });

        const data = await response.json();
        const token = data.access_token;

        if (!token) {
            return new Response("Provider Error: " + JSON.stringify(data), { status: 500 });
        }

        const content = {
            token,
            provider: 'github',
        };

        // Return HTML that communicates with the opening window (Decap CMS)
        const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("Receive message:", e);
              // Send the token to the main window
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify(content)}',
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          
          // Notify opener that we are ready
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
    `;

        return new Response(script, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (err) {
        console.error(err);
        return new Response("Internal Error", { status: 500 });
    }
};
