import {React, useEffect, useState, Navigate} from "react";
import "./styles/home.css"
import {useNavigate} from "react-router-dom";


let currentChannelId= Number(window.location.pathname.split('/')[2]);


function ChannelDetails({LoginCredentials, SelectedChannelId, SelectedMessage}) {

    const navigate = useNavigate()

    const api_key = localStorage.getItem("yunhaohu_belay_api_key")

    const [channel, setChannel] = useState({});
    const [messages, setMessages] = useState([])
    const [replies, setReplies] = useState([])
    const [newChannelName, setNewChannelName] = useState("")
    const [showUpdateInput, setShowUpdateInput] = useState(false)
    const [showNewMessageInput, setNewMessageInput] = useState(false)
    const [replyContents, setReplyContents] = useState("")
    const [postContents, setPostContents] = useState("");

    const [selectedMsdId, setSelectedMsdId] = useState(0);


    useEffect(() => {
        getChannelById()

        // get messages every 500ms
        const interval = setInterval(() => {
            getMessagesByChannelId();
        }, 500);
        return () => clearInterval(interval);

    },[SelectedChannelId])


    function getChannelById() {
        fetch(`/api/channel?channel_id=${SelectedChannelId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        }).then(data => {
            if (data.code === 404 && (currentChannelId !== 0) && !isNaN(currentChannelId)) {
                // alert(data.msg)
                navigate("/404")
                currentChannelId = 0
                // eslint-disable-next-line no-throw-literal
                throw 'Page not found!'
            }
            setChannel(() => ({
                ...data
            }));
            getMessagesByChannelId()
        }).catch(error => {
            console.log(error)
        })
    }

    function getMessagesByChannelId() {
        if (SelectedChannelId === 0 || isNaN(SelectedChannelId)) return
        // console.log("check messages in channel #", SelectedChannelId)
        fetch(`/api/messages?channel_id=${SelectedChannelId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        }).then(data => {
            setMessages(() => ([
                ...data
            ]));

        }).catch(error => {
            console.log(error)
        })
    }

    function updateChannelName() {
        fetch('/api/update_channel_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            },
            body: JSON.stringify({
                api_key: api_key,
                channel_name: newChannelName,
                room_id: SelectedChannelId})
        })
            .then(response => {
                return response.json()})
            .then(data => {
               if (data.code === 200) {
                   setChannel({
                       ...channel,
                       name: newChannelName
                   })
                   alert(data.msg);
                   setNewChannelName("")
                   setShowUpdateInput(!showUpdateInput)
               } else {
                   if (data.code === 403) {
                       alert("You're not logged in! Navigating to login page...")
                       LoginCredentials(null)
                       throw 'No authentication!'
                   }
                   alert(data.msg);
               }

            })
            .catch(error => console.error('Error:', error));
    }


    function createPost() {
        if (postContents === "") {
            alert("Post can not be empty!")
            return;
        }

        fetch('/api/new_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            },
            body: JSON.stringify({
                api_key: api_key,
                post_contents: postContents,
                author_id: localStorage.getItem("user_id"),
                channel_id: SelectedChannelId})
        })
            .then(response => {
                return response.json()})
            .then(data => {
                if (data.code === 200) {
                    alert(data.msg);
                    // getMessagesByChannelId()
                    setPostContents("")
                    setNewMessageInput(!showNewMessageInput)
                } else {
                    if (data.code === 403) {
                        alert("You're not logged in! Navigating to login page...")
                        LoginCredentials(null)
                        throw 'No authentication!'

                    }
                    alert(data.msg);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function handleLeaveChannel(e) {
        e.preventDefault()
        if (window.confirm("Do you really want to leave the channel? Any unsaved changes will be discarded!")) {
            currentChannelId = 0
            setPostContents("")
            setNewChannelName("")
            setSelectedMsdId(0)
            navigate("/home")
        }
    }

    function createReply() {
        if (replyContents === "") {
            alert("Reply can not be empty!")
            return;
        }

        fetch('/api/new_reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            },
            body: JSON.stringify({
                api_key: api_key,
                reply_contents: replyContents,
                author_id: localStorage.getItem("user_id"),
                message_id: selectedMsdId})
        })
            .then(response => {
                return response.json()})
            .then(data => {
                if (data.code === 200) {
                    getMessageReplies(selectedMsdId)
                    setReplyContents("")
                } else {
                    if (data.code === 403) {
                        alert("You're not logged in! Navigating to login page...")
                        LoginCredentials(null)
                        throw 'No authentication!'
                    }
                    alert(data.msg);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function handleLeaveReply(e) {
        e.preventDefault()
        if (window.confirm("Do you really want to leave? Any unsaved changes will be discarded!")) {
            setSelectedMsdId(0);
            setReplyContents("")
            navigate(`/channel/${SelectedChannelId}`)
        }
    }

    function handleSelectedMsg(id) {
        // SelectedMessage(id)
        setSelectedMsdId(id)
        navigate(`/channel/${channel.id}/message/${id}`)
        getMessageReplies(id)
    }


    function getMessageReplies(id) {

        const api_key = localStorage.getItem("yunhaohu_belay_api_key")

        if (isNaN(id) || id === undefined) return

        fetch(`/api/replies?message_id=${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': api_key
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
            }).then(data => {
            setReplies(() => ([
                ...data.replies
            ]));
            console.log(data)

        }).catch(error => {
            console.log(error)
        })
    }



    return <>
        <div className="channel-messages" style={selectedMsdId === 0 ? {flex: 0.8} : {flex: 0.6}}>

            <div className="channel-details" >
                {isNaN(SelectedChannelId) ?
                    <h2>Click a channel button on the left to enter a channel!</h2> :
                    <div className="channel-info">
                        <div className="bar">
                            <div className="title-bar">
                                <h2>{`#${channel.name}`}</h2>
                                <button onClick={() => setShowUpdateInput(!showUpdateInput)}>{
                                    !showUpdateInput ? "Update Channel Name" : "Cancel Update"
                                }</button>
                                {showUpdateInput ? <div className="update-channel-form">
                                        <input type="text"
                                               placeholder="Enter new channel name"
                                               value={newChannelName}
                                               onChange={(e) => {
                                                   setNewChannelName(e.target.value)
                                               }}
                                               required/>
                                        <button onClick={updateChannelName}>Update</button>
                                    </div> :
                                    <></>
                                }
                            </div>
                            <button id="leave-channel-btn" onClick={handleLeaveChannel}>X</button>
                        </div>
                        <div className="title-bar">
                            <button onClick={() => setNewMessageInput(!showNewMessageInput)}>{
                                !showNewMessageInput ? "Create A New Post" : "Cancel"
                            }</button>

                            {showNewMessageInput ? <div className="update-channel-form">
                                    <input type="text"
                                           placeholder="Say something..."
                                           value={postContents}
                                           onChange={(e) => {
                                               setPostContents(e.target.value)
                                           }}
                                           required/>
                                    <button onClick={createPost}>Post</button>
                                </div> :
                                <></>
                            }

                        </div>
                        {messages.length === 0 ? <h2>No messages in the channel yet. Be the first one to speak!</h2> :
                            <ul className="messages-list">
                                {messages.map(msg => {
                                    return <li key={msg.id}> {
                                        <div className="message-wrapper"
                                             onClick={() => console.log("message id seen in details", msg.id)}>
                                            <div className="message-contents">
                                                <h3>{msg.author}</h3>
                                                <h4>{msg.body}</h4>
                                            </div>
                                            <button className="reply-btn" onClick={() => handleSelectedMsg(msg.id)}>
                                                Reply
                                            </button>
                                        </div>
                                    }</li>
                                })}
                            </ul>}
                    </div>
                }
            </div>
        </div>

        {selectedMsdId === 0 ? <></> : <div className="message-replies">
            <div className="bar">
                <h1>Replies</h1>
                <button id="leave-channel-btn" onClick={handleLeaveReply}>X</button>
            </div>

            <div className="reply-form">
                <input type="text"
                       placeholder="Reply to this post..."
                       value={replyContents}
                       onChange={(e) => {
                           setReplyContents(e.target.value)
                       }}
                       required/>
                <button onClick={createReply}>Reply</button>
            </div>

            {replies.length === 0 ? <h2>No replies to the message yet. Be the first one to speak!</h2> :
                <ul className="messages-list">
                    {replies.map(reply => {
                        return <li key={reply.id}> {
                            <div className="message-wrapper">
                                <div className="message-contents">
                                    <h3>{reply.name}</h3>
                                    <h4>{reply.body}</h4>
                                </div>
                            </div>
                        }</li>
                    })}
                </ul>}

        </div>}
    </>


}

export default ChannelDetails