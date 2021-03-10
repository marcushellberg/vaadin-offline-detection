import "!style-loader!css-loader!./tasklist-view.css";
import { customElement, html, internalProperty } from "lit-element";
import { View } from "../../views/view";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";
import { CheckboxCheckedChanged } from "@vaadin/vaadin-checkbox";
import { getTodos, saveTodo } from "Frontend/generated/TodoEndpoint";
import TodoModel from "Frontend/generated/com/example/application/data/entity/TodoModel";
import { Binder, field } from "@vaadin/flow-frontend/form";
import {
  ConnectionStateStore,
  ConnectionState,
  ConnectionStateChangeListener,
} from "@vaadin/flow-frontend/ConnectionState";

@customElement("tasklist-view")
export class TasklistView extends View {
  @internalProperty()
  private todos: Todo[] = [];
  private binder = new Binder(this, TodoModel);

  async connectedCallback() {
    super.connectedCallback();
    this.todos = await getTodos();
  }

  render() {
    return html`
      <div class="form">
        <vaadin-text-field
          ...=${field(this.binder.model.task)}
        ></vaadin-text-field>
        <vaadin-button theme="primary" @click=${this.saveTodo}
          >Add</vaadin-button
        >
      </div>

      <div class="todos">
        ${this.todos.map(
          (todo) => html`
            <div class="todo">
              <vaadin-checkbox
                .checked=${todo.done}
                @checked-changed=${(e: CheckboxCheckedChanged) => {
                  todo.done = e.detail.value;
                  saveTodo(todo);
                }}
              ></vaadin-checkbox>
              <span class="task">${todo.task}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  async saveTodo() {
    const saved = await this.binder.submitTo(saveTodo);
    if (saved) {
      this.todos = [...this.todos, saved];
    }
  }
}
