import { memo, useState, useEffect } from "react";

const Navbar = () => {
    const [ showLocalData,setShowLocalData] = useState(0)
    const localData = () => {
        let _lsTotal = 0,
            _xLen,
            _x;
        for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x)) {
                continue;
            }
            _xLen = (localStorage[_x].length + _x.length) * 2;
            _lsTotal += _xLen
        }
        setShowLocalData((_lsTotal / 1024).toFixed(2) + " KB");
    };
    useEffect(() => {
        localData()
    }, [])
    
    return (
        <nav className="h-14 w-full bg-slate-950 flex items-center justify-between px-4 shadow">
            <div className="text-white font-bold text-xl philosopher">
                <span className="text-green-500">&lt;</span>
                <span>Salary</span>
                <span className="text-green-500">Op/&gt;</span>
            </div>
            <div className="text-white">{showLocalData}</div>
        </nav>
    );
};

export default memo(Navbar);
