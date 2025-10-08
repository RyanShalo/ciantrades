import React from 'react';
import BrandedLoader from './branded-loader';

export default function ChunkLoader({ message }: { message: string }) {
    return (
        <BrandedLoader 
            message={message || "Loading Components..."}
            subMessage="Optimizing performance for the best trading experience"
            showProgress={true}
        />
    );
}
