import { useState } from "react";

export default class Order {
  // Método para crear un nuevo pedido
  async createOrder(orderData) {
    const response = await fetch(
      "https://cuido-middleware.000webhostapp.com/api/orders",
      {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const newOrder = await response.json();
    console.log(newOrder); // Agregar esta línea para imprimir la respuesta en la consola
    return newOrder;
  }

  // Método para obtener una lista de pedidos por user_id
  async getOrdersFiltered(user_id) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/orders/code/${user_id}`
    );
    const orders = await response.json();
    console.log(orders);
    return orders;
  }
}