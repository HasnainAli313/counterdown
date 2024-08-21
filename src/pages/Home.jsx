import { useState } from 'react'
import Signup from '../components/Signup'
import Login from '../components/Login'


function Home() {
    const [isSignin, setIsSignin] = useState(true)

    const handleToggle = () => {
        setIsSignin(!isSignin);
    }
  return (
    <>
   {isSignin ? <Login></Login> : <Signup></Signup>}
    {isSignin ?  <p className='text-center' onClick={()=> handleToggle ()} >Donot have an account? <span className='text-blue-700'>SignUp</span></p> : <p className='text-center' onClick={()=> handleToggle ()} >Already Have an account? <span className='text-blue-700'>SignIn</span></p> }
 
  </>
  )
}

export default Home;