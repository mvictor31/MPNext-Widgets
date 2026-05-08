export async function getClientCredentialsToken() {
  const mpBaseUrl = process.env.MINISTRY_PLATFORM_BASE_URL!;
  const mpOauthUrl = `${mpBaseUrl}/oauth`;

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.MINISTRY_PLATFORM_CLIENT_ID!,
    client_secret: process.env.MINISTRY_PLATFORM_CLIENT_SECRET!,
    scope: "http://www.thinkministry.com/dataplatform/scopes/all",
  });

  const response = await fetch(`${mpOauthUrl}/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    // OAuth 2.0 errors are returned in the response body (e.g. {"error":"invalid_client"})
    // — surface them so misconfigured clients/scopes/secrets are diagnosable.
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to get client credentials token: ${response.status} ${response.statusText}${body ? ` — ${body}` : ""}`,
    );
  }

  return await response.json();
}
