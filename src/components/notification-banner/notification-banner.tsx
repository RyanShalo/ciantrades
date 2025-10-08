import React, { useState, useEffect } from 'react';
import './notification-banner.scss';

interface NotificationBannerProps {
    message?: string;
    isVisible?: boolean;
    canClose?: boolean;
    autoHide?: boolean;
    autoHideDelay?: number;
    telegramUrl?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
    message = "📚 Join our DAILY Trading Masterclass! 🚀 Live sessions every day at 9:00 PM - Learn advanced trading strategies and watch real-time trades. Don't miss out on transforming your trading journey! Click to join our exclusive Telegram community.",
    isVisible = true,
    canClose = true,
    autoHide = false,
    autoHideDelay = 5000,
    telegramUrl = "https://t.me/binaryfx_site"
}) => {
    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (autoHide && visible) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [autoHide, autoHideDelay, visible]);

    const handleClose = () => {
        setVisible(false);
        // Only hide for current session - no localStorage persistence
    };

    const handleBannerClick = (e: React.MouseEvent) => {
        // Prevent click when close button is clicked
        if ((e.target as HTMLElement).closest('.notification-banner__close')) {
            return;
        }
        
        // Open Telegram channel in new tab
        window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    };

    if (!visible) return null;

    return (
        <div 
            className="notification-banner"
            onClick={handleBannerClick}
            style={{ cursor: 'pointer' }}
            title="Click to visit our Telegram channel"
        >
            <div className="notification-banner__content">
                <div className="notification-banner__marquee">
                    <div className="notification-banner__text">
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-b</div>anner__text-item">{message}</span>
                    </div>
                    {/* Clone for seamless scrolling */}
                    <div className="notification-banner__text">
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-banner__text-item">{message}</span>
                        <span className="notification-banner__text-item">{message}</span>
                    </div>
                </div>
                {canClose && (
                    <button 
                        className="notification-banner__close" 
                        onClick={handleClose}
                        aria-label="Close notification"
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M18 6L6 18M6 6L18 18" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationBanner;
