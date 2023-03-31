import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Icons
import { IoMdAddCircle } from 'react-icons/io';
import { TbTimeline } from 'react-icons/tb';

// Components
import ProfilePopover from './ProfilePopover';

export default function Sidebar() {
    const user = useSelector((state) => state.user.userObj);

    const handleLogoClick = () => {
        // Go to Manas's Github
        window.open('https://github.com/manastelavane', '_blank');
    };

    return (
        <div className="flex container w-14 bg-neutral h-full flex flex-col justify-between p-1 items-center">
            {/* sidebar-top */}
            <div className="flex flex-col justfy-center items-center mt-1">
                {/* Logo */}
                <img
                    className="mask mask-squircle"
                    src="../../src/assets/logo.svg"
                    alt="logo"
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={handleLogoClick}
                />
                <div className="divider m-1 before:bg-primary after:bg-primary"></div>

                {/* Other buttons */}
                <div
                    className="tooltip tooltip-right tooltip-secondary"
                    data-tip="View my Timeline"
                >
                    <button className="btn btn-circle my-1">
                        <TbTimeline size={30} />
                    </button>
                </div>

                <div
                    className="tooltip tooltip-right tooltip-secondary"
                    data-tip="Follow a new Timeline"
                >
                    <button className="btn btn-circle my-1">
                        <IoMdAddCircle size={30} />
                    </button>
                </div>
                {/* End Other buttons */}
            </div>

            {/* Show user info */}
            <div className="dropdown dropdown-end dropdown-right">
                {/* User Profile and Settings */}
                <label tabIndex={0}>
                    <button className="btn btn-circle my-1">
                        <div className="avatar placeholder">
                            <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {user?.photoUrl ? (
                                    <img
                                        src={user.photoUrl}
                                        alt={user.displayName}
                                    />
                                ) : (
                                    <span className="text-xl font-bold">
                                        {user?.displayName?.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                </label>
                <div tabIndex={0} className="dropdown-content">
                    <ProfilePopover />
                </div>
            </div>
        </div>
    );
}
