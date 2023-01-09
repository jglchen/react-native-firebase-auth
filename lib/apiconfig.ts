import { API_SECRECY } from '@env';

const apiconfig ={
    headers: {
       'Accept': 'application/json',
       'Authorization': `Bearer ${API_SECRECY}`
    }   
}

export default apiconfig;
