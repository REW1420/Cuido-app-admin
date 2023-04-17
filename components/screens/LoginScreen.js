import {
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
    Button,
  } from "react-native";
  import COLORS from "../config/COLORS";
  import SPACING from "../config/SPACING";
  import Toast from "react-native-toast-message";
  import React, { useState } from "react";
  import { Dimensions } from "react-native";
  
  import Icon from "react-native-vector-icons/Ionicons";
  
  const { width, height } = Dimensions.get("screen");
  
  export default function LoginScreen({ navigation }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
  
    const showToastError = () => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:'Los campos no pueden estar vacios',
        visibilityTime: 3000,
        position: "top",
      });
    };
  
    const showToastInvalidCredentiasls =()=>{
      Toast.show({
        type: "error",
        text1: "Error",
        text2:'Credenciales incorrectas',
        visibilityTime: 3000,
        position: "top",
      });
    }
  
    return (
      <>
        <ScrollView style={styles.initB}>
          <View style={styles.secondary_backgroud}></View>
  
          <View style={styles.primary_backgroud}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 16,
                marginRight: 16,
                marginBottom: 16,
                height: 200,
              }}
            >
              <Image
                style={styles.Logo}
                source={require("../assets/Cuido.png")}
              />
            </View>
  
            <View style={styles.textContainer}>
              <Icon name="mail" size={20} color="black" style={{ margin: 5 }} />
              <Text style={styles.hint_text}>Correo</Text>
            </View>
  
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="ejemplo@dominio.com"
                  placeholderTextColor={COLORS.input_text}
                  onChangeText={(text) => {setUser(text)}}
                />
              </View>
            </View>
  
            <View style={styles.textContainer}>
              <Icon name="key" size={20} color="black" style={{ margin: 5 }} />
              <Text style={styles.hint_text}>Contraseña</Text>
            </View>
  
            <View style={styles.container}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="****"
                  placeholderTextColor={COLORS.input_text}
                  onChangeText={(text) => {setPassword(text)}}
                />
              </View>
            </View>
  
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if(user !== '' && password !== ''){
  
                    if( user == 'admin' && password=='admin') {
                      navigation.navigate('AdminNav')
                    } else {
                        showToastInvalidCredentiasls()
                    }
                    navigation.navigate("MainNav");
                  } else {
                        showToastError()
                  }
                }}
              >
                <Text style={styles.button_text}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
  
           
          </View>
          <Toast ref={Toast.setRef} />
        </ScrollView>
      </>
    );
  }
  const styles = StyleSheet.create({
    inputTxt: {
      backgroundColor: COLORS.input_color,
      padding: 15,
      margin: 15,
      borderRadius: 50,
      borderWidth: 1.5,
      width: "80%",
      color: COLORS.input_text,
      textAlign: "center",
      borderColor: COLORS.input_color,
      alignSelf: "center",
    },
    secondary_backgroud: {
      backgroundColor: COLORS.secondary_backgroud,
      width: "100%",
      height: 100,
    },
    primary_backgroud: {
      backgroundColor: COLORS.primary_backgroud,
      padding: SPACING * 2,
      borderRadius: SPACING * 3,
      bottom: SPACING * 3,
    },
    Logo: {
      width: 205,
      height: 105,
      alignSelf: "center",
      marginBottom: 5,
    },
    button: {
      backgroundColor: COLORS.primary_button,
      borderRadius: 20,
      shadowColor: COLORS.secondary_button,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 2,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
      width: "80%",
    },
    button_text: {
      color: COLORS.primary_buton_text,
      fontWeight: "bold",
      fontSize: 16,
    },
    textContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
      flexDirection: "row",
    },
    hint_text: {
      color: COLORS.hint_text,
      fontSize: 25,
      textAlign: "center",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      width: "100%",
  
      justifyContent: "center",
      alignItems: "center",
    },
    initB: {
      backgroundColor: COLORS.primary_backgroud,
    },
  });