CREATE TABLE student (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  fname VARCHAR(50) NOT NULL, 
  lname VARCHAR(50) NOT NULL, 
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL, 
  year VARCHAR(50) NOT NULL, 
  department VARCHAR(50) NOT NULL
);

CREATE TABLE teacher (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  fname VARCHAR(50) NOT NULL, 
  lname VARCHAR(50) NOT NULL, 
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL, 
);

CREATE TABLE classroom (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  name VARCHAR(50) NOT NULL, 
  description VARCHAR(200), 
);

CREATE TABLE assignment (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  classroom_id INT NOT NULL,
  description VARCHAR(200), 
);

CREATE TABLE submissions (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  data BLOB NOT NULL,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
)

CREATE TABLE attachments (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  data BLOB NOT NULL,
  assignment_id INT NOT NULL,
)
