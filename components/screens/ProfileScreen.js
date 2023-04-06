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
  import React from "react";
  import COLORS from "../config/COLORS";
  import SPACING from "../config/SPACING";
  export default function ProfileScreen() {
    return (
      <>
        <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        
          <View style={styles.secondary_backgroud}>
            <View style={styles.containerTopLeft}>
              <Image
                style={{ width: 150, height: 50 }}
                source={require("../assets/CuidoLogoTop.png")}
              />
            </View>
          </View>
  
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
            ></View>
          </View>
  
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text> Profile </Text>
              
            </View>
          </View>
        </ScrollView>
      </>
    );
  }
  const styles = StyleSheet.create({
    secondary_backgroud: {
      backgroundColor: COLORS.secondary_backgroud,
      width: "100%",
      height: 150,
    },
    primary_backgroud: {
      backgroundColor: COLORS.primary_backgroud,
      padding: SPACING * 2,
      borderRadius: SPACING * 3,
      bottom: SPACING * 3,
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
    containerTopLeft: {
      position: "absolute",
      top: 50,
      left: 20,
      flex:1
    },
  });