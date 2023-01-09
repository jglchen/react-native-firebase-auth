import React from 'react';
import { View, TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';

interface PropsType {
    color?: string;
    backgroundColor?: string;
    width: number;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    onPress?: () => void;
}

export default function GoogleButton({ color='#515151', backgroundColor='#fff', width, loading=false, disabled=false, children, onPress }: PropsType){

  return (
    <TouchableOpacity onPress={onPress} style={[
      styles.container,
      {
        opacity: disabled ? 0.5 : 1,
        backgroundColor,
        width
      },
    ]}
    >
      {loading ?
          <ActivityIndicator size={'small'} color={color} /> :
          <View style={styles.viewContainer}>
            <View style={{paddingHorizontal: 20}}>
              <Image style={styles.logo} source={require('../assets/google-logo.png')} />
            </View>
            <View style={{paddingHorizontal: 20}}>
               <Text style={[styles.label, { color }]}>{children}</Text>
            </View>
          </View>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  viewContainer: {
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center'
  },
  logo: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});

/*
//https://github.com/andresmichel/react-native-google-button
import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet } from 'react-native'

export default class GoogleButton extends React.Component {
  render() {
    const { color, backgroundColor, width, ...props } = this.props;
    return (
      <TouchableOpacity {...props} style={[
        styles.container,
        {
          opacity: this.props.disabled ? 0.5 : 1,
          backgroundColor,
          width
        },
      ]}
      >
        {this.props.loading ?
          <ActivityIndicator size={'small'} color={color} /> :
          <View style={styles.viewContainer}>
            <View style={{paddingHorizontal: 20}}>
              <Image style={styles.logo} source={require('../assets/google-logo.png')} />
            </View>
            <View style={{paddingHorizontal: 20}}>
               <Text style={[styles.label, { color }]}>{this.props.children}</Text>
            </View>
          </View>}
      </TouchableOpacity>
    )
  }
}

GoogleButton.propTypes = {
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
}

GoogleButton.defaultProps = {
  color: '#515151',
  backgroundColor: '#fff'
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  viewContainer: {
    width: '100%', 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center'
  },
  logo: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
*/