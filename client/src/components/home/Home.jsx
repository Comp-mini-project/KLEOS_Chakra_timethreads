import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Components
import Sidebar from './Sidebar';
import GroupList from './home-sections/GroupList';
import TimelineView from './home-sections/TimelineView';
import SuperPanel from './home-sections/SuperPanel';
import Notify from '../../features/notifier/Notify';

// Redux
import { startLoading, stopLoading } from '../../features/loading/loadingSlice';
import { notifyAction } from '../../features/notifier/notifySlice';

export default function Home() {
    const dispatch = useDispatch();

    const [groups, setGroups] = useState([]);
    const [userImpEvents, setUserImpEvents] = useState([]);
    const [currentTimeLine, setCurrentTimeLine] = useState(null);

    useEffect(() => {
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
                    setGroups(
                        data.timelineList.map((group) => {
                            return {
                                name: group.name,
                                photoURL: group.photoUrl,
                            };
                        })
                    );
                }

                // Set the user's important events
                setUserImpEvents(data.userImpEvents);
            } catch (error) {
                console.log(error);
            }

            dispatch(stopLoading());
        };

        getUserImpState();
    }, []);

    return (
        // Parent div is flex container
        <div className="flex flex-row bg-neutral h-screen w-screen">
            {/* Sidebar */}
            <Sidebar />

            <Notify />

            {/* User Timeline */}
            <div className="flex flex-row w-full">
                <div className="flex-1 grow h-full p-1">
                    <GroupList {...{ groups, setCurrentTimeLine }} />
                </div>
                <div className="flex-1 grow h-full p-1">
                    <TimelineView />
                </div>
                <div className="flex-1 grow h-full p-1">
                    <SuperPanel />
                </div>
            </div>
        </div>
    );
}
