/* eslint-disable @next/next/no-img-element */
 
export default function Message ({ children, avatar, username, description }) {
    return (
        <div className = "bg-white my-5 p-6 pb-1 border-b-2 border-l-2 rounded-lg text-sm">
            <div className = "flex items-center gap-4">
                <img src = {avatar} className = "w-10 rounded-full" alt = ""/>
                <h2 className = "text-md">{username}</h2>
            </div>
            <div className = "pt-5 pb-3">
                <p className = "text-sm">{description}</p>
            </div>
            {children}
        </div>
    );
} 