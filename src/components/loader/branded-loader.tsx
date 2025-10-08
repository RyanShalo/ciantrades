import React, { useState, useEffect } from 'react';
import './branded-loader.scss';

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
    const MINIMUM_LOADING_TIME = 4000; // 4 seconds for better UX

    const loadingSteps = [
        "Connecting to Deriv API...",
        "Loading market data...",
        "Initializing strategy engine...",
        "Preparing workspace...",
        "Ready to trade!"
    ];

    useEffect(() => {
        const startTime = Date.now();
        let stepIndex = 0;
        let hasReached100 = false;

        const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            let progressValue = (elapsedTime / MINIMUM_LOADING_TIME) * 100;
            
            // Ensure we reach exactly 100% at the end
            if (progressValue >= 100) {
                progressValue = 100;
                hasReached100 = true;
            }
            
            setProgress(Math.floor(progressValue));

            // Update loading text based on progress
            const newStepIndex = Math.floor((progressValue / 100) * (loadingSteps.length - 1));
            if (newStepIndex !== stepIndex && newStepIndex < loadingSteps.length) {
                stepIndex = newStepIndex;
                setLoadingText(loadingSteps[stepIndex]);
            }

            // When we reach 100%, show final message and clear timer
            if (hasReached100) {
                setLoadingText("Welcome to BinaryFX!");
                setTimeout(() => {
                    clearInterval(timer);
                }, 500); // Give a moment to see 100%
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className='branded-loader'>
            <div className='background-pattern'>
                <div className='grid-pattern'></div>
                <div className='floating-particles'>
                    {[...Array(15)].map((_, i) => (
                        <div 
                            key={i} 
                            className='particle'
                            style={{
                                '--delay': `${i * 0.2}s`,
                                '--duration': `${3 + (i % 3)}s`
                            } as React.CSSProperties}
                        ></div>
                    ))}
                </div>
            </div>

            <div className='loader-container'>
                <div className='brand-section'>
                    <div className='logo-container'>
                        <img 
                            src="/the binary blueprint1.png" 
                            alt="Binary Blueprint Logo" 
                            className='brand-logo'
                        />
                        <div className='logo-glow'></div>
                    </div>
                    
                    <div className='brand-text'>
                        <h1 className='brand-title'>
                            Binary<span className='highlight'>FX</span>
                        </h1>
                        <p className='brand-subtitle'>
                            by <span className='brand-name'>The Binary Blueprint</span>
                        </p>
                    </div>
                </div>

                {showProgress && (
                    <div className='progress-section'>
                        <div className='progress-container'>
                            <div className='progress-track'>
                                <div 
                                    className='progress-fill'
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className='progress-shine'></div>
                                </div>
                            </div>
                            <div className='progress-text'>{progress}%</div>
                        </div>
                        
                        <div className='loading-status'>
                            <div className='status-text'>{loadingText}</div>
                            <div className='loading-dots'>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        
                        {subMessage && (
                            <div className='sub-message'>{subMessage}</div>
                        )}
                    </div>
                )}

                <div className='feature-highlights'>
                    <div className='feature'>
                        <div className='feature-icon'>⚡</div>
                        <span>Lightning Fast</span>
                    </div>
                    <div className='feature'>
                        <div className='feature-icon'>🎯</div>
                        <span>Precise Trading</span>
                    </div>
                    <div className='feature'>
                        <div className='feature-icon'>🚀</div>
                        <span>Advanced Strategies</span>
                    </div>
                    <div className='feature'>
                        <div className='feature-icon'>📈</div>
                        <span>Real-time Analytics</span>
                    </div>
                </div>
            </div>

            <div className='version-info'>
                <span>v3.0.0 - Professional Trading Site</span>
            </div>
        </div>
    );
};

export default BrandedLoader;
