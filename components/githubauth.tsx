import React, {useState, useEffect} from 'react';
import axios from 'axios';
//import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../lib/firebase';
import { GithubAuthProvider, signInWithCredential } from 'firebase/auth';
import { Dimensions } from 'react-native';
import GithubButton from './githubbutton';
import { User } from '../lib/types';
import { getUserData } from '../lib/utils';
import apiconfig from '../lib/apiconfig';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@env';
const { width } = Dimensions.get("window");
import { DOMAIN_URL } from '../lib/constants';


interface PropsType {
    authUserPassBack: (user: User | null) => void;
    backSetGithubsigninerr: (txt:string) => void;
    initPost: () => void;
    stopPost: () => void;
}

//WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
};

export default function GithubAuth({authUserPassBack, backSetGithubsigninerr, initPost, stopPost}: PropsType) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: `${GITHUB_CLIENT_ID}`,
      //scopes: ['read: user'],
      scopes: ['user: email'],
      redirectUri: makeRedirectUri({
        scheme: 'firebase-auth'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      getGitHubAuthUser(code);
    }

  }, [response]);

  async function createTokenWithGitHubCode(code: string) {
    const url =
      `https://github.com/login/oauth/access_token` +
      `?client_id=${GITHUB_CLIENT_ID}` +
      `&client_secret=${GITHUB_CLIENT_SECRET}` +
      `&code=${code}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  
    return res.json();
  }

  async function getGitHubAuthUser(code: string) {
    try {
      const { token_type, scope, access_token } = await createTokenWithGitHubCode(code);
      const credential = GithubAuthProvider.credential(access_token);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      const userResult = getUserData(user);
      //Login user data
      await SecureStore.setItemAsync('authuser', JSON.stringify(userResult));
      authUserPassBack(userResult);
      //Login user data with database saved data
      const {data} = await axios.post(`${DOMAIN_URL}/api/useradd`, userResult, apiconfig);
      await SecureStore.setItemAsync('authuser', JSON.stringify(data));
      authUserPassBack(data);
    }catch(error: any){
      backSetGithubsigninerr('Error: ' + error.message);
    }
    stopPost();
  }

  function initGithubAuth(){
    initPost();
    promptAsync();
  }
  
  return (
    <GithubButton width={width-10} onPress={() => initGithubAuth()}>Sign in with GitHub</GithubButton>
  );
}
