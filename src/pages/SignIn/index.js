import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert } from "react-native";

import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native"

function SignIn() {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState(false);

    function handleLogin() {
        if (type) {
            //Cadastrar Novo Usuário
            if (name === '' || email === '' || password === '') {
                return Alert.alert("Atenção", "Cadastro inválido! Por favor, tente novamente.");
            }
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    user.user.updateProfile({
                        displayName: name
                    })
                        .then(() => {
                            navigation.goBack();
                        })
                })
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        Alert.alert("Atenção", "Email já em uso!");
                    }

                    if (error.code === 'auth/invalid-email') {
                        Alert.alert("Atenção", "Email inválido!");
                    }
                })
        } else {
            // Logar um usuário
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    navigation.goBack();
                })
                .catch((error) => {

                    if (error.code === 'auth/invalid-email') {
                        Alert.alert("Atenção", "Usuário inválido!");
                    }
                })

        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.logo}>ChatRooms</Text>
            <Text style={{ marginBottom: 20, fontWeight: "bold", color: "rgba(34,34,34,0.4)" }}>Ajude, colabore e faça networking!</Text>

            {
                type && (
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder="Nome"
                        placeholderTextColor="#99999b"
                    />
                )
            }

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="E-mail"
                placeholderTextColor="#99999b"
            />

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Senha"
                placeholderTextColor="#99999b"
                secureTextEntry={true}
            />

            <TouchableOpacity
                style={[styles.buttonLogin, { backgroundColor: type ? "#2E54D4" : "#2E54D4" }]}
                onPress={handleLogin}
            >
                <Text style={styles.buttonLoginText}>
                    {type ? "Cadastrar" : "Acessar"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setType(!type)}>
                <Text style={{ fontWeight: "bold", color: "rgba(34,34,34,0.4)" }}>
                    {type ? "Já possuo uma conta" : "Criar uma Conta"}
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFF"
    },
    logo: {
        marginTop: Platform.OS === 'android' ? 55 : 80,
        fontSize: 33,
        fontWeight: "bold",
        color: "#2E54D4",
        fontStyle: "italic"

    },
    input: {
        color: "#121212",
        backgroundColor: "#EBEBEB",
        width: "90%",
        borderRadius: 6,
        marginBottom: 10,
        paddingHorizontal: 8,
        height: 50,
    },
    buttonLogin: {
        width: "90%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderRadius: 6
    },
    buttonLoginText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18
    }
})

export default SignIn; 