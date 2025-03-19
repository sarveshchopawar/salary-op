import { useParams } from "react-router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const DaySummary = () => {
    const { key } = useParams();
    const [summaryData, setSummaryData] = useState(JSON.parse(localStorage.getItem(key)));
    const removeShift = e => {
        let updateShift = [];
        summaryData.shift.forEach((shift, index) => {
            if (index != e.target.getAttribute("id")) {
                updateShift.push(shift);
            }
        });
        let updatePlace = [];
        summaryData.place.forEach((place, index) => {
            if (index != e.target.getAttribute("id")) {
                updatePlace.push(place);
            }
        });
        let updateData = {
            date: summaryData.date,
            shift: updateShift,
            place: updatePlace
        };
        localStorage.removeItem(key)
        updateData.shift.length && localStorage.setItem(key,JSON.stringify(updateData))
        toast.success(`Removed ${summaryData.shift[e.target.getAttribute("id")]} shift successfuly`, { autoClose: 1000 });
        setSummaryData(updateData)
    };
    return (
        <>
            <ToastContainer />
            <div className="my-6 px-4 bg-white">
                <h2 className="font-bold text-xl my-3 philosopher">Day Summary</h2>
                <div className="mb-3 font-medium">Date:- {key}</div>
                <table className="border-collapse w-full">
                    <thead className="text-sm">
                        <th className="text-left border border-gray-400 p-2">Shift</th>
                        <th className="text-left border border-gray-400 p-2">Place</th>
                        <th className="text-left border border-gray-400 p-2">Action</th>
                    </thead>
                    {summaryData != null &&
                        summaryData.shift.map((shift, index) => {
                            return (
                                <tbody className="text-sm">
                                    <td className="border border-gray-400 p-2">{shift}</td>
                                    <td className="border border-gray-400 p-2">{summaryData.place[index]}</td>
                                    <td onClick={removeShift} className="border border-gray-400 p-2 relative">
                                        <div id={index} className="absolute left-0 top-0 h-full w-full z-10"></div>
                                        <svg className="w-fit m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#121212" fill="#fc3d3d">
                                            <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </td>
                                </tbody>
                            );
                        })}
                </table>
            </div>
        </>
    );
};

export default DaySummary;