import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Actions
import { notifyAction } from '../../../features/notifier/notifySlice';

// Icons
import { GoPlus } from 'react-icons/go';

export default function GroupList({ groups, setCurrentTimeLine }) {
    const dispatch = useDispatch();

    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [timer, setTimer] = useState(null);

    const handleSearch = (event) => {
        if (event.target.value.length > 0) {
            setIsSearching(true);
            clearTimeout(timer);
            setSearchStatus('Searching...');

            const newTimer = setTimeout(async () => {
                if (event.target.value.length === 0) return;
                try {
                    const token = localStorage.getItem('timelineApp');
                    const { data } = await axios({
                        method: 'GET',
                        url: `${
                            import.meta.env.VITE_SERVER_URL
                        }/api/timeline/gettimelinelist/${event.target.value}`,
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}`,
                        },
                    });
                    setSearchResults(data.timeline);
                    setSearchStatus(null);
                } catch (error) {
                    dispatch(
                        notifyAction(
                            true,
                            'error',
                            'It seems like there is a problem with the server. Please try again later.'
                        )
                    );
                }
            }, 1100);
            setTimer(newTimer);
        } else {
            setSearchStatus(null);
        }
        if (event.target.value.length === 0) {
            setIsSearching(false);
            setSearchStatus(null);
        }
    };

    return (
        <div className="bg-base-100 h-full rounded-box flex flex-col p-2 relative">
            {/* Create a new Timeline Button */}
            <div className="absolute bottom-0 right-0 p-4">
                <div
                    className="tooltip tooltip-left tooltip-secondary"
                    data-tip="Create a new Timeline"
                >
                    <button className="btn btn-square bg-primary border-0">
                        <GoPlus className="text-white" />
                    </button>
                </div>
            </div>
            {/* Search Bar */}
            {/* Divider */}
            <div className="divider m-0 before:bg-primary after:bg-primary"></div>
            <div className="w-full p-2">
                <input
                    type="text"
                    placeholder="🔍Search for a Timeline"
                    className="input input-bordered input-secondary w-full"
                    onChange={handleSearch}
                />
            </div>
            {searchStatus && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-lg font-semibold">{searchStatus}</h1>
                </div>
            )}
            {searchResults.length > 0 &&
                isSearching &&
                searchStatus === null && (
                    <div className="flex flex-col w-full h-full">
                        <h1 className="text-lg font-semibold">
                            Search Results
                        </h1>
                        {searchResults.map((result, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-row items-center justify-between p-2 cursor-pointer hover:bg-base-200 rounded-box"
                                    onClick={() =>
                                        setCurrentTimeLine(result.name)
                                    }
                                >
                                    <div className="flex flex-row items-center">
                                        <img
                                            src="https://picsum.photos/200"
                                            // src = {group.photoURL}
                                            alt="Group"
                                            className="rounded-full w-10 h-10"
                                        />
                                        <div className="ml-2">
                                            <h1 className="text-lg font-semibold">
                                                {result.name}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            {!isSearching && (
                <>
                    {groups.map((group, index) => {
                        return (
                            <div
                                key={index}
                                className="flex flex-row items-center justify-between p-2 cursor-pointer hover:bg-base-200 rounded-box"
                                onClick={() => setCurrentTimeLine(group.name)}
                            >
                                <div className="flex flex-row items-center">
                                    <img
                                        src="https://picsum.photos/200"
                                        // src = {group.photoURL}
                                        alt="Group"
                                        className="rounded-full w-10 h-10"
                                    />
                                    <div className="ml-2">
                                        <h1 className="text-lg font-semibold">
                                            {group.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
