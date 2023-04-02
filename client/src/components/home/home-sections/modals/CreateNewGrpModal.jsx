import React, { useState } from 'react';
import axios from 'axios';

export default function CreateNewGrpModal({
    createGroupModal,
    setCreateGroupModal,
    groups,
    setGroups,
}) {
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
            setCreateGroupModal(false);
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
            console.log(data);
            setName('');
            setDescription('');
            setTags('');
            setAvatar(null);
            setAvatarPreview(null);
            setGroups([
                ...groups,
                {
                    ...data.timeline,
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    const toggleModal = () => {
        setCreateGroupModal(!createGroupModal);
    };

    return (
        <div>
            {createGroupModal && (
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
                                className="input input-bordered input-secondary input-sm"
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
                                className="textarea h-24 textarea-bordered textarea-secondary"
                                rows="5"
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>

                        <div className="flex flex-col mt-2 mr-2">
                            <label className="text-sm font-semibold m-1">
                                Image
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
                                            className="w-15 h-14 rounded-full m-0"
                                            alt="Avatar Preview"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm font-semibold m-1">
                                Tags
                            </label>
                            <input
                                value={tags}
                                type="text"
                                className="input input-bordered input-secondary input-sm"
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
        </div>
    );
}
