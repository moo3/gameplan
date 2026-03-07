import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CheckIcon, ClipboardIcon } from './icons';

/**
 * Share popup that displays the current page URL with a copy button.
 * Shows a clipboard icon that switches to a checkmark on successful copy.
 * Closes when clicking anywhere outside the popup.
 */
const SharePopup = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);
    const popupRef = useRef(null);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [url]);

    // Close on click outside
    useEffect(() => {
        if (!url) return;
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [url, onClose]);

    if (!url) return null;

    return (
        <div className="share-popup" ref={popupRef}>
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
