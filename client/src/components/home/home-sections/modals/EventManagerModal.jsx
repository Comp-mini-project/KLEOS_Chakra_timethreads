import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Actions
import { notifyAction } from '../../../../features/notifier/notifySlice';
import {
    startLoading,
    stopLoading,
} from '../../../../features/loading/loadingSlice';

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

export default function EventManagerModal({
    eventManagerModal,
    setEventManagerModal,
    toggleModal,
    currentTimeLine,
    eventInfo,
    setUserPersonalEvents,
    userPersonalEvents,
}) {
    const dispatch = useDispatch();

    // form data for creating an event
    const [formData, setFormData] = React.useState({
        ...initialstate,
        type: currentTimeLine == null ? 'personal' : 'timeline',
    });
    // const [avatar, setAvatar] = React.useState(null);
    // const [avatarPreview, setAvatarPreview] = React.useState(null);
    const [modalType, setModalType] = React.useState('create');

    // In the Modal, to update image on change
    // const createTimelineImagesChange = (e) => {
    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         if (reader.readyState === 2) {
    //             // setAvatarPreview(reader.result);
    //             setAvatar(reader.result);
    //         }
    //     };

    //     reader.readAsDataURL(e.target.files[0]);
    // };

    useEffect(() => {
        if (eventInfo) {
            setFormData({
                ...eventInfo,
            });
            // setAvatarPreview(eventInfo.avatar);
            setModalType('update');
        }
        // console.log(eventInfo);
    }, [eventInfo]);

    // To post the form data to the server
    const createEventInTimeline = async (e) => {
        e.preventDefault();

        dispatch(startLoading());
        const token = localStorage.getItem('timelineApp');
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
        // myForm.append('avatar', avatar);
        try {
            if (modalType !== 'update') {
                if (currentTimeLine == null && formData.type == 'personal') {
                    const { data } = await axios({
                        method: 'POST',
                        url: `${
                            import.meta.env.VITE_SERVER_URL
                        }/api/event/createmyEvent`,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`,
                        },
                        data: myForm,
                    });
                    setUserPersonalEvents([data.event, ...userPersonalEvents]);
                    console.log(data);
                } else {
                    const { data } = await axios({
                        method: 'POST',
                        url: `${
                            import.meta.env.VITE_SERVER_URL
                        }/api/event/createEventfortimeline/${
                            currentTimeLine?._id
                        }`,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            authorization: `Bearer ${token}`,
                        },
                        data: myForm,
                    });
                    console.log(data);
                }
                setEventManagerModal(false);
            } else {
                await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/event/editmyEvent/${eventInfo._id}`,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${token}`,
                    },
                    data: myForm,
                });
                window.location.reload();
                setEventManagerModal(false);
            }
            setEventManagerModal(false);
            // setFormData(initialstate);
            // setAvatar(null);
            // setAvatarPreview(null);
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(stopLoading());
        }
    };

    // For Admins
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

    // Is it a personal event or a timeline event
    const handleTypeChange = (event) => {
        setFormData({
            ...formData,
            type: event.target.checked ? 'personal' : 'timeline',
        });
    };

    return (
        <div>
            {/* Modal */}
            {eventManagerModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-base-100 rounded-lg p-4 w-6/12">
                        <h1 className="text-lg font-semibold mb-2 text-center">
                            {modalType === 'create'
                                ? ' Create a new Event'
                                : 'Update Event'}
                        </h1>

                        <div className="flex flex-row">
                            <div className="form-control w-full max-w-xs px-2">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    value={formData.name}
                                    type="text"
                                    className="input input-bordered w-full max-w-xs input-secondary"
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            name: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="form-control w-full max-w-xs px-2">
                                <label className="label">
                                    <span className="label-text">
                                        Description
                                    </span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            description: event.target.value,
                                        })
                                    }
                                    className="textarea textarea-bordered textarea-secondary textarea-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <div className="form-control w-full max-w-xs px-2">
                                <label className="label">
                                    <span className="label-text">Tags</span>
                                </label>
                                <input
                                    value={formData.tags}
                                    type="text"
                                    className="input input-bordered w-full max-w-xs input-bordered input-secondary"
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            tags: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* <div className="flex flex-col w-full max-w-xs px-2">
                                <label className="label">
                                    <span className="label-text">Image</span>
                                </label>
                                <div className="flex flex-row items-center">
                                    <input
                                        type="file"
                                        className="file-input w-full max-w-xs file-input-bordered file-input-secondary"
                                        accept="image/*"
                                        onChange={createTimelineImagesChange}
                                    />
                                    <div className="ml-3">
                                        {avatarPreview && (
                                            <img
                                                src={avatarPreview}
                                                className="w-15 h-14 object-cover rounded-full"
                                                alt="Avatar Preview"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="form-control w-full max-w-xs px-2">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input
                                value={formData.location}
                                type="text"
                                className="input input-bordered w-full max-w-xs input-bordered input-secondary"
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
                                        className="toggle toggle-secondary"
                                        checked={formData.allowThread}
                                        onChange={handleAllowThreadsChange}
                                    />
                                </label>
                                <label className="label cursor-pointer">
                                    <span className="label-text">
                                        Allow VoiceRooms
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-secondary"
                                        checked={formData.allowVoiceRooms}
                                        onChange={handleAllowVoiceRoomsChange}
                                    />
                                </label>
                                <label className="label cursor-pointer">
                                    <span className="label-text">
                                        Is this a personal event?
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-secondary"
                                        checked={formData.type === 'personal'}
                                        onChange={handleTypeChange}
                                    />
                                </label>
                            </>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-row space-y-2 mb-3">
                                <label htmlFor="datetime" className="label">
                                    <span className="label-text">
                                        Event Start Timestamp
                                    </span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime"
                                    name="datetime"
                                    className="w-full p-2 bg-base-200 border-secondary border rounded-md shadow-sm focus:outline-none focus:primary focus:border-primary"
                                    required
                                    value={formData.startTimestamp}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            startTimestamp: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex flex-row space-y-2 mb-3">
                                <label htmlFor="datetime" className="label">
                                    <span className="label-text">
                                        Event End Timestamp
                                    </span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime"
                                    name="datetime"
                                    className="w-full p-2 bg-base-200 border-secondary border rounded-md shadow-sm focus:outline-none focus:primary focus:border-primary"
                                    required
                                    value={formData.endTimestamp}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            endTimestamp: event.target.value,
                                        })
                                    }
                                />
                            </div>
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
                                {modalType === 'create' ? 'Create' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}{' '}
        </div>
    );
}
