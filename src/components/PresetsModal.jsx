import React from 'react';
import { CloseIcon } from './icons';
import { BUILT_IN_PRESETS } from '../constants/presets';

const PresetsModal = ({ isOpen, onClose, onApplyPreset }) => {
    if (!isOpen) return null;

    // Group presets by category
    const groupedPresets = BUILT_IN_PRESETS.reduce((acc, preset) => {
        if (!acc[preset.category]) acc[preset.category] = [];
        acc[preset.category].push(preset);
        return acc;
    }, {});

    return (
        <div className="help-modal-overlay" onClick={onClose}>
            <div className="help-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="help-modal-header">
                    <h2>Field Presets</h2>
                    <button className="help-modal-close" onClick={onClose} title="Close">
                        <CloseIcon height={28} width={28} />
                    </button>
                </div>

                <div className="help-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
                    <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
                        Select a preset below to instantly apply a standard fielding arrangement to your board.
                    </p>

                    {Object.entries(groupedPresets).map(([category, presets]) => (
                        <div key={category} className="help-section" style={{ marginBottom: '25px' }}>
                            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>{category}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                                {presets.map((preset) => (
                                    <button 
                                        key={preset.id}
                                        style={{
                                            textAlign: 'left',
                                            padding: '12px 16px',
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                        onClick={() => {
                                            if (window.confirm(`Apply "${preset.name}"? This will overwrite your current field.`)) {
                                                onApplyPreset(preset.players);
                                                onClose();
                                            }
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '15px' }}>{preset.name}</div>
                                        {preset.description && (
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{preset.description}</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PresetsModal;
