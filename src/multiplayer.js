import openSocket from "socket.io-client";

import React from "react";

import speak from "./Voice";
import NotificationView from "./components/NotificationsView";

var dispatch = null;
var roomId = null;

const update = (up) => {
    dispatch({
        type: "UPDATE_MULTIPLAYER",
        payload: up
    });
    roomId = up.roomId || roomId || null;
};

window.action = (type, payload) => {
    window.io.emit("action", { type, payload });
};

export const init = (_dispatch) => {
    dispatch = _dispatch;
    window.onConnected = [];
    window.io = openSocket("ws://10.0.0.23:12988/");
    
    window.io.on("connected", () => {
        update({
            connected: true,
            roomId: null,
            players: [],
            id: window.io.id
        });

        if (window.onConnected) {
            for (var x of window.onConnected) {
                x();
            }
        }
    });

    window.io.on("disconnect", () => {
        update({connected: false});
    });

    window.io.on("room", function(data) {
        update({roomId: data});
        location.href = "#" + data;
    });

    window.io.on("join_error", function(data) {
        if (window.onJoinError) {
            window.onJoinError(data);
        }
    });

    window.io.on("state", function(data) {
        console.log("state update ", data);
        update(data);
    });

    window.io.on("kick", function() {
        leaveRoom();
        window.Modal.open((
            <div>
                <center>
                    <h1>You have been kicked by the host</h1>
                </center>
                <button className="ui button" 
                    style={{ backgroundColor: "#ac6635", position: "absolute", bottom: "20px", right: "20px" }}
                    onClick={() => Modal.close()}>
                    Oof
                </button>
            </div>
        ))
    });

    window.io.on("speak", function(data) {
        speak(data);
    });

    window.io.on("seer_result", function(data) {
        let _nightAction = nightAction;
        Modal.open(
            <center>
                <h3>
                    You sense that your target is...
                </h3>
                <div style={{display: "block", height: "100%"}}>&nbsp;</div>
                <h1>
                    { data.seer_result == "GOOD" ? "Good" : "Evil" }
                </h1>
                <button className="ui button" 
                    style={{ backgroundColor: "#ac6635", position: "absolute", bottom: "20px", right: "20px" }}
                    onClick={() => {
                        window.Modal.close();
                        _nightAction(true);
                    }}>
                    Ok
                </button>
            </center>
        )
    });

    window.io.on("open_messages", function(data) {
        window.Modal.open(
            <div>
                <NotificationView messages={data}/>
                <button className="ui button" 
                    style={{ backgroundColor: "#ac6635", position: "absolute", bottom: "20px", right: "20px" }}
                    onClick={() => {
                        window.Modal.close();
                    }}>
                    Ok
                </button>
            </div>
        );
    });

    // This code is **most probably** error prone! Please be cautious with it, future me...
    window.onhashchange = function() {
        if (location.hash != "#" + roomId) {
            leaveRoom();
        }
    }
};

export const createRoom = () => {
    window.io.emit("create");
};

export const joinRoom = (roomId) => {
    window.io.emit("join", roomId);
};

export const leaveRoom = () => {
    window.io.emit("leave");
    location.href = "#";
    update({roomId: null});
};

export const setDetails = (details) => {
    window.io.emit("details", details);
};

export const startGame = () => {
    action("start_game");
};

export const kick = (player) => {
    action("kick", player);
};

export const nightAction = (payload) => {
    action("night_action", payload);
};

export const setVote = (player) => {
    action("set_vote", player);
};

export const trialGuilty = () => {
    action("trial_guilty");
};

export const trialInnocent = () => {
    action("trial_innocent");
};
