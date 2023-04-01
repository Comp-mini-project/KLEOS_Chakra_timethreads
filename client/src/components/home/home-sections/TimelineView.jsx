import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// CSS
import './TimelineView.css';

// Components
import Event from './Event';

// Icons
import { GoPlus } from 'react-icons/go';

const initialstate = {
    name: '',
    description: '',
    tags: '',
    location: '',
    allowThread: false,
    allowVoiceRooms: false,
    type: 'timeline',
    startTimestamp: new Date().toISOString().replace('Z', '+05:30'),
    endTimestamp: new Date().toISOString().replace('Z', '+05:30'),
};

export default function TimelineView({ currentTimeLine, userPersonalEvents }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        ...initialstate,
        type: currentTimeLine == null ? 'personal' : 'timeline',
    });
    const [avatar, setAvatar] = React.useState(null);
    const [avatarPreview, setAvatarPreview] = React.useState(null);
    const createTimelineImagesChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    const createEventInTimeline = async (e) => {
        e.preventDefault();
        try {
            const myForm = new FormData();
            myForm.append('name', formData.name);
            myForm.append('description', formData.description);
            myForm.append('tags', formData.tags);
            myForm.append('location', formData.location);
            myForm.append('allowThread', formData.allowThread);
            myForm.append('allowVoiceRooms', formData.allowVoiceRooms);
            myForm.append('type', formData.type);
            myForm.append('startTimestamp', formData.startTimestamp);
            myForm.append('endTimestamp', formData.endTimestamp);
            myForm.append('avatar', avatar);
            const token = localStorage.getItem('timelineApp');
            setIsModalOpen(false);
            if (currentTimeLine == null && formData.type == 'personal') {
                const { data } = await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/timeline/createmyEvent`,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${token}`,
                    },
                    data: myForm,
                });
                console.log(data);
            } else {
                const { data } = await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/timeline/createEventfortimeline/${currentTimeLine}`,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${token}`,
                    },
                    data: myForm,
                });
                console.log(data);
            }
            // setFormData(initialstate);
            // setAvatar(null);
            // setAvatarPreview(null);
        } catch (error) {
            console.log(error);
        }
    };
    const handleAllowThreadsChange = (event) => {
        setFormData({
            ...formData,
            allowThread: event.target.checked,
        });
    };
    const handleAllowVoiceRoomsChange = (event) => {
        setFormData({
            ...formData,
            allowVoiceRooms: event.target.checked,
        });
    };
    const handleTypeChange = (event) => {
        setFormData({
            ...formData,
            type: event.target.checked ? 'personal' : 'timeline',
        });
    };

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

    // Split the events that start and end on different days
    const modifiedEvents = [];
    userPersonalEvents.forEach((event) => {
        // Check if the event spans multiple days
        const startDate = new Date(event.startTimestamp);
        const endDate = new Date(event.endTimestamp);
        const isMultiDay = startDate.getDate() !== endDate.getDate();

        // Create two separate events for multi-day events
        if (isMultiDay) {
            const firstDayEnd = new Date(startDate);
            firstDayEnd.setHours(23, 59, 59, 999);
            modifiedEvents.push({
                ...event,
                endTimestamp: firstDayEnd.getTime(),
                timestamp: startDate.getTime(),
            });
            const secondDayStart = new Date(endDate);
            secondDayStart.setHours(0, 0, 0, 0);
            modifiedEvents.push({
                ...event,
                startTimestamp: secondDayStart.getTime(),
                timestamp: secondDayStart.getTime(),
            });
        }
        // Use the start timestamp for single-day events
        else {
            modifiedEvents.push({
                ...event,
                timestamp: startDate.getTime(),
            });
        }
    });

    modifiedEvents.sort((a, b) => a.timestamp - b.timestamp);

    // UseEffect which will run when currFocusDate changes
    useEffect(() => {
        // console.log(currFocusDate);
    }, [currFocusDate]);

    return (
        <div className="bg-base-100 h-full rounded-box flex flex-col p-2 relative">
            {/* Timeline header */}
            <div className="p-2 bg-base-200 rounded-box flex flex-row justify-between items-center">
                <div className="prose prose-sm mx-2">
                    <h1>
                        {currentTimeLine
                            ? `Timeline: ${currentTimeLine.name}`
                            : 'Your Events'}
                    </h1>
                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                            <div className="bg-white rounded-lg p-4 w-6/12">
                                <h1 className="text-lg font-semibold mb-4">
                                    Create a new Timeline
                                </h1>
                                <div className="flex flex-row items-center">
                                    <label className="text-sm font-semibold">
                                        Name
                                    </label>
                                    <input
                                        value={formData.name}
                                        type="text"
                                        className="input input-bordered input-sm input-secondary mx-3"
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                name: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-row items-center">
                                    <label className="text-sm font-semibold">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                description: event.target.value,
                                            })
                                        }
                                        className="input input-bordered input-secondary m-3 input-sm"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex flex-row mt-1 items-center">
                                    <label className="text-sm font-semibold">
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        className="input input-ms "
                                        accept="image/*"
                                        onChange={createTimelineImagesChange}
                                    />
                                    {avatarPreview && (
                                        <img
                                            src={avatarPreview}
                                            className="w-14 h-14 object-cover rounded-full"
                                            alt="Avatar Preview"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-row mt-1 items-center">
                                    <label className="text-sm font-semibold">
                                        Tags
                                    </label>
                                    <input
                                        value={formData.tags}
                                        type="text"
                                        className="input input-bordered input-secondary input-sm mx-3"
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                tags: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex flex-row mt-3 items-center">
                                    <label className="text-sm font-semibold">
                                        Location
                                    </label>
                                    <input
                                        value={formData.location}
                                        type="text"
                                        className="input input-bordered input-secondary input-sm mx-3"
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                location: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {currentTimeLine && (
                                    <>
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Allow Threads
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="toggle"
                                                checked={formData.allowThread}
                                                onChange={
                                                    handleAllowThreadsChange
                                                }
                                            />
                                        </label>
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Allow VoiceRooms
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="toggle"
                                                checked={
                                                    formData.allowVoiceRooms
                                                }
                                                onChange={
                                                    handleAllowVoiceRoomsChange
                                                }
                                            />
                                        </label>
                                        <label className="label cursor-pointer">
                                            <span className="label-text">
                                                Personal
                                            </span>
                                            <input
                                                type="checkbox"
                                                className="toggle"
                                                checked={
                                                    formData.type === 'personal'
                                                }
                                                onChange={handleTypeChange}
                                            />
                                        </label>
                                    </>
                                )}
                                <div class="flex flex-row space-y-2 mb-3">
                                    <label
                                        htmlFor="datetime"
                                        className="font-medium"
                                    >
                                        Event Start Timestamp
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="datetime"
                                        name="datetime"
                                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        value={formData.startTimestamp}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                startTimestamp:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div class="flex flex-row space-y-2 mb-3">
                                    <label
                                        htmlFor="datetime"
                                        className="font-medium"
                                    >
                                        Event End Timestamp
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="datetime"
                                        name="datetime"
                                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        value={formData.endTimestamp}
                                        onChange={(event) =>
                                            setFormData({
                                                ...formData,
                                                endTimestamp:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="btn btn-secondary mr-2"
                                        onClick={toggleModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={createEventInTimeline}
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}{' '}
                </div>
                {/* Month and date */}
                <div className="flex justify-between">
                    <button className="btn btn-primary">
                        {currFocusDate.month}
                    </button>
                </div>
            </div>

            {/* Timeline events */}
            <div className="flex-1 mt-4 px-2 overflow-y-auto">
                {modifiedEvents.map((event, index) => (
                    <Event event={event} key={event._id} index={index} />
                ))}
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
