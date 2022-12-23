import Head from 'next/head'
import Message from "../components/message";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase"
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import Link from "next/link";

export default function Home() {


  const [ allPosts, setAllPosts ] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))));
    return unsubscribe;
  };


  useEffect(()=>{
    getPosts();
  }, [])

  return (

    <div>
      <Head>
        <title>ParaShare</title>
        <meta name="ParaShare" content="ParaShare" />
        <link rel="" href="/" />
      </Head>

      <div className = "px-9 py-10 text-lg font-medium">
        <h2>See what athletes are talking about!</h2>
 
        {allPosts.map((post) => (
          
          <Message {...post} key = {post.id} >
            <div className = "flex items-center gap-5">
            <Link href = {{pathname: `/${post.id}`, query: {...post}}} className = "flex justify-center items-center gap-1 py-2 text-sm hover:text-cyan-600">
              <button>
                {post.comments?.length > 0 ? post.comments?.length : 0} {post.comments?.length == 1 ? "Reply" : "Replies"}
              </button>
            </Link>
            <Link href = " " className = "flex justify-center items-center gap-1 py-2 text-sm hover:text-cyan-600">
              <button>
                Like               
              </button>           
            </Link>
            </div>
          </Message>
        ))}

    </div>
  </div>

  );
}
