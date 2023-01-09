import React, {useState, useEffect} from 'react';
import axios from 'axios';
//import * as WebBrowser from 'expo-web-browser';
//import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Text, Dimensions } from 'react-native';
import GoogleButton from './googlebutton';
import { getUserData } from '../lib/utils';
import { User } from '../lib/types';
import apiconfig from '../lib/apiconfig';
import { WEB_CLIENT_ID } from '@env';
const { width } = Dimensions.get("window");
import { DOMAIN_URL } from '../lib/constants';

interface PropsType {
  authUserPassBack: (user: User | null) => void;
  backSetGoogleSigninErr: (txt:string) => void;
  initPost: () => void;
  stopPost: () => void;
}

//WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth({authUserPassBack, backSetGoogleSigninErr, initPost, stopPost}: PropsType) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: WEB_CLIENT_ID,
    },
  );

  useEffect(() => {
    async function userSignIn(user: User){
      //Login user data
      await SecureStore.setItemAsync('authuser', JSON.stringify(user));
      authUserPassBack(user);
      //Login user data with database saved data
      const {data} = await axios.post(`${DOMAIN_URL}/api/useradd`, user, apiconfig);
      await SecureStore.setItemAsync('authuser', JSON.stringify(data));
      authUserPassBack(data);
    }
    
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
      .then((userCredential) => {
        const user = userCredential.user;
        const userResult = getUserData(user);
        userSignIn(userResult);
        stopPost();
      })
      .catch((error) => {
        backSetGoogleSigninErr('Error: ' + error.message);
        stopPost();
      });
    }
    
  }, [response]);

  function initGoogleAuth(){
    initPost();
    promptAsync();
  }

  return (
    <GoogleButton width={width-10} backgroundColor={'#fafafa'} onPress={() => initGoogleAuth()}>Sign in with Google</GoogleButton>
  )

} 
