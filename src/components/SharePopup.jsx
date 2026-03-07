import React, { useCallback, useState } from 'react';

/**
 * Share popup that displays the current page URL with a copy button.
 * Shows a clipboard icon that switches to a checkmark on successful copy.
 */
const SharePopup = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [url]);

    if (!url) return null;

    return (
        <div className="share-popup">
            <button className="share-popup-close" onClick={onClose}>
                ✕
            </button>
            <a className="share-popup-url" href={url} target="_blank" rel="noopener noreferrer">
                {url}
            </a>
            <button
                className="share-popup-copy"
                onClick={handleCopy}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
                {copied ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default SharePopup;
