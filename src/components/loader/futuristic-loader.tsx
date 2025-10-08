import React from 'react';
import BrandedLoader from './branded-loader';

type FuturisticLoaderProps = {
    message?: string;
};

const FuturisticLoader: React.FC<FuturisticLoaderProps> = ({ message }) => {
    return (
        <BrandedLoader 
            message={message || "Initializing Trading Engine..."}
            subMessage="Powered by The Binary Blueprint"
            showProgress={true}
        />
    );
};

export default FuturisticLoader;
