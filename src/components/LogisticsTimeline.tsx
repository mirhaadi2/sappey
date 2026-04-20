import React from "react";
import { CheckFat } from "@phosphor-icons/react";

/**
 * Interface for timeline steps including logistics metadata
 */
interface TimelineStep {
    status: string;
    label: string;
    icon: React.ElementType;
    isCompleted: boolean;
    isActive: boolean;
    isUpcoming: boolean;
    timestamp?: string; // Optional: To show actual time of status change
}

interface LogisticsTimelineProps {
    timelineData: TimelineStep[];
}

const LogisticsTimeline: React.FC<LogisticsTimelineProps> = ({ timelineData }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Logistics Progression
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Live Tracking
                </span>
            </div>

            <div className="relative flex flex-col">
                {/* Background Vertical Line 
                   Positioned at 15px to center exactly behind the 32px (w-8) icons 
                */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-50" />

                {timelineData.map((step, idx) => (
                    <div key={step.status} className="relative flex items-start gap-5 pb-10 last:pb-0 group">
                        
                        {/* Icon and Progress Connector */}
                        <div className="relative z-10 flex flex-col items-center">
                            {/* The Emerald Fill Line: Only shows between completed steps */}
                            {step.isCompleted && idx !== timelineData.length - 1 && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-8 h-full w-[2px] bg-emerald-500" />
                            )}
                            
                            {/* Icon Container with Dynamic Styling */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 border-2 
                                ${step.isCompleted 
                                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" 
                                    : step.isActive 
                                        ? "bg-white border-emerald-500 text-emerald-500 ring-4 ring-emerald-50" 
                                        : "bg-white border-slate-100 text-slate-200"}`}
                            >
                                {step.isCompleted ? (
                                    <CheckFat size={14} weight="fill" />
                                ) : (
                                    <step.icon size={16} weight={step.isActive ? "bold" : "regular"} />
                                )}
                            </div>
                        </div>

                        {/* Label and Status Details */}
                        <div className="flex flex-col gap-1 -mt-0.5">
                            <div className="flex flex-col">
                                <p className={`text-sm font-black tracking-tight leading-none ${
                                    step.isUpcoming ? "text-slate-300" : "text-slate-900"
                                }`}>
                                    {step.label.replace(/_/g, ' ')}
                                </p>
                                
                                {/* Placeholder for real logistics timestamps */}
                                {step.timestamp && (
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                                        {step.timestamp}
                                    </p>
                                )}
                            </div>

                            {/* Active Status Pulse Indicator */}
                            {step.isActive && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                        Current Station
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogisticsTimeline;