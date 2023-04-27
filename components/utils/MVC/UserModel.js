export default class UserModel {
  //Metodo para crear usuarios nuevos

  async createUser(userData) {
    const response = await fetch(
      "https://cuido-middleware.000webhostapp.com/api/users",
      {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const newUser = await response.json();
    console.log(newUser);
    return newUser;
  }

  async getUserByRol(role) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/role/${role}`
    );
    const user = await response.json();
    console.log(user);
    return user;
  }

  async deleteUserByUID(user_id) {
    const response = await fetch(
      `https://cuido-middleware.000webhostapp.com/api/users/${user_id}`,
      {
        method: 'DELETE'
      }
    );
    const res = response.json
    console.log(res)
  }
}
