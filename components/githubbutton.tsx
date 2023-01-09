import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';

interface PropsType {
    color?: string;
    backgroundColor?: string;
    width?: number;
    children: React.ReactNode;
    onPress?: () => void;
}

export default function GithubButton({color='white', backgroundColor='black', width=200, children, onPress}: PropsType){
    const btnStyle = {...styles.btnStyle, width};

    return (
        <Icon.Button name="github" size={30} iconStyle={styles.iconstyle} style={btnStyle} backgroundColor={backgroundColor} onPress={onPress}>
             <Text style={[styles.label, { color }]}>
               {children}
             </Text>
        </Icon.Button>
    );
}

const styles = StyleSheet.create({
    btnStyle: {
        width: 200,
        height: 45,
    },
   iconstyle: {
        marginLeft: 12,
        marginRight: 30,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
    },
});    
