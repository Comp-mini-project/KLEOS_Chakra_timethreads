import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Actions
import { notifyAction } from '../../../../features/notifier/notifySlice';

import {
    startLoading,
    stopLoading,
} from '../../../../features/loading/loadingSlice';

// Icons
import { RxCross2 } from 'react-icons/rx';

export default function SrchdGrpModal({
    searchedGroupModal,
    setSearchedGroupModal,
    browsingGroupId,
    groups,
    setGroups,
}) {
    const dispatch = useDispatch();
    // Fetch group using browsingGroupId and url /api/timeline/gettimelineinfo/:id
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!browsingGroupId) return;
            try {
                const token = localStorage.getItem('timelineApp');
                const { data } = await axios({
                    method: 'GET',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/timeline/gettimelineinfo/${browsingGroupId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                });
                setGroup(data);
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
        };
        fetchGroup();
    }, [searchedGroupModal]);

    const handleClosing = () => {
        setSearchedGroupModal(false);
    };

    const handleFollowUnFollow = async () => {
        // The post request to /api/timeline/followtimelinebyuser/:id
        // The post request to /api/timeline/unfollowtimelinebyuser/:id

        // If the user is already following the group, then unfollow it
        // If the user is not following the group, then follow it

        dispatch(startLoading());
        if (group?.flag === 0) {
            try {
                const token = localStorage.getItem('timelineApp');
                await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/timeline/followtimelinebyuser/${browsingGroupId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => {
                        dispatch(
                            notifyAction({
                                open: true,
                                severity: 'success',
                                message:
                                    'You have successfully followed the group.',
                            })
                        );

                        // Close the modal
                        setSearchedGroupModal(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                dispatch(
                    notifyAction({
                        open: true,
                        severity: 'error',
                        message:
                            'It seems like there is a problem with the server. Please try again later.',
                    })
                );
            }
        } else {
            try {
                const token = localStorage.getItem('timelineApp');
                await axios({
                    method: 'POST',
                    url: `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/timeline/unfollowtimelinebyuser/${browsingGroupId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => {
                        dispatch(
                            notifyAction({
                                open: true,
                                type: 'success',
                                message:
                                    'You have successfully unfollowed the group.',
                            })
                        );

                        // Close the modal
                        setSearchedGroupModal(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                dispatch(
                    notifyAction({
                        open: true,
                        severity: 'error',
                        message:
                            'It seems like there is a problem with the server. Please try again later.',
                    })
                );
            }
        }

        // Update the groups in the home page using the setGroups function
        // Previous groups are stored in the groups state
        // The groups state is updated in the home page

        // If the user is following the group, then add the group to the groups state
        // If the user is not following the group, then remove the group from the groups state
        if (group?.flag === 0) {
            // Modify the group object for the groups state
            const modifiedGroup = {
                name: group?.timeline?.name,
                photoUrl: group?.timeline?.photoUrl,
                id: group?.timeline?._id,
            };

            setGroups([...groups, modifiedGroup]);
        } else {
            setGroups(groups.filter((grp) => grp.id !== group?.timeline?._id));
        }

        dispatch(stopLoading());
    };

    return (
        <>
            {searchedGroupModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-base-100 rounded-lg p-5 w-1/2">
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-2xl font-semibold">
                                {group?.timeline?.name}
                            </h1>
                            <button
                                className="btn btn-secondary btn-square btn-sm"
                                onClick={handleClosing}
                            >
                                <RxCross2 />
                            </button>
                        </div>

                        {/* Divider which says creation date */}
                        <div className="divider prose before:bg-accent after:bg-accent">
                            <p>
                                Created on &nbsp;
                                {new Date(
                                    group?.timeline?.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Group tags */}
                        <div className="flex flex-row flex-wrap mt-4 justify-start items-center">
                            {/* Label */}
                            <h1 className="text-lg font-semibold mr-2">
                                Tags:
                            </h1>
                            {group?.timeline?.tags.map((tag) => (
                                <span
                                    className="badge badge-accent mr-2"
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {/* Group Admins */}
                        <div className="flex flex-row flex-wrap mt-4 justify-start items-center">
                            {/* Label */}
                            <h1 className="text-lg font-semibold mr-2">
                                Admins:
                            </h1>
                            {group?.timeline?.admin.map((admin) => (
                                <p className="text-base mr-2" key={admin}>
                                    {admin}
                                </p>
                            ))}
                        </div>

                        {/* Group Photo */}
                        <img
                            // src={group?.timeline?.photoUrl}
                            src="https://picsum.photos/400"
                            alt="Group Photo"
                            className="w-full h-72 object-cover mt-4"
                        />

                        {/* Follow/ Unfollow Button */}
                        <div className="flex flex-row justify-end items-center mt-4">
                            <button
                                className="btn btn-accent"
                                onClick={handleFollowUnFollow}
                            >
                                {group?.flag ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
