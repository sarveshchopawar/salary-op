import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router";

const Home = () => {
    const [placesData, setPlacesData] = useState(JSON.parse(localStorage.getItem("places")));
    const monthlySalary = 216.67;
    const dayStr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthStr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [time, setTime] = useState(new Date());
    let year = time.getFullYear();
    let month = time.getMonth();
    let date = time.getDate();
    const todayDate = () => {
        let preYear = new Date().getFullYear().toString();
        let preMonth = (new Date().getMonth() + 1).toString();
        let preDate = new Date().getDate().toString();
        preMonth < 10 && (preMonth = "0" + preMonth);
        preDate < 10 && (preDate = "0" + preDate);
        return preYear + "-" + preMonth + "-" + preDate;
    };

    const attenData = (year, month, date) => {
        let mStr = month + 1 < 10 ? "0" + (month + 1) : month + 1;
        let dStr = date < 10 ? "0" + date : date;
        let res = localStorage.getItem(year + "-" + mStr + "-" + dStr);
        let item = JSON.parse(res);
        return item != null ? item.place : year + "-" + mStr + "-" + dStr == todayDate() ? ["Not Marked"] : ["Absent"];
    };

    const daysArr = () => {
        let dArr = [];
        for (let i = date; i >= 1; i--) {
            dArr.push(i);
        }
        return dArr;
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            date: todayDate()
        }
    });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const [absents, setAbsents] = useState(0);
    const [presents, setPresents] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);
    const [advance, setAdvance] = useState(0);
    const [total, setTotal] = useState(0);

    const summary = () => {
        let absent = 0,
            present = 0;
        document.querySelectorAll(".dayPresenty").forEach(async item => {
            if (item.innerText == "Absent") {
                absent += 1;
                setAbsents(absent);
            } else if (item.innerText == "Not Marked") {
            } else {
                present += 1;
                setPresents(present);
            }
        });
        let earning = 0;
        document.querySelectorAll(".daySummary").forEach(place => {
            if (place.innerHTML != "Absent" && place.innerHTML != "Not Marked") {
                let filterPlace = placesData.filter(a => a.placeName.trim() == place.innerHTML.trim())[0];
                if (!filterPlace) {
                    toast.error("Can't calculate earning", { autoClose: 2000 });
                    setTimeout(() => {
                        toast.warn("Some place data are missing!", { autoClose: 2000 });
                    }, 2000);
                } else {
                    earning += parseFloat(filterPlace.placeAmount);
                    setTotalEarning(earning.toFixed(2));
                }
            }
        });
        let totalAmount = totalEarning - advance;
        setTotal(totalAmount.toFixed(2));
    };
    useEffect(() => {
        summary();
    }, [document.querySelectorAll(".daySummary")]);
    useEffect(() => {
        let advance = JSON.parse(localStorage.getItem("advance"));
        if (advance) {
            let advanceOfMonth = advance.filter(d => {
                return d.date.includes(todayDate().slice(0, 7));
            });
            let totalAdvance = 0;
            advanceOfMonth.forEach(item => {
                totalAdvance += parseFloat(item.advanceAmount);
            });
            setAdvance(totalAdvance.toFixed(2));
        }
    }, []);

    const onSubmit = data => {
        if (localStorage.getItem(data.date)) {
            let preData = JSON.parse(localStorage.getItem(data.date));
            if (preData.shift.includes(data.shift)) {
                toast.error("Already Marked!", { autoClose: 1000 });
            } else {
                let updateData = {
                    date: preData.date,
                    shift: data.shift === "Day" ? [data.shift, ...preData.shift] : [...preData.shift, data.shift],
                    place: data.shift === "Day" ? [data.place, ...preData.place] : [...preData.place, data.place]
                };
                localStorage.setItem(data.date, JSON.stringify(updateData));
                toast.success("Marked Successfuly!", { autoClose: 1000 });
            }
        } else {
            let dataModel = {
                date: data.date,
                shift: [data.shift],
                place: [data.place]
            };
            localStorage.setItem(data.date, JSON.stringify(dataModel));
            toast.success("Marked Successfuly!", { autoClose: 1000 });
        }
    };
    const getKey = (year, month, date) => {
        let mStr = month + 1 < 10 ? "0" + (month + 1) : month + 1;
        let dStr = date < 10 ? "0" + date : date;
        return year + "-" + mStr + "-" + dStr;
    };
    const previousMonth = async () => {
        let preYer = year;
        let preMon = month < 10 ? "0" + month : month;
        if (preMon == 0) {
            preYer = year - 1;
            preMon = "12";
        }
        if (new Date().getMonth() + 1 == preMon && new Date().getFullYear() == preYer) {
            setTime(new Date());
        } else {
            let preMonDays = new Date(year, preMon, 0).getDate();
            await setTime(new Date(`${preYer}-${preMon}-${preMonDays}`));
            setTotalEarning(0);
            setTotal(0);
            setPresents(0);
        }
    };
    const nextMonth = async () => {
        let nexMon = month + 2 < 10 ? "0" + (month + 2) : month + 2;
        let nexYer = year;
        if (nexMon > 12) {
            nexYer = year + 1;
            nexMon = "01";
        }
        console.log(year);
        if (new Date().getMonth() + 1 == nexMon && new Date().getFullYear() == nexYer) {
            setTime(new Date());
        } else {
            let nexMonDays = new Date(nexYer, nexMon, 0).getDate();
            await setTime(new Date(`${nexYer}-${nexMon}-${nexMonDays}`));
            setTotalEarning(0);
            setTotal(0);
            setPresents(0);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="my-6 px-4 bg-white">
                <h2 className="font-bold text-xl my-3 philosopher">Mark Attendence</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full my-2 flex flex-col gap-y-4">
                    <div className="flex items-center relative w-1/2">
                        <input type="date" {...register("date", { required: true })} className={`block w-full appearance-none rounded-full bg-white pl-2 pr-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6 ${errors.date != undefined && "focus:outline-red-500"}`} />
                        <svg className="absolute right-3 pointer-events-none size-5 text-gray-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center relative col-start-1 col-end-2">
                            <select {...register("shift")} className="block w-full appearance-none rounded-full bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6">
                                <option value="Day">Day</option>
                                <option value="Night">Night</option>
                                <option value="OT">OT</option>
                            </select>
                            <svg className="absolute right-3 pointer-events-none size-5 text-gray-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex items-center relative col-start-2 col-end-4">
                            <select {...register("place")} className="block w-full appearance-none rounded-full bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-500 sm:text-sm/6">
                                {placesData != null && placesData.map(place => <option value={place.placeName}>{place.placeName}</option>)}
                            </select>
                            <svg className="absolute right-3 pointer-events-none size-5 text-gray-500" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button disabled={isSubmitting} type="submit" className={`${isSubmitting != false && "bg-neutral-500"} w-full bg-green-500 rounded-full text-white py-2 px-3 hover:bg-green-600`}>
                            Punch In
                        </button>
                    </div>
                </form>
            </div>
            <div id="monthSumm" className="px-4 py-3 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <span onClick={previousMonth}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                            <path d="M17 4L8.66943 10.0405C6.44352 11.6545 6.44353 12.3455 8.66943 13.9595L17 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <div className="text-lg font-medium">{monthStr[month] + ", " + year.toString().slice(2)}</div>
                    <span onClick={nextMonth} disabled={month == new Date().getMonth()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                            <path d="M7 4L15.3306 10.0405C17.5565 11.6545 17.5565 12.3455 15.3306 13.9595L7 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="grid grid-cols-3 gap-0.5">
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Days</div>
                            <div className="text-lg font-medium">{daysInMonth}</div>
                        </div>
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Present</div>
                            <div id="monthSumm_Present" className="text-lg font-medium">
                                {presents}
                            </div>
                        </div>
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Absent</div>
                            <div id="monthSumm_Absent" className="text-lg font-medium">
                                {absents}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-0.5">
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Earning</div>
                            <div id="monthSumm_TotalEarning" className="text-lg font-medium">
                                {totalEarning}
                            </div>
                        </div>
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Advance</div>
                            <div id="monthSumm_Advance" className="text-lg font-medium">
                                {advance}
                            </div>
                        </div>
                        <div className="bg-neutral-200 rounded-sm px-2">
                            <div className="text-sm">Total</div>
                            <div id="monthSumm_Total" className="text-lg font-medium">
                                {total}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-6 p-4 bg-white mb-20">
                <h2 className="font-medium text-lg mb-4">Attendence</h2>
                <div className="border-b border-gray-400 flex items-center justify-between">
                    <div className="">Date</div>
                    <div className="">Marks</div>
                </div>
                <div id="dates">
                    {daysArr().map(printDate => (
                        <Link to={`/daysummary/${getKey(year, month, printDate)}`}>
                            <div className="flex items-center justify-between border-b border-gray-400 py-1">
                                <div className="text-neutral-600 text-sm w-24 py-1">
                                    <div>{printDate + " " + monthStr[month]}</div>
                                    <div>{dayStr[new Date(year, month, printDate).getDay()]}</div>
                                </div>
                                <div className="notFirstStyle dayPresenty">
                                    {attenData(year, month, printDate).map(printPlace => (
                                        <span className="daySummary px-2 text-sm text-neutral-700">{printPlace}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
