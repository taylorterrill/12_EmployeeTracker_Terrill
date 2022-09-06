INSERT INTO department (name)
VALUES
('Human Resources'),
('Finance'),
('Compliance'),
('Marketing'),
('Sales'),
('IT'),
('Software Development');

INSERT INTO role (title, salary, department_id)
VALUES
('HR Generalist', 70000, 1),
('Bookkeeper', 55000, 2),
('Accountant', 100000, 2),
('Compliance Officer', 55000, 3),
('Social Media Specialist', 60000, 4),
('Sales Assistant', 55000, 5),
('Implementation Specialist', 65000, 6),
('Full Stack Developer', 80000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Alex', 'Trimble', 1, null),
('Sam', 'Haliday', 2, 1),
('Kevin', 'Baird', 3, null),
('Garret', 'Lee', 4, 2),
('Ben', 'Thompson', 5, null),
('Jacob', 'Berry', 6, 3),
('Mike', 'Eagle', 7, null),
('Laura', 'Hayden', 8, null);