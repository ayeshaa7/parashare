
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post () {

   const [post, setPost] = useState({description: ""}); //making an object to push it up to firebase to save it, using usestate to record change
   
   const [user, loading] = useAuthState(auth); //get user and loading

   const route = useRouter();

   const routeData = route.query;


    const submitPost = async(e) => {
        e.preventDefault();
        if (!post.description){
            toast.error("Post Field is Empty. 🙃", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            });
            return;
        }

        if (post.description.length > 300) {
            toast.error("Post exceeds character limit.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            });
            return;
        }

        if(post?.hasOwnProperty("id")){
            const docRef = doc(db, "posts", post.id);
            const updatedPost = {...post, timestamp: serverTimestamp()};
            await updateDoc(docRef, updatedPost);
            return route.push("/");
        } 
        else {
            const collectionRef = collection(db, 'posts'); //ref to the collection we wanna make, gets collection from firestore, searches db and for 'posts' collection
            await addDoc(collectionRef, { //for adding a document in collection 
                ...post, //all the description, title, any info on post from usestate
                timestamp: serverTimestamp(),
                user: user.uid,
                avatar: user.photoURL,
                username: user.displayName
            }); 
            setPost({description: ""});
            toast.success("Post created!", {position: toast.POSITION.TOP_CENTER, autoClose: 1500})
            route.push("/")
           };
        }

        //check user
        const checkUser = async() => {
            if (loading) return;
            if (!user) route.push("/auth/login");
            if (routeData.id) {
                setPost({description: routeData.description, id: routeData.id});
            }
        };

        useEffect(() => {
            checkUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [user, loading]);


   return (
       <div className = "my-10 p-12 shadow-lg rounded-lg max-w-md mx-auto">        
           <form onSubmit={submitPost}>
               <h1 className = "text-xl font-bold">{post.hasOwnProperty("id") ? "Edit your post": "Create a new post"}</h1>             
               <div className = "py-2">
                   <textarea 
                    value = {post.description}
                    onChange = {(e) => setPost({...post, description: e.target.value})}
                    className = "bg-gray-800 h-48 w-full text-white text-sm rounded-lg p-2 my-2">                   
                   </textarea>
                   <p className = {`text-black font-medium text-sm ${post.description.length > 300 ? "text-red-600" : ""}`}> 
                   {post.description.length}/300</p>
               </div>             
               <button 
               type = "submit"
               className = "bg-cyan-500 hover:bg-cyan-700 text-white text-m font-medium rounded-full p-2 my-2 w-full">Share
               </button>
           </form>
       </div>
   );
}