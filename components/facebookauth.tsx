import React, {useState, useEffect} from 'react';
import axios from 'axios';
//import * as WebBrowser from 'expo-web-browser';
import { ResponseType, makeRedirectUri } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../lib/firebase';
import { FacebookAuthProvider, signInWithCredential, fetchSignInMethodsForEmail } from 'firebase/auth';
import { Dimensions } from 'react-native';
import FacebookButton from './facebookbutton';
import { User } from '../lib/types';
import apiconfig from '../lib/apiconfig';
import { getUserData } from '../lib/utils';
import { FACEBOOK_APPID } from '@env';
const { width } = Dimensions.get("window");
import { DOMAIN_URL } from '../lib/constants';

interface PropsType {
    authUserPassBack: (user: User | null) => void;
    backSetFacebooksigninerr: (txt:string) => void;
    initPost: () => void;
    stopPost: () => void;
}

//WebBrowser.maybeCompleteAuthSession();

export default function FacebookAuth({authUserPassBack, backSetFacebooksigninerr, initPost, stopPost}: PropsType) {
    const [request, response, promptAsync] = Facebook.useAuthRequest({
        responseType: ResponseType.Token,
        clientId: FACEBOOK_APPID,
        redirectUri: makeRedirectUri({ useProxy: true }),
      },
      { useProxy: true } 
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
            const { access_token } = response.params;
            const credential = FacebookAuthProvider.credential(access_token);
            // Sign in with the credential from the Facebook user.
            signInWithCredential(auth, credential)
            .then((userCredential) => {
              const user = userCredential.user;
              const userResult = getUserData(user);
              userSignIn(userResult);
              stopPost();
            })
            .catch((error) => {
                backSetFacebooksigninerr('Error: ' + error.message);
                stopPost();
            });
        }
    }, [response]);

    function initFacebookAuth(){
        initPost();
        promptAsync();
    }
    
    return (
        <FacebookButton width={width-10} onPress={() => initFacebookAuth()}>Sign in with Facebook</FacebookButton>
    );
}    