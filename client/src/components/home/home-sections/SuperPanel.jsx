import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Icons
import { BsStarFill } from 'react-icons/bs';

// Actions
import { notifyAction } from '../../../features/notifier/notifySlice';

export default function SuperPanel({
    userImpEvents,
    currentTimeLine,
    groups,
    setGroups,
    timelineEvents,
}) {
    const [admin, setAdmin] = React.useState(0);
    const [followedTimeline, setFollowedTimline] = useState([]);
    const [infoTags, setInfoTags] = useState([]);
    const dispatch = useDispatch();
    // console.log(followedTimeline);
    // console.log(currentTimeLine);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        setSearchResults([]);
        if (currentTimeLine) {
            const token = window.localStorage.getItem('timelineApp');
            let id = null;
            if (token) {
                const decodedToken = jwtDecode(token);
                id = decodedToken._id;
            }
            // console.log('id', id);
            if (currentTimeLine?.admin?.includes(id)) {
                setAdmin(1);
                setFollowedTimline(currentTimeLine.followedTimeline);
            } else {
                setAdmin(0);
            }
        } else {
            setAdmin(0);
        }
    }, [currentTimeLine]);

    useEffect(() => {
        const mySet = new Set();
        console.log(timelineEvents, 'timeLineEvents');
        for (let i = 0; i < timelineEvents?.length; i++) {
            mySet.add(timelineEvents[i].eventTag);
        }
        console.log(mySet, 'mySet');
        setInfoTags([...mySet]);
    }, [timelineEvents]);

    const followtimeline = async (timelineId) => {
        try {
            // console.log(timelineId);
            const data = {
                fromId: currentTimeLine._id,
                toId: timelineId._id,
            };
            const token = localStorage.getItem('timelineApp');
            // console.log(token);
            const data1 = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/timeline/followtimelinefromtimeline`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                data,
            });
            // console.log(data1.data.fromTimeline.name);
            setFollowedTimline([
                ...followedTimeline,
                {
                    timelineId: data1.data.totimelineName1._id,
                    name: data1.data.totimelineName1.name,
                },
            ]);
            //filter results
            const filteredResults = searchResults.filter(
                (result) => result._id !== timelineId._id
            );
            setSearchResults(filteredResults);
            dispatch(
                notifyAction({
                    open: true,
                    severity: 'success',
                    message: 'Timeline followed successfully',
                })
            );
        } catch (error) {
            dispatch(
                notifyAction({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong. Please try again later.',
                })
            );
        }
    };

    const unfollowtimeline = async (timelineId) => {
        // console.log(timelineId);
        try {
            // console.log(timelineId);
            const data = {
                fromId: currentTimeLine._id,
                toName: timelineId?.name,
            };
            // console.log(data);
            const token = localStorage.getItem('timelineApp');
            // console.log(token);
            const data1 = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/timeline/unfollowtimelinefromtimeline`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                data,
            });
            const filteredResults = followedTimeline.filter(
                (result) => result.name !== timelineId?.name
            );
            setFollowedTimline(filteredResults);
            dispatch(
                notifyAction({
                    open: true,
                    severity: 'success',
                    message: 'Timeline unfollowed successfully',
                })
            );
        } catch (error) {
            dispatch(
                notifyAction({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong. Please try again later.',
                })
            );
        }
    };

    const handleSearch = (event) => {
        if (event.target.value.length > 0) {
            // console.log(event.target.value);
            clearTimeout(timer);

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
                    // console.log('current', currentTimeLine);
                    // console.log('data', data.timeline);
                    // console.log(data.timeline);
                    let filteredTimeline = [];
                    for (let i = 0; i < data.timeline.length; i++) {
                        let flag = 0;
                        for (
                            let j = 0;
                            j < currentTimeLine.followedTimeline.length;
                            j++
                        ) {
                            if (
                                data.timeline[i]._id ===
                                currentTimeLine.followedTimeline[j]
                            ) {
                                flag = 1;
                                break;
                            }
                        }
                        if (flag === 0) {
                            filteredTimeline.push(data.timeline[i]);
                        }
                    }

                    // console.log(filteredTimeline);
                    setSearchResults(filteredTimeline);
                } catch (error) {
                    dispatch(
                        notifyAction({
                            open: true,
                            severity: 'error',
                            message:
                                'Something went wrong. Please try again later.',
                        })
                    );
                }
            }, 1100);
            setTimer(newTimer);
        } else {
            setSearchResults([]);
        }
    };

    const deleteTimeline = async () => {
        try {
            const token = localStorage.getItem('timelineApp');
            const { data } = await axios({
                method: 'DELETE',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/timeline/deletetimeline/${currentTimeLine._id}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });
            dispatch(
                notifyAction({
                    open: true,
                    severity: 'success',
                    message: 'Timeline deleted successfully',
                })
            );

            // update groups
            setGroups((prev) => {
                const newGroups = prev.filter(
                    (group) => group.timelineId !== currentTimeLine._id
                );
                return newGroups;
            });
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(searchResults);
    // console.log(admin);
    return (
        <div className="bg-base-100 h-full rounded-box flex flex-col p-2 relative">
            {admin === 0 ? (
                <>
                    {currentTimeLine ? (
                        <>
                            <div className="p-2 bg-base-200 rounded-box flex flex-row justify-between items-center">
                                <div className="prose prose-sm mx-2">
                                    <h1>Info</h1>
                                </div>
                            </div>

                            {/* Show info from currentTimeline */}
                            <div className="flex-1 mt-4 px-2 overflow-y-auto">
                                {currentTimeLine.description}
                            </div>

                            {/* Timeline Tags */}
                            <div className="p-1 bg-base-200 rounded-box">
                                <div className="prose prose-sm mx-2">
                                    <h3>
                                        {currentTimeLine?.name} &apos;s tags
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-1 p-2">
                                {infoTags.map((tag, index) => (
                                    <div key={index}>
                                        <span className="badge badge-secondary">
                                            {tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-2 bg-base-200 rounded-box flex flex-row justify-between items-center">
                                <div className="prose prose-sm mx-2">
                                    <h1>Pinned Events</h1>
                                </div>
                            </div>

                            {/* Timeline events */}
                            <div className="flex-1 mt-4 px-2 overflow-y-auto">
                                {userImpEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-row justify-between items-center bg-accent text-accent-content rounded-box p-2 my-2"
                                    >
                                        <div className="flex flex-row items-center">
                                            <BsStarFill />
                                            <h3 className="m-0 ml-2">
                                                {event?.event?.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <>
                    {/* Admin Panel title */}
                    <div className="p-2 bg-base-200 rounded-box flex flex-row justify-between items-center">
                        <div className="prose prose-sm mx-2">
                            <h1>Admin Panel</h1>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="w-full p-2">
                        <input
                            type="text"
                            placeholder="Follow a timeline"
                            className="input input-bordered input-secondary w-full"
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Searched Timelines */}
                    <div className="flex-1 mt-4 px-2 overflow-y-auto">
                        {searchResults.map((timeline, index) => (
                            <div
                                key={index}
                                className="flex flex-row justify-between bg-accent text-accent-content rounded-box p-2 my-2"
                            >
                                <h3 className="ml-2">{timeline.name}</h3>
                                <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => followtimeline(timeline)}
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Semi Header */}
                    <div className="p-1 bg-base-200 rounded-box">
                        <div className="prose prose-sm mx-2">
                            <h3>{currentTimeLine?.name} follows...</h3>
                        </div>
                    </div>

                    {/* Followed Timelines */}
                    <div className="flex-1 px-2 overflow-y-auto">
                        {followedTimeline.map((timeline, index) => (
                            <div
                                key={index}
                                className="flex flex-row justify-between bg-secondary text-secondary-content rounded-box p-2 my-2"
                            >
                                <h3 className="ml-2">{timeline.name}</h3>
                                <button
                                    className="btn btn-xs btn-primary"
                                    onClick={() => unfollowtimeline(timeline)}
                                >
                                    Unfollow
                                </button>
                            </div>
                        ))}
                        {/* If followedTimeline length is 0, show this */}
                        {followedTimeline.length === 0 && (
                            <h3 className="mt-2">
                                You are not following any timelines
                            </h3>
                        )}
                    </div>

                    {/* Timeline Tags */}
                    <div className="p-1 bg-base-200 rounded-box">
                        <div className="prose prose-sm mx-2">
                            <h3>{currentTimeLine?.name} tags</h3>
                        </div>
                    </div>
                    <div className="flex-1 p-2">
                        {currentTimeLine?.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="badge badge-primary m-1"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Delete Timeline */}
                    <div className="p-1 bg-base-200 rounded-box">
                        <div className="prose prose-sm mx-2">
                            <h3>Danger Zone!</h3>
                        </div>
                    </div>
                    <div className="flex-1 p-2">
                        <button
                            className="btn btn-error w-full"
                            onClick={deleteTimeline}
                        >
                            Delete Timeline
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
