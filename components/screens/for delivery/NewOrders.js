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
  Pressable,
  Button,
  Alert,
  Dimensions,
  Linking,
} from "react-native";

import COLORS from "../../config/COLORS";
import SPACING from "../../config/SPACING";
import React, { useState, useCallback, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SearchBar } from "@rneui/themed";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { remove, sortBy } from "lodash";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Order from "../../utils/MVC/Model";
import global from "../../utils/global";
import MapView, { Marker } from "react-native-maps";

const height = Dimensions.get("screen").height;
//intance the model to create an object
const orderModel = new Order();

function useNewOrderData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await orderModel.getOrdersFiltered(
          global.user_id
        );
        setData(ordersResponse);
      } catch (error) {
        console.error(error);
      }
    };

    if (1) {
      fetchOrders();
    }
  }, []);

  return data;
}
export default function NewOrders({ navigation }) {
  //order data
  const [comment, setComment] = useState("");
  const [location_lat, setLocation_lat] = useState(0);
  const [location_long, setLocation_long] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderID, setOrderID] = useState("");
  const [currentLocation, setCurrentLocation] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [clienteName, setClienteName] = useState("");

  //modal hooks boolean
  const [isModalVisible, seetIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);

  const toggleModalUpdate = () => {
    setIsModalUpdateVisible(!isModalUpdateVisible);
  };
  const toggleModal = () => {
    seetIsModalVisible(!isModalVisible);
  };
  const callClient = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const orderData = useNewOrderData();
  console.log(orderData);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      } else {
        const { coords } = await Location.getCurrentPositionAsync();
        setCurrentLocation(coords);
        console.log(currentLocation);
      }
    }
    getLocation();
  }, []);

  const showCurrentRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 150, height: 50 }}
              source={require("../../assets/CuidoLogoTop.png")}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("login");
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-end",
                margin: 15,
              }}
            >
              <Icon name="log-out-outline" size={35} color={"red"} />
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
            />
          </View>
        </View>

        <View>
          {orderData.map((item, i) => {
            if (item.delivered == 0) {
              return (
                <ListItem
                  key={i}
                  bottomDivider
                  style={{
                    backgroundColor: COLORS.secondary_backgroud,
                    margin: 5,
                  }}
                  onPress={() => {
                    setComment(item.comments);
                    setIsDelivered(item.delivered);
                    setTotalPrice(item.total_price);
                    setPhoneNumber(item.user_phone_number);
                    setProducts(item.products);
                    setOrderID(item.id);
                    setLocation_lat(item.location_lat);
                    setLocation_long(item.location_long);
                    setClienteName(item.client_name);
                    toggleModal();
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title
                      style={
                        item.delivered === 0
                          ? styles.textError
                          : styles.textValid
                      }
                    >
                      No entregado
                    </ListItem.Title>
                    <ListItem.Subtitle>Pedido ID : {item.id}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              );
            }
          })}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
        
      >
        <ScrollView  >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.modalHeader}>Datos del pedido: {orderID}</Text>
            <View style={{ margin: 10 }}>
              <Text>Nombre del cliente: {clienteName}</Text>
            </View>
            <View style={styles.cardItems}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                }}
              >
                <Text style={{ margin: 5, fontWeight: "bold" }}>Producto</Text>
                <Text style={{ margin: 5, fontWeight: "bold" }}>Cantidad</Text>
                <Text style={{ margin: 5, fontWeight: "bold" }}>Precio </Text>
              </View>
            </View>
            {products.map((item, i) => (
              <View style={styles.cardItems}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 20,
                  }}
                >
                  <Text style={{ margin: 5 }}>{item.name}</Text>
                  <Text style={{ margin: 5 }}>{item.quantity}</Text>
                  <Text style={{ margin: 5 }}>${item.totalPrice}</Text>
                </View>
              </View>
            ))}
            <View style={styles.cardItems}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 20,
                }}
              >
                <Text style={{ margin: 5, fontWeight: "bold" }}>
                  Total a pagar:
                </Text>
                <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                  ${totalPrice}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", margin: 10 }}>
              <Text style={{ fontWeight: "bold", margin: 10, fontSize: 25 }}>
                Contactar cliente
              </Text>
              <Pressable onPress={callClient} style={{ margin: 5 }}>
                <Icon name="call-outline" size={30} color="#232323" />
              </Pressable>
            </View>
            <View style={{}}>
              <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Text style={styles.button_text}>Marcar como pagado</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggleModal}>
                <Text style={styles.button_text}>Marcar como entregado</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, margin: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={toggleModalUpdate}
                >
                  <Text style={styles.button_text}>
                    Ver ubicacion de entrega
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={toggleModal}>
                  <Text style={styles.button_text}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal
        isVisible={isModalUpdateVisible}
        onBackdropPress={toggleModalUpdate}
        onBackButtonPress={toggleModalUpdate}
        
        
      >
        <ScrollView  >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", margin: 5 }}>
              <Text style={styles.modalHeader}>Ubicacion de entrega</Text>
              <Pressable onPress={toggleModalUpdate} style={{ margin: 5 }}>
                <Icon name="close-circle-outline" size={30} color="#232323" />
              </Pressable>
            </View>
            <View style={{ height: height - 100, width: "100%" }}>
              <MapView
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={{ flex: 1 }}
                initialRegion={showCurrentRegion}
              >
                <Marker
                  title="Lugar de entrega"
                  coordinate={{
                    latitude: parseFloat(location_lat),
                    longitude: parseFloat(location_long),
                  }}
                />
              </MapView>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 16,
  },
  cardItems: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    height: 60,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000000",
    shadowOffset: {
      width: -7,
      height: 7,
    },
  },
  modalHeader: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 20,
  },
  imagePcikedContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  imagePicked: { width: 200, height: 200 },

  buttonImagePicker: {
    alignItems: "center",
    backgroundColor: COLORS.primary_button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  modalHeader: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 20,
  },
  modalInputContainer: {
    marginHorizontal: 25,
    marginVertical: 10,
    paddingVertical: 15,
    width: 300,
    justifyContent: "center",
  },
  modalBackdround: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
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
  button: {
    alignItems: "center",
    backgroundColor: COLORS.primary_button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    margin: 10,
  },
  icon: {
    alignItems: "center",

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
  inputText: {
    backgroundColor: COLORS.input_color,
    padding: 15,
    margin: 10,
    borderRadius: 50,
    borderWidth: 1.5,
    width: "80%",
    color: COLORS.input_text,
    textAlign: "center",
    borderColor: COLORS.input_color,
    alignSelf: "center",
  },
  textError: {
    color: "red",
  },
  textValid: {
    color: "green",
  },
});
