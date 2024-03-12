import { useNavigate} from 'react-router-dom';
import React, {useState} from "react";


function PageNotFound({LoginCredentials}) {

    const navigate = useNavigate()

    function handleRoute(e) {
        e.preventDefault()
        console.log("hitting")
        if (localStorage.getItem("yunhaohu_belay_api_key") !== null) {
            LoginCredentials(localStorage.getItem("yunhaohu_belay_api_key"))
            navigate('/')
        } else {
            LoginCredentials(null)
            alert("You're not logged in! Navigating to login page...")
            navigate('/login')
        }
    }

    return <div className="notFound">
        <div className="header">
            <h2><a>Belay - 404</a></h2>
            <div className="message">
                <h2>Oops, we can't find that page!</h2>
                <button onClick={(e) => handleRoute(e)}>Let's go home and try again.</button>
            </div>
        </div>
    </div>

}

export default PageNotFound