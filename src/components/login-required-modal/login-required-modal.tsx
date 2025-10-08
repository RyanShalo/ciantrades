import React from 'react';
import { observer } from 'mobx-react-lite';
import { getAppId } from '@/components/shared';
import Button from '@/components/shared_ui/button';
import Modal from '@/components/shared_ui/modal';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { LabelPairedLockLgRegularIcon } from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import './login-required-modal.scss';

const LoginRequiredModal = observer(() => {
    const { client } = useStore();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Check if user should see the login modal
    React.useEffect(() => {
        // Only show modal if:
        // 1. User is not logged in
        // 2. Not on callback page (OAuth redirect)
        // 3. Client store is initialized
        const isCallbackPage = window.location.pathname === '/callback';
        const shouldShowModal = !client?.is_logged_in && !isCallbackPage && client !== undefined;
        
        setIsModalOpen(shouldShowModal);
    }, [client?.is_logged_in]);

    const handleLogin = () => {
        const app_id = getAppId();
        const oauth_url = 'https://oauth.deriv.com/oauth2/authorize';
        const redirect_uri = encodeURIComponent(`${window.location.origin}/callback`);
        const url = `${oauth_url}?app_id=${app_id}&l=EN&brand=deriv&redirect_uri=${redirect_uri}`;
        window.location.href = url;
    };

    // Don't render if user is logged in or client is not initialized
    if (client?.is_logged_in || client === undefined) {
        return null;
    }

    return (
        <Modal
            is_open={isModalOpen}
            className='login-required-modal'
            width='100vw'
            height='100vh'
            should_close_on_click_outside={false}
            has_close_icon={false}
            is_vertical_centered
        >
            <Modal.Body>
                <div className='login-required-modal__content'>
                    <div className='login-required-modal__container'>
                        <div className='login-required-modal__icon'>
                            <LabelPairedLockLgRegularIcon 
                                width={80}
                                height={80}
                                fill='white'
                            />
                        </div>
                        <Text
                            as='h1'
                            align='center'
                            weight='bold'
                            className='login-required-modal__title'
                        >
                            {localize('Welcome to Binary FX')}
                        </Text>
                        <Text
                            as='p'
                            align='center'
                            className='login-required-modal__description'
                        >
                            {localize('Access powerful trading tools and strategies. Login to unlock your trading potential and start building winning bots.')}
                        </Text>
                        <div className='login-required-modal__actions'>
                            <Button
                                onClick={handleLogin}
                                primary
                                large
                                className='login-required-modal__login-btn'
                            >
                                {localize('Login to Continue')}
                            </Button>
                        </div>
                        
                        <div className='login-required-modal__social'>
                            <Text
                                as='p'
                                align='center'
                                className='login-required-modal__social-title'
                            >
                                {localize('Connect with us')}
                            </Text>
                            <div className='login-required-modal__social-links'>
                                <a 
                                    href='https://t.me/binaryfx_site' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='Telegram'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 0C5.37 0 0 5.37 0 12C0 18.63 5.37 24 12 24C18.63 24 24 18.63 24 12C24 5.37 18.63 0 12 0ZM17.94 8.19L15.98 17.03C15.82 17.67 15.42 17.83 14.88 17.52L11.88 15.33L10.44 16.71C10.27 16.88 10.12 17.03 9.79 17.03L10.02 13.97L15.61 8.9C15.87 8.67 15.56 8.54 15.22 8.77L8.21 13.31L5.24 12.38C4.62 12.19 4.61 11.74 5.38 11.43L17.08 7.08C17.6 6.9 18.06 7.23 17.94 8.19Z"
                                            fill="#229ED9"
                                        />
                                    </svg>
                                </a>
                                <a 
                                    href='mailto:peterwallacekaranja@gmail.com' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='Email'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                </a>
                                <a 
                                    href='https://app.binaryfx.site' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='Website'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 14.45L16.95 8.5L15.53 7.08L11 11.61L8.71 9.32L7.29 10.74L11 14.45Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                                            fill="#34A853"
                                            fillOpacity="0.2"
                                        />
                                    </svg>
                                </a>
                                <a 
                                    href='https://tiktok.com/@binary_fx_academy' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='TikTok'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M16.6 5.82C15.9165 5.03962 15.5397 4.03743 15.54 3H12.45V15.4C12.4261 16.071 12.1428 16.7066 11.6597 17.1729C11.1766 17.6393 10.5316 17.8999 9.86 17.91C8.44 17.91 7.26 16.77 7.26 15.36C7.26 13.73 8.76 12.44 10.39 12.76V9.64C7.05 9.34 4.2 11.88 4.2 15.36C4.2 18.71 7 21.02 9.85 21.02C12.89 21.02 15.54 18.37 15.54 15.33V9.01C16.793 9.90985 18.2974 10.3926 19.84 10.39V7.3C19.84 7.3 17.96 7.39 16.6 5.82Z"
                                            fill="white"
                                        />
                                    </svg>
                                </a>
                                <a 
                                    href='https://wa.me/2547400094538' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='WhatsApp'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.49 15.55 3.36 17.02L2.05 21.95L7.08 20.66C8.51 21.48 10.19 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.53 15.5C16.37 15.93 15.71 16.33 15.19 16.43C14.5 16.57 13.96 16.48 12.06 15.75C9.54 14.78 7.9 12.23 7.77 12.07C7.64 11.91 6.76 10.73 6.76 9.5C6.76 8.27 7.4 7.66 7.65 7.39C7.9 7.12 8.18 7.05 8.36 7.05C8.54 7.05 8.72 7.05 8.88 7.06C9.04 7.07 9.27 7 9.49 7.47C9.71 7.94 10.18 9.17 10.25 9.31C10.32 9.45 10.36 9.62 10.27 9.82C9.75 10.93 9.17 10.86 9.54 11.47C10.41 12.87 11.38 13.47 12.62 14.09C12.89 14.23 13.06 14.21 13.21 14.04C13.36 13.87 13.81 13.35 13.98 13.11C14.15 12.87 14.32 12.91 14.54 12.99C14.76 13.07 15.98 13.67 16.23 13.8C16.48 13.93 16.64 13.99 16.71 14.09C16.78 14.19 16.78 14.57 16.53 15.5Z"
                                            fill="#25D366"
                                        />
                                    </svg>
                                </a>
                                <a 
                                    href='https://youtube.com/@binary_fx?si=t-M-Ihq8gVZEaRBG' 
                                    target='_blank' 
                                    rel='noopener noreferrer'
                                    className='login-required-modal__social-link'
                                    aria-label='YouTube'
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect width="24" height="24" rx="5" fill="#EF0000" />
                                        <polygon points="10,8 16,12 10,16" fill="white" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default LoginRequiredModal;
