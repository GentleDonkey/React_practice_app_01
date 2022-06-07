import { createServer, Model } from "miragejs";
import qs from "qs";

export default function () {
  createServer({
    models: {
      todo: Model,
    },
    seeds(server) {
      for (let i = 0; i < 50; i++) {
        server.create("todo", {
          text: `todo_${i}`,
          key: i,
        });
      }
    },

    routes() {
      this.get("/api/todos", (schema, request) => {
        let params = qs.parse(request.queryParams);
        console.log(params);
        let todos = schema.todos.all();
        let todoRepsonse = todos.slice(0 - parseInt(params.page));
        return todoRepsonse;
      });
      //add item
      this.post("/api/todos", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.todos.create(attrs);
      });
      //update item
      this.patch("/api/todos/update", (schema, request) => {
        let params = qs.parse(request.queryParams);
        console.log(params);
        let attrs = JSON.parse(request.requestBody);
        return schema.db.todos.update(
          schema.db.todos.where({ key: params.key })[0].id,
          {
            text: attrs.text,
          }
        );
      });
      //delete item
      this.delete("/api/todos/delete", (schema, request) => {
        let params = qs.parse(request.queryParams);
        console.log(params);
        schema.db.todos.remove(
          schema.db.todos.where({ key: params.key })[0].id
        );
      });
    },
  });
}
