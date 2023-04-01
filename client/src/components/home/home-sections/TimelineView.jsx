import React from 'react';

// Icons
import { GoPlus } from 'react-icons/go';

export default function TimelineView() {
    return (
        <div className="bg-base-100 h-full rounded-box grid place-items-center prose relative">
            <h1>Timeline View</h1>

            {/* Add Group Button */}
            <div className="absolute bottom-0 right-0 p-4">
                <div
                    className="tooltip tooltip-left tooltip-secondary"
                    data-tip="Create a new Event"
                >
                    <button className="btn btn-square bg-primary border-0">
                        <GoPlus className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
