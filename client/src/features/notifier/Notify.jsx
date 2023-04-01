import React, { useEffect, useState, } from 'react';
import { useSelector, useDispatch } from 'react-redux';


// Icons
import { RxCross1 } from 'react-icons/rx';

// Actions
import { notifyAction } from './notifySlice';

export default function Notify() {

    

    const dispatch = useDispatch();

    const [notification, setNotification] = useState({
        open: false,
        severity: 'info',
        message: '',
    });

    const notify = useSelector((state) => state.notify);

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') return;
        dispatch(notifyAction({ open: false }));

        setNotification({
            open: false,
            severity: 'info',
            message: '',
        });
    };

    useEffect(() => {
        if (notify.open) {
            setNotification({
                open: notify.open,
                severity: notify.severity,
                message: notify.message,
            });
        }

        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [notify]);

    return (
        <div className={`${notification.open ? 'block' : 'hidden'} fixed z-50`}>
            <div className="toast">
                <div className={`alert alert-${notification.severity}`}>
                    <div>
                        <span>{notification.message}</span>
                    </div>
                    <button
                        className="btn btn-square btn-outline btn-xs"
                        onClick={() => handleClose()}
                    >
                        <RxCross1 />
                    </button>
                </div>
            </div>
        </div>
    );
}
