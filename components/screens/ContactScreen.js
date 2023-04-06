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
    Linking,
  } from "react-native";
  import COLORS from "../config/COLORS";
  import SPACING from "../config/SPACING";
  import React, { useState, useCallback, useRef } from "react";
  import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
  import { Dimensions } from "react-native";
  import { SearchBar } from "@rneui/themed";
  
  import contactsTest from "../assets/data/contactsTest";
  import { ListItem, Avatar } from "react-native-elements";
  import Icon from "react-native-vector-icons/Ionicons";
  
  const { width, height } = Dimensions.get("screen");
  
  export default function ContactsScreen({ navigation }) {
    const [bitem, setItem] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const bottomSheetRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const snapPoints = ["45%"];
  
    const handleSnapPress = useCallback((index) => {
      bottomSheetRef.current?.snapToIndex(index);
    }, []);
  
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
            <View style={styles.container}>
              <SearchBar
                placeholder="Buscar"
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
                onCancel={() => setSearchQuery("")}
              />
            </View>
          </View>
          <View>
            {contactsTest.map((item, i) => (
              <ListItem
                key={i}
                bottomDivider
                style={{
                  backgroundColor: COLORS.secondary_backgroud,
                  margin: 5,
                }}
                onPress={() => {
                  setItem(item), handleSnapPress(0);
                }}
              >
                <Avatar source={{ uri: item.logo }} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </View>
        </ScrollView>
        <BottomSheet
    index={-1}
    enablePanDownToClose={true}
    ref={bottomSheetRef}
    snapPoints={snapPoints}
    onDismiss={() => {
      setIsOpen(false);
      setItem([]);
    }}
  >
    <BottomSheetView style={styles.bottomSheetContainer}>
      <View style={styles.details_logo_container}>
        <Image style={styles.details_logo} source={{ uri: bitem.logo }} />
      </View>
  
      <View style={[styles.textContainer, { marginTop: 20 }]}>
        <Icon
          name="call-sharp"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: "black" }}>{bitem.name}</Text>
      </View>
  
      <View style={styles.textContainer}>
        <Icon
          name="calendar-sharp"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: "black" }}>{bitem.schedule}</Text>
      </View>
  
      <View style={styles.servicesContainer}>
        <Icon
          name="medkit-sharp"
          size={20}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: "black" }}>{bitem.services},</Text>
      </View>
  
      <View style={styles.Buttoncontainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Linking.openURL(`tel:${(bitem.phone)}`);
          }}
        >
          <Text style={styles.button_text}>Llamar</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  </BottomSheet>
  
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
  
    searchContainer: {
      backgroundColor: "transparent",
      borderBottomColor: "transparent",
      borderTopColor: "transparent",
      width: "100%",
    },
    inputContainer: {
      backgroundColor: "white",
      borderRadius: 20,
      height: 40,
    },
    input: {
      color: "black",
    },
    containerTopLeft: {
      position: "absolute",
      top: 50,
      left: 20,
      flex: 1,
    },
    listContainer: {
      backgroundColor: COLORS.secondary_backgroud,
    },
    details_logo: {
      width: 40,
      height: 40,
    },
    details_logo_container: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      margin: 50,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
      flexDirection: "row",
    },
    details_text: {
      color: COLORS.hint_text,
      fontSize: 25,
      textAlign: "center",
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
      width: width / 2,
      height: 40,
    },
    button_text: {
      color: COLORS.primary_buton_text,
      fontWeight: "bold",
      fontSize: 16,
    },
    Buttoncontainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 30,
    },
    detailsContainer: {
      flex: 1,
      flexDirection: "row",
      alignContent: "center",
      justifyContent: "center",
    },
    bottomSheetContainer: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingTop: 30,
      paddingBottom: 50,
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    servicesContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 10,
    },
    
  });