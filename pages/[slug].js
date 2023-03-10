/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { routeData } from "./post"
import { arrayUnion, updateDoc, getDoc, doc, docSnap, Timestamp, onSnapshot } from "firebase/firestore";  
 
export default function Details(){
    const router = useRouter();
    const routeData = router.query;

    const [ message, setMessage ] = useState("");
    const [ allMessages, setAllMessages ] = useState([]);

    const submitMessage = async() => {
        if (!auth.currentUser) return router.push("/auth/login");
        if (!message){
            toast.error("Empty field.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500 
            });
            return;
        }
    const docRef = doc(db, "posts", routeData.id)
    await updateDoc(docRef, {
        comments: arrayUnion({
            message,
            avatar: auth.currentUser.photoURL,
            userName: auth.currentUser.displayName,
            time: Timestamp.now()
        }),
    })
    setMessage("");
    }  

    const getComments = async() => {
        const docRef = doc(db, "posts", routeData.id);
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setAllMessages(snapshot.data().comments);
        })
    return unsubscribe
    };

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    return (
        <div>
            <Message {...routeData}></Message> 
            <div className = "my-4">
                <div className = "flex">
                    <input 
                        onChange = {(e) => setMessage(e.target.value)}
                        type = "text" value = {message} placeholder = "Write a comment"
                        className = "bg-white p-2 text-black text-sm w-full rounded-l-lg" 
                    />
                    <button onClick = {submitMessage} className = "bg-sky-600 text-white text-sm py-2 px-2 rounded-r-lg">Submit</button>
                </div>

                <div className = "py-6">
                    <h2 className = "font-bold">Comments</h2>
                    {allMessages?.map((message) => (
                        <div className = "bg-white p-4 my-4 border-2" key = {message.time}>
                            <div className = "flex items-center gap-2 mb-4">
                                <img className = "w-10 rounded-full" src = {message.avatar} alt = "" /> 
                                <h2>{message.userName}</h2>
                            </div>
                            <h2>{message.message}</h2>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>
    );
};
