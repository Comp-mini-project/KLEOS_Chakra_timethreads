import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Icons
import { TbTimeline } from 'react-icons/tb';

// Components
import ProfilePopover from './ProfilePopover';

export default function Sidebar() {
    const sidebarButtons = [
        {
            tooltip: 'View my Timeline',
            icon: <TbTimeline size={30} />,
            handler: () => console.log('View my Timeline button clicked'),
        },
        {
            tooltip: 'Follow a new Timeline',
            icon: <IoMdAddCircle size={30} />,
            handler: () => console.log('Follow a new Timeline button clicked'),
        },
    ];

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
                <div>
                    {sidebarButtons.map((button, index) => (
                        <div
                            key={index}
                            className="tooltip tooltip-right tooltip-secondary"
                            data-tip={button.tooltip}
                        >
                            <button
                                className="btn btn-circle my-1"
                                onClick={button.handler}
                            >
                                {button.icon}
                            </button>
                        </div>
                    ))}
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
