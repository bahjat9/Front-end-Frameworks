import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ApiConfigModalProps {
  apiKey: string;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export default function ApiConfigModal({ apiKey, onClose, onSave }: ApiConfigModalProps) {
  const [draftApiKey, setDraftApiKey] = useState("");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay active api-config-overlay" onMouseDown={onClose}>
      <section
        className="modal-dialog api-config-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-config-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close-btn" type="button" aria-label="Close API configuration" onClick={onClose}>
          <X size={19} aria-hidden="true" />
        </button>
        <div className="api-config-content">
          <p className="eyebrow">Connection</p>
          <h2 id="api-config-title">TMDB API access</h2>
          <p className="api-config-description">
            Enter a TMDB API Read Access Token. It is saved in this browser and used for movie and genre requests.
          </p>
          <p className="api-config-status" role="status">
            {apiKey ? "An API key is configured." : "No API key is configured."}
          </p>
          <form
            className="api-config-form"
            onSubmit={(event) => {
              event.preventDefault();
              onSave(draftApiKey);
            }}
          >
            <label htmlFor="tmdb-api-key">Read Access Token</label>
            <input
              id="tmdb-api-key"
              type="password"
              autoComplete="off"
              value={draftApiKey}
              onChange={(event) => setDraftApiKey(event.target.value)}
              placeholder="Paste token to replace the current key"
            />
            <div className="api-config-actions">
              <button className="btn-secondary" type="button" onClick={() => onSave("")}>Use environment key</button>
              <button className="btn-primary" type="submit" disabled={!draftApiKey.trim()}>Save key</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}