import React, {useState, useRef, useEffect} from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Button, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
import axios from 'axios';
//import * as WebBrowser from 'expo-web-browser';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, sendEmailVerification, sendSignInLinkToEmail } from 'firebase/auth';
import GoogleAuth from './googleauth';
import FacebookAuth from './facebookauth';
import GithubAuth from './githubauth';
import EmailButton from './emailbutton';
import { styles } from '../styles/css';
const { width } = Dimensions.get("window");
import validator from 'email-validator';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../lib/utils';
import apiconfig from '../lib/apiconfig';
import { User } from '../lib/types';
import { DOMAIN_URL } from '../lib/constants';

//WebBrowser.maybeCompleteAuthSession();

interface PropsType {
    signUpIn: (act: number, em?: string) => void;
    proxyUrl: string;
    authUserPassBack: (user: User | null) => void;
    emaillinkerr: string;
    backSetEmailLinkErr: (txt: string) => void;
}

function UserLogIn({signUpIn, proxyUrl, authUserPassBack, emaillinkerr, backSetEmailLinkErr}: PropsType){
    const initialState = {
        email: '',
        password: ''
    };
    const actionCodeSettings = {
        url: proxyUrl,
        handleCodeInApp: true,
    } 
    const [user, setUser] = useState(initialState);
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef(null);
    const [passwderr, setPassWdErr] = useState('');
    const passwdEl = useRef(null);
    const [mailVerify, setMailVerify] = useState(false);
    const [googlesigninerr, setGoogleSigninErr] = useState('');
    const [facebooksigninerr, setFacebooksigninerr] = useState('');
    const [githubsigninerr, setGithubsigninerr] = useState('');
    const [emailSignin, setEmailSignin] = useState('');
    const [emailSigninInit, setEmailSigninInit] = useState(false);
    const [emailsigninerr, setEmailsigninerr] = useState('');
    const emailSigninEl = useRef(null);
    const [inPost, setInPost] = useState(false);
    
    useEffect(() => {
        setEmailsigninerr(emaillinkerr);
    },[emaillinkerr]);
    
    function handleEmailChange(text: string){
        const value = text.replace(/<\/?[^>]*>/g, "");
        setUser(prevState => ({ ...prevState, email: value }));
        resetErrMsg();
    }
      
    function handlePasswdChange(text: string){
        const value = text.replace(/<\/?[^>]*>/g, "");
        setUser(prevState => ({ ...prevState, password: value }));
        resetErrMsg();
    }
  
    function resetErrMsg(){
        setEmailErr('');
        setPassWdErr('');
        setGoogleSigninErr('');
        setFacebooksigninerr('');
        setGithubsigninerr('');
        setEmailsigninerr('');
        backSetEmailLinkErr('');
        setMailVerify(false);
    }

    function backSetGoogleSigninErr(txt: string){
        setGoogleSigninErr(txt);
    }

    function backSetFacebooksigninerr(txt: string){
        setFacebooksigninerr(txt);
    }
    
    function backSetGithubsigninerr(txt: string){
        setGithubsigninerr(txt);
    }

    function resetForm(){
        setUser(initialState);
        setEmailSignin('');
        setEmailSigninInit(false);
        resetErrMsg();
    }
  
    function toPasswdReset(){
        resetForm();
        signUpIn(2, user.email);
    }
    
    async function submitForm(){
        //Reset all the err messages
        resetErrMsg();
        //Check if Email is filled
        if (!user.email.trim()){
           setEmailErr("Please type your email, this field is required!");
           (emailEl.current as any).focus();
           return;
        }
        //Validate the email
        if (!validator.validate(user.email.trim())){
           setEmailErr("This email is not a legal email.");
           (emailEl.current as any).focus();
           return;
        }
        //Check if Passwd is filled
        if (!user.password.trim()){
           setPassWdErr("Please type your password, this field is required!");
           (passwdEl.current as any).focus();
           return;
        }
  
        setInPost(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, user.email.trim(), user.password.trim());
            if (userCredential.user.emailVerified){
                const result = getUserData(userCredential.user);
                //Login user data
                await SecureStore.setItemAsync('authuser', JSON.stringify(result));
                resetForm();
                authUserPassBack(result);
                //Login user data with database saved data
                const {data} = await axios.post(`${DOMAIN_URL}/api/useradd`, result, apiconfig);
                await SecureStore.setItemAsync('authuser', JSON.stringify(data));
                authUserPassBack(data);
            }else{
                const recommendinf = 'You have not verified your email. Please click the link on the mail we sent for the verification. If you have not received our email, please click the button below to resend the mail.';
                setEmailErr(recommendinf);
                setMailVerify(true);
            } 
        }catch(error: any){
            setEmailErr('Error: ' + error.message);
        }
        setInPost(false);
    }
  
    async function sendVerifyEmail(){
        setInPost(true);
        try {
            await sendEmailVerification(auth.currentUser!, actionCodeSettings);
        }catch(error: any){
            setEmailErr('Error: ' + error.message);
        }    
        setInPost(false);
    }

    function initPost(){
        setInPost(true);
    }

    function stopPost(){
        setInPost(false);
    }

    function handleEmailSigninChange(text: string){
        let value = text.replace(/<\/?[^>]*>/g, "");
        setEmailSignin(value);
        resetErrMsg();
    }
    
    async function onEmailButtonPress() {
        if (!emailSigninInit){
            setEmailSigninInit(true);
            return;
        }
   
        //Reset all the err messages
        resetErrMsg();
        //Check if Email is filled
        if (!emailSignin){
            setEmailsigninerr("Please type your email, this field is required!");
            (emailSigninEl.current as any).focus();
            return;
        }
        //Validate the email
        if (!validator.validate(emailSignin)){
            setEmailsigninerr("This email is not a legal email.");
            (emailSigninEl.current as any).focus();
            return;
        }
        setInPost(true);
        try {
            await sendSignInLinkToEmail(auth, emailSignin, actionCodeSettings);
            await AsyncStorage.setItem('emailForSignIn', emailSignin);
            const successRemark = 'Please go to your mail box, click the sign in link in the email sent to you.';
            setEmailsigninerr(successRemark);
        }catch(error: any){
            setEmailsigninerr('Error: ' + error.message);
        }
        setInPost(false);
    }

    return (
        <View>
            <TextInput
                mode='outlined'
                label="Email"
                placeholder="Email"
                value={user.email}
                onChangeText={text => handleEmailChange(text)}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                ref={emailEl}
                />
            <Text style={{color: 'red'}}>{emailerr}</Text> 
            <TextInput
                mode='outlined'
                label='Password'
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry={true}
                value={user.password}
                onChangeText={text => handlePasswdChange(text)}
                ref={passwdEl}
                />
            <Text style={{color: 'red'}}>{passwderr}</Text>
            <View style={styles.listItem}>
                <Button mode='text' onPress={() => toPasswdReset()}>Forgot Password?</Button>
            </View>
            <View style={[styles.listItem, styles.itemLeft]}>
                <Button mode='contained' onPress={() => submitForm()}>Log In</Button>
                <Button mode='contained' style={{marginLeft: 10}} onPress={() => resetForm()}>Reset</Button>
                {mailVerify &&
                    <Button mode='outlined' style={{marginLeft: 10}} onPress={() => sendVerifyEmail()}>Verify Email</Button>
                }
                {!mailVerify &&
                    <Button mode='outlined' style={{marginLeft: 10}} onPress={() => {resetForm(); signUpIn(1);}}>Sign Up</Button>
                }
            </View>
            <View style={styles.listItem}>
            </View>           
            <View style={styles.listItem}>
                <GoogleAuth authUserPassBack={authUserPassBack} backSetGoogleSigninErr={backSetGoogleSigninErr} initPost={initPost} stopPost={stopPost} />           
                <Text style={{color: 'red'}}>{googlesigninerr}</Text>
            </View>
            <View style={styles.listItem}>
                <FacebookAuth authUserPassBack={authUserPassBack} backSetFacebooksigninerr={backSetFacebooksigninerr} initPost={initPost} stopPost={stopPost} />
                <Text style={{color: 'red'}}>{facebooksigninerr}</Text>
            </View>
            <View style={styles.listItem}>
                <GithubAuth authUserPassBack={authUserPassBack} backSetGithubsigninerr={backSetGithubsigninerr} initPost={initPost} stopPost={stopPost} />
                <Text style={{color: 'red'}}>{githubsigninerr}</Text>
            </View>
            <View style={styles.listItem}>
                <EmailButton width={width-10} onPress={() =>onEmailButtonPress()}>{emailSigninInit ? 'Send sign in email':'Sign in with email'}</EmailButton>
                {emailSigninInit &&
                <TextInput
                    mode='outlined'
                    label="Email for Sign In"
                    placeholder="Email for Sign In"
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={emailSignin}
                    onChangeText={text => handleEmailSigninChange(text)}
                    ref={emailSigninEl}
                />
                }
                <Text style={{color: 'red'}}>{emailsigninerr}</Text>
            </View>
            {inPost &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" animating={true} color={Colors.white} />
                </View>
            }
        </View>
    );
}

export default UserLogIn;

