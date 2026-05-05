const ALLOWED_ORIGINS = [
  "https://nepar.hr",
  "https://www.nepar.hr",
  "http://localhost:5173",
  "http://localhost:4173",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders(origin),
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    const { name, email, subject, message, image, imageName } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    const attachments = image
      ? [{ filename: imageName || "prilog.jpg", content: image }]
      : [];

    const subjectLine = subject || "Upit s web stranice";
    const textBody = `Ime: ${name}\nE-mail: ${email}\nTema: ${subjectLine}\n\nPoruka:\n${message}`;
    const htmlBody = `
      <p><strong>Ime:</strong> ${name}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Tema:</strong> ${subjectLine}</p>
      <hr/>
      <p style="white-space:pre-wrap">${message}</p>
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nepar Web Forma <forma@nepar.hr>",
        to: ["nepar@nepar.hr"],
        reply_to: email,
        subject: subjectLine,
        text: textBody,
        html: htmlBody,
        attachments,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 502,
        headers: corsHeaders(origin),
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders(origin),
    });
  },
};
