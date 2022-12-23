import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard () {
    const route = useRouter();
 
    const [user, loading] = useAuthState(auth);

    const [posts, setPosts] = useState([]);

    const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    });
    return unsubscribe;

    };
    
    useEffect(() => {
        getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading]
    );

    const deletePost = async(id) => {
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef);
    }

    return (
        <div className = "px-9 py-10">
            <h1>Your posts</h1>
            <div> {posts.map((post) => {
                return (
                <Message {...post} key = {post.id}>
                    <div className = "flex gap-6">
                        <button
                            onClick = {() => deletePost(post.id)}
                            className = "flex justify-center items-center gap-1 py-2 text-sm hover:text-cyan-600"> 
                            <BsTrash2Fill className = "text-xl"/> Delete
                        </button>
                        <Link href = {{pathname: "/post", query: post}}>
                        <button 
                            className = "flex justify-center items-center gap-1.5 py-2 text-sm hover:text-cyan-600"> 
                            <AiFillEdit className = "text-2xl"/> Edit
                        </button>
                        </Link>
                    </div>
                </Message>
                )
            })} 
            </div>
            <button className = "bg-cyan-500 hover:bg-cyan-700 py-2 px-4 my-2 rounded-full font-medium text-sm text-white" onClick = {()=>auth.signOut()}>Sign out</button>
        </div>
    );
}