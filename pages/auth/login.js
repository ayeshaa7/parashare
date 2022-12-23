import { FcGoogle } from "react-icons/fc";
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login(){

    const route = useRouter();
    const [user, loading] = useAuthState(auth); //takes user and loading function from the auth by firebase after user enters auth info


    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async() => {
        try {
            const result = await signInWithPopup(auth, googleProvider); //auth sets the user creditions of google log in for the firebase db and stores log in info in authentication in firebase, and provider redirects to google oauth
            route.push("/");
        } catch (error) {
            console.log(error)
        }
    }; 


    useEffect(() => {
        if(user){
            route.push("/")
        } else {
            console.log("Login")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    
    return (
        <div className = "shadow-xl m-32 p-10 rounded-lg">
            <h2 className = "text-2xl font-medium">Join ParaShare today!</h2>
            <div className = "py-4">
                <h1 className= "py-4">Stay informed about Paralympics</h1>
                <button onClick = {GoogleLogin}
                    className = "text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2">
                    <FcGoogle className = "text-2xl" />
                    Sign Up with Google
                </button>
                
            </div>
            
        </div>

    );
} 
