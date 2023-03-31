import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Icons
import { FaSignOutAlt } from 'react-icons/fa';

// Components
import ThemeSwticher from '../ThemeSwticher';

//Actions
import { signOut } from '../../features/user/userSlice';

export default function ProfilePopover() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.userObj);

    const username = user?.email?.split('@')[0];

    const handleSignOut = () => {
        dispatch(signOut());
        navigate('/');
    };

    return (
        <div
            tabIndex={0}
            className="card compact dropdown-content shadow bg-base-100 rounded-box w-64 border border-accent"
        >
            <div className="card-body">
                <h2 className="card-title ">
                    {user?.photoUrl ? (
                        <img
                            src={user.photoUrl}
                            alt={user.displayName}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                            }}
                        />
                    ) : (
                        <span className="text-xl font-bold">
                            {user?.displayName?.charAt(0)}
                        </span>
                    )}
                    {user && (
                        <div>
                            <strong>{user.displayName}</strong>
                        </div>
                    )}
                </h2>
                <div className="prose">
                    <h4>{username}</h4>
                    <div className="divider m-0 before:bg-primary after:bg-primary"></div>
                    <h4 className="m-2">Choose your theme: </h4>
                    <ThemeSwticher />
                </div>

                <button
                    className="btn btn-primary mt-2"
                    onClick={handleSignOut}
                >
                    Sign Out
                    <FaSignOutAlt className="inline-block ml-4" size={25} />
                </button>
            </div>
        </div>
    );
}
