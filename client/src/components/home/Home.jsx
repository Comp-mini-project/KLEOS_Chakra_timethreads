import React from 'react';

// Components
import Sidebar from './Sidebar';
import GroupList from './home-sections/GroupList';
import TimelineView from './home-sections/TimelineView';
import SuperPanel from './home-sections/SuperPanel';

export default function Home() {
    return (
        // Parent div is flex container
        <div className="flex flex-row bg-neutral h-screen w-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* User Timeline */}
            <div className="flex flex-row w-full">
                <div className="grow h-full p-1">
                    <GroupList />
                </div>
                <div className="grow h-full p-1">
                    <TimelineView />
                </div>
                <div className="grow h-full p-1">
                    <SuperPanel />
                </div>
            </div>
        </div>
    );
}
