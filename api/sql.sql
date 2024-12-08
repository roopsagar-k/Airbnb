-- Drop existing tables and sequences if they exist
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.places CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP SEQUENCE IF EXISTS public.bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.places_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;

-- Create the users table and its sequence
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'::regclass),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    PRIMARY KEY (id)
);

-- Create the places table and its sequence
CREATE SEQUENCE public.places_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.places (
    id integer NOT NULL DEFAULT nextval('public.places_id_seq'::regclass),
    title text,
    address text,
    photos text[],
    description text,
    perks text[],
    extrainfo text,
    checkin text,
    checkout text,
    maxguests integer,
    owner integer,
    price numeric(10,2),
    PRIMARY KEY (id),
    CONSTRAINT places_owner_fkey FOREIGN KEY (owner) REFERENCES public.users (id)
);

-- Create the bookings table and its sequence
CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.bookings (
    id integer NOT NULL DEFAULT nextval('public.bookings_id_seq'::regclass),
    place integer,
    check_in date,
    check_out date,
    number_of_guests integer,
    name text,
    contact_number bigint,
    price numeric(15,2),
    user_id integer NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT bookings_place_fkey FOREIGN KEY (place) REFERENCES public.places (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id)
);

-- Set sequence ownership
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER SEQUENCE public.places_id_seq OWNED BY public.places.id;
ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,        -- Unique identifier for each favorite entry
    user_id INTEGER NOT NULL,     -- References the `id` column in the `users` table
    place_id INTEGER NOT NULL,    -- References the `id` column in the `places` table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the favorite was added
    UNIQUE(user_id, place_id),    -- Ensures a user cannot favorite the same place more than once
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_place FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
);
