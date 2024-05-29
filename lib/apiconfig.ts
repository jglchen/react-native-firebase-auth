import { API_SECRECY } from '@env';

const apiconfig ={
    headers: {
       'Accept': 'application/json',
       'Authorization': `Bearer ${API_SECRECY || process.env.EXPO_PUBLIC_API_SECRECY}`
    }   
}

export default apiconfig;
