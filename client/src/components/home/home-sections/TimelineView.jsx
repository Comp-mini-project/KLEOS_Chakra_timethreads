import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// CSS
import './TimelineView.css';

// Components
import Event from './Event';
import EventManagerModal from './modals/EventManagerModal';

// Icons
import { GoPlus } from 'react-icons/go';

// Actions
import {
    startLoading,
    stopLoading,
} from '../../../features/loading/loadingSlice';

export default function TimelineView({
    currentTimeLine,
    userPersonalEvents,
    setUserPersonalEvents,
    setUserImpEvents,
    timelineEvents,
    setTimelineEvents,
}) {
    const dispatch = useDispatch();

    const [eventManagerModal, setEventManagerModal] = useState(false);
    const [modifiedEvents, setModifiedEvents] = useState([]);

    const [currFocusDate, setCurrFocusDate] = useState({
        year: new Date().getFullYear(),
        // Month is a string
        month: new Date().toLocaleString('default', { month: 'long' }),
        date: new Date().getDate(),
    });

    const handleGotoDate = (date) => {
        // Extract year, month, date from date
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const dateNum = date.getDate();

        // Set currFocusDate
        setCurrFocusDate({
            year,
            month,
            date: dateNum,
        });
    };

    const toggleModal = () => {
        setEventManagerModal(!eventManagerModal);
    };

    const sortEvents = (events) => {
        events.sort((a, b) => a.timestamp - b.timestamp);
    };

    const createModifiedEvents = (givenEvents) => {
        let tempEvents = [];
        givenEvents.forEach((event) => {
            const startDate = new Date(event.startTimestamp);
            tempEvents.push({
                ...event,
                timestamp: startDate.getTime(),
            });
        });
        setModifiedEvents(tempEvents);
        // Sort the events
        sortEvents(tempEvents);
    };

    const sortTimelineEvents = (events) => {
        const tempEvents = events.map((event) => {
            const startDate = new Date(event.event.startTimestamp);
            return {
                ...event,
                event: {
                    ...event.event,
                    timestamp: startDate.getTime(),
                },
            };
        });

        tempEvents.sort((a, b) => a.event.timestamp - b.event.timestamp);

        setTimelineEvents(tempEvents);
    };

    // Fetch timeline events
    useEffect(() => {
        if (currentTimeLine) {
            const fetchTimelineEvents = async () => {
                dispatch(startLoading());
                const token = localStorage.getItem('timelineApp');

                const { data } = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/event/geteventoftimeline/${currentTimeLine._id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                });
                setTimelineEvents(data.events);
                console.log('Timeline events fetched', data.events);
                dispatch(stopLoading());
            };

            fetchTimelineEvents();
            // Sort the events
            sortTimelineEvents(timelineEvents);
        } else {
            createModifiedEvents(userPersonalEvents);
        }
    }, [currentTimeLine, userPersonalEvents]);

    return (
        <div className="bg-base-100 h-full rounded-box flex flex-col p-2 relative">
            <EventManagerModal
                {...{
                    eventManagerModal,
                    setEventManagerModal,
                    toggleModal,
                    currentTimeLine,
                    setUserPersonalEvents,
                    userPersonalEvents,
                }}
            />
            {/* Timeline header */}
            <div className="p-2 bg-base-200 rounded-box flex flex-row justify-between items-center">
                <div className="prose prose-sm mx-2">
                    <h1>
                        {currentTimeLine
                            ? `Timeline: ${currentTimeLine.name}`
                            : 'Your Events'}
                    </h1>
                </div>
                {/* Month and date */}
                <div className="flex justify-between">
                    <button className="btn btn-primary btn-sm">
                        {currFocusDate.month}
                    </button>
                </div>
            </div>
            {/* Timeline events */}
            <div className="flex-1 mt-4 px-2 overflow-y-auto">
                {currentTimeLine ? (
                    <>
                        {timelineEvents?.map((event, index) => (
                            <Event
                                event={event.event}
                                tag={event.eventTag}
                                key={event._id}
                                index={index}
                                setUserImpEvents={setUserImpEvents}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {modifiedEvents?.map((event, index) => (
                            <Event
                                event={event}
                                tag={null}
                                key={event._id}
                                index={index}
                                setUserImpEvents={setUserImpEvents}
                            />
                        ))}
                    </>
                )}
            </div>
            {/* Add Group Button */}
            <div className="absolute bottom-0 right-0 p-4 z-25">
                <div
                    className="tooltip tooltip-left tooltip-secondary"
                    data-tip="Create a new Event"
                    onClick={toggleModal}
                >
                    <button className="btn btn-square bg-primary border-0">
                        <GoPlus className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
