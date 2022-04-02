import React, { useEffect, useState } from 'react';
import _ from 'lodash';

export default function Solar(props) {
    const [data, setData] = useState({ currentPower: 0.5});
    useEffect(() => {
        const fetchData = async () => {
            await fetch("/electricity/current").then((response ) => {
                if(response.status == 200) {
                    const jsonResult = response.json();
                    setData({ currentPower: jsonResult.PowerW });
                } else {
                    setData({ currentPower: 0 });
                }
            }).catch((error) => {
                console.log(error);
                setData({ currentPower: 0 });
            });
        }
        const id = setInterval(() => {
            fetchData()
        }, 60*1000)
        fetchData();
        return () => clearInterval(id);
    }, []);

    return (
        <div className="solarBar">
            <img id="solarIcon" src="/img/1.svg" />
            <div id="powerRow">
                <span className="powerNow" style={{width: _.round(data.currentPower / 5.1 * 100) + "%"}} />
                <span className="powerCapacity" style={{width: _.round((1-data.currentPower / 5.1 )*100) + "%"}}/>
            </div>
            <span className="powerW">
                {data.currentPower} kW
            </span>
        </div>
        );
}
