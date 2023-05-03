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
  Alert,
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
import Order from "../../utils/MVC/Model";
import global from "../../utils/global";
import moment from "moment/moment";

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

export default function CompleteOrders() {
  //use the data
  const oldOrderData = useNewOrderData();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderID, setOrderID] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [update_at, setUpdate_at] = useState("");

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
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
          {oldOrderData.map((item, i) => {
            if (item.delivered === 1 && item.paid === 1) {
              return (
                <ListItem
                  key={i}
                  bottomDivider
                  style={{
                    backgroundColor: COLORS.secondary_backgroud,
                    margin: 5,
                  }}
                  onPress={() => {
                    setTotalPrice(item.total_price);
                    setProducts(item.products);
                    setOrderID(item.id);
                    setUpdate_at(item.order_updated_at);
                    setCreated_at(item.created_at);

                    toggleModal();
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title style={styles.textValid}>
                      Entregado {item.order_id}
                    </ListItem.Title>
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
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      >
        <View style={styles.modalBackdround}>
          <Text style={styles.modalHeader}>Detalles del pedido</Text>

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
                Total pagado:
              </Text>
              <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                ${totalPrice}
              </Text>
            </View>
          </View>
          <View style={styles.carItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>Creado en:</Text>
              <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                {moment(created_at).format("DD/MM/YYYY hh:mm:ss A")}
              </Text>
            </View>
          </View>
          <View style={styles.carItems}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ margin: 5, fontWeight: "bold" }}>Pagado en:</Text>
              <Text style={{ margin: 5, fontWeight: "bold", color: "green" }}>
                {moment(update_at).format("DD/MM/YYYY hh:mm:ss A")}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.button_text}>Aceptar</Text>
          </TouchableOpacity>
        </View>
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
  modalBackdround: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
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
