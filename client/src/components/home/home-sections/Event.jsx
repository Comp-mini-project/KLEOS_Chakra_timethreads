import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

// Icon
import { CiMenuKebab } from 'react-icons/ci';
import { MdEdit } from 'react-icons/md';
import { AiOutlineStar } from 'react-icons/ai';
import {
    startLoading,
    stopLoading,
} from '../../../features/loading/loadingSlice';
import EventManagerModal from './modals/EventManagerModal';

export default function Event({ event, index, setUserImpEvents, tag }) {
    const [dayNum, setDayNum] = useState(0);
    const [humanReadableTime, setHumanReadableTime] = useState('');
    const [humanReadableEndTime, setHumanReadableEndTime] = useState('');
    const [eventType, setEventType] = useState('');
    const [voiceRoomAllowed, setVoiceRoomAllowed] = useState(false);
    const [threadAllowed, setThreadAllowed] = useState(false);
    const currentUser = useSelector((state) => state.user.userObj);
    const dispatch = useDispatch();
    const [flexDirection, setFlexDirection] = useState(
        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
    );

    useEffect(() => {
        // console.log(event);
        setEventType(event?.type);
        if (event?.type !== 'personal') {
            setVoiceRoomAllowed(event?.allowVoiceRooms);
            setThreadAllowed(event?.allowThread);
        }
    }, [event]);

    useEffect(() => {
        setDayNum(new Date(event?.startTimestamp).getDate());

        const time = new Date(event?.startTimestamp).toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }
        );

        const endTime = new Date(event?.endTimestamp).toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }
        );

        setHumanReadableTime(time);
        setHumanReadableEndTime(endTime);
    }, []);

    const handleEditEvent = async () => {
        console.log('Edit Event');
        toggleModal();
    };

    const token = localStorage.getItem('timelineApp');
    const handleStarEvent = async () => {
        console.log('Star Event');
        try {
            const { data } = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/event/addtofavourite/${event._id}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
            });
            setUserImpEvents((prev) => {
                return [...prev, event];
            });
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const [eventManagerModal, setEventManagerModal] = useState(false);

    const toggleModal = () => {
        setEventManagerModal(!eventManagerModal);
    };

    return (
        // Parent div
        <>
            <EventManagerModal
                {...{
                    eventManagerModal,
                    setEventManagerModal,
                    toggleModal,
                    eventInfo: event,
                }}
            />

            <div
                className={`flex ${flexDirection} h-72 justify-start items-center`}
            >
                {/* Empty component to fill space */}
                <div className="flex flex-col flex-1 h-full" />

                {/* The Date Circle with TimelineTrunk */}
                <div className="flex flex-col w-24 h-full place-items-center relative">
                    {/* Create a thin box */}
                    <div className="w-2 h-full bg-secondary" />

                    {/* Create a circle */}
                    <div className="w-12 h-12 bg-secondary text-secondary-content rounded-full grid place-items-center absolute top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl font-semibold">{dayNum}</span>
                    </div>
                </div>

                {/* Event Card */}
                <div className="flex flex-col flex-1 h-full justify-center">
                    {/* DaisyUI Card */}
                    <div className="card bg-accent text-accent-content">
                        <div className="card-body">
                            {eventType !== 'personal' ? (
                                event?.createdBy === currentUser._id && (
                                    <div className="absolute right-4 top-3 dropdown dropdown-bottom dropdown-end">
                                        <label
                                            className="cursor-pointer"
                                            tabIndex={0}
                                        >
                                            <CiMenuKebab size={26} />
                                        </label>
                                        <ul
                                            tabIndex={0}
                                            className="z-40 dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                                        >
                                            <li className="flex flex-col">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={threadAllowed}
                                                        className="checkbox"
                                                        onChange={async () => {
                                                            dispatch(
                                                                startLoading()
                                                            );
                                                            try {
                                                                const data = {
                                                                    allowThread:
                                                                        !threadAllowed,
                                                                };
                                                                const token =
                                                                    window.localStorage.getItem(
                                                                        'timelineApp'
                                                                    );
                                                                const res =
                                                                    await axios(
                                                                        {
                                                                            method: 'POST',
                                                                            url: `${
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_SERVER_URL
                                                                            }/api/event/editEventfortimeline/${
                                                                                event._id
                                                                            }`,
                                                                            headers:
                                                                                {
                                                                                    'Content-Type':
                                                                                        'application/json',
                                                                                    authorization: `Bearer ${token}`,
                                                                                },
                                                                            data,
                                                                        }
                                                                    );
                                                                setThreadAllowed(
                                                                    (state) =>
                                                                        !state
                                                                );
                                                                console.log(
                                                                    res
                                                                );
                                                            } catch (error) {
                                                                alert(
                                                                    'Error occured while updating event'
                                                                );
                                                                console.log(
                                                                    error
                                                                );
                                                            } finally {
                                                                dispatch(
                                                                    stopLoading()
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <a> Thread</a>
                                                </div>
                                            </li>
                                            <li className="flex flex-col">
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            voiceRoomAllowed
                                                        }
                                                        className="checkbox"
                                                        onChange={async () => {
                                                            dispatch(
                                                                startLoading()
                                                            );
                                                            try {
                                                                const data = {
                                                                    allowVoiceRooms:
                                                                        !voiceRoomAllowed,
                                                                };
                                                                const token =
                                                                    window.localStorage.getItem(
                                                                        'timelineApp'
                                                                    );
                                                                const res =
                                                                    await axios(
                                                                        {
                                                                            method: 'POST',
                                                                            url: `${
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_SERVER_URL
                                                                            }/api/event/editEventfortimeline/${
                                                                                event._id
                                                                            }`,
                                                                            headers:
                                                                                {
                                                                                    'Content-Type':
                                                                                        'application/json',
                                                                                    authorization: `Bearer ${token}`,
                                                                                },
                                                                            data,
                                                                        }
                                                                    );
                                                                setVoiceRoomAllowed(
                                                                    (state) =>
                                                                        !state
                                                                );
                                                                console.log(
                                                                    res
                                                                );
                                                            } catch (error) {
                                                                alert(
                                                                    'Error occured while updating event'
                                                                );
                                                                console.log(
                                                                    error
                                                                );
                                                            } finally {
                                                                dispatch(
                                                                    stopLoading()
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <a> Voice Room</a>
                                                </div>
                                            </li>
                                            <li onClick={handleEditEvent}>
                                                <div>
                                                    <button>
                                                        <MdEdit size={26} />
                                                    </button>
                                                    Edit Event
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )
                            ) : (
                                <div className="absolute top-2 right-2 flex flex-row">
                                    <button
                                        className="btn btn-circle btn-sm
                                        btn-outline btn-neutral
                                        text-accent-content mx-1"
                                        onClick={handleStarEvent}
                                    >
                                        <AiOutlineStar size={18} />
                                    </button>

                                    <button
                                        className="btn btn-circle btn-sm btn-outline btn-neutral text-accent-content"
                                        onClick={handleEditEvent}
                                    >
                                        <MdEdit size={18} />
                                    </button>
                                </div>
                            )}
                            <div className="card-title">
                                <h1 className="text-2xl font-semibold">
                                    {event?.name}
                                </h1>
                            </div>
                            <div className="card-content">
                                <p>{event?.summary}</p>

                                {/* Time */}
                                <div className="flex flex-row flex-wrap mt-2 justify-start items-center">
                                    {/* Label */}
                                    <h1 className="text-lg font-semibold mr-2">
                                        Time:
                                    </h1>
                                    {humanReadableTime}
                                    <span className="mx-2">-</span>
                                    {humanReadableEndTime}
                                </div>

                                {/* Tags using badges */}
                                <div className="flex flex-row flex-wrap mt-2 justify-start items-center">
                                    {/* Label */}
                                    <h1 className="text-lg font-semibold mr-2">
                                        Tags:
                                    </h1>
                                    {/* if tag is not null then render it */}
                                    {tag !== null && (
                                        <span className="badge badge-neutral mr-2">
                                            {tag}
                                        </span>
                                    )}
                                    {tag === null && (
                                        <>
                                            {event?.tags.map((tag) => (
                                                <span
                                                    className="badge badge-neutral mr-2"
                                                    key={tag}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </div>

                                {eventType !== 'personal' && (
                                    <div className="flex flex-row justify-start items-center mt-4">
                                        <button className="btn btn-secondary btn-sm">
                                            <p>Thread</p>
                                        </button>
                                        <button className="btn btn-error btn-sm ml-2">
                                            <p>Voice Room</p>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
