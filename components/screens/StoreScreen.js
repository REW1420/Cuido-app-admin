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
  import React, { useState, useCallback, useRef, useEffect } from "react";
  import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
  import { SearchBar } from "@rneui/themed";
  import { ListItem } from "react-native-elements";
  import Icon from "react-native-vector-icons/Ionicons";
  import productData from "../assets/data/productsData";
  import Modal from "react-native-modal";
  import { remove } from "lodash";
  import Toast from "react-native-toast-message";
  
  export default function StoreScreen() {
    const [number, setNumber] = useState(1);
    const [price, setPrice] = useState(price);
    const [bitem, setItem] = useState([]);
    const [carData, setCarData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [itemName, setItemName] = useState("");
    const bottomSheetRef = useRef(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [lastID, setLastID] = useState(1);
  
    const snapPoints = ["40%"];
  
    const handleSnapPress = useCallback((index) => {
      bottomSheetRef.current?.snapToIndex(index);
    }, []);
  
    const addDataToCart = () => {
      //update the ID
      setLastID(lastID + 1);
      //JSON data for the shooping cart
      const newProduc = {
        id: lastID,
        totalPrice: price,
        quantity: number,
        name: itemName,
      };
  
      //add the data to the shopping cart JSON
      setCarData([...carData, newProduc]);
    };
  
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalNegativeVisible, setIsModalNegativeVisible] = useState(false);
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
  
    const toggleModalError = () => {
      setIsModalNegativeVisible(!isModalNegativeVisible);
    };
  
    const handleDelete = (id) => {
      const newCarData = remove(carData, (carItem) => carItem.id !== id);
      setCarData(newCarData);
    };
  
    useEffect(() => {
      setTotalPrice(price * number);
    }, [number, price]);
  
    const showToast = () => {
      Toast.show({
        type: "success",
        text1: "Agregado al carrito",
        visibilityTime: 1000,
        position: "top",
      });
    };
  
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
  
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 45,
  
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (Object.keys(carData).length == 0) {
                    toggleModalError();
                  } else {
                    toggleModal();
                  }
                }}
              >
                <Icon
                  name="cart-outline"
                  size={35}
                  color={COLORS.primary_button}
                />
              </TouchableOpacity>
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
            {productData.map((item, i) => (
              <View key={i} style={styles.productsContainer}>
                <View>
                  <Image style={styles.image} source={{ uri: item.image }} />
                  <View style={styles.contentProducts}>
                    <View style={styles.text}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.price}>${item.unit_price}</Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={styles.buttom}
                        onPress={() => {
                          setItem(item),
                            handleSnapPress(0),
                            setPrice(item.unit_price);
                          setItemName(item.name);
                          setTotalPrice(item.unit_price);
                        }}
                      >
                        <Text style={styles.textButtom}>Detalles</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
  
        <BottomSheet
          index={-1}
          enablePanDownToClose={true}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onClose={() => {
            setNumber(1);
            //setIsOpen(false);
  
            console.log(JSON.stringify(carData));
          }}
        >
          <BottomSheetView>
            <View style={styles.textContainer}>
              <Icon
                name="alert-circle-outline"
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: "black", margin: 10, marginBottom: 20 }}>
                {bitem.details}
              </Text>
            </View>
  
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                flexDirection: "row",
              }}
            >
              <Icon
                name="cash-outline"
                size={20}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "black", marginBottom: 4 }}>
                ${totalPrice}
              </Text>
            </View>
  
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      if (number <= 1) {
                        return;
                      } else {
                        setNumber(number - 1);
                      }
                    }}
                    style={styles.buttom}
                  >
                    <Text style={styles.textButtom}>-</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ textDecorationLine: "underline" }}>{number}</Text>
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      setNumber(number + 1);
                    }}
                    style={styles.buttom}
                  >
                    <Text style={styles.textButtom}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <TouchableOpacity
                  style={styles.buttom}
                  onPress={() => {
                    addDataToCart();
                    showToast();
                  }}
                >
                  <Text style={styles.textButtom}>Agregar al carrito</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
  
        <Modal isVisible={isModalVisible}>
          <ScrollView style={{ marginTop: 90 }}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {carData.map((carItem, i) => (
                <View style={styles.carItems}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", margin: 5 }}>
                      {carItem.name}
                    </Text>
                    <Text style={{ margin: 5 }}>${carItem.totalPrice}</Text>
                    <Text style={{ margin: 5 }}>
                      Cantidad: {carItem.quantity}
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        width: 70,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                      }}
                      onPress={() => handleDelete(carItem.id)}
                    >
                      <Text style={{ color: "white" }}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
  
              <View style={{ flexDirection: "row", margin: 15 }}>
                <View style={styles.container}>
                  <TouchableOpacity style={styles.buttom} onPress={toggleModal}>
                    <Text style={styles.textButtom}>Regresar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
  
        <Modal isVisible={isModalNegativeVisible}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", margin: 15 }}>
              <View style={styles.container}>
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 15,
                    marginHorizontal: 25,
                    marginVertical: 10,
                    paddingVertical: 15,
                    borderWidth: 1,
                    borderColor: "#eee",
                    shadowColor: "#000000",
                    shadowOffset: {
                      width: -7,
                      height: 7,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 3.05,
                    elevation: 4,
                    width: 300
                   
                  }}
                >
                  <Text style={{ textAlign: "center" , fontSize:15}}>
                    Tu carrito está vacío. ¡Agrega algunos artículos para comenzar
                    a comprar!
                  </Text>
                </View>
  
                <TouchableOpacity
                  style={styles.buttom}
                  onPress={toggleModalError}
                >
                  <Text style={styles.textButtom}>Ir a la tienda</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  
    inputContainer: {
      width: "100%",
  
      justifyContent: "center",
      alignItems: "center",
    },
    containerTopLeft: {
      position: "absolute",
      top: 50,
      left: 20,
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
    productsContainer: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 15,
      marginHorizontal: 25,
      marginVertical: 10,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: "#eee",
      shadowColor: "#000000",
      shadowOffset: {
        width: -7,
        height: 7,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.05,
      elevation: 4,
    },
    contentProducts: {
      paddingTop: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 30,
    },
    image: {
      width: "100%",
      height: 175,
      resizeMode: "contain",
      marginBottom: 10,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
    },
    price: {
      fontSize: 18,
      paddingTop: 3,
      color: "#666",
    },
    buttom: {
      alignItems: "center",
      backgroundColor: COLORS.primary_button,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 12,
    },
    textButtom: {
      fontWeight: "bold",
      color: COLORS.primary_buton_text,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      margin: 10,
      flexDirection: "column",
    },
    carItems: {
      backgroundColor: "#fff",
      borderRadius: 15,
      marginHorizontal: 25,
      marginVertical: 10,
      paddingVertical: 15,
      borderWidth: 1,
      borderColor: "#eee",
      shadowColor: "#000000",
      shadowOffset: {
        width: -7,
        height: 7,
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.05,
      elevation: 4,
      height: 60,
      width: 300,
    },
  });