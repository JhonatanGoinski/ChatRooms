import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function ChatList({ data, deleteRoom, userStatus }) {

    const navigation = useNavigation();

    function openChat() {
        if (userStatus) {
            navigation.navigate("Messages", { thread: data })
        } else {
            navigation.navigate("SignIn")
        }
    }

    return (
        <TouchableOpacity onPress={openChat} onLongPress={() => deleteRoom && deleteRoom()}>
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.nameText} numberOfLines={1}>{data.name}</Text>
                    </View>
                    <Text style={styles.contentText} numberOfLines={1}>
                        {data.lastMessage.text}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ChatList;

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(237, 237, 245, 0.5)",
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8
    },
    content: {
        flexShrink: 1
    },
    header: {
        flexDirection: "row"
    },
    nameText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold"
    },
    contentText: {
        color: "#c1c1c4",
        marginTop: 2,
        fontSize: 15
    }
})