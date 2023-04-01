import React, { useState, useEffect } from 'react';
import { IoMdCreate } from 'react-icons/io';

export default function Event({ event, index }) {
    const [dayNum, setDayNum] = useState(0);

    const [flexDirection, setFlexDirection] = useState(
        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
    );

    useEffect(() => {
        setDayNum(new Date(event.timestamp).getDate());
    }, []);

    return (
        // Parent div
        <div
            className={`flex ${flexDirection} h-60 justify-start items-center`}
        >
            {/* Empty component to fill space */}
            <div className="flex flex-col flex-1 h-full" />

            {/* The Date Circle with TimelineTrunk */}
            <div className="flex flex-col w-24 h-full grid place-items-center relative">
                {/* Create a thin box */}
                <div className="w-2 h-full bg-secondary" />

                {/* Create a circle */}
                <div className="w-12 h-12 bg-secondary rounded-full grid place-items-center absolute top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl font-semibold text-white">
                        {dayNum}
                    </span>
                </div>
            </div>

            {/* Event Card */}
            <div className="flex flex-col flex-1 h-full justify-center">
                {/* DaisyUI Card */}
                <div className="card bg-accent">
                    <div className="card-body">
                        <div className="card-title">
                            <h1 className="text-2xl font-semibold">
                                {event.name}
                            </h1>
                        </div>
                        <div className="card-content">
                            <p>{event.summary}</p>

                            {/* Tags using badges */}
                            <div className="flex flex-row flex-wrap mt-2 justify-start items-center">
                                {/* Label */}
                                <h1 className="text-lg font-semibold mr-2">
                                    Tags:
                                </h1>
                                {event.tags.map((tag) => (
                                    <span
                                        className="badge badge-neutral mr-2"
                                        key={tag}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
