import React from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
    const isLoading = useSelector((state) => state.loading.isLoading);

    return (
        <>
            {isLoading && (
                <div
                    className="absolute grid place-content-center h-screen w-screen bg-opacity-50 bg-black"
                    style={{ zIndex: 1000 }}
                >
                    <img src="../../src/assets/loading.svg" alt="loading" />
                </div>
            )}
        </>
    );
};

export default Loading;
