const Login = () => {
    return (
        <div className=" flex items-center justify-center py-20 mx-auto">
            <div className="box-container px-10 py-10">
                <h1 className="text-3xl text-hover">Sign in</h1>
                <h3 className="text-fontcolor pb-1 font-medium">Email</h3>
                <div className="rounded-xs border-2 border-fontcolor h-10 flex">
                    <input></input>
                </div>  

                <h3 className="text-fontcolor pt-4 pb-1 font-medium">Password</h3>
                <div className="rounded-xs border-2 border-fontcolor h-10 flex">
                    <input></input>
                </div>     
            </div>  
        </div>

    );
};

export default Login;
  
