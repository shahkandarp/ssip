import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
// import Logo from '../../data/images/Logo_1.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthContext} from '../../src/Context/AuthContext';

// import {Auth} from 'aws-amplify';
// import {useAuthContext} from '../../src/Contexts/AuthContext';

const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const {user, setUser} = useAuthContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSignInPressed = async data => {
    // const {email, password} = data;

    // if (loading) {
    //   return;
    // }
    // const responsedata = await fetch('http://10.0.2.2:3000/api/v1/user/login', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({email: data.email, password: data.password}),
    // });
    // const response = await responsedata.json();
    console.log(data);
    const response = await axios.post(
      'http://10.0.2.2:3000/api/v1/user/login',
      data,
    );
    console.log(response.token);

    const obj = {
      token: response.data.token,
      userID: response.data.user.id,
      name: response.data.user.name,
    };
    const jsonValue = JSON.stringify(obj);
    await AsyncStorage.setItem('userDetail', jsonValue);
    // navigation.navigate('HomeScreen');
    setUser(true);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: 'white', padding: 20}}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={{
            uri: 'https://gandhinagarportal.com/wp-content/uploads/2012/05/government_gujarat_gandhinagar.jpg',
          }}
          style={{height: 130, width: 210}}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            marginVertical: 10,
            marginBottom: 15,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Fredoka-Medium',
              color: 'black',
            }}>
            Sign In
          </Text>
        </View>
      </View>
      <CustomInput
        name="email"
        placeholder="Email"
        control={control}
        rules={{required: 'Email is required'}}
      />
      <CustomInput
        name="password"
        placeholder="Password"
        secureTextEntry
        control={control}
        rules={{
          required: 'Password is required',
          minLength: {
            value: 3,
            message: 'Password should be minimum 3 characters long',
          },
        }}
      />

      <CustomButton
        text={loading ? 'Loading...' : 'Sign In'}
        onPress={handleSubmit(onSignInPressed)}
      />

      <CustomButton
        text="Forgot password?"
        onPress={onForgotPasswordPressed}
        type="TERTIARY"
      />

      {/* <SocialSignInButtons /> */}

      <CustomButton
        text="Don't have an account? Create one"
        onPress={onSignUpPress}
        type="TERTIARY"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
    marginBottom: 20,
  },
});

export default SignInScreen;
