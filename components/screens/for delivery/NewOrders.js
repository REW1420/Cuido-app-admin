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
  RefreshControl,
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
import LocalUserModel from "../../utils/MVC/LocalUserModel";
import LocalOrderModel from "../../utils/MVC/LocalOrdersModel";
import MapViewDirections from "react-native-maps-directions";
import { useTogglePasswordVisibility } from "../../utils/useTogglePasswordVisibility";
import { auth } from "../../utils/Firebase";
import {
  signInWithEmailAndPassword,
  updateEmail,
  signOut,
} from "firebase/auth";

const height = Dimensions.get("screen").height;
//intance the model to create an object
const orderModel = new Order();
const localOrderModel = new LocalOrderModel();
const localUserModel = new LocalUserModel();

//GOOGLE API KEY
const GOOGLE_API_KEY = "AIzaSyCU0Y0u6wlVZP_Wa0hcfyJi9ag7PDFLpIo";

function useNewOrderData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await localOrderModel.getOrdersFiltered(
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
  //destination hook
  const destination = {
    latitude: parseFloat(location_lat),
    longitude: parseFloat(location_long),
  };

  //google maps linking
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${parseFloat(
    location_lat
  )},${parseFloat(location_long)}`;

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
  //const orderData = useNewOrderData();
  //console.log(orderData);

  //save the order id in hooks
  const [id, setID] = useState(0);

  const handleUpdateOrder = async () => {
    console.log(id);
    const status = {
      paid: true,
      delivered: true,
    };
    await localOrderModel.updateOrderStatus(id, status).then(() => toggleModal);
  };
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

  //hook de la data inicial
  const [newOrdersData, setNewOrdersData] = useState([]);
  //hook de la data filtrada
  const [filteredData, setFilteredData] = useState([]);
  //query seacrh
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await localOrderModel.getOrdersFiltered(
          global.user_id
        );
        setNewOrdersData(ordersResponse);
        console.log("useEffect");
        console.log(newOrdersData);
      } catch (error) {
        console.error(error);
      }
    };
    async function getUserData() {
      const userData = await localUserModel.getUserDataByID(global.user_id);
      setUserData(userData);
    }
    getUserData();
    fetchOrders(); // Llamamos a la función aquí
  }, []);

  console.log(newOrdersData);
  //hooks for no found data
  const [noFoundData, setNoFoundData] = useState(false);
  //handle para actualizar los datos dependiendo de lo que se busca
  const handleSearch = (text) => {
    setQuery(text);
    const filtered = newOrdersData.filter((item) => {
      const itemData = item.id.toString();
      const textData = text.toString();
      return itemData.indexOf(textData) > -1;
    });
    setFilteredData(filtered);

    if (filteredData.length === 0) {
      //no data found
      setNoFoundData(true);
    }
  };

  //hoosk for refershing the view
  const [refershing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const ordersResponse = await localOrderModel.getOrdersFiltered(
        global.user_id
      );
      const userData = await localUserModel.getUserDataByID(global.user_id);
      setUserData(userData);
      setNewOrdersData(ordersResponse);
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false);
  }, []);

  const [resetPassModalV, setResetPassModalV] = useState(false);

  const resetPassModal = () => setResetPassModalV(!resetPassModalV);

  //change email
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const toggleChangeEmailModal = () =>
    setChangeEmailVisible(!changeEmailVisible);
  //funtion to change email address
  const handleChangeEmail = async () => {
    await signInWithEmailAndPassword(auth, global.email, password).then(
      (userCredential) => {
        updateEmail(userCredential.user, newEmail)
          .then(userCredential)
          .then(() => {
            const newUserData = {
              email: newEmail,
            };
            localUserModel
              .updateUserEmail(global.user_id, newUserData)
              .then(() => {
                showGoHomeAlert();
              });
          });
      }
    );
  };
  //hook for settings account modal visibility
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const toggleSettingsModal = () => {
    setIsSettingModalVisible(!isSettingModalVisible);
    userData.forEach((item, i) => {
      setNewLastName(item.second_name);
      setNewNade(item.first_name);
      setNewPhoneNumber(item.phone_number);
    });
  };
  //hook for email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const showGoHomeAlert = () =>
    Alert.alert(
      "Se han actualizado los datos correctamente",
      "Vuelva a iniciar sesion",
      [
        {
          text: "Confirmar",
          onPress: () => {
            handleSingOut();
          },
        },
      ]
    );
  const [inalivEmail, setInvalidEmail] = useState(false);
  const [userFound, userNotFound] = useState(false);
  const resetPass = async () => {
    if (emailRegex.test(email) === false) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
      sendPasswordResetEmail(auth, email)
        .then((result) => {
          console.log(result);
        })
        .catch((e) => {
          userNotFound(true);
          console.log(e.code, e.message);
        });
    }
  };

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  //new user data hooks
  const [newName, setNewNade] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState(0);

  const updateUserData = async () => {
    const newUserDataL = {
      first_name: newName,
      second_name: newLastName,
      phone_number: newPhoneNumber,
    };
    await localUserModel
      .updateUserData(global.user_id, newUserDataL)
      .then(() => {
        toggleSettingsModal();
        showUpdateToast();
      });
  };

  const showUpdateToast = () => {
    Toast.show({
      type: "success",
      text1: "Datos actualizados correctamente",
      visibilityTime: 1000,
      position: "top",
    });
  };
  const handleChange = (event) => {
    setNewPhoneNumber(event.target.value);
    setNewNade(event.target.value);
    setNewLastName(event.target.value);
    console.log(newName);
  };
  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };
  //handle event for fetch the orders data
  const handleSingOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sing out");
        navigation.navigate("login");
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <ScrollView
        style={{ backgroundColor: COLORS.primary_backgroud }}
        refreshControl={
          <RefreshControl refreshing={refershing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 150, height: 50 }}
              source={require("../../assets/CuidoLogoTop.png")}
            />
          </View>

          <View style={{ flex: 1, marginHorizontal: 15, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={toggleSettingsModal}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-end",
                marginHorizontal: 10,
              }}
            >
              <Icon name="settings-outline" size={35} color={"gray"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSingOut}
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                marginHorizontal: 10,
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
              inputContainerStyle={{
                backgroundColor: "white",
                borderRadius: 20,
                height: 40,
              }}
              inputStyle={styles.input}
              onChangeText={handleSearch}
              value={query}
            />
          </View>
        </View>

        <View>
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => {
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
                      setID(item.id);
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
                      <ListItem.Subtitle>
                        Pedido ID : {item.id}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                );
              }
            })
          ) : noFoundData === true ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                No se encontraron resultados para la búsqueda realizada.
              </Text>
            </View>
          ) : (
            newOrdersData.map((item, i) => {
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
                      setID(item.id);
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
                      <ListItem.Subtitle>
                        Pedido ID : {item.id}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                );
              }
            })
          )}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
      >
        <ScrollView>
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
              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateOrder}
              >
                <Text style={styles.button_text}>
                  Marcar como pagado y entregado
                </Text>
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
        <ScrollView>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 5 }}
            >
              <Pressable
                onPress={() => Linking.openURL(googleMapsUrl)}
                style={{ margin: 5 }}
              >
                <Icon name="navigate-outline" size={30} color="#232323" />
              </Pressable>
              <Text
                style={{
                  textAlign: "center",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: 25,
                }}
              >
                Ubicacion de entrega
              </Text>
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
                <MapViewDirections
                  origin={currentLocation}
                  destination={destination}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={4}
                />
              </MapView>
            </View>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        isVisible={isSettingModalVisible}
        onBackButtonPress={toggleSettingsModal}
        onBackdropPress={toggleSettingsModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Configuracion de cuenta</Text>

          <View style={{ width: "100%" }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su nombre"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setNewNade)}
                value={newName}
              />
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su apellido"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                onChangeText={(value) => handleText(value, setNewLastName)}
                value={newLastName}
              />
              <TextInput
                style={styles.inputTxt}
                placeholder="Ingrese su numero de telefono"
                autoCapitalize="none"
                placeholderTextColor={COLORS.input_text}
                keyboardType="numeric"
                onChangeText={(value) => handleText(value, setNewPhoneNumber)}
                value={newPhoneNumber}
              />
              <TouchableOpacity style={styles.button} onPress={updateUserData}>
                <Text style={styles.button_text}>Actualizar datos</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button} onPress={resetPassModal}>
              <Text style={styles.button_text}>Cambiar contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleChangeEmailModal}
            >
              <Text style={styles.button_text}>Cambiar correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={resetPassModalV} onBackdropPress={resetPassModal}>
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Cambiar contraseña</Text>
          {inalivEmail === true ? <Text>Ingrese un correo valido</Text> : ""}
          {userFound === true ? (
            <Text>
              No se encontro cuenta asociada al correo, verifique que su correo
              este bien escrito
            </Text>
          ) : (
            ""
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTxt}
              keyboardType="email-address"
              placeholder="Ingrese su correo"
              autoCapitalize="none"
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setEmail(text);
              }}
              value={email}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.button} onPress={resetPassModal}>
              <Text style={styles.button_text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={resetPass}>
              <Text style={styles.button_text}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={changeEmailVisible}
        onBackdropPress={toggleChangeEmailModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Cambiar correo</Text>
          {inalivEmail === true ? <Text>Ingrese un correo valido</Text> : ""}
          {userFound === true ? (
            <Text>
              No se encontro cuenta asociada al correo, verifique que su correo
              este bien escrito
            </Text>
          ) : (
            ""
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTxt}
              keyboardType="email-address"
              placeholder="Ingrese su nuevo correo"
              autoCapitalize="none"
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setNewEmail(text);
              }}
              value={newEmail}
            />
          </View>
          <View style={styles.inputContainer2}>
            <TextInput
              style={styles.inputTxt}
              autoCapitalize="none"
              placeholder="Ingrese su contraseña actual"
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              placeholderTextColor={COLORS.input_text}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
            <Pressable onPress={handlePasswordVisibility}>
              <Icon name={rightIcon} size={22} color="#232323" />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleChangeEmailModal}
            >
              <Text style={styles.button_text}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
              <Text style={styles.button_text}>Cambiar correo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  isNotPaid: {
    margin: 5,
    fontWeight: "bold",
    color: "red",
  },
  isPaid: {
    margin: 5,
    fontWeight: "bold",
    color: "green",
  },
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

  inputContainer2: {
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

  textError: {
    color: "red",
  },
  textValid: {
    color: "green",
  },
});
