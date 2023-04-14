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
import { remove, sortBy } from "lodash";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
//firestore
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../utils/Firebase";

export default function StoreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef(null);

  //form hooks

  const [logoURL, setLogoURL] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };

  const snapPoints = ["40%"];

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

    const source = { uri: result.uri };
    console.log(source);
    setImage(source);
    setImageURI(result.assets[0].uri);
  };

  const storageRef = ref(storage, "images/" + productName);
  //conver to blop
  const uploadImage = async () => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const uploadTask = uploadBytes(storageRef, blob, metadata);
    getDownloadURL((await uploadTask).ref).then((downloadURL) => {
      setLogoURL(downloadURL);
    });
    console.log('image upload')
  };

  //firebase funtions

  const addProductData = async () => {
    await addDoc(collection(database, "products"), {
      productName: productName,
      logoURL: logoURL,
      price: price,
      description: description,
      quantity: quantity,
    });
    console.log("product added");
  };

  const metadata = {
    contentType: "image/jpg",
  };

  //post async funtion

  async function postProductData(){
    await uploadImage();
    addProductData();

  }

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

          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/cuido-dabase.appspot.com/o/images%2Ftest4?alt=media&token=e8a36949-ecc9-40de-834b-15614039d24b",
            }}
            style={{ width: 200, height: 200 }}
          />
        </View>

        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ScrollView>

      <Modal isVisible={isModalVisible}>
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

              <TouchableOpacity style={styles.buttom} onPress={()=>{
                postProductData()
                
              }}>
                <Text style={styles.textButtom}>Guardar datos</Text>
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
