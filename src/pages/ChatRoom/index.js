import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    FlatList
} from "react-native";
import auth from '@react-native-firebase/auth'
import firestore from "@react-native-firebase/firestore"
import { useNavigation, useIsFocused } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FabButton from "../../components/FabButton";
import ModalNewRoom from "../../components/ModalNewRoom";
import ChatList from "../../components/ChatList";

function ChatRoom() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [user, setUser] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upDateScreen, setUpDateScreen] = useState(false);

    useEffect(() => {
        const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
        console.log(hasUser);

        setUser(hasUser);

    }, [isFocused]);

    useEffect(() => {

        let isActive = true;

        function getChats() {
            firestore()
                .collection('MESSAGE_TREADS')
                .orderBy('lastMessage.createdAt', 'desc')
                .limit(10)
                .get()
                .then((snapshot) => {
                    const threads = snapshot.docs.map(documentSnapshot => {
                        return {
                            _id: documentSnapshot.id,
                            name: '',
                            lastMessage: { text: '' },
                            ...documentSnapshot.data()
                        }
                    })

                    if (isActive) {
                        setThreads(threads);
                        setLoading(false);
                    }
                })
        }

        getChats();

        return () => {
            isActive = false;
        }

    }, [isFocused, upDateScreen])

    function handleSair() {
        Alert.alert(
            "Atenção!",
            "Você tem certeza que deseja sair da conta?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Sair",
                    onPress: () => handleSignOut()
                }
            ]
        )
    }

    function handleSignOut() {
        auth()
            .signOut()
            .then(() => {
                setUser(null);
                navigation.navigate("SignIn")
            })
            .catch(() => {
                Alert.alert("Atenção", "Não possui, nenhum usuário!")
            })
    }

    function deleteRoom(ownerId, idRoom) {
        // tentando deletar se não for dono do grupo
        if (ownerId !== user?.uid) return;

        Alert.alert(
            "Atenção!",
            "Você tem certeza que deseja deletar esse grupo?",
            [
                {
                    text: "Cancelar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Deletar",
                    onPress: () => handleDeleteRoom(idRoom)
                }
            ]
        )

    }

    // Função para deletar o grupo selecionado. 
    async function handleDeleteRoom(idRoom) {
        await firestore()
            .collection('MESSAGE_TREADS')
            .doc(idRoom)
            .delete();

        setUpDateScreen(!upDateScreen);
    }

    if (loading) {
        return (
            <ActivityIndicator style={styles.loading} size="large" color="#2E54D4" />
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.headerRoom}>
                <View style={styles.headerRoomLeft}>
                    {/* Verificação de usuário */}
                    {
                        user && (
                            <TouchableOpacity onPress={handleSair}>
                                <MaterialIcons name="arrow-back" size={28} color="#FFF" />
                            </TouchableOpacity>
                        )
                    }
                    <Text style={styles.title}>Grupos</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <MaterialIcons name="search" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <ChatList
                        data={item}
                        deleteRoom={() => deleteRoom(item.owner, item._id)}
                        userStatus={user}
                    />
                )}
            />

            <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <ModalNewRoom
                    setVisible={() => setModalVisible(false)}
                    setUpDateScreen={() => setUpDateScreen(!upDateScreen)}
                />
            </Modal>

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    headerRoom: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: "#2E54D4",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        alignItems: "center"
    },
    headerRoomLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#FFF",
        paddingLeft: 10,
        paddingBottom: 1
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})

export default ChatRoom; 