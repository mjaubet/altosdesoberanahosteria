export const prerender = false; // API route

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10),
});

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // Validate server-side
        const parsed = contactSchema.safeParse(data);
        if (!parsed.success) {
            return new Response(JSON.stringify({ error: 'Datos inválidos' }), { status: 400 });
        }
        const { name, email, phone, message } = parsed.data;

        // SMTP Config
        const transporter = nodemailer.createTransport({
            host: import.meta.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(import.meta.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: import.meta.env.SMTP_USER,
                pass: import.meta.env.SMTP_PASS,
            },
        });

        // Send Mail
        await transporter.sendMail({
            from: `"Web Hosteria" <${import.meta.env.SMTP_USER}>`,
            to: import.meta.env.SMTP_TO || import.meta.env.SMTP_USER, // Send to owner
            subject: `Nueva Consulta de: ${name}`,
            text: `Nombre: ${name}\nEmail: ${email}\nTel: ${phone || 'N/A'}\n\nMensaje:\n${message}`,
            html: `
        <h3>Nueva Consulta Web</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
        <hr/>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error('Send mail error:', error);
        return new Response(JSON.stringify({ error: 'Error interno al enviar correo' }), { status: 500 });
    }
};
