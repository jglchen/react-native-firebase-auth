import React, {useState, useRef, useEffect} from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { styles } from '../styles/css';
import validator from 'email-validator';

interface PropsType {
    signUpIn: (act: number, em?: string) => void;
    proxyUrl: string;
    emailPreSet: string;
}

function ForgotPasswd({signUpIn, proxyUrl, emailPreSet}: PropsType){
    const [email, setEmail] = useState('');
    const [emailerr, setEmailErr] = useState('');
    const emailEl = useRef(null);
    const [inPost, setInPost] = useState(false);
 
    useEffect(() =>{
        setEmail(emailPreSet);
    },[emailPreSet]);
 
    function handleEmailChange(text: string){
        const value = text.replace(/<\/?[^>]*>/g, "");
        setEmail(value);
        setEmailErr('');
    }
  
    async function submitForm(){
        //Reset all the err messages
        setEmailErr('');
        //Check if Email is filled
        if (!email.trim()){
           setEmailErr("Please type your email, this field is required!");
           (emailEl.current as any).focus();
           return;
        }
        //Validate the email
        if (!validator.validate(email)){
           setEmailErr("This email is not a legal email.");
           (emailEl.current as any).focus();
           return;
        }

        setInPost(true);
        try {
            const actionCodeSettings = {
               url: proxyUrl,
               handleCodeInApp: true,
            } 
            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setEmailErr(''); 
            signUpIn(0);
         }catch(error: any){
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
                value={email}
                onChangeText={text => handleEmailChange(text)}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                ref={emailEl}
                />
            <Text style={{color: 'red'}}>{emailerr}</Text> 
            <View style={styles.listItem}>
                <Button mode='text' onPress={() => { setEmailErr(''); signUpIn(0);}}>Back to Log In</Button>
            </View>
            <View style={styles.listItem}>
                <Button mode='contained' onPress={() => submitForm()}>Send Password Reset Email</Button>
            </View>
            {inPost &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" animating={true} color={'#ffffff'} />
                </View>
            }
        </View>
    );
}

export default ForgotPasswd;    