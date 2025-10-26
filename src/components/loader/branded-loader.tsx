import React, { useState, useEffect } from 'react';

type BrandedLoaderProps = {
    message?: string;
    subMessage?: string;
    showProgress?: boolean;
};

const BrandedLoader: React.FC<BrandedLoaderProps> = ({ 
    message = "Initializing Trading Engine...", 
    subMessage = "Preparing your trading environment",
    showProgress = true 
}) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(message);
    const MINIMUM_LOADING_TIME = 4000;

    const loadingSteps = [
        "Establishing secure connection...",
        "Syncing market data streams...",
        "Configuring trading parameters...",
        "Optimizing performance...",
        "System ready!"
    ];

    useEffect(() => {
        const startTime = Date.now();
        let stepIndex = 0;
        let hasReached100 = false;

        const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            let progressValue = (elapsedTime / MINIMUM_LOADING_TIME) * 100;
            
            if (progressValue >= 100) {
                progressValue = 100;
                hasReached100 = true;
            }
            
            setProgress(Math.floor(progressValue));

            const newStepIndex = Math.floor((progressValue / 100) * (loadingSteps.length - 1));
            if (newStepIndex !== stepIndex && newStepIndex < loadingSteps.length) {
                stepIndex = newStepIndex;
                setLoadingText(loadingSteps[stepIndex]);
            }

            if (hasReached100) {
                setLoadingText("Welcome to TRADE AGENTUM!");
                setTimeout(() => {
                    clearInterval(timer);
                }, 500);
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: "'Roboto', 'Arial', sans-serif",
            zIndex: 9999
        }}>
            {/* Animated background circles */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                opacity: 0.15
            }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: `${200 + i * 100}px`,
                        height: `${200 + i * 100}px`,
                        border: '2px solid #00d9ff',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: `ripple ${3 + i * 0.5}s ease-out infinite`,
                        animationDelay: `${i * 0.4}s`
                    }} />
                ))}
            </div>

            {/* Main content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                maxWidth: '600px',
                padding: '2rem',
                animation: 'fadeSlideUp 0.8s ease-out'
            }}>
                {/* Logo section */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        position: 'relative',
                        display: 'inline-block',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            fontSize: '6rem',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #00d9ff 0%, #0095ff 50%, #00d9ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '0.05em',
                            lineHeight: 1,
                            animation: 'glow 2s ease-in-out infinite alternate',
                            textShadow: '0 0 40px rgba(0, 217, 255, 0.5)'
                        }}>
                           TRADE
                        </div>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            color: '#ffffff',
                            letterSpacing: '0.3em',
                            marginTop: '0.5rem',
                            textTransform: 'uppercase'
                        }}>
                            AGENTUM
                        </div>
                    </div>
                    
                    <div style={{
                        height: '2px',
                        width: '80px',
                        background: 'linear-gradient(90deg, transparent, #00d9ff, transparent)',
                        margin: '1.5rem auto',
                        animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#8b95b8',
                        fontWeight: '300',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        Professional Trading Platform
                    </p>
                </div>

                {/* Progress section */}
                {showProgress && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            position: 'relative',
                            marginBottom: '2rem'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '3px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '50px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #0095ff 0%, #00d9ff 50%, #00f0ff 100%)',
                                    borderRadius: '50px',
                                    transition: 'width 0.3s ease',
                                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                                        animation: 'shimmer 1.5s ease-in-out infinite'
                                    }} />
                                </div>
                            </div>
                            
                            <div style={{
                                marginTop: '1.5rem',
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#00d9ff',
                                textShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
                            }}>
                                {progress}%
                            </div>
                        </div>
                        
                        <div style={{
                            fontSize: '1rem',
                            color: '#b0b8d4',
                            fontWeight: '400',
                            marginBottom: '0.5rem',
                            minHeight: '1.5rem',
                            transition: 'all 0.3s ease'
                        }}>
                            {loadingText}
                        </div>
                        
                        {subMessage && (
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#6b7399',
                                fontStyle: 'italic',
                                marginTop: '0.5rem'
                            }}>
                                {subMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Spinning loader */}
                <div style={{
                    margin: '2rem auto',
                    width: '60px',
                    height: '60px',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        border: '3px solid transparent',
                        borderTop: '3px solid #00d9ff',
                        borderRight: '3px solid #00d9ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '80%',
                        height: '80%',
                        top: '10%',
                        left: '10%',
                        border: '3px solid transparent',
                        borderBottom: '3px solid #0095ff',
                        borderLeft: '3px solid #0095ff',
                        borderRadius: '50%',
                        animation: 'spin 1.5s linear infinite reverse'
                    }} />
                </div>
            </div>

            {/* Version info */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.85rem',
                color: '#4a5578',
                opacity: 0.8,
                letterSpacing: '0.05em'
            }}>
                v1.0.0 - Enterprise Edition
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes glow {
                    0%, 100% {
                        filter: drop-shadow(0 0 20px rgba(0, 217, 255, 0.6));
                    }
                    50% {
                        filter: drop-shadow(0 0 40px rgba(0, 217, 255, 0.9));
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.5);
                        opacity: 0;
                    }
                }

                @media (max-width: 768px) {
                    div[style*="fontSize: '6rem'"] {
                        font-size: 4rem !important;
                    }
                    div[style*="fontSize: '2.5rem'"] {
                        font-size: 1.8rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default BrandedLoader;