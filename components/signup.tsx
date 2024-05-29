import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { View, Text } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { styles } from '../styles/css';
import validator from 'email-validator';
import passwordValidator from 'password-validator';
import apiconfig from '../lib/apiconfig';
import { User } from '../lib/types';
import { DOMAIN_URL } from '../lib/constants';

interface PropsType {
    signUpIn: (act: number, em?: string) => void;
    proxyUrl: string;
}

function UserSignUp({signUpIn, proxyUrl}: PropsType){
    const initialState = {
        email: '',
        password: ''
    }
    const [user, setUser] = useState(initialState);
    const [password2, setPassWd2] = useState('');
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef(null);
    const [passwderr, setPassWdErr] = useState('');
    const passwdEl = useRef(null);
    const passwd2El = useRef(null);
    const [inPost, setInPost] = useState(false);
      
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
  
    function handlePassWd2Change(text: string){
        const passwd2 = text.replace(/<\/?[^>]*>/g, "");
        setPassWd2(passwd2);
        resetErrMsg();
    }
  
    function resetErrMsg(){
        setEmailErr('');
        setPassWdErr('');
    }
  
    function resetForm(){
        setUser(initialState);
        setPassWd2('');
        resetErrMsg();
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
      if (!user.password.trim() || !password2.trim()){
         setPassWdErr("Please type your password, this field is required!");
         if (!user.password.trim()){
            (passwdEl.current as any).focus();
         }else{
            (passwd2El.current as any).focus();
         }
         return;
      }
      //Check the passwords typed in the two fields are matched
      if (user.password.trim() != password2.trim()){
         setPassWdErr("Please retype your passwords, the passwords you typed in the two fields are not matched!");
         (passwdEl.current as any).focus();
         return;
      }

      //Check the validity of password
      let schema = new passwordValidator();
      schema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
      .has().not().spaces();                          // Should not have spaces
      if (!schema.validate(user.password.trim())){
         setPassWdErr("The password you typed is not enough secured, please retype a new one. The password must have both uppercase and lowercase letters as well as minimum 2 digits.");
         (passwdEl.current as any).focus();
         return;
      }

      setInPost(true);
      try {
        const actionCodeSettings = {
            url: proxyUrl,
            handleCodeInApp: true,
        } 
        const userCredential = await createUserWithEmailAndPassword(auth, user.email.trim() , user.password.trim());
        const uid = userCredential.user.uid;
        const email = userCredential.user.email;
        const displayName = userCredential.user.displayName;
        const photoURL = userCredential.user.photoURL;
        await sendEmailVerification(auth.currentUser!, actionCodeSettings);
        await axios.post(`${DOMAIN_URL}/api/useradd`, {uid, email, displayName, photoURL}, apiconfig);
        const instructInf = 'Congratulation! You have successfully registered this account. We are sending you an email to verify the email address. If you do not receive the email, just log in to the account, we will lead you to ask to resend the email.';
        setEmailErr(instructInf);
        setTimeout(() => {
             resetForm();
             signUpIn(0);
        }, 5000); 
      }catch(error: any) {
        setEmailErr('Error: ' + error.message);
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
            <TextInput
                mode='outlined'
                label='Please type password again'
                placeholder='Please type password again'
                autoCapitalize='none'
                secureTextEntry={true}
                value={password2}
                onChangeText={text => handlePassWd2Change(text)}
                ref={passwd2El}
                />
            <Text>  </Text>
            <View style={[styles.listItem, styles.itemLeft]}>
                <Button mode='contained' onPress={() => submitForm()}>Sign Up</Button>
                <Button mode='contained' style={{marginLeft: 10}} onPress={() => resetForm()}>Reset</Button>
                <Button mode='outlined' style={{marginLeft: 10}} onPress={() => {resetForm(); signUpIn(0);}}>Log In</Button>
            </View>
            {inPost &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" animating={true} color={'#ffffff'} />
                </View>
            }
        </View>
    );    
}    

export default UserSignUp;    