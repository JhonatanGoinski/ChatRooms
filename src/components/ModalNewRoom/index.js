import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

function ModalNewRoom({ setVisible, setUpDateScreen }) {

    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON();

    function handleButtonCreate() {
        if (roomName === '') return;

        // Deixar epenas cada usuário criar 4 grupos
        firestore().collection('MESSAGE_TREADS')
            .get()
            .then((snapshot) => {
                let myThreads = 0;

                snapshot.docs.map(docItem => {
                    if (docItem.data().owner === user.uid) {
                        myThreads += 1;
                    }
                })

                if (myThreads >= 4) {
                    Alert.alert("Atenção", "Você já atingiu o limite de grupos por usuário.")
                } else {
                    createRoom();
                }
            })

    }

    // criar nova sala
    function createRoom() {
        firestore()
            .collection('MESSAGE_TREADS')
            .add({
                name: roomName,
                owner: user.uid,
                lastMessage: {
                    text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                }
            })
            .then((docRef) => {
                docRef.collection('MESSAGES').add({
                    text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    system: true,
                })
                    .then(() => {
                        setVisible();
                        setUpDateScreen();
                    })
            })
            .catch((err) => {
                console.log(err);
            })

    }

    return (
        <View style={styles.container}>

            <TouchableWithoutFeedback onPress={setVisible}>
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Novo Grupo</Text>
                <TextInput
                    value={roomName}
                    onChangeText={(text) => setRoomName(text)}
                    placeholder="Nome do grupo"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
                    <Text style={styles.buttonText}>Criar novo grupo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonVoltar} onPress={setVisible}>
                    <Text style={{ fontWeight: "bold", color: "rgba(34,34,34,0.4)" }}>Voltar</Text>
                </TouchableOpacity>
            </View>

        </View >
    );
}

export default ModalNewRoom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(34,34,34,0.4)"
    },
    modal: {
        flex: 1
    },
    modalContent: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 15,
    },
    modalTitle: {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 25,
        color: "rgba(34,34,34,0.4)",
        marginTop: 14
    },
    input: {
        borderRadius: 4,
        height: 45,
        backgroundColor: "#DDD",
        marginVertical: 20,
        fontSize: 16,
        paddingHorizontal: 10
    },
    buttonCreate: {
        borderRadius: 4,
        backgroundColor: "#2E54D4",
        height: 45,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF"
    },
    buttonVoltar: {
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
    }
})