package com.example.application.data.endpoint;

import java.util.List;

import com.example.application.data.entity.Todo;
import com.example.application.data.service.TodoRepository;
import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

@Endpoint
@AnonymousAllowed
public class TodoEndpoint {
  private final TodoRepository repo;

  public TodoEndpoint(TodoRepository repo) {
    this.repo = repo;
  }

  public List<Todo> getTodos() {
    return repo.findAll();
  }

  public Todo saveTodo(Todo todo) {
    return repo.save(todo);
  }

}
