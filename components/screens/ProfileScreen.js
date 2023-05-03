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
import React from "react";
import Modal from "react-native-modal";
import COLORS from "../config/COLORS";
import SPACING from "../config/SPACING";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import UserModel from "../utils/MVC/UserModel";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "../utils/Firebase";

const userModel = new UserModel();

export default function ProfileScreen({ navigation }) {
  const [isModalCrudVisible, setIsModalCrudVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUserVisible, setIsModalUserVisible] = useState(false);
  //hooks for from
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState([]);
  const toggleCrudModal = () => {
    setIsModalCrudVisible(!isModalCrudVisible);
  };

  const handleText = (value, setState) => {
    setState(value);
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    clearData();
  };

  const toggleModalUser = () => {
    setIsModalUserVisible(!isModalUserVisible);
    clearData();
  };

  const handleNewUserCrud = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userData = {
          user_id: userCredential.user.uid,
          first_name: name,
          second_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: password,
          role: "crud",
        };

        userModel.createUser(userData);
        toggleCrudModal();
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  const clearData = () => {
    setEmail("");
    setName("");
    setLastName("");
    setPhoneNumber(0);
    setPassword("");
  };

  const handleNewUserDeliverer = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userData = {
          user_id: userCredential.user.uid,
          first_name: name,
          second_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: password,
          role: "deliverer",
        };

        userModel.createUser(userData);
        toggleModal();
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  };

  const handleGetUser = async (role) => {
    const users = await userModel.getUserByRol(role);
    setUserData(users);
    toggleModalUser();
  };

  const showDeleteAlet = (name, user_id) => {
    Alert.alert(
      `¿Estas seguro de eliminar a ${name}`,
      "Sus datos se eliminaran",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("cancelado"),
          styles: "cancel",
        },
        {
          text: "Aceptar",
          onPress: () => handleDeleteUser(user_id),
        },
      ]
    );
  };

  async function handleDeleteUser(user_id) {
    await userModel
      .deleteUserByUID(user_id)
      .then(() => {
        console.log("user delete from db");
        toggleModalUser();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.primary_backgroud }}>
        <View style={styles.secondary_backgroud}>
          <View style={styles.containerTopLeft}>
            <Image
              style={{ width: 300, height: 100 }}
              source={require("../assets/CuidoLogoTop.png")}
            />
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={()=>navigation.navigate("login")}
              style={{
                position: "absolute",
                right: 16,
                bottom: 110,

                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="log-out-outline" size={35} color={"red"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.primary_backgroud}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCrudModal}>
              <Text style={styles.button_text}>Crear usuario CRUD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.button_text}>Crear usuario Repartidor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleGetUser("crud")}
            >
              <Text style={styles.button_text}>Ver usuario CRUD</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleGetUser("deliverer")}
            >
              <Text style={styles.button_text}>Ver usuario Repartidor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalCrudVisible}
        onBackButtonPress={toggleCrudModal}
        onBackdropPress={toggleCrudModal}
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
              <Text style={styles.modalHeader}>Crear usuario CRUD</Text>

              <TextInput
                style={styles.inputText}
                placeholder="Nombre "
                onChangeText={(value) => handleText(value, setName)}
                value={name}
              />
              <TextInput
                style={styles.inputText}
                placeholder="Apellido "
                onChangeText={(value) => handleText(value, setLastName)}
                value={lastName}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Numero de telefono"
                keyboardType="numeric"
                onChangeText={(value) => handleText(value, setPhoneNumber)}
                value={phoneNumber}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Correo"
                onChangeText={(value) => handleText(value, setEmail)}
                value={email}
              />
              <TextInput
                style={styles.inputText}
                placeholder="Contraseña"
                onChangeText={(value) => handleText(value, setPassword)}
                value={password}
              />

              <TouchableOpacity
                style={styles.buttom}
                onPress={handleNewUserCrud}
              >
                <Text style={styles.button_text}>Crear usuario</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
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
              <Text style={styles.modalHeader}>Crear usuario Repartidor</Text>

              <TextInput
                style={styles.inputText}
                placeholder="Nombre "
                onChangeText={(value) => handleText(value, setName)}
                value={name}
              />
              <TextInput
                style={styles.inputText}
                placeholder="Apellido "
                onChangeText={(value) => handleText(value, setLastName)}
                value={lastName}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Numero de telefono"
                keyboardType="numeric"
                onChangeText={(value) => handleText(value, setPhoneNumber)}
                value={phoneNumber}
              />

              <TextInput
                style={styles.inputText}
                placeholder="Correo"
                onChangeText={(value) => handleText(value, setEmail)}
                value={email}
              />
              <TextInput
                style={styles.inputText}
                placeholder="Contraseña"
                onChangeText={(value) => handleText(value, setPassword)}
                value={password}
              />
              <TouchableOpacity
                style={styles.buttom}
                onPress={handleNewUserDeliverer}
              >
                <Text style={styles.button_text}>Crear usuario</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isModalUserVisible}
        onBackButtonPress={toggleModalUser}
        onBackdropPress={toggleModalUser}
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
              <Text style={styles.modalHeader}>Lista de usuarios CRUD</Text>
              {userData.map((item, i) => (
                <View style={styles.cardItems}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 20,
                    }}
                  >
                    <Text style={{ margin: 5 }}>{item.first_name}</Text>
                    <Text style={{ margin: 5 }}>{item.second_name}</Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "red",
                        width: 50,
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                      }}
                      onPress={() => showDeleteAlet(item.first_name, item.id)}
                    >
                      <Icon
                        name="trash-bin-outline"
                        color={"white"}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
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
  buttom: {
    alignItems: "center",
    backgroundColor: COLORS.primary_button,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  secondary_backgroud: {
    backgroundColor: COLORS.secondary_backgroud,
    width: "100%",
    height: 400,
  },
  primary_backgroud: {
    backgroundColor: COLORS.primary_backgroud,
    padding: SPACING * 2,
    borderRadius: SPACING * 3,
    bottom: SPACING * 2,
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
    top: 200,
    left: 20,
    flex: 1,
    width: 200,
    height: 200,
  },
  textError: {
    color: "red",
  },
  textValid: {
    color: "green",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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
    width: "40%",
  },
  button_text: {
    color: COLORS.primary_buton_text,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});
