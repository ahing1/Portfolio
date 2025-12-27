import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export const ContactSection = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ sending: false, ok: false, err: null });

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    try {
      setStatus({ sending: true, ok: false, err: null });

      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_PUBLIC_KEY }
      );

      setStatus({ sending: false, ok: true, err: null });
      formRef.current.reset();
    } catch (err) {
      setStatus({ sending: false, ok: false, err: err?.text || "Failed to send" });
      console.error(err);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl px-4 py-20 scroll-mt-24">
      <h2 className="mb-6 text-2xl font-bold">Contact</h2>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {status.ok ? (
          <p className="text-green-600 dark:text-green-400 font-medium">
            Thanks for your message! I'll get back to you soon.
          </p>
        ) : (
          <>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              Have an opportunity or want to chat? Send me a message!
            </p>

            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label htmlFor="user_name" className="sr-only">Name</label>
                <input
                  id="user_name"
                  type="text"
                  name="user_name"
                  required
                  autoComplete="name"
                  placeholder="Name"
                  className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700"
                />
              </div>

              <div>
                <label htmlFor="user_email" className="sr-only">Email</label>
                <input
                  id="user_email"
                  type="email"
                  name="user_email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Message"
                  className="h-32 w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700"
                />
              </div>

              {/* Honeypot anti-spam (EmailJS ignores it if filled) */}
              <input type="text" name="subject" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold
                      text-white hover:bg-indigo-500
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                      focus:ring-offset-2 focus:ring-offset-black dark:focus:ring-offset-zinc-900"
                >
                  {status.sending ? "Sending…" : "Send"}
                </button>
              </div>
            </form>

            {status.err && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">
                {String(status.err)}
              </p>
            )}

            <p className="mt-3 text-xs text-zinc-500">
              * Powered by EmailJS. Your message is sent via their service.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default ContactSection;