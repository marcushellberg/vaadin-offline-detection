import "!style-loader!css-loader!./tasklist-view.css";
import { customElement, html, internalProperty } from "lit-element";
import { View } from "../../views/view";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import Todo from "Frontend/generated/com/example/application/data/entity/Todo";
import { CheckboxCheckedChanged } from "@vaadin/vaadin-checkbox";
import * as endpoint from "Frontend/generated/TodoEndpoint";
import TodoModel from "Frontend/generated/com/example/application/data/entity/TodoModel";
import { Binder, field } from "@vaadin/flow-frontend/form";
import {
  ConnectionStateStore,
  ConnectionState,
} from "@vaadin/flow-frontend/ConnectionState";
import { nothing } from "lit-html";

@customElement("tasklist-view")
export class TasklistView extends View {
  @internalProperty()
  private todos: Todo[] = [];
  @internalProperty()
  private pending: Todo[] = [];
  @internalProperty()
  private offline = false;

  private binder = new Binder(this, TodoModel);

  render() {
    return html`
      <div class="form">
        <vaadin-text-field
          ...=${field(this.binder.model.task)}
        ></vaadin-text-field>
        <vaadin-button theme="primary" @click=${this.submit}>Add</vaadin-button>
      </div>

      <div class="todos">
        ${this.allTodos.map(
          (todo) => html`
            <div class="todo">
              <vaadin-checkbox
                .checked=${todo.done}
                ?disabled=${this.offline}
                @checked-changed=${(e: CheckboxCheckedChanged) => {
                  if (todo.done !== e.detail.value) {
                    todo.done = e.detail.value;
                    this.saveTodo(todo);
                  }
                }}
              ></vaadin-checkbox>
              <span class="task">${todo.task}</span>
            </div>
          `
        )}
      </div>
    `;
  }

  get allTodos() {
    return this.todos.concat(this.pending);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.todos = await endpoint.getTodos();
    this.setupConnectionListener();
  }

  async submit() {
    await this.binder.submitTo(this.saveTodo);
    this.binder.clear();
  }

  async saveTodo(todo: Todo) {
    try {
      const saved = await endpoint.saveTodo(todo);
      if (saved) {
        if (todo.id) {
          this.todos = this.todos.map((t) => (t.id === saved.id ? saved : t));
        } else {
          this.todos = [...this.todos, saved];
        }
      }
    } catch (e) {
      console.log(e);
      if (this.offline) {
        this.pending = [...this.pending, todo];
      }
    }
  }

  syncPending() {
    this.pending.forEach((todo) => this.saveTodo(todo));
    this.pending = [];
  }

  setupConnectionListener() {
    const connectionState = (window as any).Vaadin
      .connectionState as ConnectionStateStore;
    connectionState.addStateChangeListener(
      (_: ConnectionState, current: ConnectionState) => {
        // Don't react to LOADING state
        if (this.offline && current === ConnectionState.CONNECTED) {
          this.offline = false;
          this.syncPending();
        } else if (current === ConnectionState.CONNECTION_LOST) {
          this.offline = true;
        }
      }
    );
  }
}
