import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Components
import Sidebar from './Sidebar';
import GroupList from './home-sections/GroupList';
import TimelineView from './home-sections/TimelineView';
import SuperPanel from './home-sections/SuperPanel';
import Notify from '../../features/notifier/Notify';
import Loading from '../../features/loading/Loading';

// Redux
import { startLoading, stopLoading } from '../../features/loading/loadingSlice';
import { notifyAction } from '../../features/notifier/notifySlice';

export default function Home() {
    const dispatch = useDispatch();

    const [groups, setGroups] = useState([]);
    const [userPersonalEvents, setUserPersonalEvents] = useState([]);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [userImpEvents, setUserImpEvents] = useState([]);
    const [currentTimeLine, setCurrentTimeLine] = useState(null);

    // This is the user's initial state
    const getUserImpState = async () => {
        dispatch(startLoading());

        try {
            const token = localStorage.getItem('timelineApp');

            const { data } = await axios({
                method: 'GET',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/timeline/listpersonalimp`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });
            console.log(data);

            // Set the groups that the user is currently following
            if (data.timelineList.length == 0) {
                dispatch(
                    notifyAction({
                        open: true,
                        severity: 'info',
                        message: 'You are not following any timeline',
                    })
                );
            } else {
                setGroups(data.timelineList);
            }

            // Set the user's important events
            setUserImpEvents(data.eventList);

            // Set the user's personal events
            setUserPersonalEvents(data.myevents);

            // Set the current timeline
            setCurrentTimeLine(null);
        } catch (error) {
            console.log(error);
        }

        dispatch(stopLoading());
    };

    useEffect(() => {
        getUserImpState();
    }, []);

    return (
        // Parent div is flex container
        <div className="flex flex-row bg-neutral h-screen w-screen">
            {/* Sidebar */}
            <Sidebar {...{ getUserImpState }} />

            <Loading />
            <Notify />

            {/* User Timeline */}
            <div className="flex w-full">
                <div className="w-1/4 h-full p-1">
                    <GroupList
                        {...{
                            groups,
                            setCurrentTimeLine,
                            setGroups,
                        }}
                    />
                </div>
                <div className="w-2/4 grow h-full p-1">
                    <TimelineView
                        {...{
                            currentTimeLine,
                            userPersonalEvents,
                            setUserPersonalEvents,
                            timelineEvents,
                            setTimelineEvents,
                            setUserImpEvents,
                        }}
                    />
                </div>
                <div className="w-1/4 grow h-full p-1">
                    <SuperPanel
                        {...{
                            userImpEvents,
                            currentTimeLine,
                            setGroups,
                            groups,
                            timelineEvents,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
