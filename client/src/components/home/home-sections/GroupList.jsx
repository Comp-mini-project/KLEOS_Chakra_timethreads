import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Components
import SrchdGrpModal from './modals/SrchdGrpModal';
// Actions
import { notifyAction } from '../../../features/notifier/notifySlice';

// Icons
import { GoPlus } from 'react-icons/go';

export default function GroupList({ groups, setCurrentTimeLine, setGroups }) {
    const dispatch = useDispatch();

    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [timer, setTimer] = useState(null);

    const [searchedGroupModal, setSearchedGroupModal] = useState(false);
    const [browsingGroupId, setBrowsingGroupId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState(null);

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
    const createTimeline = async (e) => {
        e.preventDefault();
        try {
            const myForm = new FormData();
            myForm.append('name', name);
            myForm.append('description', description);
            myForm.append('tags', tags);
            myForm.append('avatar', avatar);
            const token = localStorage.getItem('timelineApp');
            setIsModalOpen(false);
            const { data } = await axios({
                method: 'POST',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/timeline/createtimeline`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token}`,
                },
                data: myForm,
            });
            setName('');
            setDescription('');
            setTags('');
            setAvatar(null);
            setAvatarPreview(null);
            setGroups([
                ...groups,
                {
                    name: data.timeline.name,
                    id: data.timeline._id,
                    photoUrl: data.timeline.photoUrl,
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://example.com/api/users', {
                name,
                email,
            });
            console.log(response.data);
            // do something with response
        } catch (error) {
            console.error(error);
            // handle error
        }
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleSearch = (event) => {
        if (event.target.value.length > 0) {
            console.log(event.target.value);
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
            setSearchStatus(null);
        }
        if (event.target.value.length === 0) {
            setIsSearching(false);
            setSearchStatus(null);
        }
    };

    const handleSearchedGroupClick = (group) => {
        setBrowsingGroupId(group._id);
        setSearchedGroupModal(true);
    };

    return (
        <>
            <SrchdGrpModal
                {...{
                    searchedGroupModal,
                    setSearchedGroupModal,
                    browsingGroupId,
                    groups,
                    setGroups,
                }}
            />
            <div className="bg-base-100 h-full rounded-box flex flex-col p-2 relative">
                {/* Create a new Timeline Button */}
                <div className="absolute bottom-0 right-0 p-4">
                    <div
                        className="tooltip tooltip-left tooltip-secondary"
                        data-tip="Create a new Timeline"
                        onClick={toggleModal}
                    >
                        <button className="btn btn-square bg-primary border-0">
                            <GoPlus className="text-white" />
                        </button>
                    </div>
                </div>

                {/* createTimeline Modal */}
                {isModalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg p-4 prose">
                            <h2 className="prose-h2 text-center">
                                Create a new Timeline
                            </h2>
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold m-1">
                                    Name
                                </label>
                                <input
                                    value={name}
                                    type="text"
                                    className="input input-bordered input-secondary"
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col mt-2">
                                <label className="text-sm font-semibold m-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    type="text"
                                    className="input input-bordered input-secondary"
                                    rows="3"
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col mt-2">
                                <label className="text-sm font-semibold m-1">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    className="input input-bordered input-secondary"
                                    accept="image/*"
                                    onChange={createTimelineImagesChange}
                                    style={{
                                        padding: '0.5rem',
                                    }}
                                />
                                {avatarPreview && (
                                    <img
                                        src={avatarPreview}
                                        className="w-20 h-20 object-cover rounded-full"
                                        alt="Avatar Preview"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col mt-2">
                                <label className="text-sm font-semibold m-1">
                                    Tags
                                </label>
                                <input
                                    value={tags}
                                    type="text"
                                    className="input input-bordered input-secondary"
                                    onChange={(event) =>
                                        setTags(event.target.value)
                                    }
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    className="btn btn-secondary mr-2"
                                    onClick={toggleModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={createTimeline}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="w-full p-2">
                    <input
                        type="text"
                        placeholder="🔍Search for a Timeline"
                        className="input input-bordered input-secondary w-full"
                        onChange={handleSearch}
                    />
                </div>

                {/* The Searching... text */}
                {searchStatus && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <h1 className="text-lg font-semibold">
                            {searchStatus}
                        </h1>
                    </div>
                )}

                {/* The Search results */}
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
                                        onClick={handleSearchedGroupClick.bind(
                                            this,
                                            result
                                        )}
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
                {/* The Groups followed by the user */}
                {!isSearching && (
                    <>
                        {groups.map((group, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-row items-center justify-between p-2 cursor-pointer hover:bg-base-200 rounded-box"
                                    onClick={() =>
                                        setCurrentTimeLine(group.name)
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
        </>
    );
}
