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
-- course is same as classroom
CREATE TABLE course (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  name VARCHAR(50) NOT NULL, 
  description VARCHAR(200),
  year VARCHAR(4) NOT NULL,
  department VARCHAR(10) NOT NULL,
  course_code VARCHAR(10) NOT NULL UNIQUE 
);

-- used to check what courses is a student registered to 
CREATE TABLE records(
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id)
);

CREATE TABLE assignment (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(50) NOT NULL, 
  description VARCHAR(200), 
  due_date DATE,
  max_marks INT(3),
  is_study_material BOOLEAN NOT NULL
);

CREATE TABLE submissions (
  data BLOB NOT NULL,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  marks_obtained INT(3) NOT NULL,
  PRIMARY KEY (assignment_id, student_id)
)

CREATE TABLE attachments (
  _id INT PRIMARY KEY AUTO_INCREMENT,
  data BLOB NOT NULL,
  assignment_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(200),
)

**************STORED PROCEDURE******************



First create a table with cols
ass_id     AVG    MAX    MIN    Absentees 

****EXXAMPLE****

delimiter //
CREATE PROCEDURE display_book()
                      -> BEGIN
                      -> SELECT * FROM book;
                      -> END //
call display_book(); //

***** sendReport*******

DELIMITER //
DROP PROCEDURE IF EXISTS send_report//
CREATE PROCEDURE send_report(IN ass_id integer)
  BEGIN
    SELECT AVG(marks), MAX(marks), MIN(marks), COUNT(marks) FROM submissions WHERE assignment_id=ass_id;
  END//
DELIMITER ;
