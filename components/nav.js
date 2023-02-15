import Link from "next/link";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav(){
    
    const [user, loading] = useAuthState(auth);
 
    return (

        <nav className = "flex justify-between items-center py-3 px-10 bg-gray-800">         
            
            <Link href= "/">
                <button className= "text-lg font-medium text-white">ParaShare</button>
            </Link>          
            
            <ul className = "flex items-center gap-10">                
                {!user && (
                    <Link href = "/auth/login">
                        <button className= "py-2 px-4 text-sm bg-cyan-500 text-white rounded-full font-medium ml-8">Join Now</button>
                    </Link> ) }
              
                {user && (
                    <div className ="flex items-center gap-6">
                        <Link href = "/post"> 
                            <button className = "font-medium bg-cyan-500 hover:bg-sky-700  py-2 px-4 rounded-full text-sm text-white">Post</button>
                        </Link>
                    
                        <Link href = "/dashboard">
                        <img className = "w-12 rounded-full cursor-pointer" 
                        src = {user.photoURL} alt = "" />
                        </Link>              
                    </div> )}
            </ul>
        </nav>
    );
}
