import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";


import SplashScreen from './components/screens/SplashScreen';
import LoginNav from './components/navigation/LoginNavigation';




export default function App() {

  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(()=>{
    async function prepare(){

      try{
        await new Promise(resolve => setTimeout(resolve,2000));
      } catch(error){
        console.warn(error);
      }finally{
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])



  return (
   
     <>

     {

      appIsReady ? <LoginNav/> : <SplashScreen/>

     }
      
     
     </>
      
    
   
  );
}