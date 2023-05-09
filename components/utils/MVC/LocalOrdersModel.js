import { useState } from "react";

export default class Order {
  // Método para crear un nuevo pedido
  async createOrder(orderData) {
    const response = await fetch("http://10.0.2.2:8000/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newOrder = await response.json();
    console.log(newOrder); // Agregar esta línea para imprimir la respuesta en la consola
    return newOrder;
  }

  // Método para obtener una lista de pedidos por user_id
  async getOrdersFiltered(user_id) {
    const response = await fetch(
      `http://10.0.2.2:8000/api/orders/noPaid/${user_id}`
    );
    const orders = await response.json();
    console.log("from model", orders);
    console.log("model");
    return orders;
  }

  async getPaidOrdersFiltered(user_id) {
    const response = await fetch(
      `http://10.0.2.2:8000/api/orders/paid/${user_id}`
    );
    const orders = await response.json();
    console.log("from model", orders);
    return orders;
  }
  async updateOrderStatus(id, status) {
    const response = await fetch(
      `http://10.0.2.2:8000/api/orders/status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      }
    );
    if (response.ok) {
      console.log(response.json);
    } else console.log(`HTTP error! status: ${response.status}`);
  }
}
