DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS charts;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  first VARCHAR(200) NOT NULL,
  last VARCHAR(200) NOT NULL,
  email VARCHAR(300) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  profilepicurl VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  tableurl VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE charts(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  table_id INTEGER REFERENCES tables(id),
  x_axis VARCHAR(50) NOT NULL,
  y_axis VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  chart_id INTEGER REFERENCES charts(id),
  comment VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users  (first,last,email,password,profilepicurl) VALUES ('John','Doe','john@doe','john','https://s3.amazonaws.com/chart-loris/profile-default.jpg');
