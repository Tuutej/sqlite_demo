import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("coursedb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists shoppingList (id integer primary key not null, product string, amount string);"
        );
      },
      () => console.error("Error when creating DB"),
      updateList
    );
  }, []);

  const saveItem = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into shoppingList (product, amount) values (?, ?);",
          [product, amount]
        );
      },
      null,
      updateList
    );
  };

  const updateList = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("select * from shoppingList;", [], (_, { rows }) =>
          setShoppingList(rows._array)
        );
      },
      null,
      null
    );
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => tx.executeSql("delete from shoppingList where id = ?;", [id]),
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{ fontSize: 32 }}
        placeholder="Product"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={{ fontSize: 32 }}
        placeholder="Amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button style={{ fontSize: 32 }} onPress={saveItem} title="Save" />
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={{ fontSize: 32 }}>
              {item.product}, {item.amount}{" "}
              <Text
                style={{ fontSize: 32, color: "#0000ff" }}
                onPress={() => deleteItem(item.id)}
              >
                bought
              </Text>
            </Text>
          </View>
        )}
        data={shoppingList}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 200,
    fontSize: 32,
  },
});
