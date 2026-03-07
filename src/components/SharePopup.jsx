import React, { useCallback, useState } from 'react';

import { CheckIcon, ClipboardIcon } from './icons';

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
                {copied ? <CheckIcon /> : <ClipboardIcon />}
            </button>
        </div>
    );
};

export default SharePopup;
