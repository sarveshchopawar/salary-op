import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

const Advance = () => {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const todayDate = () => {
        let preYear = new Date().getFullYear().toString();
        let preMonth = (new Date().getMonth() + 1).toString();
        let preDate = new Date().getDate().toString();
        preMonth < 10 && (preMonth = "0" + preMonth);
        preDate < 10 && (preDate = "0" + preDate);
        return preYear + "-" + preMonth + "-" + preDate;
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful }
    } = useForm({
        defaultValues: {
            date: todayDate()
        }
    });
    const [advanceData, setAdvanceData] = useState(JSON.parse(localStorage.getItem("advance")));
    const onSubmit = data => {
        if (localStorage.getItem("advance")) {
            let preData = JSON.parse(localStorage.getItem("advance"));
            localStorage.setItem("advance", JSON.stringify([...preData, data]));
        } else {
            localStorage.setItem("advance", JSON.stringify([data]));
        }
        setAdvanceData(JSON.parse(localStorage.getItem("advance")));
        toast.success('Add Successfuly!', {autoClose: 1000});
        reset();
    };
    const removeAdvance =(e)=>{
        let updateArr = advanceData.filter((d)=>{
            return d != advanceData.toReversed()[e.target.getAttribute("id")]
        })
        setAdvanceData(updateArr)
        localStorage.setItem("advance",JSON.stringify(updateArr))
        toast.success('Removed Successfuly!', {autoClose: 1000});
    }
    return (
        <>
        <ToastContainer/>
            <div className="my-6 px-4 bg-white">
                <h2 className="font-bold text-xl my-3 philosopher">Add Advance</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full my-2 flex flex-col gap-y-4">
                    <div className="flex gap-2">
                        <div className="flex items-center">
                            <input disabled type="date" {...register("date", { required: true })} className={`block w-full appearance-none rounded-full bg-white px-2 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6 ${errors.date != undefined && "focus:outline-red-500"}`} />
                        </div>
                        <div className="flex items-center">
                            <input type="number" {...register("advanceAmount", { required: true })} className={`block w-full appearance-none rounded-full bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6 ${errors.advanceAmount != undefined && "focus:outline-red-500"}`} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button disabled={isSubmitting} type="submit" className={`${isSubmitting != false && "bg-neutral-500"} w-full bg-green-500 rounded-full text-white py-2 px-3 hover:bg-green-600`}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div className="my-6 p-4 bg-white mb-20">
                <h2 className="font-medium text-lg mb-4">Advance</h2>
                <table className="border-collapse w-full">
                    <thead className="text-sm">
                        <th className="text-left border border-gray-400 p-2">Date</th>
                        <th className="text-left border border-gray-400 p-2">Name</th>
                        <th className="text-left border border-gray-400 p-2">Amount</th>
                        <th className="text-left border border-gray-400 p-2">Action</th>
                    </thead>
                    {advanceData != null &&
                        advanceData.toReversed().map((adv,index) => {
                            return (
                                <tbody className="text-sm">
                                    <td className="border border-gray-400 p-2">{adv.date}</td>
                                    <td className="border border-gray-400 p-2">User Self</td>
                                    <td className="border border-gray-400 p-2">{adv.advanceAmount}</td>
                                    <td onClick={removeAdvance} className="border border-gray-400 p-2 relative">
                                            <div id={index} className="absolute left-0 top-0 h-full w-full z-10"></div>
                                            <svg className="w-fit m-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#121212" fill="#fc3d3d">
                                                <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
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

export default Advance;
