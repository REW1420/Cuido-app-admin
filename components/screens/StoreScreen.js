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

import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import React, { useState, useCallback, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { SearchBar } from "@rneui/themed";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import productData from "../assets/data/productsData";
import Modal from "react-native-modal";
import { remove, sortBy } from "lodash";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
//firestore
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { database, storage } from "../utils/Firebase";

//get documents from firestore
function useProductData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const snapshot = onSnapshot(
      collection(database, "products"),
      (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setData(products);
      }
    );

    return () => snapshot();
  }, []);

  return data;
}

export default function StoreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef(null);

  const producData = useProductData();

  //console.log(cityData)

  //form hooks

  const [logoURL, setLogoURL] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  //form hooks for the update modal

  const [updateID, setUpdateID] = useState("");
  const [updateLogoURL, setUpdateLogoURL] = useState("");
  const [updateProductName, setUpdateProductName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateQuantity, setUpdateQuantity] = useState("");
  //hook for delete the image and upload again with the new name
  const [newImage, setNewImage] = useState("")

  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleUpdateModal = () => {
    setIsUpdateModalVisible(!isUpdateModalVisible);
  };

  //hook uri image
  const [imageURI, setImageURI] = useState(null);
  const [image, setImage] = useState(null);

  //image picker

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const source = { uri: result.assets[0].uri };
    console.log(source);
    setImage(source);
    setImageURI(result.assets[0].uri);
  };

  //image meta data
  const metadata = {
    contentType: "image/jpg",
  };

  const storageRef = ref(storage, "images/" + productName);
  //conver to blop and upload image and product data
  const uploadImage = async () => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const uploadTask = uploadBytes(storageRef, blob, metadata);

    getDownloadURL((await uploadTask).ref).then((downloadURL) => {
      setLogoURL(downloadURL);

      addDoc(collection(database, "products"), {
        key: lastID,
        productName: productName,
        logoURL: downloadURL,
        price: price,
        description: description,
        quantity: quantity,
      });
      console.log("product added");
      console.log("url", downloadURL);
    });
  };

  //conver to blop and update image and product data

  const storageRefUpdate = ref(storage, "images/" + updateProductName);

  const updateData = async () => {

    


    const response = await fetch(updateLogoURL);
    const blob = await response.blob();
    const updateTask = uploadBytes(storageRefUpdate, blob, metadata);
    getDownloadURL((await updateTask).ref).then((updateDownloadURL) => {
      updateDoc(doc(database, "products", updateID), {
        productName: updateProductName,
        logoURL: updateDownloadURL,
        price: updatePrice,
        description: updateDescription,
        quantity: updateQuantity,
      });
    });

    toggleUpdateModal();
    clearData();
    console.log("product update");
  };
  //firebase funtions
  //clear product data form
  const clearData = () => {
    setImageURI(null);
    setProductName("");
    setPrice("");
    setDescription("");
    setQuantity("");
    setImage(null);
    
  };
  //post async funtion

  async function postProductData() {
    uploadImage();

    console.log(logoURL);

    toggleUpdateModal();
    clearData();
  }

  //delete alert

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
                toggleModal();
              }}
            >
              <Icon
                name="add-circle-outline"
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
          {producData.map((item, i) => (
            <View key={i} style={styles.productsContainer}>
              <View>
                <Image
                  style={styles.image}
                  source={{ uri: item.data.logoURL }}
                />
                <View style={styles.contentProducts}>
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.data.productName}</Text>
                    <Text style={styles.price}>
                      ${item.data.price} Cantidad: {item.data.quantity}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() => {
                        Alert.alert(
                          "¿Esta seguro de eliminar el producto?",
                          "El documento se eliminara para siempre",
                          [
                            {
                              text: "Cancelar",
                              onPress: () => console.log("cancelado"),
                              styles: "cancel",
                            },
                            {
                              text: "Aceptar",
                              onPress: () => {
                                if (!item.id) {
                                  console.log("id nulo");
                                } else {
                                  deleteDoc(
                                    doc(database, "products", item.id)
                                  ).catch((error) => {
                                    console.log(
                                      "Hubo un error al borrar el documento",
                                      error
                                    );
                                  });
                                  console.log("delete succesfull");
                                  const databaseRef = ref(
                                    storage,
                                    "images/" + item.data.productName
                                  );
                                  deleteObject(databaseRef)
                                    .then(() => {
                                      console.log("image delete");
                                    })
                                    .catch((error) => {
                                      console.log(
                                        "hubo un error al borrar la imagen",
                                        error
                                      );
                                    });
                                }
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Icon name="trash-outline" size={25} color={"red"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() => {
                        console.log(image)
                        setUpdateLogoURL(item.data.logoURL)
                        setUpdateID(item.id);
                        setUpdateProductName(item.data.productName);
                        setUpdatePrice(item.data.price);
                        setUpdateDescription(item.data.description);
                        setUpdateQuantity(item.data.quantity);
                        setNewImage(item.data.productName)
                        toggleUpdateModal();
                        clearData();
                      }}
                    >
                      <Icon name="create-outline" size={25} color={"black"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={clearData}>
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
                  width: 300,
                }}
              >
                <Text style={{ textAlign: "center", color: "black" }}>
                  Agregar nuevo producto
                </Text>

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setProductName)}
                  value={productName}
                  placeholder="Nombre del medicamento"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setPrice)}
                  value={price}
                  placeholder="Precio"
                  keyboardType="numeric"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setQuantity)}
                  value={quantity}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setDescription)}
                  value={description}
                  placeholder="Descripcion"
                />

                <Button title="agregar imagen" onPress={pickImage} />
                {imageURI ? (
                  <Image
                    source={{ uri: imageURI }}
                    style={{ width: 200, height: 200 }}
                  />
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  postProductData();
                }}
              >
                <Text style={styles.textButtom}>Guardar datos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isUpdateModalVisible}
        onBackdropPress={toggleUpdateModal}
      >
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
                  width: 300,
                }}
              >
                <Text style={{ textAlign: "center", color: "black" }}>
                  Actualizar producto
                </Text>

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) =>
                    handleText(value, setUpdateProductName)
                  }
                  value={updateProductName}
                  placeholder="Nombre del medicamento"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setUpdatePrice)}
                  value={updatePrice}
                  placeholder="Precio"
                  keyboardType="numeric"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) => handleText(value, setQuantity)}
                  value={updateQuantity}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                />

                <TextInput
                  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                  onChangeText={(value) =>
                    handleText(value, setUpdateDescription)
                  }
                  value={updateDescription}
                  placeholder="Descripcion"
                />

                <Button title="Actualizar imagen" onPress={pickImage} />

                <Image
                  source={{ uri: updateLogoURL }}
                  style={{ width: 200, height: 200 }}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  
                  updateData();
                }}
              >
                <Text style={styles.textButtom}>Actualizar datos</Text>
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
  button: {
    alignItems: "center",
    backgroundColor: COLORS.primary_button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
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
});
