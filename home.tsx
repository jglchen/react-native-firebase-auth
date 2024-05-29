import React, {useState, useEffect} from 'react';
import { 
    SafeAreaView, 
    View,
    Text,
    Image
} from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import UserLogIn from './components/userlogin';
import UserSignUp from './components/signup';
import ForgotPasswd from './components/forgotpasswd';
import { styles } from './styles/css';
import { auth } from './lib/firebase';
import { signOut, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import Unorderedlist from 'react-native-unordered-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
//import Constants from 'expo-constants';
import { User } from './lib/types';
import apiconfig from './lib/apiconfig';
import { getUserData } from './lib/utils';
import { DOMAIN_URL } from './lib/constants';

//Use WebBrowser.maybeCompleteAuthSession() to use Expo AuthSession.
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [signAct, setSignAct] = useState(0);
  const [email, setEmail] = useState('');
  const [emaillinkerr, setEmailLinkerr] = useState('');

  //const expoUrl = __DEV__ ? 'exp://10.0.0.122:19000/--': 'exp://exp.host/@jglchen/' + Constants.manifest!.name;
  const expoUrl = 'fbauthenticate://';
  const expoLink = Linking.createURL(expoUrl);
  const FIREBASE_LINK_PROXY = 'https://firebase-auth-rust.vercel.app/firebase-auth-redirect';
  const proxyUrl = `${FIREBASE_LINK_PROXY}?redirectUrl=${encodeURIComponent(expoLink)}`;

  useEffect(() => {
    getStoreAuthUser();
  },[]);
  
  async function getStoreAuthUser(){
    try {
      const result = await SecureStore.getItemAsync('authuser');
      if (result){
        setAuthUser(JSON.parse(result));
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    Linking.getInitialURL()
    .then((url) => {
      if (url){
        handleIncomingUrl(url);
      }
    });

    Linking.addEventListener('url', ({ url }) => {
      handleIncomingUrl(url);
    }); 
  });

  async function handleIncomingUrl(url: string){
    if (isSignInWithEmailLink(auth, url)) {
      try {
        const email = await AsyncStorage.getItem('emailForSignIn');
        if (email){
            const userCredential = await signInWithEmailLink(auth, email, url);
            const user = userCredential.user;
            const userResult = getUserData(user);
           //Login user data
            await SecureStore.setItemAsync('authuser', JSON.stringify(userResult));
            authUserPassBack(userResult);
            //Login user data with database saved data
            const {data} = await axios.post(`${DOMAIN_URL}/api/useradd`, userResult, apiconfig);
            await SecureStore.setItemAsync('authuser', JSON.stringify(data));
            authUserPassBack(data);
       }
      }catch(error: any){
        setEmailLinkerr('Error: ' + error.message)
      }
    }
  }

  function signActSelect(act: number, em?: string){
    if (typeof em !== 'undefined'){
       setEmail(em);
    }
    setSignAct(act);
  }

  function authUserPassBack(user: User | null){
    setAuthUser(user);
  }

  async function removeAuthUser(){
    await SecureStore.deleteItemAsync('authuser');
    await signOut(auth); 
    setAuthUser(null);
  }

  function getHeadTitle(){
    if (authUser?.uid){
       return '';
    }
    let headTitle;
    switch (signAct){
      case 2:
        headTitle = 'Forgot Password';
        break;
      case 1:
        headTitle = 'Please Sign Up';
        break;
      default:
        headTitle = 'Please Log In';
        break;      
    }
    return headTitle;
  }

  function backSetEmailLinkErr(txt:string){
    setEmailLinkerr(txt);
  }
  
  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={true}
            style={styles.scrollView}
            >
            {(authUser?.uid) &&
            <View style={[styles.listItem, styles.itemSpaceBetween]}>
              <View>
                <Text style={styles.descrText}>{`Hi! `} 
                {authUser?.uid &&
                  <Text>{authUser.displayName ? authUser.displayName: authUser.email}</Text>
                }
                </Text>
              </View>
              <Button
                mode='outlined'
                onPress={() => removeAuthUser()}
                >
                Sign Out
              </Button>
            </View>
            }
            {!authUser?.uid &&
            <View style={[styles.listItem, styles.itemCenter]}>
              <Text style={styles.titleText}>{getHeadTitle()}</Text>
            </View> 
            }
            {!authUser?.uid &&
            <>
            {signAct === 0 &&
            <View style={styles.listItem}>
              <UserLogIn 
                signUpIn={signActSelect}
                proxyUrl={proxyUrl} 
                authUserPassBack={authUserPassBack}
                emaillinkerr={emaillinkerr}
                backSetEmailLinkErr={backSetEmailLinkErr}
                />
            </View>
            }
            {signAct === 1 &&
            <View style={styles.listItem}>
              <UserSignUp 
                signUpIn={signActSelect}
                proxyUrl={proxyUrl} 
              />
            </View>
            }
            {signAct === 2 &&
            <View style={styles.listItem}>
              <ForgotPasswd 
                signUpIn={signActSelect}
                proxyUrl={proxyUrl} 
                emailPreSet={email}
              />
            </View>
            }
            </>
            }
            <View style={styles.listItem}>
              <Text style={styles.descrText}>
              This example creates an authentication system that uses <Text style={styles.boldText}>an encrypted storage to store session data.</Text>
              </Text>
            </View>
            <View style={styles.listItem}>
              <Unorderedlist><Text style={styles.descrText}>Firebase Authentication with Email/Password, Google Sign In, GitHub Sign In, and Email Sign In available to authenticate users.</Text></Unorderedlist>
            </View>
            <View style={styles.listItem}>
              <Unorderedlist><Text style={styles.descrText}>The emails registered in Firebase Authentication are saved in a separate database for future data development of individual users, for this illustration Firestore Database.</Text></Unorderedlist>
            </View>
            <View style={styles.listItem}>
              <Unorderedlist><Text style={styles.descrText}>Session data is encrypted in local storage.</Text></Unorderedlist>
            </View>
            <View style={styles.listItem}>
              <View style={styles.itemCenter}>
                <Text style={{fontSize: 20}}>{authUser?.uid ? 'You are logged in!': 'You are not logged in!'}</Text>
              </View>
              {authUser?.photoURL &&
              <View style={styles.itemCenter}>  
                <Image source={{ uri: authUser?.photoURL }} style={styles.image} />
              </View>  
              }
              {authUser?.displayName &&
              <View style={styles.itemCenter}>  
                <Text style={styles.descrText}>{authUser?.displayName}</Text>
              </View>  
              }
              {authUser?.email &&
              <View style={styles.itemCenter}>  
                <Text style={styles.descrText}>{authUser?.email}</Text>
              </View>  
              }
            </View>
       </KeyboardAwareScrollView>    
      </SafeAreaView>
  );
}
