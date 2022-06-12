-- seed department
INSERT INTO departments (name)
VALUES
    ("sales"),
    ("engineering"),
    ("management"),
    ("grunts");

-- seed role
INSERT INTO roles (title, salary, department_id)
VALUES
    ("Software Developer", 80000, 2),
    ("Junior Developer", 55000, 2),
    ("Senior Developer", 120000, 2),
    ("Project Manager", 75000, 3),
    ("Sales Associate", 100000, 1),
    ("Janitor", 40000, 4),
    ("CIO", 200000, 3),
    ("CEO", 400000, 3);

-- seed employees
INSERT INTO employees (first_name, last_name, role_id)
VALUES
    ("Gru", "No other name needed", 8);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Ben", "Machock", 7, 1),
    ("Elon", "Musk", 6, 1),
    ("Zach", "Stowell", 3, 2),
    ("Casey", "Miller", 2, 4);