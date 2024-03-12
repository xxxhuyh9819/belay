import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/home.css';
import TopBar from "./topBar";
import ChannelDetails from "./channelDetails";

function Home({LoginCredentials}) {

    let selectedChannelID= Number(window.location.pathname.split('/')[2]);
    let selectedMessageID= Number(window.location.pathname.split('/')[4]);

    const api_key = localStorage.getItem("yunhaohu_belay_api_key")
    let username = localStorage.getItem("user_name");

    const navigate = useNavigate()
    const [channels, setChannels] = useState([])
    const [channelName, setChannelName] = useState("")
    const [selectedMessage, setSelectedMessage] = useState(0)

    const baseUrl = "http://127.0.0.1:5000"

    useEffect(() => {
        getChannels()
        handleSelectMessage(selectedMessageID)
        setInterval(()=>getChannels(), 1000);
    }, [selectedMessage]);

    function handleSelectMessage(id) {
        console.log("Message seen in Home; ", id)
        setSelectedMessage(id)
    }

    function getChannels() {
        fetch(baseUrl +'/api/channels', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(data => {
                setChannels(data)
            }).catch(error => console.log(error))
    }

    function handleCreateChannel(e) {
        e.preventDefault();
        if (channelName === "") {
            alert("Channel name can not be empty!")
            return;
        }
        let url = `/api/new_channel`
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            },
            body: JSON.stringify({
                api_key: api_key,
                channel_name: channelName,
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            if (data.code === 200) {
                setChannels([ // with a new array
                    ...channels, // that contains all the old items
                    data.channel // and one new item at the end
                ])
            }
            alert(data.msg);
            setChannelName("")
        }).catch(error => {
            console.error('Unknown error:', error);
        })
    }

    function handleSelectedChannel(e, channel) {
        e.preventDefault()
        navigate(`/channel/${channel.id}`)
    }

    return <div className="home">

        <TopBar LoginCredentials={LoginCredentials} username={username}/>

        <div className="main-content">
            {/*<ChannelDetails numOfChannels={totalChannels} selectedChannel={selectedChannel} />*/}
            <div className="channels-list">
                <div className="title_block">
                    <div className="title">
                        <h2>Channels</h2>
                        <button onClick={handleCreateChannel}>Create Channel</button>
                    </div>
                    <input type="text"
                           id="channel_name"
                           name="channel_name"
                           placeholder="Enter the new channel's name"
                           value={channelName}
                           onChange={(e) => {
                               console.log(channelName)
                               setChannelName(e.target.value)
                           }}
                           required/>
                </div>
                <ul>
                    {channels.map((data) => {
                        return (
                            <li
                                key={data.id}
                                onClick={(e) => handleSelectedChannel(e, data)}
                                className={data.id === selectedChannelID ? "selected": "other"}>
                                {<div className="channel-wrapper">
                                    <div>{`#${data.id}`}</div>
                                    <div>{data.name}</div>
                                </div>
                                }
                            </li>
                        )
                    })}
                </ul>

            </div>

            <ChannelDetails LoginCredentials={LoginCredentials} SelectedChannelId={selectedChannelID} SelectedMessage={handleSelectMessage}/>

        </div>


    </div>
}

export default Home