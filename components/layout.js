import Nav from './nav'

//layout of the page

export default function Layout({ children }){
    return (
        <div className = "w-full mx-6 md:max-w-2xl md:mx-auto font-poppins">

        <Nav />

        <main>{children}</main>
        
        
        </div>
    );
}


