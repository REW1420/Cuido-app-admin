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
  Alert,
} from "react-native";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import React, { useState, useCallback, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { SearchBar } from "@rneui/themed";

import contactsTest from "../assets/data/contactsTest";
import { ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
//for firestore usage
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
//for storage usage
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

//firebase dependecies
import { database, storage } from "../utils/Firebase";

const { width, height } = Dimensions.get("screen");

//references name of the storage and firebase
const firestoreName = "contacts";
const storageName = "logo";

//get documents from firestore
function useContactData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const snapshot = onSnapshot(
      collection(database, firestoreName),
      (querySnapshot) => {
        const contacs = [];
        querySnapshot.forEach((doc) => {
          contacs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setData(contacs);
      }
    );

    return () => snapshot();
  }, []);

  return data;
}

export default function ContactsScreen({ navigation }) {
  const [bitem, setItem] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ["45%"];
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  //use of the data fetched
  const contactData = useContactData();

  //handle text form
  const handleText = (value, setState) => {
    setState(value);
  };

  //hanlde modal view
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //hanlde update modal view
  const toggleUpdateModal = () => {
    setUpdateModalVisible(!isUpdateModalVisible);
  };

  //form data hooks

  const [name, setName] = useState("");
  const [phoneNumer, setPhoneNumber] = useState("");
  const [schedule, setSchedule] = useState("");
  const [services, setServices] = useState("");
  const [logoURL, setLogoURL] = useState("");

  //form update data hooks

  const [updateName, setUpdateName] = useState("");
  const [updatePhoneNumer, setUpdatePhoneNumber] = useState("");
  const [updateSchedule, setUpdateSchedule] = useState("");
  const [updateServices, setUpdateServices] = useState("");
  const [updateID, setUpdateID] = useState("");

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
  //ref of the storage
  const storageRef = ref(storage, storageName + "/" + name);
  //image meta data
  const metadata = {
    contentType: "image/jpg",
  };
  //upload the image to the storage
  const uploadImage = async () => {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const uploadTask = uploadBytes(storageRef, blob, metadata);

    getDownloadURL((await uploadTask).ref).then((downloadURL) => {
      setLogoURL(downloadURL);

      addDoc(collection(database, firestoreName), {
        contactName: name,
        logoURL: downloadURL,
        phoneNumer: phoneNumer,
        schedule: schedule,
        services: services,
      });
      console.log("contact added");
      console.log("url", downloadURL);
    });
  };

  //clear the data
  const clearPostData = () => {
    setName("");
    setPhoneNumber("");
    setSchedule("");
    setServices("");
    setLogoURL("");
    setImageURI(null);
  };
  //post data
  async function postContactData() {
    uploadImage();
    toggleModal();
    clearPostData();
  }

  const clearData = () => {
    setImageURI(null);
    setName("");
    setPhoneNumber("");
    setSchedule("");
    setServices("");
    setImage(null);
  };

  //update the contact
  const updateData = async () => {
    updateDoc(doc(database, firestoreName, updateID), {
      
      contactName: updateName,
      //logoURL: downloadURL,
      phoneNumer:updatePhoneNumer,
      schedule: updateSchedule,
      services: updateServices,
    });

    toggleUpdateModal();
    clearData();
    console.log("product update");
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
          {contactData.map((item, i) => (
            <View key={i} style={styles.productsContainer}>
              <View>
                <Image
                  style={styles.image}
                  source={{ uri: item.data.logoURL }}
                />
                <View style={styles.contentProducts}>
                  <View style={styles.text}>
                    <Text style={styles.name}>{item.data.contactName}</Text>
                    <Text style={styles.price}>
                      Numero: {item.data.phoneNumer}
                    </Text>
                    <Text style={styles.price}>
                      Horario: {item.data.schedule}
                    </Text>
                    <Text style={styles.price}>
                      servicios : {item.data.services}
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
                                    doc(database, firestoreName, item.id)
                                  ).catch((error) => {
                                    console.log(
                                      "Hubo un error al borrar el documento",
                                      error
                                    );
                                  });
                                  console.log("delete succesfull");
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
                        console.log(image);
                        setUpdateID(item.id);
                        setUpdateName(item.data.contactName);
                        setUpdatePhoneNumber(item.data.phoneNumer);
                        setUpdateSchedule(item.data.schedule);
                        setUpdateServices(item.data.services);
                        toggleUpdateModal();
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
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          toggleModal();
        }}
        onBackButtonPress={toggleModal}
      >
        <View style={styles.modalBackdround}>
          <View style={{ flexDirection: "row", margin: 15 }}>
            <View style={styles.container}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalHeader}>Agregar nuevo contacto</Text>

                <TextInput
                  style={styles.inputText}
                  placeholder="Nombre"
                  onChangeText={(value) => handleText(value, setName)}
                  value={name}
                />

                <TextInput
                  style={styles.inputText}
                  placeholder="Numero de telefono"
                  keyboardType="numeric"
                  onChangeText={(value) => handleText(value, setPhoneNumber)}
                  value={phoneNumer}
                />

                <TextInput
                  style={styles.inputText}
                  placeholder="Horario"
                  onChangeText={(value) => handleText(value, setSchedule)}
                  value={schedule}
                />

                <TextInput
                  style={styles.inputText}
                  placeholder="Servicios"
                  onChangeText={(value) => handleText(value, setServices)}
                  value={services}
                />

                <TouchableOpacity
                  style={styles.buttonImagePicker}
                  onPress={() => {
                    pickImage();
                  }}
                >
                  <Text style={styles.textButtom}>Agregar logo</Text>
                </TouchableOpacity>
              </View>
              <View>
                {imageURI ? (
                  <Image
                    source={{ uri: imageURI }}
                    style={styles.imagePicked}
                  />
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  postContactData();
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
        onBackButtonPress={toggleUpdateModal}
      >
        <View style={styles.modalBackdround}>
          <View style={{ flexDirection: "row", margin: 15 }}>
            <View style={styles.container}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalHeader}>Actualizar contacto</Text>

                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) => handleText(value, setUpdateName)}
                  value={updateName}
                  placeholder="Nombre"
                />

                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) =>
                    handleText(value, setUpdatePhoneNumber)
                  }
                  value={updatePhoneNumer}
                  placeholder="Precio"
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) => handleText(value, setSchedule)}
                  value={updateSchedule}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.inputText}
                  onChangeText={(value) => handleText(value, setUpdateServices)}
                  value={updateServices}
                  placeholder="Descripcion"
                />

                <View style={styles.imagePcikedContainer}></View>
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
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  servicesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  Buttoncontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 16,
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
  details_logo_container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 50,
  },
  details_logo: {
    width: 40,
    height: 40,
  },
});
