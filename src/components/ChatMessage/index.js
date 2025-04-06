import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

function ChatMessage({ data }) {

    const user = auth().currentUser.toJSON();

    const isMyMessage = useMemo(() => {
        return data?.user?._id === user.uid
    }, [data])

    return (
        <View style={styles.container}>
            <View style={[
                styles.messagesBox,
                {
                    backgroundColor: isMyMessage ? '#DCF8C5' : '#FFF',
                    marginLerf: isMyMessage ? 50 : 0,
                    marginRight: isMyMessage ? 0 : 50
                }
            ]}>

                {
                    !isMyMessage ? (
                        // Se a mensagem não for sua, exibe o nome do usuário ou o nome do app
                        data?.user?.displayName ? (
                            <Text style={styles.name}>{data.user.displayName}</Text> // Nome do usuário
                        ) : (
                            <Text style={[styles.name, { color: "#51C880" }]}>ChatRoom</Text> // Nome do aplicativo
                        )
                    ) : null
                }

                <Text style={styles.message}>{data.text}</Text>

            </View>
        </View>
    )
}

export default ChatMessage;


const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5
    },
    messagesBox: {
        borderRadius: 5,
        padding: 10,
    },
    name: {
        color: '#2E54D4',
        fontWeight: "bold",
        marginBottom: 5,
    }
});