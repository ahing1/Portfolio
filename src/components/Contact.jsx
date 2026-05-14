import { Github, Linkedin, Mail } from "lucide-react";
import { useRef, useState } from "react";
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
    <section id="contact" className="mx-auto max-w-5xl px-4 py-24 scroll-mt-20">
      <h2 className="mb-8 font-mono text-sm text-ink-dim">
        <span className="text-accent">$</span> ./contact.sh
      </h2>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto]">
        <div>
          {status.ok ? (
            <p className="font-mono text-sm text-ok">
              ✓ sent — I'll get back to you soon.
            </p>
          ) : (
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="space-y-5 font-mono text-sm"
            >
              <Field label="> name:" id="user_name" name="user_name" type="text" autoComplete="name" required />
              <Field label="> email:" id="user_email" name="user_email" type="email" autoComplete="email" required />
              <Field
                label="> message:"
                id="message"
                name="message"
                as="textarea"
                rows={6}
                required
              />
              <input type="text" name="subject" className="hidden" tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                className="border border-accent px-4 py-2 text-ink transition-colors duration-150 hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-50"
                disabled={status.sending}
              >
                {status.sending ? "$ sending…" : "$ send →"}
              </button>
              {status.err && (
                <p className="text-warn">! {String(status.err)}</p>
              )}
            </form>
          )}
        </div>

        <aside className="font-mono text-sm">
          <h3 className="mb-4 text-xs text-ink-dim">// elsewhere</h3>
          <ul className="space-y-3">
            <li>
              <a href="https://github.com/ahing1" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Github className="h-4 w-4" /> github →
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/andrew-hing21/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Linkedin className="h-4 w-4" /> linkedin →
              </a>
            </li>
            <li>
              <a href="mailto:ahing910@gmail.com" className="inline-flex items-center gap-2 hover:text-accent">
                <Mail className="h-4 w-4" /> email →
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
};

const Field = ({ label, id, name, type = "text", as = "input", rows, autoComplete, required }) => {
  const cls =
    "block w-full border-0 border-b border-rule bg-transparent py-1.5 font-mono text-sm text-ink outline-none focus:border-b-2 focus:border-accent placeholder:text-ink-dim/60";
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-ink-dim">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea id={id} name={name} rows={rows} required={required} className={cls} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
        />
      )}
    </div>
  );
};

export default ContactSection;
