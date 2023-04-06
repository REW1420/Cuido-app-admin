import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    Image,
    ActivityIndicator,
    Animated,
  } from "react-native";
  import React, { useRef, useEffect } from "react";
  import { Dimensions } from "react-native";
  import Icon from "react-native-vector-icons/Ionicons";
  
  const { width, height } = Dimensions.get("screen");
  
  export default function SplashScreen() {
    return (
      <SafeAreaView
        style={{ backgroundColor: "#671517", width: width, height: height }}
      >
        <View style={styles.container}>
          <View style={styles.viewContainer}>
            <Image
              style={styles.Logo}
              source={require("../assets/CuidoSplash.png")}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Te ayudamos a proteger lo que más quieres
              </Text>
            </View>
            <View style={styles.loadingContaier}>
  
            <ActivityIndicator size="large" color="#ffffff" />
  
            </View>
           
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    Logo: {
      width: 205 * 1.5,
      height: 105 * 1.5,
      alignSelf: "center",
      marginBottom: 5,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    viewContainer: {
      width: 100,
      height: height / 2,
    },
    text: {
      color: "white",
      fontSize: 15,
    },
    textContainer: {
      width: 200,
      margin: 5,
    },
    fill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      backgroundColor: "#fff",
    },
    loadingContaier:{
      marginTop:height /4
    }
  });