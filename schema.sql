DROP TABLE IF EXISTS location;

CREATE TABLE location(
id SERIAL PRIMARY KEY,
search_query VARCHAR(255),
formatted_query VARCHAR(255),
latitude DECIMAL(10, 7),
longitude DECIMAL(10, 7)
)