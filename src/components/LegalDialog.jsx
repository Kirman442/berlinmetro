import { useEffect, useRef, useState } from 'react';
import { LEGAL_CONTACT, LEGAL_DOCUMENTS, LEGAL_DATE } from '../lib/legalDocuments';

const docFromHash = () => {
  const id = window.location.hash.replace('#', '');
  return LEGAL_DOCUMENTS[id] ? id : null;
};

// #impressum / #datenschutz öffnen einen nativen <dialog>; beim Schließen wird der Hash entfernt
export default function LegalDialog() {
  const [docId, setDocId] = useState(docFromHash);
  const ref = useRef(null);

  useEffect(() => {
    const onHash = () => setDocId(docFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (docId && !dlg.open) dlg.showModal();
    if (!docId && dlg.open) dlg.close();
  }, [docId]);

  const onClose = () => {
    if (docFromHash()) window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setDocId(null);
  };
  // Klick auf den Hintergrund schließt (Fallback für Browser ohne closedby)
  const onClick = (e) => { if (e.target === ref.current) ref.current.close(); };

  const doc = docId && LEGAL_DOCUMENTS[docId];
  return (
    <dialog ref={ref} className="legal" lang="de" closedby="any" onClose={onClose} onClick={onClick} aria-labelledby="legal-title">
      {doc && (
        <div className="legal-inner">
          <header>
            <h2 id="legal-title">{doc.title}</h2>
            <button type="button" className="legal-close" onClick={() => ref.current.close()} aria-label="Schließen">×</button>
          </header>
          <nav>
            {Object.entries(LEGAL_DOCUMENTS).map(([id, d]) => (
              <a key={id} href={`#${id}`} aria-current={id === docId ? 'page' : undefined}>{d.label}</a>
            ))}
          </nav>
          <div className="legal-body">
            <p>{doc.intro}</p>
            <h3>{doc.contactTitle}</h3>
            <address>
              {LEGAL_CONTACT.name}<br />
              <a href={`mailto:${LEGAL_CONTACT.email}`}>{LEGAL_CONTACT.email}</a>
            </address>
            {doc.sections.map((s) => (
              <section key={s.title}>
                <h3>{s.title}</h3>
                {s.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                {s.links && (
                  <ul className="legal-source-links">
                    {s.links.map((l) => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <footer>Stand: {LEGAL_DATE}</footer>
        </div>
      )}
    </dialog>
  );
}
